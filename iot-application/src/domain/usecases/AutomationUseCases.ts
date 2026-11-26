import { IAutomationRepository } from '../repositories/IAutomationRepository';
import { Automation } from '../entities/Automation';

export class GetAutomationsUseCase {
  constructor(private repository: IAutomationRepository) {}

  async execute(): Promise<Automation[]> {
    return await this.repository.getAutomations();
  }
}

export class AddAutomationUseCase {
  constructor(private repository: IAutomationRepository) {}

  async execute(automation: Automation): Promise<Automation> {
    return await this.repository.addAutomation(automation);
  }
}

export class ToggleAutomationUseCase {
  constructor(private repository: IAutomationRepository) {}

  async execute(id: string): Promise<Automation | null> {
    return await this.repository.toggleAutomation(id);
  }
}

export class DeleteAutomationUseCase {
  constructor(private repository: IAutomationRepository) {}

  async execute(id: string): Promise<boolean> {
    return await this.repository.deleteAutomation(id);
  }
}
