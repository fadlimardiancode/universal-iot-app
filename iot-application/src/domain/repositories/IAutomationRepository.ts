import { Automation } from '../entities/Automation';

export interface IAutomationRepository {
  getAutomations(): Promise<Automation[]>;
  addAutomation(automation: Automation): Promise<Automation>;
  toggleAutomation(id: string): Promise<Automation | null>;
  deleteAutomation(id: string): Promise<boolean>;
}
