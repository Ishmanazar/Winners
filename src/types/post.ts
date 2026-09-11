import { GameEventType } from './game';

export interface SocialPost {
  id: string;
  username: string;
  avatar: string;
  content: string;
  imageGradient?: string; // CSS gradient for placeholder images
  imageUrl?: string; // Real asset image URL
  likes: number;
  comments: number;
  shares: number;
  eventType: GameEventType;
  isLiked?: boolean;
  timestamp: string;
}
