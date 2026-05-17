import { api } from "../api/apiConfig";

export const login = (data) => api.post("/auth/login", data);

export const getTodos = () => api.get("/todos");

export const getSingleTodo = (id) => api.get(`/todos/${id}`);

export const addTodo = (data) => api.post("/todos/add", data);

export const updateTodo = (id, data) => api.put(`/todos/${id}`, data);

export const deleteTodo = (id) => api.delete(`/todos/${id}`);
