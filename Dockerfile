FROM node:18.20.4-alpine

LABEL authors="ddung203"

WORKDIR /app

COPY . .

# Installing dependencies
RUN yarn

# Set node environment
ENV NODE_ENV production

# Starting our application
CMD [ "yarn", "pro" ]

# Exposing server port
EXPOSE 8181