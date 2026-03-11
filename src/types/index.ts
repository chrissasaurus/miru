// Media Types
export type MediaType = 'movie' | 'series';

// Base Media interface
export interface Media {
 id: string;
 type: MediaType;
 title: string;
 description?: string;
 releaseDate?: string;
 poster?: string;
 backdrop?: string;
 createdAt: Date;
 updatedAt: Date;
 source: 'tmdb';
}

// Movie variant
export interface Movie extends Media {
  type: 'movie';
  duration?: number; // in minutes
}

// Series variant
export interface Series extends Media {
  type: 'series';
  seasons: Season[];
}

export interface Season {
  id: string;
  seasonNumber: number;
  title?: string;
  description?: string;
  releaseDate?: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title?: string;
  description?: string;
  releaseDate?: string;
  duration?: number; // in minutes
}

// Library Types
export interface Library {
  id: string;
  items: LibraryItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LibraryItem {
  id: string;
  mediaId: string;
  status: LibraryItemStatus;
  critiqueMode: boolean;
  rating?: Rating;
  calculatedRating?: number;
  addedAt: Date;
  watchedAt?: Date;
  completedAt?: Date;
}

export type LibraryItemStatus = 
  | 'backlog'
  | 'watching'
  | 'watched';

// Watchlist Types
export interface Watchlist {
  id: string;
  name: string;
  description?: string;
  items: WatchlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WatchlistItem {
  id: string;
  libraryItemId: string;
  addedAt: Date;
  notes?: string;
}

// Review Types
export interface TitleReview {
  id: string;
  mediaId: string;
  userId: string;
  title: string;
  content: string;
  spoilerWarning: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EpisodeReview {
  id: string;
  seriesId: string
  episodeId: string;
  userId: string;
  title: string;
  content: string;
  spoilerWarning: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Rating Types
export interface Rating {
  id: string;
  mediaId: string;
  userId: string;
  score: number; // 1-10
  createdAt: Date;
  updatedAt: Date;
}

export interface EpisodeRating {
  id: string;
  episodeId: string;
  userId: string;
  score: number; // 1-10
  createdAt: Date;
  updatedAt: Date;
}

// Taste Profile (Client-side only)
export interface TasteProfileSummary {
  onboardingCompleted: boolean;
  hasEnoughSignals: boolean;
  lastUpdated: Date;
}
