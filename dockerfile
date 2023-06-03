FROM node:18-alpine

RUN apk add bash

WORKDIR /app
RUN yarn global add @nestjs/cli
RUN yarn global add rimraf

COPY package*.json ./

RUN yarn --force

COPY . .

RUN yarn build

RUN env
RUN ls

# make sure this port matches the ENV
EXPOSE 3030

CMD ["yarn", "prod"]
