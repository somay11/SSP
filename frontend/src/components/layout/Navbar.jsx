import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Timer, Calendar, Bell, Moon, Sun } from 'lucide-react';

const Navbar = ({ activePage, onChangePage, onEnterFocus }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="glass sticky top-4 z-50 flex items-center justify-between px-10 py-5 mx-6 my-6 shadow-2xl"
    >
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => onChangePage('dashboard')}
      >
        <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transition-transform">
          <CheckSquare className="text-white" size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 leading-tight">
            SmartStudy
          </h1>
        </div>
      </motion.div>

      <div className="hidden md:flex items-center">
        <div className="pill-group">
          <NavLink 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={activePage === 'dashboard'} 
            onClick={() => onChangePage('dashboard')}
          />
          <NavLink 
            icon={<CheckSquare size={18} />} 
            label="Tasks" 
            active={activePage === 'tasks'} 
            onClick={() => onChangePage('dashboard')}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnterFocus} 
            className={`pill flex items-center gap-2`}
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(244,114,182,0.15))',
              borderImage: 'linear-gradient(135deg, var(--primary), var(--secondary)) 1',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '12px',
              color: '#a5b4fc',
            }}
          >
            <Timer size={18} />
            <span>Focus</span>
          </motion.button>
          <NavLink 
            icon={<Calendar size={18} />} 
            label="Schedule" 
            active={activePage === 'calendar'} 
            onClick={() => onChangePage('calendar')}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button 
          whileHover={{ rotate: 180, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.5 }}
          onClick={() => setIsDark(!isDark)}
          className="btn-icon"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
        <motion.button 
          whileHover={{ y: -2, scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          className="btn-icon"
        >
          <Bell size={20} />
        </motion.button>
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <motion.div whileHover={{ scale: 1.1 }} className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-500/20 cursor-pointer">
            JD
          </motion.div>
          <span className="hidden lg:block font-bold text-xs uppercase tracking-widest opacity-60">John Doe</span>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ icon, label, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`pill flex items-center gap-2 ${active ? 'active' : ''}`}
  >
    {icon}
    <span>{label}</span>
  </motion.button>
);

export default Navbar;
