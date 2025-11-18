import { useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";

/**
 * 모달 슬라이드 애니메이션을 관리하는 훅
 *
 * @returns 모달 표시 여부, 애니메이션 값, show/hide 함수
 *
 * @example
 * ```tsx
 * const { visible, slideAnim, showModal, hideModal } = useModalAnimation();
 * ```
 */
export function useModalAnimation() {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;

  const showModal = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  return {
    visible,
    slideAnim,
    showModal,
    hideModal,
  };
}
