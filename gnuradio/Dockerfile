FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN ln -fs /usr/share/zoneinfo/America/New_York /etc/localtime && \
    apt-get update && apt-get install -y tzdata

RUN dpkg-reconfigure --frontend noninteractive tzdata

RUN apt-get update && apt-get install -y gnuradio

RUN apt-get update && apt-get install -y gnuradio \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /gnuradio
COPY flowgraph.grc /gnuradio/flowgraph.grc
COPY process_signal.sh /gnuradio/process_signal.sh
RUN chmod +x /gnuradio/process_signal.sh

CMD ["/gnuradio/process_signal.sh"]
