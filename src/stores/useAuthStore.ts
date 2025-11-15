// 인증 관련 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import authApi, {
  RegisterRequest,
  User as ServiceUser,
} from "../services/authService";
import { logger } from "../utils/logger";
import { createSecureStorage } from "./storage";

// 앱 전반에서 사용할 사용자 모델 (서비스 모델을 매핑해서 사용)
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  sex?: string;
  bmi?: number;
}

// 인증 스토어의 상태와 액션 정의
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  // 로컬 상태만 갱신하는 로그인(실제 API 로그인은 서비스에서 수행)
  login: (user: User) => void;
  // 실제 API를 호출하는 로그인
  loginWithCredentials: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  // 로그아웃: 유저와 인증 여부를 초기화
  logout: () => void;
  // 사용자 정보 일부만 업데이트
  updateUser: (user: Partial<User>) => void;
  register: (
    payload: RegisterRequest
  ) => Promise<{ success: boolean; message?: string }>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,

      login: (user) => {
        // persist 미들웨어가 자동으로 저장
        set({ user, isAuthenticated: true, error: null });
      },

      // 실제 API를 호출하는 로그인
      loginWithCredentials: async (email, password) => {
        try {
          set({ error: null, isLoading: true });
          const res = await authApi.login({ email, password });
          if (res.success && res.data) {
            // 서버 사용자 모델을 앱 사용자 모델에 매핑
            const apiUser = res.data.user as ServiceUser;
            const mappedUser: User = {
              id: apiUser.id,
              name: apiUser.name,
              email: apiUser.email,
              age: apiUser.age,
              sex: apiUser.sex,
              bmi: apiUser.bmi,
            };
            // persist 미들웨어가 자동으로 저장
            set({ user: mappedUser, isAuthenticated: true, error: null });
            return { success: true };
          }
          const errorMessage = res.message ?? "로그인에 실패했습니다.";
          set({ error: errorMessage });
          return { success: false, message: errorMessage };
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "로그인 중 오류가 발생했습니다.";
          set({ error: errorMessage });
          return { success: false, message: errorMessage };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        // 로그아웃 API 호출 (선택적)
        try {
          await authApi.logout();
        } catch (error) {
          // 로그아웃 API 실패해도 로컬 상태는 초기화
          logger.error("로그아웃 API 호출 실패:", error);
        }
        // persist 미들웨어가 자동으로 저장소에서 제거
        set({ user: null, isAuthenticated: false, error: null });
      },

      updateUser: (updatedUser) => {
        set((state) => {
          const newUser = state.user ? { ...state.user, ...updatedUser } : null;
          // persist 미들웨어가 자동으로 저장
          return {
            user: newUser,
            error: null,
          };
        });
      },

      clearError: () => {
        set({ error: null });
      },

      // 회원가입: 서버에 등록 후 토큰 저장 및 로그인 상태로 전환
      register: async (payload) => {
        try {
          set({ error: null, isLoading: true });
          const res = await authApi.register(payload);
          if (res.success && res.data) {
            // 서버 사용자 모델을 앱 사용자 모델에 매핑
            const apiUser = res.data.user as ServiceUser;
            const mappedUser: User = {
              id: apiUser.id,
              name: apiUser.name,
              email: apiUser.email,
              age: apiUser.age,
              sex: apiUser.sex,
              bmi: apiUser.bmi,
            };
            // persist 미들웨어가 자동으로 저장
            set({ user: mappedUser, isAuthenticated: true, error: null });
            return { success: true };
          }
          const errorMessage = res.message ?? "회원가입에 실패했습니다.";
          set({ error: errorMessage });
          return { success: false, message: errorMessage };
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "회원가입 중 오류가 발생했습니다.";
          set({ error: errorMessage });
          return { success: false, message: errorMessage };
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage", // SecureStore에 저장될 키 이름
      storage:
        createSecureStorage<Pick<AuthState, "user" | "isAuthenticated">>(),
      // error와 isLoading은 임시 상태이므로 persist에서 제외
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // 하이드레이션 완료 후 검증
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 데이터 검증: user가 null이거나 유효한 객체인지 확인
          if (state.user !== null) {
            if (
              typeof state.user !== "object" ||
              !state.user.id ||
              !state.user.email ||
              !state.user.name
            ) {
              logger.warn("[AuthStore] Invalid user data, resetting");
              state.user = null;
              state.isAuthenticated = false;
            }
          }
          // user가 null이면 isAuthenticated도 false로 설정
          if (state.user === null && state.isAuthenticated) {
            state.isAuthenticated = false;
          }
        }
      },
    }
  )
);
