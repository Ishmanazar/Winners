import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  LogIn,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { AppNavbar } from '../components/layout/AppNavbar';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';

const AVATAR_OPTIONS = [
  '😎',
  '😴',
  '🧟‍♀️',
  '🤳',
  '🤡',
  '💀',
  '🫠',
  '🤖',
  '👽',
  '🦊',
  '🐱',
  '🤪',
  '⚡',
  '🔥',
  '👑',
];

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { signIn, signUp, isLoading, clearError } = useAuthStore();
  const { setPlayerName } = useGameStore();

  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('😎');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnUrl = (location.state as { from?: string })?.from || '/online/lobby';

  const handleTabChange = (newTab: 'signin' | 'signup') => {
    setTab(newTab);
    setErrorMsg(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    clearError();

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (tab === 'signup') {
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }

      const cleanUsername = username.trim();
      if (!cleanUsername) {
        setErrorMsg('Please choose an athlete username.');
        return;
      }

      if (cleanUsername.length > 20) {
        setErrorMsg('Username must be 20 characters or fewer.');
        return;
      }

      setIsSubmitting(true);
      const res = await signUp(cleanEmail, password, cleanUsername, selectedAvatar);
      setIsSubmitting(false);

      if (res.success) {
        setPlayerName(cleanUsername, selectedAvatar);
        navigate(returnUrl, { replace: true });
      } else {
        setErrorMsg(res.error || 'Failed to create athlete account. Please try again.');
      }
    } else {
      setIsSubmitting(true);
      const res = await signIn(cleanEmail, password);
      setIsSubmitting(false);

      if (res.success) {
        const currentProfile = useAuthStore.getState().profile;
        if (currentProfile) {
          setPlayerName(currentProfile.username, currentProfile.avatar);
        }
        navigate(returnUrl, { replace: true });
      } else {
        setErrorMsg(res.error || 'Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div className="page-viewport min-h-screen relative bg-[#131f24] text-white flex flex-col selection:bg-[#58cc02] selection:text-black">
      {/* Top Gamified Navbar */}
      <AppNavbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          {/* Back Button to /mode */}
          <div className="w-full flex justify-start mb-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1b2b34] hover:bg-[#233742] border-2 border-[#2b3e4a] hover:border-[#1cb0f6] text-white/70 hover:text-white text-xs font-display font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm active:translate-y-0.5"
            >
              <ArrowLeft size={16} />
              <span>BACK TO HOME</span>
            </button>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Top Glow Accent */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#58cc02]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header / Brand */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#58cc02]/20 border-2 border-[#58cc02]/40 flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
                {tab === 'signup' ? selectedAvatar : '📱'}
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                {tab === 'signup' ? 'NEW ATHLETE REGISTRATION' : 'ATHLETE SIGN IN'}
              </h1>
              <p className="text-white/60 text-xs font-semibold mt-1">
                {tab === 'signup'
                  ? 'Create your athlete persona & join the world leaderboard!'
                  : 'Welcome back! Sign in to continue climbing the ranks.'}
              </p>
            </div>

            {/* Mode Toggle Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-[#131f24] rounded-2xl border-2 border-[#2b3e4a] mb-6 shadow-inner">
              <button
                type="button"
                onClick={() => handleTabChange('signin')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${
                  tab === 'signin'
                    ? 'bg-[#1cb0f6] text-white shadow-md border-b-2 border-[#1899d6]'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border-b-2 border-transparent'
                }`}
              >
                <LogIn size={15} />
                <span>SIGN IN</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('signup')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${
                  tab === 'signup'
                    ? 'bg-[#58cc02] text-white shadow-md border-b-2 border-[#46a302]'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border-b-2 border-transparent'
                }`}
              >
                <UserPlus size={15} />
                <span>SIGN UP</span>
              </button>
            </div>

            {/* Error Message Display */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-2xl bg-[#ff4b4b]/15 border-2 border-[#ff4b4b] text-[#ff4b4b] text-xs font-bold flex items-start gap-2.5 shadow-sm"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#ff4b4b]" />
                <span className="flex-1 leading-snug">{errorMsg}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {tab === 'signup' && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {/* Username Field */}
                    <div>
                      <label className="flex items-center justify-between font-display font-black text-xs uppercase tracking-wider text-white/80 mb-1.5">
                        <span>ATHLETE USERNAME</span>
                        <span className="text-[10px] text-white/40 font-mono">
                          {username.length}/20
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.slice(0, 20))}
                          placeholder="e.g. DoomMaster99"
                          maxLength={20}
                          className="w-full bg-[#131f24] border-2 border-[#2b3e4a] focus:border-[#58cc02] rounded-2xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/30 outline-none transition-colors font-semibold"
                        />
                      </div>
                    </div>

                    {/* Avatar Picker (15 emojis) */}
                    <div>
                      <label className="flex items-center justify-between font-display font-black text-xs uppercase tracking-wider text-white/80 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Sparkles size={12} className="text-[#ffc800]" />
                          CHOOSE YOUR AVATAR
                        </span>
                        <span className="text-[11px] text-[#58cc02] font-black">
                          {selectedAvatar} SELECTED
                        </span>
                      </label>

                      <div className="grid grid-cols-5 gap-2 p-2.5 bg-[#131f24] rounded-2xl border-2 border-[#2b3e4a]">
                        {AVATAR_OPTIONS.map((emoji) => {
                          const isSelected = selectedAvatar === emoji;
                          return (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setSelectedAvatar(emoji)}
                              className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#58cc02]/25 border-2 border-[#58cc02] scale-105 shadow-[0_0_12px_rgba(88,204,2,0.4)]'
                                  : 'bg-[#1b2b34] border border-[#2b3e4a] hover:border-white/40 hover:bg-[#233742]'
                              }`}
                            >
                              <span>{emoji}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div>
                <label className="block font-display font-black text-xs uppercase tracking-wider text-white/80 mb-1.5">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@doomscroll.com"
                    autoComplete="email"
                    className="w-full bg-[#131f24] border-2 border-[#2b3e4a] focus:border-[#1cb0f6] rounded-2xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/30 outline-none transition-colors font-semibold"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="flex items-center justify-between font-display font-black text-xs uppercase tracking-wider text-white/80 mb-1.5">
                  <span>PASSWORD</span>
                  {tab === 'signup' && (
                    <span className="text-[10px] text-white/40">MIN 6 CHARACTERS</span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                    className="w-full bg-[#131f24] border-2 border-[#2b3e4a] focus:border-[#1cb0f6] rounded-2xl pl-10 pr-11 py-3 text-white text-sm placeholder-white/30 outline-none transition-colors font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant={tab === 'signup' ? 'cta' : 'primary'}
                  size="lg"
                  fullWidth
                  disabled={isSubmitting || isLoading}
                  icon={
                    isSubmitting || isLoading ? undefined : tab === 'signup' ? (
                      <UserPlus size={18} />
                    ) : (
                      <LogIn size={18} />
                    )
                  }
                >
                  {isSubmitting || isLoading
                    ? tab === 'signup'
                      ? 'CREATING ATHLETE...'
                      : 'SIGNING IN...'
                    : tab === 'signup'
                    ? 'JOIN THE OLYMPICS 🚀'
                    : 'SIGN IN & PLAY 🎮'}
                </Button>
              </div>
            </form>

            {/* Bottom Footer Switcher */}
            <div className="mt-6 pt-5 border-t border-[#2b3e4a] text-center">
              <p className="text-xs text-white/60 font-semibold">
                {tab === 'signin' ? (
                  <>
                    Don't have an athlete account?{' '}
                    <button
                      type="button"
                      onClick={() => handleTabChange('signup')}
                      className="text-[#58cc02] hover:underline font-bold cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an athlete account?{' '}
                    <button
                      type="button"
                      onClick={() => handleTabChange('signin')}
                      className="text-[#1cb0f6] hover:underline font-bold cursor-pointer"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
