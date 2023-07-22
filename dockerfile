FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

RUN npm uninstall bcrypt
RUN npm install --build-from-source=bcrypt
RUN npx prisma generate

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]