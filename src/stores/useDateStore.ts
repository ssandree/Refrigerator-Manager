import { create } from "zustand";
import { getKoreaNow, getTodayInKorea } from "../utils/dateUtils";

interface DateStore {
  /** 한국 시간 기준 오늘 날짜 (YYYY-MM-DD) */
  todayISO: string;
  /** 한국 시간 기준 현재 시간 */
  now: Date;
  /** 오늘 날짜 업데이트 */
  updateToday: () => void;
}

/**
 * 한국 시간(UTC+9) 기준 날짜를 전역으로 관리하는 스토어
 * 모든 페이지에서 이 스토어를 구독하여 일관된 날짜 기준을 사용합니다.
 */
export const useDateStore = create<DateStore>((set) => {
  // 초기값 설정
  const koreaNow = getKoreaNow();
  const todayISO = getTodayInKorea();

  // 주기적으로 오늘 날짜 업데이트
  // 자정이 지나면 자동으로 오늘 날짜가 갱신됩니다
  const updateToday = () => {
    const newKoreaNow = getKoreaNow();
    const newTodayISO = getTodayInKorea();
    set({
      now: newKoreaNow,
      todayISO: newTodayISO,
    });
  };

  return {
    now: koreaNow,
    todayISO,
    updateToday,
  };
});
