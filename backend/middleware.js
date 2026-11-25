const mqtt = require('mqtt');

// MQTT connection for publishing state changes triggered via HTTP
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://127.0.0.1:1883';
const MQTT_PREFIX = process.env.MQTT_PREFIX || 'home/demo-iot-app';

let mqttClient = null;
try {
  mqttClient = mqtt.connect(MQTT_BROKER, {
    connectTimeout: 3000,
    reconnectPeriod: 10000,
  });
  mqttClient.on('connect', () => {
    console.log(`[Middleware] MQTT connected (${MQTT_BROKER})`);
  });
  mqttClient.on('error', () => {
    // Silent fail if local broker not running, fallback to HTTP only
  });
} catch (e) {
  // Ignored
}

module.exports = (req, res, next) => {
  // Support message contract: POST /devices/:id/set -> PATCH /devices/:id
  if (req.method === 'POST' && req.path.includes('/devices/') && req.path.endsWith('/set')) {
    const parts = req.path.split('/');
    const deviceId = parts[2];

    req.method = 'PATCH';
    req.url = `/devices/${deviceId}`;

    if (mqttClient && mqttClient.connected) {
      const topic = `${MQTT_PREFIX}/${deviceId}/state`;
      try {
        mqttClient.publish(topic, JSON.stringify(req.body));
        console.log(`[Middleware] Published MQTT ${topic}:`, req.body);
      } catch (err) {
        // Ignored
      }
    }
  }

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};
