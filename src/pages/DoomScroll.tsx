import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { GameState } from '../types/game';
import { Countdown } from '../games/doom-scroll/Countdown';
import { DoomScrollGame } from '../games/doom-scroll/DoomScrollGame';
import { ResultsScreen } from '../games/doom-scroll/ResultsScreen';
import { PlayerNameModal } from '../components/ui/PlayerNameModal';
import { useNavigate } from 'react-router-dom';

export function DoomScroll() {
  const navigate = useNavigate();
  const { gameState, startGame, currentPlayer, setPlayerName } = useGameStore();
  const [showCountdown, setShowCountdown] = useState(true);
  const [isNameModalOpen, setIsNameModalOpen] = useState(
    !currentPlayer.name || currentPlayer.name.trim().length === 0
  );

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    startGame();
  }, [startGame]);

  const handleNameConfirm = (name: string, avatar: string) => {
    setPlayerName(name, avatar);
    setIsNameModalOpen(false);
  };

  // If user has no name yet, prompt for name before countdown
  if (isNameModalOpen) {
    return (
      <div className="h-[100dvh] bg-[#131f24] flex items-center justify-center p-4">
        <PlayerNameModal
          isOpen={true}
          onClose={() => navigate('/')}
          onConfirm={handleNameConfirm}
          mode="new"
          title="CHOOSE ATHLETE NAME 🏷️"
          buttonText="START COUNTDOWN 🚀"
        />
      </div>
    );
  }

  // If countdown is active
  if (showCountdown && gameState !== GameState.PLAYING && gameState !== GameState.FINISHED) {
    return (
      <AnimatePresence>
        <Countdown onComplete={handleCountdownComplete} />
      </AnimatePresence>
    );
  }

  if (gameState === GameState.FINISHED) {
    return <ResultsScreen />;
  }

  return <DoomScrollGame />;
}
