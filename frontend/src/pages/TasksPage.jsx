import { useState } from 'react';
import { useApp } from '../App';

export default function TasksPage() {
  const { tasks, toggleTask, deleteTask, addTask } = useApp();
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask({
      title: newTask, // Assuming title since user reverted models
      name: newTask,
      priority,
      deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    });
    setNewTask('');
  };

  return (
    <div className="tasks-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>My Tasks</h2>
      </div>

      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="What needs to be done?" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            autoFocus
          />
          <select 
            className="input-field" 
            style={{ width: '140px' }}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <button type="submit" className="btn btn-primary">Add Task</button>
        </form>
      </div>

      <div className="tasks-list">
        {tasks.sort((a,b) => a.completed - b.completed).map(task => (
           <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
             <div className="task-checkbox" onClick={() => toggleTask(task._id)}>
               {task.completed && <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:16,height:16}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
             </div>
             <div style={{ flex: 1 }}>
               <div style={{ fontWeight: 500, color: 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title || task.name}</div>
               <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                 Due {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No date'}
               </div>
             </div>
             <div className={`priority-badge priority-${task.priority?.toLowerCase()}`}>
               {task.priority}
             </div>
             <button className="icon-btn" onClick={() => deleteTask(task._id)} style={{ border:'none', color:'var(--danger)', width:32, height:32 }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: 18, height: 18}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             </button>
           </div>
        ))}
      </div>
    </div>
  );
}
