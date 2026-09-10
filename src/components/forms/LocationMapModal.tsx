'use client';

import React, { useState, useRef, useEffect } from 'react';
import { POPULAR_CITIES, GeocodedPlace } from '@/lib/geo/geocoding';

interface LocationMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (place: GeocodedPlace) => void;
  initialLocation?: {
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    timezoneIana?: string;
  };
  personName?: string;
}

export const LocationMapModal: React.FC<LocationMapModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  initialLocation,
  personName = 'Persona',
}) => {
  const [lat, setLat] = useState<number>(initialLocation?.latitude || -12.0464);
  const [lng, setLng] = useState<number>(initialLocation?.longitude || -77.0428);
  const [city, setCity] = useState<string>(initialLocation?.city || 'Lima');
  const [country, setCountry] = useState<string>(initialLocation?.country || 'Perú');
  const [timezoneIana, setTimezoneIana] = useState<string>(initialLocation?.timezoneIana || 'America/Lima');
  const [isLoadingTz, setIsLoadingTz] = useState(false);
  const [hoverCoord, setHoverCoord] = useState<{ lat: number; lng: number } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (initialLocation?.latitude !== undefined && initialLocation?.longitude !== undefined) {
      setLat(initialLocation.latitude);
      setLng(initialLocation.longitude);
      setCity(initialLocation.city || '');
      setCountry(initialLocation.country || '');
      setTimezoneIana(initialLocation.timezoneIana || 'America/Lima');
    }
  }, [initialLocation, isOpen]);

  if (!isOpen) return null;

  // Convertir lat/lng a coordenadas SVG (viewBox: 0 0 1000 500)
  // X: -180 a +180 => 0 a 1000
  // Y: +90 a -90 => 0 a 500
  const markerX = ((lng + 180) / 360) * 1000;
  const markerY = ((90 - lat) / 180) * 500;

  // Actualizar zona horaria cuando cambian las coordenadas
  const updateTimezone = async (latitude: number, longitude: number) => {
    setIsLoadingTz(true);
    try {
      const res = await fetch(`/api/geo/timezone?lat=${latitude}&lng=${longitude}`);
      if (res.ok) {
        const data = await res.json();
        if (data.timezoneIana) {
          setTimezoneIana(data.timezoneIana);
        }
      }
    } catch (err) {
      console.error('Error al detectar zona horaria:', err);
    } finally {
      setIsLoadingTz(false);
    }
  };

  // Manejar clic en el mapa
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 1000;
    const clickY = ((e.clientY - rect.top) / rect.height) * 500;

    const rawLng = (clickX / 1000) * 360 - 180;
    const rawLat = 90 - (clickY / 500) * 180;

    const clampedLat = Math.max(-85, Math.min(85, Number(rawLat.toFixed(4))));
    const clampedLng = Math.max(-180, Math.min(180, Number(rawLng.toFixed(4))));

    setLat(clampedLat);
    setLng(clampedLng);

    // Buscar si hay una ciudad cercana conocida
    const nearest = POPULAR_CITIES.find(
      (c) => Math.abs(c.latitude - clampedLat) < 1.5 && Math.abs(c.longitude - clampedLng) < 1.5
    );

    if (nearest) {
      setCity(nearest.city);
      setCountry(nearest.country);
      setTimezoneIana(nearest.timezoneIana);
    } else {
      setCity((prev) => (prev && prev !== 'Lima' ? prev : 'Ubicación seleccionada'));
      setCountry((prev) => (prev && prev !== 'Perú' ? prev : 'Coordenadas del Mapa'));
      updateTimezone(clampedLat, clampedLng);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 1000;
    const clickY = ((e.clientY - rect.top) / rect.height) * 500;
    const hLng = (clickX / 1000) * 360 - 180;
    const hLat = 90 - (clickY / 500) * 180;
    setHoverCoord({
      lat: Number(Math.max(-85, Math.min(85, hLat)).toFixed(2)),
      lng: Number(Math.max(-180, Math.min(180, hLng)).toFixed(2)),
    });
  };

  const handleSelectPopularCity = (c: typeof POPULAR_CITIES[0]) => {
    setLat(c.latitude);
    setLng(c.longitude);
    setCity(c.city);
    setCountry(c.country);
    setTimezoneIana(c.timezoneIana);
  };

  const handleConfirm = () => {
    const formattedAddress = `${city || 'Ciudad'}, ${country || ''}`.replace(/^,\s*|,\s*$/g, '');
    onSelectLocation({
      name: city || 'Ubicación',
      city: city || 'Ciudad',
      country: country || 'País',
      latitude: lat,
      longitude: lng,
      timezoneIana: timezoneIana || 'America/Lima',
      formattedAddress,
    });
    onClose();
  };

  // Ciudades sugeridas para botones rápidos
  const QUICK_CITIES = [
    { name: 'Lima', country: 'Perú', lat: -12.0464, lng: -77.0428, tz: 'America/Lima' },
    { name: 'Trujillo', country: 'Perú', lat: -8.1116, lng: -79.0286, tz: 'America/Lima' },
    { name: 'Arequipa', country: 'Perú', lat: -16.409, lng: -71.5375, tz: 'America/Lima' },
    { name: 'Cusco', country: 'Perú', lat: -13.5319, lng: -71.9675, tz: 'America/Lima' },
    { name: 'Bogotá', country: 'Colombia', lat: 4.711, lng: -74.0721, tz: 'America/Bogota' },
    { name: 'Medellín', country: 'Colombia', lat: 6.2442, lng: -75.5812, tz: 'America/Bogota' },
    { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, tz: 'America/Argentina/Buenos_Aires' },
    { name: 'Santiago', country: 'Chile', lat: -33.4489, lng: -70.6693, tz: 'America/Santiago' },
    { name: 'CDMX', country: 'México', lat: 19.4326, lng: -99.1332, tz: 'America/Mexico_City' },
    { name: 'Madrid', country: 'España', lat: 40.4168, lng: -3.7038, tz: 'Europe/Madrid' },
    { name: 'Barcelona', country: 'España', lat: 41.3874, lng: 2.1686, tz: 'Europe/Madrid' },
    { name: 'Miami', country: 'EE.UU.', lat: 25.7617, lng: -80.1918, tz: 'America/New_York' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-surface-100/95 border border-astral-cyan/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-surface-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-astral-cyan/20 border border-astral-cyan/40 flex items-center justify-center text-astral-cyan font-serif text-sm">
              🗺️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif text-white font-medium">
                Selector de Coordenadas Terrestres
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Fijando ubicación natal para <span className="text-astral-cyan font-medium">{personName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Instrucción y coordenadas en hover */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-300 font-light flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-astral-cyan animate-pulse"></span>
              Haz clic directamente en cualquier punto del mapa terráqueo para colocar el pin cósmico:
            </span>
            {hoverCoord && (
              <span className="font-mono text-[11px] text-astral-cyan/80 bg-surface-200/60 px-2 py-0.5 rounded-lg border border-white/5">
                Cursor: {hoverCoord.lat > 0 ? `${hoverCoord.lat}°N` : `${Math.abs(hoverCoord.lat)}°S`},{' '}
                {hoverCoord.lng > 0 ? `${hoverCoord.lng}°E` : `${Math.abs(hoverCoord.lng)}°O`}
              </span>
            )}
          </div>

          {/* MAPA INTERACTIVO SVG */}
          <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden border border-astral-cyan/30 bg-gradient-to-b from-[#030914] via-[#051329] to-[#020712] shadow-inner select-none">
            <svg
              ref={svgRef}
              viewBox="0 0 1000 500"
              className="w-full h-full cursor-crosshair"
              onClick={handleMapClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverCoord(null)}
            >
              <defs>
                <radialGradient id="oceanGlow" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#082042" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#020817" stopOpacity="1" />
                </radialGradient>
                <filter id="glowPin" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <rect width="1000" height="500" fill="url(#oceanGlow)" />

              {/* LÍNEAS DE COORDENADAS */}
              <line x1="0" y1="250" x2="1000" y2="250" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.6" />
              <line x1="0" y1="184.7" x2="1000" y2="184.7" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
              <line x1="0" y1="315.3" x2="1000" y2="315.3" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
              <line x1="0" y1="83.3" x2="1000" y2="83.3" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="2 4" opacity="0.2" />
              <line x1="0" y1="416.7" x2="1000" y2="416.7" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="2 4" opacity="0.2" />

              <line x1="500" y1="0" x2="500" y2="500" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.6" />
              <line x1="166.7" y1="0" x2="166.7" y2="500" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="2 4" opacity="0.2" />
              <line x1="333.3" y1="0" x2="333.3" y2="500" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="2 4" opacity="0.2" />
              <line x1="666.7" y1="0" x2="666.7" y2="500" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="2 4" opacity="0.2" />
              <line x1="833.3" y1="0" x2="833.3" y2="500" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="2 4" opacity="0.2" />

              <text x="15" y="245" fill="#38bdf8" fontSize="9" opacity="0.7" fontFamily="monospace">ECUADOR 0°</text>
              <text x="505" y="20" fill="#38bdf8" fontSize="9" opacity="0.7" fontFamily="monospace">GREENWICH 0°</text>

              {/* SILUETAS CONTINENTALES */}
              <path
                d="M140,75 L180,60 L240,65 L270,90 L265,130 L220,165 L215,190 L240,210 L225,230 L200,215 L180,180 L160,170 L130,135 L120,95 Z"
                fill="#1e3a5f"
                stroke="#38bdf8"
                strokeWidth="1.2"
                opacity="0.75"
              />
              <path
                d="M215,225 L235,235 L260,245 L255,255 L230,245 Z"
                fill="#1e3a5f"
                stroke="#38bdf8"
                strokeWidth="1"
                opacity="0.75"
              />
              <path
                d="M260,255 L310,265 L360,290 L345,340 L310,410 L280,450 L275,410 L270,330 L250,280 Z"
                fill="#1e3a5f"
                stroke="#38bdf8"
                strokeWidth="1.2"
                opacity="0.8"
              />
              <path
                d="M470,90 L530,85 L560,110 L545,145 L510,155 L475,150 L465,120 Z"
                fill="#1e3a5f"
                stroke="#38bdf8"
                strokeWidth="1.2"
                opacity="0.8"
              />
              <path
                d="M475,165 L545,160 L585,210 L580,270 L540,365 L510,380 L480,330 L455,240 L460,180 Z"
                fill="#1e3a5f"
                stroke="#38bdf8"
                strokeWidth="1.2"
                opacity="0.8"
              />
              <path
                d="M560,95 L680,80 L800,90 L850,130 L840,190 L790,240 L720,260 L650,240 L600,200 L560,150 Z"
                fill="#1e3a5f"
                stroke="#38bdf8"
                strokeWidth="1.2"
                opacity="0.75"
              />
              <path
                d="M790,320 L865,310 L880,360 L835,400 L775,370 Z"
                fill="#1e3a5f"
                stroke="#38bdf8"
                strokeWidth="1.2"
                opacity="0.8"
              />

              {/* PIN CÓSMICO */}
              <g transform={`translate(${markerX}, ${markerY})`} filter="url(#glowPin)">
                <circle r="14" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                <circle r="8" fill="none" stroke="#fcd34d" strokeWidth="1.5" opacity="0.8" />
                <circle r="4" fill="#38bdf8" />
                <circle r="2" fill="#ffffff" />
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#38bdf8" strokeWidth="1" opacity="0.7" />
                <line x1="0" y1="-10" x2="0" y2="10" stroke="#38bdf8" strokeWidth="1" opacity="0.7" />
              </g>
            </svg>

            <div className="absolute bottom-3 left-3 bg-surface-100/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-astral-cyan/30 text-[11px] text-white flex items-center gap-2 shadow-lg">
              <span className="text-astral-cyan font-serif">✦</span>
              <span>
                <strong className="text-astral-cyan">{city || 'Punto Seleccionado'}</strong> ({country || ''})
              </span>
              <span className="text-slate-400 font-mono">
                [{lat.toFixed(2)}°, {lng.toFixed(2)}°]
              </span>
            </div>
          </div>

          {/* CHIPS DE CIUDADES */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-300 font-serif">
              Ciudades de Acceso Rápido:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CITIES.map((c) => {
                const isSelected = Math.abs(lat - c.lat) < 0.1 && Math.abs(lng - c.lng) < 0.1;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() =>
                      handleSelectPopularCity({
                        name: c.name,
                        city: c.name,
                        country: c.country,
                        latitude: c.lat,
                        longitude: c.lng,
                        timezoneIana: c.tz,
                        formattedAddress: `${c.name}, ${c.country}`,
                      })
                    }
                    className={`text-xs px-2.5 py-1 rounded-xl transition border flex items-center gap-1 ${
                      isSelected
                        ? 'bg-astral-cyan/20 border-astral-cyan text-white shadow-sm'
                        : 'bg-surface-200/50 hover:bg-surface-200 text-slate-300 hover:text-white border-white/5'
                    }`}
                  >
                    <span>📍</span>
                    <span>{c.name}</span>
                    <span className="text-[10px] text-slate-400">({c.country})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CAMPOS MANUALES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-surface-200/40 border border-white/5">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Ciudad o Lugar</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs focus:outline-none focus:border-astral-cyan"
                placeholder="Ej: Trujillo"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">País</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs focus:outline-none focus:border-astral-cyan"
                placeholder="Ej: Perú"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Latitud (-90 a 90)
              </label>
              <input
                type="number"
                step="0.0001"
                min="-90"
                max="90"
                value={lat}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setLat(val);
                  updateTimezone(val, lng);
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-astral-cyan"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Longitud (-180 a 180)
              </label>
              <input
                type="number"
                step="0.0001"
                min="-180"
                max="180"
                value={lng}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setLng(val);
                  updateTimezone(lat, val);
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-astral-cyan"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs px-2 text-slate-400">
            <span>
              Zona Horaria IANA: <strong className="text-astral-cyan font-mono">{timezoneIana}</strong>{' '}
              {isLoadingTz && <span className="animate-pulse">(detectando...)</span>}
            </span>
            <span className="text-[11px] text-slate-500">
              Precisión astrológica para casas y ascendente
            </span>
          </div>
        </div>

        {/* Pie de Modal */}
        <div className="px-6 py-4 border-t border-white/10 bg-surface-50/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface-200/60 hover:bg-surface-200 text-slate-300 text-xs transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-astral-cyan via-astral-azure to-astral-sapphire text-slate-950 font-serif font-medium text-xs shadow-lg shadow-astral-cyan/20 hover:opacity-90 transition flex items-center gap-2"
          >
            <span>✦</span>
            <span>Aplicar Ubicación y Coordenadas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
