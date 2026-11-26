# 📋 Project Plan: Universal IoT Home App

> **Role:** React Native Developer (Mobile)  
> **Durasi Take-Home Test:** 3–5 hari  
> **Stack:** React Native CLI · TypeScript · Redux Toolkit / Zustand · MMKV · MQTT.js · Axios · Clean Architecture + Atomic Design  
> **Infrastructure:** Mosquitto (Docker) · json-server / Express simulator · MQTT + REST message contract

---

## 🗂️ Evaluation Criteria (Panduan Prioritas)

| Kriteria | Bobot |
|---|---|
| Code quality & architecture | 30% |
| Feature completeness | 25% |
| UI/UX polish | 20% |
| State management implementation | 15% |
| Testing | 10% |

---

## 🚀 Phase Overview

```
Phase 1 → Project Setup & Architecture                         (Done ✅)
Phase 2 → Infrastructure & Device Simulator                    (Done ✅)
Phase 3 → Data Layer, MQTT/HTTP & State Mgmt                   (Done ✅)
Phase 4 → UI & Fitur Utama (Atomic Design)                     (Done ✅)
Phase 5 → Automation & Scheduling                              (Done ✅)
Phase 6 → Protocol Adapters & Multi-Protocol Provisioning      (In Progress 🎯) ← REKOMENDASI BRIEF
Phase 7 → Testing & Polish                                     (Done ✅)
Phase 8 → Bonus Features                                       (Opsional)
Phase 9 → Deliverables & Submission (Video, Slide, Repo)       (Upcoming)
```

---

## ✅ Phase 1 — Project Setup & Architecture

> **Target:** Fondasi project siap, struktur folder clean, dependencies terpasang.

### 1.1 Inisialisasi Project
- [x] Pastikan environment siap: Node.js (v20), npm (v10), git
- [x] Buat project RN CLI dengan TypeScript di `iot-application/` (React Native 0.88.1)
- [x] Verifikasi build & test suite awal lulus (TypeScript 0 errors, Jest 3/3 test suites passed)
- [x] Inisialisasi Git repository & `.gitignore` yang proper (root + app level)

### 1.2 Struktur Folder (Clean Architecture + Atomic Design)
- [x] Buat struktur folder:
  ```
  src/
  ├── core/
  │   ├── constants/           # warna, ukuran, string, config
  │   ├── theme/               # light & dark theme tokens (MD3)
  │   └── utils/               # storage (MMKV), helpers
  ├── data/
  │   ├── models/              # TypeScript interfaces/types
  │   ├── repositories/        # implementasi repository
  │   └── datasources/         # MQTT, HTTP, mock data sources
  ├── domain/
  │   ├── entities/            # pure business entities
  │   ├── repositories/        # abstract repository interface
  │   └── usecases/            # business logic
  ├── presentation/
  │   ├── components/          # ── ATOMIC DESIGN ──
  │   │   ├── atoms/           # AppText, AppButton, AppIcon, AppSwitch, AppBadge, AppDivider, AppSkeleton
  │   │   ├── molecules/       # DeviceToggleRow, RoomHeader, StatusChip, TemperatureControl, FormField, AutomationRow, SummaryCard
  │   │   ├── organisms/       # DeviceCard, DeviceList, RoomCard, RoomGrid, AutomationCard, DashboardSummary, AddDeviceForm, AddRoomForm, AppBottomTabBar
  │   │   └── templates/       # DashboardTemplate, RoomListTemplate, RoomDetailTemplate, DeviceDetailTemplate, AutomationTemplate, SettingsTemplate
  │   ├── screens/             # HomeScreen, RoomsScreen, RoomDetailScreen, DeviceDetailScreen, AutomationsScreen, AddAutomationScreen, SettingsScreen
  │   ├── navigation/          # React Navigation config
  │   └── store/               # Redux slices (theme, device, room, automation)
  └── App.tsx
  ```
- [x] Setup `tsconfig.json` path alias (`@core`, `@data`, `@domain`, `@atoms`, `@molecules`, `@organisms`, `@templates`, `@screens`, `@navigation`, `@store`)
- [x] Install & konfigurasi `babel-plugin-module-resolver` & `react-native-reanimated/plugin`
- [x] Setiap atom component folder memiliki: `index.tsx`, `styles.ts`, `types.ts`

### 1.3 Dependencies (`package.json`)
- [x] **Navigasi:** `@react-navigation/native` + `@react-navigation/bottom-tabs` + `@react-navigation/stack` + `react-native-screens` + `react-native-safe-area-context`
- [x] **State Management:** `@reduxjs/toolkit` + `react-redux`
- [x] **Storage:** `react-native-mmkv`
- [x] **UI Library:** `react-native-paper` (Material Design 3)
- [x] **Icons:** `react-native-vector-icons` + `@types/react-native-vector-icons`
- [x] **Animasi:** `react-native-reanimated` + `react-native-gesture-handler`
- [x] **Date/Time:** `dayjs`
- [x] **MQTT Client:** `mqtt` (MQTT.js)
- [x] **HTTP Client:** `axios`
- [x] **Testing:** `jest`, `@testing-library/react-native`, `react-test-renderer`
- [ ] *(Bonus)* **Notifikasi:** `@notifee/react-native` atau `react-native-push-notification`
- [ ] *(Bonus)* **Charts:** `react-native-chart-kit` atau `victory-native`
- [ ] *(Bonus)* **Lokalisasi:** `react-i18next` + `i18next`
- [ ] Jalankan `pod install` di folder `ios/` (membutuhkan CocoaPods environment)

