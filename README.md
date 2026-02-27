# 📝 TodoApp — Ionic + Angular

## ▶️ Correr en GitHub Codespaces (paso a paso)

1. Abrir el repositorio en GitHub
2. Click en botón verde **`<> Code`** → pestaña **Codespaces** → **"Create codespace on main"**
3. Esperar que abra el editor (1-2 min)
4. En la terminal ejecutar en orden:

```bash
npm install
```

```bash
npm install -g @ionic/cli
```

```bash
ionic serve --host=0.0.0.0
```

5. Cuando aparezca el popup **"Open in Browser"** → hacer click
6. ¡La app está corriendo! 🚀

---

## 💻 Correr en local (tu computadora)

```bash
npm install
npm install -g @ionic/cli
ionic serve
```

Abre automáticamente **http://localhost:8100**

---

## 📁 Estructura del proyecto

```
src/app/
├── shared/
│   ├── models/task.model.ts          # Interfaces Task y Category
│   └── services/
│       ├── storage.service.ts        # CRUD con localStorage
│       └── firebase.service.ts       # Feature flags Remote Config
├── home/                             # Pantalla principal
│   ├── home.page.ts
│   ├── home.page.html
│   ├── home.page.scss
│   └── home.module.ts
├── categories/                       # Pantalla de categorías
│   ├── categories.page.ts
│   ├── categories.page.html
│   ├── categories.page.scss
│   └── categories.module.ts
├── app.component.ts
├── app.module.ts
└── app-routing.module.ts
```

## ✅ Funcionalidades
- Agregar, completar y eliminar tareas
- Crear, editar y eliminar categorías con color personalizable
- Filtrar tareas por categoría
- Feature flag `enable_statistics` (Firebase Remote Config simulado)
- Persistencia con localStorage
