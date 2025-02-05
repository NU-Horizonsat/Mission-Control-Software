from ait.core.server import telemetry
import time

def process_telemetry(data):
    print(f"[AIT] Received telemetry: {data}")

def main():
    # Register a callback for telemetry
    telemetry.register_callback(process_telemetry)
    print("[AIT] Telemetry Handler started.")
    while True:
        time.sleep(1)

if __name__ == "__main__":
    main()
