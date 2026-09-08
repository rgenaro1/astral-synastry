'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SynastryContextDigest } from '@/lib/ai/contextSerializer';

interface RelationshipChatProps {
  digest: SynastryContextDigest;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUGGESTIONS = [
  '¿Por qué sentimos tanta atracción y qué la renueva?',
  '¿Cuál es la forma más dulce de comunicarle mis necesidades?',
  '¿Cómo podemos disolver los momentos de tensión sin herirnos?',
  '¿Qué propósito sagrado revela nuestra Carta Compuesta?',
  '¿Qué estilo de apego tenemos y cómo darnos seguridad mutua?',
];

export const RelationshipChat: React.FC<RelationshipChatProps> = ({ digest }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Bienvenida. He acogido en mi memoria las cartas natales de ${digest.personA.name} (${digest.personA.sun.sign}, Asc ${digest.personA.ascendant.sign}) y ${digest.personB.name} (${digest.personB.sun.sign}, Asc ${digest.personB.ascendant.sign}), junto a su Carta Compuesta en ${digest.composite.sun.sign}. 

¿Qué rincón de su corazón o de su dinámica en pareja te gustaría iluminar hoy? Puedes preguntarme con total intimidad sobre la química, la comunicación, los silencios o cómo cultivar una complicidad más dulce.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          digest,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          userMessage: query,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en el servicio de chat');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Sentí una leve interferencia en la sintonía. Por favor formula nuevamente tu consulta con calma.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full bg-surface-50/80 backdrop-blur-xl rounded-3xl border border-astral-roseGold/20 shadow-2xl flex flex-col h-[620px] overflow-hidden">
      {/* Cabecera del Chat */}
      <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between bg-surface-100/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-astral-roseGold/15 border border-astral-roseGold/30 flex items-center justify-center text-astral-roseGold font-serif text-xl shadow-inner">
            ✦
          </div>
          <div>
            <h4 className="text-sm font-serif text-white font-medium">
              Santuario de Consulta Vincular
            </h4>
            <p className="text-[11px] text-astral-champagne/80 font-light">
              Consejería arquetípica para {digest.personA.name} & {digest.personB.name}
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-astral-teal/15 text-astral-teal border border-astral-teal/25 font-mono">
          Voz Íntima Activa
        </span>
      </div>

      {/* Historial de Mensajes */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[78%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-astral-roseGold/25 to-astral-mauve/25 text-white border border-astral-roseGold/30 rounded-tr-none shadow-md'
                    : 'bg-surface-100/90 text-slate-200 border border-white/5 rounded-tl-none font-light shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div
                  className={`text-[10px] mt-2 font-mono ${
                    isUser ? 'text-astral-roseGold/70 text-right' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface-100/90 p-3.5 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-astral-roseGold animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-astral-roseGold animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-astral-roseGold animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sugerencias Rápidas */}
      <div className="px-4 py-2 bg-surface-100/40 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
        {SUGGESTIONS.map((sug, i) => (
          <button
            key={`sug-${i}`}
            onClick={() => handleSend(sug)}
            className="text-xs whitespace-nowrap px-3.5 py-1.5 rounded-full bg-surface-100 hover:bg-surface-200 text-slate-300 hover:text-astral-roseGold border border-white/5 transition flex-shrink-0 font-serif font-light"
          >
            ✦ {sug}
          </button>
        ))}
      </div>

      {/* Caja de Entrada de Mensaje */}
      <div className="p-3.5 sm:p-4 bg-surface-100/70 border-t border-white/5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu inquietud con confianza sobre su química, roces o futuro..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-surface-200/90 border border-white/10 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-astral-roseGold/60 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-astral-champagne to-astral-roseGold text-slate-950 font-serif font-medium text-xs hover:opacity-90 transition disabled:opacity-40 shadow-md"
          >
            Consultar
          </button>
        </form>
      </div>
    </div>
  );
};
