import { automationScheduler } from '../src/core/services/AutomationScheduler';
import { store } from '../src/presentation/store';
import { setAutomations } from '../src/presentation/store/automationSlice';
import { setDevices } from '../src/presentation/store/deviceSlice';
import { Automation } from '../src/domain/entities/Automation';
import { Device } from '../src/domain/entities/Device';

describe('AutomationScheduler Service', () => {
  const mockDevices: Device[] = [
    {
      id: 'dev_light',
      name: 'Living Room Light',
      type: 'light',
      roomId: 'room_living',
      isOn: false,
      status: 'online',
    },
    {
      id: 'dev_thermo',
      name: 'AC Thermostat',
      type: 'thermostat',
      roomId: 'room_bed',
      isOn: true,
      temperature: 26,
      status: 'online',
    },
  ];

  const mockAutomations: Automation[] = [
    {
      id: 'auto_1',
      name: 'Turn On Light in Morning',
      deviceId: 'dev_light',
      action: 'turnOn',
      scheduledTime: '06:30',
      isActive: true,
    },
    {
      id: 'auto_2',
      name: 'Turn Off Thermostat Inactive',
      deviceId: 'dev_thermo',
      action: 'turnOff',
      scheduledTime: '06:30',
      isActive: false, // Inactive, shouldn't execute
    },
    {
      id: 'auto_3',
      name: 'Cool down room',
      deviceId: 'dev_thermo',
      action: 'setTemperature',
      value: 21,
      scheduledTime: '22:00',
      isActive: true,
    },
  ];

  beforeEach(() => {
    store.dispatch(setDevices(mockDevices));
    store.dispatch(setAutomations(mockAutomations));
    automationScheduler.stop();
  });

  afterEach(() => {
    automationScheduler.stop();
  });

  it('correctly matches and executes active rules for the current time', () => {
    let executedCallCount = 0;
    const unsub = automationScheduler.onExecuted((rule, time) => {
      expect(rule.id).toBe('auto_1');
      expect(time).toBe('06:30');
      executedCallCount++;
    });

    const executed = automationScheduler.checkAndExecute('06:30');
    expect(executed.length).toBe(1);
    expect(executed[0].id).toBe('auto_1');
    expect(executedCallCount).toBe(1);

    unsub();
  });

  it('does not execute rules that are inactive', () => {
    // Only auto_2 matches 06:30 if auto_1 was inactive
    store.dispatch(
      setAutomations([
        { ...mockAutomations[0], isActive: false },
        mockAutomations[1],
      ])
    );

    const executed = automationScheduler.checkAndExecute('06:30');
    expect(executed.length).toBe(0);
  });

  it('does not execute rules when time does not match', () => {
    const executed = automationScheduler.checkAndExecute('12:00');
    expect(executed.length).toBe(0);
  });

  it('calculates the next upcoming automation correctly', () => {
    const next = automationScheduler.getNextAutomation();
    expect(next).not.toBeNull();
    expect(['auto_1', 'auto_3']).toContain(next!.automation.id);
  });

  it('starts and stops scheduler interval cleanly', () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(automationScheduler, 'checkAndExecute');

    automationScheduler.start(1000);
    expect(spy).toHaveBeenCalled();

    jest.advanceTimersByTime(2500);
    expect(spy).toHaveBeenCalledTimes(3);

    automationScheduler.stop();
    jest.advanceTimersByTime(2000);
    // Should not increase after stop
    expect(spy).toHaveBeenCalledTimes(3);

    jest.useRealTimers();
  });
});
