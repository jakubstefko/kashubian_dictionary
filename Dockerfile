FROM node:18-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
COPY . ./
RUN npm run build
RUN apk --no-cache add curl
ENTRYPOINT ["npm", "run", "start"]
EXPOSE 3000