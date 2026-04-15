// Storage-Abstraktionsschicht — Supabase mit localStorage-Fallback
import { supabase, isSupabaseConfigured } from './supabase.js';
import { INITIAL_DECKS, BUNDLED_DECK_ID, BUNDLED_DECK_ID_PREISPOLITIK, DEFAULT_STATS, parseFlashcards, shuffleArray } from './bundledDecks.js';

// ============================================================
// Hilfsfunktionen
// ============================================================

const BUNDLED_DECK_IDS = [BUNDLED_DECK_ID, BUNDLED_DECK_ID_PREISPOLITIK];

function isBundledDeck(deckId) {
  return BUNDLED_DECK_IDS.includes(deckId);
}

/** Eingebaute Deck-Definitionen holen (Karten ohne Fortschritt) */
function getBundledDeckDefinitions() {
  return INITIAL_DECKS.map(deck => ({
    ...deck,
    cards: deck.cards.map(card => ({
      id: card.id,
      topic: card.topic,
      question: card.question,
      answer: card.answer,
      hintType: card.hintType,
    }))
  }));
}

/** SM-2 Standardwerte für neue Karten */
function defaultCardProgress() {
  return {
    state: 'new',
    step: 0,
    interval: 0,
    efactor: 2.5,
    nextReviewDate: Date.now(),
    history: []
  };
}

/** Karten-Definitionen + Fortschritt mergen */
function mergeCardsWithProgress(cards, progressMap) {
  return cards.map(card => ({
    ...card,
    ...(progressMap[card.id] || defaultCardProgress())
  }));
}

// ============================================================
// Benutzer-Verwaltung
// ============================================================

export async function listUsers() {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('dt_users')
    .select('id, name, created_at')
    .order('name');

  if (error) {
    console.error('Fehler beim Laden der Benutzer:', error);
    return [];
  }
  return data || [];
}

export async function createUser(name) {
  if (!isSupabaseConfigured()) return null;

  const trimmed = name.trim();
  if (!trimmed) return null;

  // Prüfen ob Name schon existiert
  const { data: existing } = await supabase
    .from('dt_users')
    .select('id, name')
    .eq('name', trimmed)
    .maybeSingle();

  if (existing) return existing;

  // Neuen User anlegen
  const { data, error } = await supabase
    .from('dt_users')
    .insert({ name: trimmed })
    .select('id, name')
    .single();

  if (error) {
    console.error('Fehler beim Erstellen des Benutzers:', error);
    return null;
  }

  // Standardmäßig alle eingebauten Decks aktivieren
  for (const deckId of BUNDLED_DECK_IDS) {
    await supabase.from('dt_user_bundled_decks').upsert({
      user_id: data.id,
      deck_id: deckId
    });
  }

  // Default-Stats anlegen
  await supabase.from('dt_user_stats').upsert({
    user_id: data.id,
    stats: DEFAULT_STATS
  });

  return data;
}

export async function deleteUser(userId) {
  if (!isSupabaseConfigured()) return false;

  const { error } = await supabase
    .from('dt_users')
    .delete()
    .eq('id', userId);

  return !error;
}

// ============================================================
// Decks laden (Merge-Logik)
// ============================================================

