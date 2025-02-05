FROM ubuntu:22.04
RUN apt-get update && apt-get install -y gpredict
COPY run_gpredict.sh /run_gpredict.sh
RUN chmod +x /run_gpredict.sh
CMD ["/run_gpredict.sh"]
