# Smart Study Planner 🚀

**Smart Study Planner** is a full-stack, premium productivity application designed for students and life-long learners. It features a modern Glassmorphism UI, fluid Framer Motion animations, and a robust Node.js/MongoDB backend.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide React, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), dotenv, CORS.
- **Styling**: Glassmorphism design system with custom CSS variables.

---

## 🚀 Quick Start (Recommended)

The project includes specialized Windows batch files to handle the entire setup and launch process:

*   **`run_server.bat`**: Best for first-time setup or when dependencies change.
    - Installs all frontend and backend dependencies.
    - Cleans up any old processes.
    - Starts both servers in separate windows.
    - Automatically opens the planner in your browser.
*   **`quick_server.bat`**: Best for daily development.
    - Installs nothing; immediately cleans ports and launches the app.

---

## ✨ Features

- **🏆 Live Dashboard**: Real-time stats, AI-driven study strategy suggestions, and activity heatmaps.
- **✅ Task Management**: Full CRUD operations with priority levels, category filtering, and streak tracking.
- **⏲️ Focus Chamber**: A premium Pomodoro timer with auto-cycling sessions to maximize deep work.
- **📅 Smart Calendar**: Interactive monthly success roadmap for visualizing milestones and deadlines.
- **🤖 AI Study Assistant**: Integrated AI support for study planning and materials.
- **📝 Rapid Notes**: Quick note-taking system with markdown support.
- **🛡️ Secure Auth**: Robust JWT-based authentication system for personalized data storage.

---

## 🔧 Critical Fixes & Improvements

The project has recently undergone significant stabilization and optimization. Below is a summary of the key challenges encountered and their resolutions:

### 🐛 Bug Report & Resolution Log

| Issue | Description | Resolution |
| :--- | :--- | :--- |
| **Startup Failure** | The previous `.bat` files failed to initialize the servers or open the browser correctly. | Rewrote the scripts using `start cmd /k` to keep logs visible and added `start http://localhost:5173` for automatic browser launch. |
| **Environment Silent Failure** | The backend would start but fail to connect to MongoDB because it couldn't find the `.env` file when run from the project root. | Updated the root `package.json` to use `--prefix backend`, ensuring `process.cwd()` is correctly set to the backend directory for `dotenv`. |
| **Port Conflict Errors** | "Address already in use" errors occurred when trying to restart the app, leading to "ghost" processes hanging in the background. | Added a **Pre-flight Cleanup** step to the launch scripts that automatically kills any processes on ports `5173` and `5000` before starting new ones. |
| **Vite Port Jumping** | Vite would switch to port `5174` if `5173` was momentarily busy, causing the browser to open to a "Cannot Connect" page. | Implemented `strictPort: true` in `vite.config.js` to ensure the application always stays on its expected port. |
| **Security Weaknesses** | `npm audit` flagged high-severity vulnerabilities in core dependencies (like `path-to-regexp`). | Performed a full-scale `npm audit fix` across the workspace to patch critical security holes in the dependency tree. |

---

## 📁 Project Structure

```text
├── backend/              # Node.js/Express API
│   ├── models/           # Mongoose schemas (Task, User, Note, etc.)
│   ├── routes/           # API endpoints (Auth, AI, Tasks, etc.)
│   ├── .env              # Backend configuration (DB URI, JWT secret)
│   └── index.js          # Entry point
├── frontend/             # React application (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI parts (Sidebar, Dashboard items)
│   │   ├── pages/        # Main views (Auth, Pomodoro, Tasks)
│   │   └── services/     # Axios API configurations
│   └── vite.config.js    # Vite & Proxy settings
├── quick_server.bat      # Fast launch script
├── run_server.bat        # Setup + launch script
└── package.json          # Root scripts for workspace management
```

---

## 🛠️ Manual Installation (Advanced)

If you prefer to run things manually:

1. **Backend**:
   ```bash
   cd backend
   npm install
   # Ensure .env is configured
   npm start
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The application will be accessible at `http://localhost:5173`.
