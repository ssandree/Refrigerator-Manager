import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Colors, FontSizes, commonStyles } from '../../styles/common';

export const authStyles = StyleSheet.create({
  // 인증 화면 컨테이너
  container: {
    ...commonStyles.container,
  } as ViewStyle,
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  } as ViewStyle,
  
  // 로고 영역
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  } as ViewStyle,
  logoText: {
    fontSize: FontSizes['4xl'],
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 12,
  } as TextStyle,
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginTop: 4,
  } as TextStyle,
  
  // 폼 영역
  formContainer: {
    width: '100%',
  } as ViewStyle,
  inputContainer: {
    marginBottom: 20,
  } as ViewStyle,
  inputLabel: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  } as TextStyle,
  input: {
    ...commonStyles.input,
  } as TextStyle,
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  } as ViewStyle,
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: FontSizes.lg,
  } as TextStyle,
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  } as ViewStyle,
  
  // 버튼
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  } as ViewStyle,
  loginButtonText: {
    color: Colors.surface,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  } as TextStyle,
  
  // 구분선
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  } as ViewStyle,
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  } as ViewStyle,
  dividerText: {
    marginHorizontal: 16,
    color: Colors.textSecondary,
    fontSize: FontSizes.base,
  } as TextStyle,
  
  // 소셜 로그인 버튼
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: Colors.surface,
  } as ViewStyle,
  socialButtonText: {
    marginLeft: 8,
    fontSize: FontSizes.lg,
    color: Colors.text,
  } as TextStyle,
  
  // 푸터
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  } as ViewStyle,
  footerText: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  } as TextStyle,
  linkText: {
    fontSize: FontSizes.base,
    color: Colors.primary[500],
    fontWeight: '500',
  } as TextStyle,
});
