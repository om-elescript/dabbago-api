FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
ENV PORT=8080
CMD ["node", "server.js"]
