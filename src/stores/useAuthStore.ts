// 인증 관련 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import authApi, {
  RegisterRequest,
  User as ServiceUser,
} from "../app/services/authService";

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
  // 로컬 상태만 갱신하는 로그인(실제 API 로그인은 서비스에서 수행)
  login: (user: User) => void;
  // 로그아웃: 유저와 인증 여부를 초기화
  logout: () => void;
  // 사용자 정보 일부만 업데이트
  updateUser: (user: Partial<User>) => void;
  register: (
    payload: RegisterRequest
  ) => Promise<{ success: boolean; message?: string }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user) => {
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updatedUser) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : null,
    }));
  },

  // 회원가입: 서버에 등록 후 토큰 저장 및 로그인 상태로 전환
  register: async (payload) => {
    try {
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
        // 회원가입 성공 시 로그인 상태로 전환
        set({ user: mappedUser, isAuthenticated: true });
        return { success: true };
      }
      return { success: false, message: res.message ?? "Registration failed" };
    } catch (e: any) {
      return { success: false, message: e?.message ?? "Registration error" };
    }
  },
}));
