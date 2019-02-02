# build stage
FROM node:9.11.1-alpine as build-stage
WORKDIR /app
COPY package.json yarn.lock ./

RUN npm i yarn -g --registry=https://registry.npm.taobao.org
RUN yarn --registry=https://registry.npm.taobao.org

COPY . .
RUN yarn lint
RUN yarn build

# production stage
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]