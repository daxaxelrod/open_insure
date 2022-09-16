FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
RUN npm run build
ENV NODE_ENV production

EXPOSE 3000

CMD [ "npx", "serve", "build" ]
