export type AutomationAction = 'turnOn' | 'turnOff' | 'setTemperature';

export interface Automation {
  id: string;
  name: string;
  deviceId: string;
  action: AutomationAction;
  scheduledTime: string; // "HH:mm" (24-hour format)
  isActive: boolean;
  value?: number;        // e.g. target temperature
}
