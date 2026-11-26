import React from 'react';
import { Card } from 'react-native-paper';
import { AutomationRow } from '../../molecules/AutomationRow';
import { styles } from './styles';
import { AutomationCardProps } from './types';

export const AutomationCard: React.FC<AutomationCardProps> = ({
  automation,
  onToggle,
  onDelete,
}) => {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        <AutomationRow
          automation={automation}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      </Card.Content>
    </Card>
  );
};
