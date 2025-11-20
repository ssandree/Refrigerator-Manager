# 리팩토링 가이드 - 헷갈릴 만한 코드 및 개선 사항

## 🔴 높은 우선순위 (즉시 개선 권장)

### 1. 타입 안정성 문제: `as any` 사용 다수

**문제:**

- 8곳에서 `as any` 타입 캐스팅 사용
- 타입 안정성 저하 및 런타임 에러 가능성

**위치:**

- `src/services/fridgeService.mock.ts` (179줄)
- `src/components/tabs/home/ExpiringIngredientCard.tsx` (31줄)
- `src/services/favoriteRecipeService.mock.ts` (58줄)
- `src/components/onboarding/HealthGoalSelector.tsx` (65줄)
- `app/(tabs)/Meal.tsx` (103줄)
- `src/components/tabs/home/Greeting.tsx` (19줄)
- `src/stores/storage.ts` (137줄)
- `src/components/tabs/myinfo/GoalsSection.tsx` (47줄)

**개선 방안:**

```typescript
// ❌ 나쁜 예
router.push({ pathname: "/(tabs)/Recipe", params: { q: name } } as any);

// ✅ 좋은 예
router.push({
  pathname: "/(tabs)/Recipe" as any,
  params: { q: name },
});

// 또는 expo-router의 타입 정의 개선 필요
```

**권장 조치:**

- Expo Router 타입 정의 확인 및 개선
- 필요한 경우 커스텀 타입 가드 함수 생성
- `as any` 대신 정확한 타입 정의

---

### 2. 개발 환경 분기 로직 중복

**문제:**

- `useRecipeStore`와 `useFridgeStore`에 동일한 `__DEV__` 체크 로직 반복
- 코드 중복 및 유지보수 어려움
- 프로덕션 배포 시 실수 가능성

**위치:**

- `src/stores/useRecipeStore.ts` (118, 134줄)
- `src/stores/useFridgeStore.ts` (130, 146줄)

**현재 코드:**

```typescript
// 개발 환경: API 실패 시 mock 데이터 사용 (BE 연결 전까지)
if (__DEV__ && state.recipes.length === 0) {
  set({
    recipes: mockRecipes,
    error: null,
    lastSyncedAt: Date.now(),
  });
}
```

**개선 방안:**

**옵션 1: 공통 헬퍼 함수 생성**

```typescript
// src/stores/storeUtils.ts에 추가
export function handleDevFallback<T>(
  data: T[],
  mockData: T[],
  setData: (data: T[]) => void,
  setError: (error: string | null) => void
): boolean {
  if (__DEV__ && data.length === 0) {
    setData(mockData);
    setError(null);
    return true; // fallback 사용됨
  }
  return false; // fallback 사용 안됨
}

// 사용
if (response.success && response.data) {
  // 성공 처리
} else {
  const usedFallback = handleDevFallback(
    state.recipes,
    mockRecipes,
    (recipes) => set({ recipes, error: null, lastSyncedAt: Date.now() }),
    (error) => set({ error })
  );
  if (!usedFallback) {
    set({ error: response.message ?? "..." });
  }
}
```

**옵션 2: 환경 변수로 제어**

```typescript
// .env 또는 설정 파일
const USE_MOCK_FALLBACK = process.env.EXPO_PUBLIC_USE_MOCK_FALLBACK === "true";

// 사용
if (USE_MOCK_FALLBACK && state.recipes.length === 0) {
  // mock 데이터 사용
}
```

**권장 조치:**

- 공통 헬퍼 함수로 추출하여 중복 제거
- 환경 변수로 제어 가능하도록 개선
- 프로덕션 빌드에서 자동으로 제거되도록 설정

---

### 3. RecipeRecommand 컴포넌트: 점수 계산 로직 누락

**문제:**

- `RecipeRecommand.tsx`에서 단순히 `slice(0, 8)`만 사용
- 점수 기반 정렬이 없어 추천 기능이 제대로 작동하지 않음
- `useRecipeStore`에 `getScoredRecipes` 메서드가 있는지 확인 필요

**위치:**

- `src/components/tabs/home/RecipeRecommand.tsx` (33-46줄)

**현재 코드:**

```typescript
const data = useMemo<RecipeCardData[]>(() => {
  if (recipes.length === 0) {
    return [];
  }
  return recipes.slice(0, 8).map((recipe: Recipe) => ({
    // ...
  }));
}, [recipes]);
```

**개선 방안:**

```typescript
// useRecipeStore에 getScoredRecipes 메서드 추가 필요
const { recipes, getScoredRecipes } = useRecipeStore();
const ingredients = useFridgeStore((s) => s.ingredients);

const data = useMemo<RecipeCardData[]>(() => {
  if (recipes.length === 0) {
    return [];
  }

  // 재료가 있으면 점수 기반으로 정렬
  if (ingredients.length > 0) {
    const scoredRecipes = getScoredRecipes(ingredients);
    return scoredRecipes.slice(0, 8).map((recipe) => ({
      // ...
      owned: `${recipe.scoreDetails.matchedCount}/${recipe.scoreDetails.totalRequired} 재료 보유`,
    }));
  }

  // 재료가 없으면 기본 순서대로
  return recipes.slice(0, 8).map((recipe) => ({
    // ...
  }));
}, [recipes, ingredients, getScoredRecipes]);
```

