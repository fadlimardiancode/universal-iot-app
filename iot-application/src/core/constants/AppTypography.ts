import { TextStyle } from 'react-native';

export const AppTypography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  } as TextStyle,
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  } as TextStyle,
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  } as TextStyle,
  subtitle1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,
  subtitle2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  } as TextStyle,
  body1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,
  body2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } as TextStyle,
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  } as TextStyle,
} as const;
