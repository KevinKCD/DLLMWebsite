// src/types/index.ts
export interface Person {
  uid: string;
  name?: string;
  avatar?: string;
  [key: string]: any;
}

export interface Event {
  id: string;
  activity?: string;
  event?: string;
  date?: string;
  time?: string;
  location?: string;
  capacity?: number;
  people?: Person[];
  thumbnailUrl?: string | null;
  thumbnail?: string;
  _temp?: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  joined?: string;
  eventsAttended?: number;
  points?: number;
  joinedEvents?: string[];
  role?: 'admin' | 'member';
  admin?: boolean;
}

export interface Member {
  name: string;
  avatar: string;
  points?: number;
  uid: string;
  role?: string;
  admin?: boolean;
}

// types/index.ts
export interface AppEvent {
  // ✅ renamed from Event
  id: string;
  activity?: string;
  event?: string;
  date?: string;
  time?: string;
  location?: string;
  capacity?: number;
  people?: Person[];
  thumbnailUrl?: string | null;
  _temp?: boolean;
}

export interface Video {
  id: string; // ✅ changed from number to string
  name: string;
  sport: string;
  location: string;
  date: string;
  youtubeUrl: string;
  description: string;
  uploadedAt: Date;
}

export type VideoFormValues = Omit<Video, 'id' | 'uploadedAt'>;
