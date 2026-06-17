// Fortschritts-Dashboard: Lernziel, Check-in, Streak, Tagesziele,
// Wochenübersicht und Badges. Durchgängig ermutigender Ton.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Plus, X, CheckCircle2, Circle, Pencil, Lock } from 'lucide-react';
import { Card, SectionHeader, ProgressRing, Icon, theme } from './ui.jsx';
import {
  BADGES, displayStreak, isCheckedInToday, todayProgress, currentWeek, levelInfo,
} from '../lib/dtStore.js';

export default function Dashboard({ state, actions, onCheckIn, onEditGoal }) {
  const checked = isCheckedInToday(state);
  const streak = displayStreak(state);
  const prog = todayProgress(state);
  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend';
  const lvl = levelInfo(state.xp || 0);

  let subline;
  if (checked) subline = streak > 1 ? `Du hast dich heute committet - Tag ${streak} in Folge. Weiter so!` : 'Du hast dich heute committet. Stark, dass du da bist!';
  else if (streak === 0) subline = 'Heute ist ein guter Tag für einen frischen Start. Ein kleiner Schritt zählt schon.';
  else subline = `Du bist seit ${streak} ${streak === 1 ? 'Tag' : 'Tagen'} dran. Ein kurzer Check-in hält die Serie am Leben.`;

  return (
    <div className="space-y-5">
      {/* Begrüßung */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {greeting}, {state.name} <span className="inline-block">👋</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">{subline}</p>
      </motion.div>

      {/* Fokus heute + Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Fokus-Karte / Check-in */}
        <Card className="p-5 lg:col-span-2">
          <SectionHeader
            icon="Target"
            color="sky"
            title="Dein Fokus heute"
            subtitle="Dein Lernziel für diesen Tag"
            action={(
              <button
                onClick={onEditGoal}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-sky-300 bg-slate-800/60 hover:bg-slate-800 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" /> Ändern
              </button>
            )}
          />

          {state.goalText ? (
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 mb-4">
              <p className="text-white font-semibold text-lg leading-snug">{state.goalText}</p>
            </div>
          ) : (
            <button
              onClick={onEditGoal}
              className="w-full text-left bg-slate-950/40 border border-dashed border-slate-700 rounded-2xl px-4 py-4 mb-4 text-slate-500 hover:border-sky-500/40 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Noch kein Ziel gesetzt - tippe hier, um „Was lernst du heute?" zu beantworten.
            </button>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onCheckIn}
              disabled={checked}
              className={`flex-1 flex items-center justify-center gap-2.5 font-bold py-4 px-6 rounded-2xl transition-all text-base cursor-pointer disabled:cursor-default ${
                checked
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-sky-500 hover:bg-sky-400 text-white shadow-[0_0_30px_rgba(56,189,248,0.25)] hover:shadow-[0_0_40px_rgba(56,189,248,0.4)]'
              }`}
            >
              {checked ? (
                <><CheckCircle2 className="w-5 h-5" /> Heute eingecheckt</>
              ) : (
                <><Flame className="w-5 h-5" /> Heute einchecken</>
              )}
            </button>
            <div className="flex items-center justify-center gap-3 bg-slate-950/40 rounded-2xl px-4 py-3 sm:py-0 sm:bg-transparent">
              <ProgressRing pct={prog.pct} size={52} color={prog.pct === 100 ? 'emerald' : 'sky'}>
                <span className="text-[11px] font-black">{prog.done}/{prog.total}</span>
              </ProgressRing>
              <div className="leading-tight">
                <p className="text-white text-sm font-bold">Tagesziele</p>
                <p className="text-slate-500 text-xs">{prog.pct === 100 ? 'Alles erledigt 🎉' : 'kleine Schritte'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Streak-Karte */}
        <Card className="p-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
          <SectionHeader icon="Flame" color="orange" title="Deine Serie" />
          <div className="flex items-end gap-3 mb-2">
            <span className={`text-6xl font-black leading-none ${streak > 0 ? 'text-orange-400' : 'text-slate-600'}`}>{streak}</span>
            <div className="pb-1.5">
              <Flame className={`w-8 h-8 ${streak > 0 ? 'text-orange-500 fill-orange-500/30' : 'text-slate-700'}`} />
            </div>
          </div>
          <p className="text-white font-bold text-sm">{streak === 1 ? 'Tag am Stück' : 'Tage am Stück'}</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {streak === 0 ? 'Heute neu starten' : `Längste Serie: ${state.longestStreak} Tage`}
          </p>
        </Card>
      </div>

      {/* Tagesziele */}
      <Card className="p-5">
        <SectionHeader
          icon="CheckCircle2"
          color="emerald"
          title="Tagesziele"
          subtitle={`${prog.done} von ${prog.total} erledigt`}
        />
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            initial={false}
            animate={{ width: `${prog.pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <TaskList tasks={state.tasks || []} onToggle={actions.toggleTask} onAdd={actions.addTask} onRemove={actions.removeTask} />
      </Card>

      {/* Wochenübersicht */}
      <Card className="p-5">
        <SectionHeader icon="CalendarDays" color="violet" title="Diese Woche" subtitle="geplant vs. erledigt" />
        <WeekOverview state={state} prog={prog} checked={checked} />
        <div className="flex items-center gap-5 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-violet-500 inline-block" /> erledigt</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-700 inline-block" /> geplant</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> eingecheckt</span>
        </div>
      </Card>

      {/* Badges */}
      <Card className="p-5">
        <SectionHeader
          icon="Trophy"
          color="amber"
          title="Abzeichen"
          subtitle={`${state.badges.length} von ${BADGES.length} freigeschaltet`}
          action={<div className="text-xs font-bold text-sky-300 bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-xl">Level {lvl.level}</div>}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map((b) => {
            const earned = state.badges.includes(b.id);
            const t = theme(b.color);
            return (
              <div
                key={b.id}
                title={b.desc}
                className={`rounded-2xl border p-3 flex flex-col items-center text-center gap-1.5 transition-all ${
                  earned ? `${t.soft} ${t.glow}` : 'bg-slate-900/40 border-slate-800 text-slate-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${earned ? 'bg-slate-950/30' : 'bg-slate-800/50'}`}>
                  {earned ? <Icon name={b.icon} className="w-5 h-5" /> : <Lock className="w-4 h-4 text-slate-600" />}
                </div>
                <span className={`text-[11px] font-bold leading-tight ${earned ? 'text-white' : 'text-slate-600'}`}>{b.label}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// --- Tagesziel-Liste ---
function TaskList({ tasks, onToggle, onAdd, onRemove }) {
  const [input, setInput] = useState('');
  const add = () => { if (input.trim()) { onAdd(input); setInput(''); } };

  return (
    <div>
      <ul className="space-y-2 mb-3">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="group flex items-center gap-3 bg-slate-950/40 border border-slate-800 rounded-2xl px-3.5 py-3"
            >
              <button
                onClick={() => onToggle(task.id)}
                className="shrink-0 cursor-pointer"
                aria-label={task.done ? 'Als offen markieren' : 'Als erledigt markieren'}
              >
                {task.done
                  ? <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  : <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400 transition-colors" />}
              </button>
              <span className={`flex-1 text-sm ${task.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.text}</span>
              <button
                onClick={() => onRemove(task.id)}
                className="shrink-0 p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all cursor-pointer"
                aria-label="Entfernen"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <li className="text-slate-500 text-sm text-center py-4">Noch keine Tagesziele - füge unten dein erstes hinzu.</li>
        )}
      </ul>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
          placeholder="Neues Tagesziel hinzufügen…"
          className="flex-1 bg-slate-950/50 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
        />
        <button
          onClick={add}
          disabled={!input.trim()}
          className="shrink-0 w-12 flex items-center justify-center bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-2xl hover:bg-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Tagesziel hinzufügen"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// --- Wochenübersicht ---
function WeekOverview({ state, prog, checked }) {
  const week = currentWeek();
  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
      {week.map((d) => {
        let planned = 0;
        let done = 0;
        let dayChecked = false;
        if (d.isToday) {
          planned = prog.total;
          done = prog.done;
          dayChecked = checked;
        } else if (!d.isFuture) {
          const h = (state.history || {})[d.key];
          if (h) { planned = h.planned || 0; done = h.done || 0; dayChecked = !!h.checkedIn; }
        }
        const ratio = planned > 0 ? Math.min(1, done / planned) : 0;
        const fillColor = d.isToday ? 'bg-sky-500' : 'bg-violet-500';
        return (
          <div key={d.key} className="flex flex-col items-center gap-1.5">
            <div className="h-5 flex items-center justify-center">
              {dayChecked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className={`relative w-full h-20 rounded-xl overflow-hidden flex items-end ${
              d.isFuture ? 'bg-slate-900 border border-dashed border-slate-700' : 'bg-slate-800'
            }`}>
              {!d.isFuture && ratio > 0 && (
                <motion.div
                  className={`w-full ${fillColor} rounded-t-md`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(12, ratio * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.05 }}
                />
              )}
              {d.isToday && (
                <span className="absolute inset-x-0 top-1 text-center text-[9px] font-black text-sky-300 uppercase tracking-wide">heute</span>
              )}
            </div>
            <span className={`text-[11px] font-bold ${d.isToday ? 'text-sky-300' : 'text-slate-500'}`}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