### 1.4 Setup Tema & Constants
- [x] Buat `AppTheme.ts` dengan `lightTheme` dan `darkTheme` berbasis **Material Design 3** (`react-native-paper`)
- [x] Buat `AppColors.ts`, `AppSpacing.ts`, `AppTypography.ts`, `config.ts`
- [x] Buat `ThemeSlice` (`themeSlice.ts`) untuk toggle light/dark/system mode dengan MMKV persistence
- [x] Integrasikan `useColorScheme()` dari RN untuk dynamic system theme

---

## ✅ Phase 2 — Infrastructure & Device Simulator

> **Target:** MQTT broker jalan, HTTP mock server jalan, simulator device bisa dijalankan recruiter untuk melihat live update di app.

### 2.1 Message Contract (Dokumentasikan di README)
- [x] Dokumentasikan message contract MQTT & HTTP di `backend/README.md` dan root README:

```
── MQTT Topics ──────────────────────────────────────────────────────
home/<deviceId>/state    device → app   {"on": true, "brightness": 70}
home/<deviceId>/set      app → device   {"on": false}
home/<deviceId>/status   device → app   "online" | "offline"  (retained)

── HTTP Endpoints ───────────────────────────────────────────────────
GET  /devices             → [{ id, name, type, roomId, on, ... }]
GET  /devices/<deviceId>  → {"on": true, "brightness": 70}
POST /devices/<deviceId>/set  ← {"on": false}

── Sensor Payload (thermostat) ──────────────────────────────────────
{"temperature": 26.5, "humidity": 61}
```

> [!NOTE]
> Gunakan **unique topic prefix** jika pakai public broker (`test.mosquitto.org`).  
> Default: `home/demo-iot-app/<deviceId>/state`.

### 2.2 MQTT Broker — Mosquitto via Docker
- [x] Buat `docker-compose.yml` di root dan `backend/` (port 1883 TCP & 9001 WebSocket)
- [x] Buat `backend/mosquitto/config/mosquitto.conf` (websockets listener + persistence)
- [x] Sediakan fallback broker public (`test.mosquitto.org`) jika host tidak memiliki Docker

### 2.3 HTTP Mock Server — Opsi A (json-server)
- [x] Buat `backend/db.json` dengan data awal 6 devices, 3 rooms, dan automations
- [x] Buat `backend/routes.json` dan `backend/middleware.js` untuk URL rewrite & CORS
- [x] Buat `backend/server.js` berbasis engine `json-server` yang mendukung:
  - `GET /devices`
  - `GET /devices/:id`
  - `POST /devices/:id/set` (mengupdate `db.json` & broadcast MQTT)
  - `GET /rooms`
- [x] Verifikasi HTTP endpoint berjalan di port 3001

### 2.4 Device Simulator CLI
- [x] Buat `backend/simulator.js` (Node.js CLI):
  - `node simulator.js list` (tabel status perangkat)
  - `node simulator.js toggle <deviceId>` (flip on/off)
  - `node simulator.js set <deviceId> <prop> <value>`
  - `node simulator.js temp <deviceId> <temperature>` (suhu + kelembaban)
  - `node simulator.js status <deviceId> <online|offline>` (retained MQTT)
  - `node simulator.js daemon` (listen `home/+/set` & simulasi fluktuasi sensor berkala)
- [x] Setiap aksi otomatis memperbarui `db.json` dan mempublikasikan status via MQTT

### 2.5 Verifikasi End-to-End
- [x] Verifikasi `GET /devices/light-01`
- [x] Verifikasi `POST /devices/light-01/set` berhasil memperbarui state
- [x] Verifikasi CLI `node simulator.js toggle light-01` memperbarui state dan sinkron dengan HTTP server
- [x] Dokumentasi lengkap di `backend/README.md`

---

## ✅ Phase 3 — Data Layer, MQTT/HTTP & State Management

> **Target:** Model data, MQTT client, HTTP client, dan state management siap digunakan.

### 3.1 Entities & TypeScript Types
- [x] Buat `DeviceType` enum: `'light' | 'thermostat' | 'camera' | 'lock'`
- [x] Buat `DeviceStatus` type: `'online' | 'offline'`
- [x] Buat interface `Device` (`src/domain/entities/Device.ts`):
  ```ts
  interface Device {
    id: string;
    name: string;
    type: DeviceType;
    roomId: string;
    isOn: boolean;
    status: DeviceStatus;    // dari MQTT retained topic /status
    temperature?: number;    // thermostat
    humidity?: number;       // thermostat/sensor
    brightness?: number;     // light
    isLocked?: boolean;      // lock
  }
  ```
