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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, Filter, Loader2 } from "lucide-react";

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

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} />;
  if (!data || !data.todos.data.length) return <EmptyState />;

  const filteredTodos =
    statusFilter === "all"
      ? data.todos.data
      : (data.todos.data as Todo[]).filter(
          (todo) => todo.status === statusFilter
        );

  const { totalPages } = data;

  return (
    <div className="min-h-screen bg-secondary/20">
      <main className="container mx-auto py-8 px-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              <ListTodo className="mr-2 h-6 w-6 inline-block" />
              Organiza tus Tareas
            </CardTitle>
            <ActionModal title="+ Nueva Tarea" dialogTitle="Crear Nueva tarea">
              <CreateTodoForm />
            </ActionModal>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <Filter className="h-5 w-5 text-gray-500" />
              <Label htmlFor="filter" className="text-sm font-medium">
                Filtrar por estado:
              </Label>
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

            <TodosTable todos={filteredTodos} />

            <div className="mt-6">
              <PaginationComponent
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg font-medium">Cargando Tareas...</span>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <ListTodo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          No hay Tareas
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comienza agregando una nueva tarea.
        </p>
      </div>
    </div>
  );
}
