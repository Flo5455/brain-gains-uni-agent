import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { BGPattern, ParticleTextEffect, ParticleFrameEffect, GlowingEffect, SparklesCore } from './components.jsx';
import { AppleDock, AppleDockIcon } from './components/ui/apple-dock.jsx';
import './index.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';

import React, { useState, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { INITIAL_DECKS, INITIAL_CARDS, parseFlashcards, shuffleArray, BUNDLED_DECK_ID, DEFAULT_STATS } from './lib/bundledDecks.js';
import UserSelect from './components/UserSelect.jsx';
import { loadUserDecks, loadUserStats, saveUserStats, syncDecksToSupabase, importLocalStorageData, loadAllUsersWithStats } from './lib/storage.js';
const { BrainCircuit, BarChart3, GraduationCap, RefreshCcw, CheckCircle2, AlertCircle, Play, Award, ChevronRight, Sparkles, Loader2, Library, Trash2, Filter, Search, ArrowUpDown, Calendar, ChevronLeft, Plus, Download, Upload, Copy, Settings, ArrowLeft, Flame, Trophy, Star, X, Coffee, Zap, Target, Crown, Rocket, Compass, Heart, Lightbulb, Clock, Shield, Activity, Bell, Gift, Key, Flag, Smile, Navigation, ZapOff, BookOpen, Brain, Gauge, RotateCcw, User } = LucideIcons;

// --- ANIMATED SVG HINT COMPONENTS ---

const LinearRegressionHint = () => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <style>{`
      @keyframes drawLine { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
      @keyframes fadeDot { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
      .anim-line { stroke-dasharray: 100; stroke-dashoffset: 100; animation: drawLine 2s ease-out forwards infinite alternate; }
      .anim-dot { animation: fadeDot 3s infinite; transform-origin: center; }
    `}</style>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <line x1="10" y1="90" x2="10" y2="10" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="90" x2="90" y2="90" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <circle cx="25" cy="70" r="3" fill="#60a5fa" className="anim-dot" style={{ animationDelay: '0s' }} />
      <circle cx="45" cy="55" r="3" fill="#60a5fa" className="anim-dot" style={{ animationDelay: '0.5s' }} />
      <circle cx="65" cy="40" r="3" fill="#60a5fa" className="anim-dot" style={{ animationDelay: '1s' }} />
      <circle cx="85" cy="20" r="3" fill="#60a5fa" className="anim-dot" style={{ animationDelay: '1.5s' }} />
      <line x1="15" y1="80" x2="85" y2="25" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" className="anim-line" />
    </svg>
  </div>
);

const NormalDistributionHint = () => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <style>{`
      @keyframes drawCurve { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
      .anim-curve { stroke-dasharray: 200; stroke-dashoffset: 200; animation: drawCurve 2.5s ease-in-out forwards infinite alternate; }
    `}</style>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <line x1="10" y1="80" x2="90" y2="80" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <path d="M 10 80 Q 30 80, 40 40 T 50 15 T 60 40 T 90 80" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" className="anim-curve" />
      <line x1="50" y1="80" x2="50" y2="15" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
    </svg>
  </div>
);

const PValueHint = () => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <style>{`
      @keyframes pulseTail { 0%, 100% { fill-opacity: 0.2; } 50% { fill-opacity: 0.8; } }
      .anim-tail { animation: pulseTail 2s infinite; }
    `}</style>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <line x1="10" y1="80" x2="90" y2="80" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <path d="M 10 80 Q 30 80, 40 40 T 50 15 T 60 40 T 90 80" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <path d="M 75 68 Q 80 75, 90 80 L 75 80 Z" fill="#ef4444" className="anim-tail" />
      <text x="80" y="60" fill="#ef4444" fontSize="10" fontWeight="bold">p</text>
    </svg>
  </div>
);

const SamplingHint = () => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <style>{`
      @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      @keyframes slideArrow { 0% { transform: translateX(0); } 100% { transform: translateX(5px); } }
      .anim-pop { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transform-origin: center; }
      .anim-arrow { animation: slideArrow 1s ease-in-out infinite alternate; }
    `}</style>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <circle cx="30" cy="50" r="25" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
      {[...Array(12)].map((_, i) => (
        <circle key={i} cx={30 + Math.cos(i * 30) * 12} cy={50 + Math.sin(i * 30) * 12} r="2.5" fill={i % 3 === 0 ? "#10b981" : "#64748b"} />
      ))}
      <path d="M 60 50 L 70 50 L 65 45 M 70 50 L 65 55" fill="none" stroke="#3b82f6" strokeWidth="2" className="anim-arrow" />
      <circle cx="85" cy="50" r="12" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      <circle cx="82" cy="47" r="2.5" fill="#10b981" className="anim-pop" style={{ animationDelay: '0.5s', opacity: 0 }} />
      <circle cx="88" cy="52" r="2.5" fill="#10b981" className="anim-pop" style={{ animationDelay: '0.8s', opacity: 0 }} />
      <circle cx="83" cy="54" r="2.5" fill="#10b981" className="anim-pop" style={{ animationDelay: '1.1s', opacity: 0 }} />
    </svg>
  </div>
);

const DescriptiveHint = () => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <style>{`
      @keyframes growBar { from { height: 0; y: 80; } }
      @keyframes slideMean { 0% { transform: translateX(-10px); } 100% { transform: translateX(10px); } }
      .bar-1 { animation: growBar 1s ease-out forwards; }
      .bar-2 { animation: growBar 1.2s ease-out forwards; }
      .bar-3 { animation: growBar 1.4s ease-out forwards; }
      .mean-line { animation: slideMean 2s ease-in-out infinite alternate; }
    `}</style>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <line x1="10" y1="80" x2="90" y2="80" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <rect x="25" y="50" width="12" height="30" fill="#64748b" className="bar-1" rx="2" />
      <rect x="44" y="30" width="12" height="50" fill="#8b5cf6" className="bar-2" rx="2" />
      <rect x="63" y="60" width="12" height="20" fill="#64748b" className="bar-3" rx="2" />
      <g className="mean-line">
        <line x1="50" y1="20" x2="50" y2="80" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
        <polygon points="47,20 53,20 50,25" fill="#f43f5e" />
      </g>
    </svg>
  </div>
);

const ProbabilityHint = () => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <style>{`
      @keyframes pulseVenn { 0%, 100% { fill-opacity: 0.3; } 50% { fill-opacity: 0.6; } }
      .venn-left { animation: pulseVenn 3s infinite; animation-delay: 0s; }
      .venn-right { animation: pulseVenn 3s infinite; animation-delay: 1.5s; }
      .venn-intersect { animation: pulseVenn 2s infinite; animation-delay: 0.75s; }
    `}</style>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <circle cx="40" cy="50" r="22" fill="#3b82f6" className="venn-left" stroke="#2563eb" strokeWidth="1" />
      <circle cx="60" cy="50" r="22" fill="#ec4899" className="venn-right" stroke="#db2777" strokeWidth="1" />
      <path d="M 50 30 A 22 22 0 0 0 50 70 A 22 22 0 0 0 50 30 Z" fill="#8b5cf6" className="venn-intersect" />
    </svg>
  </div>
);

const ScaleHint = () => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <style>{`
      @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      .step-1 { animation: slideUp 0.5s ease-out forwards; }
      .step-2 { animation: slideUp 0.5s ease-out 0.2s forwards; opacity: 0;}
      .step-3 { animation: slideUp 0.5s ease-out 0.4s forwards; opacity: 0;}
      .step-4 { animation: slideUp 0.5s ease-out 0.6s forwards; opacity: 0;}
    `}</style>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <line x1="10" y1="80" x2="90" y2="80" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <rect x="20" y="65" width="12" height="15" fill="#94a3b8" className="step-1" rx="1" />
      <rect x="36" y="50" width="12" height="30" fill="#64748b" className="step-2" rx="1" />
      <rect x="52" y="35" width="12" height="45" fill="#475569" className="step-3" rx="1" />
      <rect x="68" y="20" width="12" height="60" fill="#3b82f6" className="step-4" rx="1" />
    </svg>
  </div>
);

// Konstanten
const LEARN_AHEAD_LIMIT = 20 * 60 * 1000; // 20 minutes in milliseconds


const ContingencyHint = () => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <style>{`
      @keyframes blinkCell { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      .cell-blink { animation: blinkCell 2s infinite; }
    `}</style>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <rect x="25" y="25" width="50" height="50" fill="none" stroke="#475569" strokeWidth="2" rx="4" />
      <line x1="50" y1="25" x2="50" y2="75" stroke="#475569" strokeWidth="2" />
      <line x1="25" y1="50" x2="75" y2="50" stroke="#475569" strokeWidth="2" />
      <circle cx="37.5" cy="37.5" r="5" fill="#3b82f6" />
      <circle cx="62.5" cy="37.5" r="5" fill="#10b981" className="cell-blink" style={{ animationDelay: '0s' }} />
      <circle cx="37.5" cy="62.5" r="5" fill="#f59e0b" className="cell-blink" style={{ animationDelay: '1s' }} />
      <circle cx="62.5" cy="62.5" r="5" fill="#ef4444" />
    </svg>
  </div>
);

const HINT_COMPONENTS = {
  linear: LinearRegressionHint,
  normal: NormalDistributionHint,
  pvalue: PValueHint,
  sampling: SamplingHint,
  descriptive: DescriptiveHint,
  probability: ProbabilityHint,
  scale: ScaleHint,
  contingency: ContingencyHint
};

// --- GEMINI API HELPERS ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const fetchWithRetry = async (url, options, retries = 3) => {
  const delays = [1000, 3000, 6000];
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        console.error(`API Error ${response.status}:`, errorBody);
        if (response.status === 403) throw new Error('API-Schlüssel ungültig oder abgelaufen (403 Forbidden). Bitte prüfe deinen Gemini API Key.');
        if (response.status === 404) throw new Error('Modell nicht gefunden (404). Bitte prüfe den Modellnamen.');
        if (response.status === 429) {
          if (i < retries - 1) {
            await new Promise(res => setTimeout(res, delays[i]));
            continue;
          } else {
            throw new Error('Zu viele Anfragen (Google Rate Limit). Bitte warte 1-2 Minuten und versuche es erneut.');
          }
        }
        throw new Error(`API-Fehler: HTTP ${response.status}`);
      }
      return await response.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      if (e.message.includes('403') || e.message.includes('404')) throw e;
      await new Promise(res => setTimeout(res, delays[i]));
    }
  }
};

const callGemini = async (prompt, schema) => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Kein API-Schlüssel hinterlegt. Bitte trage deinen Gemini API Key in App.jsx ein (Zeile ~566).');
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  };

  const result = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text);
};

// --- KATEX MATH RENDERER ---
function MathHTML({ html, className, elementType = 'div' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && renderMathInElement) {
      renderMathInElement(containerRef.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
    }
  }, [html]);

  const Element = elementType;
  return <Element ref={containerRef} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

// --- MAIN APP COMPONENT ---

