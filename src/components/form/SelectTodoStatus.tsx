import { createElement, useState } from "react";
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
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface Props {
  id: string;
  status: string;
  onChange?: (newStatus: string) => void;
}

export default function SelectTodoStatus({ id, status, onChange }: Props) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const queryClient = useQueryClient();

  const statusInfo = {
    pending: { color: "text-yellow-500", icon: Clock, label: "Pendiente" },
    completed: {
      color: "text-green-500",
      icon: CheckCircle,
      label: "Completada",
    },
    cancelled: { color: "text-red-500", icon: XCircle, label: "Cancelada" },
  };

  const mutation = useMutation({
    mutationFn: (data: { todoId: string; newStatus: string }) =>
      editStatusTodo(data.todoId, data.newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Estado actualizado correctamente");
    },
    onError: (err: any) => {
      toast.error("Error al actualizar el estado");
      console.error(err);
    },
  });

  const { mutate } = mutation;

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    mutate({ todoId: id, newStatus });
    onChange?.(newStatus);
  };

  return (
    <TableCell>
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue>
            {currentStatus && (
              <div className="flex items-center">
                {createElement(
                  statusInfo[currentStatus as keyof typeof statusInfo].icon,
                  {
                    className: `mr-2 h-4 w-4 ${
                      statusInfo[currentStatus as keyof typeof statusInfo].color
                    }`,
                  }
                )}
                <span>
                  {statusInfo[currentStatus as keyof typeof statusInfo].label}
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(statusInfo).map(
            ([value, { icon: Icon, label, color }]) => (
              <SelectItem key={value} value={value}>
                <div className="flex items-center">
                  <Icon className={`mr-2 h-4 w-4 ${color}`} />
                  <span>{label}</span>
                </div>
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
    </TableCell>
  );
}
