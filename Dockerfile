FROM node:20-alpine AS builder

LABEL authors="ddung203"

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:20-alpine

LABEL authors="ddung203"

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./

ENV NODE_ENV=production

CMD ["yarn", "start"]

EXPOSE 8181