function App() {
  // --- Benutzer-State ---
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showImportPrompt, setShowImportPrompt] = useState(false);

  const [decks, setDecks] = useState(INITIAL_DECKS);
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [activeTab, setActiveTab] = useState('learn');
  const [userStats, setUserStats] = useState({ ...DEFAULT_STATS });

  // --- Tages-Lernziel ---
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  // --- Lerngruppe ---
  const [groupMembers, setGroupMembers] = useState([]);

  // Daten aus Supabase laden wenn User ausgewählt wird
  useEffect(() => {
    if (!currentUser || currentUser.id === 'local') return;

    setIsLoading(true);
    Promise.all([
      loadUserDecks(currentUser.id),
      loadUserStats(currentUser.id)
    ]).then(([loadedDecks, loadedStats]) => {
      setDecks(loadedDecks.length > 0 ? loadedDecks : INITIAL_DECKS);
      setUserStats({ ...DEFAULT_STATS, ...loadedStats });

      // Prüfen ob localStorage-Daten importiert werden sollten
      const hasLocalData = localStorage.getItem('braingains_decks') || localStorage.getItem('braingains_stats');
      const alreadyImported = localStorage.getItem('braingains_imported_' + currentUser.id);
      if (hasLocalData && !alreadyImported && loadedDecks.length === 0) {
        setShowImportPrompt(true);
      }

      setIsLoading(false);
    }).catch(err => {
      console.error('Fehler beim Laden der Daten:', err);
      // Fallback auf localStorage
      try {
        const savedDecks = localStorage.getItem('braingains_decks');
        if (savedDecks) setDecks(JSON.parse(savedDecks));
        const savedStats = localStorage.getItem('braingains_stats');
        if (savedStats) setUserStats({ ...DEFAULT_STATS, ...JSON.parse(savedStats) });
      } catch {}
      setIsLoading(false);
    });
  }, [currentUser]);

  // Lerngruppe laden wenn User ausgewählt wird
  useEffect(() => {
    if (!currentUser || currentUser.id === 'local') return;
    loadAllUsersWithStats().then(members => {
      setGroupMembers(members);
    }).catch(err => {
      console.error('Fehler beim Laden der Lerngruppe:', err);
    });
  }, [currentUser, userStats]);

  // Tages-Lernziel: Modal anzeigen wenn Fach geöffnet wird und noch kein Ziel gesetzt
  useEffect(() => {
    if (activeDeckId && userStats.todayGoalDate !== new Date().toDateString()) {
      setShowGoalModal(true);
      setGoalInput('');
    }
  }, [activeDeckId]);

  const handleGoalSubmit = (goal) => {
    setUserStats(prev => ({
      ...prev,
      todayGoalText: goal || '',
      todayGoalDate: new Date().toDateString()
    }));
    setShowGoalModal(false);
    setGoalInput('');
  };

  // localStorage-Import durchführen
  const handleImport = async () => {
    if (!currentUser || currentUser.id === 'local') return;
    const success = await importLocalStorageData(currentUser.id);
    if (success) {
      localStorage.setItem('braingains_imported_' + currentUser.id, 'true');
      // Daten neu laden
      const [newDecks, newStats] = await Promise.all([
        loadUserDecks(currentUser.id),
        loadUserStats(currentUser.id)
      ]);
      setDecks(newDecks.length > 0 ? newDecks : INITIAL_DECKS);
      setUserStats({ ...DEFAULT_STATS, ...newStats });
    }
    setShowImportPrompt(false);
  };

  // Persistenz: localStorage als Cache + debounced Supabase-Write
  const syncTimerDecks = useRef(null);
  const syncTimerStats = useRef(null);

  useEffect(() => {
    if (!currentUser || isLoading) return;
    localStorage.setItem('braingains_decks', JSON.stringify(decks));

    if (currentUser.id !== 'local') {
      if (syncTimerDecks.current) clearTimeout(syncTimerDecks.current);
      syncTimerDecks.current = setTimeout(() => {
        syncDecksToSupabase(currentUser.id, decks);
      }, 2000);
    }
    return () => { if (syncTimerDecks.current) clearTimeout(syncTimerDecks.current); };
  }, [decks]);

  useEffect(() => {
    if (!currentUser || isLoading) return;
    localStorage.setItem('braingains_stats', JSON.stringify(userStats));

    if (currentUser.id !== 'local') {
      if (syncTimerStats.current) clearTimeout(syncTimerStats.current);
      syncTimerStats.current = setTimeout(() => {
        saveUserStats(currentUser.id, userStats);
      }, 2000);
    }
    return () => { if (syncTimerStats.current) clearTimeout(syncTimerStats.current); };
  }, [userStats]);

  // Gamification Modals State
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const addXP = (amount, deckId = null) => {
    setUserStats(prev => {
      let newGlobalXp = prev.xp + amount;
      let newGlobalLevel = prev.level;
      let newAchievements = [...prev.achievements];
      const globalXpForNextLevel = newGlobalLevel * 100;

      const checkAndPush = (id) => {
        if (!newAchievements.includes(id)) {
          newAchievements.push(id);
          setTimeout(() => {
            setUnlockedAchievement(ACHIEVEMENT_DEFS[id]);
          }, 100);
        }
      };

      if (newGlobalXp >= globalXpForNextLevel) {
        newGlobalLevel += 1;
        newGlobalXp -= globalXpForNextLevel;
        setTimeout(() => {
          if (confetti) {
            confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
          }
        }, 100);
      }

      if (newGlobalLevel >= 5) checkAndPush('level_5');
      if (newGlobalLevel >= 10) checkAndPush('level_10');
      if (newGlobalLevel >= 25) checkAndPush('level_25');
      if (newGlobalLevel >= 50) checkAndPush('level_50');
      if (newGlobalLevel >= 100) checkAndPush('level_100');

      let newDeckStats = { ...prev.deckStats };
      if (deckId) {
        let deckStat = newDeckStats[deckId] || { xp: 0, level: 1 };
        let newDeckXp = deckStat.xp + amount;
        let newDeckLevel = deckStat.level;
        const deckXpForNextLevel = newDeckLevel * 100;

        if (newDeckXp >= deckXpForNextLevel) {
          newDeckLevel += 1;
          newDeckXp -= deckXpForNextLevel;
        }

        newDeckStats[deckId] = { xp: newDeckXp, level: newDeckLevel };
      }

      return { ...prev, xp: newGlobalXp, level: newGlobalLevel, deckStats: newDeckStats, achievements: newAchievements };
    });
  };

  const updateStudyStats = (quality) => {
    setUserStats(prev => {
      const today = new Date().toDateString();
      const lastStudyStr = prev.lastStudyDate ? new Date(prev.lastStudyDate).toDateString() : null;

      let newStreak = prev.streak;
      let newDailyCards = prev.dailyCardsLearned;
      let newPerfectStreak = quality >= 4 ? prev.perfectAnswersStreak + 1 : 0;
      let newTotalCards = (prev.totalCardsLearned || 0) + 1;
      let newEasy = (prev.totalEasy || 0) + (quality === 5 ? 1 : 0);
      let newGood = (prev.totalGood || 0) + (quality === 4 ? 1 : 0);
      let newHard = (prev.totalHard || 0) + (quality === 3 ? 1 : 0);
      let newAgain = (prev.totalAgain || 0) + (quality === 1 ? 1 : 0);
      let newAchievements = [...prev.achievements];

      if (lastStudyStr !== today) {
        newDailyCards = 1;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastStudyStr === yesterday.toDateString()) {
          newStreak += 1;
        } else if (lastStudyStr !== null) {
          newStreak = 1; // broken streak
        } else {
          newStreak = 1; // first time
        }
      } else {
        newDailyCards += 1;
      }

      // Check daily goal
      if (newDailyCards === prev.dailyGoal) {
        setTimeout(() => {
          if (confetti) {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.4 } });
          }
        }, 100);
      }

      // Check Achievements
      const checkAndPush = (id) => {
        if (!newAchievements.includes(id)) {
          newAchievements.push(id);
          // Set timeout to stagger achievements popovers if multiple unlocked at once
          setTimeout(() => {
            setUnlockedAchievement(ACHIEVEMENT_DEFS[id]);
          }, 100);
        }
      };

      if (newTotalCards >= 1) checkAndPush('first_steps');
      if (newTotalCards >= 50) checkAndPush('warmup');
      if (newTotalCards >= 100) checkAndPush('getting_serious');
      if (newTotalCards >= 500) checkAndPush('half_marathon');
      if (newTotalCards >= 1000) checkAndPush('marathon');
      if (newTotalCards >= 5000) checkAndPush('ultra_marathon');

      if (newStreak >= 3) checkAndPush('3_day_streak');
      if (newStreak >= 7) checkAndPush('7_day_streak');
      if (newStreak >= 14) checkAndPush('14_day_streak');
      if (newStreak >= 30) checkAndPush('30_day_streak');
      if (newStreak >= 100) checkAndPush('100_day_streak');

      if (newPerfectStreak >= 10) checkAndPush('perfect_10');
      if (newPerfectStreak >= 50) checkAndPush('perfect_50');
      if (newPerfectStreak >= 100) checkAndPush('perfect_100');

      if (quality === 1 && newTotalCards > 1) checkAndPush('first_lapse');
      if (newAgain >= 50) checkAndPush('persistence');
      if (newHard >= 100) checkAndPush('hard_worker');
      if (newGood >= 200) checkAndPush('good_job');
      if (newEasy >= 100) checkAndPush('easy_peasy');

      if (newDailyCards >= 50) checkAndPush('daily_50');
      if (newDailyCards >= 100) checkAndPush('daily_100');
      if (newDailyCards >= 200) checkAndPush('daily_200');
      if (newDailyCards >= 500) checkAndPush('daily_500');

      const hour = new Date().getHours();
      const day = new Date().getDay(); // 0 is Sunday, 6 is Saturday

      if (hour < 8) checkAndPush('early_bird');
      if (hour >= 8 && hour < 10) checkAndPush('morning_routine');
      if (hour >= 12 && hour < 14) checkAndPush('lunch_break');
      if (hour >= 15 && hour < 17) checkAndPush('afternoon_tea');
      if (hour >= 18 && hour < 20) checkAndPush('evening_study');
      if (hour >= 22) checkAndPush('night_owl');
      if (hour >= 0 && hour < 3) checkAndPush('midnight_hustle');

      if (day === 1) checkAndPush('monday_grind');
      if (day === 3) checkAndPush('hump_day');
      if (day === 5 && hour >= 18) checkAndPush('tgif');
      if (day === 0 || day === 6) checkAndPush('weekend_warrior');

      // Track daily activity
      const todayKey = new Date().toISOString().slice(0, 10);
      const activityLog = { ...(prev.activityLog || {}) };
      activityLog[todayKey] = (activityLog[todayKey] || 0) + 1;

      const newLongestStreak = Math.max(prev.longestStreak || 0, newStreak);

      return {
        ...prev,
        streak: newStreak,
        longestStreak: newLongestStreak,
        lastStudyDate: today,
        dailyCardsLearned: newDailyCards,
        perfectAnswersStreak: newPerfectStreak,
        totalCardsLearned: newTotalCards,
        totalEasy: newEasy,
        totalGood: newGood,
        totalHard: newHard,
        totalAgain: newAgain,
        activityLog,
        achievements: newAchievements
      };
    });
  };

  const activeDeck = decks.find(d => d.id === activeDeckId);
  const cards = activeDeck ? activeDeck.cards : [];

  // --- ANKI ALGORITHM & QUEUE LIMITS ---
  const LEARN_AHEAD_LIMIT = 20 * 60 * 1000; // 20 minutes

  // Calculate intervals for the 4 buttons (Again, Hard, Good, Easy) based on Anki logic
  const calculateNextIntervals = (card) => {
    const { state = 'new', step = 0, interval = 0, efactor = 2.5 } = card;
    const intervals = { 1: 0, 3: 0, 4: 0, 5: 0 }; // in days, if < 1 day, store as ms for display logic later

    if (state === 'new' || state === 'learning' || state === 'relearning') {
      // Learning steps: step 0 = 1 minute, step 1 = 10 minutes
      if (step === 0) {
        intervals[1] = 1 * 60 * 1000; // Again: 1 min
        intervals[3] = 6 * 60 * 1000; // Hard: 6 min
        intervals[4] = 10 * 60 * 1000; // Good: 10 min
        intervals[5] = 4 * 24 * 60 * 60 * 1000; // Easy: 4 days (graduates)
      } else {
        intervals[1] = 1 * 60 * 1000; // Again: 1 min (reset)
        intervals[3] = 10 * 60 * 1000; // Hard: repeat step
        intervals[4] = 1 * 24 * 60 * 60 * 1000; // Good: 1 day (graduates)
        intervals[5] = 4 * 24 * 60 * 60 * 1000; // Easy: 4 days (graduates)
      }
    } else { // Review state
      intervals[1] = 10 * 60 * 1000; // Again: 10 min (goes to relearning)
      intervals[3] = Math.max(1, Math.round(interval * 1.2)); // Hard: interval * 1.2
      intervals[4] = Math.max(1, Math.round(interval * efactor)); // Good: interval * efactor
      intervals[5] = Math.max(1, Math.round(interval * efactor * 1.3)); // Easy: interval * efactor * 1.3
    }

    return intervals;
  };

  const processCardReview = (cardId, quality) => {
    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id !== activeDeckId) return deck;

      const updatedCards = deck.cards.map(card => {
        if (card.id !== cardId) return card;

        let { state = 'new', step = 0, interval = 0, efactor = 2.5, history } = card;
        let nextInterval = 0; // ms or days
        const now = Date.now();
        const intervals = calculateNextIntervals(card);

        if (state === 'new' || state === 'learning' || state === 'relearning') {
          if (quality === 1) { // Again
            step = 0;
            nextInterval = intervals[1];
          } else if (quality === 3) { // Hard
            nextInterval = intervals[3];
          } else if (quality === 4) { // Good
            if (step === 0) {
              step = 1;
              state = state === 'new' ? 'learning' : state;
              nextInterval = intervals[4];
            } else {
              state = 'review';
              interval = 1; // 1 day graduation interval
              nextInterval = 1 * 24 * 60 * 60 * 1000;
            }
          } else if (quality === 5) { // Easy
            state = 'review';
            interval = 4; // 4 days easy interval
            nextInterval = 4 * 24 * 60 * 60 * 1000;
          }
        } else { // 'review'
          if (quality === 1) { // Again (Lapse)
            state = 'relearning';
            step = 0;
            efactor = Math.max(1.3, efactor - 0.2);
            interval = Math.max(1, Math.round(interval * 0.2)); // new interval starts at 20%
            nextInterval = intervals[1];
          } else {
            if (quality === 3) efactor = Math.max(1.3, efactor - 0.15); // Hard
            else if (quality === 5) efactor += 0.15; // Easy

            interval = intervals[quality] / (24 * 60 * 60 * 1000); // convert back to days for storage
            nextInterval = intervals[quality];
          }
        }

        return {
          ...card,
          state,
          step,
          interval,
          efactor,
          nextReviewDate: now + nextInterval,
          history: [...history, { date: now, quality }]
        };
      });
      return { ...deck, cards: updatedCards };
    }));

    // Award XP and Stats
    const xpGains = { 1: 1, 3: 4, 4: 7, 5: 10 };
    const earnedXp = xpGains[quality] || 1;
    addXP(earnedXp, activeDeckId);
    updateStudyStats(quality);
  };

  const setCardsForActiveDeck = (newCardsOrUpdater) => {
    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id !== activeDeckId) return deck;
      const updatedCards = typeof newCardsOrUpdater === 'function'
        ? newCardsOrUpdater(deck.cards)
        : newCardsOrUpdater;
      return { ...deck, cards: updatedCards };
    }));
  };

  // --- Render-Gate: User-Auswahl ---
  if (!currentUser) {
    return <UserSelect onUserSelected={setCurrentUser} />;
  }

  // --- Lade-Screen ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Daten werden geladen...</p>
        </div>
      </div>
    );
  }

  // --- Import-Dialog ---
  if (showImportPrompt) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-8 text-center">
          <h2 className="text-xl font-black text-white mb-3">Lokale Daten gefunden</h2>
          <p className="text-slate-400 text-sm mb-6">
            Wir haben Lernfortschritt in deinem Browser gefunden. Sollen diese Daten zu deinem Profil <strong className="text-white">{currentUser.name}</strong> importiert werden?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowImportPrompt(false)}
              className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Überspringen
            </button>
            <button
              onClick={handleImport}
              className="flex-1 px-4 py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-400 transition-colors cursor-pointer"
            >
              Importieren
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100 font-sans selection:bg-sky-500/30 relative z-0 overflow-hidden">
      <BGPattern variant="grid" mask="none" className="z-[-10]" fill="hsl(0 0% 40% / 0.35)" />
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {activeDeckId && (
              <button
                onClick={() => { setActiveDeckId(null); setActiveTab('learn'); }}
                className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                title="Zurück zur Fächer-Übersicht"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {!activeDeckId && <span className="font-bold text-base tracking-tight text-white shrink-0">Brain Gains</span>}
            {activeDeck && (
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-slate-300 truncate max-w-[80px] sm:max-w-xs hidden sm:block">{activeDeck.name}</span>
                {userStats.todayGoalText && userStats.todayGoalDate === new Date().toDateString() && (
                  <span className="hidden sm:flex items-center gap-1 text-xs text-sky-400/70 truncate max-w-[150px]">
                    <Target className="w-3 h-3 shrink-0" />
                    {userStats.todayGoalText}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Gamification Stats */}
            <button
              onClick={() => setShowStatsModal(true)}
              className="hidden md:flex items-center gap-4 mr-2 bg-slate-900/50 hover:bg-slate-800/50 transition-colors rounded-lg p-2 border border-slate-800 cursor-pointer text-left"
            >
              <div className="flex items-center gap-1.5" title="Dein Lern-Streak">
                <Flame className={`w-4 h-4 ${userStats.streak > 0 ? 'text-orange-500 fill-orange-500/20' : 'text-slate-600'}`} />
                <span className={`font-bold text-sm ${userStats.streak > 0 ? 'text-orange-400' : 'text-slate-500'}`}>{userStats.streak}</span>
              </div>
              <div className="w-px h-4 bg-slate-700"></div>
              <div className="flex items-center gap-2" title="Dein Level und Erfahrungspunkte (XP)">
                <div className="bg-sky-500/20 text-sky-300 font-bold text-xs px-1.5 py-0.5 rounded">Lvl {userStats.level}</div>
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(userStats.xp / (userStats.level * 100)) * 100}%` }}></div>
                </div>
                <span className="text-xs text-slate-400 font-medium">{userStats.xp}/{userStats.level * 100}XP</span>
              </div>
            </button>
            {activeDeckId ? (
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] md:relative md:bottom-auto md:left-auto md:translate-x-0 w-max">
                <AppleDock iconMagnification={60} iconDistance={140} className="mx-0 mt-0">
                  <AppleDockIcon active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} aria-label="Lernen" colorName="blue">
                    <RefreshCcw className="w-5 h-5" />
                  </AppleDockIcon>
                  <AppleDockIcon active={activeTab === 'cards'} onClick={() => setActiveTab('cards')} aria-label="Karten" colorName="amber">
                    <Library className="w-5 h-5" />
                  </AppleDockIcon>
                  <AppleDockIcon active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} aria-label="Statistiken" colorName="emerald">
                    <BarChart3 className="w-5 h-5" />
                  </AppleDockIcon>
                  <AppleDockIcon active={activeTab === 'exam'} onClick={() => setActiveTab('exam')} aria-label="Klausuren" colorName="rose">
                    <GraduationCap className="w-5 h-5" />
                  </AppleDockIcon>
                </AppleDock>
              </div>
            ) : (
              <div className="text-sm text-slate-400 font-medium hidden sm:block">Dashboard</div>
            )}

            {/* User-Profil / Logout */}
            {currentUser && currentUser.id !== 'local' && (
              <button
                onClick={() => { setCurrentUser(null); setActiveDeckId(null); setActiveTab('learn'); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-400 hover:text-white transition-all text-xs font-bold cursor-pointer"
                title="Benutzer wechseln"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{currentUser.name}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!activeDeckId ? (
          <DashboardTab decks={decks} setDecks={setDecks} onSelectDeck={setActiveDeckId} parseFlashcards={parseFlashcards} shuffleArray={shuffleArray} userStats={userStats} groupMembers={groupMembers} currentUser={currentUser} />
        ) : (
          <>
            {activeTab === 'learn' && <LearnTab cards={cards} onReview={processCardReview} userStats={userStats} calculateNextIntervals={calculateNextIntervals} LEARN_AHEAD_LIMIT={LEARN_AHEAD_LIMIT} />}
            {activeTab === 'cards' && <CardManagementTab cards={cards} setCards={setCardsForActiveDeck} />}
            {activeTab === 'stats' && <StatsTab cards={cards} userStats={userStats} />}
            {activeTab === 'exam' && <ExamTab cards={cards} deckName={activeDeck.name} addXP={(amount) => addXP(amount, activeDeckId)} activeDeck={activeDeck} setDecks={setDecks} setUserStats={setUserStats} />}
          </>
        )}
      </main>

      {/* Gamification Modals */}
      {unlockedAchievement && (
        <AchievementPopup
          achievement={unlockedAchievement}
          onClose={() => setUnlockedAchievement(null)}
        />
      )}

      {showStatsModal && (
        <GamificationModal
          userStats={userStats}
          deckStats={activeDeckId && userStats.deckStats ? userStats.deckStats[activeDeckId] : null}
          currentDeckName={activeDeck ? activeDeck.name : null}
          onClose={() => setShowStatsModal(false)}
        />
      )}

      {/* Tages-Lernziel Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => { handleGoalSubmit(''); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-sky-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Was lernst du heute?</h3>
              </div>
              <input
                type="text"
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && goalInput.trim()) handleGoalSubmit(goalInput.trim()); }}
                placeholder="z.B. Kapitel 3 wiederholen"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 mb-4 text-sm"
                autoFocus
              />
              <button
                onClick={() => { if (goalInput.trim()) handleGoalSubmit(goalInput.trim()); }}
                disabled={!goalInput.trim()}
                className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 px-6 rounded-xl transition-colors mb-2"
              >
                Los geht's
              </button>
              <button
                onClick={() => handleGoalSubmit('')}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-300 transition-colors py-1"
              >
                Überspringen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- GAMIFICATION COMPONENTS ---
function AchievementPopup({ achievement, onClose }) {
  const Icon = achievement.icon;
  useEffect(() => {
    if (confetti) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#FFD700', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'] });
      setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 }, angle: 60 }), 400);
      setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 }, angle: 120 }), 400);
    }
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <SparklesCore id="achievement-sparkles" background="transparent" minSize={0.8} maxSize={3} particleDensity={150} className="w-full h-full" particleColor="#FFD700" speed={1} />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 p-8 sm:p-12 rounded-3xl shadow-[0_0_80px_rgba(255,215,0,0.2)] flex flex-col items-center max-w-sm w-full mx-4 relative z-10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent pointer-events-none" />
          
          <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-8 bg-slate-800 border-[4px] border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.5)] ${achievement.color} relative`}>
            {/* GlowingEffect entfernt für Performance */}
            <Icon className="w-14 h-14 relative z-10 drop-shadow-lg" />
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2 text-center tracking-tight drop-shadow-md">Erfolg freigeschaltet!</h2>
          <h3 className={`text-xl font-bold mb-3 text-center ${achievement.color} drop-shadow-md`}>{achievement.title}</h3>
          <p className="text-slate-300 text-center mb-10 font-medium">{achievement.desc}</p>
          
          <button onClick={onClose} className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95 text-lg relative z-20">
            Klasse!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function GamificationModal({ userStats, deckStats, currentDeckName, onClose }) {
  const globalLevel = userStats.level;
  const globalXpReq = globalLevel * 100;

  const deckLevel = deckStats ? deckStats.level : 1;
  const deckXp = deckStats ? deckStats.xp : 0;
  const deckXpReq = deckLevel * 100;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <SparklesCore id="gamification-sparkles" background="transparent" minSize={0.4} maxSize={1.5} particleDensity={80} className="w-full h-full" particleColor="#818CF8" speed={0.5} />
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.2)] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative z-10"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 drop-shadow-md">
            <Award className="w-7 h-7 text-sky-400" />
            Dein Lern-Profil
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">

          {/* Level Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
              {/* GlowingEffect entfernt für Performance */}
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Globales Level</span>
                  <span className="text-3xl font-black text-sky-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]">Lvl {globalLevel}</span>
                </div>
                <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden mb-3 border border-slate-700 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(userStats.xp / globalXpReq) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-sky-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                  />
                </div>
                <div className="flex justify-between text-sm text-slate-400 font-medium">
                  <span>{userStats.xp} XP</span>
                  <span>Noch {globalXpReq - userStats.xp} XP</span>
                </div>
              </div>
            </div>

            <div className="relative group bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
              {/* GlowingEffect entfernt für Performance */}
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest line-clamp-1 mr-2" title={currentDeckName || 'Fach-Level'}>
                    {currentDeckName || 'Fach-Level'}
                  </span>
                  <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">Lvl {deckLevel}</span>
                </div>
                {currentDeckName ? (
                  <>
                    <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden mb-3 border border-slate-700 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(deckXp / deckXpReq) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                      />
                    </div>
                    <div className="flex justify-between text-sm text-slate-400 font-medium">
                      <span>{deckXp} XP</span>
                      <span>Noch {deckXpReq - deckXp} XP</span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-slate-500 flex items-center h-full pb-6 font-medium">
                    Wähle ein Fach, um deinen spezifischen Fortschritt zu sehen.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Übersicht</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/50 flex flex-col items-center justify-center text-center">
                <Flame className="w-6 h-6 text-orange-400 mb-2" />
                <span className="text-2xl font-bold text-white">{userStats.streak}</span>
                <span className="text-xs text-slate-400">Tage-Streak</span>
              </div>
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/50 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-6 h-6 text-blue-400 mb-2" />
                <span className="text-2xl font-bold text-white">{userStats.totalCardsLearned || 0}</span>
                <span className="text-xs text-slate-400">Karten gelernt</span>
              </div>
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/50 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-6 h-6 text-emerald-400 mb-2" />
                <span className="text-2xl font-bold text-white">{userStats.perfectAnswersStreak || 0}</span>
                <span className="text-xs text-slate-400">Perfekte Serie</span>
              </div>
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/50 flex flex-col items-center justify-center text-center">
                <Award className="w-6 h-6 text-purple-400 mb-2" />
                <span className="text-2xl font-bold text-white">{userStats.achievements.length}</span>
                <span className="text-xs text-slate-400">Abzeichen</span>
              </div>
            </div>
          </div>

          {/* Achievements Wall */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Trophäenwand</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Object.entries(ACHIEVEMENT_DEFS).map(([id, def]) => {
                const isUnlocked = userStats.achievements.includes(id);
                const Icon = def.icon;
                return (
                  <div key={id} className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${isUnlocked ? 'bg-slate-800/80 border-slate-700 shadow-sm' : 'bg-slate-900/50 border-slate-800/50 opacity-60 grayscale'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isUnlocked ? 'bg-slate-900' : 'bg-slate-800/50'}`}>
                      <Icon className={`w-6 h-6 ${isUnlocked ? def.color : 'text-slate-600'}`} />
                    </div>
                    <span className={`text-xs font-bold mb-1 ${isUnlocked ? 'text-slate-200' : 'text-slate-500'}`}>{def.title}</span>
                    <span className="text-[10px] text-slate-500 leading-tight">{def.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

// --- DASHBOARD TAB (Multi-Deck Management) ---
function DashboardTab({ decks, setDecks, onSelectDeck, parseFlashcards, shuffleArray, userStats, groupMembers, currentUser }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckCards, setNewDeckCards] = useState('');
  const [importingTo, setImportingTo] = useState(null);
  const [importText, setImportText] = useState('');

  const createDeck = () => {
    if (!newDeckName.trim()) return;
    let cards = [];
    if (newDeckCards.trim()) {
      try {
        cards = shuffleArray(parseFlashcards(newDeckCards));
        const offset = Date.now();
        cards = cards.map((c, i) => ({ ...c, id: c.id + '-' + offset + '-' + i }));
      } catch (e) {
        alert('Fehler beim Parsen der Karteikarten. Bitte überprüfe das Format.');
        return;
      }
    }
    const newDeck = {
      id: 'deck-' + Date.now(),
      name: newDeckName.trim(),
      cards,
      createdAt: Date.now()
    };
    setDecks(prev => [...prev, newDeck]);
    setNewDeckName('');
    setNewDeckCards('');
    setIsCreating(false);
    if (cards.length > 0) alert(cards.length + ' Karten wurden dem neuen Fach hinzugefügt!');
  };

  const deleteDeck = (deckId) => {
    if (confirm("Möchtest du dieses Fach wirklich löschen? Alle Lernfortschritte und Karten gehen verloren.")) {
      setDecks(prev => prev.filter(d => d.id !== deckId));
    }
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    try {
      const parsedCards = shuffleArray(parseFlashcards(importText));

      setDecks(prev => prev.map(deck => {
        if (deck.id !== importingTo) return deck;
        // make sure ids are completely unique across deck lifetime
        const offset = Date.now();
        const newCardsWithUniqueIds = parsedCards.map((c, i) => ({ ...c, id: c.id + '-' + offset + '-' + i }));
        return {
          ...deck,
          cards: [...deck.cards, ...newCardsWithUniqueIds]
        };
      }));
      setImportText('');
      setImportingTo(null);
      alert(parsedCards.length + " Karten wurden erfolgreich importiert!");
    } catch (e) {
      alert("Fehler beim Importieren der Karten. Bitte überprüfe das Format.");
    }
  };

  const downloadDeck = (deck) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deck));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", deck.name + "-karten.json");
    dlAnchorElem.click();
  };

  const handleFileUpload = (e, targetDeckId = null) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const isJson = file.name.endsWith('.json');

      if (isJson) {
        // JSON import: either a full deck object or an array of cards
        try {
          const parsed = JSON.parse(content);
          if (parsed.name && Array.isArray(parsed.cards)) {
            parsed.id = 'deck-' + Date.now();
            setDecks(prev => [...prev, parsed]);
            alert('Fach "' + parsed.name + '" erfolgreich importiert!');
          } else {
            alert('Ungültiges JSON-Format.');
          }
        } catch (err) {
          alert('Fehler beim Lesen der JSON-Datei.');
        }
      } else {
        // TXT/TSV import: parse as flashcard text
        try {
          const parsedCards = shuffleArray(parseFlashcards(content));
          if (parsedCards.length === 0) {
            alert('Keine Karten in der Datei gefunden.');
            return;
          }
          const offset = Date.now();
          const cardsWithIds = parsedCards.map((c, i) => ({ ...c, id: c.id + '-' + offset + '-' + i }));

          if (targetDeckId) {
            // Import into existing deck
            setDecks(prev => prev.map(deck => {
              if (deck.id !== targetDeckId) return deck;
              return { ...deck, cards: [...deck.cards, ...cardsWithIds] };
            }));
            alert(cardsWithIds.length + ' Karten wurden importiert!');
          } else {
            // Create new deck from file
            const deckName = file.name.replace(/\.(txt|tsv)$/i, '').replace(/_/g, ' ');
            const newDeck = {
              id: 'deck-' + Date.now(),
              name: deckName,
              cards: cardsWithIds,
              createdAt: Date.now()
            };
            setDecks(prev => [...prev, newDeck]);
            alert('Neues Fach "' + deckName + '" mit ' + cardsWithIds.length + ' Karten erstellt!');
          }
        } catch (err) {
          alert('Fehler beim Parsen der Datei: ' + err.message);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Hero Section — Landing Page Style */}
      <div className="relative flex flex-col items-center justify-center text-center pt-4 sm:pt-8 pb-2 sm:pb-6 overflow-hidden">
        {/* Gradient Glow hinter der Überschrift */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
        {/* Hero Content */}
        <div className="relative z-20 px-4">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-sky-400/80 mb-2 sm:mb-3">Dein Kopf kennt kein Limit.</p>
          {/* Überschrift mit Partikel-Frame */}
          <div className="relative inline-flex items-center justify-center px-12 sm:px-24 py-6 sm:py-10 mb-3 sm:mb-4" style={{ minHeight: '90px' }}>
            <ParticleFrameEffect borderRadius={24} thickness={5} />
            <h1 className="relative z-10 text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 leading-none whitespace-nowrap">
              Brain Gains
            </h1>
          </div>
          <p className="text-base sm:text-lg text-slate-400 max-w-md mx-auto mb-6 sm:mb-8 leading-relaxed">
            Karteikarten auf Steroiden. Spaced Repetition, KI-Prüfungen & Gamification — alles in einer App.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsCreating(true)}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" /> Neues Fach
            </button>
            <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center gap-2 border border-white/10 hover:border-white/20 backdrop-blur-sm">
              <Upload className="w-4 h-4" /> Importieren
              <input type="file" accept=".json,.txt,.tsv" onChange={(e) => handleFileUpload(e)} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Fächer-Bereich */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Deine Fächer</h2>
      </div>

      {isCreating && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Name des neuen Fachs</label>
            <input
              autoFocus
              type="text"
              value={newDeckName}
              onChange={e => setNewDeckName(e.target.value)}
              placeholder="z.B. Kosten-Leistungs-Rechnung"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
              onKeyDown={e => e.key === 'Enter' && !newDeckCards && createDeck()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Karteikarten direkt hinzufügen <span className="text-slate-500">(optional)</span></label>
            <p className="text-xs text-slate-500 mb-2">Paste Tab-getrennte Daten ein: <code className="bg-slate-800 text-amber-400 px-1 py-0.5 rounded">Frage [TAB] Antwort [TAB] Lektion/Kategorie</code></p>
            <textarea
              rows="5"
              value={newDeckCards}
              onChange={e => setNewDeckCards(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              placeholder={"Frage 1\tAntwort 1\tLektion 1\nFrage 2\tAntwort 2\tLektion 1"}
            ></textarea>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-slate-500">oder:</span>
              <label className="cursor-pointer text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1">
                <Upload className="w-3 h-3" /> TXT/TSV-Datei laden
                <input type="file" accept=".txt,.tsv" onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setNewDeckCards(ev.target.result);
                    if (!newDeckName.trim()) {
                      setNewDeckName(file.name.replace(/\.(txt|tsv)$/i, '').replace(/_/g, ' '));
                    }
                  };
                  reader.readAsText(file);
                  e.target.value = '';
                }} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={createDeck} className="bg-emerald-600 hover:bg-emerald-500 w-full sm:w-auto text-white font-bold py-3 px-6 rounded-xl transition-colors">
              {newDeckCards.trim() ? 'Erstellen & Karten laden' : 'Speichern'}
            </button>
            <button onClick={() => { setIsCreating(false); setNewDeckCards(''); setNewDeckName(''); }} className="bg-slate-800 hover:bg-slate-700 w-full sm:w-auto text-slate-300 font-bold py-3 px-6 rounded-xl transition-colors">
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {importingTo && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl mb-8">
          <h3 className="text-xl font-bold text-white mb-2">Karten einfügen</h3>
          <p className="text-slate-400 mb-4 text-sm">Füge Tab-getrennte Daten ein: <code className="bg-slate-800 text-amber-400 px-1 py-0.5 rounded">Frage [TAB] Antwort [TAB] Lektion</code></p>
          <textarea
            rows="6"
            value={importText}
            onChange={e => setImportText(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2"
            placeholder={"Frage 1\tAntwort 1\tLektion 1\nFrage 2\tAntwort 2\tLektion 1"}
          ></textarea>
          <div className="flex items-center justify-between">
            <label className="cursor-pointer text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1">
              <Upload className="w-3 h-3" /> oder TXT/TSV-Datei laden
              <input type="file" accept=".txt,.tsv" onChange={(e) => handleFileUpload(e, importingTo)} className="hidden" />
            </label>
            <div className="flex gap-3">
              <button onClick={() => { setImportingTo(null); setImportText(''); }} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-6 rounded-xl transition-colors">
                Abbrechen
              </button>
              <button onClick={handleImport} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-xl transition-colors">
                Importieren
              </button>
            </div>
          </div>
        </div>
      )}

      {decks.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800/50 rounded-3xl border-dashed mb-12">
          <p className="text-slate-500">Du hast noch keine Fächer angelegt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {decks.map(deck => {
            const dueCards = deck.cards.filter(c => c.nextReviewDate <= Date.now()).length;
            const learnedCount = deck.cards.filter(c => c.history && c.history.length > 0).length;
            const progress = deck.cards.length > 0 ? Math.round((learnedCount / deck.cards.length) * 100) : 0;

            return (
              <div key={deck.id} className="group bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl hover:shadow-sky-500/10 flex flex-col h-full relative cursor-pointer" onClick={() => onSelectDeck(deck.id)}>
                {/* GlowingEffect entfernt für Performance */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center">
                    <Library className="w-6 h-6 text-sky-400" />
                  </div>

                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setImportingTo(deck.id)} title="Karten per Text einfügen" className="p-2 text-slate-400 hover:text-emerald-400 transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <label title="TXT/TSV-Datei importieren" className="p-2 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <input type="file" accept=".txt,.tsv" onChange={(e) => handleFileUpload(e, deck.id)} className="hidden" />
                    </label>
                    <button onClick={() => downloadDeck(deck)} title="Als JSON Exportieren / Teilen" className="p-2 text-slate-400 hover:text-blue-400 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteDeck(deck.id)} title="Fach löschen" className="p-2 text-slate-400 hover:text-rose-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">{deck.name}</h3>
                <p className="text-sm text-slate-400 mb-6">{deck.cards.length} Karten gesamt</p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
                  <div className="flex flex-col">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <RefreshCcw className="w-3 h-3" /> {dueCards} Karten fällig
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 font-medium tracking-wider uppercase mb-1">Gesamtfortschritt</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      {progress}% <Sparkles className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Gamification Dashboard Summary (Mobile visible too) */}
      <div className="border-t border-slate-800 pt-8 mt-8">
        <h3 className="text-xl font-bold text-white mb-6">Dein Lernfortschritt</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <Flame className={`w-8 h-8 mb-2 ${userStats.streak > 0 ? 'text-orange-500' : 'text-slate-600'}`} />
            <span className="text-2xl font-bold text-white">{userStats.streak} <span className="text-sm font-normal text-slate-400">Tage</span></span>
            <span className="text-xs text-slate-500 font-medium mt-1">Lern-Streak</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <Star className="w-8 h-8 mb-2 text-sky-400" />
            <span className="text-2xl font-bold text-white">{userStats.level}</span>
            <span className="text-xs text-slate-500 font-medium mt-1">Aktuelles Level</span>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(userStats.xp / (userStats.level * 100)) * 100}%` }}></div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <BrainCircuit className="w-8 h-8 mb-2 text-emerald-400" />
            <span className="text-2xl font-bold text-white">{userStats.dailyCardsLearned} <span className="text-sm font-normal text-slate-400">/ {userStats.dailyGoal}</span></span>
            <span className="text-xs text-slate-500 font-medium mt-1">Tagesziel Karten</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <Trophy className="w-8 h-8 mb-2 text-amber-400" />
            <span className="text-2xl font-bold text-white">{userStats.achievements.length}</span>
            <span className="text-xs text-slate-500 font-medium mt-1">Abzeichen gesammelt</span>
          </div>
        </div>
      </div>

      {/* Lerngruppe-Sektion */}
      {groupMembers.length > 0 && (
        <div className="border-t border-slate-800 pt-8 mt-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-sky-400" />
            Deine Lerngruppe
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupMembers.map(member => {
              const isCurrentUser = currentUser && member.id === currentUser.id;
              const isLearningToday = member.stats.todayGoalDate === new Date().toDateString();
              const memberStreak = member.stats.streak || 0;

              return (
                <div
                  key={member.id}
                  className={`bg-slate-900 border rounded-2xl p-4 flex items-center gap-4 transition-all ${
                    isCurrentUser
                      ? 'border-sky-500/50 ring-1 ring-sky-500/20'
                      : 'border-slate-800'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isCurrentUser ? 'bg-sky-500/20' : 'bg-slate-800'
                  }`}>
                    <User className={`w-5 h-5 ${isCurrentUser ? 'text-sky-400' : 'text-slate-400'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm truncate ${isCurrentUser ? 'text-sky-300' : 'text-white'}`}>
                        {member.name}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded font-bold shrink-0">Du</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {memberStreak > 0 && (
                        <span className="flex items-center gap-1 text-xs text-orange-400">
                          <Flame className="w-3 h-3" />
                          {memberStreak} Tage
                        </span>
                      )}
                      {isLearningToday && (
                        <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full">
                          <Activity className="w-3 h-3" />
                          Lernt gerade
                        </span>
                      )}
                      {!isLearningToday && memberStreak === 0 && (
                        <span className="text-xs text-slate-500">Noch kein Streak</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// --- TAB COMPONENTS ---

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active
        ? 'bg-sky-500/10 text-sky-400'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function LearnTab({ cards, onReview, userStats, calculateNextIntervals, LEARN_AHEAD_LIMIT }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Alle Themen');
  const now = Date.now();

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(45);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerInputMin, setTimerInputMin] = useState(45);
  const [dailyGoalDismissed, setDailyGoalDismissed] = useState(false);
  const timerRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev === 0) {
            setTimerMinutes(m => {
              if (m === 0) {
                // Timer done!
                clearInterval(timerRef.current);
                setTimerRunning(false);
                // Play notification
                try {
                  const ctx = new (window.AudioContext || window.webkitAudioContext)();
                  const osc = ctx.createOscillator();
                  const gain = ctx.createGain();
                  osc.connect(gain);
                  gain.connect(ctx.destination);
                  osc.frequency.value = 880;
                  gain.gain.value = 0.3;
                  osc.start();
                  osc.stop(ctx.currentTime + 0.5);
                } catch (e) { }
                if (confetti) {
                  confetti({ particleCount: 100, spread: 70, origin: { y: 0.3 } });
                }
                alert('⏰ Deine Lernzeit ist um! Zeit für eine Pause.');
                return 0;
              }
              return m - 1;
            });
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const resetTimer = (mins) => {
    setTimerRunning(false);
    setTimerMinutes(mins);
    setTimerSeconds(0);
    setTimerInputMin(mins);
  };

  const timerDisplay = `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`;
  const timerTotalInitial = timerInputMin * 60;
  const timerTotalCurrent = timerMinutes * 60 + timerSeconds;
  const timerProgress = timerTotalInitial > 0 ? ((timerTotalInitial - timerTotalCurrent) / timerTotalInitial) * 100 : 0;

  const topics = ['Alle Themen', ...new Set(cards.map(c => c.topic))];

  const allDueCards = cards.filter(c => c.nextReviewDate <= now + LEARN_AHEAD_LIMIT);
  const dueCardsUnsorted = selectedTopic === 'Alle Themen' ? allDueCards : allDueCards.filter(c => c.topic === selectedTopic);

  const getPriority = (state = 'new') => {
    if (state === 'learning' || state === 'relearning') return 1;
    if (state === 'review') return 2;
    return 3;
  };

  const dueCards = [...dueCardsUnsorted].sort((a, b) => {
    const isDueA = a.nextReviewDate <= now;
    const isDueB = b.nextReviewDate <= now;

    // 1. Karten, die WIRKLICH JETZT fällig sind, kommen strikt VOR Karten in der Zukunft (Learn Ahead)
    if (isDueA && !isDueB) return -1;
    if (!isDueA && isDueB) return 1;

    // 2. Wenn beide JETZT fällig sind: Nach Prio sortieren (Lernen > Wiederholen > Neu)
    if (isDueA && isDueB) {
      const pA = getPriority(a.state);
      const pB = getPriority(b.state);
      if (pA !== pB) return pA - pB;
    }

    // 3. Fallback: Chronologisch (die Karte, die früher dran ist, kommt zuerst)
    return a.nextReviewDate - b.nextReviewDate;
  });

  const currentCard = dueCards[0];

  const newCardsCount = dueCardsUnsorted.filter(c => (c.state || 'new') === 'new').length;
  const learningCardsCount = dueCardsUnsorted.filter(c => c.state === 'learning' || c.state === 'relearning').length;
  const reviewCardsCount = dueCardsUnsorted.filter(c => c.state === 'review').length;

  const intervals = currentCard ? calculateNextIntervals(currentCard) : null;

  const formatInterval = (ms) => {
    const min = Math.round(ms / 60000);
    if (min < 1) return '< 1 Min';
    if (min < 60) return `${min} Min`;
    const hours = Math.round(min / 60);
    if (hours < 24) return `${hours} Std`;
    const days = Math.round(hours / 24);
    if (days === 1) return '1 Tag';
    if (days < 30) return `${days} Tage`;
    const months = Math.round(days / 30);
    if (months === 1) return '1 Monat';
    return `${months} Monate`;
  };

  const handleReview = (quality) => {
    onReview(currentCard.id, quality);
    setIsFlipped(false);
  };

  // Timer Component (reused in both states)
  const TimerWidget = () => (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (timerMinutes === 0 && timerSeconds === 0) {
              resetTimer(timerInputMin);
            }
            setTimerRunning(r => !r);
          }}
          className={`p-1.5 rounded-lg transition-colors ${timerRunning ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}
          title={timerRunning ? 'Stopp' : 'Start'}
        >
          {timerRunning
            ? <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
            : <Play className="w-3.5 h-3.5" fill="currentColor" />
          }
        </button>
        <button
          onClick={() => setTimerOpen(o => !o)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors text-sm font-mono font-bold ${timerRunning ? 'text-white bg-slate-800' : 'text-slate-400 bg-slate-800/50 hover:bg-slate-800'}`}
        >
          <Clock className="w-3.5 h-3.5" />
          {timerDisplay}
          <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${timerOpen ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Timer Dropdown */}
      {timerOpen && (
        <div className="absolute top-full left-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl z-50 w-56 animate-in slide-in-from-top-2 duration-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Timer einstellen</p>

          {/* Progress bar */}
          {timerProgress > 0 && (
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-sky-500 rounded-full transition-all duration-1000" style={{ width: `${timerProgress}%` }} />
            </div>
          )}

          {/* Quick presets */}
          <div className="flex gap-2 mb-3">
            {[15, 25, 30, 45, 60].map(m => (
              <button
                key={m}
                onClick={() => resetTimer(m)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${timerInputMin === m && !timerRunning ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="180"
              value={timerInputMin}
              onChange={e => {
                const v = Math.max(1, Math.min(180, parseInt(e.target.value) || 1));
                setTimerInputMin(v);
              }}
              className="w-16 bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <span className="text-xs text-slate-500">Min</span>
            <button
              onClick={() => resetTimer(timerInputMin)}
              className="ml-auto bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              Setzen
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (!currentCard) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Topic Filter + Timer on empty state */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none text-sm font-medium"
              >
                {topics.map(t => (
                  <option key={t} value={t}>
                    {t}{t !== 'Alle Themen' ? ` (${allDueCards.filter(c => c.topic === t).length} fällig)` : ` (${allDueCards.length} fällig)`}
                  </option>
                ))}
              </select>
            </div>
            <TimerWidget />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
            <Award className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Alles erledigt!</h2>
          <p className="text-slate-400 max-w-md">
            {selectedTopic === 'Alle Themen'
              ? 'Du hast alle fälligen Karteikarten für heute gelernt. Komm später zurück oder starte eine Probeklausur.'
              : `Keine fälligen Karten mehr in "${selectedTopic}". Wähle ein anderes Thema oder lerne später weiter.`
            }
          </p>
          {selectedTopic !== 'Alle Themen' && allDueCards.length > 0 && (
            <button
              onClick={() => setSelectedTopic('Alle Themen')}
              className="mt-6 bg-sky-600 hover:bg-sky-500 text-white font-medium py-2 px-5 rounded-xl transition-colors text-sm"
            >
              Alle Themen anzeigen ({allDueCards.length} fällig)
            </button>
          )}
        </div>
      </div>
    );
  }

  const HintGraphic = HINT_COMPONENTS[currentCard.hintType] || HINT_COMPONENTS['normal'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto flex flex-col items-center"
    >
      {/* Daily Goal Alert */}
      {userStats.dailyCardsLearned >= userStats.dailyGoal && !dailyGoalDismissed && (
        <div className="w-full mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-in slide-in-from-top-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <Star className="w-4 h-4 fill-emerald-500/30" /> Tagesziel erreicht! Stark gemacht.
          <button
            onClick={() => setDailyGoalDismissed(true)}
            className="ml-auto p-1 rounded-lg hover:bg-emerald-500/20 transition-colors"
            title="Schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter + Counter + Timer */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 px-2">
        {/* Topic Filter */}
        <div className="relative w-full sm:w-56 group shrink-0">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4 group-hover:text-sky-400 transition-colors" />
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2 hover:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none text-sm font-medium transition-colors cursor-pointer shadow-lg"
          >
            {topics.map(t => (
              <option key={t} value={t}>
                {t}{t !== 'Alle Themen' ? ` (${allDueCards.filter(c => c.topic === t).length})` : ''}
              </option>
            ))}
          </select>
        </div>
        {/* Counter + Timer — immer nebeneinander */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-3 text-sm sm:text-base font-bold bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 shadow-lg cursor-default">
            <span className={`text-blue-400 transition-transform ${currentCard?.state === 'new' ? 'scale-110 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]' : ''}`} title="Neu">{newCardsCount}</span>
            <span className="text-slate-700 font-normal">/</span>
            <span className={`text-rose-400 transition-transform ${currentCard?.state === 'learning' || currentCard?.state === 'relearning' ? 'scale-110 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]' : ''}`} title="Lernen">{learningCardsCount}</span>
            <span className="text-slate-700 font-normal">/</span>
            <span className={`text-emerald-400 transition-transform ${currentCard?.state === 'review' ? 'scale-110 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : ''}`} title="Wiederholen">{reviewCardsCount}</span>
          </div>
          <TimerWidget />
        </div>
      </div>

      <div className="relative w-full h-[50vh] min-h-[320px] sm:min-h-0 sm:h-[500px] md:h-[550px] md:aspect-video mt-2 z-10" style={{ perspective: "1000px" }}>
        <motion.div
           className="relative w-full h-full preserve-3d cursor-pointer will-change-transform"
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
           onClick={() => !isFlipped && setIsFlipped(true)}
        >
          {/* FRONT */}
          <div className={`absolute w-full h-full backface-hidden rounded-3xl ${isFlipped ? 'pointer-events-none' : ''}`}>
            <GlowingEffect spread={60} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} variant="default" />
            <div className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col items-center group overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent rounded-3xl pointer-events-none z-0" />

            <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 py-4">
              <div className="mb-6 sm:mb-10 opacity-70 group-hover:opacity-100 transition-opacity transform group-hover:scale-105 duration-500">
                <HintGraphic className="w-16 h-16 sm:w-20 sm:h-20" />
              </div>

              <MathHTML
                elementType="h3"
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 leading-snug sm:leading-tight card-html text-center px-4"
                html={currentCard.question}
              />
            </div>

            <div className="w-full flex justify-center pb-2 relative z-10 mt-auto shrink-0">
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-sky-400/80 animate-pulse group-hover:text-sky-400 transition-colors">Tippen zum Aufdecken</span>
            </div>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute w-full h-full backface-hidden rounded-3xl" style={{ transform: "rotateY(180deg)" }}>
            <div className="absolute inset-0 bg-slate-900 border-[1.5px] border-sky-500/40 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(56,189,248,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-900/30 to-slate-900/50 rounded-3xl pointer-events-none z-0" />
            
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col overflow-y-auto relative z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex items-center justify-between mb-6 shrink-0 px-2 pt-2">
                <div className="text-sm font-black uppercase tracking-widest text-sky-400 drop-shadow-md flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" /> Lösung
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-all px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 cursor-pointer group"
                >
                  <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-700" />
                  Karte drehen
                </button>
              </div>
              <MathHTML
                elementType="div"
                className="text-lg sm:text-xl md:text-2xl text-slate-100 font-medium leading-relaxed card-html px-2 pb-8 flex-1 relative"
                html={currentCard.answer}
              />
            </div>

            {/* Fade-out gradient am unteren Rand */}
            <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none">
              <div className="h-16 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent rounded-b-3xl" />
            </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bereich unter der Karte — immer gleiche Höhe für konsistentes Scrollen */}
      <div className="w-full relative z-20 mt-3 sm:mt-6 min-h-[200px] pb-20">
        <AnimatePresence mode="wait">
        {isFlipped ? (
          <motion.div
            key="actions"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="flex flex-col gap-3"
          >
            {/* Bewertungs-Buttons — Reveal von innen nach außen */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              {[
                { grade: 1, label: "Nochmal", cls: "text-rose-400 hover:border-rose-500/50 hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]", hoverText: "group-hover:text-rose-300", gradient: "from-rose-500/10" },
                { grade: 3, label: "Schwer", cls: "text-amber-400 hover:border-amber-500/50 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]", hoverText: "group-hover:text-amber-300", gradient: "from-amber-500/10" },
                { grade: 4, label: "Gut", cls: "text-emerald-400 hover:border-emerald-500/50 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]", hoverText: "group-hover:text-emerald-300", gradient: "from-emerald-500/10" },
                { grade: 5, label: "Einfach", cls: "text-cyan-400 hover:border-cyan-500/50 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]", hoverText: "group-hover:text-cyan-300", gradient: "from-cyan-500/10" },
              ].map((btn, i) => (
                <motion.button
                  key={btn.grade}
                  onClick={() => handleReview(btn.grade)}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 + i * 0.06 }}
                  className={`group relative p-3 sm:p-4 rounded-2xl bg-slate-900/90 backdrop-blur-sm border border-slate-700 overflow-hidden transition-all shadow-xl hover:-translate-y-1 flex flex-col items-center gap-1 active:scale-95 ${btn.cls}`}
                >
                  <span className={`font-bold text-base sm:text-lg transition-colors relative z-10 ${btn.hoverText}`}>{btn.label}</span>
                  <span className="text-xs sm:text-sm font-medium opacity-50 group-hover:opacity-100 transition-opacity relative z-10">{formatInterval(intervals[btn.grade])}</span>
                  <div className={`absolute inset-0 bg-gradient-to-t ${btn.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col items-center justify-center pt-6 text-slate-600 text-sm"
          >
            <span>Tippe auf die Karte um die Lösung zu sehen</span>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const Sun = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const Moon = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;

const ACHIEVEMENT_DEFS = {
  // Milestones & Cards
  'first_steps': { title: 'Erste Schritte', desc: 'Die erste Karte gelernt', icon: CheckCircle2, color: 'text-blue-400' },
  'warmup': { title: 'Aufwärmphase', desc: '50 Karten gelernt', icon: Activity, color: 'text-teal-400' },
  'getting_serious': { title: 'Ernsthaft', desc: '100 Karten gelernt', icon: Target, color: 'text-rose-400' },
  'half_marathon': { title: 'Halbmarathon', desc: '500 Karten gelernt', icon: Compass, color: 'text-purple-400' },
  'marathon': { title: 'Marathon', desc: '1000 Karten gelernt', icon: Award, color: 'text-fuchsia-400' },
  'ultra_marathon': { title: 'Ultra-Marathon', desc: '5000 Karten gelernt', icon: Crown, color: 'text-yellow-400' },

  // Streaks
  '3_day_streak': { title: 'Dranbleiber', desc: '3 Tage am Stück gelernt', icon: Flame, color: 'text-orange-300' },
  '7_day_streak': { title: 'Fleißiges Bienchen', desc: '7 Tage am Stück gelernt', icon: Flame, color: 'text-orange-400' },
  '14_day_streak': { title: 'Gewohnheitstier', desc: '14 Tage am Stück gelernt', icon: Flame, color: 'text-orange-500' },
  '30_day_streak': { title: 'Maschine', desc: '30 Tage am Stück gelernt', icon: Flame, color: 'text-red-500' },
  '100_day_streak': { title: 'Legende', desc: '100 Tage am Stück gelernt', icon: Trophy, color: 'text-yellow-500' },

  // Perfection
  'perfect_10': { title: 'Lauf', desc: '10 perfekte Antworten in Folge', icon: Sparkles, color: 'text-emerald-300' },
  'perfect_50': { title: 'Statistik-Gott', desc: '50 perfekte Antworten in Folge', icon: Sparkles, color: 'text-emerald-400' },
  'perfect_100': { title: 'Fehlerfrei', desc: '100 perfekte Antworten in Folge', icon: Sparkles, color: 'text-emerald-500' },

  // Times of Day
  'early_bird': { title: 'Frühstarter', desc: 'Vor 8 Uhr morgens gelernt', icon: Sun, color: 'text-amber-400' },
  'morning_routine': { title: 'Morgenroutine', desc: 'Zwischen 8 und 10 Uhr morgens gelernt', icon: Coffee, color: 'text-amber-600' },
  'lunch_break': { title: 'Mittagspause', desc: 'Zwischen 12 und 14 Uhr gelernt', icon: Clock, color: 'text-blue-300' },
  'afternoon_tea': { title: 'Nachmittags-Tee', desc: 'Zwischen 15 und 17 Uhr gelernt', icon: Heart, color: 'text-pink-400' },
  'evening_study': { title: 'Abendschicht', desc: 'Zwischen 18 und 20 Uhr gelernt', icon: Shield, color: 'text-sky-300' },
  'night_owl': { title: 'Nachteule', desc: 'Nach 22 Uhr gelernt', icon: Moon, color: 'text-sky-500' },
  'midnight_hustle': { title: 'Mitternachts-Grind', desc: 'Zwischen 0 und 3 Uhr nachts gelernt', icon: Bell, color: 'text-purple-600' },

  // Days of Week
  'monday_grind': { title: 'Montags-Motivation', desc: 'Am Montag gelernt', icon: Rocket, color: 'text-blue-400' },
  'hump_day': { title: 'Bergfest', desc: 'Am Mittwoch gelernt', icon: Flag, color: 'text-teal-400' },
  'tgif': { title: 'TGIF', desc: 'Am Freitagabend gelernt', icon: Smile, color: 'text-yellow-400' },
  'weekend_warrior': { title: 'Wochenend-Krieger', desc: 'Am Samstag oder Sonntag gelernt', icon: Star, color: 'text-pink-400' },

  // Daily Volume
  'daily_50': { title: 'Im Flow', desc: '50 Karten an einem Tag gelernt', icon: Zap, color: 'text-yellow-400' },
  'daily_100': { title: 'Überflieger', desc: '100 Karten an einem Tag gelernt', icon: Zap, color: 'text-orange-400' },
  'daily_200': { title: 'Hyperfokus', desc: '200 Karten an einem Tag gelernt', icon: Brain, color: 'text-red-400' },
  'daily_500': { title: 'Außer Kontrolle', desc: '500 Karten an einem Tag gelernt', icon: Gauge, color: 'text-fuchsia-500' },

  // Quirks
  'first_lapse': { title: 'Willkommen im Club', desc: 'Das erste Mal eine Karte vergessen', icon: ZapOff, color: 'text-slate-400' },
  'persistence': { title: 'Hartnäckig', desc: '50 Mal auf "Nochmal" gedrückt', icon: RefreshCcw, color: 'text-rose-400' },
  'hard_worker': { title: 'Arbeitstier', desc: '100 Mal auf "Schwer" gedrückt', icon: BookOpen, color: 'text-amber-500' },
  'good_job': { title: 'Souverän', desc: '200 Mal auf "Gut" gedrückt', icon: CheckCircle2, color: 'text-emerald-400' },
  'easy_peasy': { title: 'Kinderspiel', desc: '100 Mal auf "Einfach" gedrückt', icon: Key, color: 'text-cyan-400' },

  // Levels
  'level_5': { title: 'Schüler', desc: 'Level 5 erreicht', icon: GraduationCap, color: 'text-green-400' },
  'level_10': { title: 'Student', desc: 'Level 10 erreicht', icon: Library, color: 'text-blue-400' },
  'level_25': { title: 'Bachelor', desc: 'Level 25 erreicht', icon: Award, color: 'text-purple-400' },
  'level_50': { title: 'Master', desc: 'Level 50 erreicht', icon: Crown, color: 'text-yellow-400' },
  'level_100': { title: 'Professor', desc: 'Level 100 erreicht', icon: BrainCircuit, color: 'text-red-500' }
};

function StatsTab({ cards, userStats }) {
  const [expandedTopics, setExpandedTopics] = useState(new Set());

  const toggleTopic = (topic) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topic)) newSet.delete(topic);
      else newSet.add(topic);
      return newSet;
    });
  };

  const topics = [...new Set(cards.map(c => c.topic))];

  const stats = topics.map(topic => {
    const topicCards = cards.filter(c => c.topic === topic);
    const avgEfactor = topicCards.reduce((acc, c) => acc + c.efactor, 0) / topicCards.length;

    let totalMistakes = 0;
    let totalReviews = 0;
    let interval0 = 0;
    let intervalMin = 0;
    let intervalDay = 0;
    let intervalWeek = 0;

    topicCards.forEach(c => {
      c.history.forEach(h => {
        totalReviews++;
        if (h.quality < 3) totalMistakes++;
      });
      if (c.state === 'new' || c.repetition === 0) {
        interval0++;
      } else {
        const msUntilDue = c.nextReviewDate - Date.now();
        if (msUntilDue <= 24 * 60 * 60 * 1000) intervalMin++;
        else if (msUntilDue <= 7 * 24 * 60 * 60 * 1000) intervalDay++;
        else intervalWeek++;
      }
    });

    const masteryScore = Math.min(100, Math.max(0, Math.round(((topicCards.length - interval0) / topicCards.length) * 100)));

    return { topic, avgEfactor, totalMistakes, totalReviews, masteryScore, cardCount: topicCards.length, interval0, intervalMin, intervalDay, intervalWeek };
  }).sort((a, b) => b.masteryScore - a.masteryScore);

  // --- Derived stats ---
  const totalReviewed = (userStats.totalEasy || 0) + (userStats.totalGood || 0) + (userStats.totalHard || 0) + (userStats.totalAgain || 0);
  const correctOnFirst = (userStats.totalEasy || 0) + (userStats.totalGood || 0);
  const hitRate = totalReviewed > 0 ? Math.round((correctOnFirst / totalReviewed) * 100) : 0;
  // Estimated learning time: ~8 seconds per card review
  const estimatedMinutes = Math.round((totalReviewed * 8) / 60);
  const estimatedHours = Math.floor(estimatedMinutes / 60);
  const remainingMinutes = estimatedMinutes % 60;
  const timeString = estimatedHours > 0 ? `${estimatedHours}h ${remainingMinutes}m` : `${estimatedMinutes}m`;

  // --- Activity Heatmap (last 12 weeks = 84 days) ---
  const activityLog = userStats.activityLog || {};
  const heatmapDays = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    heatmapDays.push({ date: key, count: activityLog[key] || 0, dayOfWeek: d.getDay() });
  }
  const maxActivity = Math.max(1, ...heatmapDays.map(d => d.count));

  const getHeatColor = (count) => {
    if (count === 0) return 'bg-slate-800/60';
    if (count < 5) return 'bg-emerald-900/30';
    if (count < 15) return 'bg-emerald-900/70';
    if (count < 30) return 'bg-emerald-700/70';
    if (count < 50) return 'bg-emerald-500/70';
    return 'bg-emerald-400/90';
  };

  // --- Daily Bar Chart (last 14 days) ---
  const barDays = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString('de-DE', { weekday: 'short' });
    barDays.push({ date: key, count: activityLog[key] || 0, label: dayLabel });
  }
  const maxBar = Math.max(1, ...barDays.map(d => d.count));

  // --- Exam History ---
  const examHistory = userStats.examHistory || [];
  const avgExamScore = examHistory.length > 0 ? Math.round(examHistory.reduce((s, e) => s + e.percentage, 0) / examHistory.length) : null;

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
          <Activity className="w-8 h-8 text-sky-400 drop-shadow-md" /> Deine Lern-Statistiken
        </h2>
        <p className="text-slate-400 text-lg">Analysiere deinen Fortschritt und tauche in die Details deiner Fächer ein.</p>
      </motion.div>

      {/* Overview Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Alle Karten" value={cards.length} icon={BrainCircuit} color="text-sky-400" bg="bg-sky-500/10" shadow="hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]" />
        <StatCard title="Fällige Karten" value={cards.filter(c => c.nextReviewDate <= Date.now()).length} icon={RefreshCcw} color="text-amber-400" bg="bg-amber-500/10" shadow="hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]" />
        <StatCard title="Fortschritt" value={`${stats.length > 0 ? Math.round(stats.reduce((sum, s) => sum + s.masteryScore, 0) / stats.length) : 0}%`} icon={Award} color="text-emerald-400" bg="bg-emerald-500/10" shadow="hover:shadow-[0_0_30px_rgba(52,211,153,0.3)]" />
        <StatCard title="Lernzeit" value={timeString} icon={Clock} color="text-purple-400" bg="bg-purple-500/10" shadow="hover:shadow-[0_0_30px_rgba(192,132,252,0.3)]" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Dein Einsatz (Streak & Heatmap) */}
          <motion.div variants={itemVariants} className="relative group bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* GlowingEffect entfernt für Performance */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20"><Flame className="w-6 h-6 text-orange-400" /></div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Dein Einsatz</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800/40 rounded-2xl p-5 text-center border border-slate-700/50 hover:bg-slate-800/60 transition-colors shadow-inner">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-amber-500">{userStats.streak}</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">Aktueller Streak</p>
                </div>
                <div className="bg-slate-800/40 rounded-2xl p-5 text-center border border-slate-700/50 hover:bg-slate-800/60 transition-colors shadow-inner">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-yellow-500">{userStats.longestStreak || userStats.streak}</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">Längster Streak</p>
                </div>
                <div className="bg-slate-800/40 rounded-2xl p-4 text-center border border-slate-700/50 hover:bg-slate-800/60 transition-colors shadow-inner">
                  <span className="text-2xl font-bold text-sky-400 drop-shadow-md">{userStats.totalCardsLearned || 0}</span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Karten gesamt</p>
                </div>
                <div className="bg-slate-800/40 rounded-2xl p-4 text-center border border-slate-700/50 hover:bg-slate-800/60 transition-colors shadow-inner">
                  <span className="text-2xl font-bold text-emerald-400 drop-shadow-md">{Object.keys(activityLog).length}</span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Aktive Tage</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-300">Aktivitäts-Historie</span>
                  <span className="text-xs text-slate-500">12 Wochen</span>
                </div>
                <div className="flex gap-[3px] flex-wrap">
                  {heatmapDays.map((day, i) => (
                    <div
                      key={day.date}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] ${getHeatColor(day.count)} transition-all hover:scale-125 hover:z-10 cursor-help shadow-sm hover:shadow-emerald-500/50`}
                      title={`${day.date}: ${day.count} Karten`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Daily Activity Bar Chart */}
          <motion.div variants={itemVariants} className="relative group bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* GlowingEffect entfernt für Performance */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-800/80 pb-4">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20"><BarChart3 className="w-6 h-6 text-sky-400" /></div>
                <h3 className="text-xl font-bold text-white tracking-tight">Täglicher Lernverlauf</h3>
              </div>
              <div className="flex items-end gap-1.5 h-40">
                {barDays.map(day => {
                  const height = day.count > 0 ? Math.max(10, (day.count / maxBar) * 100) : 5;
                  const isToday = day.date === new Date().toISOString().slice(0, 10);
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group/bar" title={`${day.date}: ${day.count} Karten`}>
                      {day.count > 0 && <span className="text-[10px] text-sky-300 font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity -translate-y-2 group-hover/bar:-translate-y-4">{day.count}</span>}
                      <motion.div
                        initial={{ height: '5%' }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`w-full rounded-md transition-colors ${isToday ? 'bg-sky-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : day.count > 0 ? 'bg-sky-500/40 hover:bg-sky-400/60' : 'bg-slate-800/40'}`}
                      />
                      <span className={`text-[10px] ${isToday ? 'text-sky-400 font-black' : 'text-slate-500 font-medium'}`}>{day.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
          
          {/* Trefferquote Details */}
          <motion.div variants={itemVariants} className="relative group bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* GlowingEffect entfernt für Performance */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-800/80 pb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"><Target className="w-6 h-6 text-emerald-400" /></div>
                <h3 className="text-xl font-bold text-white tracking-tight">Antwort-Verteilung</h3>
              </div>
              {totalReviewed === 0 ? (
                <p className="text-sm text-slate-400 italic font-medium p-4 bg-slate-800/40 rounded-xl">Noch keine Karten bewertet. Starte eine Lernsession um Daten zu sammeln!</p>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: 'Einfach', count: userStats.totalEasy || 0, color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-500/20', textColor: 'text-emerald-400', stat: `${Math.round(((userStats.totalEasy || 0) / totalReviewed) * 100)}%` },
                    { label: 'Gut', count: userStats.totalGood || 0, color: 'from-blue-400 to-cyan-500', bg: 'bg-blue-500/20', textColor: 'text-blue-400', stat: `${Math.round(((userStats.totalGood || 0) / totalReviewed) * 100)}%` },
                    { label: 'Schwer', count: userStats.totalHard || 0, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-500/20', textColor: 'text-amber-400', stat: `${Math.round(((userStats.totalHard || 0) / totalReviewed) * 100)}%` },
                    { label: 'Nochmal', count: userStats.totalAgain || 0, color: 'from-rose-400 to-pink-500', bg: 'bg-rose-500/20', textColor: 'text-rose-400', stat: `${Math.round(((userStats.totalAgain || 0) / totalReviewed) * 100)}%` },
                  ].map((item, idx) => (
                    <div key={item.label} className="group/item flex items-center gap-4 p-2 -mx-2 rounded-xl hover:bg-slate-800/50 transition-colors">
                      <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center font-bold text-sm ${item.textColor} shadow-inner shrink-0`}>
                        {item.stat}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-bold text-slate-200">{item.label}</span>
                          <span className="text-xs text-slate-400 font-medium">{item.count} gesamt</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.count / totalReviewed) * 100}%` }}
                            transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          {/* Lernfortschritt Topics */}
          <motion.div variants={itemVariants} className="relative group bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col h-[600px]">
            {/* GlowingEffect entfernt für Performance */}
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80 shrink-0">
                <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20"><CheckCircle2 className="w-6 h-6 text-teal-400" /></div>
                <h3 className="text-xl font-bold text-white tracking-tight">Fächer-Fortschritt</h3>
              </div>
              <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
                {stats.map((s, idx) => {
                  const isExpanded = expandedTopics.has(s.topic);
                  return (
                    <div key={s.topic} className={`bg-slate-800/40 rounded-2xl overflow-hidden border transition-all duration-300 ${isExpanded ? 'border-sky-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-sky-500/30' : 'border-slate-700/50 hover:border-sky-500/30 hover:bg-slate-800/60'}`}>
                      <button
                        onClick={() => toggleTopic(s.topic)}
                        className="w-full flex flex-col p-4 sm:p-5 focus:outline-none focus:bg-slate-800/60"
                      >
                        <div className="w-full flex justify-between items-center mb-3">
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-slate-100 tracking-wide text-base">{s.topic}</span>
                            <span className="text-slate-500 font-medium text-xs mt-0.5">{s.cardCount} Karten insgesamt</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-teal-400 text-lg font-black drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]">{s.masteryScore}%</span>
                            <div className={`p-1 rounded-full transition-colors ${isExpanded ? 'bg-sky-500/20' : 'bg-slate-700/50'}`}>
                              <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-sky-400' : ''}`} />
                            </div>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${s.masteryScore}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.8)]" 
                          />
                        </div>
                      </button>

                      <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: "auto", opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="px-5 pb-5 pt-3 bg-slate-800/30 border-t border-slate-700/50"
                        >
                          <div className="space-y-2.5 text-xs sm:text-sm font-medium">
                            <div className="flex justify-between items-center bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/30">
                              <span className="flex items-center gap-2 text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-slate-500 shadow-inner" /> Ungelernt (0 Tage):</span>
                              <span className="font-bold">{s.interval0} <span className="text-slate-500 font-normal">Karten</span></span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/30">
                              <span className="flex items-center gap-2 text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-inner" /> Kurzfristig ({"<"} 24h):</span>
                              <span className="font-bold">{s.intervalMin} <span className="text-slate-500 font-normal">Karten</span></span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/30">
                              <span className="flex items-center gap-2 text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-inner" /> Mittelfristig (1-7T):</span>
                              <span className="font-bold">{s.intervalDay} <span className="text-slate-500 font-normal">Karten</span></span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/30">
                              <span className="flex items-center gap-2 text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" /> Langfristig ({">"} 7T):</span>
                              <span className="font-bold text-emerald-400">{s.intervalWeek} <span className="text-slate-500 font-normal">Karten</span></span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700/50">
                              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/30">
                                <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Aufrufe Insgesamt</span>
                                <span className="text-lg font-bold text-slate-200">{s.totalReviews}</span>
                              </div>
                              <div className="bg-rose-500/5 rounded-xl p-3 border border-rose-500/10">
                                <span className="block text-[10px] uppercase tracking-wider text-rose-500/70 mb-1">Davon "Nochmal"</span>
                                <span className="text-lg font-bold text-rose-400">{s.totalMistakes}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Mögliche Schwächen */}
          <motion.div variants={itemVariants} className="relative group bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* GlowingEffect entfernt für Performance */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800/80 pb-4">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20"><AlertCircle className="w-6 h-6 text-rose-400" /></div>
                <h3 className="text-xl font-bold text-white tracking-tight">Mögliche Schwächen</h3>
              </div>
              <div className="space-y-5">
                {stats.filter(s => s.totalMistakes > 2).length === 0 ? (
                  <p className="text-sm font-medium text-slate-400 italic p-4 bg-slate-800/30 rounded-xl flex items-center justify-center border border-slate-700/30">Noch nicht genug Daten oder keine Schwächen! Weiter so! 🎉</p>
                ) : (
                  stats.filter(s => s.totalMistakes > 2).sort((a, b) => b.totalMistakes - a.totalMistakes).map(s => (
                    <div key={s.topic} className="flex flex-col gap-2 p-3 bg-slate-800/20 rounded-xl border border-slate-700/20 hover:border-slate-700/50 hover:bg-slate-800/40 transition-colors">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-200">{s.topic}</span>
                        <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md drop-shadow-sm">{s.totalMistakes} Fehler</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (s.totalMistakes / Math.max(1, s.totalReviews)) * 100)}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]" 
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Achievements / Trophäenwand */}
      <motion.div variants={itemVariants} className="relative group bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden mt-8">
        {/* GlowingEffect entfernt für Performance */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-800/80 pb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20"><Trophy className="w-6 h-6 text-amber-400" /></div>
            <h3 className="text-xl font-bold text-white tracking-tight">Deine Abzeichen</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(ACHIEVEMENT_DEFS).map(([id, def], idx) => {
              const unlocked = userStats.achievements.includes(id);
              const IconGroup = def.icon;
              return (
                <motion.div 
                  key={id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-300 relative group overflow-hidden ${unlocked ? 'bg-slate-800/80 border-slate-600 shadow-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:-translate-y-1' : 'bg-slate-900/60 border-slate-800/80 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}
                >
                  {unlocked && <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />}
                  <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center transition-transform duration-300 border-[3px] group-hover:scale-110 relative z-10 ${unlocked ? 'bg-slate-800 border-slate-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]' : 'bg-slate-800 border-slate-800'}`}>
                    <IconGroup className={`w-8 h-8 ${unlocked ? def.color : 'text-slate-500'}`} />
                  </div>
                  <span className={`font-black tracking-wide text-sm mb-1 relative z-10 ${unlocked ? 'text-white' : 'text-slate-400'}`}>{def.title}</span>
                  <span className="text-xs text-slate-400 font-medium relative z-10 leading-tight">{def.desc}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}








function StatCard({ title, value, icon: Icon, color, bg = 'bg-slate-800', shadow = '' }) {
  return (
    <div className={`relative group bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 hover:border-slate-600 hover:-translate-y-1 ${shadow} overflow-hidden cursor-default`}>
      {/* GlowingEffect entfernt für Performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className={`p-3 sm:p-4 rounded-xl relative z-10 transition-colors ${bg} border border-transparent group-hover:border-slate-700/50`}>
        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${color}`} />
      </div>
      <div className="relative z-10">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors drop-shadow-sm">{title}</p>
        <p className={`text-2xl sm:text-3xl font-black mt-1 drop-shadow-md ${color}`}>{value}</p>
      </div>
    </div>
  );
}

function ExamTab({ cards, deckName, addXP, activeDeck, setDecks, setUserStats }) {
  const [examState, setExamState] = useState('idle');
  const [selectedTopic, setSelectedTopic] = useState('Alle Themen');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showMaterials, setShowMaterials] = useState(false);
  const [scriptText, setScriptText] = useState(activeDeck?.scriptText || '');
  const [sampleExamText, setSampleExamText] = useState(activeDeck?.sampleExamText || '');
  const [materialsSaved, setMaterialsSaved] = useState(false);
  const [pdfLoading, setPdfLoading] = useState('');
  const scriptFileRef = React.useRef(null);
  const examFileRef = React.useRef(null);

  const topics = ['Alle Themen', ...new Set(cards.map(c => c.topic))];

  const extractPdfText = async (file) => {
    if (!window.pdfjsLib) {
      throw new Error('PDF.js nicht geladen');
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    return fullText.trim();
  };

  const handleFileUpload = async (file, target) => {
    if (!file) return;
    const setter = target === 'script' ? setScriptText : setSampleExamText;

    if (file.type === 'application/pdf') {
      setPdfLoading(target);
      try {
        const text = await extractPdfText(file);
        setter(prev => prev ? prev + '\n\n' + text : text);
      } catch (err) {
        console.error('PDF extraction error:', err);
        setError('Fehler beim Lesen der PDF-Datei: ' + err.message);
      } finally {
        setPdfLoading('');
      }
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const text = await file.text();
      setter(prev => prev ? prev + '\n\n' + text : text);
    } else {
      setError('Bitte eine PDF- oder Text-Datei hochladen.');
    }
  };

  const saveMaterials = () => {
    setDecks(prev => prev.map(d => d.id === activeDeck.id ? { ...d, scriptText, sampleExamText } : d));
    setMaterialsSaved(true);
    setTimeout(() => setMaterialsSaved(false), 2000);
  };

  const generateExam = async () => {
    setExamState('generating');
    setError('');

    const topicDesc = selectedTopic === 'Alle Themen' ? deckName : `${deckName} - ${selectedTopic}`;

    let promptParts = [`Du bist ein Professor für das Fach ${deckName || 'Statistik'}. Erstelle eine Probeklausur mit 8 kurzen, prägnanten Fragen für einen Studenten zum Thema: ${topicDesc}. Jede Frage soll in 1-2 Sätzen beantwortbar sein. Mische Verständnisfragen, Definitionsfragen und kurze Anwendungsfragen. Wenn es thematisch passt, füge auch konkrete Rechenaufgaben hinzu (z. B. Berechnung von Mittelwert, Varianz, Wahrscheinlichkeiten, Regression etc.) mit konkreten Zahlenwerten. Formuliere die Fragen selbst auch kurz und präzise.`];

    if (scriptText.trim()) {
      promptParts.push(`\n\nWICHTIG: Erstelle die Fragen AUSSCHLIESSLICH basierend auf dem folgenden Vorlesungsskript. Frage NICHTS ab, das nicht im Skript vorkommt:\n\n--- SKRIPT ANFANG ---\n${scriptText.trim()}\n--- SKRIPT ENDE ---`);
    }

    if (sampleExamText.trim()) {
      promptParts.push(`\n\nOrientiere dich bei Stil, Schwierigkeitsgrad und Frageformat an dieser Probeklausur der Universität:\n\n--- PROBEKLAUSUR ANFANG ---\n${sampleExamText.trim()}\n--- PROBEKLAUSUR ENDE ---`);
    }

    const prompt = promptParts.join('');

    const schema = {
      type: "OBJECT",
      properties: {
        questions: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              id: { type: "STRING" },
              text: { type: "STRING" }
            }
          }
        }
      }
    };

    try {
      const data = await callGemini(prompt, schema);
      setQuestions(data.questions);
      setAnswers({});
      setExamState('taking');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Fehler bei der Klausurerstellung. Bitte versuche es erneut.');
      setExamState('idle');
    }
  };

  const submitExam = async () => {
    setExamState('grading');
    setError('');

    let evalParts = [`Du bist ein Professor für ${deckName || 'Statistik'}. Bewerte die folgenden Antworten eines Studenten auf deine Klausurfragen. 
    Vergib für jede Antwort eine Punktzahl von 0 bis 10 und ein kurzes, konstruktives und ermutigendes Feedback in Deutsch.`];

    if (scriptText.trim()) {
      evalParts.push(`\n\nBewerte die Antworten anhand des folgenden Vorlesungsskripts:\n--- SKRIPT ---\n${scriptText.trim()}\n--- ENDE ---`);
    }

    evalParts.push(`\n\nFragen und Antworten des Studenten:\n${questions.map((q, i) => `Frage ${i + 1} (ID: ${q.id}): ${q.text}\nAntwort Student: ${answers[q.id] || '[Keine Antwort]'}`).join('\n\n')}`);

    const evaluationPrompt = evalParts.join('');

    const schema = {
      type: "OBJECT",
      properties: {
        evaluations: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              questionId: { type: "STRING" },
              score: { type: "INTEGER", description: "Punkte von 0 bis 10" },
              feedback: { type: "STRING" }
            }
          }
        },
        overallFeedback: { type: "STRING" }
      }
    };

    try {
      const data = await callGemini(evaluationPrompt, schema);
      setResults(data);
      setExamState('results');

      const totalScore = data.evaluations.reduce((sum, ev) => sum + ev.score, 0);
      const maxScore = data.evaluations.length * 10;
      if (totalScore > 0) {
        addXP(totalScore * 5);
      }
      // Save exam result to history and track activity
      const todayKey = new Date().toISOString().slice(0, 10);
      setUserStats(prev => {
        const activityLog = { ...(prev.activityLog || {}) };
        activityLog[todayKey] = (activityLog[todayKey] || 0) + 1;

        return {
          ...prev,
          activityLog,
          examHistory: [...(prev.examHistory || []), {
            date: new Date().toISOString(),
            topic: selectedTopic,
            score: totalScore,
            maxScore,
            percentage: Math.round((totalScore / maxScore) * 100),
            questionCount: data.evaluations.length
          }]
        };
      });
    } catch (err) {
      console.error(err);
      setError('Fehler bei der Korrektur. Bitte versuche es erneut.');
      setExamState('taking');
    }
  };

  const containerVariants = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } } };

  if (examState === 'idle' || examState === 'generating') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-2xl mx-auto mt-12 relative flex flex-col pt-6 pb-24">
        <div className="absolute inset-0 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        
        <div className="text-center relative z-10 mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-sky-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-sky-500/30 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
            <Sparkles className="w-12 h-12 text-sky-400 drop-shadow-md" />
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-purple-300 to-sky-300 mb-4 tracking-tight pb-1">
            KI-Klausursimulation
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
            Lass dir auf Knopfdruck eine individuelle Probeklausur generieren. Beantworte die Fragen in eigenen Worten und erhalte detailliertes Feedback.
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3 text-rose-400 bg-rose-500/10 p-4 rounded-2xl text-sm border border-rose-500/20 shadow-lg">
            <AlertCircle className="w-5 h-5 shrink-0" /> <p className="font-medium">{error}</p>
          </motion.div>
        )}

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden group">
          {/* GlowingEffect entfernt für Performance */}

          <div className="w-full max-w-sm text-left relative z-10">
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1">Thema wählen</label>
            <div className="relative">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-2xl pl-5 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all appearance-none shadow-inner font-medium text-lg cursor-pointer hover:border-sky-500/30"
              >
                {topics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronRight className="absolute right-5 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 pointer-events-none rotate-90" />
            </div>
          </div>

          <div className="w-full relative z-10 space-y-4">
            <button
              onClick={() => setShowMaterials(!showMaterials)}
              className="w-full flex items-center justify-between px-6 py-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-sm font-bold text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800/60 transition-all shadow-sm"
            >
              <span className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Lernmaterial hinterlegen
                {(scriptText.trim() || sampleExamText.trim()) && (
                  <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full font-black tracking-wider uppercase ml-2 animate-pulse">Aktiv</span>
                )}
              </span>
              <div className={`p-1.5 rounded-full transition-colors ${showMaterials ? 'bg-sky-500/20' : 'bg-slate-700/50'}`}>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showMaterials ? 'rotate-90 text-sky-400' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
            {showMaterials && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 text-left shadow-inner">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-amber-400 mb-2.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Vorlesungsskript
                    </label>
                    <p className="text-xs text-slate-500 mb-3 font-medium">Lade eine PDF-Datei hoch oder füge den Text deines Skripts ein. Die KI erstellt Fragen dann ausschließlich basierend auf diesem Material.</p>

                    <input
                      type="file"
                      ref={scriptFileRef}
                      accept=".pdf,.txt,.md"
                      className="hidden"
                      onChange={(e) => { handleFileUpload(e.target.files[0], 'script'); e.target.value = ''; }}
                    />
                    <button
                      onClick={() => scriptFileRef.current?.click()}
                      disabled={pdfLoading === 'script'}
                      className="w-full mb-3 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-[0_0_15px_rgba(251,191,36,0.15)] focus:ring-2 focus:ring-amber-500/50"
                    >
                      {pdfLoading === 'script' ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> PDF wird extrahiert...</>
                      ) : (
                        <><Upload className="w-4 h-4" /> PDF oder Textdatei hochladen</>
                      )}
                    </button>

                    <textarea
                      value={scriptText}
                      onChange={(e) => setScriptText(e.target.value)}
                      placeholder="Oder Skript-Text hier manuell einfügen..."
                      className="w-full bg-slate-950/50 border border-slate-700/80 text-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all min-h-[120px] max-h-[300px] resize-y shadow-inner"
                    />
                    {scriptText.trim() && (
                      <div className="flex items-center justify-between mt-2 px-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-emerald-500">{scriptText.trim().length.toLocaleString()} Zeichen hinterlegt</span>
                        <button onClick={() => setScriptText('')} className="text-[10px] uppercase font-bold text-rose-500 hover:text-rose-400 transition-colors bg-rose-500/10 px-2 py-0.5 rounded">Löschen</button>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-700/50 my-2" />

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-sky-400 mb-2.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Probeklausur der Uni
                    </label>
                    <p className="text-xs text-slate-500 mb-3 font-medium">Lade eine PDF-Datei hoch oder füge eine Probeklausur eurer Uni ein. Die KI orientiert sich dann an Stil und Schwierigkeitsgrad.</p>

                    <input
                      type="file"
                      ref={examFileRef}
                      accept=".pdf,.txt,.md"
                      className="hidden"
                      onChange={(e) => { handleFileUpload(e.target.files[0], 'exam'); e.target.value = ''; }}
                    />
                    <button
                      onClick={() => examFileRef.current?.click()}
                      disabled={pdfLoading === 'exam'}
                      className="w-full mb-3 py-3 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] focus:ring-2 focus:ring-sky-500/50"
                    >
                      {pdfLoading === 'exam' ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> PDF wird extrahiert...</>
                      ) : (
                        <><Upload className="w-4 h-4" /> PDF oder Textdatei hochladen</>
                      )}
                    </button>

                    <textarea
                      value={sampleExamText}
                      onChange={(e) => setSampleExamText(e.target.value)}
                      placeholder="Oder Probeklausur-Text hier manuell einfügen..."
                      className="w-full bg-slate-950/50 border border-slate-700/80 text-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all min-h-[120px] max-h-[300px] resize-y shadow-inner"
                    />
                    {sampleExamText.trim() && (
                      <div className="flex items-center justify-between mt-2 px-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-emerald-500">{sampleExamText.trim().length.toLocaleString()} Zeichen hinterlegt</span>
                        <button onClick={() => setSampleExamText('')} className="text-[10px] uppercase font-bold text-rose-500 hover:text-rose-400 transition-colors bg-rose-500/10 px-2 py-0.5 rounded">Löschen</button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={saveMaterials}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-sm transition-all shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 mt-4"
                  >
                    {materialsSaved ? (
                      <><CheckCircle2 className="w-5 h-5 animate-in zoom-in duration-300" /> Gespeichert!</>
                    ) : (
                      <><Download className="w-5 h-5" /> Material speichern</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          <button
            onClick={generateExam}
            disabled={examState === 'generating'}
            className="w-full max-w-sm mt-4 bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:cursor-wait hover:-translate-y-1 active:scale-95 z-10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none" />
            {examState === 'generating' ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Klausur wird generiert...</>
            ) : (
              <><Play className="w-6 h-6 fill-white" /> Klausur starten</>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  if (examState === 'taking' || examState === 'grading') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-slate-800 gap-4">
          <div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400 tracking-tight drop-shadow-sm">Probeklausur</h2>
            <p className="text-slate-400 font-medium mt-1">{selectedTopic}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-black tracking-widest uppercase bg-sky-500/10 border border-sky-500/20 text-sky-400 px-4 py-2 rounded-xl shadow-inner">
              {questions.length} Fragen
            </span>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3 text-rose-400 bg-rose-500/10 p-4 rounded-2xl text-sm border border-rose-500/20 shadow-lg">
            <AlertCircle className="w-5 h-5 shrink-0" /> <p className="font-medium">{error}</p>
          </motion.div>
        )}

        <div className="space-y-8 mb-12">
          {questions.map((q, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={q.id} 
              className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden group focus-within:border-sky-500/50 hover:border-slate-600/60 transition-colors"
            >
              {/* GlowingEffect entfernt für Performance */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sky-500 to-purple-500 opacity-50 rounded-l-3xl" />
              
              <h3 className="font-bold text-lg sm:text-xl text-slate-200 mb-6 leading-relaxed pl-4">
                <span className="text-sky-400 font-black mr-3 text-2xl drop-shadow-md">{idx + 1}.</span> {q.text}
              </h3>
              
              <div className="relative pl-4">
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  disabled={examState === 'grading'}
                  placeholder="Deine ausführliche Antwort..."
                  className="w-full h-40 bg-slate-950/50 border border-slate-700/80 rounded-2xl p-5 text-slate-200 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none disabled:opacity-50 shadow-inner placeholder:text-slate-600 font-medium text-base/relaxed"
                />
                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest pointer-events-none mix-blend-screen bg-slate-900/50 px-2 py-1 rounded backdrop-blur-sm">
                  {(answers[q.id] || '').length} Zeichen
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end sticky bottom-6 z-20">
          <button
            onClick={submitExam}
            disabled={examState === 'grading' || Object.keys(answers).length === 0}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.4)] hover:-translate-y-1 active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:grayscale disabled:cursor-wait group text-lg"
          >
            {examState === 'grading' ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Klausur wird korrigiert...</>
            ) : (
              <>Klausur abgeben <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  if (examState === 'results' && results) {
    const totalScore = results.evaluations.reduce((sum, ev) => sum + ev.score, 0);
    const maxScore = questions.length * 10;
    const percentage = Math.round((totalScore / maxScore) * 100);

    return (
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-10 pt-6">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] p-10 text-center shadow-2xl relative overflow-hidden group">
          {/* GlowingEffect entfernt für Performance */}
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500" />
          <div className="absolute -inset-24 bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-pink-500/10 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity pointer-events-none" />
          
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 drop-shadow-sm relative z-10">Klausurergebnis</h2>
          
          <div className="flex justify-center items-center gap-6 my-8 relative z-10">
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                <motion.circle
                  initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - percentage / 100) }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={2 * Math.PI * 88}
                  className={percentage >= 80 ? 'text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : percentage >= 50 ? 'text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]'}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-black tracking-tighter ${percentage >= 80 ? 'text-emerald-400' : percentage >= 50 ? 'text-amber-400' : 'text-rose-400'} drop-shadow-md`}>
                  {percentage}%
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-start justify-center gap-1">
              <span className="text-xs uppercase font-black tracking-widest text-slate-500">Punkte</span>
              <span className="text-3xl font-bold text-slate-200">{totalScore} <span className="text-xl text-slate-500">/ {maxScore}</span></span>
              <div className="mt-2 text-sm font-medium px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                {questions.length} Fragen
              </div>
            </div>
          </div>
          
          <div className="relative bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 mt-6 max-w-2xl mx-auto shadow-inner">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-slate-900 px-4 py-1 rounded-full border border-slate-700/50 text-xs font-bold uppercase tracking-widest text-sky-400 flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Professor-Feedback
            </div>
            <p className="text-lg text-slate-300 font-medium leading-relaxed mt-2">"{results.overallFeedback}"</p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-black text-white px-2 flex items-center gap-3"><span className="w-8 h-1 bg-sky-500 rounded-full" /> Detaillierte Auswertung</h3>
          {questions.map((q, idx) => {
            const evaluation = results.evaluations.find(e => e.questionId === q.id);
            if (!evaluation) return null;

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={q.id} 
                className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-lg hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-5 mb-5">
                  <h4 className="font-bold text-lg text-slate-200 leading-relaxed pr-8">
                    <span className="text-sky-400 font-black mr-2 text-xl drop-shadow-md">{idx + 1}.</span> {q.text}
                  </h4>
                  <div className={`shrink-0 flex items-center gap-1 font-black px-4 py-2 rounded-xl text-sm border shadow-inner ${evaluation.score >= 8 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    evaluation.score >= 5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                    <span className="text-2xl leading-none">{evaluation.score}</span><span className="opacity-50">/10</span>
                  </div>
                </div>

                <div className="mb-5 p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80 shadow-inner">
                  <span className="font-black text-slate-500 uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Deine Antwort
                  </span>
                  <p className={`text-sm ${answers[q.id] ? 'text-slate-300' : 'text-slate-500 italic'} font-medium leading-relaxed`}>
                    {answers[q.id] || "Keine Antwort gegeben."}
                  </p>
                </div>

                <div className="flex gap-4 items-start bg-sky-500/5 border border-sky-500/10 p-5 rounded-2xl">
                  <div className="shrink-0 mt-0.5 bg-sky-500/20 p-2 rounded-xl"><Sparkles className="w-5 h-5 text-sky-400" /></div>
                  <div className="flex-1">
                    <span className="font-black text-sky-400/80 uppercase text-[10px] tracking-widest mb-1 block">Feedback</span>
                    <p className="text-slate-300 text-sm font-medium leading-relaxed">{evaluation.feedback}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center pt-8 pb-12">
          <button
            onClick={() => setExamState('idle')}
            className="group relative bg-slate-800 hover:bg-slate-700 text-white font-black py-4 px-10 rounded-2xl transition-all border border-slate-700 shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-3 overflow-hidden text-lg"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <RefreshCcw className="w-6 h-6 text-sky-400 group-hover:-rotate-180 transition-transform duration-500" />
            Neue Klausur starten
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
}

function CardManagementTab({ cards, setCards }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopic, setFilterTopic] = useState('Alle Themen');
  const [sortBy, setSortBy] = useState('nextReviewDate');
  const [sortDir, setSortDir] = useState('asc'); // 'asc' or 'desc'
  const [editingCardId, setEditingCardId] = useState(null);
  const [editQ, setEditQ] = useState('');
  const [editA, setEditA] = useState('');

  const topics = ['Alle Themen', ...new Set(cards.map(c => c.topic))];

  const handleDelete = (id) => {
    if (confirm('Möchtest du diese Karte wirklich löschen? Dieser Schritt kann nicht rückgängig gemacht werden.')) {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  const filteredAndSortedCards = cards
    .filter(c => {
      const matchesSearch = c.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTopic = filterTopic === 'Alle Themen' || c.topic === filterTopic;
      return matchesSearch && matchesTopic;
    })
    .sort((a, b) => {
      let result = 0;
      if (sortBy === 'nextReviewDate') result = a.nextReviewDate - b.nextReviewDate;
      if (sortBy === 'repetition') result = b.repetition - a.repetition;
      if (sortBy === 'efactor') result = a.efactor - b.efactor;

      return sortDir === 'asc' ? result : -result;
    });

  const handleEditClick = (card) => {
    setEditingCardId(card.id);
    setEditQ(card.question);
    setEditA(card.answer);
  };

  const handleSaveEdit = () => {
    setCards(prevCards => prevCards.map(c =>
      c.id === editingCardId
        ? { ...c, question: editQ, answer: editA }
        : c
    ));
    setEditingCardId(null);
  };

  // Calculate Overview Stats
  const now = Date.now();
  let statNew = 0;
  let statSoon = 0; // < 24h
  let statMedium = 0; // 1-7 days
  let statLong = 0; // > 7 days

  cards.forEach(c => {
    if (c.state === 'new' || c.repetition === 0) statNew++;
    else {
      const msUntilDue = c.nextReviewDate - now;
      if (msUntilDue <= 24 * 60 * 60 * 1000) statSoon++;
      else if (msUntilDue <= 7 * 24 * 60 * 60 * 1000) statMedium++;
      else statLong++;
    }
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return 'Heute';
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Morgen';
    }

    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.3 } } };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3 tracking-tight">
            <Library className="w-8 h-8 text-sky-400 drop-shadow-md" /> Kartenverwaltung
          </h2>
          <p className="text-slate-400 text-lg">Übersicht aller {cards.length} Karteikarten in deinem Deck.</p>
        </div>
      </div>

      {/* Cards Overview Mini-Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="group relative bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center overflow-hidden transition-all hover:border-slate-500/50 shadow-lg">
          {/* GlowingEffect entfernt für Performance */}
          <div className="absolute inset-0 bg-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <span className="text-3xl font-black text-slate-300 drop-shadow-md relative z-10">{statNew}</span>
          <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-1 relative z-10 group-hover:text-slate-300 transition-colors">Neu / Ungelernt</span>
        </div>
        <div className="group relative bg-amber-500/5 backdrop-blur-sm p-4 rounded-2xl border border-amber-500/20 flex flex-col items-center justify-center text-center overflow-hidden transition-all hover:border-amber-500/40 shadow-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]">
          {/* GlowingEffect entfernt für Performance */}
          <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <span className="text-3xl font-black text-amber-400 drop-shadow-md relative z-10">{statSoon}</span>
          <span className="text-[11px] text-amber-500/80 uppercase tracking-widest font-bold mt-1 relative z-10 group-hover:text-amber-400 transition-colors">&lt; 24h fällig</span>
        </div>
        <div className="group relative bg-blue-500/5 backdrop-blur-sm p-4 rounded-2xl border border-blue-500/20 flex flex-col items-center justify-center text-center overflow-hidden transition-all hover:border-blue-500/40 shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          {/* GlowingEffect entfernt für Performance */}
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <span className="text-3xl font-black text-blue-400 drop-shadow-md relative z-10">{statMedium}</span>
          <span className="text-[11px] text-blue-500/80 uppercase tracking-widest font-bold mt-1 relative z-10 group-hover:text-blue-400 transition-colors">1-7 Tage</span>
        </div>
        <div className="group relative bg-emerald-500/5 backdrop-blur-sm p-4 rounded-2xl border border-emerald-500/20 flex flex-col items-center justify-center text-center overflow-hidden transition-all hover:border-emerald-500/40 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          {/* GlowingEffect entfernt für Performance */}
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <span className="text-3xl font-black text-emerald-400 drop-shadow-md relative z-10">{statLong}</span>
          <span className="text-[11px] text-emerald-500/80 uppercase tracking-widest font-bold mt-1 relative z-10 group-hover:text-emerald-400 transition-colors">&gt; 7 Tage</span>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-5 rounded-2xl flex flex-col md:flex-row gap-4 shadow-xl sticky top-20 z-30">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="Suchen in Frage & Antwort..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all font-medium shadow-inner placeholder:text-slate-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 md:w-56 group">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-hover:text-sky-400 transition-colors w-4 h-4" />
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:border-slate-600 transition-all appearance-none text-sm font-medium shadow-inner cursor-pointer"
            >
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-3 flex-1 md:w-auto">
            <div className="relative flex-1 md:w-48 group">
              <ArrowUpDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-hover:text-sky-400 transition-colors w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl pl-11 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:border-slate-600 transition-all appearance-none text-sm font-medium shadow-inner cursor-pointer"
              >
                <option value="nextReviewDate">Fälligkeit</option>
                <option value="repetition">Wiederholungen</option>
                <option value="efactor">Schwierigkeit</option>
              </select>
            </div>
            <button
              onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
              className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-sky-500/20 hover:border-sky-500/40 transition-all shadow-sm active:scale-95"
              title={sortDir === 'asc' ? 'Aufsteigend sortiert' : 'Absteigend sortiert'}
            >
              <ArrowUpDown className={`w-5 h-5 transition-transform duration-500 ${sortDir === 'desc' ? 'rotate-180 text-sky-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
        {filteredAndSortedCards.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-slate-900/50 rounded-3xl border-2 border-slate-800 border-dashed backdrop-blur-sm">
            <Search className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p className="font-semibold text-lg">Keine Karten gefunden.</p>
            <p className="text-sm mt-1 opacity-70">Passe deine Filterkriterien an.</p>
          </div>
        ) : (
          filteredAndSortedCards.map(card => (
            <motion.div variants={itemVariants} key={card.id} className="relative group bg-slate-900/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all hover:border-sky-500/40 flex flex-col sm:flex-row gap-5 overflow-hidden">
              {/* GlowingEffect entfernt für Performance */}

              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/20 uppercase shadow-sm">
                    {card.topic}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 shadow-inner hover:border-slate-700/80 transition-colors">
                    <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-500 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Frage
                    </span>
                    {editingCardId === card.id ? (
                      <textarea
                        value={editQ}
                        onChange={(e) => setEditQ(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 min-h-[100px] shadow-inner"
                      />
                    ) : (
                      <MathHTML elementType="div" className="text-sm text-slate-200 line-clamp-3 card-html leading-relaxed" html={card.question} />
                    )}
                  </div>
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 shadow-inner hover:border-slate-700/80 transition-colors">
                    <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-sky-400 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" /> Antwort
                    </span>
                    {editingCardId === card.id ? (
                      <textarea
                        value={editA}
                        onChange={(e) => setEditA(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 min-h-[100px] shadow-inner"
                      />
                    ) : (
                      <MathHTML elementType="div" className="text-sm text-slate-300 line-clamp-3 card-html leading-relaxed" html={card.answer} />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-700/50 pt-5 sm:pt-0 sm:pl-5 min-w-[160px] gap-3 relative z-10">
                <div className="flex flex-col gap-2.5 w-full text-xs bg-slate-950/30 p-3 rounded-xl border border-slate-800/50">
                  <div className="flex justify-between items-center group/stat">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium group-hover/stat:text-slate-300 transition-colors"><Calendar className="w-3.5 h-3.5" /> Fällig</span>
                    <span className={`font-bold ${card.nextReviewDate <= Date.now() ? 'text-amber-400 drop-shadow-sm' : 'text-slate-300'}`}>
                      {formatDate(card.nextReviewDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center group/stat">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium group-hover/stat:text-slate-300 transition-colors"><RefreshCcw className="w-3.5 h-3.5" /> Geübt</span>
                    <span className="text-slate-300 font-bold bg-slate-800 px-1.5 py-0.5 rounded">{card.repetition}x</span>
                  </div>
                  <div className="flex justify-between items-center group/stat">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium group-hover/stat:text-slate-300 transition-colors"><Award className="w-3.5 h-3.5" /> E-Faktor</span>
                    <span className="text-slate-300 font-bold bg-slate-800 px-1.5 py-0.5 rounded">{card.efactor.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto w-full justify-end sm:justify-center">
                  {editingCardId === card.id ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="w-10 h-10 flex items-center justify-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 hover:scale-105 active:scale-95 transition-all shadow-sm"
                        title="Speichern"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingCardId(null)}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
                        title="Abbrechen"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditClick(card)}
                      className="w-10 h-10 flex items-center justify-center text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-xl hover:bg-sky-500/20 hover:scale-105 active:scale-95 transition-all shadow-sm"
                      title="Karte bearbeiten"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="w-10 h-10 flex items-center justify-center text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 hover:scale-105 active:scale-95 transition-all shadow-sm"
                    title="Karte löschen"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}


export default App;
