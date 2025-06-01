FROM nginx:stable

RUN apt update && apt install -y nodejs npm && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN npm install

RUN npm run build

RUN rm -rf /usr/share/nginx/html/*

RUN mv /app/dist/* /usr/share/nginx/html/

COPY certs/selfsigned.crt /etc/nginx/certs/selfsigned.crt
COPY certs/selfsigned.key /etc/nginx/certs/selfsigned.key

# Use custom Nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80
EXPOSE 443


CMD ["nginx", "-g", "daemon off;"]
