# Brain Gains — Technische Dokumentation

> **Wichtig:** Dies ist der **Design-Thinking-Prototyp** (Uni-Duplikat) und wurde
> von einer Karteikarten-Lern-App zu einer **Lern-Verbindlichkeits-Plattform**
> umgebaut. Die alten Funktionen (Karteikarten, Spaced Repetition/SM-2,
> KI-Klausuren via Gemini) sind **nicht mehr in der App sichtbar**. Im Bericht
> gelten sie als „noch nicht umgesetzte Roadmap".

## Zweck
Prototyp zur Forschungsfrage: Wie schafft man fuer isoliert lernende
Fernstudierende ein Gefuehl sozialer Verbindlichkeit? Leitprinzipien: soziale
Kopraesenz ohne Abstimmungsaufwand, sichtbarer Mikro-Fortschritt, Einstieg in
unter 10 Sekunden, ermutigender (nicht defizitorientierter) Ton.

## Tech Stack
- **React 19** — Funktionale Komponenten mit Hooks
- **Vite 8** — Build-Tool und Dev-Server
- **Tailwind CSS 4** — Utility-first Styling (via `@tailwindcss/vite`)
- **Framer Motion 12** — Animationen/Transitions
- **Lucide React** — Icons
- **canvas-confetti + tsparticles** — visuelle Effekte
- **clsx + tailwind-merge** — `cn()` Helper

## Aktuelle App-Struktur
```
src/
  App.jsx              ← Orchestrator: Onboarding-Gate, Header, 3-Tab-Dock, Routing,
                         Lernziel-Modal, Check-in-Feedback (Konfetti/Toast/Badge-Popup)
  dt/
    Onboarding.jsx     ← Startscreen „Was lernst du heute?" (Name + Tagesziel)
    Dashboard.jsx      ← Streak, Check-in, Tagesziele (abhakbar), Wochenuebersicht, Badges
    GroupView.jsx      ← Lerncrew: Check-in-Status je Mitglied, eigener Check-in, Einladungslink
    CoLearning.jsx     ← Optionaler stiller Lernraum (Body Doubling) mit Anwesenheit + Fokus-Timer
    ui.jsx             ← Geteilte Bausteine: Avatar, Card, SectionHeader, ProgressRing, theme/Icon
  lib/
    dtStore.js         ← Zustands-/Logikschicht: useCommitState-Hook, Streak-/Check-in-/Badge-Logik,
                         Seed-Daten (SEED_PEERS, SEED_ROOM, BADGES), Datums-Helfer
    utils.js           ← cn()
  components.jsx       ← BGPattern, SparklesCore, GlowingEffect, Particle-Effekte (weiter genutzt)
  components/ui/apple-dock.jsx ← Apple-Dock-Bottom-Nav
  index.css            ← Tailwind-Import + Custom Scrollbar
  main.jsx             ← Entry Point
```

## Navigation (3 Tabs, Apple-Dock)
Dashboard · Gruppe · Co-Learning. Desktop: Dock relativ im Header. Mobil: Dock
schwebt unten (eine Instanz, viewport-abhaengig via `useIsDesktop`, damit kein
Framer-`layoutId`-Konflikt entsteht; Header hat `backdrop-blur`, das einen
Containing-Block fuer `position:fixed` erzeugt).

## Datenpersistenz
**Reines localStorage** (Key `dt_commit_state_v1`). Kein Backend noetig: eigene
Aktionen werden echt persistiert, andere Personen sind Seed-Daten. Beim ersten
Start werden realistische Demo-Daten gesetzt (Streak 4, Badges, Wochen-History),
damit das Dashboard sofort lebendig wirkt. Tageswechsel setzt Tagesziele und
Lernziel zurueck (`normalizeForToday`).

> Supabase (`src/lib/supabase.js`, `src/lib/storage.js`) ist nur initialisiert,
> wenn `VITE_SUPABASE_*`-Keys gesetzt sind — sonst `null`. Die neue Plattform
> nutzt es NICHT. Falls je etwas in Supabase soll: nur NEUE Tabellen mit Praefix
> `dt_` (geteilte DB mit produktiver App!), bestehende niemals aendern.

## Coding Conventions
- Funktionale Komponenten, Tailwind fuer alles, Dark Theme (slate-900/950)
- Mobile-first, Touch-Targets ≥ 44px, kein horizontales Scrollen
- Ermutigender Ton in allen Texten (z. B. „Heute ist ein guter Tag fuer einen Neustart")

## Build & Deploy
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```
- **Path-Alias:** `@` → `./src`
- **Deploy:** Netlify-Site `brain-gains-uni-projekt`
  (https://brain-gains-uni-projekt.netlify.app), git-verknuepft mit
  `Flo5455/brain-gains-uni-agent`, **Auto-Deploy bei Push auf `main`**.
  Config in `netlify.toml`.

## Hinweis zur Lint-Config
Die ESLint-Flat-Config des Projekts meldet `motion` (in `<motion.div>`) als
ungenutzt und `react-refresh/only-export-components` fuer Konstanten-Exporte —
beides projektweite Config-Eigenheiten (auch in den Altdateien), keine echten
Fehler. `npm run build` ist davon unberuehrt.
