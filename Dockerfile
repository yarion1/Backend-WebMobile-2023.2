FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY ./.env.production ./.env

CMD [ "npm", "run", "start:dev" ]