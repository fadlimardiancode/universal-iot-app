import { Automation } from '../../../../domain/entities/Automation';

export interface AutomationTemplateProps {
  automations: Automation[];
  onToggleAutomation: (automation: Automation) => void;
  onDeleteAutomation?: (id: string) => void;
  onAddAutomationPress?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}
