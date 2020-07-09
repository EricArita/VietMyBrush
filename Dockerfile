FROM node:8-slim

WORKDIR /server

COPY . /server
RUN yarn build

EXPOSE 6000
CMD [ "yarn", "start" ]