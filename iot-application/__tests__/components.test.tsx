import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { DeviceToggleRow } from '../src/presentation/components/molecules/DeviceToggleRow';
import { SummaryCard } from '../src/presentation/components/molecules/SummaryCard';
import { DeviceCard } from '../src/presentation/components/organisms/DeviceCard';
import { lightTheme } from '../src/core/theme';
import { Device } from '../src/domain/entities/Device';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<PaperProvider theme={lightTheme}>{component}</PaperProvider>);
};

describe('Component Tests (Molecules & Organisms)', () => {
  describe('DeviceToggleRow', () => {
    it('renders device title, type, and fires toggle callback', () => {
      const mockToggle = jest.fn();
      const { getByText } = renderWithTheme(
        <DeviceToggleRow
          name="Living Room Lamp"
          type="light"
          isOn={true}
          status="online"
          onToggle={mockToggle}
        />
      );

      expect(getByText('Living Room Lamp')).toBeTruthy();
      fireEvent.press(getByText('Living Room Lamp'));
    });
  });

  describe('SummaryCard', () => {
    it('renders label, big metric value, and fires onPress', () => {
      const mockPress = jest.fn();
      const { getByText } = renderWithTheme(
        <SummaryCard
          icon="devices"
          label="Active Devices"
          value={6}
          onPress={mockPress}
        />
      );

      expect(getByText('Active Devices')).toBeTruthy();
      expect(getByText('6')).toBeTruthy();
      fireEvent.press(getByText('Active Devices'));
      expect(mockPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('DeviceCard', () => {
    const mockLightDevice: Device = {
      id: 'light-01',
      name: 'Ceiling Chandelier',
      type: 'light',
      roomId: 'room-1',
      isOn: true,
      brightness: 75,
      status: 'online',
    };

    it('renders device card with correct status and device name', () => {
      const mockToggle = jest.fn();
      const mockPress = jest.fn();

      const { getByText } = renderWithTheme(
        <DeviceCard
          device={mockLightDevice}
          onToggle={mockToggle}
          onPress={mockPress}
        />
      );

      expect(getByText('Ceiling Chandelier')).toBeTruthy();
      expect(getByText('ONLINE')).toBeTruthy();
    });

    it('displays thermostat controls when device is thermostat', () => {
      const mockThermoDevice: Device = {
        id: 'thermo-01',
        name: 'Master AC',
        type: 'thermostat',
        roomId: 'room-2',
        isOn: true,
        temperature: 24.5,
        humidity: 58,
        status: 'online',
      };

      const mockAdjustTemp = jest.fn();
      const { getByText } = renderWithTheme(
        <DeviceCard
          device={mockThermoDevice}
          onToggle={jest.fn()}
          onAdjustTemp={mockAdjustTemp}
        />
      );

      expect(getByText('Master AC')).toBeTruthy();
      expect(getByText(/24\.5/)).toBeTruthy();
      expect(getByText(/58/)).toBeTruthy();
    });
  });
});
