export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId?: string;
  createdAt: Date;
}
