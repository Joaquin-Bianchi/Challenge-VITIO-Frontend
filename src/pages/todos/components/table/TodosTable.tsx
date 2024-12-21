import ButtonDelete from "@/components/buttons/ButtonDelete";
import { ActionModal } from "@/components/modal/ActionModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis } from "lucide-react";
import { Todo } from "@/interfaces/todo.interface";
import { deleteTodoById } from "@/services/todosService";
import SelectTodoStatus from "@/components/form/SelectTodoStatus";
import EditTodoForm from "../forms/EditTodoForm";

interface Props {
  todos?: Todo[];
}

function TodosTable({ todos }: Props) {
  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarea</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos?.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.todo}</TableCell>
              <TableCell className="capitalize">
                <SelectTodoStatus id={todo.id} status={todo.status} />
              </TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger className="ml-auto mr-2" asChild>
                    <Ellipsis className="cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-full">
                    <div className="items-end flex gap-1">
                      <ActionModal title="Editar" dialogTitle="Editar Tarea">
                        <EditTodoForm todo={todo} />
                      </ActionModal>
                      <ButtonDelete
                        id={todo.id}
                        deleteFn={deleteTodoById}
                        nameMutationKey="deleteTodo"
                        nameQueryKey="todos"
                        textObjectDelete="Todo"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TodosTable;
