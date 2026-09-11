import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './pages/Home';
import { Lobby } from './pages/Lobby';
import { DoomScroll } from './pages/DoomScroll';
import { LeaderboardPage } from './pages/LeaderboardPage';
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
          <Route
            path="/play"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <DoomScroll />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
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
