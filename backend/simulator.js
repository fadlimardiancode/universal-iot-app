#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const mqtt = require('mqtt');
const axios = require('axios');

const DB_PATH = path.join(__dirname, 'db.json');
const HTTP_BASE_URL = process.env.HTTP_URL || 'http://localhost:3001';
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://127.0.0.1:1883';
const MQTT_FALLBACK_BROKER = 'mqtt://test.mosquitto.org:1883';
const MQTT_PREFIX = process.env.MQTT_PREFIX || 'home/demo-iot-app';

function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err.message);
    return { devices: [], rooms: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err.message);
  }
}

function publishMqttMessage(topic, payload, retain = false, onDone) {
  let done = false;
  const finish = () => {
    if (!done) {
      done = true;
      if (onDone) onDone();
    }
  };

  const client = mqtt.connect(MQTT_BROKER, {
    connectTimeout: 1500,
    reconnectPeriod: 0,
  });

  const timer = setTimeout(() => {
    if (!done) {
      client.end(true);
      console.log(`[MQTT] Local broker (${MQTT_BROKER}) offline. Update saved in db.json.`);
      finish();
    }
  }, 1600);

  client.on('connect', () => {
    client.publish(topic, typeof payload === 'string' ? payload : JSON.stringify(payload), { retain }, () => {
      console.log(`[MQTT] Published -> ${topic}:`, payload);
      clearTimeout(timer);
      client.end(false, finish);
    });
  });

  client.on('error', () => {
    clearTimeout(timer);
    client.end(true);
    finish();
  });
}

// Update device in db and optionally via HTTP API
async function updateDevice(deviceId, patchData) {
  const db = readDb();
  const index = db.devices.findIndex((d) => d.id === deviceId);
  if (index === -1) {
    console.error(`Device not found: ${deviceId}`);
    return null;
  }

  const updated = { ...db.devices[index], ...patchData };
  db.devices[index] = updated;
  writeDb(db);

  // Try HTTP PATCH if server is running
  try {
    await axios.patch(`${HTTP_BASE_URL}/devices/${deviceId}`, patchData, { timeout: 800 });
  } catch (e) {
    // Local server not reachable, db updated directly
  }

  return updated;
}

// Commands
async function listDevices() {
  const db = readDb();
  console.log('\n================ Universal IoT Devices ================');
  console.table(
    db.devices.map((d) => ({
      ID: d.id,
      Name: d.name,
      Type: d.type,
      Room: d.roomId,
      State: d.type === 'lock' ? (d.isLocked ? 'LOCKED' : 'UNLOCKED') : d.on ? 'ON' : 'OFF',
      Details: d.temperature ? `${d.temperature}°C (${d.humidity ?? 60}%)` : d.brightness ? `${d.brightness}%` : '-',
      Status: d.status || 'online',
    }))
  );
  console.log('=======================================================\n');
}

async function toggleDevice(deviceId) {
  const db = readDb();
  const device = db.devices.find((d) => d.id === deviceId);
  if (!device) {
    console.error(`Device ${deviceId} not found.`);
    return;
  }

  const patch = {};
  if (device.type === 'lock') {
    patch.isLocked = !device.isLocked;
    patch.on = !device.isLocked;
  } else {
    patch.on = !device.on;
  }

  await updateDevice(deviceId, patch);
  console.log(`[Simulator] Toggled ${deviceId} (${device.name}):`, patch);

  publishMqttMessage(`${MQTT_PREFIX}/${deviceId}/state`, patch, false, () => {
    process.exit(0);
  });
}

async function setProperty(deviceId, prop, value) {
  let parsedValue = value;
  if (value === 'true') parsedValue = true;
  else if (value === 'false') parsedValue = false;
  else if (!isNaN(Number(value))) parsedValue = Number(value);

  const patch = { [prop]: parsedValue };
  if (prop === 'temperature') {
    patch.humidity = Math.floor(55 + Math.random() * 15);
  }

  await updateDevice(deviceId, patch);
  console.log(`[Simulator] Set ${deviceId} ${prop} = ${parsedValue}`);

  publishMqttMessage(`${MQTT_PREFIX}/${deviceId}/state`, patch, false, () => {
    process.exit(0);
  });
}