**권장 조치:**

- `useRecipeStore`에 `getScoredRecipes` 메서드 추가
- 점수 계산 로직 통합
- 재료가 있을 때와 없을 때 다른 UI 표시

---

## 🟡 중간 우선순위

### 4. 하드코딩된 값들 (매직 넘버)

**문제:**

- 여러 곳에서 하드코딩된 숫자 사용
- 의미 파악 어려움 및 유지보수 어려움

**위치:**

- `src/components/tabs/home/RecipeRecommand.tsx`: `slice(0, 8)`, `0.85`, `280`
- `src/stores/useRecipeStore.ts`: `5 * 60 * 1000` (5분)
- `src/stores/useFridgeStore.ts`: `5 * 60 * 1000` (5분)
- `src/stores/useMealStore.ts`: `5 * 60 * 1000` (5분)
- `src/hooks/useAutoLoadData.ts`: `5 * 60 * 1000` (5분)

**개선 방안:**

```typescript
// src/constants/app.ts 생성
export const APP_CONSTANTS = {
  // 레시피 추천
  RECIPE_RECOMMENDATION_LIMIT: 8,
  RECIPE_CARD_WIDTH_RATIO: 0.85,
  RECIPE_CARD_HEIGHT: 280,

  // 동기화
  SYNC_VALID_DURATION_MS: 5 * 60 * 1000, // 5분

  // 필터링
  DEFAULT_CALORIE_RANGE: [0, 1000] as const,

  // 건강 목표
  MAX_HEALTH_GOALS: 3,
} as const;
```

**권장 조치:**

- 상수 파일 생성 및 중앙 관리
- 모든 매직 넘버를 상수로 교체

---

### 5. 일관성 없는 에러 처리

**문제:**

- 일부 스토어는 에러 시 `lastSyncedAt` 설정, 일부는 설정 안 함
- 재시도 로직이 일관되지 않음

**위치:**

- `useRecipeStore.ts`: 에러 시 `lastSyncedAt` 설정 (128, 147줄)
- `useFridgeStore.ts`: 에러 시 `lastSyncedAt` 설정 (140, 157줄)
- `useMealStore.ts`: 에러 시 `lastSyncedAt` 설정 (131, 141줄)

**현재 상태:**

- 모든 스토어가 에러 시에도 `lastSyncedAt`을 설정하여 재시도 방지
- 이는 의도된 동작이지만, 문서화 필요

**권장 조치:**

- 에러 처리 전략 문서화
- 필요시 에러 타입별로 다른 처리 (네트워크 에러 vs 비즈니스 로직 에러)

---

### 6. Recipe.tsx: 점수 계산 로직 복잡도

**문제:**

- `Recipe.tsx`에서 필터가 없을 때만 점수 기반 정렬 적용
- 점수 계산 로직이 명확하지 않음

**위치:**

- `app/(tabs)/Recipe.tsx`

**개선 방안:**

```typescript
// 점수 계산을 별도 useMemo로 분리
const scoredRecipes = useMemo(() => {
  if (ingredients.length === 0) return [];
  return getScoredRecipes(ingredients);
}, [ingredients, getScoredRecipes]);

// 필터링된 레시피에 점수 정보 추가
const filteredRecipes = useMemo(() => {
  const filtered = filterRecipes(recipes, filterOptions);

  // 점수 정보 추가
  return filtered.map((recipe) => {
    const scored = scoredRecipes.find((r) => r.id === recipe.id);
    return {
      ...recipe,
      score: scored?.score || 0,
    };
  });
}, [recipes, filterOptions, scoredRecipes]);

// 필터가 없을 때는 점수 순으로 정렬
const sortedRecipes = useMemo(() => {
  if (!hasActiveFilters(filterOptions)) {
    return [...filteredRecipes].sort((a, b) => b.score - a.score);
  }
  return filteredRecipes;
}, [filteredRecipes, filterOptions]);
```

**권장 조치:**

- 점수 계산 로직을 명확하게 분리
- 필터 유무와 관계없이 점수 정보 유지

---

## 🟢 낮은 우선순위 (개선 권장)

### 7. 중복된 필터링 로직

**문제:**

- `Fridge.tsx`에서 여러 단계의 필터링이 체인으로 연결됨
- `useMemo`로 최적화되어 있지만 로직이 복잡함

**위치:**

- `app/(tabs)/Fridge.tsx` (63-97줄)

**현재 상태:**

- 이미 `useMemo`로 최적화되어 있음
- 로직은 명확하지만 함수로 추출 가능

**개선 방안:**

