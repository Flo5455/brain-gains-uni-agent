// dtStore.js — Zustands- und Logikschicht der Verbindlichkeits-Plattform
// Reines localStorage, keine Backend-Abhängigkeit. Eigene Aktionen werden echt
// persistiert; Gruppen- und Lernraum-Mitglieder sind realistische Seed-Daten.
import { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'dt_commit_state_v1';

// ============================================================
// Datums-Helfer (lokale Zeit, Schlüssel im Format YYYY-MM-DD)
// ============================================================
export function dayKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
export const todayKey = () => dayKey();
export const yesterdayKey = () => dayKey(addDays(new Date(), -1));

/** Aktuelle Kalenderwoche (Montag–Sonntag) als Array für die Wochenübersicht */
export function currentWeek() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dow = (now.getDay() + 6) % 7; // Montag = 0 ... Sonntag = 6
  const monday = addDays(now, -dow);
  const labels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const tk = todayKey();
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const key = dayKey(d);
    return { key, label: labels[i], dateNum: d.getDate(), isToday: key === tk, isFuture: key > tk };
  });
}

function uid() {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// ============================================================
// Statische Definitionen: Badges
// ============================================================
// icon = Name einer Lucide-Komponente (in der UI aufgelöst), color = Farb-Thema
export const BADGES = [
  { id: 'first_checkin', label: 'Erster Check-in', desc: 'Du hast dich zum ersten Mal committet.', icon: 'Flag', color: 'sky' },
  { id: 'streak_3', label: 'Drei am Stück', desc: 'Drei Tage in Folge dabei geblieben.', icon: 'Flame', color: 'orange' },
  { id: 'streak_7', label: 'Ganze Woche', desc: 'Sieben Tage in Folge - stark!', icon: 'Flame', color: 'amber' },
  { id: 'team_player', label: 'Gemeinsam stark', desc: 'Im stillen Lernraum mitgelernt.', icon: 'Users', color: 'violet' },
  { id: 'early_bird', label: 'Frühaufsteher', desc: 'Vor 9 Uhr eingecheckt.', icon: 'Sunrise', color: 'rose' },
  { id: 'goal_setter', label: 'Zielstrebig', desc: 'Zehn Lernziele gesetzt.', icon: 'Target', color: 'emerald' },
  { id: 'comeback', label: 'Comeback', desc: 'Nach einer Pause neu durchgestartet.', icon: 'Sparkles', color: 'pink' },
  { id: 'consistent', label: 'Verlässlich', desc: 'Vierzehn Check-ins gesammelt.', icon: 'ShieldCheck', color: 'cyan' },
];
export const BADGE_MAP = Object.fromEntries(BADGES.map((b) => [b.id, b]));

// ============================================================
// Seed-Daten: feste Kleingruppe + Lernraum-Anwesenheit
// (andere Personen sind Beispieldaten — für einen Prototyp ausreichend)
// ============================================================
export const SEED_PEERS = [
  { id: 'lenny', name: 'Lenny', color: 'emerald', status: 'checked_in', goal: 'Statistik-Übungen, Kapitel 4', streak: 6, when: 'vor 2 Std. eingecheckt' },
  { id: 'viena', name: 'Viena', color: 'violet', status: 'learning', goal: 'Gliederung der Hausarbeit', streak: 3, when: 'lernt gerade im Raum' },
  { id: 'mara', name: 'Mara', color: 'amber', status: 'open', goal: 'Marketing-Grundlagen wiederholen', streak: 9, when: 'meist abends aktiv' },
];

// Personen, die „gerade gemeinsam lernen" (im stillen Lernraum)
export const SEED_ROOM = [
  { id: 'viena', name: 'Viena', color: 'violet', minutes: 34 },
  { id: 'jonas', name: 'Jonas', color: 'sky', minutes: 12 },
  { id: 'sina', name: 'Sina', color: 'rose', minutes: 51 },
];

export const GROUP_NAME = 'Lerncrew Fernstudium';
export const INVITE_LINK = 'https://brain-gains.app/join/lerncrew-7f3a';

// ============================================================
// Standard-Tagesziele (Beispiele, täglich neu)
// ============================================================
function defaultTasks() {
  return [
    { id: uid(), text: '25 Minuten fokussiert lesen', done: false },
    { id: uid(), text: 'Kernpunkte in eigenen Worten zusammenfassen', done: false },
    { id: uid(), text: 'Kurz im Lernraum vorbeischauen', done: false },
  ];
}

// ============================================================
// Seed-Zustand beim allerersten Start (realistische Prototyp-Daten,
// damit Dashboard & Wochenübersicht sofort lebendig wirken)
// ============================================================
function seedState() {
  const history = {};
  // Letzte Woche: überwiegend erledigt, ein bewusst ausgelassener Tag (neutral, nicht beschämend)
  for (let i = 6; i >= 1; i--) {
    const k = dayKey(addDays(new Date(), -i));
    if (i === 4) {
      history[k] = { planned: 2, done: 0, checkedIn: false }; // freier Tag
    } else {
      history[k] = { planned: 3, done: i % 2 === 0 ? 3 : 2, checkedIn: true };
    }
  }
  return {
    version: 1,
    name: '',
    onboarded: false,
    goalText: '',
    goalDate: '',
    tasks: [],
    tasksDate: '',
    checkedInDate: null,
    streak: 4,
    longestStreak: 7,
    lastCheckinDate: yesterdayKey(),
    inRoomSince: null,
    badges: ['first_checkin', 'streak_3', 'team_player'],
    totalCheckins: 11,
    totalTasksDone: 28,
    goalsSet: 7,
    xp: 240,
    history,
  };
}

// ============================================================
// Abgeleitete Werte
// ============================================================
export function levelInfo(xp) {
  const level = Math.floor(xp / 100) + 1;
  const inLevel = xp - (level - 1) * 100;
  return { level, inLevel, forLevel: 100, pct: inLevel };
}

/** Anzuzeigender Streak: laufend, solange gestern oder heute eingecheckt wurde. */
export function displayStreak(state) {
  const t = todayKey();
  const y = yesterdayKey();
  if (state.checkedInDate === t) return state.streak;
  if (state.lastCheckinDate === t || state.lastCheckinDate === y) return state.streak;
  return 0; // Unterbrochen → ermutigender Neustart
}

export function isCheckedInToday(state) {
  return state.checkedInDate === todayKey();
}
export function isInRoom(state) {
  return !!state.inRoomSince;
}
export function todayProgress(state) {
  const tasks = state.tasks || [];
  const done = tasks.filter((t) => t.done).length;
  return { done, total: tasks.length, pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
}

// ============================================================
// Laden / Normalisieren
// ============================================================
function loadState() {
  let base = seedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) base = { ...base, ...JSON.parse(raw) };
  } catch {
    /* defekter Eintrag → Seed verwenden */
  }
  return normalizeForToday(base);
}

