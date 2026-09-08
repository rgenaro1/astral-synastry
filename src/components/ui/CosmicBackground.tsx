'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  hasSpike?: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initMilkyWay();
    };

    window.addEventListener('resize', handleResize);

    // Paleta de estrellas de telescopio
    const starColors = [
      '245, 235, 220', // Blanco cálido estelar
      '255, 255, 255', // Blanco puro
      '232, 180, 184', // Rosa estelar / H-Alfa
      '180, 210, 255', // Azul clase B / O
      '255, 225, 170', // Gigante naranja / amarillo
      '220, 195, 240', // Violeta nebular
    ];

    let stars: Star[] = [];
    let milkyWayCanvas: HTMLCanvasElement | null = null;

    // Generar campo de estrellas denso como visto por telescopio
    const initMilkyWay = () => {
      // 1. Crear canvas fuera de pantalla para la Vía Láctea y nebulosas densas
      milkyWayCanvas = document.createElement('canvas');
      milkyWayCanvas.width = width;
      milkyWayCanvas.height = height;
      const mCtx = milkyWayCanvas.getContext('2d');
      if (!mCtx) return;

      // Fondo base de espacio profundo
      mCtx.fillStyle = '#07050B';
      mCtx.fillRect(0, 0, width, height);

      // BANDA PRINCIPAL DE LA VÍA LÁCTEA (Diagonal galáctica atravesando el cielo)
      // Centro galáctico (núcleo luminoso cálido con polvo estelar)
      const coreX = width * 0.45;
      const coreY = height * 0.35;

      // Resplandor del bulbo galáctico
      const coreGrad = mCtx.createRadialGradient(
        coreX,
        coreY,
        0,
        coreX,
        coreY,
        Math.max(width, height) * 0.45
      );
      coreGrad.addColorStop(0, 'rgba(245, 220, 175, 0.22)'); // Núcleo dorado cálido
      coreGrad.addColorStop(0.2, 'rgba(215, 140, 170, 0.16)'); // Polvo H-Alfa
      coreGrad.addColorStop(0.45, 'rgba(105, 55, 125, 0.12)'); // Violeta nebular
      coreGrad.addColorStop(0.7, 'rgba(30, 25, 65, 0.08)'); // Azul profundo de absorción
      coreGrad.addColorStop(1, 'transparent');

      mCtx.fillStyle = coreGrad;
      mCtx.fillRect(0, 0, width, height);

      // Banda galáctica extendida diagonal
      mCtx.save();
      mCtx.translate(width * 0.5, height * 0.5);
      mCtx.rotate((-35 * Math.PI) / 180); // Inclinación de la Vía Láctea vista desde la montaña

      // Corriente nebular principal
      const bandGrad = mCtx.createLinearGradient(
        -width * 0.8,
        -height * 0.3,
        width * 0.8,
        height * 0.3
      );
      bandGrad.addColorStop(0, 'rgba(40, 30, 80, 0.05)');
      bandGrad.addColorStop(0.3, 'rgba(175, 95, 135, 0.14)');
      bandGrad.addColorStop(0.5, 'rgba(235, 195, 150, 0.2)');
      bandGrad.addColorStop(0.7, 'rgba(125, 75, 160, 0.14)');
      bandGrad.addColorStop(1, 'rgba(30, 45, 90, 0.06)');

      mCtx.fillStyle = bandGrad;
      mCtx.fillRect(-width, -height * 0.35, width * 2, height * 0.7);

      // Franjas de polvo oscuro (Dark Rift / grietas de absorción cósmica)
      const riftGrad = mCtx.createRadialGradient(0, 0, 10, 0, 0, width * 0.4);
      riftGrad.addColorStop(0, 'rgba(7, 5, 11, 0.25)');
      riftGrad.addColorStop(0.5, 'rgba(12, 9, 18, 0.15)');
      riftGrad.addColorStop(1, 'transparent');

      mCtx.fillStyle = riftGrad;
      mCtx.fillRect(-width * 0.5, -height * 0.15, width, height * 0.3);

      mCtx.restore();

      // Nubes de gas difuso en las esquinas
      const neb1 = mCtx.createRadialGradient(
        width * 0.85,
        height * 0.15,
        0,
        width * 0.85,
        height * 0.15,
        width * 0.35
      );
      neb1.addColorStop(0, 'rgba(130, 70, 150, 0.12)');
      neb1.addColorStop(0.6, 'rgba(45, 30, 75, 0.05)');
      neb1.addColorStop(1, 'transparent');
      mCtx.fillStyle = neb1;
      mCtx.fillRect(0, 0, width, height);

      // Silueta sutil de montaña lejana en la parte inferior para perspectiva desde la tierra
      const horizonGrad = mCtx.createLinearGradient(0, height * 0.85, 0, height);
      horizonGrad.addColorStop(0, 'transparent');
      horizonGrad.addColorStop(0.8, 'rgba(6, 4, 9, 0.6)');
      horizonGrad.addColorStop(1, 'rgba(4, 3, 7, 0.95)');
      mCtx.fillStyle = horizonGrad;
      mCtx.fillRect(0, height * 0.8, width, height * 0.2);

      // 2. Generar densidad masiva de estrellas (entre 600 y 900 estrellas)
      const count = Math.min(850, Math.floor((width * height) / 1800));
      stars = [];

      for (let i = 0; i < count; i++) {
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const isDenseRegion = Math.random() > 0.4; // 60% concentradas en la franja galáctica

        let x = Math.random() * width;
        let y = Math.random() * height;

        if (isDenseRegion) {
          // Sesgo hacia el eje diagonal de la Vía Láctea
          const t = Math.random();
          x = width * t + (Math.random() - 0.5) * (width * 0.45);
          y = height * (1 - t * 0.8) + (Math.random() - 0.5) * (height * 0.35);
        }

        // Magnitudes estelares
        const isBright = Math.random() < 0.035; // Estrellas alfa prominentes
        const isMedium = Math.random() < 0.2;
        const radius = isBright
          ? Math.random() * 1.5 + 1.6
          : isMedium
          ? Math.random() * 0.8 + 0.9
          : Math.random() * 0.5 + 0.3;

        const baseAlpha = isBright
          ? Math.random() * 0.3 + 0.7
          : isMedium
          ? Math.random() * 0.3 + 0.45
          : Math.random() * 0.35 + 0.2;

        stars.push({
          x,
          y,
          radius,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: Math.random() * 0.03 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          color,
          hasSpike: isBright,
        });
      }
    };

    initMilkyWay();

    // Estrella fugaz periódica
    const shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      opacity: 0,
      active: false,
    };

    const triggerShootingStar = () => {
      if (shootingStar.active) return;
      shootingStar.x = Math.random() * (width * 0.75);
      shootingStar.y = Math.random() * (height * 0.4);
      shootingStar.length = Math.random() * 95 + 75;
      shootingStar.speed = Math.random() * 14 + 16;
      shootingStar.angle = Math.PI / 4 + (Math.random() * 0.25 - 0.12);
      shootingStar.opacity = 1;
      shootingStar.active = true;
    };

    const meteorInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        triggerShootingStar();
      }
    }, 4000);

    let time = 0;

    // Bucle de animación optimizado
    const render = () => {
      time += 0.02;

      // 1. Dibujar el fondo estático de la Vía Láctea desde el canvas en memoria
      if (milkyWayCanvas) {
        ctx.drawImage(milkyWayCanvas, 0, 0);
      } else {
        ctx.fillStyle = '#08050D';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Renderizar estrellas centelleantes
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Centelleo armónico
        const twinkle = Math.sin(time * s.twinkleSpeed * 50 + s.twinklePhase);
        const currentAlpha = Math.max(0.1, Math.min(1, s.baseAlpha + twinkle * 0.25));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${currentAlpha})`;
        ctx.fill();

        // Si es una estrella alfa brillante: dibujar picos de difracción de telescopio (Diffraction Spikes)
        if (s.hasSpike && currentAlpha > 0.6) {
          const spikeLen = s.radius * 6;
          ctx.strokeStyle = `rgba(${s.color}, ${currentAlpha * 0.35})`;
          ctx.lineWidth = 0.6;

          ctx.beginPath();
          // Eje horizontal
          ctx.moveTo(s.x - spikeLen, s.y);
          ctx.lineTo(s.x + spikeLen, s.y);
          // Eje vertical
          ctx.moveTo(s.x, s.y - spikeLen);
          ctx.lineTo(s.x, s.y + spikeLen);
          ctx.stroke();

          // Resplandor aureolar
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color}, ${currentAlpha * 0.15})`;
          ctx.fill();
        }
      }

      // 3. Renderizar estrella fugaz si está activa
      if (shootingStar.active) {
        const endX = shootingStar.x + Math.cos(shootingStar.angle) * shootingStar.length;
        const endY = shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length;

        const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 250, 235, ${shootingStar.opacity})`);
        grad.addColorStop(0.35, `rgba(232, 180, 184, ${shootingStar.opacity * 0.7})`);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.022;

        if (
          shootingStar.opacity <= 0 ||
          shootingStar.x > width ||
          shootingStar.y > height
        ) {
          shootingStar.active = false;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(meteorInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
