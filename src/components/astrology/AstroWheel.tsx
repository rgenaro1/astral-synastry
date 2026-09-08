'use client';

import React, { useState, useMemo } from 'react';
import {
  AspectResult,
  NatalChart,
  PlanetPosition,
} from '@/lib/types/astrology';
import { ZODIAC_SIGNS } from '@/lib/astronomy/constants';
import {
  getPlanetContextualMeaning,
  getAspectMeaning,
  HOUSE_INTERPRETATIONS,
} from '@/lib/astronomy/interpretations';

interface AstroWheelProps {
  chart: NatalChart;
  secondChart?: NatalChart;
  title?: string;
  isCompact?: boolean;
}

export const AstroWheel: React.FC<AstroWheelProps> = ({
  chart,
  secondChart,
  title,
  isCompact = false,
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);
  const [selectedPlanetOwner, setSelectedPlanetOwner] = useState<string>(chart.profile.name);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetPosition | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<AspectResult | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const size = 760;
  const center = size / 2;
  const radius = 345;
  const signRingWidth = 42;
  const houseRingWidth = 34;

  const ascendantLon = chart.angles.ascendant.longitude;
  const wheelOffset = 180 - ascendantLon;

  const toWheelAngle = (longitude: number): number => {
    return (longitude + wheelOffset + 360) % 360;
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    r: number,
    angleDeg: number
  ) => {
    const rad = ((angleDeg - 180) * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(rad),
      y: centerY + r * Math.sin(rad),
    };
  };

  const layoutPlanets = (planets: PlanetPosition[], baseR: number) => {
    const sorted = [...planets].sort((a, b) => a.longitude - b.longitude);
    const placed: { planet: PlanetPosition; angle: number; r: number }[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      let angle = toWheelAngle(p.longitude);
      let r = baseR;

      if (placed.length > 0) {
        const prev = placed[placed.length - 1];
        const diff = Math.abs(angle - prev.angle);
        if (diff < 8.5 || diff > 351.5) {
          r = prev.r === baseR ? baseR - 26 : baseR;
        }
      }
      placed.push({ planet: p, angle, r });
    }
    return placed;
  };

  const placedPlanetsA = useMemo(
    () => layoutPlanets(chart.planets, radius - signRingWidth - houseRingWidth - 32),
    [chart, wheelOffset]
  );

  const placedPlanetsB = useMemo(() => {
    if (!secondChart) return [];
    return layoutPlanets(secondChart.planets, radius - signRingWidth - houseRingWidth - 82);
  }, [secondChart, wheelOffset]);

  const activeAspects = useMemo(() => {
    if (!selectedPlanet) return chart.aspects.slice(0, 18);
    return chart.aspects.filter(
      (a) => a.planet1 === selectedPlanet.id || a.planet2 === selectedPlanet.id
    );
  }, [chart.aspects, selectedPlanet]);

  const getAspectColor = (nature: string, type: string) => {
    if (type === 'conjunction') return '#F3E7C4'; // Champagne dorado luminoso
    if (nature === 'harmonious') return '#99D6EA'; // Cyan suave celestial
    if (nature === 'challenging') return '#F28C8C'; // Coral/Rosa intenso
    return '#E8B4B8'; // Rose Gold
  };

  const planetDetail = useMemo(() => {
    if (!selectedPlanet) return null;
    return getPlanetContextualMeaning(selectedPlanet.id, selectedPlanet.sign, selectedPlanet.house);
  }, [selectedPlanet]);

  const planetConnectedAspects = useMemo(() => {
    if (!selectedPlanet) return [];
    return chart.aspects.filter(
      (a) => a.planet1 === selectedPlanet.id || a.planet2 === selectedPlanet.id
    );
  }, [selectedPlanet, chart.aspects]);

  return (
    <div className="relative flex flex-col items-center bg-gradient-to-b from-surface-100/90 via-surface-50/80 to-surface-100/90 backdrop-blur-2xl rounded-3xl border border-astral-roseGold/25 p-4 sm:p-7 shadow-[0_15px_50px_rgba(0,0,0,0.6)] overflow-hidden w-full">
      {/* Resplandor áurico */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-astral-roseGold/8 rounded-full blur-3xl pointer-events-none"></div>

      {/* CABECERA & CONTROLES */}
      <div className="w-full flex flex-wrap justify-between items-center gap-3 mb-2 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-astral-roseGold animate-pulse"></span>
            <span className="text-[11px] uppercase tracking-widest text-astral-roseGold font-mono font-semibold">
              Rueda Astrológica Viva
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-serif text-white font-normal mt-0.5">
            {title || `${chart.profile.name} · Casas ${chart.houseSystem.toUpperCase()}`}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {secondChart && (
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono mr-2 bg-surface-200/60 px-3 py-1.5 rounded-xl border border-white/5">
              <span className="flex items-center gap-1.5 text-astral-champagne">
                <span className="w-2.5 h-2.5 rounded-full bg-astral-roseGold/80"></span>
                {chart.profile.name} (Interior)
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-astral-lavender/80"></span>
                {secondChart.profile.name} (Exterior)
              </span>
            </div>
          )}

          {/* Zoom controls */}
          <div className="flex items-center bg-surface-200/80 rounded-xl p-1 border border-white/5 shadow-inner">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="w-7 h-7 flex items-center justify-center text-xs text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="Reducir"
            >
              -
            </button>
            <span className="text-[11px] text-astral-champagne font-mono px-2">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="w-7 h-7 flex items-center justify-center text-xs text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="Ampliar"
            >
              +
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setSelectedPlanet(null);
                setSelectedHouse(null);
                setHoveredAspect(null);
              }}
              className="text-[11px] px-2.5 py-1 text-slate-400 hover:text-astral-roseGold rounded-lg hover:bg-white/5 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between text-[11px] text-slate-400 font-light italic mb-2 border-b border-white/5 pb-2">
        <span>✦ Haz clic en un planeta o aspecto para abrir sus secretos y consejos de armonía.</span>
        {selectedPlanet && (
          <span className="text-astral-roseGold font-mono not-italic">
            Seleccionado: {selectedPlanet.name} ({selectedPlanet.sign})
          </span>
        )}
      </div>

      {/* RUEDA SVG INTERACTIVA CON EFECTOS */}
      <div className="w-full max-w-[680px] aspect-square overflow-hidden flex items-center justify-center relative my-1">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full transition-transform duration-300 drop-shadow-[0_12px_45px_rgba(0,0,0,0.7)]"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Filtro de resplandor celestial */}
            <filter id="celestialGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <radialGradient id="feminineWheelBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#100C18" stopOpacity="0.97" />
              <stop offset="65%" stopColor="#171124" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#251B35" stopOpacity="1" />
            </radialGradient>

            <linearGradient id="roseGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F3E7C4" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#E8B4B8" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#D8B26E" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#C49BB5" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Disco Exterior con Ticks de Grados (Cada 5° y cada 1°) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="url(#feminineWheelBg)"
            stroke="url(#roseGoldBorder)"
            strokeWidth="2.2"
          />

          {/* Ticks finos de los 360 grados en el borde exterior */}
          {Array.from({ length: 72 }).map((_, i) => {
            const deg = i * 5;
            const angle = toWheelAngle(deg);
            const isMajor = deg % 30 === 0;
            const tickLen = isMajor ? 8 : 4;
            const p1 = polarToCartesian(center, center, radius, angle);
            const p2 = polarToCartesian(center, center, radius - tickLen, angle);

            return (
              <line
                key={`tick-${deg}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isMajor ? 'rgba(243, 231, 196, 0.5)' : 'rgba(232, 180, 184, 0.2)'}
                strokeWidth={isMajor ? 1.2 : 0.6}
              />
            );
          })}

          {/* ANILLO DE LOS 12 SIGNOS ZODIACALES */}
          {ZODIAC_SIGNS.map((sign, idx) => {
            const startAngle = toWheelAngle(sign.startDegree);
            const midAngle = toWheelAngle(sign.startDegree + 15);
            const pos = polarToCartesian(center, center, radius - signRingWidth / 2, midAngle);
            const tick = polarToCartesian(center, center, radius, startAngle);
            const tickInner = polarToCartesian(center, center, radius - signRingWidth, startAngle);

            const isFire = sign.element === 'Fuego';
            const isAir = sign.element === 'Aire';
            const isWater = sign.element === 'Agua';

            const signColor = isFire
              ? '#F3E7C4' // Fuego = Champagne dorado
              : isAir
              ? '#D8B26E' // Aire = Oro cálido
              : isWater
              ? '#E8B4B8' // Agua = Rose gold
              : '#C49BB5'; // Tierra = Mauve suave

            return (
              <g key={sign.name} className="cursor-default">
                {/* Separador radial de signos */}
                <line
                  x1={tick.x}
                  y1={tick.y}
                  x2={tickInner.x}
                  y2={tickInner.y}
                  stroke="rgba(243, 231, 196, 0.35)"
                  strokeWidth="1.2"
                />
                {/* Glifo del signo */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="18"
                  fill={signColor}
                  className="font-serif select-none transition-opacity hover:opacity-100 opacity-90"
                  filter={sign.name === chart.angles.ascendant.sign ? 'url(#celestialGlow)' : undefined}
                >
                  {sign.symbol}
                </text>
              </g>
            );
          })}

          {/* Divisor circular entre Signos y Casas */}
          <circle
            cx={center}
            cy={center}
            r={radius - signRingWidth}
            fill="none"
            stroke="rgba(232, 180, 184, 0.25)"
            strokeWidth="1.2"
          />

          {/* ANILLO DE LAS 12 CASAS ASTROLÓGICAS */}
          {chart.houses.map((house) => {
            const angle = toWheelAngle(house.longitude);
            const outer = polarToCartesian(center, center, radius - signRingWidth, angle);
            const inner = polarToCartesian(center, center, 130, angle);

            const isAsc = house.house === 1;
            const isDesc = house.house === 7;
            const isMc = house.house === 10;
            const isIc = house.house === 4;
            const isCardinal = isAsc || isDesc || isMc || isIc;

            const nextHouseIndex = house.house % 12;
            const nextCusp = chart.houses[nextHouseIndex].longitude;
            let midHouseAngle =
              house.longitude +
              ((nextCusp < house.longitude ? nextCusp + 360 : nextCusp) - house.longitude) / 2;
            const numPos = polarToCartesian(
              center,
              center,
              radius - signRingWidth - houseRingWidth / 2,
              toWheelAngle(midHouseAngle)
            );

            const isHouseSelected = selectedHouse === house.house;

            return (
              <g
                key={`house-${house.house}`}
                className="cursor-pointer group"
                onClick={() => setSelectedHouse(isHouseSelected ? null : house.house)}
              >
                <line
                  x1={outer.x}
                  y1={outer.y}
                  x2={inner.x}
                  y2={inner.y}
                  stroke={
                    isAsc
                      ? '#F3E7C4' // Ascendente
                      : isMc
                      ? '#E8B4B8' // Medio Cielo
                      : isCardinal
                      ? 'rgba(243, 231, 196, 0.45)'
                      : 'rgba(255, 255, 255, 0.12)'
                  }
                  strokeWidth={isCardinal ? 2 : 0.8}
                  strokeDasharray={isCardinal ? '' : '3 3'}
                  className="transition-all group-hover:stroke-astral-roseGold"
                />
                <circle
                  cx={numPos.x}
                  cy={numPos.y}
                  r={isHouseSelected ? 10 : 8}
                  fill={isHouseSelected ? 'rgba(232, 180, 184, 0.35)' : 'rgba(20, 16, 28, 0.5)'}
                  stroke={isHouseSelected ? '#E8B4B8' : 'transparent'}
                  strokeWidth="1"
                  className="transition-all"
                />
                <text
                  x={numPos.x}
                  y={numPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fill={isHouseSelected ? '#FFFFFF' : 'rgba(243, 231, 196, 0.7)'}
                  className="font-serif select-none font-medium transition-colors group-hover:fill-white"
                >
                  {house.house}
                </text>
              </g>
            );
          })}

          {/* Centro íntimo delimitador */}
          <circle
            cx={center}
            cy={center}
            r={130}
            fill="#0C0A10"
            fillOpacity="0.94"
            stroke="rgba(232, 180, 184, 0.2)"
            strokeWidth="1.2"
          />

          {/* CHORDS DE ASPECTOS INTERACTIVOS (CENTRO) */}
          <g className="aspect-chords">
            {activeAspects.map((asp, idx) => {
              const p1 = chart.planets.find((p) => p.id === asp.planet1);
              const p2 = chart.planets.find((p) => p.id === asp.planet2);
              if (!p1 || !p2) return null;

              const pos1 = polarToCartesian(center, center, 128, toWheelAngle(p1.longitude));
              const pos2 = polarToCartesian(center, center, 128, toWheelAngle(p2.longitude));
              const color = getAspectColor(asp.nature, asp.type);

              const isHighlighted =
                hoveredAspect === asp ||
                (selectedPlanet && (asp.planet1 === selectedPlanet.id || asp.planet2 === selectedPlanet.id));

              return (
                <line
                  key={`aspect-chord-${idx}`}
                  x1={pos1.x}
                  y1={pos1.y}
                  x2={pos2.x}
                  y2={pos2.y}
                  stroke={color}
                  strokeWidth={isHighlighted ? 2.8 : 1}
                  strokeOpacity={isHighlighted ? 1 : 0.4}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredAspect(asp)}
                  onMouseLeave={() => setHoveredAspect(null)}
                  onClick={() => {
                    const foundPlanet = chart.planets.find((p) => p.id === asp.planet1);
                    if (foundPlanet) setSelectedPlanet(foundPlanet);
                  }}
                />
              );
            })}
          </g>

          {/* PLANETAS: PERSONA A (ÓRBITA INTERIOR) */}
          {placedPlanetsA.map(({ planet, angle, r }) => {
            const pos = polarToCartesian(center, center, r, angle);
            const isSelected = selectedPlanet?.id === planet.id && selectedPlanetOwner === chart.profile.name;
            const isHovered = hoveredPlanet?.id === planet.id;

            return (
              <g
                key={`pA-${planet.id}`}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedPlanet(isSelected ? null : planet);
                  setSelectedPlanetOwner(chart.profile.name);
                }}
                onMouseEnter={() => setHoveredPlanet(planet)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                {/* Aura suave */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 17 : isHovered ? 15 : 13}
                  fill={
                    isSelected
                      ? 'rgba(232, 180, 184, 0.4)'
                      : isHovered
                      ? 'rgba(232, 180, 184, 0.25)'
                      : 'rgba(32, 24, 44, 0.9)'
                  }
                  stroke={isSelected ? '#F3E7C4' : isHovered ? '#E8B4B8' : 'rgba(232, 180, 184, 0.4)'}
                  strokeWidth={isSelected ? 2 : 1.2}
                  filter={isSelected ? 'url(#celestialGlow)' : undefined}
                  className="transition-all duration-200"
                />
                {/* Glifo celestial */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isSelected ? '15' : '13'}
                  fill={isSelected ? '#FFFFFF' : '#FAF7F5'}
                  className="font-serif select-none"
                >
                  {planet.symbol}
                </text>
                {planet.isRetrograde && (
                  <text
                    x={pos.x + 8}
                    y={pos.y - 8}
                    fontSize="7"
                    fill="#F28C8C"
                    className="font-mono font-bold"
                  >
                    ℞
                  </text>
                )}
              </g>
            );
          })}

          {/* PLANETAS: PERSONA B (ÓRBITA EXTERIOR EN BI-WHEEL) */}
          {placedPlanetsB.map(({ planet, angle, r }) => {
            const pos = polarToCartesian(center, center, r, angle);
            const isSelected = selectedPlanet?.id === planet.id && selectedPlanetOwner === secondChart?.profile.name;
            const isHovered = hoveredPlanet?.id === planet.id;

            return (
              <g
                key={`pB-${planet.id}`}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedPlanet(isSelected ? null : planet);
                  if (secondChart) setSelectedPlanetOwner(secondChart.profile.name);
                }}
                onMouseEnter={() => setHoveredPlanet(planet)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 16 : isHovered ? 14 : 12}
                  fill={
                    isSelected
                      ? 'rgba(214, 191, 232, 0.45)'
                      : isHovered
                      ? 'rgba(214, 191, 232, 0.3)'
                      : 'rgba(26, 20, 36, 0.92)'
                  }
                  stroke={isSelected ? '#D6BFE8' : isHovered ? '#FAF7F5' : 'rgba(214, 191, 232, 0.4)'}
                  strokeWidth={isSelected ? 2 : 1.2}
                  className="transition-all duration-200"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="12"
                  fill={isSelected ? '#FFFFFF' : '#D6BFE8'}
                  className="font-serif select-none"
                >
                  {planet.symbol}
                </text>
              </g>
            );
          })}

          {/* Ejes cardinales AC / MC */}
          <g>
            <text
              x={center - radius + 16}
              y={center - 7}
              fontSize="10"
              fill="#F3E7C4"
              className="font-mono font-bold tracking-widest"
            >
              AC
            </text>
            {(() => {
              const mcPos = polarToCartesian(
                center,
                center,
                radius - 8,
                toWheelAngle(chart.angles.midheaven.longitude)
              );
              return (
                <text
                  x={mcPos.x}
                  y={mcPos.y}
                  fontSize="10"
                  fill="#E8B4B8"
                  textAnchor="middle"
                  className="font-mono font-bold"
                >
                  MC
                </text>
              );
            })()}
          </g>
        </svg>
      </div>

      {/* TEXTO FLOTANTE INMEDIATO AL HACER HOVER SOBRE UN PLANETA */}
      {hoveredPlanet && !selectedPlanet && (
        <div className="w-full max-w-xl py-2 px-4 rounded-2xl bg-surface-200/90 border border-astral-roseGold/30 text-xs text-center text-slate-200 animate-fadeIn mb-2 shadow-xl backdrop-blur-md">
          <span className="text-astral-roseGold font-medium font-serif text-sm mr-1">
            {hoveredPlanet.symbol} {hoveredPlanet.name}
          </span>{' '}
          en <strong className="text-white">{hoveredPlanet.sign}</strong> ({hoveredPlanet.degreeFormatted}) · Casa {hoveredPlanet.house}
          {hoveredPlanet.isRetrograde && <span className="ml-2 text-rose-300">· Retrógrado ℞</span>}
        </div>
      )}

      {/* TEXTO FLOTANTE AL HACER HOVER SOBRE UN ASPECTO */}
      {hoveredAspect && (
        <div className="w-full max-w-xl p-3.5 rounded-2xl bg-surface-200/95 border border-astral-champagne/40 text-xs text-center space-y-1 animate-fadeIn mb-2 shadow-2xl backdrop-blur-md">
          <div className="text-astral-champagne font-serif font-medium text-sm">
            {hoveredAspect.symbol} {hoveredAspect.typeName} entre {hoveredAspect.planet1Name} y {hoveredAspect.planet2Name} (Orbe {hoveredAspect.orb}°)
          </div>
          <p className="text-slate-300 text-[11px] font-light">
            {getAspectMeaning(hoveredAspect.planet1Name, hoveredAspect.planet2Name, hoveredAspect.type, hoveredAspect.orb).description}
          </p>
        </div>
      )}

      {/* EXPLICACIÓN DE CASA AL HACER CLIC */}
      {selectedHouse && !selectedPlanet && (
        <div className="w-full max-w-2xl p-4 bg-surface-100/90 rounded-2xl border border-astral-champagne/25 text-xs space-y-1.5 animate-fadeIn mb-2 shadow-lg">
          <div className="flex justify-between items-center">
            <h4 className="font-serif text-sm text-astral-champagne font-medium">
              {HOUSE_INTERPRETATIONS[selectedHouse]?.name}
            </h4>
            <button
              onClick={() => setSelectedHouse(null)}
              className="text-slate-400 hover:text-white text-xs px-2"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300 font-light leading-relaxed">
            {HOUSE_INTERPRETATIONS[selectedHouse]?.description}
          </p>
        </div>
      )}

      {/* MODAL / PANEL DE EXPLICACIÓN DETALLADA DEL PLANETA SELECCIONADO */}
      {selectedPlanet && planetDetail && (
        <div className="w-full max-w-2xl p-6 bg-surface-100/95 rounded-3xl border border-astral-roseGold/35 text-xs space-y-4 animate-fadeIn shadow-2xl mt-3 z-20 backdrop-blur-2xl">
          <div className="flex justify-between items-start border-b border-white/5 pb-3">
            <div className="flex items-center gap-3.5">
              <span className="w-11 h-11 rounded-2xl bg-astral-roseGold/20 text-astral-roseGold font-serif flex items-center justify-center text-xl border border-astral-roseGold/40 shadow-md">
                {selectedPlanet.symbol}
              </span>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-astral-roseGold font-medium">
                  {selectedPlanetOwner}
                </span>
                <h4 className="text-base font-serif text-white font-medium">
                  {planetDetail.title}
                </h4>
                <span className="text-slate-400 text-[11px] font-light">
                  Longitud: {selectedPlanet.degreeFormatted} · Casa {selectedPlanet.house}
                  {selectedPlanet.isRetrograde && ' · En moción retrógrada ℞'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2.5 text-slate-200 font-light leading-relaxed">
            <p className="text-sm text-slate-100">{planetDetail.explanation}</p>
            <div className="p-4 rounded-2xl bg-surface-200/70 border border-astral-roseGold/20 text-astral-blush">
              <strong className="text-astral-roseGold block text-[11px] font-serif uppercase tracking-wider mb-1">
                ✦ Sabiduría para la Relación & Entendimiento Mutuo:
              </strong>
              {planetDetail.guidance}
            </div>
          </div>

          {/* Aspectos activos vinculados */}
          {planetConnectedAspects.length > 0 && (
            <div className="pt-2.5 border-t border-white/5 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                Aspectos celestes que conectan con {selectedPlanet.name}:
              </span>
              <div className="flex flex-wrap gap-2">
                {planetConnectedAspects.slice(0, 4).map((asp, i) => {
                  const otherName = asp.planet1 === selectedPlanet.id ? asp.planet2Name : asp.planet1Name;
                  return (
                    <span
                      key={`conn-asp-${i}`}
                      className="px-3 py-1.5 rounded-xl bg-surface-200/90 text-[11px] text-slate-300 border border-white/5 flex items-center gap-1.5 font-light"
                    >
                      <span className="text-astral-roseGold font-serif">{asp.symbol}</span>
                      {asp.typeName} con {otherName} ({asp.orb}°)
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEYENDA SUTIL */}
      <div className="w-full mt-3 pt-3 border-t border-white/5 flex flex-wrap justify-center items-center gap-5 text-[11px] text-slate-400 font-light">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-300/90 shadow-[0_0_8px_rgba(153,214,234,0.6)]"></span> Trígono / Sextil (Fluidez Natural)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-astral-coral/90 shadow-[0_0_8px_rgba(242,140,140,0.6)]"></span> Cuadratura / Oposición (Tensión de Evolución)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-astral-champagne shadow-[0_0_8px_rgba(243,231,196,0.6)]"></span> Conjunción (Fusión de Almas)
        </span>
      </div>
    </div>
  );
};
