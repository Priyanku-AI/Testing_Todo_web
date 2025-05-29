import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, { title });
      setTasks([...tasks, data]);
      setTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle) return;
    try {
      const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, { title: editTitle });
      setTasks(tasks.map((task) => (task.id === id ? data : task)));
      setEditingTaskId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Task Manager version 5</h1>
      <form onSubmit={addTask} className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
          className="border p-2 rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Task
        </button>
      </form>
      <ul className="w-full max-w-md">
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center p-2 bg-white mb-2 rounded shadow">
            {editingTaskId === task.id ? (
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border p-2 rounded mr-2 flex-1"
                />
                <button
                  onClick={() => saveEdit(task.id)}
                  className="bg-green-500 text-white p-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1">{task.title}</span>
                <button
                  onClick={() => startEditing(task)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;