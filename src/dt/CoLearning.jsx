// Co-Learning: optionaler stiller Lernraum (Body Doubling). Anwesenheitsanzeige
// mit Beispiel-Personen + funktionaler Beitritt mit Fokus-Timer.
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, LogIn, LogOut, Sparkles, Volume2 } from 'lucide-react';
import { Card, SectionHeader, Avatar } from './ui.jsx';
import { SEED_ROOM, isInRoom } from '../lib/dtStore.js';

function pad(n) { return String(n).padStart(2, '0'); }

function FocusTimer({ since }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const elapsed = Math.max(0, Math.floor((now - since) / 1000));
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  return (
    <span className="font-mono tabular-nums">{h > 0 ? `${pad(h)}:` : ''}{pad(m)}:{pad(s)}</span>
  );
}

export default function CoLearning({ state, actions }) {
  const inRoom = isInRoom(state);
  const presentCount = SEED_ROOM.length + (inRoom ? 1 : 0);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Stiller Lernraum</h1>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-800/70 border border-slate-700 px-2.5 py-1 rounded-full">Optionale Zusatzfunktion</span>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Körperliche Co-Präsenz, digital: Ihr lernt still nebeneinander - kein Mikro, kein Chat, kein Abstimmen. Allein zu sein fällt so leichter.
        </p>
      </motion.div>

      {/* Anwesenheit */}
      <Card className="p-5">
        <SectionHeader icon="Radio" color="emerald" title="Gerade gemeinsam aktiv" />
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center -space-x-3">
            {inRoom && <Avatar name={state.name} color="sky" size="md" you />}
            {SEED_ROOM.map((p) => (
              <div key={p.id} className="ring-2 ring-neutral-950 rounded-2xl">
                <Avatar name={p.name} color={p.color} size="md" status="learning" />
              </div>
            ))}
          </div>
          <div>
            <p className="text-white font-bold">
              Gerade lernen gemeinsam: <span className="text-emerald-300">{presentCount} {presentCount === 1 ? 'Person' : 'Personen'}</span>
            </p>
            <p className="text-slate-500 text-xs">{inRoom ? 'Du bist dabei - viel Fokus!' : 'Tritt bei und reih dich ein.'}</p>
          </div>
        </div>

        {/* Namensliste mit Dauer */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {inRoom && (
            <div className="flex items-center gap-3 bg-sky-500/[0.08] border border-sky-500/25 rounded-2xl px-3.5 py-2.5">
              <Avatar name={state.name} color="sky" size="sm" you />
              <div className="min-w-0">
                <p className="text-white text-sm font-bold truncate">{state.name} (du)</p>
                <p className="text-sky-300/80 text-xs">seit gerade eben</p>
              </div>
            </div>
          )}
          {SEED_ROOM.map((p) => (
            <div key={p.id} className="flex items-center gap-3 bg-slate-950/40 border border-slate-800 rounded-2xl px-3.5 py-2.5">
              <Avatar name={p.name} color={p.color} size="sm" status="learning" />
              <div className="min-w-0">
                <p className="text-white text-sm font-bold truncate">{p.name}</p>
                <p className="text-slate-500 text-xs">seit {p.minutes} Min. im Fokus</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Beitreten / Fokus-Zustand */}
      <AnimatePresence mode="wait">
        {!inRoom ? (
          <motion.div key="join" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="p-6 text-center relative overflow-hidden">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 mb-4">
                  <Headphones className="w-8 h-8 text-emerald-300" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Lerne in stiller Gesellschaft</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-5">
                  {state.goalText
                    ? <>Nimm dein heutiges Ziel mit: <span className="text-slate-200 font-semibold">„{state.goalText}"</span></>
                    : 'Setz dir ein Ziel und lass dich von der Anwesenheit der anderen tragen.'}
                </p>
                <button
                  onClick={actions.joinRoom}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 px-7 rounded-2xl transition-colors cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.25)]"
                >
                  <LogIn className="w-5 h-5" /> Lernraum beitreten
                </button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="focus" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Card className="p-6 text-center relative overflow-hidden border-emerald-500/20">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.06] to-transparent" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wide mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Fokus läuft
                </div>
                <div className="text-6xl sm:text-7xl font-black text-white tracking-tight mb-2">
                  <FocusTimer since={state.inRoomSince} />
                </div>
                <p className="text-slate-400 text-sm mb-1 flex items-center justify-center gap-1.5">
                  <Volume2 className="w-4 h-4" /> Du lernst still mit {SEED_ROOM.length} anderen
                </p>
                {state.goalText && <p className="text-slate-300 text-sm font-semibold mb-5">„{state.goalText}"</p>}
                {!state.goalText && <div className="mb-5" />}
                <button
                  onClick={actions.leaveRoom}
                  className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-6 rounded-2xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Fokus beenden
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Erklärung Body Doubling */}
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-sky-300" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm mb-1">Warum gemeinsam still lernen?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Schon die Anwesenheit anderer („Body Doubling") senkt die Hürde, anzufangen und dranzubleiben. Niemand schaut dir über die Schulter - das Wissen, dass andere gerade dasselbe tun, reicht oft schon.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
