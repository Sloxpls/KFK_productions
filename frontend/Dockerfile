FROM nginx:stable

RUN apt update && apt install -y nodejs npm && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN npm install

RUN npm run build

RUN rm -rf /usr/share/nginx/html/*

RUN mv /app/dist/* /usr/share/nginx/html/

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
