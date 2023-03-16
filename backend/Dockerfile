FROM node:16-alpine

WORKDIR /api

COPY package.json .

RUN npm install && npm i -g nodemon

COPY . .

CMD ["npm", "start"]
