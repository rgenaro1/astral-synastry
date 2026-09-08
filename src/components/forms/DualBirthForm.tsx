'use client';

import React, { useState, useEffect } from 'react';
import { BirthProfileInput, HouseSystem } from '@/lib/types/astrology';

interface DualBirthFormProps {
  onSubmit: (data: {
    personA: BirthProfileInput;
    personB: BirthProfileInput;
    houseSystem: HouseSystem;
  }) => void;
  isLoading: boolean;
}

interface PlaceSuggestion {
  name: string;
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezoneIana: string;
  formattedAddress: string;
}

const PRESET_COUPLES = [
  {
    title: 'Frida Kahlo & Diego Rivera',
    description: 'Amor alquímico, pasión volcánica y contratos de arte sagrado.',
    personA: {
      name: 'Frida Kahlo',
      birthDate: '1907-07-06',
      birthTime: '08:30',
      city: 'Coyoacán',
      country: 'México',
      latitude: 19.3502,
      longitude: -99.1627,
      timezoneIana: 'America/Mexico_City',
    },
    personB: {
      name: 'Diego Rivera',
      birthDate: '1886-12-08',
      birthTime: '20:00',
      city: 'Guanajuato',
      country: 'México',
      latitude: 21.019,
      longitude: -101.2574,
      timezoneIana: 'America/Mexico_City',
    },
  },
  {
    title: 'Marie Curie & Pierre Curie',
    description: 'Devoción serena, complicidad intelectual y propósito compartido.',
    personA: {
      name: 'Marie Curie',
      birthDate: '1867-11-07',
      birthTime: '12:00',
      city: 'Varsovia',
      country: 'Polonia',
      latitude: 52.2297,
      longitude: 21.0122,
      timezoneIana: 'Europe/Warsaw',
    },
    personB: {
      name: 'Pierre Curie',
      birthDate: '1859-05-15',
      birthTime: '02:00',
      city: 'París',
      country: 'Francia',
      latitude: 48.8566,
      longitude: 2.3522,
      timezoneIana: 'Europe/Paris',
    },
  },
];

