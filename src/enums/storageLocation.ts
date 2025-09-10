export enum StorageLocation {
  FRIDGE = "FRIDGE",
  FREEZER = "FREEZER",
  ROOM_TEMP = "ROOM_TEMP"
}

export const StorageLocationLabel: Record<StorageLocation, string> = {
  [StorageLocation.FRIDGE]: "냉장고",
  [StorageLocation.FREEZER]: "냉동고",
  [StorageLocation.ROOM_TEMP]: "상온"
};

export const StorageLocationIcon: Record<StorageLocation, string> = {
  [StorageLocation.FRIDGE]: "snow-outline",
  [StorageLocation.FREEZER]: "snow",
  [StorageLocation.ROOM_TEMP]: "thermometer-outline"
};