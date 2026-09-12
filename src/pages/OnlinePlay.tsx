import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { GameState } from '../types/game';
import { Countdown } from '../games/doom-scroll/Countdown';
import { DoomScrollGame } from '../games/doom-scroll/DoomScrollGame';
import { submitGameScore } from '../services/onlineService';

export function OnlinePlay() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading, fetchProfile } = useAuthStore();
  const {
    gameState,
    score,
    totalLikes,
    totalInteractions,
    combo,
    startGame,
    resetGame,
    setGameMode,
    setGameDuration,
  } = useGameStore();

  const [showCountdown, setShowCountdown] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSubmittedRef = useRef(false);
  const maxComboRef = useRef(0);

  // 1. Guard: if not authenticated, redirect to /auth
  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || !user)) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthLoading, isAuthenticated, user, navigate]);

  // Setup game mode and standardized 30s duration on mount
  useEffect(() => {
    setGameMode('online');
    setGameDuration(30);
    hasSubmittedRef.current = false;
    maxComboRef.current = 0;

    // Reset game state if it was left in FINISHED from a prior game
    if (gameState === GameState.FINISHED) {
      resetGame();
    }
  }, []);

  // Track the peak combo reached during the run
  useEffect(() => {
    if (combo.count > maxComboRef.current) {
      maxComboRef.current = combo.count;
    }
  }, [combo.count]);

  // Handle countdown finish -> start DoomScrollGame
  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    startGame();
  }, [startGame]);

  // 3. When game finishes, submit score to Supabase and navigate to /online/results
  useEffect(() => {
    if (gameState === GameState.FINISHED && !hasSubmittedRef.current && user) {
      hasSubmittedRef.current = true;
      setIsSubmitting(true);

      const submit = async () => {
        const payload = {
          player_id: user.id,
          score,
          duration: 30,
          total_likes: totalLikes,
          total_interactions: totalInteractions,
          max_combo: maxComboRef.current || combo.count,
        };

        try {
          await submitGameScore(payload);
          await fetchProfile(user.id);
        } catch (error) {
          console.error('Error submitting online score:', error);
        } finally {
          navigate('/online/results', {
            state: {
              score,
              totalLikes,
              totalInteractions,
            },
            replace: true,
          });
        }
      };

      submit();
    }
  }, [
    gameState,
    user,
    score,
    totalLikes,
    totalInteractions,
    combo.count,
    fetchProfile,
    navigate,
  ]);

  if (isAuthLoading) {
    return (
      <div className="h-[100dvh] bg-[#131f24] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1cb0f6] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/60 text-xs font-bold uppercase tracking-wider">
            Verifying Athlete...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Submitting score loader overlay
  if (isSubmitting) {
    return (
      <div className="h-[100dvh] bg-[#131f24] flex flex-col items-center justify-center p-4 text-white">
        <div className="w-16 h-16 rounded-3xl bg-[#58cc02]/20 border-2 border-[#58cc02] flex items-center justify-center text-3xl mb-4 animate-bounce">
          🚀
        </div>
        <h2 className="font-display font-black text-2xl mb-1 tracking-tight">
          SUBMITTING SCORE...
        </h2>
        <p className="text-white/60 text-xs font-semibold">
          Synchronizing your record to the global leaderboard
        </p>
      </div>
    );
  }

  // Countdown screen
  if (showCountdown && gameState !== GameState.PLAYING && gameState !== GameState.FINISHED) {
    return (
      <AnimatePresence>
        <Countdown onComplete={handleCountdownComplete} />
      </AnimatePresence>
    );
  }

  // Active game
  return <DoomScrollGame />;
}
