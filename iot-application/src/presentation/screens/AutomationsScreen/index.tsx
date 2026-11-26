import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  toggleAutomationAction,
  deleteAutomationAction,
} from '../../store/automationSlice';
import { AutomationTemplate } from '../../components/templates';
import { Automation } from '../../../domain/entities/Automation';
import { RootStackParamList } from '../../navigation/types';

export const AutomationsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const automations = useAppSelector((state) => state.automations.automations);

  const handleToggleAutomation = useCallback(
    (automation: Automation) => {
      dispatch(toggleAutomationAction(automation.id));
    },
    [dispatch],
  );

  const handleDeleteAutomation = useCallback(
    (id: string) => {
      dispatch(deleteAutomationAction(id));
    },
    [dispatch],
  );

  const handleAddAutomationPress = useCallback(() => {
    navigation.navigate('AddAutomation');
  }, [navigation]);

  return (
    <AutomationTemplate
      automations={automations}
      onToggleAutomation={handleToggleAutomation}
      onDeleteAutomation={handleDeleteAutomation}
      onAddAutomationPress={handleAddAutomationPress}
    />
  );
};
