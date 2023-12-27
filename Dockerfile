FROM node:slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN apt-get update -y && apt-get install -y openssl
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "dev"]