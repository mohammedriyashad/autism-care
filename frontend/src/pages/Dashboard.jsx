// src/pages/Dashboard.jsx — New 2-way communication layout
import React from 'react'
import CameraPanel      from '../components/CameraPanel'
import SymbolBoard      from '../components/SymbolBoard'
import ConversationPanel from '../components/ConversationPanel'
import {
  CareCompanionPanel,
  FusionPanel,
  HistoryPanel,
  MicPanel,
  RoutinePanel,
  StatsPanel,
  SupportSuggestionsPanel,
} from '../components/RightPanels'
import { SignalBox } from '../components/ui'
import { useStore } from '../utils/store'

const GESTURE_HINTS = [
  { icon:'☝️', label:'Need help'  }, { icon:'✌️', label:"I'm okay"   },
  { icon:'👍', label:'Yes / Good' }, { icon:'✊', label:'Stop / No'  },
  { icon:'🖐️', label:'I want'    }, { icon:'🤙', label:'Talk to me' },
]
const POSE_HINTS = [
  { icon:'🙋', label:'Attention'      }, { icon:'🤐', label:'Uncomfortable' },
  { icon:'😔', label:'Sad/withdrawn'  }, { icon:'🔄', label:'Anxious'       },
]

export default function Dashboard() {
  const { gesture, pose } = useStore()

  return (
    <div className="dashboard-grid">

      {/* ── LEFT: Camera + Signals ── */}
      <div className="dashboard-left">
        <CareCompanionPanel/>
        <CameraPanel/>
        <SignalBox
          title="🤲 Communication Gesture"
          icon={gesture.icon}
          name={gesture.name === 'none' ? 'Waiting for gesture' : gesture.name}
          meaning={gesture.name === 'none' ? 'Ready when the child is ready' : gesture.meaning}
          hints={GESTURE_HINTS}
        />
        <SignalBox
          title="🧍 Body Comfort Cue"
          icon={pose.icon}
          name={pose.meaning}
          meaning={pose.name}
          hints={POSE_HINTS}
        />
      </div>

      {/* ── CENTER: 2-Way Conversation + Symbol Board ── */}
      <div className="dashboard-center">
        {/* 2-Way Conversation Panel — MAIN FEATURE */}
        <ConversationPanel/>

        {/* Symbol Board — child input */}
        <SymbolBoard compact={true}/>
      </div>

      {/* ── RIGHT: Mic + Fusion + Stats + History ── */}
      <div className="dashboard-right">
        <SupportSuggestionsPanel/>
        <MicPanel/>
        <FusionPanel/>
        <RoutinePanel/>
        <StatsPanel/>
        <HistoryPanel/>
      </div>

    </div>
  )
}
