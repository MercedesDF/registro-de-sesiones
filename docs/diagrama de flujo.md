# Diagrama de Flujo de la Aplicación

Este documento utiliza la sintaxis de Mermaid para ilustrar los flujos de usuario principales de la aplicación "Registro de Sesiones y Proyectos".

## Flujo Principal y de Sesión Activa

Este diagrama muestra el ciclo de vida desde que se carga la aplicación hasta que se inicia, pausa, reanuda y detiene una sesión.

```mermaid
graph TD
    A[Inicio: Cargar App] --> B{¿Hay sesión activa en localStorage?};
    B -- Sí --> C[Restaurar sesión activa y mostrar vista de sesión];
    B -- No --> D[Mostrar vista principal];

    D -- Clic en 'Iniciar Nueva Sesión' --> E[Crear nueva sesión];
    E --> C;

    C --> F{Control de Sesión};
    F -- Clic en 'Pausar' --> G[Pausar temporizador, mostrar 'Reanudar'];
    F -- Clic en 'Detener' --> H[Finalizar sesión, calcular duración];
    
    G -- Clic en 'Reanudar' --> F;

    H --> I[Guardar sesión en 'Sesiones Completadas'];
    I --> J[Eliminar sesión de 'Sesión Activa'];
    J --> D;

    D -- Clic en 'HISTORIAL Y PROYECTOS' --> K[Abrir Modal de Gestión];
    K --> D;
```

## Flujo de Gestión en el Modal

Este diagrama detalla las acciones posibles dentro del modal de "Historial y Gestión de Proyectos".

```mermaid
graph TD
    subgraph Modal de Gestión
        A[Abrir Modal] --> B{Seleccionar Pestaña};
        B -- Pestaña 'Sesiones' --> C[Vista de Sesiones Completadas];
        B -- Pestaña 'Proyectos' --> D[Vista de Gestión de Proyectos];
        
        C --> C1[Listar sesiones ordenadas];
        C1 --> C2{Acciones de Sesión};
        C2 -- Seleccionar Sesiones --> C3[Activar botón 'Eliminar Seleccionadas'];
        C3 -- Clic en 'Eliminar' --> C4[Confirmar y eliminar sesiones];
        C2 -- Asignar a Proyecto --> C5[Actualizar `projectId` de la sesión];

        D --> D1[Listar proyectos];
        D1 --> D2{Acciones de Proyecto};
        D2 -- Crear Nuevo Proyecto --> D3[Añadir proyecto a la lista];
        D2 -- Seleccionar Proyectos --> D4[Activar botón 'Eliminar Seleccionados'];
        D4 -- Clic en 'Eliminar' --> D5[Confirmar y eliminar proyectos, desasignar de sesiones];
        D2 -- Finalizar Proyecto --> D6[Marcar como finalizado, calcular y guardar tiempo total];
        D2 -- Reabrir Proyecto --> D7[Marcar como activo, eliminar tiempo finalizado];
    end

    subgraph App Principal
        Main[Vista Principal] -- Clic en 'HISTORIAL Y PROYECTOS' --> A;
    end

    A -- Clic en 'Cerrar' o 'X' --> Main;
```
