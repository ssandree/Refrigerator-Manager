// 건강 목표 계산 관련 유틸리티 함수들

/**
 * 값을 0과 1 사이로 제한
 */
export const clamp01 = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
};

/**
 * 안전한 나눗셈 (0으로 나누기 방지)
 */
export const safeDivide = (numerator: number, denominator: number): number => {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) {
    return 0;
  }
  if (denominator === 0) {
    return 0;
  }
  return numerator / denominator;
};

/**
 * 칼로리를 그램으로 변환
 */
export const kcalToGrams = (kcal: number, caloriesPerGram: number): number =>
  caloriesPerGram === 0 ? 0 : kcal / caloriesPerGram;

/**
 * 그램을 표시 형식으로 변환
 */
export const gramsToDisplay = (grams: number): string =>
  `${Math.round(grams)}g`;

/**
 * 밀리그램을 표시 형식으로 변환
 */
export const mgToDisplay = (mg: number): string => `${Math.round(mg)}mg`;

/**
 * IU를 표시 형식으로 변환
 */
export const iuToDisplay = (iu: number): string => `${Math.round(iu)}IU`;

/**
 * 그램 범위를 표시 형식으로 변환
 */
export const formatGramRange = (min: number, max: number): string =>
  `${Math.round(min)}~${Math.round(max)}g`;

/**
 * 최대값 이하로 진행률 계산 (낮을수록 좋음)
 */
export const progressAtMost = (
  current: number | undefined,
  target: number
): number | undefined => {
  if (current === undefined) {
    return undefined;
  }
  if (current <= target) {
    return 1;
  }
  return clamp01(safeDivide(target, current));
};

/**
 * 최소값 이상으로 진행률 계산 (높을수록 좋음)
 */
export const progressAtLeast = (
  current: number | undefined,
  target: number
): number | undefined => {
  if (current === undefined) {
    return undefined;
  }
  return clamp01(safeDivide(current, target));
};

/**
 * 범위 내 진행률 계산
 */
export const progressWithinRange = (
  current: number | undefined,
  min: number,
  max: number
): number | undefined => {
  if (current === undefined) {
    return undefined;
  }
  if (current >= min && current <= max) {
    return 1;
  }
  if (current < min) {
    return clamp01(safeDivide(current, min));
  }
  return clamp01(safeDivide(max, current));
};

/**
 * 진행률 값들의 평균 계산
 */
export const averageProgress = (values: (number | undefined)[]): number => {
  const filtered = values.filter(
    (value): value is number => value !== undefined
  );
  if (filtered.length === 0) {
    return 0;
  }
  const sum = filtered.reduce((acc, value) => acc + value, 0);
  return clamp01(sum / filtered.length);
};