export async function loadUserDecks(userId) {
  if (!isSupabaseConfigured()) {
    // Fallback: localStorage
    try {
      const saved = localStorage.getItem('braingains_decks');
      if (!saved) return INITIAL_DECKS;
      const parsed = JSON.parse(saved);
      // Fehlende gebündelte Decks ergänzen (z.B. nach App-Update mit neuem Deck)
      const savedIds = new Set(parsed.map(d => d.id));
      for (const deck of INITIAL_DECKS) {
        if (isBundledDeck(deck.id) && !savedIds.has(deck.id)) {
          parsed.push(deck);
        }
      }
      return parsed;
    } catch { return INITIAL_DECKS; }
  }

  // 1. Eingebaute Deck-Mitgliedschaften laden
  const { data: bundledMemberships } = await supabase
    .from('dt_user_bundled_decks')
    .select('deck_id')
    .eq('user_id', userId);

  const activeBundledIds = (bundledMemberships || []).map(m => m.deck_id);

  // Fehlende gebündelte Decks automatisch aktivieren (z.B. nach App-Update)
  for (const deckId of BUNDLED_DECK_IDS) {
    if (!activeBundledIds.includes(deckId)) {
      await supabase.from('dt_user_bundled_decks').upsert({
        user_id: userId,
        deck_id: deckId
      });
      activeBundledIds.push(deckId);
    }
  }

  // 2. Benutzererstellte Decks laden
  const { data: userDecks } = await supabase
    .from('dt_user_decks')
    .select('id, name, created_at')
    .eq('user_id', userId);

  // 3. Karten für benutzererstellte Decks laden
  const userDeckIds = (userDecks || []).map(d => d.id);
  let userCardsMap = {};
  if (userDeckIds.length > 0) {
    const { data: userCards } = await supabase
      .from('dt_user_cards')
      .select('*')
      .in('deck_id', userDeckIds);

    (userCards || []).forEach(card => {
      if (!userCardsMap[card.deck_id]) userCardsMap[card.deck_id] = [];
      userCardsMap[card.deck_id].push({
        id: card.id,
        topic: card.topic,
        question: card.question,
        answer: card.answer,
        hintType: card.hint_type || 'normal'
      });
    });
  }

  // 4. Gesamten Fortschritt für den User laden
  const allDeckIds = [...activeBundledIds, ...userDeckIds];
  let progressMap = {}; // { deckId: { cardId: progressFields } }

  if (allDeckIds.length > 0) {
    const { data: progress } = await supabase
      .from('dt_card_progress')
      .select('*')
      .eq('user_id', userId)
      .in('deck_id', allDeckIds);

    (progress || []).forEach(p => {
      if (!progressMap[p.deck_id]) progressMap[p.deck_id] = {};
      progressMap[p.deck_id][p.card_id] = {
        state: p.state,
        step: p.step,
        interval: p.interval,
        efactor: p.efactor,
        nextReviewDate: p.next_review_date,
        history: p.history || []
      };
    });
  }

  // 5. Materialien laden
  const { data: materials } = await supabase
    .from('dt_deck_materials')
    .select('*')
    .eq('user_id', userId);

  const materialsMap = {};
  (materials || []).forEach(m => {
    materialsMap[m.deck_id] = {
      scriptText: m.script_text || '',
      sampleExamText: m.sample_exam_text || ''
    };
  });

  // 6. Alles zusammenbauen
  const result = [];

  // Eingebaute Decks
  const bundledDefs = getBundledDeckDefinitions();
  for (const def of bundledDefs) {
    if (!activeBundledIds.includes(def.id)) continue;
    const deckProgress = progressMap[def.id] || {};
    const deckMaterials = materialsMap[def.id] || {};
    result.push({
      ...def,
      ...deckMaterials,
      cards: mergeCardsWithProgress(def.cards, deckProgress)
    });
  }

  // Benutzererstellte Decks
  for (const deck of (userDecks || [])) {
    const cards = userCardsMap[deck.id] || [];
    const deckProgress = progressMap[deck.id] || {};
    const deckMaterials = materialsMap[deck.id] || {};
    result.push({
      id: deck.id,
      name: deck.name,
      createdAt: deck.created_at,
      ...deckMaterials,
      cards: mergeCardsWithProgress(cards, deckProgress)
    });
  }

  return result;
}

// ============================================================
// Stats laden/speichern
// ============================================================

export async function loadUserStats(userId) {
  if (!isSupabaseConfigured()) {
    try {
      const saved = localStorage.getItem('braingains_stats');
      return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : { ...DEFAULT_STATS };
    } catch { return { ...DEFAULT_STATS }; }
  }

  const { data, error } = await supabase
    .from('dt_user_stats')
    .select('stats')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return { ...DEFAULT_STATS };
  return { ...DEFAULT_STATS, ...data.stats };
}

