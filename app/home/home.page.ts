import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Task, Category } from '../shared/models/task.model';
import { StorageService } from '../shared/services/storage.service';
import { FirebaseService } from '../shared/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  tasks:           Task[]     = [];
  filteredTasks:   Task[]     = [];
  categories:      Category[] = [];
  selectedCatId:   string     = 'all';
  showStatistics:  boolean    = false;

  get totalTasks()     { return this.tasks.length; }
  get completedTasks() { return this.tasks.filter(t => t.completed).length; }
  get pendingTasks()   { return this.totalTasks - this.completedTasks; }

  private destroy$ = new Subject<void>();

  constructor(
    private storage:    StorageService,
    private firebase:   FirebaseService,
    private alertCtrl:  AlertController,
    private toastCtrl:  ToastController
  ) {}

  ngOnInit(): void {
    combineLatest([this.storage.tasks$, this.storage.categories$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([tasks, categories]) => {
        this.tasks      = tasks;
        this.categories = categories;
        this.applyFilter();
      });

    this.firebase.flags$
      .pipe(takeUntil(this.destroy$))
      .subscribe(flags => {
        this.showStatistics = flags['enable_statistics'] ?? false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterByCategory(id: string): void {
    this.selectedCatId = id;
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredTasks = this.selectedCatId === 'all'
      ? [...this.tasks]
      : this.tasks.filter(t => t.categoryId === this.selectedCatId);
  }

  getCategoryById(id?: string): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  trackByTaskId(_: number, task: Task): string { return task.id; }

  async openAddTaskModal(): Promise<void> {
    const inputs: any[] = [
      { name: 'title', type: 'text', placeholder: 'Título de la tarea *' },
      { name: 'description', type: 'textarea', placeholder: 'Descripción (opcional)' },
    ];

    this.categories.forEach(c => {
      inputs.push({ name: 'category', type: 'radio', label: c.name, value: c.id });
    });

    const alert = await this.alertCtrl.create({
      header: 'Nueva Tarea',
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: (data) => {
            if (!data.title?.trim()) return false;
            this.storage.addTask({
              id:          this.storage.generateId(),
              title:       data.title.trim(),
              description: data.description?.trim(),
              completed:   false,
              categoryId:  data.category,
              createdAt:   new Date()
            });
            this.showToast('✅ Tarea agregada');
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  toggleTask(task: Task): void {
    this.storage.toggleTask(task.id);
  }

  async deleteTask(task: Task): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: `¿Eliminar "${task.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar', role: 'destructive',
          handler: () => {
            this.storage.deleteTask(task.id);
            this.showToast('🗑 Tarea eliminada');
          }
        }
      ]
    });
    await alert.present();
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 1800, position: 'bottom', color: 'success' });
    await toast.present();
  }
}
