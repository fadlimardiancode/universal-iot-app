import { StyleProp, ViewStyle } from 'react-native';

export interface AppBadgeProps {
  content?: string | number;
  size?: number;
  color?: string;
  textColor?: string;
  visible?: boolean;
  style?: StyleProp<ViewStyle>;
}
