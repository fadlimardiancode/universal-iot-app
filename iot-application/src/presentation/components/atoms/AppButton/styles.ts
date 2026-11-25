import { StyleSheet } from 'react-native';
import { AppSpacing } from '../../../../core/constants/AppSpacing';

export const styles = StyleSheet.create({
  base: {
    borderRadius: AppSpacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sm: {
    paddingVertical: 6,
    paddingHorizontal: AppSpacing.sm,
  },
  md: {
    paddingVertical: 10,
    paddingHorizontal: AppSpacing.md,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: AppSpacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: '600',
  },
});
