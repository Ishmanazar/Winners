import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { useAuthStore } from '../../store/authStore';
import { Trophy, Flame, Zap, Gamepad2, LogOut, LogIn } from 'lucide-react';

export function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, profile, signOut } = useAuthStore();
  const { soloHighScore, currentPlayer, getPlayerBestScore } = useGameStore();

  const playerName = currentPlayer.name?.trim();
  const bestScore =
    isAuthenticated && profile?.best_score
      ? profile.best_score
      : soloHighScore || (playerName ? getPlayerBestScore(playerName) : 0);

  const isPlayActive =
    location.pathname === '/' ||
    location.pathname.startsWith('/offline') ||
    location.pathname.startsWith('/online') ||
    location.pathname === '/lobby' ||
    location.pathname === '/play';
  const isLeaderboardActive = location.pathname === '/leaderboard';

  return (
    <header className="w-full bg-[#131f24]/90 backdrop-blur-md border-b-2 border-[#2b3e4a] sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
            📱
          </span>
          <div className="flex flex-col">
            <span className="font-display font-black text-sm sm:text-lg leading-tight tracking-tight text-white flex items-center gap-1">
              DOOM<span className="text-[#58cc02]">SCROLL</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#1cb0f6]">
              OLYMPICS
            </span>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
              isPlayActive
                ? 'bg-[#58cc02]/20 text-[#58cc02] border-2 border-[#58cc02]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border-2 border-transparent'
            }`}
          >
            <Gamepad2 size={15} />
            <span className="hidden sm:inline">ARENA</span>
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
              isLeaderboardActive
                ? 'bg-[#ffc800]/20 text-[#ffc800] border-2 border-[#ffc800]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border-2 border-transparent'
            }`}
          >
            <Trophy size={15} />
            <span className="hidden sm:inline">LEADERBOARD</span>
          </button>
        </nav>

        {/* Right Gamification Stats & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Best Score Pill */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#1b2b34] border-2 border-[#2b3e4a] text-[#ffc800] text-xs font-display font-black shadow-sm">
            <Zap size={14} className="text-[#ffc800]" />
            <span className="score-text text-white text-xs sm:text-sm">
              {bestScore > 0 ? bestScore.toLocaleString() : '0'}
            </span>
            <span className="text-[10px] text-white/40 hidden sm:inline">XP</span>
          </div>

          {/* Streak / Fire Pill */}
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#1b2b34] border-2 border-[#2b3e4a] text-[#ff9600] text-xs font-display font-black">
            <Flame size={14} className="text-[#ff9600]" />
            <span className="text-white text-xs">5x</span>
          </div>

          {/* Player Profile / Auth Pill */}
          {isAuthenticated && profile ? (
            <div className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-[#1b2b34] border-2 border-[#2b3e4a] text-white select-none"
                title={`Logged in as ${profile.username}`}
              >
                <span className="text-base sm:text-lg">{profile.avatar || '😎'}</span>
                <span className="font-display font-bold text-xs max-w-[80px] truncate hidden sm:inline">
                  {profile.username}
                </span>
              </div>
              <button
                onClick={async () => {
                  await signOut();
                  navigate('/');
                }}
                className="p-1.5 rounded-xl bg-[#ff4b4b]/10 hover:bg-[#ff4b4b]/20 border border-[#ff4b4b]/30 text-[#ff4b4b] transition-all cursor-pointer"
                title="Sign out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth', { state: { from: location.pathname } })}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#58cc02] hover:bg-[#61e002] text-white text-xs font-display font-black uppercase tracking-wider border-b-2 border-[#46a302] cursor-pointer shadow-sm active:translate-y-0.5"
            >
              <LogIn size={13} />
              <span>LOG IN</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
