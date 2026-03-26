# 🏥 SaludTotal (Frontend-ST) - Documentación Técnica y Guía de Estudio

Este documento detalla la arquitectura, el stack tecnológico, la estructura del código y los flujos principales del ecosistema Frontend del proyecto **SaludTotal**. Está diseñado como una **guía integral de estudio para la defensa técnica** del sistema.

---

## 🚀 1. Stack Tecnológico (¿Qué usamos y por qué?)

El proyecto está construido sobre un ecosistema moderno de React. A continuación están las decisiones arquitectónicas principales:

*   **Vite**: Se usa como *bundler* (empaquetador) y servidor de desarrollo.
    *   *¿Por qué?* Es infinitamente más rápido que Webpack/Create React App (CRA) gracias a que utiliza "Esbuild" nativamente (basado en Go) y no empaqueta todo el código en desarrollo, sino que sirve archivos ES Modules directamente al navegador.
*   **React 18**: Librería principal para la construcción de interfaces.
*   **TypeScript**: Superconjunto de JavaScript que añade tipado estático.
    *   *¿Por qué?* Previene errores de ejecución mapeando errores en tiempo de escritura. Permite definir interfaces claras (ej. perfiles de doctor, paciente) y autocompletado en el editor.
*   **Tailwind CSS (v3)**: Framework CSS basado en clases utilitarias (`flex`, `text-center`, `mt-4`).
    *   *¿Por qué?* Permite maquetar sin escribir CSS personalizado. Reduce el tamaño final del CSS ya que purga las clases no utilizadas.
*   **shadcn/ui (Radix UI)**: Sistema de componentes de UI.
    *   *¿Por qué no Bootstrap o Material UI?* Shadcn no es una librería de dependencias cerrada (`npm install shadcn`), sino una colección de componentes sobre los que **tienes control total** (se inyectan crudos en la carpeta `components/ui`). Utiliza Radix UI bajo el capó para garantizar accesibilidad (WAI-ARIA) pura sin manejar el diseño.
*   **React Router v7**: Librería de enrutamiento oficial.
    *   *¿Por qué la v7 con objetos (`createBrowserRouter`)?* Es el estándar actual. Permite pre-cargar datos (loaders), crear layouts anidados de manera más declarativa y desacoplar la UI de la configuración de las rutas.
*   **React Hook Form**: Gestión de formularios (se usa típicamente para optimizar rendimientos y evitar re-renderizados innecesarios comparado con el control de estado de React puro).
*   **React Day Picker (v8) + date-fns**: Base funcional para los componentes tipo Calendario.
*   **Lucide React**: Librería de iconos vectoriales coherente y liviana.

---

## 🗂️ 2. Estructura del Proyecto

El código está modularizado bajo el principio de *separación de responsabilidades*, alojado íntegramente dentro del directorio `src/`.

```text
src/
├── app/
│   ├── components/
│   │   └── ui/              # Componentes base inyectados (Botones, Modales, Calendarios, Badges)
│   ├── layouts/             # Plantillas maestras (AuthLayout, DashboardLayout)
│   ├── pages/               # Páginas lógicas de la aplicación organizadas por rol
│   │   ├── admin/           # (Dashboards de admin, registros de usuarios/clínicas)
│   │   ├── doctor/          # (Agenda, vista de historia clínica de pacientes)
│   │   ├── patient/         # (Reservar citas, historial médico)
│   │   └── shared/          # (Páginas comunes a todos los roles: Perfil, Bandeja de entrada)
│   └── routes.tsx           # El "cerebro" del enrutamiento
├── styles/                  # Estilos definidos a nivel global
│   └── index.css            # Define las variables CSS customizadas de shadcn (--primary, --popover, etc)
```

---

## 🔄 3. Enrutamiento y Layouts (`routes.tsx`)

La aplicación no se basa en rutas sueltas. Utilizamos el concepto de **Layouts Anidados**:
1.  **AuthLayout**: Envoltorio para páginas públicas (Login, Register, Recover Password). Todo lo que no requiere estar autenticado.
2.  **DashboardLayout**: El esqueleto maestro interno. Dependiendo del `role` (`"patient"`, `"doctor"`, `"admin"`), este layout cambiará la barra lateral (Sidebar/Navegación) para mostrar las opciones adecuadas a cada tipo de usuario, pero el contendor principal sigue siendo el mismo.

En `routes.tsx`, el registro de rutas usa el objeto de `createBrowserRouter`:
*Ejemplo conceptual de una rama:*
```tsx
{
  path: '/paciente',
  Component: PatientLayout, // Layout con rol de paciente
  children: [
    { index: true, Component: PatientDashboard },
    { path: 'perfil', element: <Profile role="patient" /> }
  ]
}
```

---

## 👥 4. Módulos / Funcionalidades por Rol

El sistema soporta 3 perfiles principales:

