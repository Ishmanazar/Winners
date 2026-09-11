import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ScorePopupProps {
  points: number;
  x?: number;
  y?: number;
  id: string;
}

export function ScorePopup({ points, x = 0, y = 0, id }: ScorePopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const color =
    points >= 100
      ? 'text-doom-gold'
      : points >= 50
      ? 'text-doom-pink'
      : 'text-doom-green';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={id}
          className={`fixed pointer-events-none z-50 font-display font-bold text-xl ${color}`}
          style={{ left: x, top: y }}
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -60, scale: 1.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          +{points}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Manager component to handle multiple score popups
interface ScorePopupItem {
  id: string;
  points: number;
  x: number;
  y: number;
}

export function useScorePopups() {
  const [popups, setPopups] = useState<ScorePopupItem[]>([]);

  const addPopup = (points: number, x: number, y: number) => {
    const id = `popup-${Date.now()}-${Math.random()}`;
    setPopups((prev) => [...prev, { id, points, x, y }]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 900);
  };

  return { popups, addPopup };
}

export function ScorePopupContainer({ popups }: { popups: ScorePopupItem[] }) {
  return (
    <>
      {popups.map((popup) => (
        <ScorePopup
          key={popup.id}
          id={popup.id}
          points={popup.points}
          x={popup.x}
          y={popup.y}
        />
      ))}
    </>
  );
}
