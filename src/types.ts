/**
 * TypeScript Types & Interfaces
 * Photobooth Studio React Application
 */

export interface PhotoFilter {
  id: string;
  name: string;
  cssFilter: string;
}

export interface PhotoFrame {
  id: string;
  name: string;
  category: string;
  desc: string;
}

export interface CapturedPhoto {
  id: string;
  imagePath: string; // Base64 data URL
  createdAt: string;
}

export interface PlacedSticker {
  id: string;
  emoji: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  scale: number;
}

export interface SourceFile {
  name: string;
  language: string;
  path: string;
  content: string;
  description: string;
}
