FROM node:16-alpine
WORKDIR /server

COPY package*.json ./

COPY . /server

RUN ["npm", "i"]
CMD ["npm", "start"]