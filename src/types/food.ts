import { FoodCategory } from "../enums/ingredientCategory";
import { StorageLocation } from "../enums/storageLocation";

export interface Food {
  id: string;
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
}
