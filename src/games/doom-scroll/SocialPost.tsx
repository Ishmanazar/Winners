import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Repeat2, Zap, AlertTriangle, Phone } from 'lucide-react';
import { SocialPost as SocialPostType } from '../../types/post';
import { GameEventType } from '../../types/game';

interface SocialPostProps {
  post: SocialPostType;
  onLike: (postId: string, event: React.MouseEvent) => void;
  onInteract: (postId: string) => void;
}

const EVENT_BADGES: Partial<Record<GameEventType, { label: string; color: string; icon: React.ReactNode }>> = {
  VIRAL_POST: { label: '🚀 VIRAL (2X POINTS)', color: 'bg-[#58cc02]/20 text-[#58cc02] border-[#58cc02]/40', icon: <Zap size={12} /> },
  CLICKBAIT: { label: '🎣 CLICKBAIT', color: 'bg-[#ffc800]/20 text-[#ffc800] border-[#ffc800]/40', icon: <AlertTriangle size={12} /> },
  BORING_POST: { label: '😴 BORING POST', color: 'bg-white/10 text-white/50 border-white/10', icon: null },
  INFINITE_LOOP: { label: '🔄 INFINITE LOOP', color: 'bg-[#ce82ff]/20 text-[#ce82ff] border-[#ce82ff]/40', icon: <Repeat2 size={12} /> },
  MOM_CALLING: { label: '📞 MOM CALLING', color: 'bg-[#ff4b4b]/20 text-[#ff4b4b] border-[#ff4b4b]/40', icon: <Phone size={12} /> },
};

export const SocialPost = memo(function SocialPost({ post, onLike, onInteract }: SocialPostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [hearts, setHearts] = useState<{ id: string; x: number; y: number }[]>([]);

  const handleLike = useCallback(
    (e: React.MouseEvent) => {
      if (isLiked) return;
      setIsLiked(true);

      const newHearts = Array.from({ length: 3 }, (_, i) => ({
        id: `heart-${Date.now()}-${i}`,
        x: (Math.random() - 0.5) * 40,
        y: 0,
      }));
      setHearts((prev) => [...prev, ...newHearts]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
      }, 900);

      onLike(post.id, e);
    },
    [isLiked, onLike, post.id]
  );

  const badge = EVENT_BADGES[post.eventType];

  return (
    <article
      className="post-card-contain bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl overflow-hidden mb-4 shadow-md transition-transform duration-150"
      onClick={() => onInteract(post.id)}
    >
      {/* Event badge */}
      {badge && (
        <div
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-black uppercase tracking-wider border-b ${badge.color}`}
        >
          {badge.icon}
          {badge.label}
        </div>
      )}

      {/* Post header */}
      <div className="flex items-center gap-2.5 p-3.5 pb-2">
        <div className="w-10 h-10 rounded-xl bg-[#2b3e4a] flex items-center justify-center text-xl shadow-inner shrink-0 select-none">
          {post.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm text-white truncate">{post.username}</p>
          <p className="text-[11px] text-white/40">{post.timestamp}</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 font-semibold select-none">
          Feed
        </span>
      </div>

      {/* Post Image from src/assets */}
      {post.imageUrl && (
        <div
          className="w-full h-56 sm:h-64 relative overflow-hidden bg-[#131f24] cursor-pointer group select-none"
          onDoubleClick={handleLike}
        >
          <img
            src={post.imageUrl}
            alt="Meme"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2.5 pointer-events-none">
            <span className="text-[10px] font-black uppercase tracking-wider bg-black/80 text-[#ffc800] px-2 py-0.5 rounded-full border border-[#ffc800]/40">
              🔥 DOUBLE TAP TO LIKE
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-3.5 py-2.5">
        <p className="text-sm font-medium leading-relaxed whitespace-pre-line text-white/90 select-none">
          {post.content}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-[#2b3e4a] bg-[#17252d]">
        {/* Like button */}
        <div className="relative">
          <motion.button
            className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer select-none ${
              isLiked ? 'text-[#ff4b4b]' : 'text-white/50 hover:text-[#ff4b4b]'
            }`}
            whileTap={{ scale: 0.85 }}
            onClick={handleLike}
          >
            <Heart size={18} fill={isLiked ? '#ff4b4b' : 'none'} />
            <span className="score-text">{(post.likes + (isLiked ? 1 : 0)).toLocaleString()}</span>
          </motion.button>

          {/* Floating hearts */}
          <AnimatePresence>
            {hearts.map((heart) => (
              <motion.span
                key={heart.id}
                className="absolute -top-2 left-2 text-[#ff4b4b] text-base pointer-events-none select-none"
                initial={{ opacity: 1, y: 0, x: heart.x, scale: 0.5 }}
                animate={{ opacity: 0, y: -35, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                ❤️
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Comment button */}
        <button className="flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-[#1cb0f6] transition-colors cursor-pointer select-none">
          <MessageCircle size={18} />
          <span className="score-text">{post.comments.toLocaleString()}</span>
        </button>

        {/* Share button */}
        <button className="flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-[#58cc02] transition-colors cursor-pointer select-none">
          <Share2 size={18} />
          <span className="score-text">{post.shares.toLocaleString()}</span>
        </button>
      </div>
    </article>
  );
});
