FROM node:20-alpine AS base

WORKDIR /api

COPY package.json .

RUN npm i

COPY . .

FROM base as prod

ENV NODE_PATH=./dist

RUN npm run build
