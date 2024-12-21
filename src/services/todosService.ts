import { Todo } from "@/interfaces/todo.interface";

const API_URL = "http://localhost:3000";

export const getTodos = async (page = 1, limit = 5) => {
  try {
    const todosResponse = await fetch(
      `${API_URL}/todos?_page=${page}&_per_page=${limit}`
    );
    const todos = await todosResponse.json();

    const totalResponse = await fetch(`${API_URL}/todos`);
    const totalTodos = await totalResponse.json();

    const totalCount = totalTodos.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    return {
      todos,
      totalCount,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

export const createTodo = async (todo: Todo) => {
  try {
    const response = await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw error;
  }
};

export const editTodo = async (todo: Todo) => {
  try {
    const response = await fetch(`${API_URL}/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      throw new Error(`Error al editar: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw error;
  }
};

export const editStatusTodo = async (todoId: string, status: string) => {
  try {
    const todo = await getTodoById(todoId);
    const updatedTodo = {
      ...todo,
      status,
    };
    const response = await fetch(`${API_URL}/todos/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el estado");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteTodoById = async (todoId: string) => {
  try {
    const response = await fetch(`${API_URL}/todos/${todoId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar: ${response.status}`);
    }

    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getTodoById = async (todoId: string) => {
  try {
    const response = await fetch(`${API_URL}/todos/${todoId}`);
    const todo = await response.json();
    return todo;
  } catch (error: any) {
    throw error;
  }
};
