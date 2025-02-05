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
git clone https://github.com/YourOrg/ground-station.git
cd ground-station
