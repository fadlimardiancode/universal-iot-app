import { IAutomationRepository } from '../../domain/repositories/IAutomationRepository';
import { Automation } from '../../domain/entities/Automation';
import { httpService } from '../datasources/HttpService';
import { StorageService } from '../../core/utils/storage';
import { APP_CONFIG } from '../../core/constants/config';

export class AutomationRepositoryImpl implements IAutomationRepository {
  async getAutomations(): Promise<Automation[]> {
    return await httpService.fetchAutomations();
  }

  async addAutomation(automation: Automation): Promise<Automation> {
    const current = StorageService.getObject<Automation[]>(APP_CONFIG.STORAGE_KEYS.AUTOMATIONS) || [];
    const updated = [...current, automation];
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.AUTOMATIONS, updated);
    return automation;
  }

  async toggleAutomation(id: string): Promise<Automation | null> {
    const current = StorageService.getObject<Automation[]>(APP_CONFIG.STORAGE_KEYS.AUTOMATIONS) || [];
    const target = current.find((a) => a.id === id);
    if (!target) return null;

    const updated = current.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a));
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.AUTOMATIONS, updated);
    return { ...target, isActive: !target.isActive };
  }

  async deleteAutomation(id: string): Promise<boolean> {
    const current = StorageService.getObject<Automation[]>(APP_CONFIG.STORAGE_KEYS.AUTOMATIONS) || [];
    const updated = current.filter((a) => a.id !== id);
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.AUTOMATIONS, updated);
    return true;
  }
}

export const automationRepository = new AutomationRepositoryImpl();
