FROM ubuntu:22.04

RUN apt-get update && apt-get install -y gnuradio

WORKDIR /gnuradio
COPY flowgraph.grc /gnuradio/flowgraph.grc
COPY process_signal.sh /gnuradio/process_signal.sh
RUN chmod +x /gnuradio/process_signal.sh

CMD ["/gnuradio/process_signal.sh"]
