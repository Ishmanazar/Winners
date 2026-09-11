import { SocialPost } from '../types/post';
import { GameEventType } from '../types/game';

// Import the 4 assets directly from src/assets
import heroAsset from '../assets/D3B681FC-B4C5-4A5C-B448-79D47166542E.PNG';
import addictAsset from '../assets/IMG_5531.PNG';
import cardioAsset from '../assets/IMG_5532.PNG';
import marathonAsset from '../assets/IMG_5533.PNG';

/**
 * The 4 asset images from src/assets — looped across ALL posts in the doom scroll feed.
 */
export const ASSET_IMAGES: string[] = [
  addictAsset,    // 3AM addict / phone zombie
  cardioAsset,    // Thumb cardio athlete
  marathonAsset,  // Social marathon runner
  heroAsset,      // Doom scroll hero banner
];

const USERNAMES = [
  'doom_scroller_69',
  'infinite.feed',
  'scroll_til_dawn',
  'just_5_more_min',
  'phone.zombie',
  'attention_span_0',
  'bed_rotting_king',
  'no_sleep_gang',
  'algorithm.victim',
  'screen_time_pro',
  'touch.grass.never',
  'doomscroll.therapy',
  'midnight_browser',
  'one_more_video',
  'notification.junkie',
];

const AVATARS = ['😴', '🤳', '📱', '🧟', '👀', '🤡', '💀', '🫠', '🤖', '👽', '🦊', '🐱', '🎭', '🌚', '🤪'];

const NORMAL_POSTS: string[] = [
  "I opened my phone to check one notification. That was 3 hours ago.",
  "POV: It's 2AM and you suddenly become interested in how elevators work.",
  "Bro said he was going to sleep 3 hours ago. His screen time says otherwise.",
  "This post has absolutely no value. Yet here you are, still reading.",
  "Me: I should go to sleep.\nAlso me: Let me just check one more post.\n*4 hours later*",
  "Day 47 of doom scrolling: I've forgotten what grass looks like.",
  "My screen time report sent me a formal apology letter.",
  "I've been scrolling so long I've seen this meme twice and I still don't know what day it is.",
  "My thumb has developed muscles specifically for doom scrolling.",
  "I just scrolled past this post, panicked, and scrolled back up. Help.",
  "Are you still scrolling? At this hour? In this economy? Respect.",
  "This is your sign to put your phone down. Just kidding, keep scrolling.",
  "My WiFi cut out and I stared at the wall for 3 seconds before having an existential crisis.",
  "Hot take: sleeping is just dark mode for your body.",
  "I don't have insomnia, I have an algorithm that knows exactly what I want to see at 3AM.",
  "My phone battery is at 2% but I'm still scrolling because I'm built different.",
  "Normalize admitting that you've been on your phone for 6 hours straight.",
  "Breaking: Local person discovers time travel by opening social media for 'just a minute'.",
  "Tell me you're a doom scroller without telling me you're a doom scroller: *opens app during loading screen of another app*",
  "I started scrolling in 2024. I think it's 2026 now? Hard to tell.",
  "The scroll never ends. And neither does my lack of productivity.",
  "Plot twist: The real treasure was the hours we wasted along the way.",
  "Me: I need to be productive today.\nMy phone: *notification*\nMe: Well, maybe tomorrow.",
  "Studies show that 99% of people reading this are in bed right now pretending they'll sleep soon.",
  "If doom scrolling was an Olympic sport, I'd have 47 gold medals.",
  "POV: You're reading this at 3AM with one eye open and the brightness all the way down.",
  "Just did 45 minutes of cardio. My thumb is exhausted.",
  "My therapist said to find a hobby. So I scroll professionally now.",
  "This post specifically was designed to waste 4 seconds of your life. You're welcome.",
  "I was today years old when I realized I've been scrolling for today years.",
];

const TIMESTAMPS = [
  '2m ago', '5m ago', '8m ago', '12m ago', '15m ago',
  '23m ago', '34m ago', '45m ago', '1h ago', '2h ago',
  '3h ago', '5h ago', 'Yesterday', 'Just now', '1m ago',
];

let postIdCounter = 0;

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomEventType(): GameEventType {
  const roll = Math.random();
  if (roll < 0.05) return 'VIRAL_POST';
  if (roll < 0.10) return 'CLICKBAIT';
  if (roll < 0.14) return 'BORING_POST';
  if (roll < 0.17) return 'INFINITE_LOOP';
  if (roll < 0.19) return 'MOM_CALLING';
  return 'NORMAL';
}

export function generatePost(forceEvent?: GameEventType, indexHint?: number): SocialPost {
  postIdCounter++;
  const eventType = forceEvent || getRandomEventType();

  // Loop through asset images from src/assets for every post
  const imageIndex = (postIdCounter + (indexHint ?? 0)) % ASSET_IMAGES.length;
  const imageUrl = ASSET_IMAGES[imageIndex];

  let content: string;
  if (eventType === 'VIRAL_POST') {
    content = "🚀🚀🚀 THIS POST IS GOING VIRAL! Everyone is sharing this! Like for DOUBLE POINTS! 🚀🚀🚀";
  } else if (eventType === 'CLICKBAIT') {
    content = "🎣 You WON'T BELIEVE what happens when you like this post... (doctors HATE this trick)";
  } else if (eventType === 'BORING_POST') {
    content = "I had cereal for breakfast today. It was okay. The milk was cold. That's all. Goodbye.";
  } else if (eventType === 'INFINITE_LOOP') {
    content = "🔄 INFINITE LOOP DETECTED! You can't stop reading this. Seriously. Why are you still here? Keep scrolling for TRIPLE POINTS!";
  } else if (eventType === 'MOM_CALLING') {
    content = "📞 INCOMING CALL: Mom 📞\n\n\"Are you still on your phone?\"\n\n*frantically switches to calculator app*";
  } else {
    content = randomFrom(NORMAL_POSTS);
  }

  return {
    id: `post-${postIdCounter}`,
    username: randomFrom(USERNAMES),
    avatar: randomFrom(AVATARS),
    content,
    imageUrl,
    likes: Math.floor(Math.random() * 50000) + 500,
    comments: Math.floor(Math.random() * 5000) + 42,
    shares: Math.floor(Math.random() * 2000) + 12,
    eventType,
    isLiked: false,
    timestamp: randomFrom(TIMESTAMPS),
  };
}

export function generateInitialFeed(count: number = 20): SocialPost[] {
  return Array.from({ length: count }, (_, i) => generatePost(undefined, i));
}
