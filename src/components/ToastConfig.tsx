// Toast 메시지 커스텀 설정
import { BaseToast, ErrorToast, InfoToast } from "react-native-toast-message";
import { Colors, FontSizes } from "../styles/common";

export const toastConfig = {
  // 성공 토스트
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.success }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: FontSizes.lg,
        fontWeight: "600",
        color: Colors.textPrimary,
      }}
      text2Style={{
        fontSize: FontSizes.base,
        color: Colors.textSecondary,
      }}
    />
  ),

  // 에러 토스트
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: Colors.error }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: FontSizes.lg,
        fontWeight: "600",
        color: Colors.textPrimary,
      }}
      text2Style={{
        fontSize: FontSizes.base,
        color: Colors.textSecondary,
      }}
    />
  ),

  // 정보 토스트
  info: (props: any) => (
    <InfoToast
      {...props}
      style={{ borderLeftColor: Colors.info }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: FontSizes.lg,
        fontWeight: "600",
        color: Colors.textPrimary,
      }}
      text2Style={{
        fontSize: FontSizes.base,
        color: Colors.textSecondary,
      }}
    />
  ),
};
