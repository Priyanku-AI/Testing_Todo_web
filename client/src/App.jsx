import { useState, useEffect } from 'react';
     import axios from 'axios';

     function App() {
       const [tasks, setTasks] = useState([]);
       const [title, setTitle] = useState('');

       useEffect(() => {
         fetchTasks();
       }, []);

       const fetchTasks = async () => {
         const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`);
         setTasks(data);
       };

       const addTask = async (e) => {
         e.preventDefault();
         if (!title) return;
         const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, { title });
         setTasks([...tasks, data]);
         setTitle('');
       };

       const deleteTask = async (id) => {
         await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`);
         setTasks(tasks.filter((task) => task.id !== id));
       };

       return (
         <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
           <h1 className="text-3xl font-bold mb-6">Task Manager</h1>
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
                 <span>{task.title}</span>
                 <button
                   onClick={() => deleteTask(task.id)}
                   className="text-red-500 hover:text-red-700"
                 >
                   Delete
                 </button>
               </li>
             ))}
           </ul>
         </div>
       );
     }

     export default App;