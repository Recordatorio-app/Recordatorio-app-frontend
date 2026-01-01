import { TaskRequest } from "@/models/Task/task_request_dto";
import api from "../api";

export const getTasks = async (page = 1, limit = 4, status: string) => {
  const res = await api.get("/tasks", {
    params: { page, limit, status },
  });
  return res.data;
};

export const createTask = async (data: TaskRequest) => {
  const res = await api.post(`/tasks/`, data);
  return res.data;
};
export const getTaskById = async (taskId: string) => {
  const res = await api.get(`/tasks/${taskId}`);
  return res.data;
};
export const updateTask = async (taskId: string, data: TaskRequest) => {
  const res = await api.put(`/tasks/${taskId}`, data);
  return res.data;
};
export const deleteTask = async (taskId: string) => {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
};
