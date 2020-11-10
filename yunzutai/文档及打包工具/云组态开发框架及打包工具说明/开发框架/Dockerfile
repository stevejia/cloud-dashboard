FROM harbor06.chint.com/chint-public/nginx:frond
LABEL version="1.1.1"
ENV LANG en_US.UTF-8
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
ENV LANG en_US.UTF-8
COPY dist/ /data/www/
CMD ["nginx","-g","daemon off;"]
EXPOSE 80
