import { StyleSheet } from 'react-native';
import { Colors, FontSizes, commonStyles } from '../styles/common';

export const appStyles = StyleSheet.create({
  // 앱 전체 레이아웃
  screenContainer: {
    ...commonStyles.container,
  },
  
  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.header,
    borderBottomWidth: 1,
    borderBottomColor: Colors.headerBorder,
  },
  headerTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerIconBtn: {
    padding: 5,
  },
  headerProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  
  // 콘텐츠 영역
  content: {
    flex: 1,
    padding: 16,
  },
  
  // 섹션
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  
  // 탭바
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: FontSizes.sm,
    marginTop: 4,
    color: Colors.textSecondary,
  },
  tabLabelFocused: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export { Colors, FontSizes, commonStyles };

