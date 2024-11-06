FROM node:20.14-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

# Install necessary packages for build
RUN apk add --no-cache \
  g++ \
  make \
  python3

RUN npm install

COPY . .

RUN npm run build

# -------- Production Image Setup --------
FROM node:20.14-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static

RUN npm install --only=production

EXPOSE 3000

CMD ["node", "server.js"]