- [x] Buat interface `Room` (`src/domain/entities/Room.ts`)
- [x] Buat interface `Automation` (`src/domain/entities/Automation.ts`)
- [x] Buat interface `MqttStatePayload` & `MqttSetPayload` sesuai message contract

### 3.2 MQTT Service (Data Source)
- [x] Buat `src/data/datasources/MqttService.ts`:
  - Menggunakan library `mqtt` (MQTT.js) dengan WebSocket transport (`ws://` / `wss://`)
  - Config broker URL dari `src/core/constants/config.ts`
  - Method `connect()` → connect ke broker, subscribe ke `home/+/state` dan `home/+/status`
  - Method `publishCommand(deviceId, payload)` → publish ke `home/<deviceId>/set`
  - Method `disconnect()`
  - Callback listeners: `onDeviceState`, `onDeviceStatus`, `onConnection`
- [x] Setup `src/core/constants/config.ts` (port 9001 WebSocket & port 3001 HTTP)
- [x] Handle koneksi ulang otomatis (`reconnectPeriod: 5000`)
- [x] Handle pesan retained `status` → update `DeviceStatus` di store

### 3.3 HTTP Service (Data Source)
- [x] Buat `src/data/datasources/HttpService.ts` menggunakan `axios`:
  - `fetchDevices()` → `GET /devices` → return `Device[]`
  - `fetchDevice(id)` → `GET /devices/:id` → return `Device`
  - `setDeviceState(id, payload)` → `POST /devices/:id/set`
  - `fetchRooms()` → `GET /rooms` → return `Room[]`
  - `fetchAutomations()` → `GET /automations` → return `Automation[]`
- [x] Setup `axios` instance dengan `baseURL` dari `config.ts` dan timeout 5s
- [x] Handle fallback ke MMKV cache dan mock data saat server offline

### 3.4 Mock Fallback Data Source
- [x] Buat `src/data/datasources/MockDeviceDataSource.ts` (6 devices sinkron dengan `backend/db.json`)
- [x] Buat `src/data/datasources/MockRoomDataSource.ts` (3 rooms default)
- [x] Buat `src/data/datasources/MockAutomationDataSource.ts` (2 contoh automation rules)
- [x] Buat `src/data/datasources/MockHistoricalTemperature.ts` (data 24 jam untuk chart)
- [x] App auto-fallback ke local storage & mock jika HTTP/MQTT offline

### 3.5 Repository Interfaces & Implementations
- [x] Abstract `IDeviceRepository` di domain layer
- [x] `DeviceRepositoryImpl`: 
  - Init state dari `HttpService.fetchDevices()` dengan fallback
  - Sinkronisasi state via MQTT `home/+/state` & retained `home/+/status`
  - `toggleDevice`, `adjustTemperature`, `addDevice`, `removeDevice`
- [x] Abstract `IRoomRepository` → `RoomRepositoryImpl`
- [x] Abstract `IAutomationRepository` → `AutomationRepositoryImpl`

### 3.6 Local Storage (MMKV)
- [x] Buat `StorageService.ts` wrapper untuk MMKV v3
- [x] Implementasi persist & load devices, rooms, automations, dan theme
- [x] Cache terintegrasi di repository layer (load on init, persist on mutation)

### 3.7 Use Cases
- [x] `GetDevicesUseCase`, `ToggleDeviceUseCase`, `AdjustTemperatureUseCase`, `AddDeviceUseCase`, `RemoveDeviceUseCase`
- [x] `GetRoomsUseCase`, `AddRoomUseCase`, `RenameRoomUseCase`, `DeleteRoomUseCase`
- [x] `GetAutomationsUseCase`, `AddAutomationUseCase`, `ToggleAutomationUseCase`, `DeleteAutomationUseCase`
- [x] Unit test use cases di `__tests__/usecases.test.ts`

### 3.8 Redux Store
- [x] **deviceSlice** (`devices[]`, `loading`, `error`, thunks: fetchDevices, toggleDeviceAction, adjustTemperatureAction, reducers: updateDeviceFromMqtt, updateDeviceStatusFromMqtt)
- [x] **roomSlice** (`rooms[]`, `loading`, `error`, thunks: fetchRooms, addRoomAction, renameRoomAction, deleteRoomAction)
- [x] **automationSlice** (`automations[]`, `loading`, `error`, thunks: fetchAutomations, addAutomationAction, toggleAutomationAction, deleteAutomationAction)
- [x] **themeSlice** (`'light' | 'dark' | 'system'`)
- [x] **connectivitySlice** (`mqttConnected`, `httpReachable`)
- [x] Setup Redux store di `src/presentation/store/index.ts`
- [x] Integrasi `App.tsx` dengan Redux Provider, `MqttService.connect()`, dan live device list
- [x] Unit test Redux slices (7 test suites, 15 tests passed)

---

## ✅ Phase 3 — UI & Fitur Utama (Atomic Design)

> **Target:** Semua screen utama selesai dengan UI yang polish. Bangun dari **Atoms → Molecules → Organisms → Templates → Screens**.

