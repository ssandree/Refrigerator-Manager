import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Recipe } from '../data/mockRecipes';

interface FavoriteRecipeContextType {
  favoriteRecipes: Recipe[];
  addToFavorites: (recipe: Recipe) => void;
  removeFromFavorites: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  toggleFavorite: (recipe: Recipe) => void;
}

const FavoriteRecipeContext = createContext<FavoriteRecipeContextType | undefined>(undefined);

interface FavoriteRecipeProviderProps {
  children: ReactNode;
}

export function FavoriteRecipeProvider({ children }: FavoriteRecipeProviderProps) {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  const addToFavorites = (recipe: Recipe) => {
    setFavoriteRecipes(prev => {
      if (prev.find(r => r.id === recipe.id)) {
        return prev; // 이미 존재하면 추가하지 않음
      }
      return [...prev, { ...recipe, isFavorite: true }];
    });
  };

  const removeFromFavorites = (recipeId: string) => {
    setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
  };

  const isFavorite = (recipeId: string) => {
    return favoriteRecipes.some(recipe => recipe.id === recipeId);
  };

  const toggleFavorite = (recipe: Recipe) => {
    if (isFavorite(recipe.id)) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
  };

  const value: FavoriteRecipeContextType = {
    favoriteRecipes,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoriteRecipeContext.Provider value={value}>
      {children}
    </FavoriteRecipeContext.Provider>
  );
}

export function useFavoriteRecipes() {
  const context = useContext(FavoriteRecipeContext);
  if (context === undefined) {
    throw new Error('useFavoriteRecipes must be used within a FavoriteRecipeProvider');
  }
  return context;
}

