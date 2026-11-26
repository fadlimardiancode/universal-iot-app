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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleCol: {
    flex: 1,
    marginRight: AppSpacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: AppSpacing.sm,
  },
  cameraBox: {
    height: 120,
    borderRadius: AppSpacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: AppSpacing.xs,
    position: 'relative',
    overflow: 'hidden',
  },
  cameraBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  thermoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: AppSpacing.xs,
  },
  tempButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  btnSmall: {
    width: 36,
    height: 36,
    borderRadius: AppSpacing.borderRadius.round,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
