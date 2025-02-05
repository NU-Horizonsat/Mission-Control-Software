FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y build-essential git libncurses5-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /greenctld

# Clone the greenctld repo (from mct's GitHub)
RUN git clone https://github.com/mct/greenctld.git .
RUN make

COPY start_greenctld.sh /greenctld/start_greenctld.sh
RUN chmod +x /greenctld/start_greenctld.sh

EXPOSE 4533

CMD ["/greenctld/start_greenctld.sh"]
