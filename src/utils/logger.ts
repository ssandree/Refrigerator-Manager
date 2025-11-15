// 로깅 유틸리티 - 프로덕션 환경에서는 로그를 제한할 수 있도록 구성

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
