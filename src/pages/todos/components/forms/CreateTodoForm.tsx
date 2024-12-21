import { Button } from "@/components/ui/button";
import { FormField } from "@/components/form/FormField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Todo } from "@/interfaces/todo.interface";
import { createTodo } from "@/services/todosService";

interface Props {
  setOpen?: (open: boolean) => void;
}

function CreateTodoForm({ setOpen }: Props) {
  const queryClient = useQueryClient();
  const { control, handleSubmit } = useForm<Todo>({});

  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    mutationKey: ["createTodo"],

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Tarea creada correctamente");
      setOpen?.(false);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || "Error al crear la Tarea";
      toast.error(errorMessage);
    },
  });

  const onSubmit = handleSubmit((data: Todo) => {
    // para que la api fake los cree siempre en pendiente
    const todoWihtDefaultStatus = { ...data, status: "pending" };
    createTodoMutation.mutate(todoWihtDefaultStatus);
  });

  return (
    <form className="grid grid-cols-2 gap-4 py-4" onSubmit={onSubmit}>
      <div className="col-span-2">
        <FormField
          name="todo"
          label="Nombre de la Tarea"
          control={control}
          rules={{ required: "El nombre es requerido" }}
          placeholder="Limpiar la cocina"
        />
      </div>

      <div className="col-span-2">
        <Button
          type="submit"
          className="w-full"
          disabled={createTodoMutation.isPending}
        >
          {createTodoMutation.isPending ? "Creando..." : "Crear Tarea"}
        </Button>
      </div>
    </form>
  );
}

export default CreateTodoForm;
