const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// All routes protected
router.use(protect);

// GET /api/tasks  — list with filter/sort
router.get('/', async (req, res) => {
  try {
    const { filter, date, priority, search } = req.query;
    const query = { userId: req.user._id };

    const today = new Date().toISOString().split('T')[0];
    if (filter === 'today')     query.date = today;
    if (filter === 'upcoming')  { query.deadline = { $gt: today }; query.completed = false; }
    if (filter === 'completed') query.completed = true;
    if (filter === 'pending')   query.completed = false;
    if (date)                   query.date = date;
    if (priority)               query.priority = priority;
    if (search)                 query.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    res.json({ success: true, count: total, completed, pending: total - completed, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/tasks/:id — full update
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body, { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/tasks/:id/toggle — toggle complete
router.patch('/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.completed = !task.completed;
    if (task.completed) task.completedAt = new Date();
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/tasks/:id/subtasks/:subId — toggle subtask
router.patch('/:id/subtasks/:subId', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    const sub = task.subtasks.id(req.params.subId);
    if (!sub) return res.status(404).json({ success: false, message: 'Subtask not found' });
    sub.completed = !sub.completed;
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/tasks/:id/subtasks — add subtask
router.post('/:id/subtasks', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.subtasks.push({ title: req.body.title || req.body.text });
    await task.save();
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/tasks/:id/subtasks/:subId
router.delete('/:id/subtasks/:subId', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.subtasks.pull(req.params.subId);
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tasks/stats/summary
router.get('/stats/summary', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [total, completed, todayTotal, todayDone, highPriority] = await Promise.all([
      Task.countDocuments({ userId: req.user._id }),
      Task.countDocuments({ userId: req.user._id, completed: true }),
      Task.countDocuments({ userId: req.user._id, date: today }),
      Task.countDocuments({ userId: req.user._id, date: today, completed: true }),
      Task.countDocuments({ userId: req.user._id, priority: 'High', completed: false }),
    ]);
    res.json({ success: true, data: { total, completed, pending: total - completed, todayTotal, todayDone, highPriority, progress: total ? Math.round(completed/total*100) : 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
