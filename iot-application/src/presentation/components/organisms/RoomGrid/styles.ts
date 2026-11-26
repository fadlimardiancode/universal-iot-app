import { StyleSheet } from 'react-native';
import { AppSpacing } from '../../../../core/constants/AppSpacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppSpacing.sm,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: AppSpacing.xl,
    gap: AppSpacing.sm,
  },
});