```
Atoms       →  unit terkecil, tidak tahu domain IoT
Molecules   →  kombinasi atoms, boleh tahu 1 konsep UI
Organisms   →  komponen domain-aware, punya logika tampilan
Templates   →  layout kerangka tanpa data nyata
Screens     →  template + data dari store (Pages)
```

### 3.1 Navigasi & App Shell
- [x] Setup `NavigationContainer` di `App.tsx`
- [x] Buat `BottomTabNavigator` dengan tab:
  - 🏠 **Home** (Dashboard)
  - 🚪 **Rooms**
  - ⚙️ **Automations**
  - 🔧 **Settings**
- [x] Buat `StackNavigator` untuk navigasi dalam tab (Room Detail, Device Detail)
- [x] Implementasi `SafeAreaProvider` dan `GestureHandlerRootView`
- [x] Responsive layout: deteksi phone vs tablet dengan `useWindowDimensions`

---

### 3.2 ⚛️ Atoms — Unit Terkecil

> Stateless, tidak tahu Redux, hanya terima props.

- [x] **`AppText`** — Typography wrapper (variant: `heading`, `title`, `body`, `caption`, `label`)
- [x] **`AppButton`** — Button dengan variant (`primary`, `secondary`, `ghost`, `danger`) + loading state
- [x] **`AppIcon`** — Wrapper `react-native-vector-icons` dengan size & color dari theme
- [x] **`AppSwitch`** — Toggle switch dengan animasi warna (on = accent, off = surface)
- [x] **`AppBadge`** — Badge bulat dengan angka atau dot, untuk notif count
- [x] **`AppDivider`** — Garis pembatas horizontal/vertikal
- [x] **`AppSkeleton`** — Shimmer placeholder untuk loading state

> Setiap atom: `index.tsx` + `styles.ts` + unit test minimal.

---

### 3.3 🧪 Molecules — Kombinasi Atoms

> Kombinasi 2–3 atoms yang membentuk satu satuan UI fungsional.

- [x] **`StatusChip`** — `AppIcon` + `AppText` untuk status device (On/Off, Locked/Unlocked)
  - Props: `status: 'on' | 'off' | 'locked' | 'unlocked'`
- [x] **`DeviceToggleRow`** — `AppIcon` (device type) + `AppText` (nama) + `AppSwitch`
  - Props: `name`, `type`, `isOn`, `onToggle`
- [x] **`TemperatureControl`** — `AppButton` (`-`) + `AppText` (suhu) + `AppButton` (`+`)
  - Props: `value`, `min`, `max`, `onIncrease`, `onDecrease`
- [x] **`RoomHeader`** — `AppText` (nama room) + `AppBadge` (jumlah device) + `AppButton` (edit)
  - Props: `roomName`, `deviceCount`, `onEdit`
- [x] **`SummaryCard`** — `AppIcon` + `AppText` (label) + `AppText` (angka besar)
  - Props: `icon`, `label`, `value`, `color`
- [x] **`FormField`** — `AppText` (label) + `TextInput` (native) + error message
  - Props: `label`, `value`, `onChangeText`, `error?`
- [x] **`AutomationRow`** — `AppIcon` (device type) + `AppText` (nama + waktu) + `AppSwitch`
  - Props: `automation`, `onToggle`

---

### 3.4 🦠 Organisms — Komponen Domain-Aware

> Kompleks, bisa connect ke hook/selector, membentuk seksi UI yang mandiri.

- [x] **`DeviceCard`** — Card lengkap per device:
  - Gunakan `DeviceToggleRow` (light/lock) atau `TemperatureControl` (thermostat) atau Camera placeholder
  - Tambahkan swipe-to-delete via `react-native-gesture-handler`
  - Props: `device: Device`, `onToggle`, `onRemove`, `onPress`
- [x] **`DeviceList`** — `FlatList` dari `DeviceCard`
  - Filter: All / On / Off
  - Tombol **Add Device** di bagian bawah
  - `AppSkeleton` saat loading
- [x] **`RoomCard`** — Card room dengan nama, jumlah device, preview device aktif
  - Gunakan `RoomHeader` + row mini `StatusChip`
  - Props: `room: Room`, `devices: Device[]`, `onPress`, `onRename`, `onDelete`
- [x] **`RoomGrid`** — Grid/List dari `RoomCard` + tombol **Add Room**
  - Responsive: 1 kolom (phone) / 2 kolom (tablet)
- [x] **`DashboardSummary`** — Row 3–4 `SummaryCard` (Devices Active, Rooms, Automations, Avg Temp)
- [x] **`AutomationCard`** — Card per automation rule menggunakan `AutomationRow`
  - Tombol delete, navigate ke edit
- [x] **`AddDeviceForm`** — Form tambah device (nama, tipe, room) dalam Modal/BottomSheet
- [x] **`AddRoomForm`** — Form tambah/rename room (nama) dalam Dialog
- [x] **`AppBottomTabBar`** — Custom bottom tab bar dengan badge di tab Automations

---

### 3.5 🗂️ Templates — Layout Kerangka (Tanpa Data)

