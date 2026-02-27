import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {

  private flags = new BehaviorSubject<Record<string, boolean>>({
    enable_statistics: false,
    enable_dark_theme: false,
  });

  flags$ = this.flags.asObservable();

  constructor() {
    // Firebase Remote Config se inicializaría aquí con credenciales reales.
    // Por ahora usamos valores por defecto para que la app funcione sin config.
  }

  getFlag(key: string): boolean {
    return this.flags.getValue()[key] ?? false;
  }

  // Método para simular un cambio de flag (útil en demos)
  setFlag(key: string, value: boolean): void {
    this.flags.next({ ...this.flags.getValue(), [key]: value });
  }
}
