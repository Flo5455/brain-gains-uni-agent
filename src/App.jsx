// Brain Gains — Verbindlichkeits-Plattform für Fernstudierende.
// Drei Bereiche: Dashboard (Fortschritt), Gruppe (Check-in), Co-Learning (Lernraum).
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Headphones, Flame, Target, CheckCircle2, PartyPopper,
} from 'lucide-react';
import { BGPattern } from './components.jsx';
import { AppleDock, AppleDockIcon } from './components/ui/apple-dock.jsx';
import './index.css';

import { useCommitState, levelInfo, displayStreak, BADGE_MAP } from './lib/dtStore.js';
import { Icon, theme } from './dt/ui.jsx';
import Onboarding from './dt/Onboarding.jsx';
import Dashboard from './dt/Dashboard.jsx';
import GroupView from './dt/GroupView.jsx';
import CoLearning from './dt/CoLearning.jsx';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'sky' },
  { id: 'group', label: 'Gruppe', icon: Users, color: 'rose' },
  { id: 'colearning', label: 'Co-Learning', icon: Headphones, color: 'emerald' },
];

// Viewport-Erkennung: bestimmt, ob der Dock im Header (Desktop) oder schwebend
// unten (Mobil) gerendert wird. Nur eine Instanz aktiv → kein layoutId-Konflikt.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

export default function App() {
  const { state, actions } = useCommitState();
  const isDesktop = useIsDesktop();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalDraft, setGoalDraft] = useState('');
  const [badgeQueue, setBadgeQueue] = useState([]);
  const [toast, setToast] = useState(null);

  // --- Onboarding-Gate ---
  if (!state.onboarded) {
    return <Onboarding onComplete={actions.completeOnboarding} />;
  }

  const lvl = levelInfo(state.xp || 0);
  const streak = displayStreak(state);

  // --- Check-in mit Feedback (Konfetti, Toast, Badge-Popups) ---
  const handleCheckIn = () => {
    const res = actions.checkIn();
    if (res.already) return;
    confetti({ particleCount: 160, spread: 80, origin: { y: 0.7 }, colors: ['#38bdf8', '#34d399', '#fb923c', '#a78bfa'] });
    if (res.leveledUp) {
      setTimeout(() => confetti({ particleCount: 220, spread: 120, origin: { y: 0.6 } }), 250);
    }
    setToast(streak >= 1 ? 'Eingecheckt! Deine Serie wächst weiter. 🔥' : 'Eingecheckt! Schön, dass du da bist. 🌱');
    setTimeout(() => setToast(null), 2800);
    if (res.newBadges.length) {
      setBadgeQueue((q) => [...q, ...res.newBadges.map((id) => BADGE_MAP[id]).filter(Boolean)]);
    }
  };

  const openGoalModal = () => {
    setGoalDraft(state.goalText || '');
    setShowGoalModal(true);
  };
  const submitGoal = () => {
    actions.setGoal(goalDraft.trim());
    setShowGoalModal(false);
  };

  const renderDock = (wrapperClass) => (
    <div className={wrapperClass}>
      <AppleDock iconMagnification={58} iconDistance={130} className="mx-0 mt-0">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <AppleDockIcon
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-label={tab.label}
              colorName={tab.color}
            >
              <TabIcon className="w-5 h-5" />
            </AppleDockIcon>
          );
        })}
      </AppleDock>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100 font-sans selection:bg-sky-500/30 relative z-0 overflow-x-hidden">
      <BGPattern variant="grid" mask="none" className="z-[-10]" fill="hsl(0 0% 40% / 0.35)" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-sky-400" />
            </div>
            <span className="font-black text-base tracking-tight text-white truncate">Brain Gains</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak + Level */}
            <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl px-3 py-2 border border-slate-800">
              <div className="flex items-center gap-1.5" title="Dein Lern-Streak">
                <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 fill-orange-500/20' : 'text-slate-600'}`} />
                <span className={`font-bold text-sm ${streak > 0 ? 'text-orange-400' : 'text-slate-500'}`}>{streak}</span>
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2" title="Dein Level">
                <div className="bg-sky-500/20 text-sky-300 font-bold text-xs px-1.5 py-0.5 rounded">Lvl {lvl.level}</div>
                <div className="hidden sm:block w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${lvl.pct}%` }} />
                </div>
              </div>
            </div>
            {/* Dock im Header nur auf Desktop (relativ, im Fluss) */}
            {isDesktop && renderDock('relative w-max')}
          </div>
        </div>
      </header>

      {/* Dock schwebend unten nur auf Mobil (außerhalb des backdrop-blur-Headers,
          damit position:fixed gegen den Viewport verankert) */}
      {!isDesktop && renderDock('fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] w-max')}

      {/* Inhalt */}
      <main className="max-w-5xl mx-auto px-4 py-6 pb-28 md:pb-10 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard state={state} actions={actions} onCheckIn={handleCheckIn} onEditGoal={openGoalModal} />
            )}
            {activeTab === 'group' && (
              <GroupView state={state} onCheckIn={handleCheckIn} />
            )}
            {activeTab === 'colearning' && (
              <CoLearning state={state} actions={actions} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[120] bg-slate-900 border border-emerald-500/30 text-emerald-200 text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge-Popup */}
      <AnimatePresence>
        {badgeQueue.length > 0 && (
          <BadgePopup
            badge={badgeQueue[0]}
            onClose={() => setBadgeQueue((q) => q.slice(1))}
          />
        )}
      </AnimatePresence>

      {/* Lernziel-Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowGoalModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-7 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-sky-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Was lernst du heute?</h3>
              </div>
              <input
                type="text"
                value={goalDraft}
                onChange={(e) => setGoalDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitGoal(); }}
                placeholder="z. B. Marketing-Kapitel 3 wiederholen"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 mb-4 text-sm"
                autoFocus
              />
              <button
                onClick={submitGoal}
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Ziel speichern
              </button>
              <button
                onClick={() => setShowGoalModal(false)}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-300 transition-colors py-2 mt-1"
              >
                Abbrechen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Badge-Popup ---
function BadgePopup({ badge, onClose }) {
  if (!badge) return null;
  const t = theme(badge.color);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 260 }}
        className={`relative bg-slate-900 border ${t.soft} rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl ${t.glow}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
          <PartyPopper className="w-4 h-4" /> Neues Abzeichen
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
          className={`mx-auto w-20 h-20 rounded-3xl ${t.soft} border flex items-center justify-center mb-4`}
        >
          <Icon name={badge.icon} className="w-10 h-10" />
        </motion.div>
        <h3 className="text-white font-black text-xl mb-1">{badge.label}</h3>
        <p className="text-slate-400 text-sm mb-6">{badge.desc}</p>
        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
        >
          Weiter
        </button>
      </motion.div>
    </motion.div>
  );
}