export async function saveUserStats(userId, stats) {
  if (!isSupabaseConfigured()) return;

  await supabase.from('dt_user_stats').upsert({
    user_id: userId,
    stats
  });
}

// ============================================================
// Karten-Fortschritt speichern
// ============================================================

export async function saveCardProgress(userId, deckId, cardId, fields) {
  if (!isSupabaseConfigured()) return;

  await supabase.from('dt_card_progress').upsert({
    user_id: userId,
    deck_id: deckId,
    card_id: cardId,
    state: fields.state,
    step: fields.step,
    interval: fields.interval,
    efactor: fields.efactor,
    next_review_date: fields.nextReviewDate,
    history: fields.history || []
  });
}

/** Batch-Speicherung für mehrere Karten gleichzeitig */
export async function saveCardProgressBatch(userId, deckId, cards) {
  if (!isSupabaseConfigured()) return;

  const rows = cards.map(card => ({
    user_id: userId,
    deck_id: deckId,
    card_id: card.id,
    state: card.state,
    step: card.step,
    interval: card.interval,
    efactor: card.efactor,
    next_review_date: card.nextReviewDate,
    history: card.history || []
  }));

  // Supabase upsert in Batches von 500
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500);
    await supabase.from('dt_card_progress').upsert(batch);
  }
}

// ============================================================
// Deck-CRUD (benutzererstellte Decks)
// ============================================================

export async function createUserDeck(userId, deck) {
  if (!isSupabaseConfigured()) return;

  // Deck-Metadaten speichern
  await supabase.from('dt_user_decks').upsert({
    id: deck.id,
    user_id: userId,
    name: deck.name,
    created_at: deck.createdAt
  });

  // Karten speichern
  if (deck.cards && deck.cards.length > 0) {
    const cardRows = deck.cards.map(c => ({
      id: c.id,
      deck_id: deck.id,
      topic: c.topic || '',
      question: c.question,
      answer: c.answer,
      hint_type: c.hintType || 'normal'
    }));

    for (let i = 0; i < cardRows.length; i += 500) {
      const batch = cardRows.slice(i, i + 500);
      await supabase.from('dt_user_cards').upsert(batch);
    }
  }

  // Materialien speichern (falls vorhanden)
  if (deck.scriptText || deck.sampleExamText) {
    await saveDeckMaterials(userId, deck.id, deck.scriptText, deck.sampleExamText);
  }
}

export async function deleteUserDeck(userId, deckId) {
  if (!isSupabaseConfigured()) return;

  if (isBundledDeck(deckId)) {
    // Eingebautes Deck: nur Mitgliedschaft + Fortschritt löschen
    await supabase.from('dt_user_bundled_decks').delete()
      .eq('user_id', userId).eq('deck_id', deckId);
  } else {
    // Benutzererstelltes Deck: komplett löschen (CASCADE löscht user_cards)
    await supabase.from('dt_user_decks').delete().eq('id', deckId);
  }

  // Fortschritt und Materialien löschen
  await supabase.from('dt_card_progress').delete()
    .eq('user_id', userId).eq('deck_id', deckId);
  await supabase.from('dt_deck_materials').delete()
    .eq('user_id', userId).eq('deck_id', deckId);
}

/** Karten eines benutzererstellten Decks aktualisieren (nach Import/Edit) */
export async function updateDeckCards(userId, deckId, cards) {
  if (!isSupabaseConfigured() || isBundledDeck(deckId)) return;

  // Alte Karten löschen und neu einfügen
  await supabase.from('dt_user_cards').delete().eq('deck_id', deckId);

  const cardRows = cards.map(c => ({
    id: c.id,
    deck_id: deckId,
    topic: c.topic || '',
    question: c.question,
    answer: c.answer,
    hint_type: c.hintType || 'normal'
  }));

  for (let i = 0; i < cardRows.length; i += 500) {
    const batch = cardRows.slice(i, i + 500);
    await supabase.from('dt_user_cards').upsert(batch);
  }
}

