import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { GameState, GameEventType } from '../../types/game';
import { DoomScrollHUD } from './DoomScrollHUD';
import { SocialFeed } from './SocialFeed';
import { RandomEventOverlay } from './RandomEventOverlay';

interface DoomScrollGameProps {
  topOffset?: number;
}

export function DoomScrollGame({ topOffset = 0 }: DoomScrollGameProps) {
  const {
    gameState,
    score,
    rank,
    combo,
    timeRemaining,
    gameConfig,
    leaderboardPlayers,
    tick,
    breakCombo,
    setPaused,
  } = useGameStore();

  const [currentEvent, setCurrentEvent] = useState<GameEventType | null>(null);
  const [comboBroken, setComboBroken] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const comboTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Main game timer
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    timerRef.current = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, tick]);

  // Combo decay checker
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    comboTimerRef.current = setInterval(() => {
      const { combo: currentCombo, gameConfig: config } = useGameStore.getState();
      if (
        currentCombo.isActive &&
        Date.now() - currentCombo.lastInteractionTime > config.comboDecayMs
      ) {
        setComboBroken(true);
        breakCombo();
        setTimeout(() => setComboBroken(false), 1000);
      }
    }, 500);

    return () => {
      if (comboTimerRef.current) clearInterval(comboTimerRef.current);
    };
  }, [gameState, breakCombo]);

  // Handle random events
  const handleRandomEvent = useCallback(
    (event: GameEventType) => {
      if (event === 'MOM_CALLING') {
        setPaused(true);
      }
      setCurrentEvent(event);
    },
    [setPaused]
  );

  const handleDismissEvent = useCallback(() => {
    if (currentEvent === 'MOM_CALLING') {
      setPaused(false);
    }
    setCurrentEvent(null);
  }, [currentEvent, setPaused]);

  // Lock document/body scrolling on mobile so only the inner game feed scrolls
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.touchAction = prevBodyTouchAction;
    };
  }, []);

  if (gameState !== GameState.PLAYING) return null;

  const totalPlayersCount = Math.max((leaderboardPlayers || []).length, 1);

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-[#131f24] overflow-hidden select-none">
      {/* HUD */}
      <DoomScrollHUD
        score={score}
        rank={rank}
        comboCount={combo.count}
        comboMultiplier={combo.multiplier}
        comboActive={combo.isActive}
        comboBroken={comboBroken}
        timeRemaining={timeRemaining}
        totalTime={gameConfig.duration}
        totalPlayers={totalPlayersCount}
        topOffset={topOffset}
      />

      {/* Social Feed */}
      <SocialFeed onRandomEvent={handleRandomEvent} topOffset={topOffset} />

      {/* Random Event Overlay */}
      <RandomEventOverlay event={currentEvent} onDismiss={handleDismissEvent} />
    </div>
  );
}
