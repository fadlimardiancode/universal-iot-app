import automationReducer, {
  setAutomations,
} from '../src/presentation/store/automationSlice';
import { Automation } from '../src/domain/entities/Automation';

const sampleAutomations: Automation[] = [
  {
    id: 'auto-01',
    name: 'Turn off all lights at 10 PM',
    deviceId: 'light-01',
    action: 'turnOff',
    scheduledTime: '22:00',
    isActive: true,
  },
];

describe('automationSlice', () => {
  it('should set automations list', () => {
    const state = automationReducer(undefined, setAutomations(sampleAutomations));
    expect(state.automations.length).toBe(1);
    expect(state.automations[0].isActive).toBe(true);
  });
});
