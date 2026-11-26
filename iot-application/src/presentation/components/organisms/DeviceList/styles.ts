import { StyleSheet } from 'react-native';
import { AppSpacing } from '../../../../core/constants/AppSpacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    gap: AppSpacing.sm,
    marginBottom: AppSpacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: AppSpacing.borderRadius.round,
    borderWidth: 1,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: AppSpacing.xl,
    gap: AppSpacing.sm,
  },
  footer: {
    marginTop: AppSpacing.md,
    marginBottom: AppSpacing.xl,
  },
});
