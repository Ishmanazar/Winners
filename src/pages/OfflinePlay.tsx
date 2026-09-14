import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { GameState } from '../types/game';
import { Countdown } from '../games/doom-scroll/Countdown';
import { DoomScrollGame } from '../games/doom-scroll/DoomScrollGame';
import { ConfettiEffect } from '../components/ui/ConfettiEffect';
import { Button } from '../components/ui/Button';
import { Trophy, Play, Zap, CheckCircle2, RotateCcw, Home, Sparkles } from 'lucide-react';

interface RoundResult {
  playerName: string;
  avatar: string;
  playerNumber: number;
  score: number;
  hasMore: boolean;
}

export function OfflinePlay() {
  const navigate = useNavigate();
  const {
    gameState,
    score,
    currentPlayer,
    currentOfflinePlayerIndex,
    offlinePlayers,
    offlineSubMode,
    soloHighScore,
    startGame,
    nextOfflinePlayer,
    setSoloHighScore,
    resetGame,
  } = useGameStore();

  const [showCountdown, setShowCountdown] = useState(true);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  // Solo-specific states
  const [soloFinished, setSoloFinished] = useState(false);
  const [soloScore, setSoloScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const hasEndedRef = useRef(false);
  const isSingle = offlineSubMode === 'single';

  // If no offline players configured, redirect
  const hasPlayers = offlinePlayers.length > 0;

  // Track finished game and capture score
  useEffect(() => {
    if (gameState === GameState.FINISHED && !hasEndedRef.current) {
      hasEndedRef.current = true;

      if (isSingle) {
        // Solo mode: check high score and show result
        const finalScore = score;
        const newRecord = finalScore > soloHighScore;
        if (newRecord) {
          setSoloHighScore(finalScore);
        }
        setSoloScore(finalScore);
        setIsNewRecord(newRecord);
        setSoloFinished(true);
        if (newRecord) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      } else {
        // Team mode: existing pass-and-play logic
        const capturedScore = score;
        const playerNum = currentOfflinePlayerIndex + 1;
        const finishedPlayer = offlinePlayers[currentOfflinePlayerIndex] || currentPlayer;
        const finishedName = finishedPlayer.name || `Player ${playerNum}`;
        const finishedAvatar = finishedPlayer.avatar || '😎';

        const hasMore = nextOfflinePlayer();

        setRoundResult({
          playerName: finishedName,
          avatar: finishedAvatar,
          playerNumber: playerNum,
          score: capturedScore,
          hasMore,
        });
      }
    }
  }, [
    gameState,
    score,
    isSingle,
    soloHighScore,
    currentOfflinePlayerIndex,
    offlinePlayers,
    currentPlayer,
    nextOfflinePlayer,
    setSoloHighScore,
  ]);

  // Animate solo score count-up
  useEffect(() => {
    if (!soloFinished) return;
    const duration = 1400;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(eased * soloScore));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [soloFinished, soloScore]);

  const handleCountdownComplete = useCallback(() => {
    startGame();
    setShowCountdown(false);
  }, [startGame]);

  const handleNextPlayer = () => {
    hasEndedRef.current = false;
    setRoundResult(null);
    setShowCountdown(true);
  };

  const handleSeeFinalResults = () => {
    navigate('/offline/results');
  };

  const handleSoloPlayAgain = () => {
    hasEndedRef.current = false;
    setSoloFinished(false);
    setSoloScore(0);
    setIsNewRecord(false);
    setAnimatedScore(0);
    resetGame();
    setShowCountdown(true);
  };

  const handleSoloHome = () => {
    resetGame();
    navigate('/');
  };

  const handleSoloLobby = () => {
    resetGame();
    navigate('/offline/lobby');
  };

  if (!hasPlayers) {
    return (
      <div className="h-[100dvh] bg-[#131f24] flex items-center justify-center p-4 text-white">
        <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-6 text-center max-w-sm w-full shadow-2xl">
          <span className="text-4xl mb-3 block">⚠️</span>
          <h2 className="font-display font-black text-xl mb-2">NO PLAYERS CONFIGURED</h2>
          <p className="text-xs text-white/60 mb-5">
            Please set up the game in the offline lobby before starting.
          </p>
          <Button
            variant="cta"
            size="md"
            fullWidth
            onClick={() => navigate('/offline/lobby')}
          >
            GO TO LOBBY 🎮
          </Button>
        </div>
      </div>
    );
  }

  // Lock document/body scrolling on mobile
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

  // ──── SOLO FINISHED SCREEN ────
  if (isSingle && soloFinished) {
    const prevBest = isNewRecord ? soloHighScore : soloHighScore; // soloHighScore is already updated
    return (
      <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-[#131f24] flex flex-col items-center justify-center text-white p-4">
        <ConfettiEffect active={showConfetti} particleCount={150} duration={5000} />

        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
        >
          {/* Background glow for new record */}
          {isNewRecord && (
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-[#ffc800]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          )}

          <div className="relative z-10">
            {/* Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest mb-4 ${
              isNewRecord
                ? 'bg-[#ffc800]/20 border border-[#ffc800]/40 text-[#ffc800]'
                : 'bg-[#58cc02]/20 border border-[#58cc02]/40 text-[#58cc02]'
            }`}>
              <CheckCircle2 size={13} />
              {isNewRecord ? '🎉 NEW RECORD!' : 'SOLO COMPLETE'}
            </div>

            {/* Trophy / Medal */}
            <motion.div
              className="text-5xl mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: isNewRecord ? [0, -10, 10, -5, 5, 0] : 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              {isNewRecord ? '👑' : '🏅'}
            </motion.div>

            {/* Athlete Name & Avatar */}
            {currentPlayer.name && (
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="text-xl">{currentPlayer.avatar || '😎'}</span>
                <span className="font-display font-black text-sm text-white/90">
                  {currentPlayer.name}
                </span>
              </div>
            )}

            {/* Animated Score */}
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">
              YOUR SCORE
            </p>
            <motion.h2
              className="score-text text-4xl sm:text-5xl font-black text-white mb-1"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {animatedScore.toLocaleString()}{' '}
              <span className="text-lg text-[#ffc800]">PTS</span>
            </motion.h2>

            {/* New Record Celebration */}
            {isNewRecord ? (
              <motion.div
                className="p-3 rounded-2xl bg-[#ffc800]/15 border-2 border-[#ffc800] mb-4 mt-3"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <div className="flex items-center justify-center gap-2 text-[#ffc800] font-black text-sm">
                  <Sparkles size={18} className="animate-pulse" />
                  <span>NEW PERSONAL BEST!</span>
                  <Sparkles size={18} className="animate-pulse" />
                </div>
                <p className="text-xs text-white/60 mt-1">
                  You crushed your previous record!
                </p>
              </motion.div>
            ) : (
              <div className="p-2.5 rounded-2xl bg-[#131f24] border border-[#2b3e4a] mb-4 mt-3">
                <p className="text-xs text-white/60 font-semibold">
                  Personal Best:{' '}
                  <span className="text-[#ffc800] font-black">
                    {soloHighScore.toLocaleString()} PTS
                  </span>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                variant="cta"
                size="lg"
                fullWidth
                onClick={handleSoloPlayAgain}
                icon={<RotateCcw size={18} />}
                className="py-3.5"
              >
                PLAY AGAIN 🚀
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={handleSoloLobby}
                  icon={<Trophy size={15} />}
                >
                  LOBBY
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={handleSoloHome}
                  icon={<Home size={15} />}
                >
                  HOME
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ──── TEAM MODE: Active player info for top banner ────
  const displayPlayerNumber = roundResult
    ? roundResult.playerNumber
    : currentOfflinePlayerIndex + 1;

  const displayPlayerName = roundResult
    ? roundResult.playerName
    : offlinePlayers[currentOfflinePlayerIndex]?.name ||
      currentPlayer.name ||
      `Player ${displayPlayerNumber}`;

  const displayPlayerAvatar = roundResult
    ? roundResult.avatar
    : offlinePlayers[currentOfflinePlayerIndex]?.avatar ||
      currentPlayer.avatar ||
      '😎';

  // Name of the upcoming player when hasMore is true
  const nextPlayer = offlinePlayers[currentOfflinePlayerIndex];

  return (
    <div className="offline-play-wrapper fixed inset-0 h-[100dvh] w-full overflow-hidden bg-[#131f24] flex flex-col text-white select-none">
      {/* Top Banner: Only show for team mode */}
      {!isSingle && (
        <div className="fixed top-0 left-0 right-0 h-[42px] z-[70] bg-[#1b2b34] border-b-2 border-[#2b3e4a] px-3 sm:px-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded-full bg-[#1cb0f6]/20 border border-[#1cb0f6]/40 text-[#1cb0f6] text-[10px] font-black uppercase tracking-wider shrink-0">
              PASS &amp; PLAY
            </span>
            <span className="font-display font-black text-xs sm:text-sm text-white tracking-wide truncate">
              PLAYER {displayPlayerNumber}&apos;s TURN: <span className="text-[#ffc800]">{displayPlayerName}</span> {displayPlayerAvatar}
            </span>
          </div>

          <div className="text-[11px] font-black text-white/60 bg-[#131f24] px-2 py-0.5 rounded-lg border border-[#2b3e4a] shrink-0">
            {displayPlayerNumber} / {offlinePlayers.length}
          </div>
        </div>
      )}

      {/* Flow Stage 2: Countdown */}
      {showCountdown && (
        <Countdown onComplete={handleCountdownComplete} />
      )}

      {/* Flow Stage 3: Mount DoomScrollGame when countdown completes */}
      {!showCountdown && !roundResult && !soloFinished && (
        <DoomScrollGame topOffset={isSingle ? 0 : 42} />
      )}

      {/* Flow Stage 4: Mini Results Card when round finishes (team mode) */}
      <AnimatePresence>
        {roundResult && (
          <div className="fixed inset-0 z-[80] bg-[#131f24]/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#58cc02]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Round Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58cc02]/20 border border-[#58cc02]/40 text-[#58cc02] text-[11px] font-black uppercase tracking-widest mb-4">
                  <CheckCircle2 size={13} /> ROUND {roundResult.playerNumber} COMPLETE
                </div>

                {/* Player Avatar & Name */}
                <div className="w-20 h-20 mx-auto rounded-2xl bg-[#131f24] border-2 border-[#ffc800]/50 flex items-center justify-center text-4xl shadow-inner mb-3">
                  {roundResult.avatar}
                </div>
                <h2 className="font-display font-black text-2xl text-white tracking-tight mb-0.5">
                  {roundResult.playerName}
                </h2>
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">
                  Athlete #{roundResult.playerNumber}
                </p>

                {/* Captured Score Box */}
                <div className="bg-[#131f24] border-2 border-[#ffc800]/40 rounded-2xl p-4 mb-6 shadow-inner">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#ffc800] flex items-center justify-center gap-1 mb-1">
                    <Zap size={13} className="text-[#ffc800]" /> ROUND SCORE
                  </span>
                  <span className="score-text text-3xl sm:text-4xl font-black text-[#ffc800] tracking-tight">
                    {roundResult.score.toLocaleString()}{' '}
                    <span className="text-lg font-bold text-white/60">PTS</span>
                  </span>
                </div>

                {/* Action Buttons */}
                {roundResult.hasMore ? (
                  <div className="space-y-2.5">
                    <Button
                      variant="cta"
                      size="xl"
                      fullWidth
                      onClick={handleNextPlayer}
                      icon={<Play size={18} />}
                      className="py-4 text-base font-black"
                    >
                      NEXT PLAYER 🚀
                    </Button>
                    {nextPlayer && (
                      <p className="text-xs text-white/60 font-semibold">
                        Pass device to{' '}
                        <span className="text-[#1cb0f6] font-bold">
                          {nextPlayer.name} {nextPlayer.avatar}
                        </span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <Button
                      variant="arcade"
                      size="xl"
                      fullWidth
                      onClick={handleSeeFinalResults}
                      icon={<Trophy size={18} />}
                      className="py-4 text-base font-black"
                    >
                      SEE FINAL RESULTS 🏆
                    </Button>
                    <p className="text-xs text-white/60 font-semibold">
                      All athletes have finished their runs!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
