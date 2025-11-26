import { useEffect, useState } from "react";

/**
 * 값을 debounce하는 훅
 * @param value - debounce할 값
 * @param delay - 지연 시간 (ms)
 * @returns debounce된 값
 *
 * @example
 * ```tsx
 * const [searchQuery, setSearchQuery] = useState("");
 * const debouncedQuery = useDebounce(searchQuery, 500);
 *
 * useEffect(() => {
 *   // debouncedQuery가 변경될 때만 API 호출
 *   searchAPI(debouncedQuery);
 * }, [debouncedQuery]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 시간 후에 값 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup: value나 delay가 변경되면 이전 타이머 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
