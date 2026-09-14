import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './pages/Home';
import { Lobby } from './pages/Lobby';
import { DoomScroll } from './pages/DoomScroll';
import { LeaderboardPage } from './pages/LeaderboardPage';

import { AuthPage } from './pages/AuthPage';
import { OfflineLobby } from './pages/OfflineLobby';
import { OfflinePlay } from './pages/OfflinePlay';
import { OfflineResults } from './pages/OfflineResults';
import { OnlineLobby } from './pages/OnlineLobby';
import { OnlinePlay } from './pages/OnlinePlay';
import { OnlineResults } from './pages/OnlineResults';
import { AuthGuard } from './components/auth/AuthGuard';
import { useAuthStore } from './store/authStore';
import { ArcadeBackground } from './components/ui/ArcadeBackground';
import { HumorToast } from './components/ui/HumorToast';
import { PageTransitionOverlay } from './components/ui/PageTransitionOverlay';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <PageTransitionOverlay key={`trans-${location.pathname}`} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Home */}
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.35 }}
              >
                <Home />
              </motion.div>
            }
          />



          {/* Authentication */}
          <Route
            path="/auth"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.35 }}
              >
                <AuthPage />
              </motion.div>
            }
          />

          {/* Offline Mode Routes */}
          <Route
            path="/offline/lobby"
            element={
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.35 }}
              >
                <OfflineLobby />
              </motion.div>
            }
          />
          <Route
            path="/offline/play"
            element={
              <motion.div
                className="h-[100dvh] w-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <OfflinePlay />
              </motion.div>
            }
          />
          <Route
            path="/offline/results"
            element={
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.35 }}
              >
                <OfflineResults />
              </motion.div>
            }
          />

          {/* Online Mode Routes (Guarded by AuthGuard) */}
          <Route
            path="/online/lobby"
            element={
              <AuthGuard>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.35 }}
                >
                  <OnlineLobby />
                </motion.div>
              </AuthGuard>
            }
          />
          <Route
            path="/online/play"
            element={
              <AuthGuard>
                <motion.div
                  className="h-[100dvh] w-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <OnlinePlay />
                </motion.div>
              </AuthGuard>
            }
          />
          <Route
            path="/online/results"
            element={
              <AuthGuard>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  <OnlineResults />
                </motion.div>
              </AuthGuard>
            }
          />

          {/* Legacy Solo / Backward Compatibility */}
          <Route
            path="/lobby"
            element={
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.35 }}
              >
                <Lobby />
              </motion.div>
            }
          />
          <Route
            path="/play"
            element={
              <motion.div
                className="h-[100dvh] w-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DoomScroll />
              </motion.div>
            }
          />

          {/* Global & Local Leaderboard */}
          <Route
            path="/leaderboard"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                <LeaderboardPage />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      {/* Clean Gamified Background */}
      <ArcadeBackground />
      {/* Global Humor Notification Toasts */}
      <HumorToast />
      {/* Main App Routes */}
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
