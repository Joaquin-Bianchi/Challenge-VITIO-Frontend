import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editStatusTodo } from "@/services/todosService";

interface Props {
  id: string;
  status: string;
}

export default function SelectTodoStatus({ id, status }: Props) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const queryClient = useQueryClient();

  const statusColors = {
    cancelled: "bg-red-500",
    completed: "bg-green-500",
    pending: "bg-yellow-500",
  };

  const { mutate } = useMutation({
    mutationFn: ({
      todoId,
      newStatus,
    }: {
      todoId: string;
      newStatus: string;
    }) => editStatusTodo(todoId, newStatus),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["todos"] });
      toast.success("Estado actualizado");
    },
    onError: () => {
      toast.error("Error al actualizar estado");
    },
  });

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    mutate({ todoId: id, newStatus });
  };

  return (
    <TableCell>
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger
          className={`rounded-full text-white ${
            statusColors[currentStatus as keyof typeof statusColors] ||
            "bg-yellow-500"
          }`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pendiente</SelectItem>
          <SelectItem value="completed">Completada</SelectItem>
          <SelectItem value="cancelled">Cancelada</SelectItem>
        </SelectContent>
      </Select>
    </TableCell>
  );
}
