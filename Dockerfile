FROM node:12 AS build
WORKDIR /usr/src/app
COPY package* ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8700
CMD [ "npm", "run", "start" ]