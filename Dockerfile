FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

COPY .env .env.development ./

EXPOSE 3001

CMD ["npm", "run", "start:dev"]