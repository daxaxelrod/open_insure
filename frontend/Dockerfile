FROM node:alpine
WORKDIR /app

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL ${REACT_APP_BACKEND_URL}
ENV G_TAG_ID ${G_TAG_ID}

COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
RUN npm run build
ENV NODE_ENV production



EXPOSE 3000

CMD [ "npx", "serve", "-s", "build" ]
