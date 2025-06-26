FROM node:23-alpine

WORKDIR /usr/src/frontend

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 5713

ENTRYPOINT ["yarn", "dev", "--host=0.0.0.0"]
