FROM python:3.7

RUN pip install "ait-core"

WORKDIR /ait
COPY scripts/ /ait/scripts/
COPY config.json /ait/

CMD ["python", "/ait/scripts/telemetry_handler.py"]
