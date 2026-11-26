import { Automation } from '../../../../domain/entities/Automation';

export interface AutomationCardProps {
  automation: Automation;
  onToggle: () => void;
  onDelete?: () => void;
}