export const DualBirthForm: React.FC<DualBirthFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [personA, setPersonA] = useState<BirthProfileInput>({
    name: 'Elena Ramos',
    birthDate: '1993-05-14',
    birthTime: '14:30',
    city: 'Trujillo',
    country: 'Perú',
    latitude: -8.1116,
    longitude: -79.0286,
    timezoneIana: 'America/Lima',
  });

  const [personB, setPersonB] = useState<BirthProfileInput>({
    name: 'Mateo Silva',
    birthDate: '1991-10-28',
    birthTime: '09:15',
    city: 'Madrid',
    country: 'España',
    latitude: 40.4168,
    longitude: -3.7038,
    timezoneIana: 'Europe/Madrid',
  });

  const [houseSystem, setHouseSystem] = useState<HouseSystem>('placidus');

  // Autocompletado de lugares
  const [queryA, setQueryA] = useState(personA.city ? `${personA.city}, ${personA.country}` : '');
  const [suggestionsA, setSuggestionsA] = useState<PlaceSuggestion[]>([]);
  const [showSugA, setShowSugA] = useState(false);

  const [queryB, setQueryB] = useState(personB.city ? `${personB.city}, ${personB.country}` : '');
  const [suggestionsB, setSuggestionsB] = useState<PlaceSuggestion[]>([]);
  const [showSugB, setShowSugB] = useState(false);

  useEffect(() => {
    if (queryA.trim().length < 2) {
      setSuggestionsA([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(queryA)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestionsA(data.places || []);
          setShowSugA(true);
        }
      } catch (err) {
        console.error('Error fetching places for A:', err);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [queryA]);

  useEffect(() => {
    if (queryB.trim().length < 2) {
      setSuggestionsB([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(queryB)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestionsB(data.places || []);
          setShowSugB(true);
        }
      } catch (err) {
        console.error('Error fetching places for B:', err);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [queryB]);

  const handleSelectPlaceA = (p: PlaceSuggestion) => {
    setPersonA((prev) => ({
      ...prev,
      city: p.city,
      country: p.country,
      latitude: p.latitude,
      longitude: p.longitude,
      timezoneIana: p.timezoneIana,
    }));
    setQueryA(p.formattedAddress);
    setShowSugA(false);
  };

  const handleSelectPlaceB = (p: PlaceSuggestion) => {
    setPersonB((prev) => ({
      ...prev,
      city: p.city,
      country: p.country,
      latitude: p.latitude,
      longitude: p.longitude,
      timezoneIana: p.timezoneIana,
    }));
    setQueryB(p.formattedAddress);
    setShowSugB(false);
  };

  const handleApplyPreset = (preset: typeof PRESET_COUPLES[0]) => {
    setPersonA(preset.personA);
    setPersonB(preset.personB);
    setQueryA(`${preset.personA.city}, ${preset.personA.country}`);
    setQueryB(`${preset.personB.city}, ${preset.personB.country}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ personA, personB, houseSystem });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto space-y-6">
      {/* Botones de Presets / Demostración Rápida */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-50/70 backdrop-blur-md rounded-2xl border border-astral-roseGold/10 shadow-sm">
        <div>
          <span className="text-xs font-serif text-astral-champagne font-medium block">
            Ejemplos de Conexión Célebre
          </span>
          <span className="text-[11px] text-slate-400 font-light">
            Carga datos históricos con un clic para explorar la precisión del análisis
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_COUPLES.map((c) => (
            <button
              type="button"
              key={c.title}
              onClick={() => handleApplyPreset(c)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-surface-100/90 hover:bg-surface-200 text-slate-200 hover:text-astral-roseGold border border-white/5 transition flex items-center gap-1.5 shadow-sm"
            >
              <span className="text-astral-roseGold">✦</span> {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* TARJETAS GEMELAS DE ENTRADA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONA A */}
        <div className="p-6 sm:p-8 bg-surface-50/80 backdrop-blur-md rounded-3xl border border-astral-roseGold/20 shadow-xl relative space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-astral-roseGold animate-pulse"></span>
              <span className="text-xs font-serif uppercase tracking-widest text-astral-roseGold font-medium">
                Persona A
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {personA.timezoneIana || 'Zona IANA auto'}
            </span>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1.5 font-medium">
              Nombre o Apodo
            </label>
            <input
              type="text"
              required
              value={personA.name}
              onChange={(e) => setPersonA({ ...personA, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-100/80 border border-white/10 text-white text-sm focus:outline-none focus:border-astral-roseGold/70 transition shadow-inner"
              placeholder="Ej: Elena"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                required
                value={personA.birthDate}
                onChange={(e) => setPersonA({ ...personA, birthDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-100/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-astral-roseGold/70 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Hora Exacta (24h)
              </label>
              <input
                type="time"
                required
                value={personA.birthTime}
                onChange={(e) => setPersonA({ ...personA, birthTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-100/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-astral-roseGold/70 transition"
              />
            </div>
          </div>

          {/* Autocomplete de Lugar */}
          <div className="relative">
            <label className="block text-xs text-slate-300 mb-1.5 font-medium">
              Ciudad & País de Nacimiento
            </label>
            <input
              type="text"
              required
              value={queryA}
              onChange={(e) => {
                setQueryA(e.target.value);
                setShowSugA(true);
              }}
              onFocus={() => suggestionsA.length > 0 && setShowSugA(true)}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-100/80 border border-white/10 text-white text-sm focus:outline-none focus:border-astral-roseGold/70 transition"
              placeholder="Ej: Trujillo, Perú..."
            />
            {showSugA && suggestionsA.length > 0 && (
              <ul className="absolute z-30 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-surface-200 border border-astral-roseGold/20 rounded-2xl shadow-2xl divide-y divide-white/5">
                {suggestionsA.map((s, idx) => (
                  <li
                    key={`sugA-${idx}`}
                    onClick={() => handleSelectPlaceA(s)}
                    className="p-3 hover:bg-white/5 cursor-pointer text-xs text-slate-200 transition flex justify-between items-center"
                  >
                    <span>{s.formattedAddress}</span>
                    <span className="text-[10px] text-astral-roseGold font-mono">
                      {s.timezoneIana}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span>Lat: {personA.latitude.toFixed(2)}°</span>
              <span>Long: {personA.longitude.toFixed(2)}°</span>
            </div>
          </div>
        </div>

        {/* PERSONA B */}
        <div className="p-6 sm:p-8 bg-surface-50/80 backdrop-blur-md rounded-3xl border border-astral-champagne/20 shadow-xl relative space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-astral-champagne animate-pulse"></span>
              <span className="text-xs font-serif uppercase tracking-widest text-astral-champagne font-medium">
                Persona B
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {personB.timezoneIana || 'Zona IANA auto'}
            </span>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1.5 font-medium">
              Nombre o Apodo
            </label>
            <input
              type="text"
              required
              value={personB.name}
              onChange={(e) => setPersonB({ ...personB, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-100/80 border border-white/10 text-white text-sm focus:outline-none focus:border-astral-champagne/70 transition shadow-inner"
              placeholder="Ej: Mateo"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                required
                value={personB.birthDate}
                onChange={(e) => setPersonB({ ...personB, birthDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-100/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-astral-champagne/70 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Hora Exacta (24h)
              </label>
              <input
                type="time"
                required
                value={personB.birthTime}
                onChange={(e) => setPersonB({ ...personB, birthTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-100/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-astral-champagne/70 transition"
              />
            </div>
          </div>

          {/* Autocomplete de Lugar */}
          <div className="relative">
            <label className="block text-xs text-slate-300 mb-1.5 font-medium">
              Ciudad & País de Nacimiento
            </label>
            <input
              type="text"
              required
              value={queryB}
              onChange={(e) => {
                setQueryB(e.target.value);
                setShowSugB(true);
              }}
              onFocus={() => suggestionsB.length > 0 && setShowSugB(true)}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-100/80 border border-white/10 text-white text-sm focus:outline-none focus:border-astral-champagne/70 transition"
              placeholder="Ej: Madrid, España..."
            />
            {showSugB && suggestionsB.length > 0 && (
              <ul className="absolute z-30 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-surface-200 border border-astral-champagne/20 rounded-2xl shadow-2xl divide-y divide-white/5">
                {suggestionsB.map((s, idx) => (
                  <li
                    key={`sugB-${idx}`}
                    onClick={() => handleSelectPlaceB(s)}
                    className="p-3 hover:bg-white/5 cursor-pointer text-xs text-slate-200 transition flex justify-between items-center"
                  >
                    <span>{s.formattedAddress}</span>
                    <span className="text-[10px] text-astral-champagne font-mono">
                      {s.timezoneIana}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span>Lat: {personB.latitude.toFixed(2)}°</span>
              <span>Long: {personB.longitude.toFixed(2)}°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sistema de Casas y Botón de Enamoramiento Cósmico */}
      <div className="p-5 bg-surface-50/70 backdrop-blur-md rounded-3xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 font-serif">
            Sistema de Casas:
          </span>
          <select
            value={houseSystem}
            onChange={(e) => setHouseSystem(e.target.value as HouseSystem)}
            className="px-3.5 py-2 rounded-xl bg-surface-100 text-xs text-white border border-white/10 focus:outline-none focus:border-astral-roseGold/50"
          >
            <option value="placidus">Placidus (Clásico Occidental)</option>
            <option value="whole-sign">Whole Sign (Casas Enteras Helenísticas)</option>
            <option value="equal">Equal (Casas Iguales)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-10 py-3.5 rounded-2xl font-serif tracking-wide text-sm text-slate-950 bg-gradient-to-r from-astral-champagne via-astral-roseGold to-astral-mauve hover:opacity-95 shadow-xl shadow-astral-roseGold/15 active:scale-[0.98] transition flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Calculando Efemérides & Revelando la Alquimia...
            </>
          ) : (
            <>
              <span>✦</span>
              <span>Revelar Sinastría & Mapa de Almas</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
