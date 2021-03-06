# build stage
FROM node:9 as build-stage
WORKDIR /app
COPY package.json yarn.lock ./

RUN npm i yarn -g --registry=https://registry.npm.taobao.org

RUN yarn config set registry https://registry.npm.taobao.org
RUN yarn

COPY . .
RUN yarn lint
RUN yarn build

# production stage
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html/

WORKDIR /app

RUN rm /etc/nginx/conf.d/default.conf
ADD nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]