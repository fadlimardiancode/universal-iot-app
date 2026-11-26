export interface TemperatureControlProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onIncrease: () => void;
  onDecrease: () => void;
}
