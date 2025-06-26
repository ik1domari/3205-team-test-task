FROM node:23-alpine

WORKDIR /usr/src/server
COPY . .

RUN yarn

EXPOSE 8080

CMD ["yarn", "start:prod"]