> Definisikan slot/region layout. **Tidak boleh import dari Redux store.**

- [x] **`DashboardTemplate`** — Slot: header, summary section, room grid section
- [x] **`RoomListTemplate`** — Slot: header, search bar (opsional), room grid, FAB add room
- [x] **`RoomDetailTemplate`** — Slot: room header, filter bar, device list, FAB add device
- [x] **`DeviceDetailTemplate`** — Slot: device header, main control area, chart area (opsional)
- [x] **`AutomationTemplate`** — Slot: header, automation list, FAB add automation
- [x] **`SettingsTemplate`** — Slot: theme toggle, language picker, app info

---

### 3.6 📱 Screens — Template + Data dari Store (Pages)

> Screen adalah "Pages" dalam Atomic Design. Inject data dari Redux ke template.

- [x] **`HomeScreen`** — `DashboardTemplate` + data dari `useSelector(deviceSlice)` & `roomSlice`
  - Greeting + tanggal/waktu (via `dayjs`)
  - "Next automation" info
- [x] **`RoomsScreen`** — `RoomListTemplate` + data dari `roomSlice` + `deviceSlice`
  - Dispatch `addRoom`, `deleteRoom`, `renameRoom`
- [x] **`RoomDetailScreen`** — `RoomDetailTemplate` + filter device by `roomId`
  - Dispatch `addDevice`, `removeDevice`, `toggleDevice`
- [x] **`DeviceDetailScreen`** — `DeviceDetailTemplate` + data device by `id`
  - Dispatch `adjustTemperature`, `toggleDevice`
  - *(Bonus)* LineChart historical temperature
- [x] **`AutomationsScreen`** — `AutomationTemplate` + data dari `automationSlice`
  - Dispatch `toggleAutomation`, `deleteAutomation`
- [x] **`AddAutomationScreen`** — Form screen, dispatch `addAutomation`
- [x] **`SettingsScreen`** — `SettingsTemplate` + `themeSlice` dispatch

---

### 3.7 Animasi & UX Polish
- [x] Gunakan `react-native-reanimated` untuk:
  - `AppSwitch`: animasi color transition (Atom level)
  - `DeviceCard`: scale down on press (Organism level)
  - `AppSkeleton`: shimmer pulse (Atom level)
  - Lock icon: rotasi saat toggle (Organism level)
- [x] `Snackbar` feedback setiap aksi (toggle, add, delete)
- [x] Pull-to-refresh di `RoomGrid`

### 3.8 Dark Mode
- [x] Semua komponen hanya gunakan theme tokens dari `useTheme()` (react-native-paper)
- [x] Toggle dark/light di `SettingsScreen`
- [x] Persist preferensi ke MMKV
- [x] Smooth transition saat ganti tema

---

## ✅ Phase 4 — Automation & Scheduling

> **Target:** Fitur automation rule dan scheduling berjalan dengan timer lokal.

### 4.1 Automation Screen
- [x] FlatList automation rules dengan `AutomationCard` component:
  - Nama rule, device target, waktu, action, toggle aktif/nonaktif
- [x] Tombol **Add Automation** → navigasi ke `AddAutomationScreen`
- [x] Swipe-to-delete atau menu delete
- [x] Toggle aktif/nonaktif per rule (via `toggleAutomation` reducer)

### 4.2 Add Automation Screen
- [x] Dropdown pilih device (dari semua device yang ada)
- [x] Dropdown pilih aksi: Turn On / Turn Off / Set Temperature
- [x] `TimePickerModal` untuk pilih waktu (HH:mm) — gunakan `@react-native-community/datetimepicker` / custom time picker
- [x] TextInput nama rule (opsional)
- [x] Tombol **Save** → dispatch `addAutomation`

### 4.3 Scheduler Logic
- [x] Buat `AutomationScheduler.ts` service
- [x] Setup interval `setInterval` setiap 60 detik (atau 5 detik precision), cek waktu sekarang vs schedule
- [x] Jalankan scheduler di `App.tsx` via `useEffect` (atau `AppRegistry`)
- [x] Ketika match: dispatch action ke Redux store (eksekusi device action)
- [x] Log eksekusi di console (untuk debug)

### 4.4 Display Active Schedules
- [x] Badge count di tab **Automations** (jumlah active rules)
- [x] "Next automation" info di Dashboard (device apa, jam berapa)

---

## ✅ Phase 5 — Testing & Polish

> **Target:** Minimum 3 unit test lulus, app stabil dan siap demo.

### 5.1 Unit Testing (`jest` + `@testing-library/react-native`)
- [x] Test `toggleDevice` reducer (device berhasil toggle on ↔ off)
- [x] Test `updateDeviceState` reducer (MQTT payload masuk → state terupdate)
- [x] Test `addRoom` reducer (room baru muncul di state)
- [x] Test `AutomationScheduler` logic (rule dieksekusi pada waktu yang benar)
- [x] Test `ToggleDeviceUseCase` (memanggil repository dengan benar)
- [x] Test `MqttService` publish (payload dikirim ke topic yang benar)
- [x] *(Bonus)* Component test `DeviceCard` renders dengan status yang benar
- [x] *(Bonus)* Component test `DeviceToggleRow` (molecule) toggle callback dipanggil
- [x] *(Bonus)* Component test `SummaryCard` (molecule) tampil konsisten

