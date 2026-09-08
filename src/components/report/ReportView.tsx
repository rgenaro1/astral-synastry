'use client';

import React, { useState } from 'react';
import {
  AIInterpretationReport,
  CompositeChart,
  NatalChart,
  SynastryAnalysis,
} from '@/lib/types/astrology';
import { SynastryContextDigest } from '@/lib/ai/contextSerializer';
import { AstroWheel } from '../astrology/AstroWheel';
import { RelationshipChat } from '../chat/RelationshipChat';

interface ReportViewProps {
  chartA: NatalChart;
  chartB: NatalChart;
  synastry: SynastryAnalysis;
  composite: CompositeChart;
  digest: SynastryContextDigest;
  aiReport: AIInterpretationReport;
  onReset: () => void;
}

type TabKey =
  | 'encounter'
  | 'personA'
  | 'personB'
  | 'relationship'
  | 'recommendations'
  | 'hidden'
  | 'composite'
  | 'compatibility'
  | 'wheels'
  | 'chat';

export const ReportView: React.FC<ReportViewProps> = ({
  chartA,
  chartB,
  synastry,
  composite,
  digest,
  aiReport,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('encounter');
  const [wheelMode, setWheelMode] = useState<'biwheel' | 'chartA' | 'chartB' | 'composite'>('biwheel');

  const { sections, recommendations } = aiReport;
  const overall = synastry.overallCompatibility;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* BANNER EDITORIAL DE ENCABEZADO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-surface-100/90 to-surface-50/80 border border-astral-roseGold/20 p-6 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-astral-roseGold/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-astral-champagne/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-astral-roseGold font-mono font-medium">
                Sinastría & Alquimia de Almas
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">
                Casas {chartA.houseSystem.toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
              {chartA.profile.name} <span className="text-astral-roseGold font-light">&</span> {chartB.profile.name}
            </h1>
            <p className="text-base sm:text-lg text-astral-champagne/90 font-serif italic font-light">
              «{overall.archetypeTitle}»
            </p>
          </div>

          {/* Medidores de Afinidad y Armonía */}
          <div className="flex items-center gap-4 bg-surface-200/70 p-4 sm:p-5 rounded-3xl border border-astral-roseGold/15 backdrop-blur-md shadow-lg">
            <div className="text-center px-4 border-r border-white/10">
              <div className="text-2xl sm:text-4xl font-serif font-medium text-astral-champagne">
                {overall.averageScore}%
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono mt-0.5">
                Afinidad Global
              </div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl sm:text-4xl font-serif font-medium text-astral-roseGold">
                {overall.harmonyIndex}%
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono mt-0.5">
                Índice de Armonía
              </div>
            </div>
            <button
              onClick={onReset}
              className="ml-2 text-xs px-3.5 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-300 text-slate-200 hover:text-white border border-white/5 transition font-serif"
            >
              Nuevo Análisis
            </button>
          </div>
        </div>

        {/* Resumen Astronómico Primario */}
        <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-light">
          <div>
            <span className="text-slate-400 block text-[11px]">Sol de {chartA.profile.name}:</span>
            <span className="text-white font-medium">
              {digest.personA.sun.sign} ({digest.personA.sun.degree})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Ascendente {chartA.profile.name}:</span>
            <span className="text-astral-roseGold font-medium">{digest.personA.ascendant.sign}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Sol de {chartB.profile.name}:</span>
            <span className="text-white font-medium">
              {digest.personB.sun.sign} ({digest.personB.sun.degree})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Ascendente {chartB.profile.name}:</span>
            <span className="text-astral-champagne font-medium">{digest.personB.ascendant.sign}</span>
          </div>
        </div>
      </div>

      {/* BARRA DE PESTAÑAS EDITORIALES */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/5 no-scrollbar">
        {[
          { id: 'encounter', label: '1. El Encuentro' },
          { id: 'personA', label: `2. ${chartA.profile.name}` },
          { id: 'personB', label: `3. ${chartB.profile.name}` },
          { id: 'relationship', label: '4. La Relación' },
          { id: 'recommendations', label: '✦ Guía & Recomendaciones' },
          { id: 'hidden', label: '5. Patrones Ocultos' },
          { id: 'composite', label: '6. Carta Compuesta' },
          { id: 'compatibility', label: '7. Mapa de Compatibilidad' },
          { id: 'wheels', label: '✦ Ruedas Interactivas' },
          { id: 'chat', label: '💬 Consulta con IA' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabKey)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-astral-champagne via-astral-roseGold to-astral-mauve text-slate-950 shadow-md font-serif'
                  : 'bg-surface-50/60 hover:bg-surface-100 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CUERPO DE LAS SECCIONES */}
      <div className="space-y-6">
        {/* SECCIÓN 1: EL ENCUENTRO */}
        {activeTab === 'encounter' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-surface-50/80 border border-white/5 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-astral-roseGold font-mono">
                Sección 1
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                {sections.encounter.title}
              </h2>
            </div>
            <div className="text-slate-200 text-sm sm:text-base leading-relaxed font-light whitespace-pre-wrap space-y-4">
              {sections.encounter.narrative}
            </div>

            {/* Contrato Evolutivo del Alma */}
            {sections.encounter.soulContract && (
              <div className="p-6 rounded-3xl bg-surface-100/60 border border-astral-roseGold/20 space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-astral-roseGold">
                  El Contrato Evolutivo de las Almas
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-light">
                  {sections.encounter.soulContract}
                </p>
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN 2: PERSONA A */}
        {activeTab === 'personA' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-surface-50/80 border border-white/5 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-astral-roseGold font-mono">
                Sección 2
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                {sections.personA.title}
              </h2>
            </div>

            {/* Balance elemental */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-surface-100/60 rounded-2xl border border-white/5 text-xs font-light">
              <div>
                <span className="text-slate-400 block text-[11px]">Fuego:</span>
                <span className="text-white font-mono">{chartA.elements.fire}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tierra:</span>
                <span className="text-white font-mono">{chartA.elements.earth}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Aire:</span>
                <span className="text-white font-mono">{chartA.elements.air}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Agua:</span>
                <span className="text-white font-mono">{chartA.elements.water}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-200 leading-relaxed font-light">
              <div className="p-6 rounded-3xl bg-surface-100/50 border border-white/5 space-y-2">
                <h4 className="text-xs font-mono uppercase text-astral-roseGold tracking-wider">Identidad & Vitalidad</h4>
                <p>{sections.personA.identity}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/50 border border-white/5 space-y-2">
                <h4 className="text-xs font-mono uppercase text-astral-roseGold tracking-wider">Mundo Emocional & Cobijo</h4>
                <p>{sections.personA.emotionalWorld}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/50 border border-white/5 space-y-2">
                <h4 className="text-xs font-mono uppercase text-astral-roseGold tracking-wider">Estilo de Amor & Deseo</h4>
                <p>{sections.personA.relationalStyle}</p>
              </div>
              {sections.personA.hiddenWoundAndGift && (
                <div className="p-6 rounded-3xl bg-surface-100/50 border border-astral-roseGold/20 space-y-2">
                  <h4 className="text-xs font-mono uppercase text-astral-champagne tracking-wider">Herida Oculta & Mayor Don</h4>
                  <p>{sections.personA.hiddenWoundAndGift}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECCIÓN 3: PERSONA B */}
        {activeTab === 'personB' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-surface-50/80 border border-white/5 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-astral-champagne font-mono">
                Sección 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                {sections.personB.title}
              </h2>
            </div>

            {/* Balance elemental */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-surface-100/60 rounded-2xl border border-white/5 text-xs font-light">
              <div>
                <span className="text-slate-400 block text-[11px]">Fuego:</span>
                <span className="text-white font-mono">{chartB.elements.fire}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tierra:</span>
                <span className="text-white font-mono">{chartB.elements.earth}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Aire:</span>
                <span className="text-white font-mono">{chartB.elements.air}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Agua:</span>
                <span className="text-white font-mono">{chartB.elements.water}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-200 leading-relaxed font-light">
              <div className="p-6 rounded-3xl bg-surface-100/50 border border-white/5 space-y-2">
                <h4 className="text-xs font-mono uppercase text-astral-champagne tracking-wider">Identidad & Vitalidad</h4>
                <p>{sections.personB.identity}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/50 border border-white/5 space-y-2">
                <h4 className="text-xs font-mono uppercase text-astral-champagne tracking-wider">Mundo Emocional & Cobijo</h4>
                <p>{sections.personB.emotionalWorld}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/50 border border-white/5 space-y-2">
                <h4 className="text-xs font-mono uppercase text-astral-champagne tracking-wider">Estilo de Amor & Deseo</h4>
                <p>{sections.personB.relationalStyle}</p>
              </div>
              {sections.personB.hiddenWoundAndGift && (
                <div className="p-6 rounded-3xl bg-surface-100/50 border border-astral-champagne/20 space-y-2">
                  <h4 className="text-xs font-mono uppercase text-astral-roseGold tracking-wider">Herida Oculta & Mayor Don</h4>
                  <p>{sections.personB.hiddenWoundAndGift}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECCIÓN 4: LA RELACIÓN */}
        {activeTab === 'relationship' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-surface-50/80 border border-white/5 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-astral-roseGold font-mono">
                Sección 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                {sections.relationship.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-200 leading-relaxed font-light">
              <div className="p-6 rounded-3xl bg-surface-100/40 border border-white/5 space-y-2">
                <h4 className="text-xs font-serif uppercase tracking-wider text-astral-roseGold">
                  Amor, Afecto & Cobijo Anímico
                </h4>
                <p>{sections.relationship.loveAndEmotions}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/40 border border-white/5 space-y-2">
                <h4 className="text-xs font-serif uppercase tracking-wider text-astral-champagne">
                  Comunicación, Mente & Entendimiento
                </h4>
                <p>{sections.relationship.communicationAndMind}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/40 border border-white/5 space-y-2">
                <h4 className="text-xs font-serif uppercase tracking-wider text-astral-roseGold">
                  Atracción, Química & Magnetismo
                </h4>
                <p>{sections.relationship.attractionAndChemistry}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/40 border border-white/5 space-y-2">
                <h4 className="text-xs font-serif uppercase tracking-wider text-astral-champagne">
                  Estabilidad, Lealtad & Tiempo (Saturno)
                </h4>
                <p>{sections.relationship.stabilityAndCommitment}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/40 border border-rose-400/20 md:col-span-2 space-y-2">
                <h4 className="text-xs font-serif uppercase tracking-wider text-rose-300">
                  Fricción Consciente & Oportunidad Evolutiva
                </h4>
                <p>{sections.relationship.frictionAndEvolution}</p>
              </div>
            </div>
          </div>
        )}

        {/* NUEVA PESTAÑA: GUÍA PRÁCTICA & RECOMENDACIONES DE ARMONÍA */}
        {activeTab === 'recommendations' && recommendations && (
          <div className="p-8 sm:p-10 rounded-3xl bg-surface-50/80 border border-astral-roseGold/20 shadow-xl space-y-8">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-astral-roseGold font-mono">
                Guía Práctica de Evolución
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                {recommendations.title}
              </h2>
              <p className="text-sm text-slate-300 font-light italic">
                {recommendations.subtitle}
              </p>
            </div>

            {/* Protocolo de Comunicación */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-100/50 border border-white/5 space-y-4">
              <h3 className="text-sm font-serif text-astral-champagne flex items-center gap-2">
                <span>✦</span> {recommendations.communicationProtocol.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed font-light">
                <div className="p-4 rounded-2xl bg-surface-200/50 border border-white/5">
                  <strong className="text-astral-roseGold block mb-1">Para {chartA.profile.name}:</strong>
                  {recommendations.communicationProtocol.adviceForPersonA}
                </div>
                <div className="p-4 rounded-2xl bg-surface-200/50 border border-white/5">
                  <strong className="text-astral-champagne block mb-1">Para {chartB.profile.name}:</strong>
                  {recommendations.communicationProtocol.adviceForPersonB}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-astral-roseGold/10 border border-astral-roseGold/20 text-xs text-slate-200">
                {recommendations.communicationProtocol.goldenBridge}
              </div>
            </div>

            {/* Lenguajes del Amor */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-100/50 border border-white/5 space-y-4">
              <h3 className="text-sm font-serif text-astral-roseGold flex items-center gap-2">
                <span>✦</span> {recommendations.loveLanguages.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed font-light">
                <div className="p-4 rounded-2xl bg-surface-200/50 border border-white/5">
                  <strong className="text-astral-roseGold block mb-1">Necesidad Afectiva de {chartA.profile.name}:</strong>
                  {recommendations.loveLanguages.needsOfPersonA}
                </div>
                <div className="p-4 rounded-2xl bg-surface-200/50 border border-white/5">
                  <strong className="text-astral-champagne block mb-1">Necesidad Afectiva de {chartB.profile.name}:</strong>
                  {recommendations.loveLanguages.needsOfPersonB}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-astral-champagne/10 border border-astral-champagne/20 text-xs text-slate-200">
                {recommendations.loveLanguages.sacredHarmonyAction}
              </div>
            </div>

            {/* Desactivación de Conflictos en 3 Pasos */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-100/50 border border-white/5 space-y-3">
              <h3 className="text-sm font-serif text-rose-300 flex items-center gap-2">
                <span>✦</span> {recommendations.deescalationGuide.title}
              </h3>
              <p className="text-xs text-slate-300 font-light mb-2">
                {recommendations.deescalationGuide.triggerPatterns}
              </p>
              <div className="space-y-2 text-xs text-slate-300 font-light">
                <div className="p-3 rounded-2xl bg-surface-200/60 border border-white/5">
                  {recommendations.deescalationGuide.step1Pause}
                </div>
                <div className="p-3 rounded-2xl bg-surface-200/60 border border-white/5">
                  {recommendations.deescalationGuide.step2Empathy}
                </div>
                <div className="p-3 rounded-2xl bg-surface-200/60 border border-white/5">
                  {recommendations.deescalationGuide.step3Repair}
                </div>
              </div>
            </div>

            {/* Rituales de Conexión & Preguntas Conscientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-surface-100/50 border border-white/5 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-astral-roseGold">
                  Rituales Sagrados de Presencia
                </h3>
                <ul className="space-y-2 text-xs text-slate-300 font-light">
                  {recommendations.deepConnectionRituals.rituals.map((r, i) => (
                    <li key={`rit-${i}`} className="flex items-start gap-2">
                      <span className="text-astral-roseGold">✦</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-surface-100/50 border border-white/5 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-astral-champagne">
                  5 Preguntas Conscientes para Dialogar
                </h3>
                <ul className="space-y-2 text-xs text-slate-300 font-light">
                  {recommendations.reflectionQuestions.map((q, i) => (
                    <li key={`q-${i}`} className="flex items-start gap-2">
                      <span className="text-astral-champagne">✦</span>
                      <span className="italic">"{q}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 5: PATRONES OCULTOS */}
        {activeTab === 'hidden' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-surface-50/80 border border-white/5 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-astral-roseGold font-mono">
                Sección 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                {sections.hiddenPatterns.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-200 leading-relaxed font-light">
              <div className="p-6 rounded-3xl bg-surface-100/40 border border-white/5 space-y-2">
                <h4 className="text-xs font-serif uppercase text-astral-roseGold tracking-wider">
                  Nodos Lunares & Destino Kármico
                </h4>
                <p>{sections.hiddenPatterns.karmicNodes}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/40 border border-white/5 space-y-2">
                <h4 className="text-xs font-serif uppercase text-astral-champagne tracking-wider">
                  Fuerzas Transpersonales (Plutón / Quirón)
                </h4>
                <p>{sections.hiddenPatterns.unconsciousDynamics}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/40 border border-white/5 space-y-2">
                <h4 className="text-xs font-serif uppercase text-astral-lavender tracking-wider">
                  Armonización de Estilos de Apego
                </h4>
                <p>{sections.hiddenPatterns.attachmentStyles || 'Equilibrio entre intimidad y libertad.'}</p>
              </div>
            </div>

            {/* Tabla de aspectos inter-cartas más estrechos */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-serif uppercase tracking-wider text-slate-400">
                Top Aspectos Inter-Cartas de Mayor Intensidad (Orbe más cerrado)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-white/5 rounded-2xl overflow-hidden">
                  <thead className="bg-surface-100/80 text-slate-400 font-mono">
                    <tr>
                      <th className="p-3">Planeta A</th>
                      <th className="p-3">Aspecto</th>
                      <th className="p-3">Planeta B</th>
                      <th className="p-3">Orbe</th>
                      <th className="p-3">Fuerza</th>
                      <th className="p-3">Categoría</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-surface-50/40">
                    {synastry.aspects.slice(0, 8).map((asp, i) => (
                      <tr key={`asp-row-${i}`} className="hover:bg-white/5 transition">
                        <td className="p-3 font-medium text-white">
                          {chartA.profile.name} ({asp.planet1Name})
                        </td>
                        <td className="p-3 text-astral-roseGold font-serif">
                          {asp.symbol} {asp.typeName}
                        </td>
                        <td className="p-3 font-medium text-white">
                          {chartB.profile.name} ({asp.planet2Name})
                        </td>
                        <td className="p-3 font-mono text-slate-400">{asp.orb}°</td>
                        <td className="p-3 font-mono text-astral-teal">{asp.strength}%</td>
                        <td className="p-3 uppercase text-[10px] text-slate-500 font-mono">
                          {asp.category}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 6: CARTA COMPUESTA */}
        {activeTab === 'composite' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-surface-50/80 border border-white/5 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-astral-roseGold font-mono">
                Sección 6
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                {sections.compositeSoul.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-200 leading-relaxed font-light">
              <div className="p-6 rounded-3xl bg-surface-100/40 border border-white/5 space-y-2">
                <h4 className="text-xs font-serif uppercase text-astral-roseGold tracking-wider">Propósito Central</h4>
                <p>{sections.compositeSoul.centralPurpose}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/40 border border-white/5 space-y-2">
                <h4 className="text-xs font-serif uppercase text-astral-teal tracking-wider">Fortalezas & Dones</h4>
                <p>{sections.compositeSoul.strengthsAndGifts}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/40 border border-white/5 space-y-2">
                <h4 className="text-xs font-serif uppercase text-rose-300 tracking-wider">Sombra & Puntos Ciegos</h4>
                <p>{sections.compositeSoul.shadowAndPitfalls}</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-100/40 border border-white/5 space-y-2">
                <h4 className="text-xs font-serif uppercase text-astral-champagne tracking-wider">Consejo para Florecer</h4>
                <p>{sections.compositeSoul.adviceForThriving}</p>
              </div>
            </div>

            <div className="p-4 bg-surface-100/40 rounded-2xl border border-white/5 text-xs text-slate-300 font-mono flex flex-wrap justify-between items-center gap-2">
              <span>Sol Compuesto: {composite.planets.find((p) => p.id === 'sun')?.sign} (Casa {composite.planets.find((p) => p.id === 'sun')?.house})</span>
              <span className="text-astral-roseGold">Ascendente Compuesto: {composite.angles.ascendant.sign}</span>
            </div>
          </div>
        )}

        {/* SECCIÓN 7: MAPA DE COMPATIBILIDAD */}
        {activeTab === 'compatibility' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-surface-50/80 border border-white/5 shadow-xl space-y-8">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-astral-roseGold font-mono">
                Sección 7
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                {sections.compatibilityMap.title}
              </h2>
              <p className="text-sm text-slate-300 font-light">
                {sections.compatibilityMap.dimensionalReview}
              </p>
            </div>

            {/* 9 Barras de Compatibilidad Multidimensional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {synastry.dimensions.map((dim) => {
                const isConflict = dim.id === 'conflict';
                return (
                  <div
                    key={dim.id}
                    className="p-5 rounded-3xl bg-surface-100/40 border border-white/5 flex flex-col justify-between space-y-3 shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-xs font-serif font-medium text-white">{dim.name}</h4>
                        <span
                          className={`font-mono text-sm font-semibold ${
                            isConflict ? 'text-rose-400' : 'text-astral-champagne'
                          }`}
                        >
                          {dim.score}/100
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-200 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isConflict
                              ? 'bg-gradient-to-r from-rose-300 to-rose-600'
                              : 'bg-gradient-to-r from-astral-champagne to-astral-roseGold'
                          }`}
                          style={{ width: `${dim.score}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] text-slate-400 block font-light">
                        {dim.level}
                      </span>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-white/5 text-[11px] text-slate-400 font-light">
                      <div>
                        <span className="text-astral-teal font-medium">+ </span>
                        {dim.positiveFactors[0]}
                      </div>
                      {dim.challengeFactors[0] && (
                        <div>
                          <span className="text-rose-400 font-medium">- </span>
                          {dim.challengeFactors[0]}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 rounded-3xl bg-surface-100/60 border border-white/5 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-astral-roseGold">
                Síntesis del Vínculo
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-light">
                {sections.compatibilityMap.synthesis}
              </p>
            </div>
          </div>
        )}

        {/* PESTAÑA: RUEDAS ASTROLÓGICAS INTERACTIVAS */}
        {activeTab === 'wheels' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-50/60 backdrop-blur-md rounded-2xl border border-white/5">
              <span className="text-xs text-slate-300 font-serif">Modo de Rueda:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'biwheel', label: 'Doble Rueda Sinastría' },
                  { id: 'chartA', label: `Carta ${chartA.profile.name}` },
                  { id: 'chartB', label: `Carta ${chartB.profile.name}` },
                  { id: 'composite', label: 'Carta Compuesta' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setWheelMode(mode.id as any)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border transition ${
                      wheelMode === mode.id
                        ? 'bg-gradient-to-r from-astral-champagne to-astral-roseGold text-slate-950 border-transparent font-serif'
                        : 'bg-surface-100 text-slate-300 hover:text-white border-white/5'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {wheelMode === 'biwheel' && (
              <AstroWheel
                chart={chartA}
                secondChart={chartB}
                title={`Sinastría Bi-Wheel: ${chartA.profile.name} (Interior) & ${chartB.profile.name} (Exterior)`}
              />
            )}
            {wheelMode === 'chartA' && <AstroWheel chart={chartA} />}
            {wheelMode === 'chartB' && <AstroWheel chart={chartB} />}
            {wheelMode === 'composite' && (
              <AstroWheel
                chart={{
                  profile: chartA.profile,
                  houseSystem: chartA.houseSystem,
                  planets: composite.planets as any,
                  angles: composite.angles,
                  houses: composite.houses,
                  aspects: composite.aspects,
                  elements: chartA.elements,
                  modalities: chartA.modalities,
                  calculatedAt: new Date().toISOString(),
                }}
                title={`Carta Compuesta: ${composite.relationshipTitle}`}
              />
            )}
          </div>
        )}

        {/* PESTAÑA: CONSULTA CON IA */}
        {activeTab === 'chat' && <RelationshipChat digest={digest} />}
      </div>
    </div>
  );
};
