// Geteilte Präsentations-Bausteine der Verbindlichkeits-Plattform.
// Vollständige Tailwind-Klassennamen (keine dynamische Konkatenation), damit der
// Tailwind-4-Scanner sie sicher erfasst.
import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

// Farb-Themen für Avatare, Badges, Akzente
export const THEMES = {
  sky:     { soft: 'bg-sky-500/15 text-sky-300 border-sky-500/30',         solid: 'bg-sky-500',     ring: 'ring-sky-500/40',     glow: 'shadow-[0_0_22px_rgba(56,189,248,0.25)]',  text: 'text-sky-300' },
  emerald: { soft: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', solid: 'bg-emerald-500', ring: 'ring-emerald-500/40', glow: 'shadow-[0_0_22px_rgba(16,185,129,0.25)]', text: 'text-emerald-300' },
  violet:  { soft: 'bg-violet-500/15 text-violet-300 border-violet-500/30', solid: 'bg-violet-500',  ring: 'ring-violet-500/40',  glow: 'shadow-[0_0_22px_rgba(139,92,246,0.25)]',  text: 'text-violet-300' },
  amber:   { soft: 'bg-amber-500/15 text-amber-300 border-amber-500/30',    solid: 'bg-amber-500',   ring: 'ring-amber-500/40',   glow: 'shadow-[0_0_22px_rgba(245,158,11,0.25)]',  text: 'text-amber-300' },
  orange:  { soft: 'bg-orange-500/15 text-orange-300 border-orange-500/30', solid: 'bg-orange-500',  ring: 'ring-orange-500/40',  glow: 'shadow-[0_0_22px_rgba(249,115,22,0.25)]',  text: 'text-orange-300' },
  rose:    { soft: 'bg-rose-500/15 text-rose-300 border-rose-500/30',       solid: 'bg-rose-500',    ring: 'ring-rose-500/40',    glow: 'shadow-[0_0_22px_rgba(244,63,94,0.25)]',   text: 'text-rose-300' },
  pink:    { soft: 'bg-pink-500/15 text-pink-300 border-pink-500/30',       solid: 'bg-pink-500',    ring: 'ring-pink-500/40',    glow: 'shadow-[0_0_22px_rgba(236,72,153,0.25)]',  text: 'text-pink-300' },
  cyan:    { soft: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',       solid: 'bg-cyan-500',    ring: 'ring-cyan-500/40',    glow: 'shadow-[0_0_22px_rgba(34,211,238,0.25)]',  text: 'text-cyan-300' },
  slate:   { soft: 'bg-slate-700/40 text-slate-300 border-slate-600/40',    solid: 'bg-slate-600',   ring: 'ring-slate-500/40',   glow: '',                                          text: 'text-slate-300' },
};
export const theme = (name) => THEMES[name] || THEMES.sky;

export function Icon({ name, className }) {
  const Cmp = LucideIcons[name] || LucideIcons.Circle;
  return <Cmp className={className} />;
}

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZES = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
};

// Avatar mit Initialen. status: 'checked_in' | 'learning' | 'open' (optionaler Punkt)
export function Avatar({ name, color = 'sky', size = 'md', status, you = false }) {
  const t = theme(color);
  const statusColor = status === 'checked_in' ? 'bg-emerald-400' : status === 'learning' ? 'bg-violet-400' : 'bg-slate-500';
  return (
    <div className="relative shrink-0">
      <div className={`${SIZES[size]} ${t.soft} rounded-2xl border flex items-center justify-center font-black tracking-tight select-none`}>
        {initials(name)}
      </div>
      {you && (
        <span className="absolute -top-1.5 -right-1.5 bg-sky-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">DU</span>
      )}
      {status && !you && (
        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${statusColor} rounded-full border-2 border-neutral-950`} />
      )}
    </div>
  );
}

// Konsistente Panel-Karte
export function Card({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function SectionHeader({ icon, color = 'sky', title, subtitle, action }) {
  const t = theme(color);
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && (
          <div className={`w-8 h-8 rounded-xl ${t.soft} border flex items-center justify-center shrink-0`}>
            <Icon name={icon} className="w-4 h-4" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-white font-bold text-base leading-tight truncate">{title}</h2>
          {subtitle && <p className="text-slate-500 text-xs truncate">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// Kreisförmiger Fortschrittsring (SVG)
export function ProgressRing({ pct = 0, size = 56, stroke = 6, color = 'sky', children }) {
  const t = theme(color);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
  const strokeColor = {
    sky: '#38bdf8', emerald: '#34d399', violet: '#a78bfa', amber: '#fbbf24',
    orange: '#fb923c', rose: '#fb7185', pink: '#f472b6', cyan: '#22d3ee', slate: '#64748b',
  }[color] || '#38bdf8';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" className="text-slate-800" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={strokeColor}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center ${t.text}`}>{children}</div>
    </div>
  );
}
