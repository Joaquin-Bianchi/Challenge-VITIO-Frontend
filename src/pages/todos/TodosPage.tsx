import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ActionModal } from "@/components/modal/ActionModal";
import { useState } from "react";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTodos } from "@/services/todosService";
import { Todo } from "@/interfaces/todo.interface";
import TodosTable from "./components/table/TodosTable";
import CreateTodoForm from "./components/forms/CreateTodoForm";

export default function TodosPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["todos", page],
    queryFn: () => getTodos(page),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  if (isLoading) return <div>Cargando Tareas...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>No hay Tareas</div>;

  const filteredtodos =
    statusFilter === "all"
      ? data.todos.data
      : (data.todos.data as Todo[]).filter(
          (todo) => todo.status === statusFilter
        );

  const { totalPages } = data;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <h1 className="text-3xl font-bold mb-4">Organiza tus Tareas</h1>
          </div>
          <ActionModal title="+ Nueva Tarea" dialogTitle="Crear Nueva tarea">
            <CreateTodoForm />
          </ActionModal>
        </div>

        <div className="flex items-center space-x-4">
          <Label htmlFor="filter">Filtrar por estado:</Label>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger id="filter" className="w-[180px]">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <TodosTable todos={filteredtodos} />

        <PaginationComponent
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}
