'use client';

import React, { useState, useMemo } from 'react';
import { DualBirthForm } from '@/components/forms/DualBirthForm';
import { ReportView } from '@/components/report/ReportView';
import { AstroWheel } from '@/components/astrology/AstroWheel';
import {
  BirthProfileInput,
  HouseSystem,
  NatalChart,
  SynastryAnalysis,
  CompositeChart,
  AIInterpretationReport,
} from '@/lib/types/astrology';
import { SynastryContextDigest } from '@/lib/ai/contextSerializer';
import { calculateNatalChart } from '@/lib/astronomy/chart';
import { calculateSynastry } from '@/lib/synastry/engine';
import { calculateCompositeChart } from '@/lib/composite/engine';

interface AnalysisResult {
  chartA: NatalChart;
  chartB: NatalChart;
  synastry: SynastryAnalysis;
  composite: CompositeChart;
  digest: SynastryContextDigest;
  aiReport: AIInterpretationReport;
}

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'biwheel' | 'chartA' | 'chartB' | 'composite'>('biwheel');

  // Datos predeterminados para la Rueda Interactiva de Demostración en Vivo
  const defaultPreviewData = useMemo(() => {
    const pA = {
      name: 'Elena (Sol en Tauro)',
      birthDate: '1993-05-14',
      birthTime: '14:30',
      city: 'Trujillo',
      country: 'Perú',
      latitude: -8.1116,
      longitude: -79.0286,
      timezoneIana: 'America/Lima',
    };
    const pB = {
      name: 'Mateo (Sol en Escorpio)',
      birthDate: '1991-10-28',
      birthTime: '09:15',
      city: 'Madrid',
      country: 'España',
      latitude: 40.4168,
      longitude: -3.7038,
      timezoneIana: 'Europe/Madrid',
    };
    const chartA = calculateNatalChart(pA, 'placidus');
    const chartB = calculateNatalChart(pB, 'placidus');
    const composite = calculateCompositeChart(chartA, chartB);
    return { chartA, chartB, composite };
  }, []);

  const handleAnalyze = async (data: {
    personA: BirthProfileInput;
    personB: BirthProfileInput;
    houseSystem: HouseSystem;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/synastry/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || 'Error al calcular el análisis');
      }

      setResult({
        chartA: json.chartA,
        chartB: json.chartB,
        synastry: json.synastry,
        composite: json.composite,
        digest: json.digest,
        aiReport: json.aiReport,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error analyzing synastry:', err);
      setErrorMessage(
        err.message || 'Ocurrió un error al procesar las cartas natales. Por favor verifica los datos ingresados.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadCelebrityDemo = async () => {
    await handleAnalyze({
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
      houseSystem: 'placidus',
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* BARRA SUPERIOR EDITORIAL */}
      <header className="w-full border-b border-astral-roseGold/15 bg-surface-50/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-astral-cyan via-astral-azure to-astral-sapphire flex items-center justify-center text-slate-950 font-serif font-bold text-xl shadow-lg shadow-astral-cyan/25">
              ✦
            </div>
            <div>
              <span className="font-serif tracking-widest text-xl text-white font-normal block">
                ASTRAL
              </span>
              <span className="text-[10px] text-astral-cyan font-mono block -mt-1 tracking-widest uppercase">
                Alquimia Vincular de Almas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLoadCelebrityDemo}
              disabled={isLoading}
              className="text-xs px-4 py-2 rounded-xl bg-surface-100/60 hover:bg-surface-200/80 text-astral-cyan border border-astral-cyan/30 transition flex items-center gap-1.5 shadow-sm backdrop-blur-md"
            >
              <span>✦</span> Ver Ejemplo en Vivo (Frida & Diego)
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex justify-between items-center animate-fadeIn shadow-lg">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-300 hover:text-white font-mono text-sm px-2"
            >
              ✕
            </button>
          </div>
        )}

        {result ? (
          <ReportView
            chartA={result.chartA}
            chartB={result.chartB}
            synastry={result.synastry}
            composite={result.composite}
            digest={result.digest}
            aiReport={result.aiReport}
            onReset={() => setResult(null)}
          />
        ) : (
          <div className="space-y-16">
            {/* HERO SECTION DE LUJO FEMENINO */}
            <div className="text-center max-w-3xl mx-auto space-y-5 pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100/80 border border-astral-cyan/30 text-xs font-serif text-astral-cyan shadow-md backdrop-blur-md">
                <span className="text-astral-cyan">✦</span> Astrología Computacional de Precisión & Amor Consciente
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight leading-tight font-normal">
                Comprende la Danza Invisible entre <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-400 to-indigo-400">sus Dos Almas</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                Descubre su química erótica, la raíz de sus roces, cómo comunicarse sin herirse y el propósito sagrado de su unión. Cálculos astronómicos deterministas interpretados con la finura de la psicología arquetípica.
              </p>
            </div>

            {/* SECCIÓN DESTACADA: RUEDA ASTROLÓGICA EN VIVO & VISIBLE INMEDIATAMENTE */}
            <div className="p-6 sm:p-10 rounded-3xl bg-surface-50/35 backdrop-blur-xl border border-astral-roseGold/20 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-astral-roseGold font-mono font-medium block">
                    Demostración Interactiva en Tiempo Real
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif text-white mt-1">
                    Explora la Esfera Celeste
                  </h3>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Toca o pasa el cursor sobre los planetas para revelar su significado arquetípico y consejos de armonía.
                  </p>
                </div>

                {/* Modos de Rueda */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'biwheel', label: 'Doble Rueda Sinastría' },
                    { id: 'chartA', label: 'Carta Elena' },
                    { id: 'chartB', label: 'Carta Mateo' },
                    { id: 'composite', label: 'Carta Compuesta' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setPreviewTab(tab.id as any)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl border transition ${
                        previewTab === tab.id
                          ? 'bg-gradient-to-r from-astral-cyan to-astral-azure text-slate-950 border-transparent font-serif shadow-md'
                          : 'bg-surface-100 text-slate-300 hover:text-white border-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rueda Interactiva Visible */}
              {previewTab === 'biwheel' && (
                <AstroWheel
                  chart={defaultPreviewData.chartA}
                  secondChart={defaultPreviewData.chartB}
                  title="Sinastría Bi-Wheel: Elena Ramos (Interior) & Mateo Silva (Exterior)"
                />
              )}
              {previewTab === 'chartA' && (
                <AstroWheel chart={defaultPreviewData.chartA} title="Carta Natal · Elena Ramos" />
              )}
              {previewTab === 'chartB' && (
                <AstroWheel chart={defaultPreviewData.chartB} title="Carta Natal · Mateo Silva" />
              )}
              {previewTab === 'composite' && (
                <AstroWheel
                  chart={{
                    profile: defaultPreviewData.chartA.profile,
                    houseSystem: 'placidus',
                    planets: defaultPreviewData.composite.planets as any,
                    angles: defaultPreviewData.composite.angles,
                    houses: defaultPreviewData.composite.houses,
                    aspects: defaultPreviewData.composite.aspects,
                    elements: defaultPreviewData.chartA.elements,
                    modalities: defaultPreviewData.chartA.modalities,
                    calculatedAt: new Date().toISOString(),
                  }}
                  title="Carta Compuesta · Elena & Mateo"
                />
              )}
            </div>

            {/* FORMULARIO PARA INTRODUCIR TUS DATOS PROPIOS */}
            <div className="space-y-4 pt-4">
              <div className="text-center space-y-1">
                <span className="text-xs uppercase tracking-widest text-astral-roseGold font-mono">
                  Calcula tu Caso Personal
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-white">
                  Ingresa los Datos de Nacimiento de Ambas Personas
                </h3>
              </div>
              <DualBirthForm onSubmit={handleAnalyze} isLoading={isLoading} />
            </div>

            {/* CUATRO PILARES ARQUITECTÓNICOS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-10 border-t border-white/5 text-xs">
              <div className="p-6 rounded-3xl bg-surface-50/30 backdrop-blur-lg border border-astral-roseGold/15 space-y-2.5">
                <span className="text-[10px] font-mono uppercase text-astral-roseGold tracking-widest block">
                  Pilar 1
                </span>
                <h4 className="text-sm font-serif font-medium text-white">Cálculo Determinista Real</h4>
                <p className="text-slate-400 font-light leading-relaxed">
                  Efemérides astronómicas exactas (VSOP87/DE405) y resolución histórica IANA. La IA no inventa posiciones ni redondea grados.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-surface-50/30 backdrop-blur-lg border border-astral-champagne/15 space-y-2.5">
                <span className="text-[10px] font-mono uppercase text-astral-champagne tracking-widest block">
                  Pilar 2
                </span>
                <h4 className="text-sm font-serif font-medium text-white">Sinastría & Carta Compuesta</h4>
                <p className="text-slate-400 font-light leading-relaxed">
                  Superposición de casas (House Overlays), matriz cruzada de orbes y la Carta Compuesta por puntos medios (arco menor).
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-surface-50/30 backdrop-blur-lg border border-astral-roseGold/15 space-y-2.5">
                <span className="text-[10px] font-mono uppercase text-astral-roseGold tracking-widest block">
                  Pilar 3
                </span>
                <h4 className="text-sm font-serif font-medium text-white">Interpretación Terapéutica</h4>
                <p className="text-slate-400 font-light leading-relaxed">
                  Análisis extenso, cálido y penetrante que ilumina los estilos de apego, las heridas de vulnerabilidad y los dones del vínculo.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-surface-50/30 backdrop-blur-lg border border-astral-champagne/15 space-y-2.5">
                <span className="text-[10px] font-mono uppercase text-astral-champagne tracking-widest block">
                  Pilar 4
                </span>
                <h4 className="text-sm font-serif font-medium text-white">Guía & Textos Flotantes</h4>
                <p className="text-slate-400 font-light leading-relaxed">
                  Ruedas astrológicas con textos flotantes, explicaciones de cada planeta y protocolos prácticos para enriquecer la convivencia.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PIE DE PÁGINA REFINADO */}
      <footer className="w-full border-t border-white/5 bg-surface-50/30 py-10 mt-auto text-center text-xs text-slate-500 font-light">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <p className="font-serif text-slate-400">
            ASTRAL · Un Santuario para el Autoconocimiento & la Alquimia Relacional
          </p>
          <p className="text-[11px] text-slate-600 max-w-xl mx-auto leading-relaxed">
            Aviso de Ética: Las cartas astrológicas y la sinastría son mapas simbólicos y arquetípicos de autodescubrimiento. Toda relación está viva y es forjada día a día por la voluntad consciente, el respeto y la ternura de quienes la habitan.
          </p>
        </div>
      </footer>
    </div>
  );
}