/** Tageswechsel berücksichtigen: Tagesziele und Lernziel für einen neuen Tag zurücksetzen. */
function normalizeForToday(state) {
  const t = todayKey();
  const next = { ...state };
  if (next.onboarded) {
    if (next.tasksDate !== t) {
      next.tasks = defaultTasks();
      next.tasksDate = t;
    }
    if (next.goalDate !== t) {
      next.goalText = '';
    }
  }
  return next;
}

// ============================================================
// Hook: useCommitState — Zustand + Aktionen
// ============================================================
export function useCommitState() {
  const [state, setState] = useState(loadState);
  const stateRef = useRef(state);
  // Aktuellen Zustand in einem Ref spiegeln (für Aktionen aus Event-Handlern,
  // die den jüngsten Wert lesen müssen) — Aktualisierung außerhalb des Renders.
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Persistenz
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* Speicher voll/blockiert → ignorieren, App läuft weiter */
    }
  }, [state]);

  const completeOnboarding = useCallback((name, goalText) => {
    const t = todayKey();
    setState((prev) => ({
      ...prev,
      name: (name || '').trim() || 'Du',
      onboarded: true,
      goalText: (goalText || '').trim(),
      goalDate: t,
      tasks: defaultTasks(),
      tasksDate: t,
      goalsSet: (prev.goalsSet || 0) + ((goalText || '').trim() ? 1 : 0),
    }));
  }, []);

  const setGoal = useCallback((text) => {
    const t = todayKey();
    setState((prev) => {
      const goalsSet = (prev.goalsSet || 0) + 1;
      const badges = [...prev.badges];
      if (goalsSet >= 10 && !badges.includes('goal_setter')) badges.push('goal_setter');
      return { ...prev, goalText: (text || '').trim(), goalDate: t, goalsSet, badges };
    });
  }, []);

  const addTask = useCallback((text) => {
    const clean = (text || '').trim();
    if (!clean) return;
    setState((prev) => ({ ...prev, tasks: [...(prev.tasks || []), { id: uid(), text: clean, done: false }] }));
  }, []);

  const removeTask = useCallback((id) => {
    setState((prev) => ({ ...prev, tasks: (prev.tasks || []).filter((t) => t.id !== id) }));
  }, []);

  // Tagesziel abhaken → liefert true, wenn dadurch ein Ziel NEU erfüllt wurde (für Feedback)
  const toggleTask = useCallback((id) => {
    let completedNow = false;
    const t = todayKey();
    setState((prev) => {
      const tasks = (prev.tasks || []).map((task) => {
        if (task.id !== id) return task;
        const done = !task.done;
        if (done) completedNow = true;
        return { ...task, done };
      });
      const doneCount = tasks.filter((x) => x.done).length;
      const history = { ...(prev.history || {}) };
      history[t] = { ...(history[t] || {}), planned: tasks.length, done: doneCount, checkedIn: prev.checkedInDate === t };
      const delta = completedNow ? 5 : -5;
      return {
        ...prev,
        tasks,
        history,
        totalTasksDone: Math.max(0, (prev.totalTasksDone || 0) + (completedNow ? 1 : 0)),
        xp: Math.max(0, (prev.xp || 0) + delta),
      };
    });
    return completedNow;
  }, []);

  // Haupt-Aktion: Check-in. Liefert { newBadges, leveledUp, already } für Feedback.
  const checkIn = useCallback(() => {
    const prev = stateRef.current;
    const t = todayKey();
    if (prev.checkedInDate === t) return { newBadges: [], leveledUp: false, already: true };

    const y = yesterdayKey();
    const wasBroken = prev.lastCheckinDate !== y && prev.lastCheckinDate !== t;
    let newStreak;
    if (prev.lastCheckinDate === y) newStreak = (prev.streak || 0) + 1;
    else if (prev.lastCheckinDate === t) newStreak = prev.streak;
    else newStreak = 1; // Neustart nach Pause

    const longestStreak = Math.max(prev.longestStreak || 0, newStreak);
    const totalCheckins = (prev.totalCheckins || 0) + 1;
    const oldLevel = levelInfo(prev.xp || 0).level;
    const xp = (prev.xp || 0) + 20;
    const newLevel = levelInfo(xp).level;

    const badges = [...prev.badges];
    const newBadges = [];
    const award = (id) => {
      if (!badges.includes(id)) {
        badges.push(id);
        newBadges.push(id);
      }
    };
    award('first_checkin');
    if (newStreak >= 3) award('streak_3');
    if (newStreak >= 7) award('streak_7');
    if (new Date().getHours() < 9) award('early_bird');
    if (totalCheckins >= 14) award('consistent');
    if (wasBroken && totalCheckins > 1) award('comeback');

    const history = { ...(prev.history || {}) };
    const doneCount = (prev.tasks || []).filter((x) => x.done).length;
    history[t] = { planned: (prev.tasks || []).length, done: doneCount, checkedIn: true };

    setState({
      ...prev,
      checkedInDate: t,
      lastCheckinDate: t,
      streak: newStreak,
      longestStreak,
      totalCheckins,
      xp,
      badges,
      history,
    });

    return { newBadges, leveledUp: newLevel > oldLevel, already: false };
  }, []);

  const joinRoom = useCallback(() => {
    setState((prev) => {
      const badges = [...prev.badges];
      if (!badges.includes('team_player')) badges.push('team_player');
      return { ...prev, inRoomSince: Date.now(), badges };
    });
  }, []);

  const leaveRoom = useCallback(() => {
    setState((prev) => ({ ...prev, inRoomSince: null }));
  }, []);

  const actions = {
    completeOnboarding,
    setGoal,
    addTask,
    removeTask,
    toggleTask,
    checkIn,
    joinRoom,
    leaveRoom,
  };

  return { state, actions };
}
