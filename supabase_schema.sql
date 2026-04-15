-- Brain Gains — Datenbank-Schema
-- Erstellt am 2026-04-04

-- Benutzer (nur Name, kein Passwort)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Benutzererstellte Decks (eingebaute Decks wie Statistik NICHT hier)
CREATE TABLE IF NOT EXISTS user_decks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

-- Kartendefinitionen nur für benutzererstellte Decks
CREATE TABLE IF NOT EXISTS user_cards (
  id TEXT NOT NULL,
  deck_id TEXT REFERENCES user_decks(id) ON DELETE CASCADE NOT NULL,
  topic TEXT DEFAULT '',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  hint_type TEXT DEFAULT 'normal',
  PRIMARY KEY (deck_id, id)
);

-- Lernfortschritt für ALLE Karten (eingebaut + benutzererstellte), pro User
CREATE TABLE IF NOT EXISTS card_progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  deck_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  state TEXT DEFAULT 'new',
  step INTEGER DEFAULT 0,
  interval REAL DEFAULT 0,
  efactor REAL DEFAULT 2.5,
  next_review_date BIGINT NOT NULL,
  history JSONB DEFAULT '[]',
  PRIMARY KEY (user_id, deck_id, card_id)
);

-- User-Stats als JSON-Blob (xp, level, streak, achievements, examHistory etc.)
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  stats JSONB NOT NULL DEFAULT '{}'
);

-- Lernmaterialien (Skripte, Musterklausuren) pro Deck pro User
CREATE TABLE IF NOT EXISTS deck_materials (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  deck_id TEXT NOT NULL,
  script_text TEXT DEFAULT '',
  sample_exam_text TEXT DEFAULT '',
  PRIMARY KEY (user_id, deck_id)
);

-- Welche eingebauten Decks hat ein User aktiviert
CREATE TABLE IF NOT EXISTS user_bundled_decks (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  deck_id TEXT NOT NULL,
  PRIMARY KEY (user_id, deck_id)
);

-- Performance-Indexes
CREATE INDEX IF NOT EXISTS idx_card_progress_user_deck ON card_progress(user_id, deck_id);
CREATE INDEX IF NOT EXISTS idx_card_progress_review ON card_progress(user_id, next_review_date);
CREATE INDEX IF NOT EXISTS idx_user_decks_user ON user_decks(user_id);

-- RLS deaktiviert lassen (kein Auth, Student-Projekt)
-- Alle Tabellen sind standardmäßig ohne RLS → voller Zugriff über anon key