### 🏥 Administrador (`/admin`)
*   Responsabilidad: Gestión global del sistema.
*   Páginas principales:
    *   **RegisterClinic / RegisterDoctor / RegisterPatient**: Formularios para dar alta cruzada.
    *   **AllAppointments**: Visor global.

### 🩺 Médico (`/doctor`)
*   Responsabilidad: Atender citas y visualizar historias clínicas.
*   Páginas principales:
    *   **DoctorAgenda**: Su calendario de turnos. Incluye la capacidad de ver citas agendadas y utilizar **Cuadros de Diálogo (Modales de Radix UI)** para Editar o Cancelar dichas consultas.
    *   **PatientHistoryView**: Revisión médica específica de un paciente.

### 🤒 Paciente (`/patient`)
*   Responsabilidad: Auto-gestionar sus turnos y su salud.
*   Páginas principales:
    *   **BookAppointment**: Flujo para agendar.
    *   **MyAppointments**: Citas vigentes/previas.
    *   **MedicalHistory**: Historial unificado.

### 🔗 Módulos Compartidos (`/shared`)
*   **Perfil (`Profile.tsx`)**: Un componente dinámico que, gracias a recibir el `role` vía Props, muta y renderiza condicionalmente. Si es Paciente mostrará "Tipo de Sangre", si es Doctor mostrará "Licencia Médica".
*   **Bandeja de Entrada (`Inbox.tsx`)**: Sistema de alertas/mensajes general.

---

## 🛠️ 5. Calidad de Código y Herramientas CI/CD

Esta es una parte **MUY IMPORTANTE** para tu defensa (demuestra nivel seniority):
El proyecto no usa herramientas antiguas ni deja el formateo al libre albedrío de los programadores.

*   **Biome**: Es nuestro linter y formatter (reemplazo ultrarrápido escrito en Rust para *ESLint* y *Prettier*). Si escribimos código sucio u olvidamos un tipo, Biome falla y evita que código en mal estado llegue a producción.
*   **Stylelint**: Analiza problemas en los archivos de estilos (previene duplicidad o clases rotas CSS/SCSS).
*   **Husky + lint-staged (Git Hooks)**: Antes de que ejecutemos el comando `git commit`, `Husky` secuestra el comando de Git, lee los archivos *staged*, y les corre automáticamente `Biome` y `Stylelint`. Si tienen errores tipográficos o de sintaxis, **el commit se cancela.** Esto garantiza que a github sólo llega "Código Verde".

---

## 🧠 Guía Rápida para Defensa - Preguntas y Respuestas (Q&A)

**P: ¿Por qué elegiste Vite antes que crear una SPA clásica con Create React App?**
**R:** CRA está deprecado oficialmente por el equipo de React. Vite usa ESM nativo en el navegador y Esbuild, logrando que los tiempos de arranque local bajen de 20-30 segundos (en Webpack) a unos pocos milisegundos, dándonos una mejor experiencia de desarrollo (HMR instantáneo).

**P: ¿Cómo solucionaron el conflicto visual del calendario en shadcn?**
**R:** El componente nativo de React que dibuja meses (`react-day-picker`) lanzó una reciente versión (v9) con cambios drásticos al DOM que rompían la estructura esperada por las plantillas CSS de `shadcn/ui`. Para asegurar que todo funcionara bajo la especificación, hicimos un `downgrade` consciente a la versión estable `8.10.1` de `react-day-picker` y agregamos sus variables CSS (`--popover`, `--primary`) en `styles/index.css`.

**P: ¿Para qué usaron los Radix UI Primitives en los Modales (Dialogs)?**
**R:** Se usaron en secciones como la Agenda del Doctor para abrir los modales de "Editar/Cancelar Consulta". Radix nos da funciones de accesibilidad (control de enfoque de teclado, escape para salir, "screen readers") automatizadas y nosotros con Tailwind CSS solo nos preocupamos de pintarlo estéticamente.

**P: ¿Cómo gestionan que un Doctor no vea información que el Paciente debería o viceversa?**
**R:** A nivel componente, pasamos una *prop* llamada `role`. Por ejemplo en `<Profile role="doctor" />`, usamos renderizado condicional clásico en React (`{role === 'doctor' && <JSX>}`). A nivel navegación mayor, React Router protege el acceso envolviendo cada subgrupo bajo Plantillas de Layout diferentes.

**P: ¿Qué es el archivo `biome.json`?**
**R:** Es el archivo de configuración equivalente de ESLint. Nosotros instruimos a la aplicación a correr `npm run check:all` que activa Biome. Biome nos avisa si nos faltó declarar los tipos TS e incluso formatea (borra espacios muertos y estructura las llaves) nuestro archivo en menos de 100 milisegundos.

---

### 📝 Comandos clave para trabajar:
- `npm run dev`: Inicia el servidor.
- `npm run build`: Compila para producción (alojando el resultado optimizado en `/dist`).
- `npm run check:all`: Comando maestro. Ejecuta linter para TS, linter para SCSS y chequeo global.
- `npm run format`: Auto-arregla los problemas de código de manera agresiva. 
