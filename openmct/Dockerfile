FROM node:18

WORKDIR /openmct

COPY package.json .
RUN npm install

COPY server.js .
#COPY commandPlugin.js .
#COPY schedulerPlugin.js .
#COPY trackingPlugin.js .
COPY index.html .

EXPOSE 8080
CMD ["npm", "start"]
