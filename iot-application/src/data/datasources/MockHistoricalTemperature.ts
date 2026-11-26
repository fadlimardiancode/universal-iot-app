export interface HourlyTemperature {
  hour: string; // e.g. "00:00", "01:00"
  temperature: number; // in Celsius
}

export const MOCK_HISTORICAL_TEMPERATURE: HourlyTemperature[] = [
  { hour: '00:00', temperature: 22.0 },
  { hour: '02:00', temperature: 21.5 },
  { hour: '04:00', temperature: 21.0 },
  { hour: '06:00', temperature: 21.8 },
  { hour: '08:00', temperature: 23.5 },
  { hour: '10:00', temperature: 25.2 },
  { hour: '12:00', temperature: 27.0 },
  { hour: '14:00', temperature: 27.8 },
  { hour: '16:00', temperature: 26.5 },
  { hour: '18:00', temperature: 25.0 },
  { hour: '20:00', temperature: 23.8 },
  { hour: '22:00', temperature: 22.6 },
];
