const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Replace 'your_mongodb_uri' with your MongoDB connection string
mongoose.connect('mongodb://localhost:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

app.use(bodyParser.json());

// Routes
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  const newTask = new Task({ title, description, completed: false });
  await newTask.save();
  res.json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { title, description, completed } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { title, description, completed },
    { new: true }
  );
  res.json(updatedTask);
});

app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  await Task.findByIdAndDelete(taskId);
  res.json({ message: 'Task deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
