# frontend/Dockerfile
FROM nginx:stable

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom config
COPY default.conf /etc/nginx/conf.d/

# Copy all static files (HTML, CSS, JS) into the default web root
COPY . /usr/share/nginx/html

# Expose port 80 in the container
EXPOSE 80

# Use default nginx start command
