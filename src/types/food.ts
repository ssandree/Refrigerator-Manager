import { FoodCategory } from "../enums/ingredientCategory";
import { StorageLocation } from "../enums/storageLocation";

export interface Food {
  id: string;
  userId?: string;
  imageUrl: string | null;
  category: FoodCategory;
  name: string;
  quantity: number | null;
  weight: string | null;
  registeredAt: string;
  purchaseDate: string | null;
  expiryDate: string | null;
  storageLocation: StorageLocation;
  alertBeforeDays: number | null;
  calories_per_gram?: number | null;
  carbohydrates?: number | null;
  protein?: number | null;
  fat?: number | null;
  sodium?: number | null;
  vitamin_c?: number | null;
  vitamin_d?: number | null;
  zinc?: number | null;
}
