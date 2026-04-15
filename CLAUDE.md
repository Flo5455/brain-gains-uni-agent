# Brain Gains — Technische Dokumentation

## Tech Stack
- **React 19** — Funktionale Komponenten mit Hooks
- **Vite 8** — Build-Tool und Dev-Server
- **Tailwind CSS 4** — Utility-first Styling (via `@tailwindcss/vite` Plugin)
- **Framer Motion 12** — Animationen und Transitions (`motion.*`, `AnimatePresence`)
- **KaTeX** — LaTeX-Mathe-Rendering in Karteikarten
- **Lucide React** — Icon-Bibliothek
- **canvas-confetti + tsparticles** — Visuelle Effekte
- **Google Gemini 2.0 Flash API** — KI-Prüfungsgenerierung und -Bewertung
- **clsx + tailwind-merge + class-variance-authority** — CSS-Utility-Komposition

## Projektstruktur
```
src/
  App.jsx              ← MONOLITH: ~3300 Zeilen, enthält ALLE Hauptkomponenten
  components.jsx       ← BGPattern, ParticleTextEffect, GlowingEffect, SparklesCore
  components/ui/
    apple-dock.jsx     ← Apple Dock Navigation (Bottom-Nav)
  lib/
    utils.js           ← cn() Helper (clsx + twMerge)
  assets/              ← Bilder (hero.png, etc.)
  index.css            ← Tailwind-Import + Custom Scrollbar + 3D-Card-Styles
  main.jsx             ← React Entry Point
  App.css              ← App-spezifische Styles
```

## App.jsx — Komponentenübersicht (Monolith)
Die gesamte App-Logik lebt in einer Datei. Grobe Zeilenbereiche:
- **Z. 14-175:** SVG-Hint-Komponenten (LinearRegressionHint, NormalDistributionHint, etc.)
- **Z. 184-474:** Hardcoded Karteikarten-Daten als TSV (`RAW_FLASHCARDS_TSV`)
- **Z. 475-558:** Parsing- und Shuffle-Logik
- **Z. 569-625:** Gemini API Integration (Key aus `.env`)
- **Z. 626-648:** MathHTML Komponente
- **Z. 649-1090:** Haupt-App-Komponente (State, Routing, Deck-Verwaltung)
- **Z. 1091-1281:** AchievementPopup + GamificationModal
- **Z. 1282-1614:** DashboardTab
- **Z. 1615-1629:** NavButton
- **Z. 1630-2026:** LearnTab (Spaced Repetition, SM-2 Algorithmus)
- **Z. 2030-2086:** ACHIEVEMENT_DEFS
- **Z. 2087-2500:** StatsTab + StatCard
- **Z. 2501-3043:** ExamTab (KI-Prüfungsgenerierung)
- **Z. 3044-3331:** CardManagementTab

## Features
- **Dashboard:** Deck-Übersicht, Erstellen, Upload (TSV), Export, Löschen
- **Lernen:** Spaced Repetition mit SM-2, 3D-Flip-Animationen, Themenfilter, 4 Schwierigkeitsgrade
- **Statistiken:** XP, Level, Streak, Achievements, Themen-Mastery, Prüfungshistorie
- **Prüfungen:** KI-generierte Klausuren aus Skript-Material (MCQ + offene Fragen)
- **Kartenverwaltung:** Suche, Filter, Sortierung, Bearbeiten, Löschen

## Datenpersistenz
Alles in `localStorage`:
- `statmeister_decks` — Alle Decks mit Karten, Skripten, Metadaten
- `statmeister_stats` — XP, Streak, Level, Achievements, Prüfungshistorie

## Coding Conventions
- Funktionale React-Komponenten (keine Klassen)
- Tailwind CSS für alles — kein separates CSS außer `index.css`
- Dark Theme als Default (slate-900/950 Palette)
- Framer Motion für Animationen
- Icons: destructured Import aus `lucide-react`
- Responsive: Mobile-first mit `sm:`, `md:`, `lg:` Breakpoints

## Build & Deploy
```bash
npm run dev      # Entwicklungsserver (http://localhost:5173)
npm run build    # Production-Build nach dist/
npm run preview  # Build lokal testen
npm run lint     # ESLint
```
- **Path-Alias:** `@` → `./src` (konfiguriert in `vite.config.js`)
- **Deployment:** Netlify (statisch, `dist/` Verzeichnis)
- **API-Key:** In `.env` als `VITE_GEMINI_API_KEY` (NICHT committen!)

## Bekannte Probleme
- Monolithische App.jsx (~3300 Zeilen) — sollte schrittweise aufgeteilt werden
- Kein Backend/Datenbank — alles nur in localStorage (Datenverlust möglich)
- Keine User-Authentifizierung
- Keine Tests vorhanden
- Kein Error Boundary
- Keine PWA-Konfiguration (kein Service Worker, kein Manifest)

## Refactoring-Roadmap
1. ~~API-Key in .env verschieben~~ ✅
2. App.jsx in Komponenten aufteilen (Gemini → Hints → Feature-Tabs)
3. Storage-Abstraktionsschicht für späteren Datenbank-Wechsel
4. Datenbank + Auth anbinden
5. PWA-Konfiguration (Service Worker, Manifest)
