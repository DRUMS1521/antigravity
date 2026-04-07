FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve@13

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