### 5.2 Bug Fixing & Stability
- [x] Test di Android emulator & device fisik
- [x] Test di iOS simulator (jika macOS)
- [x] Pastikan tidak ada `VirtualizedList` warning
- [x] Pastikan dark mode konsisten di semua screen
- [x] Test landscape orientation
- [x] Pastikan keyboard tidak menutupi input field (`KeyboardAvoidingView`)

### 5.3 Code Quality
- [x] Setup ESLint + Prettier (`npx react-native lint`)
- [x] Jalankan `tsc --noEmit` — 0 TypeScript error
- [x] Review konsistensi naming convention
- [x] Hapus `console.log` yang tidak perlu (kecuali scheduler log)
- [x] Tambahkan JSDoc comment pada fungsi-fungsi kritis

### 5.4 README.md
- [x] Deskripsi project
- [x] Daftar fitur yang diimplementasikan (centang ✅ yang selesai)
- [x] Tech stack & dependencies utama
- [x] **Instruksi setup app:**
  ```bash
  npm install
  cd ios && pod install && cd ..
  npx react-native run-android
  npx react-native run-ios
  ```
- [x] **Instruksi setup & jalankan simulator:**
  ```bash
  # 1. Jalankan MQTT broker
  docker compose up -d

  # 2. Jalankan HTTP server + MQTT publisher
  cd simulator && npm install && node server.js

  # 3. Kontrol device dari terminal (live update di app)
  node simulator.js toggle light-01
  node simulator.js set thermo-01 temp 28
  node simulator.js list
  ```
- [x] Dokumentasi **message contract** (MQTT topics + HTTP endpoints)
- [x] Screenshot / GIF demo live update (simulator → app)
- [x] Penjelasan keputusan arsitektur:
  - Kenapa Clean Architecture
  - Kenapa Atomic Design (Atoms → Molecules → Organisms → Templates → Screens)
  - Kenapa Redux Toolkit / Zustand
  - Kenapa MMKV
  - Kenapa MQTT.js (WebSocket transport) untuk RN
- [x] **Seksi AI Tools:** sebutkan tool AI yang digunakan dan untuk apa
  - Contoh: *"Used GitHub Copilot for boilerplate generation (reducers, types). All architecture decisions and logic written manually."*
- [x] Known issues / hal yang bisa diimprove

---

## 🎯 Phase 6 — Protocol Adapters & Multi-Protocol Device Provisioning (MQTT & HTTP)

> **Target:** Memenuhi 100% persyaratan brief Take-Home Test:
> 1. Form Add Device dengan pilihan protokol (MQTT & HTTP) dan detail koneksi (broker URL & topic untuk MQTT, base URL untuk HTTP).
> 2. Tiga device types standar brief: Light (on/off, brightness 0-100), Smart Plug (on/off), Sensor (temp & humidity, read-only).
> 3. Common Device Model + Protocol Adapters (MQTT & HTTP) di balik satu abstraksi seragam tanpa mengubah UI.
> 4. Live state update untuk kedua protokol (MQTT via subscription, HTTP via polling).
> 5. Kesiapan Demo Video: Menambahkan 1 device MQTT dan 1 device HTTP serta kontrol live.

### 6.1 Common Device Model & Type Enhancements
- [x] Update entity `Device` (`src/domain/entities/Device.ts`):
  - Tambahkan type `DeviceProtocol = 'mqtt' | 'http'`
  - Update `DeviceType = 'light' | 'plug' | 'sensor' | 'thermostat' | 'lock' | 'camera'`
  - Tambahkan struktur `connectionConfig`:
    ```ts
    interface DeviceConnectionConfig {
      brokerUrl?: string;     // MQTT broker URL (e.g. ws://localhost:9001)
      topic?: string;         // MQTT state/command topic
      baseUrl?: string;       // HTTP server URL (e.g. http://localhost:3001)
      pollIntervalMs?: number;// HTTP polling interval (default 5000ms)
    }
    ```
  - Pastikan property `protocol: DeviceProtocol` dan `connectionConfig?: DeviceConnectionConfig` tersimpan di state & MMKV.

### 6.2 Protocol Adapter Pattern (`src/data/adapters/`)
- [x] Buat interface abstraksi `IProtocolAdapter` (`src/domain/repositories/IProtocolAdapter.ts`):
  ```ts
  interface IProtocolAdapter {
    protocol: DeviceProtocol;
    sendState(device: Device, payload: MqttSetPayload): Promise<boolean>;
    subscribe(
      device: Device,
      onUpdate: (payload: MqttStatePayload) => void,
      onStatus: (status: DeviceStatus) => void
    ): () => void;
    disconnect?(): void;
  }
  ```
- [x] Implementasikan `MqttProtocolAdapter` (`src/data/adapters/MqttProtocolAdapter.ts`):
  - Membungkus `MqttService`
  - Mengirim perintah ke topic spesifik perangkat (`home/<deviceId>/set`)
  - Berlangganan ke topic state (`home/<deviceId>/state`) dan status (`home/<deviceId>/status`)