async function setDeviceStatus(deviceId, status) {
  const valid = ['online', 'offline'].includes(status) ? status : 'online';
  await updateDevice(deviceId, { status: valid });
  console.log(`[Simulator] Set status of ${deviceId} to ${valid}`);

  publishMqttMessage(`${MQTT_PREFIX}/${deviceId}/status`, valid, true, () => {
    process.exit(0);
  });
}

// Daemon Mode
function startDaemon() {
  console.log('[Simulator] Starting in daemon mode...');
  console.log(`Connecting to MQTT broker (${MQTT_BROKER})...`);

  const client = mqtt.connect(MQTT_BROKER, {
    connectTimeout: 5000,
    reconnectPeriod: 5000,
  });

  client.on('connect', () => {
    console.log(`[MQTT] Connected! Subscribing to ${MQTT_PREFIX}/+/set`);
    client.subscribe(`${MQTT_PREFIX}/+/set`);

    const db = readDb();
    db.devices.forEach((d) => {
      client.publish(`${MQTT_PREFIX}/${d.id}/status`, 'online', { retain: true });
    });
  });

  client.on('message', async (topic, message) => {
    const match = topic.match(new RegExp(`${MQTT_PREFIX}/([^/]+)/set`));
    if (!match) return;

    const deviceId = match[1];
    try {
      const payload = JSON.parse(message.toString());
      console.log(`[MQTT IN] Command for ${deviceId}:`, payload);

      await updateDevice(deviceId, payload);

      const stateTopic = `${MQTT_PREFIX}/${deviceId}/state`;
      client.publish(stateTopic, JSON.stringify(payload));
      console.log(`[MQTT OUT] Acknowledged state to ${stateTopic}:`, payload);
    } catch (e) {
      console.error('Invalid payload:', message.toString());
    }
  });

  client.on('error', (err) => {
    console.warn(`[MQTT] Connection warning: ${err.message}`);
  });

  setInterval(async () => {
    const currentDb = readDb();
    const thermo = currentDb.devices.find((d) => d.type === 'thermostat');
    if (thermo && thermo.on && client.connected) {
      const delta = Math.random() * 0.4 - 0.2;
      const newTemp = Math.round((thermo.temperature + delta) * 10) / 10;
      const newHumidity = Math.floor(58 + Math.random() * 8);

      await updateDevice(thermo.id, { temperature: newTemp, humidity: newHumidity });
      const payload = { temperature: newTemp, humidity: newHumidity };
      client.publish(`${MQTT_PREFIX}/${thermo.id}/state`, JSON.stringify(payload));
      console.log(`[Sensor Tick] ${thermo.id} -> ${newTemp}°C, ${newHumidity}%`);
    }
  }, 15000);
}

// CLI Argument Parsing
const args = process.argv.slice(2);
const command = args[0] || 'list';

switch (command) {
  case 'list':
    listDevices();
    break;
  case 'toggle':
    if (!args[1]) {
      console.log('Usage: node simulator.js toggle <deviceId>');
      listDevices();
    } else {
      toggleDevice(args[1]);
    }
    break;
  case 'set':
    if (!args[1] || !args[2] || args[3] === undefined) {
      console.log('Usage: node simulator.js set <deviceId> <prop> <value>');
    } else {
      setProperty(args[1], args[2], args[3]);
    }
    break;
  case 'temp':
    if (!args[1] || !args[2]) {
      console.log('Usage: node simulator.js temp <deviceId> <temperature>');
    } else {
      setProperty(args[1], 'temperature', args[2]);
    }
    break;
  case 'status':
    if (!args[1] || !args[2]) {
      console.log('Usage: node simulator.js status <deviceId> <online|offline>');
    } else {
      setDeviceStatus(args[1], args[2]);
    }
    break;
  case 'daemon':
  case 'listen':
    startDaemon();
    break;
  default:
    console.log(`Unknown command: ${command}`);
    console.log('Available commands: list, toggle, set, temp, status, daemon');
    break;
}
