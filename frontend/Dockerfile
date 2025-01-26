FROM nginx:stable

RUN rm /etc/nginx/conf.d/default.conf

COPY default.conf /etc/nginx/conf.d/

COPY . /usr/share/nginx/html

EXPOSE 80

