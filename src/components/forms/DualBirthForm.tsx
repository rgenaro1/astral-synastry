'use client';

import React, { useState, useEffect } from 'react';
import { BirthProfileInput, HouseSystem } from '@/lib/types/astrology';
import { LocationMapModal } from './LocationMapModal';
import { GeocodedPlace } from '@/lib/geo/geocoding';

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
  {
    title: 'John Lennon & Yoko Ono',
    description: 'Unión contracultural, resonancia telepática y pacto creador.',
    personA: {
      name: 'John Lennon',
      birthDate: '1940-10-09',
      birthTime: '18:30',
      city: 'Liverpool',
      country: 'Reino Unido',
      latitude: 53.4084,
      longitude: -2.9916,
      timezoneIana: 'Europe/London',
    },
    personB: {
      name: 'Yoko Ono',
      birthDate: '1933-02-18',
      birthTime: '20:30',
      city: 'Tokio',
      country: 'Japón',
      latitude: 35.6762,
      longitude: 139.6503,
      timezoneIana: 'Asia/Tokyo',
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

  // Búsqueda de lugares
  const [queryA, setQueryA] = useState(personA.city ? `${personA.city}, ${personA.country}` : '');
  const [suggestionsA, setSuggestionsA] = useState<PlaceSuggestion[]>([]);
  const [showSugA, setShowSugA] = useState(false);

  const [queryB, setQueryB] = useState(personB.city ? `${personB.city}, ${personB.country}` : '');
  const [suggestionsB, setSuggestionsB] = useState<PlaceSuggestion[]>([]);
  const [showSugB, setShowSugB] = useState(false);

  const [isSearchingA, setIsSearchingA] = useState(false);
  const [isSearchingB, setIsSearchingB] = useState(false);

  // Modal de Mapa
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapTarget, setMapTarget] = useState<'personA' | 'personB'>('personA');

  // Mensajes de validación local
  const [formError, setFormError] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    if (queryA.trim().length < 2) {
      setSuggestionsA([]);
      setIsSearchingA(false);
      return;
    }
    setIsSearchingA(true);
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
      } finally {
        setIsSearchingA(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [queryA]);

  useEffect(() => {
    if (queryB.trim().length < 2) {
      setSuggestionsB([]);
      setIsSearchingB(false);
      return;
    }
    setIsSearchingB(true);
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
      } finally {
        setIsSearchingB(false);
      }
    }, 300);
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
    setFormError(null);
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
    setFormError(null);
  };

  const handleOpenMap = (target: 'personA' | 'personB') => {
    setMapTarget(target);
    setIsMapOpen(true);
  };

  const handleLocationFromMap = (place: GeocodedPlace) => {
    if (mapTarget === 'personA') {
      setPersonA((prev) => ({
        ...prev,
        city: place.city,
        country: place.country,
        latitude: place.latitude,
        longitude: place.longitude,
        timezoneIana: place.timezoneIana,
      }));
      setQueryA(place.formattedAddress);
      setShowSugA(false);
    } else {
      setPersonB((prev) => ({
        ...prev,
        city: place.city,
        country: place.country,
        latitude: place.latitude,
        longitude: place.longitude,
        timezoneIana: place.timezoneIana,
      }));
      setQueryB(place.formattedAddress);
      setShowSugB(false);
    }
    setFormError(null);
  };

  const handleApplyPreset = (preset: typeof PRESET_COUPLES[0]) => {
    setPersonA(preset.personA);
    setPersonB(preset.personB);
    setQueryA(`${preset.personA.city}, ${preset.personA.country}`);
    setQueryB(`${preset.personB.city}, ${preset.personB.country}`);
    setFormError(null);
  };

  // Resuelve una consulta de ciudad en el cliente
  const resolveCityHelper = async (queryText: string): Promise<PlaceSuggestion | null> => {
    if (!queryText || queryText.trim().length < 2) return null;
    try {
      const res = await fetch(`/api/geo/search?q=${encodeURIComponent(queryText.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.places && data.places.length > 0) {
          return data.places[0];
        }
      }
    } catch (err) {
      console.error('Error auto-resolving city:', err);
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsResolving(true);

    try {
      let finalA = { ...personA };
      let finalB = { ...personB };

      // 1. Auto-resolver A si faltan coordenadas o ciudad
      if (!finalA.city || !finalA.country || finalA.latitude === 0) {
        const searchTxt = queryA.trim() || finalA.city;
        if (searchTxt && searchTxt.length >= 2) {
          const resolved = await resolveCityHelper(searchTxt);
          if (resolved) {
            finalA = {
              ...finalA,
              city: resolved.city,
              country: resolved.country,
              latitude: resolved.latitude,
              longitude: resolved.longitude,
              timezoneIana: resolved.timezoneIana,
            };
            setPersonA(finalA);
            setQueryA(resolved.formattedAddress);
          }
        }
      }

      // 2. Auto-resolver B si faltan coordenadas o ciudad
      if (!finalB.city || !finalB.country || finalB.latitude === 0) {
        const searchTxt = queryB.trim() || finalB.city;
        if (searchTxt && searchTxt.length >= 2) {
          const resolved = await resolveCityHelper(searchTxt);
          if (resolved) {
            finalB = {
              ...finalB,
              city: resolved.city,
              country: resolved.country,
              latitude: resolved.latitude,
              longitude: resolved.longitude,
              timezoneIana: resolved.timezoneIana,
            };
            setPersonB(finalB);
            setQueryB(resolved.formattedAddress);
          }
        }
      }

      // 3. Validar que las coordenadas sean válidas
      if (!finalA.city || finalA.latitude === 0 || !finalA.timezoneIana) {
        setFormError(
          `⚠️ Falta fijar las coordenadas de ${finalA.name || 'Persona A'}. Selecciona una ciudad de la lista o pulsa "🗺️ Elegir en Mapa".`
        );
        return;
      }

      if (!finalB.city || finalB.latitude === 0 || !finalB.timezoneIana) {
        setFormError(
          `⚠️ Falta fijar las coordenadas de ${finalB.name || 'Persona B'}. Selecciona una ciudad de la lista o pulsa "🗺️ Elegir en Mapa".`
        );
        return;
      }

      // Enviar datos validados
      onSubmit({ personA: finalA, personB: finalB, houseSystem });
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto space-y-6">
      {/* Selector de Presets / Demostración Rápida */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-50/70 backdrop-blur-md rounded-2xl border border-astral-cyan/20 shadow-sm">
        <div>
          <span className="text-xs font-serif text-astral-cyan font-medium block">
            Ejemplos Célebres Pre-cargados
          </span>
          <span className="text-[11px] text-slate-400 font-light">
            Carga datos con un clic para verificar cómo cambian las efemérides y el mapa según cada persona:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_COUPLES.map((c) => (
            <button
              type="button"
              key={c.title}
              onClick={() => handleApplyPreset(c)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-surface-100/90 hover:bg-surface-200 text-slate-200 hover:text-astral-cyan border border-white/5 transition flex items-center gap-1.5 shadow-sm"
            >
              <span className="text-astral-cyan">✦</span> {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Alerta de Error de Validación Inline */}
      {formError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex justify-between items-center animate-fadeIn shadow-lg">
          <span className="font-serif">{formError}</span>
          <button
            type="button"
            onClick={() => setFormError(null)}
            className="text-rose-300 hover:text-white font-mono text-sm px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* TARJETAS GEMELAS DE ENTRADA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONA A */}
        <div className="p-6 sm:p-8 bg-surface-50/80 backdrop-blur-md rounded-3xl border border-astral-cyan/20 shadow-xl relative space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-astral-cyan animate-pulse"></span>
              <span className="text-xs font-serif uppercase tracking-widest text-astral-cyan font-medium">
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
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-100/80 border border-white/10 text-white text-sm focus:outline-none focus:border-astral-cyan/70 transition shadow-inner"
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
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-100/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-astral-cyan/70 transition"
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
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-100/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-astral-cyan/70 transition"
              />
            </div>
          </div>

          {/* Autocomplete de Lugar con Botón de Mapa */}
          <div className="relative space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs text-slate-300 font-medium">
                Ciudad & País de Nacimiento
              </label>
              <button
                type="button"
                onClick={() => handleOpenMap('personA')}
                className="text-[11px] text-astral-cyan hover:text-white transition flex items-center gap-1 font-serif underline decoration-astral-cyan/40 underline-offset-2"
              >
                <span>🗺️</span>
                <span>Elegir en Mapa</span>
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={queryA}
                  onChange={(e) => {
                    setQueryA(e.target.value);
                    if (!e.target.value) {
                      setPersonA((prev) => ({
                        ...prev,
                        city: '',
                        country: '',
                        latitude: 0,
                        longitude: 0,
                      }));
                    }
                  }}
                  onFocus={() => suggestionsA.length > 0 && setShowSugA(true)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-100/50 backdrop-blur-md border border-white/10 text-white text-sm focus:outline-none focus:border-astral-cyan/70 transition"
                  placeholder="Escribe tu ciudad (ej: Trujillo, Lima, Madrid)..."
                />
                {isSearchingA && (
                  <span className="absolute right-3.5 top-3 text-[11px] text-astral-cyan animate-pulse font-mono">
                    Buscando...
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleOpenMap('personA')}
                className="px-3.5 py-2.5 rounded-2xl bg-surface-100 hover:bg-surface-200 border border-astral-cyan/30 text-astral-cyan hover:text-white transition flex items-center gap-1.5 text-xs font-serif shadow-sm shrink-0"
                title="Abrir mapa terráqueo para seleccionar coordenadas"
              >
                <span>🗺️</span>
                <span className="hidden sm:inline">Mapa</span>
              </button>
            </div>

            {/* Lista Desplegable de Sugerencias */}
            {showSugA && suggestionsA.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1.5 max-h-48 overflow-y-auto rounded-2xl bg-surface-100/95 backdrop-blur-xl border border-astral-cyan/30 shadow-2xl text-xs py-1">
                {suggestionsA.map((s, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectPlaceA(s)}
                    className="px-4 py-2 hover:bg-surface-200 cursor-pointer text-slate-200 hover:text-white transition flex flex-col"
                  >
                    <span className="font-medium text-astral-cyan">{s.city}</span>
                    <span className="text-[10px] text-slate-400">
                      {s.state ? `${s.state}, ` : ''}
                      {s.country} · TZ: {s.timezoneIana}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Badge de Coordenadas fijadas */}
          {personA.latitude !== 0 && (
            <div className="p-3 rounded-2xl bg-surface-100/40 border border-astral-cyan/20 text-[11px] text-slate-300 flex justify-between items-center shadow-inner">
              <span className="flex items-center gap-1">
                <span className="text-astral-cyan">📍</span> {personA.city}, {personA.country}
              </span>
              <span className="font-mono text-astral-cyan">
                {personA.latitude.toFixed(2)}°, {personA.longitude.toFixed(2)}°
              </span>
            </div>
          )}
        </div>

        {/* PERSONA B */}
        <div className="p-6 sm:p-8 bg-surface-50/40 backdrop-blur-xl rounded-3xl border border-astral-azure/25 shadow-2xl relative space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-astral-azure animate-pulse"></span>
              <span className="text-xs font-serif uppercase tracking-widest text-astral-azure font-medium">
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
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-100/50 backdrop-blur-md border border-white/10 text-white text-sm focus:outline-none focus:border-astral-azure/70 transition shadow-inner"
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
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-100/50 backdrop-blur-md border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-astral-azure/70 transition"
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
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-100/50 backdrop-blur-md border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-astral-azure/70 transition"
              />
            </div>
          </div>

          {/* Autocomplete de Lugar con Botón de Mapa */}
          <div className="relative space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs text-slate-300 font-medium">
                Ciudad & País de Nacimiento
              </label>
              <button
                type="button"
                onClick={() => handleOpenMap('personB')}
                className="text-[11px] text-astral-azure hover:text-white transition flex items-center gap-1 font-serif underline decoration-astral-azure/40 underline-offset-2"
              >
                <span>🗺️</span>
                <span>Elegir en Mapa</span>
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={queryB}
                  onChange={(e) => {
                    setQueryB(e.target.value);
                    if (!e.target.value) {
                      setPersonB((prev) => ({
                        ...prev,
                        city: '',
                        country: '',
                        latitude: 0,
                        longitude: 0,
                      }));
                    }
                  }}
                  onFocus={() => suggestionsB.length > 0 && setShowSugB(true)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-100/50 backdrop-blur-md border border-white/10 text-white text-sm focus:outline-none focus:border-astral-azure/70 transition"
                  placeholder="Escribe tu ciudad (ej: Madrid, Bogotá, CDMX)..."
                />
                {isSearchingB && (
                  <span className="absolute right-3.5 top-3 text-[11px] text-astral-azure animate-pulse font-mono">
                    Buscando...
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleOpenMap('personB')}
                className="px-3.5 py-2.5 rounded-2xl bg-surface-100 hover:bg-surface-200 border border-astral-azure/30 text-astral-azure hover:text-white transition flex items-center gap-1.5 text-xs font-serif shadow-sm shrink-0"
                title="Abrir mapa terráqueo para seleccionar coordenadas"
              >
                <span>🗺️</span>
                <span className="hidden sm:inline">Mapa</span>
              </button>
            </div>

            {/* Lista Desplegable de Sugerencias */}
            {showSugB && suggestionsB.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1.5 max-h-48 overflow-y-auto rounded-2xl bg-surface-100/95 backdrop-blur-xl border border-astral-azure/30 shadow-2xl text-xs py-1">
                {suggestionsB.map((s, idx) => (
                  <li
                    key={`sugB-${idx}`}
                    onClick={() => handleSelectPlaceB(s)}
                    className="px-4 py-2 hover:bg-surface-200 cursor-pointer text-slate-200 hover:text-white transition flex flex-col"
                  >
                    <span className="font-medium text-astral-azure">{s.city}</span>
                    <span className="text-[10px] text-slate-400">
                      {s.state ? `${s.state}, ` : ''}
                      {s.country} · TZ: {s.timezoneIana}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Badge de Coordenadas fijadas */}
          {personB.latitude !== 0 && (
            <div className="p-3 rounded-2xl bg-surface-100/40 border border-astral-azure/20 text-[11px] text-slate-300 flex justify-between items-center shadow-inner">
              <span className="flex items-center gap-1">
                <span className="text-astral-azure">📍</span> {personB.city}, {personB.country}
              </span>
              <span className="font-mono text-astral-azure">
                {personB.latitude.toFixed(2)}°, {personB.longitude.toFixed(2)}°
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sistema de Casas y Botón de Envío */}
      <div className="p-5 bg-surface-50/70 backdrop-blur-md rounded-3xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 font-serif">
            Sistema de Casas:
          </span>
          <select
            value={houseSystem}
            onChange={(e) => setHouseSystem(e.target.value as HouseSystem)}
            className="px-3.5 py-2 rounded-xl bg-surface-100 text-xs text-white border border-white/10 focus:outline-none focus:border-astral-cyan/50"
          >
            <option value="placidus">Placidus (Clásico Occidental)</option>
            <option value="whole-sign">Whole Sign (Casas Enteras Helenísticas)</option>
            <option value="equal">Equal (Casas Iguales)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || isResolving}
          className="w-full sm:w-auto px-10 py-3.5 rounded-2xl font-serif tracking-wide text-sm text-slate-950 bg-gradient-to-r from-astral-cyan via-astral-azure to-astral-sapphire hover:opacity-95 shadow-xl shadow-astral-cyan/20 active:scale-[0.98] transition flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          {isLoading || isResolving ? (
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

      {/* Modal del Mapa */}
      <LocationMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectLocation={handleLocationFromMap}
        initialLocation={mapTarget === 'personA' ? personA : personB}
        personName={mapTarget === 'personA' ? personA.name || 'Persona A' : personB.name || 'Persona B'}
      />
    </form>
  );
};
