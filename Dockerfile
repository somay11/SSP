# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve with Backend
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
RUN npm install --prefix backend
COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/dist ./backend/public

# Set production context
ENV NODE_ENV=production
ENV PORT=5000

# Expose port and start
EXPOSE 5000
CMD ["node", "backend/index.js"]
