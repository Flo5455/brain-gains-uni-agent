// Benutzerauswahl-Screen — einfache Namenseingabe ohne Passwort
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, Trash2, Loader2, WifiOff, BrainCircuit, LogIn, ArrowRight } from 'lucide-react';
import { listUsers, createUser, deleteUser } from '../lib/storage.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

export default function UserSelect({ onUserSelected }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      setOffline(true);
      setLoading(false);
      return;
    }
    try {
      const data = await listUsers();
      setUsers(data);
      setOffline(false);
    } catch {
      setOffline(true);
    }
    setLoading(false);
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    setError('');
    try {
      const user = await createUser(newName.trim());
      if (user) {
        onUserSelected(user);
      } else {
        setError('Benutzer konnte nicht erstellt werden.');
      }
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.');
    }
    setCreating(false);
  }

  async function handleDelete(e, userId) {
    e.stopPropagation();
    if (!confirm('Benutzer und alle Daten wirklich löschen?')) return;
    await deleteUser(userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
  }

  function handleOfflineMode() {
    // Offline-Modus: localStorage verwenden, kein User-Objekt nötig
    onUserSelected({ id: 'local', name: 'Offline' });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleCreate();
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Hintergrund-Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-sky-500/10 border border-sky-500/30 rounded-3xl mb-6 shadow-[0_0_40px_rgba(56,189,248,0.15)]"
          >
            <BrainCircuit className="w-10 h-10 text-sky-400" />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Brain Gains</h1>
          <p className="text-slate-400 text-sm">Wähle dein Profil oder erstelle ein neues</p>
        </div>

        {/* Offline-Banner */}
        {offline && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3"
          >
            <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-amber-300 text-sm font-semibold">Keine Verbindung zu Supabase</p>
              <p className="text-amber-400/70 text-xs mt-0.5">Daten werden lokal im Browser gespeichert.</p>
            </div>
          </motion.div>
        )}

        {/* Lade-Zustand */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          </div>
        )}

        {/* Benutzer-Liste */}
        {!loading && !offline && (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3 mb-6">
            {users.length === 0 && !showCreate && (
              <motion.p variants={itemVariants} className="text-center text-slate-500 py-8 text-sm">
                Noch keine Benutzer vorhanden. Erstelle dein Profil!
              </motion.p>
            )}

            {users.map(user => (
              <motion.button
                key={user.id}
                variants={itemVariants}
                onClick={() => onUserSelected(user)}
                className="w-full group bg-slate-900/60 border border-slate-700/50 hover:border-sky-500/40 rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)] cursor-pointer"
              >
                <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center group-hover:bg-sky-500/20 transition-colors shrink-0">
                  <User className="w-6 h-6 text-sky-400" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-white font-bold text-lg block leading-tight">{user.name}</span>
                  <span className="text-slate-500 text-xs">
                    Erstellt am {new Date(user.created_at).toLocaleDateString('de-DE')}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-sky-400 transition-colors" />

                {/* Löschen-Button */}
                <button
                  onClick={(e) => handleDelete(e, user.id)}
                  className="p-2 rounded-xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Benutzer löschen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Neuen Benutzer erstellen */}
        {!loading && !offline && (
          <AnimatePresence mode="wait">
            {!showCreate ? (
              <motion.button
                key="create-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreate(true)}
                className="w-full bg-sky-500/10 border border-sky-500/30 hover:border-sky-500/50 rounded-2xl p-4 flex items-center justify-center gap-3 text-sky-400 hover:text-sky-300 font-bold transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]"
              >
                <Plus className="w-5 h-5" />
                Neues Profil erstellen
              </motion.button>
            ) : (
              <motion.div
                key="create-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5"
              >
                <label className="block text-sm font-bold text-slate-400 mb-3">Dein Name</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="z.B. Florian"
                    autoFocus
                    className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-sky-500/50 focus:outline-none transition-colors"
                  />
                  <button
                    onClick={handleCreate}
                    disabled={creating || !newName.trim()}
                    className="px-5 py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {creating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <LogIn className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {error && (
                  <p className="text-rose-400 text-sm mt-3">{error}</p>
                )}
                <button
                  onClick={() => { setShowCreate(false); setNewName(''); setError(''); }}
                  className="text-slate-500 text-sm mt-3 hover:text-slate-400 cursor-pointer"
                >
                  Abbrechen
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Offline-Modus Button */}
        {!loading && offline && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleOfflineMode}
            className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl p-5 flex items-center justify-center gap-3 text-white font-bold transition-all cursor-pointer"
          >
            <WifiOff className="w-5 h-5 text-slate-400" />
            Im Offline-Modus fortfahren
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
