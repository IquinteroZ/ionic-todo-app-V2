import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, Category } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class StorageService {

  private readonly TASKS_KEY      = 'todo_tasks';
  private readonly CATEGORIES_KEY = 'todo_categories';

  private tasksSubject      = new BehaviorSubject<Task[]>(this.loadTasks());
  private categoriesSubject = new BehaviorSubject<Category[]>(this.loadCategories());

  tasks$:      Observable<Task[]>     = this.tasksSubject.asObservable();
  categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  // ── TASKS ─────────────────────────────────────

  private loadTasks(): Task[] {
    try {
      const raw = localStorage.getItem(this.TASKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  addTask(task: Task): void {
    this.saveTasks([...this.tasksSubject.getValue(), task]);
  }

  toggleTask(id: string): void {
    const tasks = this.tasksSubject.getValue().map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.saveTasks(tasks);
  }

  deleteTask(id: string): void {
    this.saveTasks(this.tasksSubject.getValue().filter(t => t.id !== id));
  }

  // ── CATEGORIES ────────────────────────────────

  private loadCategories(): Category[] {
    try {
      const raw = localStorage.getItem(this.CATEGORIES_KEY);
      return raw ? JSON.parse(raw) : this.defaultCategories();
    } catch { return this.defaultCategories(); }
  }

  private defaultCategories(): Category[] {
    return [
      { id: 'cat-1', name: 'Personal', color: '#3880ff', createdAt: new Date() },
      { id: 'cat-2', name: 'Trabajo',  color: '#eb445a', createdAt: new Date() },
      { id: 'cat-3', name: 'Compras',  color: '#2dd36f', createdAt: new Date() },
    ];
  }

  private saveCategories(cats: Category[]): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(cats));
    this.categoriesSubject.next(cats);
  }

  addCategory(cat: Category): void {
    this.saveCategories([...this.categoriesSubject.getValue(), cat]);
  }

  updateCategory(updated: Category): void {
    const cats = this.categoriesSubject.getValue().map(c =>
      c.id === updated.id ? updated : c
    );
    this.saveCategories(cats);
  }

  deleteCategory(id: string): void {
    this.saveCategories(this.categoriesSubject.getValue().filter(c => c.id !== id));
    const tasks = this.tasksSubject.getValue().map(t =>
      t.categoryId === id ? { ...t, categoryId: undefined } : t
    );
    this.saveTasks(tasks);
  }

  generateId(): string {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