- [x] Implementasikan `HttpProtocolAdapter` (`src/data/adapters/HttpProtocolAdapter.ts`):
  - Mengirim perintah ke endpoint spesifik (`POST /devices/:id/set`)
  - Mengimplementasikan **live state polling** otomatis (`setInterval` tiap 5 detik ke `GET /devices/:id`) agar state perangkat HTTP tetap sinkron di UI tanpa manual refresh
- [x] Integrasikan `ProtocolAdapterRegistry` / refactor `DeviceRepositoryImpl`:
  - `DeviceRepository` mendelegasikan perintah berdasarkan `device.protocol`
  - UI tetap hanya berinteraksi dengan `Device` dan `DeviceRepository` (UI sama sekali tidak tahu protokol apa yang ada di baliknya)

### 6.3 Multi-Protocol "Add Device" Form UI (`AddDeviceForm`)
- [x] Tambahkan pemilih protokol di `AddDeviceForm`:
  - `SegmentedButtons` memilih: **MQTT** atau **HTTP**
- [x] Tambahkan pemilih 3 tipe standar brief:
  - 💡 **Light** (on/off, brightness 0-100)
  - 🔌 **Smart Plug** (on/off)
  - 🌡️ **Sensor** (temperature & humidity, read-only)
- [x] Dynamic connection fields berdasarkan protokol terpilih:
  - **Jika MQTT:**
    - Input `Broker URL` (default: `ws://localhost:9001`)
    - Input `Topic Prefix / Topic` (default: `home/demo-iot-app/<deviceId>`)
  - **Jika HTTP:**
    - Input `Base URL` (default: `http://localhost:3001`)
    - Input `Polling Interval (detik)` (default: `5`)
- [x] Validasi form & simpan device baru dengan protokol dan config yang lengkap ke Redux store & MMKV

### 6.4 UI & Controls Per Device Type
- [x] **Smart Plug Card & Detail:**
  - Tampilan kontrol switch ON/OFF simpel dengan daya aktif
- [x] **Sensor Card & Detail:**
  - Tampilan metrik Temperature (°C) dan Humidity (%) secara read-only tanpa toggle power
- [x] **Light Card & Detail:**
  - Toggle ON/OFF dan preset brightness (25%, 50%, 75%, 100%)
- [x] Indikator protokol pada DeviceCard:
  - Badge visual `[MQTT]` atau `[HTTP]` pada setiap kartu perangkat agar terlihat jelas saat demo video

### 6.5 Testing & Demo Video Checklist Verification
- [x] Unit test untuk `MqttProtocolAdapter` dan `HttpProtocolAdapter` (mocked transport)
- [x] Unit test verifikasi penambahan 1 perangkat MQTT dan 1 perangkat HTTP
- [x] Verifikasi skenario Demo Video:
  - [x] 1. Adding one MQTT device and one HTTP device melalui form UI
  - [x] 2. Controlling a light and a plug from the app
  - [x] 3. Changing a device's state from the simulator and the app updating live
  - [x] 4. At least one error case, such as a broker that can't be reached (menampilkan banner/pesan jelas)

---

## ✅ Phase 8 — Bonus Features (Opsional)

> **Target:** Tingkatkan skor evaluasi dengan fitur tambahan.

### 8.1 Local Push Notifications
- [ ] Install `@notifee/react-native`
- [ ] Request permission notifikasi
- [ ] Trigger notifikasi dari `AutomationScheduler` ketika rule dieksekusi
- [ ] Notifikasi tampilkan: nama rule + device + aksi yang dilakukan

### 8.2 Charts/Graphs (Thermostat)
- [ ] Install `react-native-chart-kit` atau `victory-native`
- [ ] Buat mock historical temperature data (24 titik per jam)
- [ ] Tampilkan `LineChart` di Device Detail screen (thermostat)
- [ ] Label X-axis: jam (00:00 – 23:00), Y-axis: suhu (°C)

### 8.3 Multi-language (Lokalisasi)
- [ ] Install `react-i18next` + `i18next`
- [ ] Buat file translasi `en.json` dan `id.json`
- [ ] Language switcher di Settings screen
- [ ] Persist pilihan bahasa ke MMKV

### 8.4 Custom Themes
- [ ] Buat 2+ color scheme custom (misal: Ocean Blue, Warm Amber)
- [ ] Theme selector UI di Settings screen
- [ ] Persist pilihan theme ke MMKV

### 8.5 Accessibility
- [ ] Tambahkan `accessibilityLabel` dan `accessibilityHint` pada semua interactive elements
- [ ] Pastikan contrast ratio memenuhi WCAG AA
- [ ] Test dengan TalkBack (Android) / VoiceOver (iOS)

---

## ✅ Phase 9 — Deliverables & Submission

> **Target:** Semua deliverable siap, app di-submit tepat waktu.

