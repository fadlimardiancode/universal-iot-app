import dayjs from 'dayjs';
import { store } from '../../presentation/store';
import { toggleDeviceAction, adjustTemperatureAction } from '../../presentation/store/deviceSlice';
import { Automation } from '../../domain/entities/Automation';

export interface SchedulerCallback {
  (executedRule: Automation, currentTime: string): void;
}

export class AutomationScheduler {
  private static instance: AutomationScheduler;
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: SchedulerCallback[] = [];
  private lastExecutedMinute: string = '';

  private constructor() {}

  public static getInstance(): AutomationScheduler {
    if (!AutomationScheduler.instance) {
      AutomationScheduler.instance = new AutomationScheduler();
    }
    return AutomationScheduler.instance;
  }

  /**
   * Start checking every 5 seconds (to promptly match the current HH:mm minute)
   */
  public start(intervalMs: number = 5000): void {
    if (this.intervalId) {
      return;
    }

    // Run immediate check
    this.checkAndExecute();

    this.intervalId = setInterval(() => {
      this.checkAndExecute();
    }, intervalMs);
    console.log('[AutomationScheduler] Scheduler started.');
  }

  /**
   * Stop the scheduler timer
   */
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[AutomationScheduler] Scheduler stopped.');
    }
  }

  /**
   * Subscribe to execution events (e.g. for toasts, logs, UI feedbacks)
   */
  public onExecuted(callback: SchedulerCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  /**
   * Evaluate active automations against current or provided time (HH:mm)
   */
  public checkAndExecute(currentTimeOverride?: string): Automation[] {
    const nowStr = currentTimeOverride || dayjs().format('HH:mm');

    // Prevent duplicate firing within the exact same minute
    if (nowStr === this.lastExecutedMinute && !currentTimeOverride) {
      return [];
    }

    const state = store.getState();
    const automations: Automation[] = state.automations.automations;
    const executed: Automation[] = [];

    automations.forEach((automation: Automation) => {
      if (automation.isActive && automation.scheduledTime === nowStr) {
        this.executeRule(automation);
        executed.push(automation);
        this.listeners.forEach((listener) => listener(automation, nowStr));
      }
    });

    if (!currentTimeOverride && executed.length > 0) {
      this.lastExecutedMinute = nowStr;
    }

    return executed;
  }

  /**
   * Execute an individual automation action by dispatching Redux thunk
   */
  public executeRule(automation: Automation): void {
    const { deviceId, action, value } = automation;
    console.log(`[AutomationScheduler] Executing rule "${automation.name}" on device "${deviceId}" -> ${action}`);

    if (action === 'turnOn') {
      store.dispatch(toggleDeviceAction({ id: deviceId, currentState: false }));
    } else if (action === 'turnOff') {
      store.dispatch(toggleDeviceAction({ id: deviceId, currentState: true }));
    } else if (action === 'setTemperature' && value !== undefined) {
      store.dispatch(adjustTemperatureAction({ id: deviceId, temperature: value }));
    }
  }

  /**
   * Find the next scheduled automation rule from current time
   */
  public getNextAutomation(): { automation: Automation; diffMinutes: number } | null {
    const state = store.getState();
    const activeRules = (state.automations.automations as Automation[]).filter((a) => a.isActive);
    if (activeRules.length === 0) return null;

    const now = dayjs();
    const currentMinutes = now.hour() * 60 + now.minute();

    let closestRule: Automation | null = null;
    let minDiff = Infinity;

    for (const rule of activeRules) {
      const parts = rule.scheduledTime.split(':');
      if (parts.length !== 2) continue;
      const ruleMinutes = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      let diff = ruleMinutes - currentMinutes;
      if (diff <= 0) {
        diff += 24 * 60; // Next day
      }
      if (diff < minDiff) {
        minDiff = diff;
        closestRule = rule;
      }
    }

    return closestRule ? { automation: closestRule, diffMinutes: minDiff } : null;
  }
}

export const automationScheduler = AutomationScheduler.getInstance();
