'use client';

import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
// import CreateTaskForm from './CreateTaskForm';
import {fetchTasks} from '../services/task';
import {
  connectWebSocket,
  closeWebSocket,
} from '@/api/socketV1';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchTask = async () => {
    try {
      const res = await fetchTasks();
      setTasks(res.data || []);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const markComplete = async (id) => {
    try {
      await axios.patch(`/tasks/${id}/`, { status: 'success' });
      fetchTask();
    } catch (err) {
      console.error('Failed to mark complete', err);
    }
  };

  useEffect(() => {
    fetchTask();

    connectWebSocket((data) => {
      if (['TASK_CREATED', 'TASK_UPDATED'].includes(data.event)) {
        fetchTasks();
      }
    });

    return () => closeWebSocket();
  }, []);

  const grouped = {
    ongoing: [],
    success: [],
    failure: [],
  };

  tasks.forEach((task) => {
    grouped[task.status]?.push(task);
  });

  const Section = ({ title, emoji, keyName }) => (
    <div>
      <h2 className="text-lg font-semibold capitalize mb-2">
        {emoji} {title}
      </h2>
      <div className="space-y-3">
        {grouped[keyName].length ? (
          grouped[keyName].map((task) => (
            <div key={task.id}>
              <TaskCard task={task} />
              {keyName === 'ongoing' && (
                <button
                  onClick={() => markComplete(task.id)}
                  className="mt-2 text-sm text-blue-500 hover:underline"
                >
                  Mark as Complete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No tasks</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Smart Todo List</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      {showForm && (
        // <CreateTaskForm
        //   onClose={() => {
        //     setShowForm(false);
        //     fetchTasks();
        //   }}
        // />
        <>
        </>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Section title="Ongoing" emoji="🟡" keyName="ongoing" />
        <Section title="Success" emoji="🟢" keyName="success" />
        <Section title="Failure" emoji="🔴" keyName="failure" />
      </div>
    </div>
  );
}
