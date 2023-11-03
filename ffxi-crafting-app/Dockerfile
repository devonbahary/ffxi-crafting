FROM node:20-alpine as base

WORKDIR /app

COPY package.json .

RUN npm i

COPY . . 

FROM base as prod

ENV NODE_PATH=./dist

RUN npm run build

RUN npm i -g serve