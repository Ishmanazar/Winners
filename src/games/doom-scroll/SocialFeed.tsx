import { useCallback, useEffect, useRef, useState } from 'react';
import { SocialPost } from './SocialPost';
import { SocialPost as SocialPostType } from '../../types/post';
import { generatePost, generateInitialFeed } from '../../data/mockPosts';
import { useGameStore } from '../../store/gameStore';
import { GameState, GAME_EVENTS, GameEventType } from '../../types/game';
import { useScorePopups, ScorePopupContainer } from '../../components/ui/ScorePopup';

interface SocialFeedProps {
  onRandomEvent: (event: GameEventType) => void;
}

export function SocialFeed({ onRandomEvent }: SocialFeedProps) {
  // Start with a large initial batch (40 posts) so the user never hits the end immediately
  const [posts, setPosts] = useState<SocialPostType[]>(() => generateInitialFeed(40));
  const feedRef = useRef<HTMLDivElement>(null);
  const lastScrollPos = useRef(0);
  const scrollAccumulator = useRef(0);
  const rafId = useRef<number>(0);
  const isScheduled = useRef(false);
  const isAppending = useRef(false);
  const { popups, addPopup } = useScorePopups();

  const {
    gameState,
    batchScrollPoints,
    addLikePoints,
    addBonusPoints,
    isPaused,
  } = useGameStore();

  const isPlaying = gameState === GameState.PLAYING && !isPaused;

  // Process scroll physics and batched score updates
  const processScroll = useCallback(() => {
    isScheduled.current = false;
    const el = feedRef.current;
    if (!el || !isPlaying) return;

    const currentPos = el.scrollTop;
    const scrollDelta = Math.abs(currentPos - lastScrollPos.current);
    lastScrollPos.current = currentPos;

    if (scrollDelta > 0) {
      scrollAccumulator.current += scrollDelta;

      // Batch scroll points every 40px of scrolling in ONE atomic state update
      const threshold = 40;
      if (scrollAccumulator.current >= threshold) {
        const ticks = Math.floor(scrollAccumulator.current / threshold);
        scrollAccumulator.current = scrollAccumulator.current % threshold;
        batchScrollPoints(ticks, ticks);
      }
    }

    // High lookahead infinite buffer (check 2500px ahead)
    // This ensures content is generated WAY before the user reaches the bottom
    const { scrollHeight, scrollTop, clientHeight } = el;
    const remainingDistance = scrollHeight - scrollTop - clientHeight;

    if (remainingDistance < 2500 && !isAppending.current) {
      isAppending.current = true;
      const batchSize = 25;
      const newPosts = Array.from({ length: batchSize }, () => generatePost());
      setPosts((prev) => [...prev, ...newPosts]);

      // Release lock on next frame
      requestAnimationFrame(() => {
        isAppending.current = false;
      });
    }
  }, [isPlaying, batchScrollPoints]);

  const handleScroll = useCallback(() => {
    if (!isScheduled.current) {
      isScheduled.current = true;
      rafId.current = requestAnimationFrame(processScroll);
    }
  }, [processScroll]);

  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;

    lastScrollPos.current = el.scrollTop;
    el.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      el.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleScroll]);

  // Handle like
  const handleLike = useCallback(
    (postId: string, event: React.MouseEvent) => {
      if (!isPlaying) return;

      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const eventConfig = post.eventType !== 'NORMAL' ? GAME_EVENTS[post.eventType] : null;
      const multiplier = eventConfig?.pointsMultiplier ?? 1;

      if (multiplier > 0) {
        if (multiplier > 1) {
          addBonusPoints(multiplier);
          addPopup(Math.floor(50 * multiplier), event.clientX, event.clientY);
        } else {
          addLikePoints();
          addPopup(50, event.clientX, event.clientY);
        }
      }

      if (post.eventType !== 'NORMAL') {
        onRandomEvent(post.eventType);
      }

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isLiked: true } : p))
      );
    },
    [isPlaying, posts, addLikePoints, addBonusPoints, addPopup, onRandomEvent]
  );

  // Handle post interaction
  const handleInteract = useCallback(
    (postId: string) => {
      if (!isPlaying) return;
      const post = posts.find((p) => p.id === postId);
      if (post?.eventType === 'MOM_CALLING') {
        onRandomEvent('MOM_CALLING');
      }
    },
    [isPlaying, posts, onRandomEvent]
  );

  return (
    <div className="relative w-full max-w-lg mx-auto pt-[68px] h-[100dvh] flex flex-col">
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto hide-scrollbar smooth-feed-scroll pt-3 pb-24 px-3 sm:px-4"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain',
          scrollBehavior: 'auto',
        }}
      >
        {posts.map((post) => (
          <SocialPost
            key={post.id}
            post={post}
            onLike={handleLike}
            onInteract={handleInteract}
          />
        ))}
      </div>

      {/* Score popups */}
      <ScorePopupContainer popups={popups} />

      {/* Scroll indicator */}
      {isPlaying && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-white/70 text-[11px] font-black tracking-widest bg-[#131f24]/90 px-3.5 py-1.5 rounded-full border-2 border-[#2b3e4a] shadow-lg select-none flex items-center gap-1.5 animate-pulse">
          <span className="text-[#58cc02]">↓</span> KEEP SCROLLING <span className="text-[#58cc02]">↓</span>
        </div>
      )}
    </div>
  );
}
