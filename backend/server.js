const jsonServer = require('json-server');
const path = require('path');
const mqtt = require('mqtt');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3001;
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://127.0.0.1:1883';
const MQTT_PREFIX = process.env.MQTT_PREFIX || 'home/demo-iot-app';

// Connect to MQTT broker if available
let mqttClient = null;
try {
  mqttClient = mqtt.connect(MQTT_BROKER, {
    connectTimeout: 2000,
    reconnectPeriod: 10000,
  });
  mqttClient.on('connect', () => {
    console.log(`[JSON Server] Connected to MQTT broker: ${MQTT_BROKER}`);
  });
  mqttClient.on('error', () => {
    // Silent fail if local broker not running
  });
} catch (e) {
  // Ignored
}

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Message Contract Endpoint: POST /devices/:id/set
server.post('/devices/:id/set', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const device = db.get('devices').find({ id }).value();

  if (!device) {
    return res.status(404).json({ error: `Device ${id} not found` });
  }

  const updated = db.get('devices').find({ id }).assign(req.body).write();
  console.log(`[HTTP POST] /devices/${id}/set updated:`, req.body);

  // Publish state change to MQTT
  if (mqttClient && mqttClient.connected) {
    const topic = `${MQTT_PREFIX}/${id}/state`;
    mqttClient.publish(topic, JSON.stringify(req.body));
    console.log(`[MQTT] Published state change to ${topic}`);
  }

  res.json(updated);
});

// Standard json-server router handles GET /devices, GET /devices/:id, GET /rooms, etc.
server.use(router);

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  JSON Server running on http://localhost:${PORT}`);
  console.log(`  - GET  /devices`);
  console.log(`  - GET  /devices/:id`);
  console.log(`  - POST /devices/:id/set  (Message Contract)`);
  console.log(`  - GET  /rooms`);
  console.log(`  - GET  /automations`);
  console.log(`======================================================\n`);
});
