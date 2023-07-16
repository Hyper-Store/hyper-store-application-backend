
FROM node:16-alpine

WORKDIR /home/node/app

USER node

COPY package*.json ./

CMD [ "tail", "-f", "/dev/null" ]