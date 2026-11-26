import { Automation } from '../../../../domain/entities/Automation';

export interface AutomationRowProps {
  automation: Automation;
  deviceName?: string;
  onToggle: () => void;
  onDelete?: () => void;
}
