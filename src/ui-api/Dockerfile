FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN npm install

FROM node:20-alpine
WORKDIR /app

RUN npm install -g pm2 && \
  apk add --no-cache nginx

COPY --from=build /app .

COPY pm2.config.js /app/pm2.config.js

COPY nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 3001

CMD ["sh", "-c", "nginx -g 'daemon off;' & pm2-runtime start pm2.config.js"]
