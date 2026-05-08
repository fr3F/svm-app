// src/stores/useFavorites.ts → VERSION PARFAITE (2025+)

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// Source unique de vérité
let favorites: string[] = [];

// Écouteurs pour mise à jour instantanée
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(fn => fn());

// Fonction publique pour forcer la synchronisation depuis le stockage
// → À appeler dans l'onglet Favoris avec useFocusEffect
export const refreshFavorites = async () => {
    try {
        const value = await AsyncStorage.getItem("favorites");
        if (value !== null) {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                favorites = parsed;
                notify(); // met à jour toute l’app immédiatement
            }
        }
    } catch (error) {
        console.warn("Erreur lors du refresh des favoris", error);
    }
};

// Hook principal
export function useFavorites() {
    const [, forceUpdate] = useState(0);

    // Chargement initial au démarrage de l’app (une seule fois)
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const value = await AsyncStorage.getItem("favorites");
                if (value !== null) {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) {
                        favorites = parsed;
                    }
                }
            } catch (error) {
                console.warn("Erreur chargement favoris", error);
                favorites = [];
            } finally {
                notify(); // force le render des composants déjà montés
            }
        };

        loadFavorites();
    }, []);

    // S'abonner aux changements
    useEffect(() => {
        const callback = () => forceUpdate(t => t + 1);
        listeners.add(callback);
        return () => { listeners.delete(callback); };
    }, []);

    const toggle = async (id: string) => {
        if (!id) return;

        if (favorites.includes(id)) {
            favorites = favorites.filter(x => x !== id);
        } else {
            favorites = [...favorites, id];
        }

        notify(); // mise à jour instantanée partout

        try {
            await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
        } catch (error) {
            console.warn("Erreur sauvegarde favoris", error);
        }
    };

    const isFavorite = (id: string): boolean => favorites.includes(id);

    return {
        list: favorites,        // toujours un vrai tableau
        toggle,
        isFavorite,
        refresh: refreshFavorites, // optionnel, si tu veux l’appeler manuellement ailleurs
    };
}