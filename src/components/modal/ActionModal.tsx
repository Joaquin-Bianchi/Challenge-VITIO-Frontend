import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useState,
} from "react";

interface Props {
  children: ReactNode;
  title: string;
  dialogTitle: string;
}

export function ActionModal({ children, title, dialogTitle }: Props) {
  const [open, setOpen] = useState(false);

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { setOpen } as any);
    }
    return child;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <p className="font-bold">{title}</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        {childrenWithProps}
      </DialogContent>
    </Dialog>
  );
}
