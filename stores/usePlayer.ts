import { Song } from "@/assets/data/songs";
import { create } from "zustand";

interface PlayerStore {
  song: Song | null;
  isPlaying: boolean;
  currentPageId: string | null;
  setSong: (s: Song | null) => void;
  setIsPlaying: (v: boolean) => void;
  setCurrentPageId: (id: string | null) => void;
}

export const usePlayer = create<PlayerStore>((set) => ({
  song: null,
  isPlaying: false,
  currentPageId: null,
  setSong: (song) => set({ song }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentPageId: (currentPageId) => set({ currentPageId }),
}));
