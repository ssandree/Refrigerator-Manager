/**
 * 사용처: Fridge.tsx, FoodCard.tsx
 * 역할: 유통기한 7일 이내 확인, 재료 필터링 및 UI 표시
 */

/**
 * 유통기한 임박 확인 함수 (7일 이내)
 * @param expiryDate 유통기한 날짜 (YYYY-MM-DD 형식)
 * @returns 7일 이내면 true, 아니면 false
 */
export function isExpiringSoon(expiryDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(expiryDate);
  date.setHours(0, 0, 0, 0);

  const diff = (date.getTime() - today.getTime()) / (1000 * 3600 * 24);
  return diff <= 7 && diff >= 0;
}
