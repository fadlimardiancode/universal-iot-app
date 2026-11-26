export type ChipStatus = 'on' | 'off' | 'locked' | 'unlocked' | 'online' | 'offline';

export interface StatusChipProps {
  status: ChipStatus;
  label?: string;
  size?: 'sm' | 'md';
}
