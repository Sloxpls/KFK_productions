FROM node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm i
RUN npm run build

FROM nginx:stable

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
