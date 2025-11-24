# 냉장고 매니징 프로젝트 코드베이스 가이드

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [아키텍처 패턴](#아키텍처-패턴)
5. [주요 기능](#주요-기능)
6. [데이터 흐름](#데이터-흐름)
7. [개발 가이드](#개발-가이드)
8. [주요 파일 설명](#주요-파일-설명)

---

## 프로젝트 개요

**냉장고 매니징**은 사용자가 냉장고에 보관된 재료를 관리하고, 유통기한을 추적하며, 보유한 재료로 만들 수 있는 레시피를 추천받는 React Native 앱입니다.

### 핵심 기능

- 🥬 **재료 관리**: 냉장고 재료 추가/수정/삭제, 카테고리별 분류
- ⏰ **유통기한 관리**: 임박 재료 알림, 만료 재료 추적
- 🍳 **레시피 추천**: 보유 재료 기반 레시피 추천 및 점수 계산
- 📊 **식단 관리**: 식사 기록 및 영양 정보 추적
- 🎯 **건강 목표**: 사용자 건강 목표 설정 및 달성률 추적
- 📱 **알림**: 유통기한 임박 알림, 레시피 추천 알림

---

## 기술 스택

### 프레임워크 & 라이브러리

- **React Native** (0.81.5) - 크로스 플랫폼 모바일 앱 개발
- **Expo** (~54.0.0) - 개발 도구 및 빌드 시스템
- **Expo Router** (~6.0.14) - 파일 기반 라우팅
- **TypeScript** (5.9.2) - 타입 안정성

### 상태 관리

- **Zustand** (4.5.7) - 경량 상태 관리 라이브러리
- **React Query** (@tanstack/react-query 5.90.5) - 서버 상태 관리

### 폼 관리 & 검증

- **React Hook Form** (7.65.0) - 폼 상태 관리
- **Zod** (3.25.76) - 스키마 검증

### 스타일링

- **NativeWind** (4.2.0) - Tailwind CSS for React Native
- **StyleSheet** - React Native 기본 스타일링

### 기타 주요 라이브러리

- **expo-secure-store** - 보안 토큰 저장
- **react-native-toast-message** - 토스트 알림
- **react-native-gesture-handler** - 제스처 처리 (Swipeable 등)
- **lucide-react-native** - 아이콘
- **dayjs** - 날짜 처리

---

## 프로젝트 구조

```
refrigerator/
├── app/                    # Expo Router 파일 기반 라우팅
│   ├── (auth)/             # 인증 관련 화면
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── (tabs)/             # 메인 탭 네비게이션
│   │   ├── Home.tsx        # 홈 화면
│   │   ├── Fridge.tsx      # 냉장고 화면
│   │   ├── Recipe.tsx      # 레시피 화면
│   │   ├── Meal.tsx        # 식단 화면
│   │   └── MyInfo.tsx      # 내정보 화면
│   ├── _pages/             # 모달/스택 화면
│   │   ├── RecipeDetail.tsx
│   │   ├── RegisterFood.tsx
│   │   ├── RegisterMeal.tsx
│   │   └── ...
│   ├── onboarding/         # 온보딩 화면
│   │   ├── GetSexAge.tsx
│   │   ├── GetBmiActing.tsx
│   │   └── GetHealthGoal.tsx
│   ├── _layout.tsx         # 루트 레이아웃
│   ├── cover.tsx           # 스플래시/커버 화면
│   └── index.tsx            # 진입점
│
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── Buttons.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── FoodCard.tsx
│   │   ├── RecipeCard.tsx
│   │   └── tabs/           # 탭별 컴포넌트
│   │       ├── home/       # 홈 화면 컴포넌트
│   │       │   ├── TodayMeals.tsx
│   │       │   ├── RecipeRecommand.tsx
│   │       │   └── ...
│   │       ├── meal/       # 식단 화면 컴포넌트
│   │       └── ...
│   │
│   ├── services/           # API 서비스 레이어
│   │   ├── api.ts          # API 클라이언트
│   │   ├── authService.ts
│   │   ├── foodService.ts  # 재료 관리 서비스 (fridgeService에서 변경)
│   │   ├── mealService.ts  # 식사 관리 서비스
│   │   ├── recipeService.ts
│   │   ├── recipeService.mock.ts
│   │   └── index.ts        # 서비스 중앙 export
│   │
│   ├── stores/             # Zustand 상태 관리
│   │   ├── useAuthStore.ts
│   │   ├── useFridgeStore.ts
│   │   ├── useRecipeStore.ts
│   │   ├── useMealStore.ts
│   │   ├── useHealthGoalStore.ts
│   │   ├── useFavoriteRecipeStore.ts
│   │   ├── useNutritionStore.ts
│   │   ├── storage.ts      # Secure Storage 설정
│   │   ├── storeUtils.ts   # 스토어 유틸리티
│   │   └── storeCrudHelpers.ts  # CRUD 헬퍼
│   │
│   ├── hooks/              # 커스텀 훅
│   │   ├── useAutoLoadData.ts
│   │   ├── useStoreError.ts
│   │   ├── useStoreWithError.ts
│   │   ├── useToggleArray.ts
│   │   └── useModalAnimation.ts
│   │
│   ├── utils/              # 유틸리티 함수
│   │   ├── logger.ts       # 로깅 유틸리티
│   │   ├── toast.ts        # 토스트 메시지
│   │   ├── storeErrorHandler.ts  # 에러 처리
│   │   ├── recipeFilter.ts      # 레시피 필터링 (클라이언트 사이드)
│   │   └── expiryUtils.ts        # 유통기한 유틸리티
│   │
│   │   # 참고: recipeScoring.ts와 healthGoalCalculator/ 제거됨
│   │   # (백엔드에서 계산 처리)
│   │
│   ├── data/               # Mock 데이터 (개발용)
│   │   ├── mockFood.ts
│   │   ├── mockHealthGoals.ts
│   │   └── mockHealthMetrics.ts
│   │
│   ├── types/              # 전역 타입 정의
│   │   └── recipe.ts
│   │
│   ├── styles/             # 스타일 정의
│   │   ├── colors.ts
│   │   ├── common.ts
│   │   ├── tabs.ts
│   │   └── ...
│   │
│   └── enums/              # 열거형 타입
│       ├── ingredientCategory.ts
│       └── storageLocation.ts
│
├── assets/                 # 이미지, 폰트 등
├── package.json
├── tsconfig.json
└── app.json                # Expo 설정
```

---

## 아키텍처 패턴

### 1. 계층형 아키텍처

프로젝트는 다음과 같은 계층 구조를 따릅니다:

```
┌─────────────────────────────────────┐
│         UI Layer (Components)       │
│  - 화면 컴포넌트 (app/)              │
│  - 재사용 컴포넌트 (src/components/) │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      State Management Layer         │
│  - Zustand Stores (src/stores/)     │
│  - React Query (서버 상태)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Service Layer                │
│  - API Services (src/services/)     │
│  - Mock Services (개발용)            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        API Layer                    │
│  - API Client (src/services/api.ts) │
└─────────────────────────────────────┘
```

### 2. 상태 관리 전략

#### Zustand Store (클라이언트 상태)

- **로컬 상태**: UI 상태, 폼 상태 등
- **전역 상태**: 사용자 정보, 재료 목록, 레시피 목록 등
- **Persist 미들웨어**: 앱 재시작 시 상태 복원

#### React Query (서버 상태)

- 서버 데이터 캐싱
- 자동 리페칭
- 에러 처리 및 재시도

### 3. 서비스 레이어 패턴

**API 서비스와 Mock 서비스 분리**

```typescript
// API 서비스 (프로덕션)
src / services / fridgeService.ts;

// Mock 서비스 (개발용)
src / services / fridgeService.mock.ts;

// 중앙 export (쉽게 전환 가능)
src / services / index.ts;
```

**전환 방법:**

- API 사용: `services/index.ts`에서 기본 export 사용
- Mock 사용: `services/index.ts`에서 주석 처리된 mock import 활성화

### 4. 에러 처리 전략

**통합된 에러 처리 시스템:**

1. **API 레벨**: `api.ts`에서 네트워크 에러 처리
2. **서비스 레벨**: 서비스에서 비즈니스 로직 에러 처리
3. **스토어 레벨**: `storeErrorHandler.ts`로 통합 에러 처리
4. **UI 레벨**: `useStoreError` 훅으로 자동 토스트 표시

### 5. 타입 안정성

- **TypeScript**: 모든 파일에 타입 정의
- **Zod**: 런타임 스키마 검증
- **타입 가드**: `isApiSuccess`, `isHttpError` 등

### 6. 백엔드 중심 아키텍처

**중요한 설계 원칙:**

- **계산 로직은 백엔드에서 처리**: 레시피 점수, 건강 목표 계산 등
- **프론트엔드는 표시에 집중**: 백엔드에서 받은 데이터를 UI에 표시
- **Mock Fallback**: 개발 환경에서 API 실패 시 Mock 데이터 자동 사용
- **타입 일관성**: 백엔드 API 응답과 프론트엔드 타입 정의 일치 유지

---

## 주요 기능

### 1. 재료 관리 (Fridge)

**기능:**

- 재료 추가/수정/삭제
- 카테고리별 필터링 (육류, 채소, 과일 등)
- 보관 위치별 필터링 (냉장고, 냉동고, 상온)
- 검색 기능
- 유통기한 임박 재료 표시

**주요 파일:**

- `app/(tabs)/Fridge.tsx` - 메인 화면
- `src/stores/useFridgeStore.ts` - 상태 관리
- `src/services/fridgeService.ts` - API 호출

### 2. 레시피 추천 (Recipe)

**기능:**

- 보유 재료 기반 레시피 추천
- **백엔드에서 점수 계산 및 정렬** (프론트엔드 계산 로직 제거)
- 필터링 (난이도, 조리 시간, 태그, 열량 범위 등)
- 즐겨찾기 기능
- 검색 기능

**중요:** 레시피 점수 계산은 백엔드에서 처리됩니다. 프론트엔드는 백엔드에서 받은 정렬된 레시피 목록을 그대로 표시합니다.

**주요 파일:**

- `app/(tabs)/Recipe.tsx` - 메인 화면
- `src/stores/useRecipeStore.ts` - 상태 관리
- `src/utils/recipeFilter.ts` - 클라이언트 사이드 필터링 (검색, 난이도, 시간 등)

### 3. 식단 관리 (Meal)

**기능:**

- 식사 기록 (아침, 점심, 저녁, 간식)
- 레시피와 연동
- 영양 정보 추적
- 날짜별 식사 조회

**주요 파일:**

- `app/(tabs)/Meal.tsx` - 메인 화면
- `src/stores/useMealStore.ts` - 상태 관리
- `src/stores/useNutritionStore.ts` - 영양 정보 계산

### 4. 건강 목표 (Health Goals)

**기능:**

- 건강 목표 선택 (최대 3개)
- **백엔드에서 건강 목표 계획 및 달성률 계산** (프론트엔드 계산 로직 제거)
- 목표별 영양 권장량 표시
- 주간 통계

**중요:** 건강 목표 관련 계산(BMR, TDEE, 목표 계획 등)은 백엔드에서 처리됩니다.

**주요 파일:**

- `app/onboarding/GetHealthGoal.tsx` - 온보딩
- `app/_pages/UpdateHealthGoal.tsx` - 수정 화면
- `app/_pages/weeklyAchieve.tsx` - 주간 달성도 화면

### 5. 홈 대시보드 (Home)

**기능:**

- 임박 재료 알림
- **오늘의 식사 목록** (BE API `/meals/date/{date}` 사용)
- 오늘의 레시피 추천
- 오늘의 영양 목표 진행률
- 인사말 (시간대별)

**주요 파일:**

- `app/(tabs)/Home.tsx` - 메인 화면
- `src/components/tabs/home/TodayMeals.tsx` - 오늘의 식사 컴포넌트
- `src/components/tabs/home/` - 기타 홈 컴포넌트들

---

## 데이터 흐름

### 1. 재료 추가 플로우

```
사용자 입력
    ↓
RegisterFood.tsx (UI)
    ↓
useFridgeStore.addFood() (상태 업데이트)
    ↓
foodService.addFood() (API 호출)
    ↓
apiClient.post() (HTTP 요청)
    ↓
백엔드 API
    ↓
응답 처리 및 상태 업데이트
```

**참고:** `ingredients` → `foods`로 네이밍 변경됨

### 2. 레시피 추천 플로우

```
Home.tsx 마운트
    ↓
useFridgeStore.loadFoods() (재료 로드)
    ↓
useRecipeStore.loadRecipes() (레시피 로드)
    ↓
백엔드에서 이미 정렬된 레시피 목록 수신
    ↓
상위 8개 표시 (RecipeRecommand 컴포넌트)
```

**중요:** 레시피 점수 계산 및 정렬은 백엔드에서 처리됩니다.

### 3. 오늘의 식사 조회 플로우

```
Home.tsx 마운트
    ↓
TodayMeals 컴포넌트 렌더링
    ↓
mealService.getMealsByDate(todayDate) (API 호출)
    ↓
백엔드 API: GET /meals/date/{date}
    ↓
식사 유형별(아침/점심/저녁/간식) 분류 및 카드 표시
```

### 4. 인증 플로우

```
앱 시작 (cover.tsx)
    ↓
토큰 확인 (tokenStorage.getToken())
    ↓
토큰 있음 → useAuthStore 복원
    ↓
인증 상태 확인
    ↓
인증됨 → Home 화면
인증 안됨 → 온보딩/로그인
```

**참고:** 인증 레이아웃(`AuthLayout.tsx`)은 `app/(auth)/_layout.tsx`에 통합되었습니다.

---

## 개발 가이드

### 1. 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# 특정 플랫폼 실행
npm run android
npm run ios
npm run web
```

### 2. Mock 데이터 사용

**개발 중 Mock 데이터 Fallback:**

프로젝트는 개발 환경(`__DEV__`)에서 API 호출 실패 시 자동으로 Mock 데이터를 사용합니다.

**스토어별 Mock Fallback:**

- `useRecipeStore`: API 기반(이제 Mock Fallback 없음)
- `useFridgeStore`: API 실패 시 `mockFoods` 사용
- `useMealStore`: 사용자별 데이터이므로 빈 배열 반환

**참고:** `fridgeService` → `foodService`로 네이밍 변경됨

### 3. 새로운 기능 추가 가이드

#### 새로운 스토어 추가

1. `src/stores/useNewStore.ts` 생성
2. Zustand store 정의
3. Persist 미들웨어 설정 (필요시)
4. `storeCrudHelpers` 활용 (CRUD 작업)

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NewState {
  items: Item[];
  addItem: (item: Item) => void;
  // ...
}

export const useNewStore = create<NewState>(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set({ items: [...get().items, item] }),
    }),
    { name: "new-storage" }
  )
);
```

#### 새로운 서비스 추가

1. `src/services/newService.ts` 생성 (API 서비스)
2. `src/services/newService.mock.ts` 생성 (Mock 서비스)
3. `src/services/index.ts`에 export 추가

```typescript
// newService.ts
import apiClient, { ApiResponse } from "./api";

class NewService {
  private readonly basePath = "/new";

  async getAll(): Promise<ApiResponse<Item[]>> {
    return await apiClient.get<Item[]>(this.basePath);
  }
}

export const newService = new NewService();
export default newService;
```

#### 새로운 화면 추가

1. `app/` 디렉토리에 파일 생성
2. Expo Router가 자동으로 라우트 생성
3. 필요시 `_layout.tsx`에서 네비게이션 설정

### 4. 스타일 가이드

**컬러 사용:**

```typescript
import { Colors } from "@/styles/common";

// 사용
<View style={{ backgroundColor: Colors.primary }} />;
```

**공통 스타일:**

```typescript
import { commonStyles } from "@/styles/common";

// 사용
<View style={commonStyles.container} />;
```

**그림자 효과:**

```typescript
import { createShadowStyle } from "@/styles/common";

const shadow = createShadowStyle({
  opacity: 0.15,
  radius: 8,
  elevation: 8,
});
```

### 5. 에러 처리 가이드

**스토어에서 에러 처리:**

```typescript
import { getErrorMessage } from "../utils/storeErrorHandler";

try {
  // 작업 수행
} catch (error) {
  const errorMessage = getErrorMessage(error, "기본 에러 메시지");
  set({ error: errorMessage });
}
```

**컴포넌트에서 에러 표시:**

```typescript
import { useStoreWithError } from "@/hooks/useStoreWithError";

// 자동으로 에러가 토스트로 표시됨
useStoreWithError(useFridgeStore);
```

### 6. 로깅 가이드

**logger 사용:**

```typescript
import { logger } from "@/utils/logger";

logger.info("정보 메시지");
logger.warn("경고 메시지");
logger.error("에러 메시지");
// logger.log는 개발 환경에서만 출력됨
```

**주의:** `console.log` 대신 `logger` 사용

---

## 주요 파일 설명

### 핵심 파일

#### `src/services/api.ts`

- API 클라이언트 싱글톤
- JWT 토큰 관리
- 통합 에러 처리
- 타입 안전한 응답 처리

#### `src/stores/storage.ts`

- Secure Storage 설정
- 웹/모바일 환경 대응
- Zustand persist 미들웨어용

#### `src/utils/storeErrorHandler.ts`

- 통합 에러 처리 유틸리티
- HTTP 에러 타입 정의
- 에러 메시지 추출 함수

#### `src/utils/logger.ts`

- 개발/프로덕션 환경 구분
- 일관된 로깅 인터페이스

### 스토어 파일

#### `useAuthStore.ts`

- 사용자 인증 상태 관리
- 로그인/로그아웃/회원가입
- 사용자 정보 관리

#### `useFridgeStore.ts`

- 재료 목록 관리 (`foods` 배열)
- CRUD 작업 (`addFood`, `updateFood`, `removeFood`)
- 서버 동기화 (`loadFoods`)
- **참고:** `ingredients` → `foods`로 네이밍 변경됨

#### `useRecipeStore.ts`

- 레시피 목록 관리
- 서버 동기화 (`loadRecipes`)
- **참고:** 점수 계산은 백엔드에서 처리되므로 `getScoredRecipes` 메서드 제거됨

#### `useMealStore.ts`

- 식사 기록 관리
- 날짜별 조회
- 레시피 연동

#### `useNutritionStore.ts`

- 영양 정보 계산
- 목표 대비 진행률
- 일일/주간 통계

### 유틸리티 파일

#### `recipeFilter.ts`

- 레시피 필터링 로직 (클라이언트 사이드)
- 다중 필터 조건 지원 (검색어, 재료, 난이도, 조리 시간, 열량 범위)
- **참고:** 점수 계산은 백엔드에서 처리됨

#### `expiryUtils.ts`

- 유통기한 관련 유틸리티
- 임박 여부 계산 (7일 이내)

### 제거된 파일

#### `recipeScoring.ts` (제거됨)

- 레시피 점수 계산은 백엔드에서 처리됩니다.
- 백엔드 API `/recipes/recommend`에서 점수와 함께 반환합니다.

#### `healthGoalCalculator/` (제거됨)

- 건강 목표 계산 로직은 백엔드에서 처리됩니다.
- BMR, TDEE, 목표 계획 등은 백엔드 API를 통해 받아옵니다.

---

## 코드 컨벤션

### 네이밍 규칙

- **컴포넌트**: PascalCase (`FoodCard.tsx`)
- **훅**: camelCase with `use` prefix (`useFridgeStore`)
- **유틸리티 함수**: camelCase (`getErrorMessage`)
- **상수**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **타입/인터페이스**: PascalCase (`ApiResponse`)

### 파일 구조

- **한 파일당 하나의 주요 export**
- **관련 타입은 같은 파일에 정의**
- **긴 파일은 기능별로 분리**

### Import 순서

1. 외부 라이브러리
2. 내부 절대 경로 (`@/...`)
3. 상대 경로 (`../...`)
4. 타입 import (`import type ...`)

### 주석 규칙

- **JSDoc 스타일** 함수 주석
- **TODO 주석 제거** (이슈 트래커 사용)
- **복잡한 로직**은 설명 주석 추가

---

## 테스트 전략

### 현재 상태

- Mock 서비스로 개발 중
- API 연동 준비 완료

### 권장 테스트

1. **단위 테스트**: 유틸리티 함수 (`recipeScoring`, `recipeFilter`)
2. **통합 테스트**: 스토어 액션
3. **E2E 테스트**: 주요 사용자 플로우

---

## 배포 전 체크리스트

- [ ] 모든 Mock 서비스를 API 서비스로 전환
- [ ] 환경 변수 설정 (`EXPO_PUBLIC_API_URL`)
- [ ] 에러 처리 테스트
- [ ] 성능 최적화 확인
- [ ] 보안 검토 (토큰 저장 등)
- [ ] 접근성 확인

---

## 추가 리소스

- **API 명세서**: `API_SPECIFICATION.txt`
- **코드 리뷰 리포트**: `CODE_REVIEW_REPORT.md`
- **복잡한 로직 분석**: `COMPLEX_LOGIC_ANALYSIS.md`

---

## 문의 및 지원

코드베이스에 대한 질문이나 개선 제안이 있으면 팀에 공유해주세요.

---

## 최근 주요 변경사항

### 2025년 1월

- ✅ **백엔드 중심 아키텍처로 전환**
  - 레시피 점수 계산 로직 제거 (백엔드에서 처리)
  - 건강 목표 계산 로직 제거 (백엔드에서 처리)
- ✅ **네이밍 통일**
  - `ingredients` → `foods`로 변경
  - `fridgeService` → `foodService`로 변경
- ✅ **개발 경험 개선**
  - Mock 데이터 자동 Fallback 추가
  - 에러 처리 통일 (`lastSyncedAt` 설정)
- ✅ **컴포넌트 개선**

  - `TodayMeals` 컴포넌트 추가 (오늘의 식사 목록)
  - `AuthLayout` 통합 (`app/(auth)/_layout.tsx`)
  - `GestureHandlerRootView` 추가 (제스처 처리)

- ✅ **코드 품질 개선**
  - `console.log` → `logger` 사용으로 통일
  - 중복 로드 방지 로직 개선

**마지막 업데이트**: 2025-01-XX
