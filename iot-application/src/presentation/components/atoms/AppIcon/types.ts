import { StyleProp, TextStyle } from 'react-native';

export interface AppIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}
