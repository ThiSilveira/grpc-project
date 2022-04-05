FROM node:latest

ENV TZ=America/Sao_Paulo
ENV DOCKER_CONTAINER=1

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

COPY package*.json ./
COPY . ./prisma/

RUN npm install && npm rebuild bcrypt --build-from-source && npm cache clean --force

COPY . .

CMD ["npm", "run", "start:dev"]