import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import Pomodoro from './pages/Pomodoro';
import CalendarPage from './pages/CalendarPage';
import NotesPage from './pages/NotesPage';
import FocusMode from './components/FocusMode';
import Toast from './components/Toast';
import Auth from './pages/Auth';
import { tasksAPI, notesAPI, timerAPI, streakAPI, aiAPI, authAPI } from './services/api';

// ── Global Context ─────────────────────────────────────────────────────────────
export const AppCtx = createContext({});
export const useApp = () => useContext(AppCtx);

// ── localStorage helpers ───────────────────────────────────────────────────────
const DB = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem('ssp_' + k)) ?? d; } catch { return d; } },
  set: (k, v) => localStorage.setItem('ssp_' + k, JSON.stringify(v)),
};

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Study hard what interests you the most in the most undisciplined, irreverent way.", author: "Richard Feynman" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
];

const COLORS = ['#7c6aff', '#06d6a0', '#f59e0b', '#f43f5e', '#3b82f6', '#a855f7'];

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(DB.get('dark', true));
  const [focusMode, setFocusMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data states
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [streak, setStreak] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  // ── Auth & Data Fetching ───────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [{ data: ts }, { data: ns }, { data: str }, { data: ai }] = await Promise.all([
        tasksAPI.getAll(),
        notesAPI.getAll(),
        streakAPI.get(),
        aiAPI.getSuggestions()
      ]);
      setTasks(ts.data || []);
      setNotes(ns.data || []);
      setStreak(str.data?.currentStreak || 0);
      setAiSuggestions(ai.suggestions || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await authAPI.getMe();
          if (data.success) {
            setUser(data.data);
            await fetchData();
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [fetchData]);

  // Dark mode
  useEffect(() => {
    document.documentElement.className = darkMode ? '' : 'light';
    DB.set('dark', darkMode);
  }, [darkMode]);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  // ── Task helpers ──────────────────────────────────────────────────────────
  const toggleTask = async (id) => {
    try {
      await tasksAPI.toggle(id);
      setTasks(ts => ts.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
      addToast('Task updated!', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const deleteTask = async (id) => {
    try {
      await tasksAPI.delete(id);
      setTasks(ts => ts.filter(t => t._id !== id));
      addToast('Task deleted.', 'error');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const addTask = async (data) => {
    try {
      const { data: res } = await tasksAPI.create(data);
      setTasks(ts => [res.data, ...ts]);
      addToast('Task added!', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const updateTask = async (id, data) => {
    try {
      const { data: res } = await tasksAPI.update(id, data);
      setTasks(ts => ts.map(t => t._id === id ? res.data : t));
      addToast('Task updated!', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const addSubtask = async (tid, text) => {
    try {
      const { data: res } = await tasksAPI.addSub(tid, { text });
      setTasks(ts => ts.map(t => t._id === tid ? res.data : t));
      addToast('Subtask added!', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const toggleSub = async (tid, sid) => {
    try {
      const { data: res } = await tasksAPI.toggleSub(tid, sid);
      setTasks(ts => ts.map(t => t._id === tid ? res.data : t));
    } catch (err) { addToast(err.message, 'error'); }
  };

  const deleteSubtask = async (tid, sid) => {
    try {
      const { data: res } = await tasksAPI.deleteSub(tid, sid);
      setTasks(ts => ts.map(t => t._id === tid ? res.data : t));
    } catch (err) { addToast(err.message, 'error'); }
  };

  // ── Note helpers ──────────────────────────────────────────────────────────
  const addNote = async (data) => {
    try {
      const { data: res } = await notesAPI.create(data);
      setNotes(ns => [res.data, ...ns]);
      addToast('Note saved!', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const updateNote = async (id, data) => {
    try {
      const { data: res } = await notesAPI.update(id, data);
      setNotes(ns => ns.map(n => n._id === id ? res.data : n));
      addToast('Note updated!', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const deleteNote = async (id) => {
    try {
      await notesAPI.delete(id);
      setNotes(ns => ns.filter(n => n._id !== id));
      addToast('Note deleted.', 'error');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPage('dashboard');
    addToast('Logged out successfully', 'info');
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const todayProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  // ── Context value ─────────────────────────────────────────────────────────
  const ctx = {
    user, logout, page, setPage, darkMode, setDarkMode, focusMode, setFocusMode,
    tasks, notes, streak, setStreak, aiSuggestions,
    toggleTask, deleteTask, toggleSub, addTask, updateTask, addSubtask, deleteSubtask,
    addNote, updateNote, deleteNote,
    totalTasks, completedTasks, pendingTasks, todayProgress, quote,
    addToast, COLORS, loading, sidebarOpen, setSidebarOpen,
  };

  const PAGES = { dashboard: Dashboard, tasks: TasksPage, pomodoro: Pomodoro, calendar: CalendarPage, notes: NotesPage };
  const PageComponent = PAGES[page] || Dashboard;

  if (loading) return <div className="loading-scr">Loading StudyFlow...</div>;
  if (!user) return <AppCtx.Provider value={ctx}><Auth /><Toast toasts={toasts} /></AppCtx.Provider>;

  return (
    <AppCtx.Provider value={ctx}>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Topbar />
          <div className="page-content">
            <PageComponent />
          </div>
        </div>
        {focusMode && <FocusMode />}
        <Toast toasts={toasts} />
      </div>
    </AppCtx.Provider>
  );
}

