import { Todo } from "@/interfaces/todo.interface";

const STORAGE_KEY = "todos-list";

const getStoredTodos = (): Todo[] => {
  const storedTodos = localStorage.getItem(STORAGE_KEY);
  return storedTodos ? JSON.parse(storedTodos) : [];
};

const saveTodosToStorage = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

export const getTodos = async (page = 1, limit = 5) => {
  try {
    const allTodos = getStoredTodos();

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTodos = allTodos.slice(startIndex, endIndex);

    const totalCount = allTodos.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return {
      todos: paginatedTodos,
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
    const todos = getStoredTodos();

    const newId = Date.now().toString();
    const newTodo = { ...todo, id: newId };

    todos.push(newTodo);
    saveTodosToStorage(todos);

    return newTodo;
  } catch (error: any) {
    throw error;
  }
};

export const editTodo = async (todo: Todo) => {
  try {
    const todos = getStoredTodos();
    const index = todos.findIndex((t) => t.id === todo.id);

    if (index === -1) {
      throw new Error(`Error al editar: Todo no encontrado`);
    }

    todos[index] = todo;
    saveTodosToStorage(todos);

    return todo;
  } catch (error: any) {
    throw error;
  }
};

export const editStatusTodo = async (todoId: string, status: string) => {
  try {
    const todos = getStoredTodos();
    const todo = todos.find((t) => t.id === todoId);

    if (!todo) {
      throw new Error("Todo no encontrado");
    }

    const updatedTodo = { ...todo, status };
    const updatedTodos = todos.map((t) => (t.id === todoId ? updatedTodo : t));

    saveTodosToStorage(updatedTodos);
    return updatedTodo;
  } catch (error) {
    throw error;
  }
};

export const deleteTodoById = async (todoId: string) => {
  try {
    const todos = getStoredTodos();
    const updatedTodos = todos.filter((t) => t.id !== todoId);

    if (todos.length === updatedTodos.length) {
      throw new Error(`Error al eliminar: Todo no encontrado`);
    }

    saveTodosToStorage(updatedTodos);
    return new Response(null, { status: 200 });
  } catch (error: any) {
    throw error;
  }
};

export const getTodoById = async (todoId: string) => {
  try {
    const todos = getStoredTodos();
    const todo = todos.find((t) => t.id === todoId);

    if (!todo) {
      throw new Error("Todo no encontrado");
    }

    return todo;
  } catch (error: any) {
    throw error;
  }
};
