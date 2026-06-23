import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: number;
}

const KEY = "playlists";

let playlists: Playlist[] = [];
let initialized = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(fn => fn());

export const initPlaylists = async () => {
  if (initialized) return;
  initialized = true;
  try {
    const v = await AsyncStorage.getItem(KEY);
    if (v) {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) playlists = parsed;
    }
  } catch {}
  notify();
};

const save = async () => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(playlists));
  } catch {}
};

export function usePlaylists() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    initPlaylists();
  }, []);

  useEffect(() => {
    const cb = () => forceUpdate(t => t + 1);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);

  const createPlaylist = (name: string): string => {
    const id = `pl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    playlists = [...playlists, { id, name: name.trim(), songIds: [], createdAt: Date.now() }];
    notify();
    save();
    return id;
  };

  const deletePlaylist = (id: string) => {
    playlists = playlists.filter(p => p.id !== id);
    notify();
    save();
  };

  const addSong = (playlistId: string, songId: string) => {
    playlists = playlists.map(p => {
      if (p.id !== playlistId) return p;
      if (p.songIds.includes(songId)) return p;
      return { ...p, songIds: [...p.songIds, songId] };
    });
    notify();
    save();
  };

  const removeSong = (playlistId: string, songId: string) => {
    playlists = playlists.map(p => {
      if (p.id !== playlistId) return p;
      return { ...p, songIds: p.songIds.filter(s => s !== songId) };
    });
    notify();
    save();
  };

  const hasSong = (playlistId: string, songId: string): boolean => {
    const pl = playlists.find(p => p.id === playlistId);
    return pl ? pl.songIds.includes(songId) : false;
  };

  return { playlists, createPlaylist, deletePlaylist, addSong, removeSong, hasSong };
}
