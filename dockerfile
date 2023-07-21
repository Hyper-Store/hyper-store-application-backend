FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --build-from-source=bcrypt
RUN npx prisma generate

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]