### 9.1 GitHub Repository
- [ ] Repository bersih, commit history rapi & deskriptif
- [ ] Branch naming jelas (`main` / `dev` / `feature/room-management`)
- [ ] Tidak ada file sensitif di repo (`.env`, keystore, certificates)
- [ ] README.md lengkap (lihat Phase 5.4)

### 9.2 One Architecture Slide (PDF/PNG di `/docs`)
- [ ] Diagram arsitektur Clean Architecture + Protocol Adapter (UI -> State -> Model -> Protocol Adapters -> Transports)
- [ ] Diagram data flow untuk command (User tap toggle -> Adapter -> Device)
- [ ] Diagram data flow untuk state update (Device changes -> Adapter/MQTT/Polling -> Store -> Screen)

### 9.3 Demo Video (3–5 Menit)
- [ ] Skenario 1: Adding one MQTT device & one HTTP device
- [ ] Skenario 2: Controlling a light and a plug from the app
- [ ] Skenario 3: Changing a device's state from the simulator and the app updating live
- [ ] Skenario 4: At least one error case (broker offline)
- [ ] Upload video (YouTube unlisted / Google Drive) & sertakan link di README

### 9.4 Submit
- [ ] Kirim email balasan ke recruiter dengan link repo, link video, dan link slide
- [ ] Double-check semua link accessible (public)

---

## 📅 Timeline Rekomendasi

| Hari | Focus |
|---|---|
| **Hari 1 (Pagi)** | Phase 1: Setup RN CLI, struktur folder, semua dependencies |
| **Hari 1 (Siang)** | Phase 2: Docker Mosquitto, simulator server, CLI simulator, verifikasi E2E |
| **Hari 1 (Malam)** | Phase 3: Types, MQTT/HTTP service, mock fallback, repository, Redux store |
| **Hari 2** | Phase 4: Navigasi, Atoms, Molecules, Organisms — bangun UI dari bawah ke atas |
| **Hari 3** | Phase 4 (lanjut): Templates, Screens, real-time control, animasi, dark mode |
| **Hari 4 (Pagi)** | Phase 5: Automation screen & scheduler |
| **Hari 4 (Siang)** | Phase 6: Protocol Adapters & Multi-Protocol Provisioning (MQTT & HTTP) |
| **Hari 4 (Malam)** | Phase 7: Testing, bug fixing, code quality, README |
| **Hari 5** | Phase 8 (bonus, opsional) + Phase 9: Deliverables (Video, Slide) & Submit |

---

## 🛠️ Tech Stack Summary

| Kategori | Pilihan |
|---|---|
| **Framework** | React Native CLI (latest stable) |
| **Language** | TypeScript (strict mode) |
| **State Management** | Redux Toolkit + react-redux *(atau Zustand)* |
| **Storage** | react-native-mmkv |
| **MQTT Client** | mqtt (MQTT.js) via WebSocket transport |
| **HTTP Client** | axios |
| **MQTT Broker** | Mosquitto 2 via Docker *(fallback: test.mosquitto.org)* |
| **Mock Server** | json-server atau Express (`simulator/`) |
| **Navigation** | React Navigation v6 |
| **UI Library** | react-native-paper (Material Design 3) |
| **Animasi** | react-native-reanimated v3 |
| **Testing** | Jest + @testing-library/react-native |
| **Architecture** | Clean Architecture + Atomic Design |
| **Platform** | Android & iOS |

---

## 🗒️ Catatan Teknis

> [!IMPORTANT]
> **AI Tools** boleh digunakan (Copilot, Cursor, dll.) — tapi **wajib didokumentasikan** di README. Sebutkan secara spesifik dipakai untuk apa (boilerplate, autocomplete, review) dan pastikan logika utama & keputusan arsitektur ditulis sendiri.

> [!TIP]
> Prioritaskan **Code quality & architecture (30%)** dan **Feature completeness (25%)**. Atomic Design membuat struktur komponen sangat jelas dan mudah di-review — ini nilai jual utama di kriteria arsitektur.

> [!NOTE]
> **Aturan Atomic Design yang wajib dipatuhi:**
> - **Atoms** tidak boleh import dari Redux store atau domain layer
> - **Molecules** tidak boleh import dari Redux store, hanya terima props dari parent
> - **Organisms** boleh pakai custom hooks tapi lebih baik terima data via props dari Screen
> - **Templates** tidak boleh import data nyata, hanya layout dan slot
> - **Screens** adalah satu-satunya layer yang boleh connect langsung ke Redux store

> [!NOTE]
> **MQTT via WebSocket:** React Native tidak support TCP native, gunakan MQTT.js dengan transport `ws://` (port 9001 untuk Mosquitto lokal) atau `wss://` (port 8081 untuk test.mosquitto.org). Gunakan **unique topic prefix** di public broker agar tidak bentrok user lain.

> [!WARNING]
> React Native CLI memerlukan setup environment yang lebih manual dibanding Expo. Pastikan Android Studio (+ NDK) dan Xcode sudah terkonfigurasi dengan benar sebelum mulai coding.

---

*Last updated: 2026-11-25 — v4 (React Native CLI + Clean Architecture + Atomic Design + MQTT/HTTP + Simulator)*
