FROM node:18.20.4

LABEL authors="ddung203"

WORKDIR /app

COPY . .

# Installing dependencies
RUN yarn

# Starting our application
CMD [ "yarn", "s:dev" ]

# Exposing server port
EXPOSE 8181