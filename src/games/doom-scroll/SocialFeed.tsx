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
  const [posts, setPosts] = useState<SocialPostType[]>(() => generateInitialFeed(15));
  const feedRef = useRef<HTMLDivElement>(null);
  const lastScrollPos = useRef(0);
  const scrollAccumulator = useRef(0);
  const rafId = useRef<number>(0);
  const isScrolling = useRef(false);
  const { popups, addPopup } = useScorePopups();

  const {
    gameState,
    addScrollPoints,
    addLikePoints,
    addBonusPoints,
    isPaused,
  } = useGameStore();

  const isPlaying = gameState === GameState.PLAYING && !isPaused;

  // Throttled scroll handler using requestAnimationFrame
  const processScroll = useCallback(() => {
    if (!feedRef.current || !isPlaying) {
      isScrolling.current = false;
      return;
    }

    const currentPos = feedRef.current.scrollTop;
    const scrollDelta = Math.abs(currentPos - lastScrollPos.current);
    lastScrollPos.current = currentPos;

    scrollAccumulator.current += scrollDelta;

    // Award scroll points every 50px of scrolling
    if (scrollAccumulator.current >= 50) {
      const scrollTicks = Math.floor(scrollAccumulator.current / 50);
      for (let i = 0; i < scrollTicks; i++) {
        addScrollPoints();
      }
      scrollAccumulator.current = scrollAccumulator.current % 50;
    }

    // Infinite scroll - load more posts near bottom
    const { scrollHeight, scrollTop, clientHeight } = feedRef.current;
    if (scrollHeight - scrollTop - clientHeight < 500) {
      const newPosts = Array.from({ length: 5 }, () => generatePost());
      setPosts((prev) => [...prev, ...newPosts]);
    }

    isScrolling.current = false;
  }, [isPlaying, addScrollPoints]);

  const handleScroll = useCallback(() => {
    if (!isScrolling.current) {
      isScrolling.current = true;
      rafId.current = requestAnimationFrame(processScroll);
    }
  }, [processScroll]);

  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
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

      // Check for special events
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
    <div className="relative w-full max-w-lg mx-auto pt-[74px] h-[100dvh] flex flex-col">
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto hide-scrollbar gpu-scroll pt-4 pb-20 px-4"
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
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none text-white/50 text-xs font-black tracking-widest bg-black/70 px-3 py-1 rounded-full border border-white/20 select-none">
          ↓ KEEP SCROLLING ↓
        </div>
      )}
    </div>
  );
}
