import { useEffect, useRef, useCallback } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  velocityX: number;
  velocityY: number;
  gravity: number;
  opacity: number;
}

const COLORS = [
  '#7c3aed', '#ec4899', '#3b82f6', '#10b981',
  '#f59e0b', '#ef4444', '#fbbf24', '#a78bfa',
  '#f472b6', '#34d399',
];

interface ConfettiEffectProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
}

export function ConfettiEffect({
  active,
  duration = 3000,
  particleCount = 100,
}: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const startTimeRef = useRef<number>(0);

  const createPieces = useCallback(() => {
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < particleCount; i++) {
      pieces.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        velocityX: (Math.random() - 0.5) * 8,
        velocityY: Math.random() * 3 + 2,
        gravity: 0.1 + Math.random() * 0.05,
        opacity: 1,
      });
    }
    return pieces;
  }, [particleCount]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    piecesRef.current = createPieces();
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      piecesRef.current.forEach((piece) => {
        piece.x += piece.velocityX;
        piece.y += piece.velocityY;
        piece.velocityY += piece.gravity;
        piece.rotation += piece.rotationSpeed;
        piece.opacity = Math.max(0, 1 - elapsed / duration);

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.globalAlpha = piece.opacity;
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6);
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [active, duration, createPieces]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
