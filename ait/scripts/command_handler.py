import sys
from ait.core.server import uplink

# Usage: command_handler.py <SatelliteName> <CommandName>
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 command_handler.py <SatelliteName> <CommandName>")
        sys.exit(1)

    sat_name = sys.argv[1]
    cmd_name = sys.argv[2]
    # Here you'd format a CCSDS packet or mission-specific command
    packet = f"{cmd_name} for {sat_name}"
    uplink.send(packet)
    print(f"[AIT] Sent command: {packet}")
