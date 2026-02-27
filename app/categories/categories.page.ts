import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Category } from '../shared/models/task.model';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.page.html',
  styleUrls: ['categories.page.scss']
})
export class CategoriesPage implements OnInit, OnDestroy {

  categories: Category[] = [];
  colors = ['#3880ff','#eb445a','#2dd36f','#ffc409','#6030a0','#17a2b8','#ff6b35','#92949c'];

  private destroy$ = new Subject<void>();

  constructor(
    private storage:   StorageService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.storage.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cats => this.categories = cats);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByCatId(_: number, cat: Category): string { return cat.id; }

  async openAddAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Categoría',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Nombre de la categoría' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            if (!data.name?.trim()) return false;
            this.storage.addCategory({
              id:        this.storage.generateId(),
              name:      data.name.trim(),
              color:     this.colors[Math.floor(Math.random() * this.colors.length)],
              createdAt: new Date()
            });
            this.showToast('🏷️ Categoría creada');
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async openEditAlert(cat: Category): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar Categoría',
      inputs: [{ name: 'name', type: 'text', value: cat.name }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.name?.trim()) return false;
            this.storage.updateCategory({ ...cat, name: data.name.trim() });
            this.showToast('✏️ Categoría actualizada');
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteCategory(cat: Category): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar categoría',
      message: `¿Eliminar "${cat.name}"? Las tareas quedarán sin categoría.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar', role: 'destructive',
          handler: () => {
            this.storage.deleteCategory(cat.id);
            this.showToast('🗑 Categoría eliminada');
          }
        }
      ]
    });
    await alert.present();
  }

  changeColor(cat: Category, color: string): void {
    this.storage.updateCategory({ ...cat, color });
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 1800, position: 'bottom', color: 'success' });
    await toast.present();
  }
}
