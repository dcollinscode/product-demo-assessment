FROM node:20-alpine

WORKDIR /app

# Copy package files first so this layer is cached
# Docker only re-runs npm install if package.json changes
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host 0.0.0.0 is required — without it Vite only listens on localhost
# inside the container, which makes it unreachable from your browser
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]