# 복잡한 로직 분석 및 개선 제안

## 1. UpdateHealthGoal.tsx - 로컬/전역 상태 동기화 로직

### 현재 구조

- **위치**: `app/_pages/UpdateHealthGoal.tsx` (48-73줄)
- **복잡도**: 높음
- **문제점**:
  - 로컬 상태(`localSelectedIds`)와 전역 상태(`selectedGoals`)를 동시에 관리
  - 토글 시점에 전역 상태를 즉시 업데이트하고, 취소 시 스냅샷으로 롤백
  - `previousSelectedGoalsRef`를 사용한 복잡한 상태 추적

### 개선 제안

```typescript
// 제안 1: 로컬 상태만 사용하고 저장 시점에만 전역 상태 업데이트
const [localSelectedIds, setLocalSelectedIds] = useState<number[]>([]);

useEffect(() => {
  // 초기화 시에만 전역 상태에서 로컬 상태로 동기화
  setLocalSelectedIds(selectedGoals.map((goal) => goal.id));
}, []); // 빈 배열로 한 번만 실행

const toggleGoal = useToggleArray(setLocalSelectedIds);

const handleSave = () => {
  const selectedGoalsData = healthGoals.filter((goal) =>
    localSelectedIds.includes(goal.id)
  );
  setSelectedGoals(selectedGoalsData);
  onClose();
};

const handleCancel = () => {
  // 단순히 닫기만 하면 됨 (로컬 상태는 버려짐)
  onClose();
};
```

**장점**:

- 로직이 단순해짐
- 취소 시 롤백 로직 불필요
- 토글 시 전역 상태 업데이트 불필요

---

## 2. Recipe.tsx - 점수 기반 정렬 로직

### 현재 구조

- **위치**: `app/(tabs)/Recipe.tsx` (109-119줄)
- **복잡도**: 중간
- **문제점**:
  - 필터가 없을 때만 점수 기반 정렬 적용
  - 점수 맵을 생성하고 다시 정렬하는 과정이 복잡

### 개선 제안

```typescript
// 제안: 점수 계산을 필터링 전에 수행하고, 필터링 후에도 점수 순서 유지
const scoredRecipes = useMemo(() => {
  if (ingredients.length === 0) return [];
  return getScoredRecipes(ingredients);
}, [ingredients]);

// 필터링된 레시피에 점수 정보 추가
let filteredRecipes = filterRecipes(recipes, filterOptions).map((recipe) => {
  const scored = scoredRecipes.find((r) => r.id === recipe.id);
  return {
    ...recipe,
    score: scored?.score || 0,
  };
});

// 필터가 없을 때는 점수 순으로, 있을 때는 필터 결과 순으로 정렬
if (!activeFilters) {
  filteredRecipes.sort((a, b) => b.score - a.score);
}
```

**장점**:

- 점수 계산을 한 번만 수행 (useMemo 활용)
- 로직이 더 명확해짐
- 필터가 있을 때도 점수 정보 유지 가능

---

## 3. Home.tsx - lastSyncedAt 체크 로직

### 현재 구조

- **위치**: `app/(tabs)/Home.tsx` (21-26줄)
- **복잡도**: 중간
- **문제점**:
  - `useAutoLoadData` 훅을 사용하지 않고 직접 `useEffect` 사용
  - `lastSyncedAt` 체크 로직이 복잡함

### 개선 제안

```typescript
// 제안: useAutoLoadData 훅을 확장하여 lastSyncedAt 체크 지원
// hooks/useAutoLoadData.ts에 추가
export function useAutoLoadDataWithSync<T>(
  data: T[],
  isLoading: boolean,
  loadData: (force?: boolean) => Promise<void>,
  lastSyncedAt?: Date | null
) {
  useEffect(() => {
    if (data.length === 0 && !isLoading && !lastSyncedAt) {
      loadData(false);
    }
  }, [data.length, isLoading, lastSyncedAt, loadData]);
}

// Home.tsx에서 사용
useAutoLoadDataWithSync(meals, isLoading, loadMeals, lastSyncedAt);
```

**또는 더 간단하게**:

```typescript
// useAutoLoadData 훅에 옵션 추가
export function useAutoLoadData<T>(
  data: T[],
  isLoading: boolean,
  loadData: (force?: boolean) => Promise<void>,
  options?: { checkLastSynced?: boolean; lastSyncedAt?: Date | null }
) {
  useEffect(() => {
    const shouldLoad = options?.checkLastSynced ? !options.lastSyncedAt : true;

    if (data.length === 0 && !isLoading && shouldLoad) {
      loadData(false);
    }
  }, [
    data.length,
    isLoading,
    loadData,
    options?.checkLastSynced,
    options?.lastSyncedAt,
  ]);
}
```

**장점**:

- 로직 재사용 가능
- 일관된 데이터 로딩 패턴
- 코드 중복 제거

---

## 4. Fridge.tsx - 필터링 체인

### 현재 구조

- **위치**: `app/(tabs)/Fridge.tsx` (60-86줄)
- **복잡도**: 낮음-중간
- **문제점**:
  - 여러 단계의 필터링이 체인으로 연결됨
  - `currentStorageIngredients` → `filteredIngredients` → `expiringCount`

### 개선 제안

```typescript
// 제안: 필터링 로직을 useMemo로 최적화
const filteredIngredients = useMemo(() => {
  return ingredients.filter((ingredient) => {
    // 보관 위치 필터
    if (
      selectedStorage !== "ALL" &&
      ingredient.storageLocation !== selectedStorage
    ) {
      return false;
    }

    // 카테고리 필터
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(ingredient.category)
    ) {
      return false;
    }

    // 검색어 필터
    if (
      searchQuery &&
      !ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // 임박 재료 필터
    if (showExpiringOnly && !isExpiringSoon(ingredient.expiryDate)) {
      return false;
    }

    return true;
  });
}, [
  ingredients,
  selectedStorage,
  selectedCategories,
  searchQuery,
  showExpiringOnly,
]);

const expiringCount = useMemo(() => {
  return filteredIngredients.filter((ingredient) =>
    isExpiringSoon(ingredient.expiryDate)
  ).length;
}, [filteredIngredients]);
```

**장점**:

- 불필요한 재계산 방지
- 성능 최적화
- 로직이 더 명확해짐

---

## 요약

### 복잡도 순위

1. **UpdateHealthGoal.tsx** - 로컬/전역 상태 동기화 (가장 복잡)
2. **Recipe.tsx** - 점수 기반 정렬 로직
3. **Home.tsx** - lastSyncedAt 체크 로직
4. **Fridge.tsx** - 필터링 체인 (상대적으로 단순)

### 우선순위

1. **높음**: UpdateHealthGoal.tsx 리팩토링 (버그 가능성 높음)
2. **중간**: Recipe.tsx 점수 정렬 로직 개선
3. **낮음**: Home.tsx와 Fridge.tsx 최적화
