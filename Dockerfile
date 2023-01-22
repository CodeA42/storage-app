FROM node:18.12.1

COPY package*.json ./

RUN npm i --force

COPY . .