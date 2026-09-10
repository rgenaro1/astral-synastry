'use client';

import React from 'react';
import { NatalChart, ZodiacSignName } from '@/lib/types/astrology';

const ZODIAC_GLYPHS: Record<ZodiacSignName, string> = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓',
};

interface PlanetaryPositionsTableProps {
  chart: NatalChart;
  accentColor?: 'cyan' | 'azure' | 'roseGold' | 'champagne';
}

export const PlanetaryPositionsTable: React.FC<PlanetaryPositionsTableProps> = ({
  chart,
  accentColor = 'cyan',
}) => {
  const { profile, angles, planets, houseSystem } = chart;

  const sun = planets.find((p) => p.id === 'sun');
  const moon = planets.find((p) => p.id === 'moon');

  return (
    <div className="space-y-4">
      {/* Resumen de Datos de Nacimiento & Puntos Angulares */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-100/60 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-astral-cyan animate-pulse"></span>
            <span className="text-xs font-serif uppercase tracking-widest text-white font-medium">
              Efemérides Astronómicas: {profile.name}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-light">
            📅 {profile.birthDate} · ⏰ {profile.birthTime} · 📍 {profile.city}, {profile.country} (
            {profile.latitude.toFixed(2)}°, {profile.longitude.toFixed(2)}°) · Casas {houseSystem.toUpperCase()}
          </p>
        </div>

        {/* Badges de Signos Clave */}
        <div className="flex flex-wrap gap-2 text-xs">
          {sun && (
            <div className="px-3 py-1 rounded-xl bg-surface-200/80 border border-white/10 flex items-center gap-1.5 text-white">
              <span className="text-amber-300">☉ Sol</span>
              <span className="font-medium">{sun.sign}</span>
              <span className="font-mono text-[11px] text-slate-400">
                {Math.floor(sun.signDegree)}°
              </span>
            </div>
          )}
          {moon && (
            <div className="px-3 py-1 rounded-xl bg-surface-200/80 border border-white/10 flex items-center gap-1.5 text-white">
              <span className="text-sky-300">☽ Luna</span>
              <span className="font-medium">{moon.sign}</span>
              <span className="font-mono text-[11px] text-slate-400">
                {Math.floor(moon.signDegree)}°
              </span>
            </div>
          )}
          {angles?.ascendant && (
            <div className="px-3 py-1 rounded-xl bg-surface-200/80 border border-astral-cyan/30 flex items-center gap-1.5 text-white">
              <span className="text-astral-cyan">Ascendente</span>
              <span className="font-medium">{angles.ascendant.sign}</span>
              <span className="font-mono text-[11px] text-astral-cyan">
                {Math.floor(angles.ascendant.signDegree)}°
              </span>
            </div>
          )}
          {angles?.midheaven && (
            <div className="px-3 py-1 rounded-xl bg-surface-200/80 border border-white/10 flex items-center gap-1.5 text-white">
              <span className="text-indigo-300">MC</span>
              <span className="font-medium">{angles.midheaven.sign}</span>
              <span className="font-mono text-[11px] text-slate-400">
                {Math.floor(angles.midheaven.signDegree)}°
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabla Completa de Cuerpos Celestes */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface-50/70 shadow-lg">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-surface-100/80 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="p-3 sm:px-4">Astro / Planeta</th>
              <th className="p-3 sm:px-4">Signo Zodiacal</th>
              <th className="p-3 sm:px-4">Posición Exacta</th>
              <th className="p-3 sm:px-4">Casa</th>
              <th className="p-3 sm:px-4">Movimiento</th>
              <th className="p-3 sm:px-4">Longitud Total (0-360°)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-light">
            {planets.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition">
                <td className="p-3 sm:px-4 font-medium text-white flex items-center gap-2">
                  <span className="text-base text-astral-cyan font-serif">{p.symbol}</span>
                  <span>{p.name}</span>
                </td>
                <td className="p-3 sm:px-4 text-slate-200">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-astral-cyan">{ZODIAC_GLYPHS[p.sign] || '✦'}</span>
                    <span>{p.sign}</span>
                  </span>
                </td>
                <td className="p-3 sm:px-4 font-mono font-medium text-astral-cyan">
                  {p.degreeFormatted || `${p.signDegree.toFixed(2)}°`}
                </td>
                <td className="p-3 sm:px-4 font-mono text-slate-300">
                  Casa {p.house}
                </td>
                <td className="p-3 sm:px-4">
                  {p.isRetrograde ? (
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                      ℞ Retrógrado
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                      Directo
                    </span>
                  )}
                </td>
                <td className="p-3 sm:px-4 font-mono text-slate-400">
                  {p.longitude.toFixed(2)}°
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
