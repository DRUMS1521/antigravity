FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL=https://comfenalco-backend-production.up.railway.app
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
