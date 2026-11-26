import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Rooms: undefined;
  Automations: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  RoomDetail: { roomId: string; roomName: string };
  DeviceDetail: { deviceId: string };
  AddAutomation: undefined;
};
