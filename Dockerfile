FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app .
# No build step detected
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
