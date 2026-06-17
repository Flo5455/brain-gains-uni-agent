// Startscreen: niedrigschwelliger Einstieg. Name + heutiges Lernziel in unter
// 10 Sekunden — danach geht es direkt ins Dashboard.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Target, ArrowRight, Users, Flame } from 'lucide-react';
import { BGPattern } from '../components.jsx';

export default function Onboarding({ onComplete }) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');

  const submit = () => {
    if (!name.trim()) return;
    onComplete(name.trim(), goal.trim());
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <BGPattern variant="grid" mask="fade-edges" className="z-0" fill="hsl(0 0% 40% / 0.35)" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[130px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-sky-500/10 border border-sky-500/30 rounded-3xl mb-5 shadow-[0_0_40px_rgba(56,189,248,0.18)]"
          >
            <BrainCircuit className="w-10 h-10 text-sky-400" />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Brain Gains</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Lerne nicht allein. Verabrede dich täglich mit dir selbst und deiner Lerncrew - so verbindlich, als wärt ihr im selben Raum.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm shadow-2xl"
        >
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Wie heißt du?</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('dt-goal-input')?.focus(); }}
            placeholder="z. B. Florian"
            autoFocus
            className="w-full bg-slate-950/60 border border-slate-700 rounded-2xl px-4 py-3.5 text-white placeholder-slate-600 focus:border-sky-500/60 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all mb-5"
          />

          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
            <Target className="w-3.5 h-3.5 text-sky-400" />
            Was lernst du heute?
          </label>
          <input
            id="dt-goal-input"
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) submit(); }}
            placeholder="z. B. Marketing-Kapitel 3 wiederholen"
            className="w-full bg-slate-950/60 border border-slate-700 rounded-2xl px-4 py-3.5 text-white placeholder-slate-600 focus:border-sky-500/60 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all mb-5"
          />

          <button
            onClick={submit}
            disabled={!name.trim()}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-3.5 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-base"
          >
            Los geht's
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-slate-600 text-xs mt-3">Kein Konto nötig - dein Fortschritt bleibt lokal auf diesem Gerät.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-5 mt-6 text-slate-500 text-xs"
        >
          <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-400" /> Streaks</span>
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-violet-400" /> Lerncrew</span>
          <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-sky-400" /> Tagesziele</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
