import { useCallback } from "react";

/**
 * 배열에서 항목을 추가/제거하는 토글 함수를 생성하는 훅
 *
 * @param setState - 상태를 업데이트하는 setState 함수
 * @returns 토글 함수
 *
 * @example
 * ```tsx
 * const [selectedItems, setSelectedItems] = useState<string[]>([]);
 * const toggleItem = useToggleArray(setSelectedItems);
 *
 * // 사용
 * toggleItem("item1"); // 없으면 추가, 있으면 제거
 * ```
 */
export function useToggleArray<T>(
  setState: React.Dispatch<React.SetStateAction<T[]>>
) {
  return useCallback(
    (item: T) => {
      setState((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    },
    [setState]
  );
}
