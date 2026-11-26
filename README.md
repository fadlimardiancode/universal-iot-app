# 🏠 Universal IoT Home App

A modern smart home mobile application built with **React Native CLI (TypeScript)**, following **Clean Architecture** and **Atomic Design**, featuring real-time bi-directional synchronization via **MQTT (WebSocket)** and **HTTP**, local caching via **MMKV**, and a standalone **IoT Device Simulator**.

---

## 📑 Table of Contents
- [Features](#-features)
- [Architecture & Design Decisions](#-architecture--design-decisions)
- [Repository Structure](#-repository-structure)
- [Message Contract (MQTT & HTTP)](#-message-contract)
- [Quick Start Guide](#-quick-start-guide)
  - [1. Backend & Simulator](#1-backend--simulator)
  - [2. Mobile Application](#2-mobile-application)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [AI Coding Assistant Usage](#-ai-tools-usage)

---

## ✨ Features

- ✅ **Bi-directional Real-Time IoT Sync:** Real-time updates via MQTT topics (`home/<deviceId>/state`, `home/<deviceId>/status`).
- ✅ **Clean Architecture & Atomic Design:** Pure prop-driven components (`Atoms`, `Molecules`, `Organisms`, `Templates`) with screen Pages injecting Redux state.
- ✅ **Supported Device Ecosystem:**
  - 💡 **Smart Lights:** Power toggle, brightness presets (25%, 50%, 75%, 100%).
  - 🌡️ **Thermostats:** Temperature step adjustment (+/- 0.5°C), humidity readouts.
  - 🔒 **Smart Locks:** Door lock/unlock toggle with visual status.
  - 📷 **Security Cameras:** Streaming RTSP placeholder with privacy mode toggle.
- ✅ **Room & Device Management:** Organize devices into rooms, create new rooms, and assign devices.
- ✅ **Automation & Scheduling:** Local time-based scheduler running in the background, next upcoming automation banner on dashboard, and badge count on tab bar.
- ✅ **Dark & Light Mode:** Seamless theming using Material Design 3 tokens and persistent theme selection via MMKV.
- ✅ **Offline Resilience:** Auto-fallback to MMKV cache and mock dataset when HTTP mock or MQTT broker is disconnected.

---

## 🏛️ Architecture & Design Decisions

### 1. Clean Architecture
The codebase strictly decouples business rules from frameworks and UI:
- **Domain Layer (`src/domain/`):** Pure TypeScript entities (`Device`, `Room`, `Automation`) and abstract repository interfaces. No external framework dependencies.
- **Data Layer (`src/data/`):** Implements repositories using `HttpService` (Axios), `MqttService` (MQTT.js WebSocket client), MMKV caching, and mock fallbacks.
- **Presentation Layer (`src/presentation/`):** UI components, Redux Toolkit slices, and navigation.

### 2. Atomic Design System
- **Atoms (`src/presentation/components/atoms/`):** Unit building blocks (`AppText`, `AppButton`, `AppSwitch`, `AppBadge`, `AppIcon`, `AppDivider`, `AppSkeleton`). Purely presentational, completely domain-agnostic.
- **Molecules (`src/presentation/components/molecules/`):** Composed atoms (`DeviceToggleRow`, `TemperatureControl`, `RoomHeader`, `SummaryCard`, `FormField`, `StatusChip`, `AutomationRow`).
- **Organisms (`src/presentation/components/organisms/`):** Domain-aware components (`DeviceCard`, `DeviceList`, `RoomCard`, `RoomGrid`, `DashboardSummary`, `AutomationCard`, `AddDeviceForm`, `AddRoomForm`).
- **Templates (`src/presentation/components/templates/`):** Structural screen layouts without direct Redux imports (`DashboardTemplate`, `RoomListTemplate`, `RoomDetailTemplate`, `DeviceDetailTemplate`, `AutomationTemplate`, `SettingsTemplate`).
- **Screens (`src/presentation/screens/`):** Pages layer connecting Redux Toolkit state, actions, and use cases into templates.

### 3. State Management & Storage
- **Redux Toolkit (`@reduxjs/toolkit`):** Predictable global state management (`deviceSlice`, `roomSlice`, `automationSlice`, `themeSlice`, `connectivitySlice`).
- **MMKV (`react-native-mmkv`):** Ultra-fast synchronous storage for instant bootup and offline persistence.
- **MQTT.js over WebSocket:** Enables browser-compatible and React Native WebSocket networking (`ws://localhost:9001`) with automatic reconnection and retained topic handling.

---

## 📁 Repository Structure

```
UniversalIoT/
├── iot-application/       # React Native CLI Mobile App (v0.88.1, TypeScript 6)
│   ├── src/
│   │   ├── core/          # Themes, constants, MMKV storage, AutomationScheduler
│   │   ├── domain/        # Entities & abstract repository contracts
│   │   ├── data/          # HTTP & MQTT datasources, repositories, mock data
│   │   └── presentation/  # Atomic components, screens, store slices, navigation
│   ├── __tests__/         # 10 comprehensive Jest test suites (28 tests)
│   ├── App.tsx            # App root with Navigation & Service Lifecycle
│   └── package.json
├── backend/               # Simulator & Mock Infrastructure
│   ├── db.json            # Mock database (devices, rooms, automations)
│   ├── server.js          # REST API server (json-server + MQTT bridge)
│   ├── simulator.js       # CLI simulator to control devices from terminal
│   ├── broker.js          # Fallback Node.js Aedes MQTT broker
│   ├── docker-compose.yml # Eclipse Mosquitto broker configuration
│   └── bruno/             # Bruno API test collection
├── PLAN.md                # Implementation plan & checklist
└── README.md
```

---

## 📡 Message Contract

### MQTT Topics
| Topic | Direction | Payload Example | Description |
|---|---|---|---|
| `home/demo-iot-app/<deviceId>/state` | Device → App | `{"on": true, "brightness": 70}` | State change event |
| `home/demo-iot-app/<deviceId>/set` | App → Device | `{"on": false}` | Set command from app |
| `home/demo-iot-app/<deviceId>/status` | Device → App | `"online"` / `"offline"` | Availability status (retained) |

### HTTP Endpoints
| Method | Endpoint | Request Body / Response | Description |
|---|---|---|---|
| `GET` | `/devices` | `Device[]` | List all devices |
| `GET` | `/devices/:id` | `Device` | Get single device |
| `POST` | `/devices/:id/set` | `{"on": false}` | Update state & triggers MQTT sync |
| `GET` | `/rooms` | `Room[]` | List rooms |
| `GET` | `/automations` | `Automation[]` | List automation rules |

---

## 🚀 Quick Start Guide

### 1. Backend & Simulator

```bash
cd backend
npm install

# Option A: Start Mosquitto via Docker (Port 1883 TCP & 9001 WebSocket)
docker compose up -d

# Option B: Or run the built-in Node.js MQTT broker (if Docker is not installed)
npm run broker

# Start the Mock HTTP Server
npm start

# In another terminal, use the Simulator CLI to test live sync:
node simulator.js list                  # List all simulated devices
node simulator.js toggle light-01       # Toggle light on/off
node simulator.js temp thermo-01 27.5   # Change thermostat temperature
node simulator.js daemon                # Run daemon with periodic fluctuation
```

### 2. Mobile Application

```bash
cd iot-application
npm install

# iOS (macOS only)
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

---

## 🧪 Testing & Quality Assurance

The project features comprehensive test coverage across domain use cases, Redux slices, services, and atomic UI components:

```bash
cd iot-application

# Run TypeScript typecheck (0 errors)
npx tsc --noEmit

# Run all 10 Jest test suites (28 tests)
npm test
```

### Test Suites Overview:
- `__tests__/usecases.test.ts`: Domain use cases business logic.
- `__tests__/deviceSlice.test.ts`: Device Redux slice & MQTT payload reducer updates.
- `__tests__/roomSlice.test.ts`: Room CRUD slice operations.
- `__tests__/automationSlice.test.ts`: Automation rule slice state.
- `__tests__/themeSlice.test.ts`: Dark/light mode theme toggling and persistence.
- `__tests__/automationScheduler.test.ts`: Timed execution and rule filtering.
- `__tests__/mqttService.test.ts`: MQTT connection, topic subscribe, and publish.
- `__tests__/components.test.tsx`: Atomic components rendering and interactions.
- `__tests__/atoms.test.tsx`: Pure presentational atoms.
- `__tests__/App.test.tsx`: Full app rendering with Navigation and Redux providers.

---

## 🤖 AI Tools Usage

In accordance with the test guidelines, this project was built with the assistance of **Antigravity AI (Google DeepMind)**:
- **Architecture & Scaffolding:** Structuring Clean Architecture directories, Atomic Design hierarchies, and configuration files.
- **Boilerplate & TypeScript Typings:** Writing strict TypeScript interfaces for entities, Redux Toolkit slices, and atomic component props.
- **Simulator & Mock Server:** Developing the `json-server` + MQTT bridge in `server.js` and CLI device simulator in `simulator.js`.
- **Unit & Component Testing:** Authoring unit tests with Jest and `@testing-library/react-native`.
