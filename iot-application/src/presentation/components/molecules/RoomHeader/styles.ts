import { StyleSheet } from 'react-native';
import { AppSpacing } from '../../../../core/constants/AppSpacing';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: AppSpacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppSpacing.sm,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: AppSpacing.xs,
  },
});
