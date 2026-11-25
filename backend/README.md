# 📡 Universal IoT Backend & Device Simulator

Folder ini berisi infrastruktur backend mock dan simulator perangkat IoT untuk pengujian aplikasi **Universal IoT Home App**.

---

## 🏗️ Komponen

1. **MQTT Broker (Eclipse Mosquitto)**
   - Port `1883`: TCP MQTT
   - Port `9001`: WebSocket MQTT (dipakai oleh client React Native via MQTT.js)
   - Konfigurasi: `mosquitto/config/mosquitto.conf`
   - Docker Compose: `docker-compose.yml`

2. **HTTP Mock Server (json-server)**
   - Database: `db.json` (Devices, Rooms, Automations)
   - Port: `3001`
   - Custom Middleware: `middleware.js` (mendukung `POST /devices/:id/set` dan broadcast MQTT)
   - Routes: `routes.json`

3. **Device Simulator CLI (`simulator.js`)**
   - Script mandiri untuk mensimulasikan perubahan state perangkat IoT dari terminal.
   - Perubahan otomatis ter-update di `db.json` dan dipublish ke topic MQTT agar aplikasi React Native ter-update secara **live**.

---

## 📋 Message Contract

### MQTT Topics
| Topic | Arah | Payload Contoh | Deskripsi |
|---|---|---|---|
| `home/<deviceId>/state` | Device → App | `{"on": true, "brightness": 70}` | State perubahan perangkat |
| `home/<deviceId>/set` | App → Device | `{"on": false}` | Perintah kontrol dari aplikasi |
| `home/<deviceId>/status` | Device → App | `"online"` / `"offline"` | Status konektivitas (retained) |

### HTTP Endpoints
| Method | Endpoint | Payload / Response | Deskripsi |
|---|---|---|---|
| `GET` | `/devices` | `[{ id, name, type, roomId, on, ... }]` | Ambil seluruh daftar perangkat |
| `GET` | `/devices/<deviceId>` | `{"on": true, "brightness": 70}` | Ambil data satu perangkat |
| `POST` | `/devices/<deviceId>/set` | Body: `{"on": false}` | Ubah state perangkat dari HTTP |
| `GET` | `/rooms` | `[{ id, name }]` | Ambil daftar ruangan |

---

## 🚀 Cara Menjalankan

### 1. Jalankan MQTT Broker (Mosquitto)
```bash
# Menjalankan Mosquitto via Docker
docker compose up -d

# Atau jalankan dari folder backend
cd backend && docker compose up -d
```
*(Catatan: Jika Docker tidak tersedia di lingkungan Anda, simulator dan aplikasi dapat menggunakan public broker `test.mosquitto.org:1883` / `wss://test.mosquitto.org:8081`).*

### 2. Jalankan HTTP Mock Server
```bash
cd backend
npm install
npm start
```
Server akan berjalan di `http://localhost:3001`.
Verifikasi endpoint:
```bash
curl http://localhost:3001/devices
curl http://localhost:3001/devices/light-01
```

### 3. Menggunakan Device Simulator CLI
Jalankan simulator untuk mengubah status perangkat secara langsung:

```bash
# Lihat daftar perangkat dan status saat ini
node simulator.js list

# Toggle nyala/mati perangkat
node simulator.js toggle light-01
node simulator.js toggle lock-01

# Ubah suhu thermostat
node simulator.js temp thermo-01 26.5

# Ubah brightness lampu
node simulator.js set light-01 brightness 95

# Simulasi status online/offline
node simulator.js status cam-01 offline

# Jalankan dalam mode daemon (mendengarkan perintah kontrol dari app & simulasi fluktuasi sensor berkala)
node simulator.js daemon
```
