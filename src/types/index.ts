export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}
export interface TodoItem {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  createdAt: number;
  completed: boolean;
}
