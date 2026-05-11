"""
models/llm_model.py
Google Gemini API — Conversational AI Caregiver
Replaces Groq + Llama3.

Why Gemini:
  - Uses your Google Cloud credits
  - Gemini 1.5 Flash: very fast (~500ms), free tier available
  - Better conversational quality for AAC use case
  - No GPU needed, fully cloud-based

Setup:
  pip install google-generativeai
  Set GEMINI_API_KEY in your .env file

Conversation flow:
  1. Profile activated → greet child by name (time-based)
  2. Child communicates (emotion + gesture + symbols + speech)
  3. Gemini understands intent → responds warmly as AI caregiver
  4. Conversation continues naturally
"""

import os
import asyncio
import time
from datetime import datetime
from typing import Optional

import google.generativeai as genai

from utils.config import config
from utils.state  import app_state


# ── Gemini client (initialised once) ─────────────────────────
_model = None

def _log(message: str):
    """Log safely on Windows consoles that may not support emoji output."""
    try:
        print(message)
    except UnicodeEncodeError:
        print(message.encode("ascii", errors="backslashreplace").decode("ascii"))

def get_model():
    """
    Initialise Gemini model once and reuse.
    Uses gemini-1.5-flash which is fast and uses your Cloud credits.
    """
    global _model
    if _model is None:
        key = config.GEMINI_API_KEY
        if not key or key.startswith("AIza_your"):
            raise ValueError(
                "GEMINI_API_KEY not set in .env file.\n"
                "Get your free key at: https://aistudio.google.com/app/apikey\n"
                "Or from Google Cloud Console → APIs & Services → Credentials"
            )
        genai.configure(api_key=key)
        _model = genai.GenerativeModel(
            model_name=config.GEMINI_MODEL,
            system_instruction=SYSTEM_PROMPT,
            generation_config=genai.GenerationConfig(
                temperature     = 0.7,
                top_p           = 0.9,
                max_output_tokens = 150,
            ),
            safety_settings=[
                {"category": "HARM_CATEGORY_HARASSMENT",        "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH",       "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            ]
        )
        _log(f"[LLM] Gemini model initialised: {config.GEMINI_MODEL} ✓")
    return _model


# ── System prompt — AI acts as warm caregiver ────────────────
SYSTEM_PROMPT = """You are VoiceMe's AI caregiver for a non-verbal autistic child.

Your job is to turn multimodal signals into one short, warm sentence the caregiver can speak aloud.

Rules:
1. Start with one friendly, relevant emoji.
2. Use fewer than 25 words.
3. Use simple, concrete, sensory-friendly language.
4. Validate distress before suggesting an action.
5. If signals conflict, combine them kindly. Example: crying plus toy means the toy may be wanted for comfort.
6. Prefer the child's selected symbols or typed speech over weaker camera guesses.
7. Offer one practical help action or one simple choice.
8. Do not mention sensors, confidence, probabilities, prompts, markdown, or diagnosis labels.
9. Do not use markdown formatting.

Tone examples:
"🤗 I see this feels hard. I am here with you. Do you want the toy?"
"🥤 You want water. I can help you get your cup now."
"🧸 You look upset and want comfort. Let's hold your toy together."
"👍 You said yes. Great, we can do that now."
"""


# ── Time-based greeting ───────────────────────────────────────
def get_greeting() -> str:
    """Generate a warm personalised greeting based on time of day."""
    hour = datetime.now().hour
    name = app_state.active_child_name or "there"

    if   5  <= hour < 12: period, emoji = "Good morning",   "🌅"
    elif 12 <= hour < 17: period, emoji = "Good afternoon", "☀️"
    elif 17 <= hour < 21: period, emoji = "Good evening",   "🌇"
    else:                 period, emoji = "Hello",           "🌙"

    return f"{emoji} {period}, {name}! How may I help you today?"


# ── Build context string from fused signals ───────────────────
def build_context(fused: dict) -> str:
    """Convert fused signal dictionary to a clear, prioritized context for Gemini."""
    parts = []
    priority = []

    e = fused.get("emotion", {})
    g = fused.get("gesture", {})
    p = fused.get("pose",    {})
    syms   = fused.get("symbols", [])
    speech = fused.get("speech",  "")

    emotion_label = e.get("display_label") or e.get("label") or "neutral"
    emotion_confidence = float(e.get("confidence", 0) or 0)
    gesture_name = g.get("name", "none")
    gesture_meaning = g.get("meaning", "")
    pose_name = p.get("name", "normal")
    pose_meaning = p.get("meaning", "")

    if speech:
        priority.append("Child typed/spoke text is the strongest intentional signal.")
    if syms:
        priority.append("Selected symbols are intentional and should strongly guide the response.")
    if emotion_confidence > 0.35:
        priority.append("Emotion should shape the tone, especially if it suggests distress.")

    if emotion_confidence > 0.35:
        parts.append(
            f"Emotion: {emotion_label} "
            f"({int(emotion_confidence * 100)}% confidence)"
        )
    if gesture_name not in ("none", "No hand detected"):
        parts.append(f"Gesture meaning: {gesture_meaning or gesture_name}")
    if pose_name not in ("normal", "unknown"):
        parts.append(f"Body posture meaning: {pose_meaning or pose_name}")
    if syms:
        parts.append(f"Selected symbols: {', '.join(syms)}")
    if speech:
        parts.append(f'Child typed or spoke: "{speech}"')

    if not parts:
        return (
            "No clear signal detected yet.\n"
            "Respond with calm presence and one simple invitation to communicate."
        )

    sections = ["Current child communication context:"]
    if priority:
        sections.append("Priority guidance:\n" + "\n".join(f"- {pt}" for pt in priority))
    sections.append("Signals:\n" + "\n".join(f"- {pt}" for pt in parts))
    sections.append(
        "Caregiver response goal: validate feelings when needed, then offer one simple help action or choice."
    )
    return "\n\n".join(sections)


# ── Build conversation history for Gemini ────────────────────
def build_history(conversation_history: list) -> list:
    """
    Convert conversation history to Gemini format.
    Gemini expects alternating user/model roles.
    """
    gemini_history = []
    for turn in conversation_history[-6:]:   # last 6 turns only
        role = "model" if turn["role"] == "assistant" else "user"
        gemini_history.append({
            "role":  role,
            "parts": [turn["content"]]
        })
    return gemini_history


# ── Main response generation ──────────────────────────────────
async def generate_response(
    fused:                dict,
    conversation_history: list,
    is_greeting:          bool = False,
) -> str:
    """
    Generate a caregiver response using Google Gemini.

    Args:
        fused:                output from behavior_interpreter.fuse()
        conversation_history: list of {"role": "user/assistant", "content": "..."}
        is_greeting:          if True, return time-based greeting only

    Returns:
        str: warm caregiver response sentence
    """

    # ── Greeting mode ─────────────────────────────────────────
    if is_greeting:
        greeting = get_greeting()
        app_state.last_sentence = greeting
        _log(f"[LLM] Greeting generated: {greeting}")
        return greeting

    # ── Build prompt for Gemini ───────────────────────────────
    model   = get_model()
    context = build_context(fused)

    # Full prompt is now just the contextual instructions
    full_prompt = (
        f"{context}\n\n"
        f"Based on the child's signals above, provide a warm, simple caregiver response under 25 words starting with an emoji."
    )

    # ── Call Gemini API ───────────────────────────────────────
    try:
        t0 = time.time()

        # Build chat with history for multi-turn context
        history = build_history(conversation_history)

        if history:
            # Multi-turn conversation — use chat session
            chat     = model.start_chat(history=history)
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: chat.send_message(full_prompt)
            )
        else:
            # First turn — generate directly
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: model.generate_content(full_prompt)
            )

        elapsed  = round((time.time() - t0) * 1000)
        sentence = response.text.strip()

        # Clean up any formatting that Gemini might add despite the system instruction.
        sentence = sentence.replace("**", "").replace("*", "").replace("\n", " ").strip()
        if len(sentence.split()) > 25:
            sentence = " ".join(sentence.split()[:25]).rstrip(" ,;:")

        _log(f"[LLM] Gemini responded in {elapsed}ms: {sentence}")
        app_state.last_sentence = sentence
        return sentence

    except Exception as e:
        error_msg = str(e).lower()
        _log(f"[LLM] Gemini error: {e}")

        if (
            "api_key" in error_msg
            or "auth" in error_msg
            or "permission" in error_msg
            or "api_key_service_blocked" in error_msg
            or "generativelanguage.googleapis.com" in error_msg
        ):
            return "API key issue: Gemini Generative Language API is blocked for this key or project."
        if "quota" in error_msg or "rate" in error_msg or "limit" in error_msg:
            return "⚠️ API quota reached. Please check your Google Cloud billing settings."
        if "network" in error_msg or "connect" in error_msg:
            return "⚠️ Network error. Please check your internet connection."

        return "🤗 I am here with you. Please try communicating again."


# ── Sync wrapper for non-async contexts ──────────────────────
def generate_response_sync(
    fused:    dict,
    history:  list,
    is_greeting: bool = False
) -> str:
    """Synchronous version for use outside async contexts."""
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(
            generate_response(fused, history, is_greeting)
        )
    finally:
        loop.close()
