# Ground Station Mission Control

A containerized ground station software stack that integrates:

1. **GreenCTLD** for controlling a Green Heron RT-21 rotor controller  
2. **GNU Radio** for SDR signal processing  
3. **Gpredict** for satellite tracking (optionally containerized)  
4. **AIT** (NASA AMMOS Instrument Toolkit) for telemetry & command  
5. **OpenMCT** for a modern, web-based mission control dashboard  
6. **Go-based Mission Control** backend for REST endpoints, pass scheduling, and integration  
7. **Docker Compose** orchestration

## Features

- **Rotor Control**: GreenCTLD emulates a `rotctld`-like interface for the RT-21.  
- **Signal Processing**: GNU Radio handles demodulation & decoding.  
- **Telemetry & Command**: AIT decodes and processes satellite telemetry, and handles commands.  
- **Web Dashboard**: OpenMCT for real-time monitoring, scheduling, and commanding.  
- **Pass Predictions**: Gpredict (optionally) or built-in TLE-based pass predictions in Go.  
- **Scalability**: Designed to run on an Intel NUC with Docker Compose, easily extended or replicated.

---

## Getting Started

### 1. Prerequisites

- **Docker** and **Docker Compose** installed on your host (e.g., Intel NUC).  
- (Optional) **VNC viewer** if you want to run Gpredict in a container with a GUI, or run Gpredict locally.

### 2. Clone the Repository

```bash
git clone https://github.com/NU-Horizonsat/Mission-Control-Software.git
cd Mission-Control-Software
```

### 3. Configure Satellites

Open `go-mission-control/config/satellites.json` and edit:

```json
{
  "satellites": [
    {
      "name": "ISS",
      "norad_id": 25544,
      "frequency": 145.800,
      "commands": ["BEACON", "STATUS", "REBOOT"]
    }
  ]
}
```

- `name` is used by the UI/REST calls.  
- `norad_id` is used for TLE-based pass predictions.  
- `frequency` is an example for rig/rotor control flows.  
- `commands` are sample commands recognized by your mission logic.  

### 4. Build and Launch

```bash
docker-compose up --build
```

This will:

- Build all containers:  
  - `go-mission-control` (the main Go REST backend)  
  - `greenctld` (rotor control)  
  - `gnuradio` (signal processing)  
  - `ait` (telemetry & command)  
  - `openmct` (web dashboard)  
  - `gpredict` (optional, if enabled in `docker-compose.yml`)  
- Start them in the correct order.  

## 5. Usage

### 5.1 Mission Control (Go Backend)

- **Base URL**: `http://localhost:8081` (example port)  
- **Endpoints**:  
  - `POST /api/send-command` – Send immediate command  
  - `POST /api/schedule-command` – Schedule a command in the future  
  - `POST /api/track-satellite` – Pass rotor angles to GreenCTLD  
  - `GET /api/predict-passes?satellite=ISS` – Return upcoming passes (by NORAD ID or name)  

### 5.2 OpenMCT

- **UI**: Open `http://localhost:8080` in your browser.  
- Click on your custom panels (Command, Scheduler, Tracking) to send commands or schedule them.  
- Telemetry data from AIT will appear in real-time in your dashboards.  

### 5.3 Gpredict (Optional)

If you included the Gpredict container:

- By default, you can connect to it via VNC or run it locally.  
- Configure Gpredict’s rotor interface to point to `greenctld` on port `4533`.  

### 5.4 GNU Radio

- The container runs a default `flowgraph.grc`.  
- You can modify or replace it with your own flowgraph.  
- Data can be piped into AIT’s telemetry handler if you want real-time decoding.  

## Troubleshooting

### Check Docker Logs

```bash
docker-compose logs -f go-mission-control
docker-compose logs -f greenctld
```

### Verify Serial Ports

Ensure `/dev/ttyUSB0` and `/dev/ttyUSB1` are correct for your RT-21.  

### GreenCTLD Issues

If you see issues with rotor commands, exec into the container and run:

```bash
./start_greenctld.sh
```

to test.
