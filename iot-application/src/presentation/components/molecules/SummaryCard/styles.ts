import { StyleSheet } from 'react-native';
import { AppSpacing } from '../../../../core/constants/AppSpacing';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    padding: AppSpacing.md,
    borderRadius: AppSpacing.borderRadius.lg,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: AppSpacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: AppSpacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
