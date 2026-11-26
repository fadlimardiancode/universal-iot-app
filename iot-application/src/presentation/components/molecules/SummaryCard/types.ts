export interface SummaryCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
  subtitle?: string;
  onPress?: () => void;
}
