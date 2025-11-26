/**
 * 사용처: 모든 컴포넌트
 * 역할: 개발 환경에서만 로그를 출력
 */

const isDevelopment = __DEV__;

/**
 * 개발 환경에서만 로그를 출력하는 헬퍼
 */
export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // 에러는 항상 로그 (프로덕션에서도 모니터링 필요)
    console.error(...args);
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
};
