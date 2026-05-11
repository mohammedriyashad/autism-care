import React from 'react'
import { useStore }  from '../utils/store'
import { useSpeech } from '../hooks/useSpeech'
import { Card, CardHeader, CardBody, FusionRow, StatCard } from './ui'

function getComfortState(emotion) {
  const label = (emotion.label || 'neutral').toLowerCase()
  const confidence = Number(emotion.confidence || 0)
  if (confidence < 0.3 || label === 'neutral') {
    return {
      tone: 'Calm / observing',
      icon: '🌿',
      detail: 'Ready when the child is ready.',
      color: 'var(--cyan)',
    }
  }
  if (['happy', 'surprise'].includes(label)) {
    return {
      tone: 'Engaged',
      icon: emotion.emoji || '😊',
      detail: 'Follow the child’s interest and offer simple choices.',
      color: 'var(--green)',
    }
  }
  return {
    tone: 'May need support',
    icon: emotion.emoji || '🤗',
    detail: 'Use a calm voice, reduce demands, and offer one clear option.',
    color: 'var(--amber)',
  }
}

export function CareCompanionPanel() {
  const { activeProfile, emotion, symbols, speechText } = useStore()
  const comfort = getComfortState(emotion)
  return (
    <Card>
      <CardHeader icon="💙" title="Care Companion"/>
      <CardBody style={{ padding:14 }}>
        <div style={{
          display:'flex', gap:12, alignItems:'center',
          background:'linear-gradient(135deg,rgba(79,140,255,.16),rgba(56,217,197,.10))',
          border:'1px solid var(--border)', borderRadius:18, padding:14,
        }}>
          <div style={{
            width:54, height:54, borderRadius:18, display:'grid', placeItems:'center',
            fontSize:26, background:'rgba(255,255,255,.11)', color:comfort.color,
          }}>{comfort.icon}</div>
          <div>
            <div style={{ fontSize:16, fontWeight:900, color:'var(--text)' }}>
              {activeProfile ? `${activeProfile.name}'s support space` : 'Support space ready'}
            </div>
            <div style={{ color:comfort.color, fontWeight:900, fontSize:12, marginTop:2 }}>
              {comfort.tone}
            </div>
          </div>
        </div>
        <p style={{ color:'var(--muted)', fontSize:12, lineHeight:1.6, margin:'12px 0 0' }}>
          {comfort.detail}
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12 }}>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:10 }}>
            <div style={{ fontSize:18, fontWeight:900, color:'var(--cyan)' }}>{symbols.length}</div>
            <div style={{ fontSize:10, color:'var(--muted)', fontWeight:800, textTransform:'uppercase' }}>Symbols chosen</div>
          </div>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:10 }}>
            <div style={{ fontSize:18, fontWeight:900, color:'var(--violet)' }}>{speechText ? 'Yes' : 'No'}</div>
            <div style={{ fontSize:10, color:'var(--muted)', fontWeight:800, textTransform:'uppercase' }}>Speech note</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export function SupportSuggestionsPanel() {
  const { emotion, gesture, symbols, speechText } = useStore()
  const symbolText = symbols.map(s => s.label.toLowerCase()).join(' ')
  const possibleNeed =
    speechText || symbolText ||
    (gesture.name !== 'none' && gesture.name !== 'No hand detected' ? gesture.meaning : '') ||
    'No clear request yet'

  const suggestions = [
    emotion.confidence > 0.3 && emotion.label !== 'neutral'
      ? 'Validate the feeling first: “I see this feels hard.”'
      : 'Give time and wait quietly for the next signal.',
    symbolText.includes('pain')
      ? 'Check comfort gently and ask where it hurts.'
      : 'Offer one simple choice instead of many options.',
    symbolText.includes('drink') || symbolText.includes('water')
      ? 'Offer water or the child’s preferred cup.'
      : 'Reduce noise, bright light, or busy movement if needed.',
    'Use short language and show the matching symbol.',
  ].filter(Boolean)

  return (
    <Card>
      <CardHeader icon="🫶" title="Parent Support Suggestions"/>
      <CardBody style={{ padding:14 }}>
        <div style={{
          background:'rgba(56,217,197,.10)', border:'1px solid rgba(56,217,197,.25)',
          borderRadius:16, padding:12, marginBottom:11,
        }}>
          <div style={{ fontSize:10, color:'var(--cyan)', textTransform:'uppercase', letterSpacing:1.1, fontWeight:900 }}>
            Possible communication
          </div>
          <div style={{ fontSize:14, color:'var(--text)', fontWeight:900, marginTop:4 }}>
            {possibleNeed}
          </div>
        </div>
        <div style={{ display:'grid', gap:8 }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{
              display:'flex', gap:8, alignItems:'flex-start',
              background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:14, padding:10, color:'var(--text2)', fontSize:12, lineHeight:1.45,
            }}>
              <span style={{ color:'var(--cyan)', fontWeight:900 }}>✓</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export function RoutinePanel() {
  const steps = ['Check in', 'Choose symbol', 'Care response', 'Short break']
  return (
    <Card>
      <CardHeader icon="🧭" title="Gentle Routine"/>
      <CardBody style={{ padding:14 }}>
        <div style={{ display:'grid', gap:9 }}>
          {steps.map((step, i) => (
            <div key={step} style={{ display:'grid', gridTemplateColumns:'30px 1fr', gap:10, alignItems:'center' }}>
              <div style={{
                width:30, height:30, borderRadius:'50%', display:'grid', placeItems:'center',
                background:i === 0 ? 'linear-gradient(135deg,var(--primary),var(--cyan))' : 'var(--surface)',
                border:'1px solid var(--border)', color:i === 0 ? 'white' : 'var(--muted)', fontWeight:900,
              }}>{i + 1}</div>
              <div style={{ color:i === 0 ? 'var(--text)' : 'var(--muted)', fontWeight:800 }}>{step}</div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

// ── Mic ──────────────────────────────────────────────────────
export function MicPanel() {
  const { speechText } = useStore()
  const { listening, interim, toggle } = useSpeech()
  return (
    <Card style={{ flexShrink:0 }}>
      <CardHeader icon="🎤" title="Voice or Typed Note"/>
      <CardBody style={{ textAlign:'center', padding:10 }}>
        <div onClick={toggle} style={{
          width:52, height:52, borderRadius:'50%',
          border:`2px solid ${listening ? 'var(--red)' : 'var(--border2)'}`,
          cursor:'pointer', display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:22,
          background: listening ? 'rgba(255,90,90,.1)' : 'var(--surface)',
          transition:'all .3s', margin:'0 auto 7px',
          animation: listening ? 'micPulse 1s infinite' : 'none',
        }}>🎤</div>
        <div style={{ fontSize:10, color:'var(--muted)', marginBottom:7 }}>
          {listening ? 'Listening…' : 'Tap to add speech'}
        </div>
        <div style={{
          background:'var(--surface)', border:'1px solid var(--border)',
          borderRadius:7, padding:'7px 9px', fontSize:11, color:'var(--muted)',
          minHeight:32, textAlign:'left', lineHeight:1.5, fontStyle:'italic',
        }}>
          {speechText
            ? <><span style={{ color:'var(--text)', fontStyle:'normal' }}>{speechText}</span>
                {interim && <span style={{ color:'var(--muted)' }}> {interim}</span>}</>
            : interim || 'Words or typed notes appear here…'
          }
        </div>
      </CardBody>
    </Card>
  )
}

// ── Communication Signals ────────────────────────────────────
export function FusionPanel() {
  const { emotion, gesture, pose, symbols, speechText } = useStore()
  const symStr  = symbols.map(s=>s.label).join(', ') || null
  const gesHas  = gesture.name !== 'none' && gesture.name !== 'No hand detected'
  const poseHas = pose.name !== 'normal' && pose.name !== 'unknown'
  const emoHas  = emotion.confidence > 0.3

  const intent = [
    emoHas  ? `${emotion.emoji} ${emotion.display_label}` : null,
    gesHas  ? `${gesture.icon} ${gesture.meaning}`        : null,
    poseHas ? `${pose.icon} ${pose.meaning}`              : null,
    symStr  ? symStr                                       : null,
    speechText ? `"${speechText}"`                        : null,
  ].filter(Boolean).join(' | ')

  return (
    <Card style={{ flexShrink:0 }}>
      <CardHeader icon="✨" title="Communication Signals"/>
      <CardBody style={{ padding:9 }}>
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)',
          borderRadius:10, padding:9 }}>
          <FusionRow label="Feeling" active={emoHas}
            value={emoHas ? `${emotion.emoji} ${emotion.display_label} (${emotion.confidence_pct}%)` : null}/>
          <FusionRow label="Gesture" active={gesHas}
            value={gesHas ? `${gesture.icon} ${gesture.meaning}` : null}/>
          <FusionRow label="Pose"    active={poseHas}
            value={poseHas ? `${pose.icon} ${pose.meaning}` : null}/>
          <FusionRow label="Symbols" active={!!symStr} value={symStr}/>
          <FusionRow label="Speech"  active={!!speechText} value={speechText}/>
          <div style={{ display:'flex', alignItems:'flex-start', gap:7, padding:'4px 0', fontSize:11 }}>
            <div style={{ color:'var(--cyan)', width:64, fontSize:9, flexShrink:0,
              paddingTop:2, letterSpacing:'.5px', textTransform:'uppercase', fontWeight:700 }}>Support cue</div>
            <div style={{ color:'var(--cyan)', fontWeight:600, flex:1,
              wordBreak:'break-word', fontSize:10 }}>
              {intent || 'Ready when the child is ready…'}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

// ── Stats ────────────────────────────────────────────────────
export function StatsPanel() {
  const { stats } = useStore()
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, flexShrink:0 }}>
      <StatCard value={stats.symbols}       label="Symbols"  color="var(--cyan)"/>
      <StatCard value={stats.messages}      label="Responses" color="var(--violet)"/>
      <StatCard value={`${stats.latency}ms`} label="Signal speed" color="var(--green)"/>
      <StatCard value={stats.alerts}        label="Support flags"   color="var(--amber)"/>
    </div>
  )
}

// ── History ──────────────────────────────────────────────────
export function HistoryPanel() {
  const { history } = useStore()
  const speak = (txt) => {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel()
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(txt))
  }
  return (
    <Card style={{ flex:1, minHeight:0 }}>
      <CardHeader icon="📋" title="Today’s Notes"/>
      <CardBody style={{ padding:7, overflowY:'auto' }}>
        {history.length === 0
          ? <div style={{ textAlign:'center', padding:18, color:'var(--muted)', fontSize:11 }}>
              No notes yet. The dashboard is ready when the child is ready.
            </div>
          : history.map((h,i) => (
            <div key={i} onClick={() => speak(h.sentence)} style={{
              background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:8, padding:'7px 10px', cursor:'pointer',
              transition:'all .2s', marginBottom:5,
            }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--violet)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
              <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'var(--mono)' }}>
                {h.time} · {h.emoji} {h.gesture}
              </div>
              <div style={{ fontSize:11, fontWeight:600, marginTop:2, lineHeight:1.4 }}>
                {h.sentence}
              </div>
              {h.symbols?.length > 0 && (
                <div style={{ display:'flex', gap:3, marginTop:3 }}>
                  {h.symbols.map((s,j) => (
                    <span key={j} style={{ fontSize:8, padding:'1px 5px', borderRadius:7,
                      background:'rgba(108,99,255,.15)', color:'#C4B5FD' }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        }
      </CardBody>
    </Card>
  )
}
