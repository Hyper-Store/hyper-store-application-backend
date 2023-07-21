
FROM node:16-alpine

WORKDIR /home/node/app


COPY package*.json ./

RUN npm install
# USER node

CMD [ "tail", "-f", "/dev/null" ]


