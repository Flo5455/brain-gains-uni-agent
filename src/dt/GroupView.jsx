// Gruppen-Ansicht: feste Kleingruppe mit täglichem Check-in-Status, eigener
// funktionaler Check-in und Gruppenbildung über einen Einladungslink.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Flame, CheckCircle2, Clock, UserPlus, Copy, Check, Link2, Target } from 'lucide-react';
import { Card, SectionHeader, Avatar } from './ui.jsx';
import {
  SEED_PEERS, GROUP_NAME, INVITE_LINK, displayStreak, isCheckedInToday, isInRoom,
} from '../lib/dtStore.js';

function StatusPill({ status }) {
  if (status === 'checked_in') {
    return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> heute eingecheckt</span>;
  }
  if (status === 'learning') {
    return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-300 bg-violet-500/15 border border-violet-500/25 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" /> lernt gerade</span>;
  }
  return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-700/40 border border-slate-600/40 px-2.5 py-1 rounded-full"><Clock className="w-3 h-3" /> noch offen</span>;
}

function MemberRow({ name, color, status, goal, streak, when, you, onCheckIn, checkedIn }) {
  return (
    <div className={`rounded-2xl border p-4 ${you ? 'bg-sky-500/[0.07] border-sky-500/25' : 'bg-slate-950/40 border-slate-800'}`}>
      <div className="flex items-center gap-3.5">
        <Avatar name={name} color={color} size="md" status={you ? undefined : status} you={you} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm truncate">{you ? `${name} (du)` : name}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-300/90">
              <Flame className="w-3 h-3 text-orange-500" />{streak}
            </span>
          </div>
          <p className="text-slate-400 text-xs truncate flex items-center gap-1 mt-0.5">
            {goal ? <><Target className="w-3 h-3 text-slate-500 shrink-0" />{goal}</> : <span className="text-slate-600">{when || 'kein Ziel gesetzt'}</span>}
          </p>
        </div>
        <div className="shrink-0 hidden sm:block">
          <StatusPill status={status} />
        </div>
      </div>

      {/* Status auf Mobil unter der Zeile */}
      <div className="sm:hidden mt-3">
        <StatusPill status={status} />
      </div>

      {/* Eigener Check-in */}
      {you && !checkedIn && (
        <button
          onClick={onCheckIn}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-[0_0_24px_rgba(56,189,248,0.2)]"
        >
          <Flame className="w-4 h-4" /> Heute einchecken
        </button>
      )}
      {you && checkedIn && (
        <div className="mt-3 w-full flex items-center justify-center gap-2 bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 font-bold py-3 rounded-xl text-sm">
          <CheckCircle2 className="w-4 h-4" /> Du hast heute eingecheckt - dein Team sieht es
        </div>
      )}
    </div>
  );
}

export default function GroupView({ state, onCheckIn }) {
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  const checkedIn = isCheckedInToday(state);
  const youStatus = checkedIn ? 'checked_in' : isInRoom(state) ? 'learning' : 'open';
  const youStreak = displayStreak(state);

  // Eigener Eintrag + Seed-Mitglieder
  const checkedInCount = (checkedIn ? 1 : 0) + SEED_PEERS.filter((p) => p.status === 'checked_in').length;
  const total = SEED_PEERS.length + 1;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(INVITE_LINK);
    } catch {
      /* Clipboard nicht verfügbar → Link bleibt sichtbar zum manuellen Kopieren */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Deine Lerncrew</h1>
        <p className="text-slate-400 text-sm mt-1">Ihr haltet euch gegenseitig den Rücken frei - sichtbar, aber ohne Druck.</p>
      </motion.div>

      {/* Gruppen-Kopf */}
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-violet-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-lg leading-tight truncate">{GROUP_NAME}</h2>
              <p className="text-slate-400 text-xs">{checkedInCount} von {total} heute eingecheckt</p>
            </div>
          </div>
          <button
            onClick={() => setShowInvite((v) => !v)}
            className="flex items-center gap-2 bg-violet-500/15 text-violet-200 border border-violet-500/30 hover:bg-violet-500/25 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Freunde einladen
          </button>
        </div>

        <AnimatePresence>
          {showInvite && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5" /> Teile diesen Link - wer ihn öffnet, landet direkt in eurer Crew:</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-sky-300 text-sm font-mono truncate select-all">
                    {INVITE_LINK}
                  </div>
                  <button
                    onClick={copyLink}
                    className={`shrink-0 flex items-center justify-center gap-2 font-bold text-sm px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                      copied ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-sky-500 hover:bg-sky-400 text-white'
                    }`}
                  >
                    {copied ? <><Check className="w-4 h-4" /> Kopiert!</> : <><Copy className="w-4 h-4" /> Link kopieren</>}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Mitglieder */}
      <Card className="p-5">
        <SectionHeader icon="Users" color="violet" title="Heute in der Crew" subtitle="Wer ist schon dran?" />
        <div className="space-y-3">
          <MemberRow
            name={state.name}
            color="sky"
            status={youStatus}
            goal={state.goalText}
            streak={youStreak}
            you
            checkedIn={checkedIn}
            onCheckIn={onCheckIn}
          />
          {SEED_PEERS.map((p) => (
            <MemberRow key={p.id} name={p.name} color={p.color} status={p.status} goal={p.status === 'open' ? null : p.goal} when={p.when} streak={p.streak} />
          ))}
        </div>
      </Card>
    </div>
  );
}
