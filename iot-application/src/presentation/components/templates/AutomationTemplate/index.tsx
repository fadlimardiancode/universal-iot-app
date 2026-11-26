import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { FAB } from 'react-native-paper';
import { AutomationCard } from '../../organisms/AutomationCard';
import { AppText } from '../../atoms/AppText';
import { styles } from './styles';
import { AutomationTemplateProps } from './types';

export const AutomationTemplate: React.FC<AutomationTemplateProps> = ({
  automations,
  onToggleAutomation,
  onDeleteAutomation,
  onAddAutomationPress,
  onRefresh,
  refreshing = false,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <AppText variant="h2" style={styles.title}>
          Automations & Scenes
        </AppText>
        <AppText variant="body2" style={styles.subtitle}>
          Execute smart rules automatically based on triggers
        </AppText>

        {automations.map((automation) => (
          <AutomationCard
            key={automation.id}
            automation={automation}
            onToggle={() => onToggleAutomation(automation)}
            onDelete={
              onDeleteAutomation
                ? () => onDeleteAutomation(automation.id)
                : undefined
            }
          />
        ))}

        {automations.length === 0 && (
          <View style={styles.emptyContainer}>
            <AppText variant="body1" style={styles.emptyText}>
              No automations created yet.
            </AppText>
          </View>
        )}
      </ScrollView>

      {onAddAutomationPress && (
        <FAB icon="plus" style={styles.fab} onPress={onAddAutomationPress} />
      )}
    </View>
  );
};
