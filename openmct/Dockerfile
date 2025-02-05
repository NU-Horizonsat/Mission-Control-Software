FROM node:14

WORKDIR /openmct

COPY package.json .
RUN npm install

COPY server.js .
COPY plugins/ ./plugins/
COPY index.html .  # If you have a basic index.html referencing your plugins

EXPOSE 8080
CMD ["npm", "start"]
