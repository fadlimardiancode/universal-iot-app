export const APP_CONFIG = {
  APP_NAME: 'Universal IoT Home',
  VERSION: '1.0.0',
  MQTT_BROKER_URL: 'ws://localhost:9001',
  MQTT_BROKER_FALLBACK: 'wss://test.mosquitto.org:8081',
  MQTT_TOPIC_PREFIX: 'home/demo-iot-app',
  HTTP_BASE_URL: 'http://localhost:3001',
  STORAGE_KEYS: {
    THEME: '@universal_iot_theme',
    DEVICES: '@universal_iot_devices',
    ROOMS: '@universal_iot_rooms',
    AUTOMATIONS: '@universal_iot_automations',
  },
} as const;
