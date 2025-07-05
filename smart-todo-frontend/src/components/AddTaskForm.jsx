'use client';
import { useState } from 'react';
import { addTask } from '@/services/task'; 
import { sendMessage } from '@/api/socketV1'; 

export default function AddTaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Task title is required');
    if (!dueDate) return toast.error('Due date is required');

    try {
      setLoading(true);
      const res = await addTask({ title, due_date: dueDate }); 

      toast.success('Task added');
      alert('Task added successfully!');

      sendMessage({ event: 'TASK_CREATED', task: res?.data?.data });

      setTitle('');
      setDueDate('');
      onTaskAdded?.(res?.data?.data);
    } catch (err) {
      console.error(err);
      toast.error('Error adding task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-4 space-y-4 text-black">
      <div>
        <label className="block text-sm font-medium text-gray-700">Task Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
      >
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
