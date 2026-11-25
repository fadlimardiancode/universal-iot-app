# 🏠 Universal IoT Home App

A smart home control center built with **React Native CLI (TypeScript)**, following **Clean Architecture** and **Atomic Design**, with an integrated **MQTT + HTTP Device Simulator**.

---

## 📁 Repository Structure

```
UniversalIoT/
├── iot-application/       # Mobile App (React Native CLI 0.88.1, TypeScript)
│   ├── src/
│   │   ├── core/          # Theme (MD3), constants, MMKV storage wrapper
│   │   ├── data/          # Models, repositories, data sources
│   │   ├── domain/        # Entities, abstract repositories, use cases
│   │   └── presentation/  # Atomic components (atoms, molecules, organisms, templates), screens, store
│   └── App.tsx
├── backend/               # Mock Server & IoT Device Simulator
│   ├── db.json            # Initial IoT device states, rooms, automations
│   ├── server.js          # json-server REST API (with POST /devices/:id/set & MQTT sync)
│   ├── simulator.js       # CLI tool to control devices from terminal & test live updates
│   ├── docker-compose.yml # Eclipse Mosquitto broker setup
│   └── mosquitto/         # Mosquitto configuration
├── PLAN.md                # Detailed project checklist & timeline
└── docker-compose.yml     # Root shortcut to run Mosquitto broker
```

---

## 📡 Message Contract

### MQTT Topics
| Topic | Direction | Payload Example | Description |
|---|---|---|---|
| `home/<deviceId>/state` | Device → App | `{"on": true, "brightness": 70}` | State change event |
| `home/<deviceId>/set` | App → Device | `{"on": false}` | Control command from app |
| `home/<deviceId>/status` | Device → App | `"online"` / `"offline"` | Connectivity status (retained) |

### HTTP Endpoints
| Method | Endpoint | Body / Response | Description |
|---|---|---|---|
| `GET` | `/devices` | `[{ id, name, type, roomId, on, ... }]` | Fetch all devices |
| `GET` | `/devices/<deviceId>` | `{"on": true, "brightness": 70}` | Fetch single device |
| `POST` | `/devices/<deviceId>/set` | Body: `{"on": false}` | Update device state via HTTP |
| `GET` | `/rooms` | `[{ id, name }]` | Fetch all rooms |

---

## 🚀 Quick Start: Backend & Device Simulator

```bash
cd backend
npm install

# 1. Start Mock Server (runs on http://localhost:3001)
npm start

# 2. Control devices via Simulator CLI
node simulator.js list                  # View all devices
node simulator.js toggle light-01       # Toggle on/off
node simulator.js temp thermo-01 26.5   # Adjust thermostat
node simulator.js daemon                # Auto simulation & MQTT listener
```
