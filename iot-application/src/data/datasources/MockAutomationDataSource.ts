import { Automation } from '../../domain/entities/Automation';

export const INITIAL_MOCK_AUTOMATIONS: Automation[] = [
  {
    id: 'auto-01',
    name: 'Turn off all lights at 10 PM',
    deviceId: 'light-01',
    action: 'turnOff',
    scheduledTime: '22:00',
    isActive: true,
  },
  {
    id: 'auto-02',
    name: 'Morning warm temperature',
    deviceId: 'thermo-01',
    action: 'setTemperature',
    scheduledTime: '06:30',
    isActive: true,
    value: 25.0,
  },
];
