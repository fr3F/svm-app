import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const MAX = 10;
const KEY = "song_history";

let history: string[] = [];
let initialized = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(fn => fn());

export const initHistory = async () => {
  if (initialized) return;
  initialized = true;
  try {
    const v = await AsyncStorage.getItem(KEY);
    if (v) {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) history = parsed;
    }
  } catch {}
  notify();
};

export const addToHistory = async (id: string) => {
  if (!id) return;
  history = [id, ...history.filter(x => x !== id)].slice(0, MAX);
  notify();
  try { await AsyncStorage.setItem(KEY, JSON.stringify(history)); } catch {}
};

export function useHistory() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    initHistory();
  }, []);

  useEffect(() => {
    const cb = () => forceUpdate(t => t + 1);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);

  return { list: history };
}
