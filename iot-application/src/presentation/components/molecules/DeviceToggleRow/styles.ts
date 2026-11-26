import { StyleSheet } from 'react-native';
import { AppSpacing } from '../../../../core/constants/AppSpacing';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: AppSpacing.sm,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppSpacing.sm,
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: AppSpacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
