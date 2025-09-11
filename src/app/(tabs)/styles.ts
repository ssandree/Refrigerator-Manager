import { StyleSheet } from 'react-native';
import { Colors, FontSizes, commonStyles } from '../../styles/common';

export const tabsStyles = StyleSheet.create({
  // 탭 화면 컨테이너
  container: {
    ...commonStyles.container,
  },
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
  
  // 레시피 카드
  recipeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    ...commonStyles.shadow,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  recipeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  
  // 임박 재료
  expiringContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    ...commonStyles.shadow,
  },
  expiringItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  expiringInfo: {
    flex: 1,
  },
  expiringName: {
    fontSize: FontSizes.lg,
    fontWeight: '500',
    color: Colors.text,
  },
  expiringDate: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  
  // 건강 목표
  goalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    ...commonStyles.shadow,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalLabel: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 4,
  },
  goalText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  
  // 빠른 액션
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    ...commonStyles.shadow,
    minWidth: 80,
  },
  actionText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  
  // 냉장고 관련
  fridgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  fridgeItem: {
    width: '48%',
    marginBottom: 16,
  },
  
  // 레시피 관련
  recipeList: {
    paddingHorizontal: 16,
  },
  recipeItem: {
    marginBottom: 16,
  },
  
  // 내 정보
  profileContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    ...commonStyles.shadow,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statContainer: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