// ============================================================
// Materialien (Skripte, Musterklausuren)
// ============================================================

export async function saveDeckMaterials(userId, deckId, scriptText, sampleExamText) {
  if (!isSupabaseConfigured()) return;

  await supabase.from('dt_deck_materials').upsert({
    user_id: userId,
    deck_id: deckId,
    script_text: scriptText || '',
    sample_exam_text: sampleExamText || ''
  });
}

// ============================================================
// Migration: localStorage → Supabase
// ============================================================

export async function importLocalStorageData(userId) {
  if (!isSupabaseConfigured()) return false;

  const savedDecks = localStorage.getItem('braingains_decks');
  const savedStats = localStorage.getItem('braingains_stats');

  if (!savedDecks && !savedStats) return false;

  try {
    // Stats importieren
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      await saveUserStats(userId, { ...DEFAULT_STATS, ...stats });
    }

    // Decks importieren
    if (savedDecks) {
      const decks = JSON.parse(savedDecks);

      for (const deck of decks) {
        if (isBundledDeck(deck.id)) {
          // Eingebautes Deck: nur Fortschritt importieren
          await supabase.from('dt_user_bundled_decks').upsert({
            user_id: userId,
            deck_id: deck.id
          });

          // Karten-Fortschritt speichern
          if (deck.cards) {
            await saveCardProgressBatch(userId, deck.id, deck.cards);
          }

          // Materialien speichern
          if (deck.scriptText || deck.sampleExamText) {
            await saveDeckMaterials(userId, deck.id, deck.scriptText, deck.sampleExamText);
          }
        } else {
          // Benutzererstelltes Deck: komplett importieren
          await createUserDeck(userId, deck);

          // Fortschritt separat speichern
          if (deck.cards) {
            await saveCardProgressBatch(userId, deck.id, deck.cards);
          }
        }
      }
    }

    return true;
  } catch (err) {
    console.error('Fehler beim Importieren der localStorage-Daten:', err);
    return false;
  }
}

// ============================================================
// Alle User mit Stats laden (für Lerngruppe)
// ============================================================

export async function loadAllUsersWithStats() {
  if (!isSupabaseConfigured()) return [];

  const { data: users, error } = await supabase
    .from('dt_users')
    .select('id, name, created_at')
    .order('name');

  if (error || !users) return [];

  // Stats für alle User laden
  const userIds = users.map(u => u.id);
  const { data: allStats } = await supabase
    .from('dt_user_stats')
    .select('user_id, stats')
    .in('user_id', userIds);

  const statsMap = {};
  (allStats || []).forEach(s => {
    statsMap[s.user_id] = { ...DEFAULT_STATS, ...s.stats };
  });

  return users.map(user => ({
    ...user,
    stats: statsMap[user.id] || { ...DEFAULT_STATS }
  }));
}

/** Debounce-Wrapper für Supabase-Saves */
export function createDebouncedSaver(fn, delay = 2000) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ============================================================
// Sync: Gesamten Deck-Zustand nach Supabase schreiben
// ============================================================

export async function syncDecksToSupabase(userId, decks) {
  if (!isSupabaseConfigured()) return;

  for (const deck of decks) {
    // Fortschritt für alle Karten speichern
    if (deck.cards && deck.cards.length > 0) {
      await saveCardProgressBatch(userId, deck.id, deck.cards);
    }

    // Materialien speichern
    if (deck.scriptText !== undefined || deck.sampleExamText !== undefined) {
      await saveDeckMaterials(userId, deck.id, deck.scriptText, deck.sampleExamText);
    }

    // Benutzererstellte Decks: Karten-Definitionen aktualisieren
    if (!isBundledDeck(deck.id)) {
      // Sicherstellen dass Deck existiert
      await supabase.from('dt_user_decks').upsert({
        id: deck.id,
        user_id: userId,
        name: deck.name,
        created_at: deck.createdAt
      });
      await updateDeckCards(userId, deck.id, deck.cards || []);
    }
  }
}
