import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { useAppSelector } from '../store';
import { AppIcon } from '../components/atoms/AppIcon';
import {
  HomeScreen,
  RoomsScreen,
  RoomDetailScreen,
  DeviceDetailScreen,
  AutomationsScreen,
  AddAutomationScreen,
  SettingsScreen,
} from '../screens';
import { RootStackParamList, MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const MainTabs: React.FC = () => {
  const theme = useTheme();
  const automations = useAppSelector((state) => state.automations.automations);
  const activeAutomationsCount = automations.filter((a) => a.isActive).length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Rooms') iconName = 'view-grid';
          else if (route.name === 'Automations') iconName = 'lightning-bolt';
          else if (route.name === 'Settings') iconName = 'cog';

          return <AppIcon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Rooms" component={RoomsScreen} options={{ title: 'Rooms' }} />
      <Tab.Screen
        name="Automations"
        component={AutomationsScreen}
        options={{
          title: 'Automations',
          tabBarBadge: activeAutomationsCount > 0 ? activeAutomationsCount : undefined,
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoomDetail"
        component={RoomDetailScreen}
        options={({ route }) => ({ title: route.params.roomName || 'Room' })}
      />
      <Stack.Screen
        name="DeviceDetail"
        component={DeviceDetailScreen}
        options={{ title: 'Device Details' }}
      />
      <Stack.Screen
        name="AddAutomation"
        component={AddAutomationScreen}
        options={{ title: 'New Automation' }}
      />
    </Stack.Navigator>
  );
};
