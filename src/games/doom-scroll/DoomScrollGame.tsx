import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { GameState, GameEventType } from '../../types/game';
import { DoomScrollHUD } from './DoomScrollHUD';
import { SocialFeed } from './SocialFeed';
import { RandomEventOverlay } from './RandomEventOverlay';

export function DoomScrollGame() {
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

  if (gameState !== GameState.PLAYING) return null;

  const totalPlayersCount = Math.max((leaderboardPlayers || []).length, 1);

  return (
    <div className="relative h-[100dvh] bg-[#131f24] overflow-hidden">
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
      />

      {/* Social Feed */}
      <SocialFeed onRandomEvent={handleRandomEvent} />

      {/* Random Event Overlay */}
      <RandomEventOverlay event={currentEvent} onDismiss={handleDismissEvent} />
    </div>
  );
}
