import { useEffect, useRef } from 'react';

export interface SparkleSettings {
  enabled: boolean;
  particleSize: number;
  speed: number;
  opacity: number;
  brightness: number;
  hueShift: number;
  particleBlur: number;
  color: string;
  secondaryColor: string;
}

interface SparklesCursorProps {
  settings: SparkleSettings;
}

export default function SparklesCursor({ settings }: SparklesCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!settings.enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      hue: number;
    }> = [];

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      for (let i = 0; i < 3; i++) {
        particles.push({
          x: mouseX,
          y: mouseY,
          vx: (Math.random() - 0.5) * settings.speed,
          vy: (Math.random() - 0.5) * settings.speed,
          life: 1,
          hue: Math.random() * 60 + settings.hueShift
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, settings.particleSize * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, ${settings.brightness}%, ${p.life * settings.opacity})`;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [settings]);

  if (!settings.enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1000]"
      style={{ filter: settings.particleBlur > 0 ? `blur(${settings.particleBlur}px)` : 'none' }}
    />
  );
}
