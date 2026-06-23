import { Song } from "@/assets/data/songs";
import { create } from "zustand";

interface PlayerStore {
  song: Song | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  currentPageId: string | null;
  setSong: (s: Song | null) => void;
  setIsPlaying: (v: boolean) => void;
  setPosition: (v: number) => void;
  setDuration: (v: number) => void;
  setCurrentPageId: (id: string | null) => void;
}

export const usePlayer = create<PlayerStore>((set) => ({
  song: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  currentPageId: null,
  setSong: (song) => set({ song }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
  setCurrentPageId: (currentPageId) => set({ currentPageId }),
}));
