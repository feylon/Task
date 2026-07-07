# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# COPY tsconfig.json ./
# COPY src ./src
# RUN npm run build

# FROM node:20-alpine

# WORKDIR /app

# COPY --from=builder /app/dist ./dist
# COPY data ./data

# CMD ["node", "dist/index.js"]


FROM node:22-alpine

# TSConfig dagi mutlaq yo'llarga moslashish uchun WORKDIR ni shunday sozlaymizki,
# papka strukturasi kompyuteringizdagiga o'xshash bo'lsin
WORKDIR /iquarix-full-stack-test-simulator/simulator

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

CMD ["npm", "start"]