FROM python:2.7

WORKDIR /greenctld

# Install dependencies (if any—libncurses5-dev is optional for curses usage)
RUN apt-get update && apt-get install -y libncurses5-dev && rm -rf /var/lib/apt/lists/*
RUN pip install pyserial

# Clone the greenctld code from GitHub
RUN git clone https://github.com/mct/greenctld.git .

# Make the main script executable (sometimes optional)
RUN chmod +x greenctld

# Expose the default TCP port (4533) used by greenctld
EXPOSE 4533

# Default command to run greenctld with RT-21 settings
CMD ["python", "greenctld", \
     "--az-device", "/dev/ttyUSB0", \
     "--el-device", "/dev/ttyUSB1", \
     "--speed", "9600", \
     "--port", "4533"]
