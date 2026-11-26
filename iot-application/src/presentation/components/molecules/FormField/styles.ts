import { StyleSheet } from 'react-native';
import { AppSpacing } from '../../../../core/constants/AppSpacing';

export const styles = StyleSheet.create({
  container: {
    marginVertical: AppSpacing.xs,
    width: '100%',
  },
  label: {
    marginBottom: AppSpacing.xs,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: AppSpacing.borderRadius.md,
    paddingHorizontal: AppSpacing.md,
    paddingVertical: 10,
    fontSize: 14,
  },
  error: {
    marginTop: 4,
  },
});
