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
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [isLoadingTz, setIsLoadingTz] = useState(false);

  // Buscador dentro del mapa
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const roadLayerRef = useRef<any>(null);
  const satelliteLayerRef = useRef<any>(null);

  // Actualizar coordenadas iniciales si cambian
  useEffect(() => {
    if (initialLocation?.latitude !== undefined && initialLocation?.longitude !== undefined) {
      setLat(initialLocation.latitude);
      setLng(initialLocation.longitude);
      setCity(initialLocation.city || '');
      setCountry(initialLocation.country || '');
      setTimezoneIana(initialLocation.timezoneIana || 'America/Lima');
    }
  }, [initialLocation, isOpen]);

  // Actualizar zona horaria cuando cambian las coordenadas
  const updateTimezone = async (latitude: number, longitude: number) => {
    setIsLoadingTz(true);
    try {
      const res = await fetch(`/api/geo/timezone?lat=${latitude}&lng=${longitude}`);
      if (res.ok) {
        const data = await res.json();
        if (data.timezoneIana || data.timezone) {
          setTimezoneIana(data.timezoneIana || data.timezone);
        }
      }
    } catch (err) {
      console.error('Error al detectar zona horaria:', err);
    } finally {
      setIsLoadingTz(false);
    }
  };

  // Manejador central de cambio de coordenadas
  const handleCoordsChange = (newLat: number, newLng: number) => {
    const roundedLat = Number(newLat.toFixed(4));
    const roundedLng = Number(newLng.toFixed(4));
    setLat(roundedLat);
    setLng(roundedLng);

    // Buscar si hay una ciudad conocida cercana
    const nearest = POPULAR_CITIES.find(
      (c) => Math.abs(c.latitude - roundedLat) < 0.6 && Math.abs(c.longitude - roundedLng) < 0.6
    );

    if (nearest) {
      setCity(nearest.city);
      setCountry(nearest.country);
      setTimezoneIana(nearest.timezoneIana);
    } else {
      updateTimezone(roundedLat, roundedLng);
    }
  };

  // Inicializar Leaflet con Google Maps Tiles
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    let isCancelled = false;

    import('leaflet').then((LModule) => {
      if (isCancelled || !mapContainerRef.current) return;
      const L = (LModule as any).default || LModule;

      // Si ya existía un mapa previo en este contenedor, removerlo
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialLat = lat || -12.0464;
      const initialLng = lng || -77.0428;

      // Crear instancia de mapa con centro inicial
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 11,
        zoomControl: false,
      });
      mapInstanceRef.current = map;

      // Control de zoom
      L.control.zoom({ position: 'topleft' }).addTo(map);

      // 1. Google Maps Road / Street Tiles
      const googleRoads = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps',
      });
      roadLayerRef.current = googleRoads;

      // 2. Google Maps Satellite Hybrid Tiles (Fotografía satelital con calles y nombres)
      const googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps Satélite',
      });
      satelliteLayerRef.current = googleSatellite;

      // Capa inicial
      if (mapType === 'satellite') {
        googleSatellite.addTo(map);
      } else {
        googleRoads.addTo(map);
      }

      // Pin vectorial estilo Google Maps con sombra
      const pinHtml = `
        <div style="position: relative; width: 34px; height: 42px; transform: translate(-50%, -100%); cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));">
          <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 0C7.611 0 0 7.611 0 17C0 27.5 17 42 17 42C17 42 34 27.5 34 17C34 7.611 26.389 0 17 0Z" fill="#EA4335"/>
            <circle cx="17" cy="15" r="7" fill="#FFFFFF"/>
            <circle cx="17" cy="15" r="3.5" fill="#B31412"/>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'google-maps-pin',
        iconSize: [34, 42],
        iconAnchor: [17, 42],
      });

      const marker = L.marker([initialLat, initialLng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);
      markerRef.current = marker;

      // Evento: fin de arrastre del pin
      marker.on('dragend', (e: any) => {
        const newPos = e.target.getLatLng();
        handleCoordsChange(newPos.lat, newPos.lng);
      });

      // Evento: clic en cualquier punto del mapa
      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng);
        map.panTo(e.latlng, { animate: true, duration: 0.6 });
        handleCoordsChange(e.latlng.lat, e.latlng.lng);
      });

      // Asegurar redibujado correcto de tiles
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Cambiar entre capa Callejera y Satélite
  const handleToggleMapType = (type: 'streets' | 'satellite') => {
    setMapType(type);
    if (!mapInstanceRef.current || !roadLayerRef.current || !satelliteLayerRef.current) return;

    if (type === 'satellite') {
      mapInstanceRef.current.removeLayer(roadLayerRef.current);
      satelliteLayerRef.current.addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.removeLayer(satelliteLayerRef.current);
      roadLayerRef.current.addTo(mapInstanceRef.current);
    }
  };

  // Volar a una ciudad seleccionada
  const handleFlyToLocation = (cLat: number, cLng: number, cCity?: string, cCountry?: string, cTz?: string) => {
    handleCoordsChange(cLat, cLng);
    if (cCity) setCity(cCity);
    if (cCountry) setCountry(cCountry);
    if (cTz) setTimezoneIana(cTz);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([cLat, cLng], 12, { duration: 1.2 });
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([cLat, cLng]);
    }
  };

  // Búsqueda interactiva en el mapa
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchSuggestions([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchSuggestions(data.places || []);
          setShowSearchDropdown(true);
        }
      } catch (e) {
        console.error('Error buscando lugar en mapa:', e);
      } finally {
        setIsSearching(false);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = (p: any) => {
    handleFlyToLocation(p.latitude, p.longitude, p.city, p.country, p.timezoneIana);
    setSearchQuery(p.formattedAddress || p.city);
    setShowSearchDropdown(false);
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
    { name: 'Londres', country: 'Reino Unido', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
    { name: 'Madrid', country: 'España', lat: 40.4168, lng: -3.7038, tz: 'Europe/Madrid' },
    { name: 'Barcelona', country: 'España', lat: 41.3874, lng: 2.1686, tz: 'Europe/Madrid' },
    { name: 'Miami', country: 'EE.UU.', lat: 25.7617, lng: -80.1918, tz: 'America/New_York' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-surface-100/95 border border-astral-cyan/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        {/* Cabecera con Buscador estilo Google Maps */}
        <div className="px-5 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-surface-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-serif text-sm">
              📍
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-serif text-white font-medium">
                Selector de Ubicación Geográfica
              </h3>
              <p className="text-[11px] text-slate-400 font-light">
                Para <strong className="text-astral-cyan">{personName}</strong> · Haz clic o arrastra el pin en el mapa
              </p>
            </div>
          </div>

          {/* Buscador dentro del mapa */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchSuggestions.length > 0 && setShowSearchDropdown(true)}
              placeholder="Buscar ciudad o dirección en Google Maps..."
              className="w-full px-3.5 py-1.5 rounded-xl bg-surface-200/90 border border-white/15 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-astral-cyan"
            />
            {isSearching && (
              <span className="absolute right-3 top-2 text-[10px] text-astral-cyan animate-pulse">
                ...
              </span>
            )}
            {showSearchDropdown && searchSuggestions.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl bg-surface-100/95 backdrop-blur-xl border border-astral-cyan/30 shadow-2xl text-xs py-1">
                {searchSuggestions.map((s, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectSearchResult(s)}
                    className="px-3 py-1.5 hover:bg-surface-200 cursor-pointer text-slate-200 hover:text-white transition flex flex-col"
                  >
                    <span className="font-medium text-astral-cyan">{s.city}</span>
                    <span className="text-[10px] text-slate-400">{s.formattedAddress}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* CONTENEDOR DEL MAPA GOOGLE MAPS */}
        <div className="relative w-full h-[400px] sm:h-[460px] bg-slate-900 select-none">
          {/* Contenedor Leaflet */}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Selector de Capa Estilo Google Maps (Callejero vs Satélite) */}
          <div className="absolute top-3 right-3 z-[400] flex rounded-xl overflow-hidden border border-black/30 shadow-lg bg-white text-xs font-sans">
            <button
              type="button"
              onClick={() => handleToggleMapType('streets')}
              className={`px-3 py-1.5 font-medium transition ${
                mapType === 'streets'
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              🗺️ Mapa
            </button>
            <button
              type="button"
              onClick={() => handleToggleMapType('satellite')}
              className={`px-3 py-1.5 font-medium transition ${
                mapType === 'satellite'
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              🛰️ Satélite
            </button>
          </div>

          {/* Tarjeta flotante con coordenadas y ubicación activa */}
          <div className="absolute bottom-4 left-4 z-[400] bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-astral-cyan/30 text-xs text-white shadow-xl flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
            <div>
              <div className="font-medium text-white">
                <span className="text-astral-cyan">{city || 'Punto Seleccionado'}</span>
                {country ? `, ${country}` : ''}
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>Lat: {lat.toFixed(4)}°</span>
                <span>Long: {lng.toFixed(4)}°</span>
                <span className="text-sky-300">TZ: {timezoneIana}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chips de Ciudades Rápidas y Campos de Edición */}
        <div className="p-4 bg-surface-50/90 border-t border-white/10 space-y-3">
          {/* Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-serif mr-1">
              Volar a:
            </span>
            {QUICK_CITIES.map((c) => {
              const isSelected = Math.abs(lat - c.lat) < 0.1 && Math.abs(lng - c.lng) < 0.1;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleFlyToLocation(c.lat, c.lng, c.name, c.country, c.tz)}
                  className={`text-[11px] px-2.5 py-1 rounded-xl transition border flex items-center gap-1 ${
                    isSelected
                      ? 'bg-astral-cyan/25 border-astral-cyan text-white font-medium shadow-sm'
                      : 'bg-surface-200/60 hover:bg-surface-200 text-slate-300 hover:text-white border-white/5'
                  }`}
                >
                  <span>📍</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Campos manuales y Botón de confirmación */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div className="flex flex-wrap gap-2 text-xs flex-1">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ciudad"
                className="px-3 py-1.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs w-32 focus:outline-none focus:border-astral-cyan"
              />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="País"
                className="px-3 py-1.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs w-28 focus:outline-none focus:border-astral-cyan"
              />
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200 border border-white/10 text-[11px] text-slate-300 font-mono">
                <span>Lat: {lat.toFixed(4)}</span>
                <span>·</span>
                <span>Lng: {lng.toFixed(4)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-slate-300 text-xs transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-astral-cyan via-astral-azure to-astral-sapphire text-slate-950 font-serif font-medium text-xs shadow-lg shadow-astral-cyan/20 hover:opacity-90 transition flex items-center gap-1.5"
              >
                <span>✦</span>
                <span>Fijar Ubicación</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
