import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppIcon } from '../../atoms/AppIcon';
import { AppText } from '../../atoms/AppText';
import { AppSwitch } from '../../atoms/AppSwitch';
import { AutomationRowProps } from './types';
import { styles } from './styles';

export const AutomationRow: React.FC<AutomationRowProps> = ({
  automation,
  deviceName,
  onToggle,
  onDelete,
}) => {
  const theme = useTheme();

  const getActionDescription = () => {
    switch (automation.action) {
      case 'turnOn':
        return 'Turn ON';
      case 'turnOff':
        return 'Turn OFF';
      case 'setTemperature':
        return `Set to ${automation.value || 24}°C`;
      default:
        return automation.action;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
          opacity: automation.isActive ? 1 : 0.6,
        },
      ]}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: automation.isActive
                ? `${theme.colors.primary}1A`
                : theme.colors.surfaceVariant,
            },
          ]}
        >
          <AppIcon
            name="clock-outline"
            size={22}
            color={
              automation.isActive ? theme.colors.primary : theme.colors.outline
            }
          />
        </View>

        <View style={styles.info}>
          <AppText variant="subtitle2" numberOfLines={1}>
            {automation.name}
          </AppText>
          <AppText variant="caption" color={theme.colors.outline}>
            {automation.scheduledTime} • {getActionDescription()}
            {deviceName ? ` (${deviceName})` : ''}
          </AppText>
        </View>
      </View>

      <View style={styles.right}>
        {onDelete && (
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <AppIcon name="trash-can-outline" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        )}
        <AppSwitch value={automation.isActive} onValueChange={onToggle} />
      </View>
    </View>
  );
};

export * from './types';
