import { StyleSheet } from 'react-native';
import { AppSpacing } from '../../../../core/constants/AppSpacing';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: AppSpacing.sm,
    borderRadius: AppSpacing.borderRadius.md,
  },
  valueDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: AppSpacing.md,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: AppSpacing.borderRadius.round,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
