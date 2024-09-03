import React, { useState } from 'react';
import './App.css';
import { FaCheck, FaEdit, FaTrash, FaPlus, FaSort, FaTasks } from 'react-icons/fa';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editTaskId, setEditTaskId] = useState(null);

  const addTask = () => {
    if (taskText && dueDate && dueTime) {
      const dueDateTime = `${dueDate}T${dueTime}`;
      if (editTaskId !== null) {
        // Edit existing task
        setTasks(tasks.map(task =>
          task.id === editTaskId
            ? { ...task, text: taskText, dueDateTime: dueDateTime, priority: priority }
            : task
        ));
        setEditTaskId(null);
      } else {
        // Add new task
        setTasks([...tasks, { text: taskText, dueDateTime: dueDateTime, priority: priority, completed: false, id: Date.now() }]);
      }
      setTaskText('');
      setDueDate('');
      setDueTime('');
      setPriority('Medium');
    }
  };

  const handleTaskTextChange = (e) => setTaskText(e.target.value);
  const handleDueDateChange = (e) => setDueDate(e.target.value);
  const handleDueTimeChange = (e) => setDueTime(e.target.value);
  const handlePriorityChange = (e) => setPriority(e.target.value);

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (task) => {
    const [date, time] = task.dueDateTime.split('T');
    setTaskText(task.text);
    setDueDate(date);
    setDueTime(time);
    setPriority(task.priority);
    setEditTaskId(task.id);
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const sortTasks = (criteria) => {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (criteria === 'dueDate') {
        return new Date(a.dueDateTime) - new Date(b.dueDateTime);
      } else if (criteria === 'priority') {
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });
    setTasks(sortedTasks);
  };

  const uncompletedTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="App">
      <header>
        <h1><FaTasks /> To-Do List</h1>
      </header>
      <main>
        <div className="form-container">
          <h2>{editTaskId ? 'Edit Task' : 'Add New Task'}</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter task"
              value={taskText}
              onChange={handleTaskTextChange}
              className="input-text"
            />
            <input
              type="date"
              value={dueDate}
              onChange={handleDueDateChange}
              className="input-date"
            />
            <input
              type="time"
              value={dueTime}
              onChange={handleDueTimeChange}
              className="input-time"
            />
            <select value={priority} onChange={handlePriorityChange} className="input-select">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button onClick={addTask} className="button-primary">
              <FaPlus /> {editTaskId ? 'Update Task' : 'Add Task'}
            </button>
          </div>
          <div className="sort-buttons">
            <button onClick={() => sortTasks('dueDate')} className="button-secondary">
              <FaSort /> Sort by Due Date
            </button>
            <button onClick={() => sortTasks('priority')} className="button-secondary">
              <FaSort /> Sort by Priority
            </button>
          </div>
        </div>
        <div className="folder">
          <h2>Uncompleted Tasks ({uncompletedTasks.length})</h2>
          <ul>
            {uncompletedTasks.map(task => (
              <li key={task.id} className="task-item">
                <span className={task.completed ? 'completed' : ''}>
                  {task.text} - Due: {new Date(task.dueDateTime).toLocaleString()} - Priority: {task.priority}
                </span>
                <div className="button-group">
                  <button onClick={() => toggleTaskCompletion(task.id)} className="button-complete">
                    <FaCheck /> {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => editTask(task)} className="button-edit">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="button-delete">
                    <FaTrash /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="folder">
          <h2>Completed Tasks</h2>
          <ul>
            {completedTasks.map(task => (
              <li key={task.id} className="task-item">
                <span className="completed">
                  {task.text} - Due: {new Date(task.dueDateTime).toLocaleString()} - Priority: {task.priority}
                </span>
                <div className="button-group">
                  <button onClick={() => toggleTaskCompletion(task.id)} className="button-complete">
                    <FaCheck /> Undo
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="button-delete">
                    <FaTrash /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
