import { StyleSheet } from 'react-native';
import { AppSpacing } from '../../../../core/constants/AppSpacing';

export const styles = StyleSheet.create({
  card: {
    padding: AppSpacing.md,
    borderRadius: AppSpacing.borderRadius.lg,
    borderWidth: 1,
    marginVertical: AppSpacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: AppSpacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppSpacing.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: AppSpacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devicePreviewRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: AppSpacing.xs,
    flexWrap: 'wrap',
  },
  miniDeviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AppSpacing.borderRadius.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: AppSpacing.sm,
  },
});
