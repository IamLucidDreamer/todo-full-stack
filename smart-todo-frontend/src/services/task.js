import serverV1 from "@/api/serverV1";

export async function fetchTasks() {
  return serverV1.get('tasks/');
}

export async function createTask(data) {
  return serverV1.post('tasks/', data);
}

export async function updateTask(id, data) {
  return serverV1.put(`tasks/${id}/`, data);
}

export async function deleteTask(id) {
  return serverV1.delete(`tasks/${id}/`);
}
