import { Button } from "@/components/ui/button";
import { FormField } from "@/components/form/FormField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { editTodo } from "@/services/todosService";
import { Todo } from "@/interfaces/todo.interface";

interface Props {
  todo: Todo;
  setOpen?: (open: boolean) => void;
}

function EditTodoForm({ todo, setOpen }: Props) {
  const queryClient = useQueryClient();
  const { control, handleSubmit } = useForm<Todo>({
    defaultValues: {
      todo: todo.todo,
      status: todo.status,
    },
  });

  const editTodoMutation = useMutation({
    mutationFn: editTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Tarea editada correctamente");
      setOpen?.(false);
    },
    onError: (error: Error) => {
      toast.error(`Error al editar la tarea: ${error.message}`);
    },
  });

  const onSubmit = handleSubmit((data: Todo) => {
    const todoWithId = { ...data, id: todo.id };
    editTodoMutation.mutate(todoWithId);
  });

  return (
    <form className="grid gap-4 py-4" onSubmit={onSubmit}>
      <div className="col-span-2">
        <FormField
          name="todo"
          label="Tarea"
          control={control}
          rules={{ required: "La tarea es requerida" }}
          placeholder="Describe la tarea"
        />
      </div>
      <div className="col-span-2">
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen?.(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={editTodoMutation.isPending}>
            {editTodoMutation.isPending ? "Editando..." : "Editar Tarea"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default EditTodoForm;
