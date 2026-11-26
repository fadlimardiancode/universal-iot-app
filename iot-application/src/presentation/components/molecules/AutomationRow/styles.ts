import { StyleSheet } from 'react-native';
import { AppSpacing } from '../../../../core/constants/AppSpacing';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: AppSpacing.md,
    borderRadius: AppSpacing.borderRadius.lg,
    borderWidth: 1,
    marginVertical: AppSpacing.xs,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppSpacing.md,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: AppSpacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppSpacing.sm,
  },
});
