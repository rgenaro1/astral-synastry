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

    let offscreenCanvas: HTMLCanvasElement | null = null;
    let stars: Star[] = [];

    // Colores espectrales de estrellas de telescopio en tonos azules y plata
    const starColors = [
      '255, 255, 255', // Blanco diamante puro
      '220, 240, 255', // Blanco glacial / Hielo estelar
      '186, 230, 253', // Cyan suave celestial
      '147, 197, 253', // Azul caliente clase B / O
      '96, 165, 250',  // Azul zafiro luminoso
      '226, 232, 240', // Plata estelar pura
      '199, 210, 254', // Índigo celeste
    ];

    // Generar la composición de telescopio en alta montaña
    const initSky = () => {
      offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      const bCtx = offscreenCanvas.getContext('2d');
      if (!bCtx) return;

      // 1. Cielo nocturno de alta montaña (Cielo clase Bortle 1 - negro azul zafiro ultra profundo)
      const skyGrad = bCtx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#02040A');
      skyGrad.addColorStop(0.35, '#04091A');
      skyGrad.addColorStop(0.7, '#071330');
      skyGrad.addColorStop(1, '#0B1B42');
      bCtx.fillStyle = skyGrad;
      bCtx.fillRect(0, 0, width, height);

      // 2. BANDA DIAGONAL DE LA VÍA LÁCTEA (Inclinación de 32 grados en tonos azul zafiro y cian)
      bCtx.save();
      bCtx.translate(width * 0.45, height * 0.4);
      bCtx.rotate((-32 * Math.PI) / 180);

      // Resplandor difuso del brazo galáctico principal
      const bandWidth = Math.max(width, height) * 1.6;
      const bandHeight = height * 0.75;

      const milkyBand = bCtx.createLinearGradient(0, -bandHeight / 2, 0, bandHeight / 2);
      milkyBand.addColorStop(0, 'rgba(4, 12, 35, 0)');
      milkyBand.addColorStop(0.2, 'rgba(20, 60, 140, 0.22)');
      milkyBand.addColorStop(0.4, 'rgba(56, 189, 248, 0.38)'); // Nube de polvo estelar azul cian celestial
      milkyBand.addColorStop(0.5, 'rgba(215, 240, 255, 0.52)'); // Núcleo estelar blanco glacial luminoso
      milkyBand.addColorStop(0.6, 'rgba(59, 130, 246, 0.35)'); // Zafiro radiante
      milkyBand.addColorStop(0.8, 'rgba(30, 58, 138, 0.2)');
      milkyBand.addColorStop(1, 'rgba(4, 12, 35, 0)');

      bCtx.fillStyle = milkyBand;
      bCtx.fillRect(-bandWidth / 2, -bandHeight / 2, bandWidth, bandHeight);

      // NÚCLEO GALÁCTICO BRILLANTE (Centro estelar blanco diamante y cian en Sagitario)
      const coreGrad = bCtx.createRadialGradient(0, 0, 10, 0, 0, width * 0.45);
      coreGrad.addColorStop(0, 'rgba(240, 249, 255, 0.6)'); // Bulbo galáctico súper denso blanco-cian
      coreGrad.addColorStop(0.25, 'rgba(125, 211, 252, 0.45)'); // Polvo de estrellas cian glacial
      coreGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.28)'); // Nebulosa zafiro
      coreGrad.addColorStop(0.75, 'rgba(30, 27, 75, 0.16)'); // Halo de absorción índigo
      coreGrad.addColorStop(1, 'transparent');

      bCtx.fillStyle = coreGrad;
      bCtx.beginPath();
      bCtx.ellipse(0, 0, width * 0.5, height * 0.3, 0, 0, Math.PI * 2);
      bCtx.fill();

      // GRIETAS DE POLVO INTERESTELAR OSCURO (Great Rift / Dark River)
      // Bloquean la luz estelar con absorción cósmica en azul petróleo profundo
      const darkRifts = [
        { x: -width * 0.2, y: -height * 0.05, rx: width * 0.25, ry: height * 0.08, rot: 0.1 },
        { x: width * 0.1, y: height * 0.04, rx: width * 0.3, ry: height * 0.09, rot: -0.15 },
        { x: -width * 0.05, y: -height * 0.02, rx: width * 0.18, ry: height * 0.06, rot: 0.05 },
      ];

      for (const rift of darkRifts) {
        const rGrad = bCtx.createRadialGradient(rift.x, rift.y, 5, rift.x, rift.y, rift.rx);
        rGrad.addColorStop(0, 'rgba(2, 5, 14, 0.65)');
        rGrad.addColorStop(0.6, 'rgba(3, 8, 22, 0.42)');
        rGrad.addColorStop(1, 'transparent');

        bCtx.save();
        bCtx.translate(rift.x, rift.y);
        bCtx.rotate(rift.rot);
        bCtx.fillStyle = rGrad;
        bCtx.beginPath();
        bCtx.ellipse(0, 0, rift.rx, rift.ry, 0, 0, Math.PI * 2);
        bCtx.fill();
        bCtx.restore();
      }

      bCtx.restore();

      // 3. NEBULOSAS DE REFLEXIÓN CIAN & ÍNDIGO (Tipo Pléyades y M78)
      // Nebulosa cian eléctrico en el cuadrante superior
      const nebCyanElectric = bCtx.createRadialGradient(
        width * 0.72,
        height * 0.22,
        0,
        width * 0.72,
        height * 0.22,
        width * 0.25
      );
      nebCyanElectric.addColorStop(0, 'rgba(56, 189, 248, 0.32)');
      nebCyanElectric.addColorStop(0.35, 'rgba(96, 165, 250, 0.22)');
      nebCyanElectric.addColorStop(0.65, 'rgba(79, 70, 229, 0.12)');
      nebCyanElectric.addColorStop(1, 'transparent');
      bCtx.fillStyle = nebCyanElectric;
      bCtx.fillRect(0, 0, width, height);

      // Nebulosa zafiro y turquesa en el cuadrante inferior izquierdo
      const nebDeepAzure = bCtx.createRadialGradient(
        width * 0.18,
        height * 0.65,
        0,
        width * 0.18,
        height * 0.65,
        width * 0.22
      );
      nebDeepAzure.addColorStop(0, 'rgba(34, 211, 238, 0.26)');
      nebDeepAzure.addColorStop(0.4, 'rgba(37, 99, 235, 0.18)');
      nebDeepAzure.addColorStop(1, 'transparent');
      bCtx.fillStyle = nebDeepAzure;
      bCtx.fillRect(0, 0, width, height);

      // 4. GALAXIA DE ANDRÓMEDA ESPIRAL EN LA DISTANCIA (M31 en azul glacial)
      bCtx.save();
      bCtx.translate(width * 0.82, height * 0.38);
      bCtx.rotate((-25 * Math.PI) / 180);

      // Disco exterior de la galaxia
      const m31Disk = bCtx.createRadialGradient(0, 0, 0, 0, 0, 75);
      m31Disk.addColorStop(0, 'rgba(224, 242, 254, 0.65)');
      m31Disk.addColorStop(0.25, 'rgba(147, 197, 253, 0.42)');
      m31Disk.addColorStop(0.6, 'rgba(59, 130, 246, 0.2)');
      m31Disk.addColorStop(1, 'transparent');
      bCtx.fillStyle = m31Disk;
      bCtx.beginPath();
      bCtx.ellipse(0, 0, 75, 26, 0, 0, Math.PI * 2);
      bCtx.fill();

      // Núcleo supermasivo brillante
      const m31Core = bCtx.createRadialGradient(0, 0, 0, 0, 0, 14);
      m31Core.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      m31Core.addColorStop(0.5, 'rgba(186, 230, 253, 0.7)');
      m31Core.addColorStop(1, 'transparent');
      bCtx.fillStyle = m31Core;
      bCtx.beginPath();
      bCtx.arc(0, 0, 14, 0, Math.PI * 2);
      bCtx.fill();
      bCtx.restore();

      // 5. POLVO ESTELAR DENSO (1,600 micro-estrellas celestes en el lienzo estático)
      const microStarCount = Math.min(1600, Math.floor((width * height) / 1000));
      for (let i = 0; i < microStarCount; i++) {
        // Gran concentración a lo largo de la franja de la Vía Láctea
        const alongBand = Math.random() > 0.35;
        let sx = Math.random() * width;
        let sy = Math.random() * height;

        if (alongBand) {
          const t = Math.random();
          sx = width * t + (Math.random() - 0.5) * (width * 0.42);
          sy = height * (1 - t * 0.85) + (Math.random() - 0.5) * (height * 0.35);
        }

        const sRadius = Math.random() * 0.65 + 0.25;
        const sAlpha = Math.random() * 0.52 + 0.2;
        const color = starColors[Math.floor(Math.random() * starColors.length)];

        bCtx.beginPath();
        bCtx.arc(sx, sy, sRadius, 0, Math.PI * 2);
        bCtx.fillStyle = `rgba(${color}, ${sAlpha})`;
        bCtx.fill();
      }

      // 6. SILUETA DE MONTAÑA REALISTA EN EL HORIZONTE (Perspectiva de observatorio alpino)
      // Resplandor crepuscular cósmico / Luz zodiacal azul zafiro sobre las cumbres
      const mountainGlow = bCtx.createLinearGradient(0, height * 0.78, 0, height);
      mountainGlow.addColorStop(0, 'transparent');
      mountainGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.1)');
      mountainGlow.addColorStop(1, 'rgba(15, 30, 65, 0.35)');
      bCtx.fillStyle = mountainGlow;
      bCtx.fillRect(0, height * 0.75, width, height * 0.25);

      // Cresta de montaña lejana (capa 1)
      bCtx.beginPath();
      bCtx.moveTo(0, height);
      const segs1 = 12;
      const step1 = width / segs1;
      const baseH1 = height * 0.88;
      bCtx.lineTo(0, baseH1);

      const peaks1 = [0.88, 0.85, 0.82, 0.86, 0.83, 0.87, 0.84, 0.81, 0.85, 0.87, 0.83, 0.86, 0.88];
      for (let i = 0; i <= segs1; i++) {
        const px = i * step1;
        const py = height * (peaks1[i] || 0.86);
        bCtx.lineTo(px, py);
      }
      bCtx.lineTo(width, height);
      bCtx.closePath();
      bCtx.fillStyle = 'rgba(8, 16, 36, 0.75)';
      bCtx.fill();

      // Cresta de montaña cercana y afilada (capa 2 en primer plano)
      bCtx.beginPath();
      bCtx.moveTo(0, height);
      const segs2 = 8;
      const step2 = width / segs2;
      const peaks2 = [0.94, 0.91, 0.93, 0.89, 0.92, 0.9, 0.94, 0.91, 0.95];
      bCtx.lineTo(0, height * 0.94);
      for (let i = 0; i <= segs2; i++) {
        const px = i * step2;
        const py = height * (peaks2[i] || 0.92);
        bCtx.lineTo(px, py);
      }
      bCtx.lineTo(width, height);
      bCtx.closePath();
      bCtx.fillStyle = 'rgba(3, 7, 18, 0.98)';
      bCtx.fill();

      // Delicada línea de rim-light (luz estelar cian plateada reflejada en las crestas rocosas)
      bCtx.strokeStyle = 'rgba(186, 230, 253, 0.3)';
      bCtx.lineWidth = 1;
      bCtx.beginPath();
      for (let i = 0; i <= segs2; i++) {
        const px = i * step2;
        const py = height * (peaks2[i] || 0.92);
        if (i === 0) bCtx.moveTo(px, py);
        else bCtx.lineTo(px, py);
      }
      bCtx.stroke();

      // 7. GENERAR ESTRELLAS DINÁMICAS (600 estrellas principales con centelleo y picos de telescopio)
      const dynamicCount = Math.min(650, Math.floor((width * height) / 2200));
      stars = [];

      for (let i = 0; i < dynamicCount; i++) {
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const isDenseBand = Math.random() > 0.4;

        let sx = Math.random() * width;
        let sy = Math.random() * (height * 0.9); // Mantener sobre las montañas

        if (isDenseBand) {
          const t = Math.random();
          sx = width * t + (Math.random() - 0.5) * (width * 0.45);
          sy = height * (1 - t * 0.85) + (Math.random() - 0.5) * (height * 0.35);
          if (sy > height * 0.9) sy = Math.random() * (height * 0.85);
        }

        const isAlpha = Math.random() < 0.055; // Estrellas alfa prominentes con picos de difracción
        const isMedium = Math.random() < 0.28;

        const radius = isAlpha
          ? Math.random() * 1.6 + 1.8
          : isMedium
          ? Math.random() * 0.8 + 0.9
          : Math.random() * 0.5 + 0.35;

        const baseAlpha = isAlpha
          ? Math.random() * 0.25 + 0.75
          : isMedium
          ? Math.random() * 0.3 + 0.5
          : Math.random() * 0.3 + 0.25;

        stars.push({
          x: sx,
          y: sy,
          radius,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: Math.random() * 0.035 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          color,
          hasSpike: isAlpha,
        });
      }
    };

    initSky();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initSky();
    };

    window.addEventListener('resize', handleResize);

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
      shootingStar.y = Math.random() * (height * 0.35);
      shootingStar.length = Math.random() * 110 + 80;
      shootingStar.speed = Math.random() * 16 + 16;
      shootingStar.angle = Math.PI / 4 + (Math.random() * 0.3 - 0.15);
      shootingStar.opacity = 1;
      shootingStar.active = true;
    };

    const meteorInterval = setInterval(() => {
      if (Math.random() > 0.35) {
        triggerShootingStar();
      }
    }, 4500);

    let time = 0;

    // Bucle de animación optimizado a 60 FPS
    const render = () => {
      time += 0.02;

      // 1. Dibujar el fondo estático de la Vía Láctea, nebulosas y montañas
      if (offscreenCanvas) {
        ctx.drawImage(offscreenCanvas, 0, 0);
      } else {
        ctx.fillStyle = '#06040A';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Renderizar estrellas dinámicas centelleantes
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Centelleo armónico de alta fidelidad
        const twinkle = Math.sin(time * s.twinkleSpeed * 50 + s.twinklePhase);
        const currentAlpha = Math.max(0.12, Math.min(1, s.baseAlpha + twinkle * 0.28));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${currentAlpha})`;
        ctx.fill();

        // Picos de difracción de telescopio (Diffraction Spikes) en estrellas Alfa
        if (s.hasSpike && currentAlpha > 0.65) {
          const spikeLen = s.radius * 6.5;
          ctx.strokeStyle = `rgba(${s.color}, ${currentAlpha * 0.4})`;
          ctx.lineWidth = 0.7;

          ctx.beginPath();
          // Cruz principal
          ctx.moveTo(s.x - spikeLen, s.y);
          ctx.lineTo(s.x + spikeLen, s.y);
          ctx.moveTo(s.x, s.y - spikeLen);
          ctx.lineTo(s.x, s.y + spikeLen);
          ctx.stroke();

          // Picos diagonales secundarios más sutiles (óptica de telescopio)
          const diagLen = spikeLen * 0.45;
          ctx.strokeStyle = `rgba(${s.color}, ${currentAlpha * 0.18})`;
          ctx.beginPath();
          ctx.moveTo(s.x - diagLen, s.y - diagLen);
          ctx.lineTo(s.x + diagLen, s.y + diagLen);
          ctx.moveTo(s.x - diagLen, s.y + diagLen);
          ctx.lineTo(s.x + diagLen, s.y - diagLen);
          ctx.stroke();

          // Resplandor aureolar de halo estelar
          const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 3.5);
          halo.addColorStop(0, `rgba(${s.color}, ${currentAlpha * 0.3})`);
          halo.addColorStop(1, 'transparent');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Renderizar estrella fugaz con cola de ionización
      if (shootingStar.active) {
        const endX = shootingStar.x + Math.cos(shootingStar.angle) * shootingStar.length;
        const endY = shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length;

        const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        grad.addColorStop(0.25, `rgba(224, 242, 254, ${shootingStar.opacity * 0.9})`);
        grad.addColorStop(0.65, `rgba(56, 189, 248, ${shootingStar.opacity * 0.4})`);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.9;
        ctx.lineCap = 'round';
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.024;

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
      style={{ opacity: 1 }}
    />
  );
};
