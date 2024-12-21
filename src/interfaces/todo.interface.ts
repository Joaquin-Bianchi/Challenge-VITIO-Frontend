export enum Status {
  pending,
  completed,
  cancelled,
}

export interface Todo {
  id: string;
  todo: string;
  status: string;
}
