FROM node:20-alpine

LABEL authors="ddung203"

WORKDIR /app

COPY yarn.lock ./

COPY package.json ./

RUN yarn

COPY . .

RUN yarn build

ENV NODE_ENV production

CMD [ "yarn", "start" ]

EXPOSE 8181