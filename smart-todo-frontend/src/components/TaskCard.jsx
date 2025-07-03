// components/TaskCard.jsx
import { formattedDate } from "@/utils/date";

const statusStyles = {
  success: 'bg-green-100 text-green-700',
  ongoing: 'bg-yellow-100 text-yellow-700',
  failure: 'bg-red-100 text-red-700',
};

export default function TaskCard({ task }) {
  const { title, description, deadline, status } = task;

  const deadlineStr = formattedDate(deadline);

  return (
    <div className="rounded-2xl p-4 shadow bg-white border hover:shadow-md transition">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}
        >
          {status.toUpperCase()}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <p className="text-xs text-gray-500">
        Deadline: <strong>{deadlineStr}</strong>
      </p>
    </div>
  );
}
