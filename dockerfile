
FROM node:16-alpine

WORKDIR /app


COPY package*.json ./


RUN npm install --only=production

COPY . .

CMD [ "tail", "-f", "/dev/null" ]