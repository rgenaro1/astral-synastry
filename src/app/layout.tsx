import type { Metadata } from 'next';
import './globals.css';
import { CosmicBackground } from '@/components/ui/CosmicBackground';

export const metadata: Metadata = {
  title: 'ASTRAL · Sinastría & Alquimia Astrológica de Almas con IA',
  description:
    'Plataforma de alta precisión astronómica y análisis profundo de compatibilidad y amor consciente con inteligencia artificial.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased min-h-screen flex flex-col selection:bg-astral-roseGold/30 selection:text-white relative bg-background overflow-x-hidden">
        {/* Fondo cósmico animado con estrellas, nebulosas y estrellas fugaces */}
        <CosmicBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
