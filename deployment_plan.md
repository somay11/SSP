# Deployment Strategy: Smart Study Planner (SSP)

This document outlines the step-by-step process for deploying the **Smart Study Planner** MERN application. 

## 🚀 Recommended Approach: Vercel (Frontend) + Render (Backend)

This is the most standard and cost-effective method for MERN stack applications.

### 1. Database (MongoDB Atlas)
- **Status:** Required
- **Setup:**
  1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
  2. In "Network Access", allow access from `0.0.0.0/0` (standard for Render's dynamic IPs).
  3. Get your connection string. Format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart_study_planner?retryWrites=true&w=majority`.

### 2. Backend Deployment (Render)
1. **GitHub:** Connect your repository to [Render](https://render.com).
2. **New Web Service:** Select the `SSP` repository.
3. **Configuration:**
   - **Name:** `ssp-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
4. **Environment Variables:**
   | Variable | Value |
   | :--- | :--- |
   | `PORT` | `10000` (Render default) |
   | `MONGO_URI` | *Your MongoDB Atlas connection string* |
   | `JWT_SECRET` | *A long random string* |
   | `CLIENT_URL` | *Your finalized Vercel frontend URL (e.g., https://ssp-frontend.vercel.app)* |
   | `NODE_ENV` | `production` |

### 3. Frontend Deployment (Vercel)
1. **GitHub:** Connect your repository to [Vercel](https://vercel.com).
2. **Framework:** Select **Vite**.
3. **Configuration:**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:**
   | Variable | Value |
   | :--- | :--- |
   | `VITE_API_URL` | *Your Render backend URL + /api (e.g., https://ssp-backend.onrender.com/api)* |

---

## 🐳 Alternative: Docker Deployment
If you prefer a single-container deployment (or using AWS/DigitalOcean), use this multi-stage Dockerfile.

### Create `Dockerfile` in the Root Directory:

```dockerfile
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

# Update backend/index.js to serve static files
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "backend/index.js"]
```

> [!NOTE]
> If using the Docker approach, you must add `app.use(express.static(path.join(__dirname, 'public')))` to your `backend/index.js` to serve the React frontend.

---

## 🛠️ Code Update: CORS & Static Serving
To make the backend production-ready for both scenarios:

### Updated `backend/index.js` (Recommended)
```javascript
// Add these at the top
const path = require('path');

// ... existing CORS config ...
app.use(cors({
  origin: process.env.CLIENT_URL || '*', 
  credentials: true
}));

// ... routes ...

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
}
```

---

## ✅ Pre-Deployment Checklist
- [ ] **Auth:** Ensure `JWT_SECRET` is set in production.
- [ ] **API URL:** Check `frontend/src/services/api.js` uses `import.meta.env.VITE_API_URL`.
- [ ] **CORS:** Ensure `CLIENT_URL` in backend matches the frontend URL perfectly (no trailing slash).
- [ ] **Dependencies:** Ensure `node_modules` are not committed (check `.gitignore`).
- [ ] **Build Check:** Run `npm run build` locally in `frontend/` to ensure no build errors.