```typescript
// src/utils/ingredientFilter.ts 생성
export function filterIngredients(
  ingredients: Ingredient[],
  filters: {
    storage?: StorageLocation | "ALL";
    categories?: IngredientCategory[];
    searchQuery?: string;
    showExpiringOnly?: boolean;
  }
): Ingredient[] {
  return ingredients.filter((ingredient) => {
    // 보관 위치 필터
    if (
      filters.storage &&
      filters.storage !== "ALL" &&
      ingredient.storageLocation !== filters.storage
    ) {
      return false;
    }

    // 카테고리 필터
    if (
      filters.categories &&
      filters.categories.length > 0 &&
      !filters.categories.includes(ingredient.category)
    ) {
      return false;
    }

    // 검색어 필터
    if (
      filters.searchQuery &&
      !ingredient.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }

    // 임박 재료 필터
    if (filters.showExpiringOnly && !isExpiringSoon(ingredient.expiryDate)) {
      return false;
    }

    return true;
  });
}
```

**권장 조치:**

- 필터링 로직을 유틸리티 함수로 추출
- 테스트 가능하도록 분리

---

### 8. 이미지 경로 하드코딩

**문제:**

- 모든 레시피/재료가 동일한 이미지 경로 사용
- `require("../../../assets/images/tomato.jpg")` 하드코딩

**위치:**

- `src/components/tabs/home/RecipeRecommand.tsx` (116줄)
- `src/data/mockFood.ts` (모든 항목)

**개선 방안:**

```typescript
// src/utils/imageUtils.ts
export function getRecipeImage(imageUrl?: string) {
  if (imageUrl && imageUrl.startsWith("http")) {
    return { uri: imageUrl };
  }
  // 기본 이미지
  return require("../../assets/images/default-recipe.jpg");
}
```

---

### 9. 타입 정의 중복 가능성

**문제:**

- `Ingredient`, `Recipe` 타입이 `data/mockFood.ts`, `data/mockRecipes.ts`에 정의
- 다른 곳에서도 동일한 타입이 정의되어 있을 가능성

**개선 방안:**

```typescript
// src/types/ingredient.ts
export interface Ingredient {
  // ...
}

// src/types/recipe.ts
export interface Recipe {
  // ...
}

// data/mockFood.ts
import { Ingredient } from "../types/ingredient";
export { Ingredient };
export const mockIngredients: Ingredient[] = [...];
```

---

## 📊 우선순위 요약

### 즉시 개선 (높은 우선순위)

1. ✅ 타입 안정성 문제 (`as any` 제거)
2. ✅ 개발 환경 분기 로직 중복 제거
3. ✅ RecipeRecommand 점수 계산 로직 추가

### 단기 개선 (중간 우선순위)

4. ✅ 하드코딩된 값들을 상수로 분리
5. ✅ 에러 처리 전략 문서화
6. ✅ Recipe.tsx 점수 계산 로직 개선

### 장기 개선 (낮은 우선순위)

7. ✅ 필터링 로직 유틸리티 함수로 추출
8. ✅ 이미지 경로 처리 개선
9. ✅ 타입 정의 중앙화

---

## 🔍 추가 발견 사항

### 10. useAutoLoadData 훅의 hasLoadedRef 로직

**문제:**

- `hasLoadedRef`가 로딩 완료 시에만 true로 설정됨
- 데이터가 실제로 로드되었는지 확인하지 않음

**위치:**

- `src/hooks/useAutoLoadData.ts` (43-50줄)

**개선 방안:**

```typescript
// 데이터가 실제로 로드되었는지 확인
useEffect(() => {
  if (!isLoading && data.length > 0) {
    hasLoadedRef.current = true;
  }
}, [isLoading, data.length]);
```

---

### 11. 스토어의 load 함수 중복 패턴

**문제:**

- 모든 스토어의 `load` 함수가 유사한 패턴 반복
- 5분 체크 로직이 각 스토어에 중복

**개선 방안:**

```typescript
// src/stores/storeLoadHelpers.ts
export function createLoadFunction<T>(
  serviceMethod: () => Promise<ApiResponse<T[]>>,
  setData: (data: T[]) => void,
  setError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void,
  getState: () => { data: T[]; lastSyncedAt: number | null },
  mockData?: T[]
) {
  return async (force: boolean = false) => {
    const state = getState();

    // 5분 체크
    if (!force && state.data.length > 0 && state.lastSyncedAt) {
      const timeSinceSync = Date.now() - state.lastSyncedAt;
      if (timeSinceSync < 5 * 60 * 1000) {
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await serviceMethod();

      if (response.success && response.data) {
        setData(response.data);
      } else {
        // 에러 처리
      }
    } catch (error) {
      // 에러 처리
    } finally {
      setIsLoading(false);
    }
  };
}
```

---

## 📝 권장 조치 순서

1. **1주일 이내**

   - 타입 안정성 문제 해결 (`as any` 제거)
   - 개발 환경 분기 로직 공통화
   - RecipeRecommand 점수 계산 로직 추가

2. **1개월 이내**

   - 하드코딩된 값들을 상수로 분리
   - 에러 처리 전략 문서화
   - Recipe.tsx 점수 계산 로직 개선

3. **2-3개월 이내**
   - 필터링 로직 유틸리티 함수로 추출
   - 이미지 경로 처리 개선
   - 타입 정의 중앙화
   - 스토어 load 함수 공통화

---

**리포트 생성일:** 2025-01-XX
**분석 범위:** 전체 코드베이스
