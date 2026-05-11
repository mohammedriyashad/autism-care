// src/App.jsx — VoiceMe AAC v3 — Warm Light Theme + Gemini+ 2-Way Conversation
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useStore }  from './utils/store'
import Dashboard     from './pages/Dashboard'
import Profiles      from './pages/Profiles'
import Alerts        from './pages/Alerts'
import Reports       from './pages/Reports'
import Symbols       from './pages/Symbols'
import LandingPage   from './pages/LandingPage'
import { StatusPill } from './components/ui'
import axios from 'axios'

const WS_URL = 'ws://localhost:8000/api/camera/ws'

const TABS = [
  { id:'dashboard', label:'🏠 Home',     emoji:'🏠' },
  { id:'profiles',  label:'👤 Profiles', emoji:'👤' },
  { id:'alerts',    label:'🔔 Alerts',   emoji:'🔔' },
  { id:'reports',   label:'📄 Reports',  emoji:'📄' },
  { id:'symbols',   label:'🖼️ Symbols',  emoji:'🖼️' },
]
const PAGES = { dashboard:Dashboard, profiles:Profiles,
                alerts:Alerts, reports:Reports, symbols:Symbols }

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('voiceme_auth') === 'true')
  const [showDashboard, setShowDashboard] = useState(() => localStorage.getItem('voiceme_auth') === 'true')
  const wsRef         = useRef(null)
  const timerRef      = useRef(null)

  const {
    setEmotion, setGesture, setPose, setWsConnected,
    addAlert, incStat, setLatency,
    wsConnected, emotion, gesture, pose, alertCount,
    activeProfile,
  } = useStore()

  // ── Stable send function ──────────────────────────────────
  const send = useCallback((payload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify(payload))
  }, [])
  window._aacSend = send

  // ── WebSocket connect ─────────────────────────────────────
  const connect = useCallback(() => {
    try {
      const ws     = new WebSocket(WS_URL)
      wsRef.current = ws
      ws.onopen  = () => { setWsConnected(true); console.log('[WS] Connected ✓') }
      ws.onclose = () => {
        setWsConnected(false)
        timerRef.current = setTimeout(connect, 3000)
      }
      ws.onerror = () => setWsConnected(false)
      ws.onmessage = (e) => {
        const t0 = performance.now()
        const d  = JSON.parse(e.data)
        if (d.emotion) setEmotion(d.emotion)
        if (d.gesture) setGesture(d.gesture)
        if (d.pose)    setPose(d.pose)
        if (d.alert)   { addAlert(d.alert); incStat('alerts') }
        setLatency(Math.round(performance.now() - t0))
      }
    } catch { timerRef.current = setTimeout(connect, 3000) }
  }, [])

  useEffect(() => {
    if (!showDashboard) return undefined
    connect()
    return () => { clearTimeout(timerRef.current); wsRef.current?.close() }
  }, [showDashboard, connect])

  const Page = PAGES[tab]

  const handleAuthSuccess = () => {
    localStorage.setItem('voiceme_auth', 'true')
    setIsAuthenticated(true)
    setShowDashboard(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('voiceme_auth')
    setIsAuthenticated(false)
    setShowDashboard(false)
    setTab('dashboard')
    clearTimeout(timerRef.current)
    wsRef.current?.close()
  }

  if (!showDashboard) {
    return (
      <LandingPage
        isAuthenticated={isAuthenticated}
        onAuthSuccess={handleAuthSuccess}
        onDashboard={() => setShowDashboard(true)}
      />
    )
  }

  return (
    <div className="dashboard-shell">

      {/* ── TOP BAR ── */}
      <header className="dashboard-topbar">

        {/* Logo */}
        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">🗣️</div>
          <div>
            <div className="dashboard-logo-title">
              Voice<span style={{ color: 'var(--primary)' }}>Me</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)',
                marginLeft: 6 }}>AAC</span>
            </div>
            <div className="dashboard-logo-sub">Supportive AAC dashboard</div>
          </div>
        </div>

        {/* Active profile badge */}
        {activeProfile && (
          <div className="dashboard-profile-badge">
            <span style={{ fontSize: 16 }}>🧒</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 900 }}>
                {activeProfile.name}
              </div>
              <div style={{ fontSize: 9, color: 'var(--muted)' }}>Active session</div>
            </div>
          </div>
        )}

        {/* Navigation tabs */}
        <div className="dashboard-tabs">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`dashboard-tab ${tab === t.id ? 'active' : ''}`}>
              {t.label}
              {t.id === 'alerts' && alertCount > 0 && (
                <span style={{
                  marginLeft: 5, background: 'var(--red)',
                  color: 'white', borderRadius: '50%',
                  width: 16, height: 16,
                  display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 9, fontWeight: 900,
                }}>{alertCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Status pills */}
        <div className="dashboard-status">
          <StatusPill label="CAM"     active={false}/>
          <StatusPill label="GESTURE" active={gesture.name !== 'none' && gesture.name !== 'No hand detected'}/>
          <StatusPill label="EMOTION" active={emotion.confidence > 0.3}/>
          <StatusPill label="SERVER" active={wsConnected}/>
          <button onClick={() => setShowDashboard(false)} className="dashboard-shell-button">Landing</button>
          <button onClick={handleLogout} className="dashboard-shell-button danger">Logout</button>
        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      <main className="dashboard-content">
        <Page/>
      </main>
    </div>
  )
}
