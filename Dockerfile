FROM nginx:alpine
LABEL maintainer="Andrei Varabyeu <andrei_varabyeu@epam.com>"
LABEL version=5.0.0-BETA-8
ENV APP_DOWNLOAD_URL https://dl.bintray.com/epam/reportportal/5.0.0-BETA-8
ADD ${APP_DOWNLOAD_URL}/ui.tar.gz /
RUN tar -zxvf ui.tar.gz -C /usr/share/nginx/html && rm -f ui.tar.gz
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
