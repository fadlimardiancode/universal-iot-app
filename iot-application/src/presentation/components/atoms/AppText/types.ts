import { TextProps as RNTextProps } from 'react-native';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button';

export interface AppTextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'bold' | '600' | '700';
  children: React.ReactNode;
}
