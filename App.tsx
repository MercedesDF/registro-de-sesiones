import React, { useState, useEffect, useCallback } from 'react';
import { Session, Project } from './types';
import Header from './components/Header';
import CurrentSessionManager from './components/CurrentSessionManager';
import ProjectManagementModal from './components/ProjectManagementModal'; 
import { formatDuration, formatDate } from './utils/time'; 

// --- Claves de LocalStorage y Versión de la App ---
// Usar constantes para las claves de localStorage mejora la mantenibilidad y reduce errores tipográficos.
// El versionado de claves (ej. '_v1') es una buena práctica para facilitar futuras migraciones 
// de datos si la estructura de los datos almacenados cambia.
const LOCAL_STORAGE_KEYS = {
  ACTIVE_SESSION: 'appActiveSession_v1',
  COMPLETED_SESSIONS: 'appCompletedSessions_v1',
  PROJECTS: 'appProjects_v1', 
};

const APP_VERSION = "v1.0.0"; 

// --- Paleta de Colores del Tema Azul ---
// Definir colores como constantes ayuda a mantener la consistencia visual y facilita los cambios de tema.
const ACCENT_COLOR = '#3B82F6'; // blue-500. Usado por Tailwind: bg-blue-500, text-blue-500
const ACCENT_HOVER_COLOR_CLASS = 'hover:bg-blue-400'; // Tailwind class for blue-400.
const FOOTER_BG_COLOR = '#1E3A8A'; // blue-800
const FOOTER_TEXT_COLOR = '#E0E7FF'; // indigo-100 / azul-grisáceo claro
const TEXT_ON_ACCENT_COLOR = 'white'; // Texto sobre botones de acento
const LINK_BASE_COLOR_CLASS = 'text-blue-600'; // Tailwind class for blue-600 (era LINK_COLOR #2563EB)
const LINK_HOVER_COLOR_CLASS = 'hover:text-blue-700'; // Tailwind class for blue-700 (era LINK_HOVER_COLOR #1D4ED8)
const PRIMARY_TEXT_COLOR = '#1F2937'; // gray-800
const APP_BG_COLOR = '#F9FAFB'; // gray-50 (fondo principal de la app)
const BORDER_COLOR = '#D1D5DB'; // gray-300 (para el borde del popup principal)


const App: React.FC = () => {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);
  const [projects, setProjects] = useState<Project[]>([]); 
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false); 
  const [isLoaded, setIsLoaded] = useState<boolean>(false); // Estado para controlar la carga inicial de datos.

  // --- Carga de Datos desde localStorage ---
  // Este efecto se ejecuta solo una vez al montar el componente (gracias al array de dependencias vacío []).
  // Es crucial para la persistencia de datos entre sesiones del navegador.
  // Se incluye un manejo robusto de errores (try-catch) y validación/sanitización de los datos parseados
  // para prevenir que datos corruptos o malformados rompan la aplicación.
  useEffect(() => {
    console.log("App: Inicializando y cargando datos desde localStorage.");
    try {
      const storedActiveSession = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_SESSION);
      if (storedActiveSession) {
        const parsedActiveSession: Session = JSON.parse(storedActiveSession);
        // Validar datos básicos de la sesión activa
        if (parsedActiveSession && typeof parsedActiveSession.id === 'string' && typeof parsedActiveSession.startTime === 'number') {
          setActiveSession({
            ...parsedActiveSession, // Se esparcen los datos parseados
            // Se aseguran valores por defecto o tipos correctos para campos opcionales o que podrían faltar
            isPaused: typeof parsedActiveSession.isPaused === 'boolean' ? parsedActiveSession.isPaused : false,
            pausedStartTime: typeof parsedActiveSession.pausedStartTime === 'number' ? parsedActiveSession.pausedStartTime : null,
            totalPausedDuration: typeof parsedActiveSession.totalPausedDuration === 'number' ? parsedActiveSession.totalPausedDuration : 0,
          });
        } else {
          // Si los datos no son válidos, limpiar la entrada para evitar problemas futuros
          console.warn("App: Datos de sesión activa corruptos en localStorage. Eliminando.")
          localStorage.removeItem(LOCAL_STORAGE_KEYS.ACTIVE_SESSION);
        }
      }

      const storedCompletedSessions = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPLETED_SESSIONS);
      if (storedCompletedSessions) {
        let parsedData: any = null;
        try { parsedData = JSON.parse(storedCompletedSessions); } 
        catch (parseError) {
          console.error("App: Error al parsear sesiones completadas desde localStorage:", parseError);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.COMPLETED_SESSIONS); // Eliminar datos corruptos
        }
        
        if (Array.isArray(parsedData)) {
          // Sanitizar y validar cada sesión completada
          const sanitizedSessions = parsedData.map((s: any, index: number) => ({
              id: (typeof s.id === 'string' && s.id.trim() !== '') ? s.id.trim() : `session-loaded-${Date.now()}-${index}`,
              startTime: Number(s.startTime) || Date.now(), // Asegurar que sea un número, o usar valor por defecto
              endTime: s.endTime != null ? (Number(s.endTime) || null) : null,
              projectId: typeof s.projectId === 'string' ? s.projectId.trim() : (s.projectId === null ? null : undefined),
              isPaused: false, // Las sesiones guardadas como completadas no están en pausa
              pausedStartTime: null,
              totalPausedDuration: typeof s.totalPausedDuration === 'number' ? s.totalPausedDuration : 0,
            } as Session)
          ).filter(s => s.startTime > 0 && (s.endTime === null || (s.endTime > 0 && s.endTime >= s.startTime))); // Filtro básico de validez
          setCompletedSessions(sanitizedSessions);
        } else if (parsedData !== null) { // Si no es un array pero tampoco es null (indica datos corruptos)
          localStorage.removeItem(LOCAL_STORAGE_KEYS.COMPLETED_SESSIONS);
        }
      }

      const storedProjects = localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECTS);
      if (storedProjects) {
        try {
          const parsedProjects: any[] = JSON.parse(storedProjects);
          if (Array.isArray(parsedProjects)) {
            // Sanitizar y validar cada proyecto
            const validProjects = parsedProjects.filter(p => typeof p.id === 'string' && typeof p.name === 'string')
              .map(p => ({
                ...p,
                isFinalized: typeof p.isFinalized === 'boolean' ? p.isFinalized : false,
                finalizedTotalDuration: typeof p.finalizedTotalDuration === 'number' ? p.finalizedTotalDuration : undefined,
              }));
            setProjects(validProjects);
          } else {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.PROJECTS);
          }
        } catch (error) {
          console.error("App: Error al parsear proyectos desde localStorage", error);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.PROJECTS);
        }
      }

    } catch (error) {
      console.error("App: Error inesperado al cargar datos desde localStorage:", error);
      // En un escenario real, se podría considerar una estrategia de recuperación o notificación al usuario.
    }
    setIsLoaded(true); // Marcar la carga inicial como completada
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez.

  // --- Guardado de Datos en localStorage ---
  // Estos efectos se encargan de persistir el estado de la aplicación en localStorage
  // cada vez que las respectivas piezas de estado (activeSession, completedSessions, projects) cambian.
  // El chequeo `!isLoaded` previene el guardado durante la hidratación inicial,
  // evitando posibles sobrescrituras si los efectos se disparan antes de que los datos estén completamente cargados.

  useEffect(() => {
    if (!isLoaded) return; 
    try {
      if (activeSession) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(activeSession));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACTIVE_SESSION);
      }
    } catch (error) {
      console.error("App: Error al guardar la sesión activa:", error);
      // Considerar notificar al usuario si el guardado falla repetidamente.
    }
  }, [activeSession, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.COMPLETED_SESSIONS, JSON.stringify(completedSessions));
    } catch (error) {
      console.error("App: Error al guardar las sesiones completadas:", error);
    }
  }, [completedSessions, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (error) {
      console.error("App: Error al guardar los proyectos:", error);
    }
  }, [projects, isLoaded]);

  // --- Confirmación antes de salir (UX) ---
  // Este efecto añade un listener al evento `beforeunload`. Si hay una sesión activa,
  // se mostrará un diálogo de confirmación nativo del navegador antes de que el usuario cierre la pestaña/ventana.
  // Esto ayuda a prevenir la pérdida accidental del progreso de una sesión activa.
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (activeSession) {
        event.preventDefault(); // Requerido por la especificación para mostrar el diálogo.
        event.returnValue = ''; // Requerido por algunos navegadores (ej. Chrome) para mostrar el diálogo.
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    // Función de limpieza: eliminar el event listener cuando el componente se desmonte.
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeSession]); // El efecto depende de `activeSession` para saber si debe o no mostrar la advertencia.


  // --- Manejadores de Eventos (Callbacks) ---
  // El uso de `useCallback` memoiza estas funciones, lo que significa que no se recrean en cada render
  // a menos que sus dependencias cambien. Esto puede ser una optimización si estas funciones
  // se pasan como props a componentes hijos que están optimizados con React.memo.

  const handleStartSession = useCallback(() => {
    if (activeSession) {
      alert("Ya hay una sesión activa. Deténgala primero."); // Simple validación.
      return;
    }
    const newSession: Session = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // ID único simple.
      startTime: Date.now(),
      endTime: null,
      projectId: null, 
      isPaused: false,
      pausedStartTime: null,
      totalPausedDuration: 0,
    };
    setActiveSession(newSession);
  }, [activeSession]); // Depende de `activeSession` para la validación.

  const handlePauseSession = useCallback(() => {
    if (activeSession && !activeSession.isPaused) {
      setActiveSession(prev => prev ? ({ // Actualización funcional del estado para asegurar que se usa el estado más reciente.
        ...prev,
        isPaused: true,
        pausedStartTime: Date.now(),
      }) : null);
    }
  }, [activeSession]);

  const handleResumeSession = useCallback(() => {
    if (activeSession && activeSession.isPaused && activeSession.pausedStartTime) {
      const currentPauseDuration = Date.now() - activeSession.pausedStartTime;
      setActiveSession(prev => prev ? ({
        ...prev,
        isPaused: false,
        pausedStartTime: null, // Resetear el tiempo de inicio de pausa.
        totalPausedDuration: (prev.totalPausedDuration || 0) + currentPauseDuration, // Acumular duración de la pausa.
      }) : null);
    }
  }, [activeSession]);

  const handleStopSession = useCallback(() => {
    if (!activeSession) return;
    
    let finalTotalPausedDuration = activeSession.totalPausedDuration || 0;
    // Si la sesión está pausada al momento de detenerla, sumar la duración de esa última pausa.
    if (activeSession.isPaused && activeSession.pausedStartTime) {
      finalTotalPausedDuration += (Date.now() - activeSession.pausedStartTime);
    }

    const sessionToEnd: Session = {
      ...activeSession,
      endTime: Date.now(),
      isPaused: false, // Asegurar que no quede como pausada al guardarse.
      pausedStartTime: null,
      totalPausedDuration: finalTotalPausedDuration,
    };
    // Añadir a sesiones completadas (al principio del array para verla primero) y limpiar sesión activa.
    setCompletedSessions(prevSessions => [sessionToEnd, ...prevSessions]);
    setActiveSession(null);
  }, [activeSession]);

  const handleDeleteSelectedSessions = useCallback((sessionIdsToDelete: string[]) => {
    if (sessionIdsToDelete.length === 0) return;
    const idsToDeleteSet = new Set(sessionIdsToDelete.map(id => String(id))); // Usar Set para búsqueda eficiente.
    setCompletedSessions(prevSessions => prevSessions.filter(s => !idsToDeleteSet.has(String(s.id))));
  }, []); // Sin dependencias, ya que no usa estado o props directamente en su lógica que cambien.

  const handleAddProject = useCallback((projectName: string) => {
    if (!projectName.trim()) {
      alert("El nombre del proyecto no puede estar vacío.");
      return;
    }
    const newProject: Project = {
      id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: projectName.trim(),
      isFinalized: false, 
    };
    setProjects(prevProjects => [newProject, ...prevProjects]);
  }, []); 

  const handleDeleteSelectedProjects = useCallback((projectIdsToDelete: string[]) => {
    if (projectIdsToDelete.length === 0) return;
    const idsToDeleteSet = new Set(projectIdsToDelete.map(id => String(id)));
    setProjects(prevProjects => prevProjects.filter(p => !idsToDeleteSet.has(String(p.id))));
    // Desasignar proyecto de las sesiones completadas asociadas a los proyectos eliminados.
    setCompletedSessions(prevSessions =>
      prevSessions.map(s => {
        if (s.projectId && idsToDeleteSet.has(String(s.projectId))) {
          return { ...s, projectId: null };
        }
        return s;
      })
    );
  }, []);

  const handleAssignSessionToProject = useCallback((sessionId: string, projectId: string | null) => {
    setCompletedSessions(prevSessions =>
      prevSessions.map(s => {
        if (s.id === sessionId) {
          if (projectId) { // Solo verificar si se está asignando un proyecto.
            const project = projects.find(p => p.id === projectId);
            if (project?.isFinalized) {
              alert("No se puede asignar la sesión a un proyecto finalizado.");
              return s; // No cambiar la asignación si el proyecto está finalizado.
            }
          }
          return { ...s, projectId: projectId };
        }
        return s;
      })
    );
  }, [projects]); // Depende de `projects` para verificar si un proyecto está finalizado.
  
  const handleFinalizeProject = useCallback((projectId: string) => {
    setProjects(prevProjects => 
      prevProjects.map(p => {
        if (p.id === projectId) {
          // Calcular duración total solo de sesiones válidas y asignadas a este proyecto.
          const projectSessions = completedSessions.filter(
            s => s.projectId === projectId && s.endTime !== null && s.startTime !== null
          );
          const totalDuration = projectSessions.reduce(
            (sum, s) => {
              const sessionStartTime = Number(s.startTime); 
              const sessionEndTime = Number(s.endTime);
              // Comprobación de validez de tiempos para evitar NaN o duraciones negativas.
              if (isNaN(sessionStartTime) || isNaN(sessionEndTime) || sessionEndTime < sessionStartTime) {
                console.warn(`Omitiendo sesión ${s.id} para proyecto ${projectId} debido a datos de tiempo inválidos.`);
                return sum;
              }
              const effectiveDuration = (sessionEndTime - sessionStartTime) - (s.totalPausedDuration || 0);
              return sum + Math.max(0, effectiveDuration); // Asegurar que la duración no sea negativa.
            }, 
            0
          );
          return { ...p, isFinalized: true, finalizedTotalDuration: totalDuration };
        }
        return p;
      })
    );
  }, [completedSessions]); // Depende de `completedSessions` para calcular el tiempo total.

  const handleReopenProject = useCallback((projectId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === projectId) {
          return { ...p, isFinalized: false, finalizedTotalDuration: undefined }; // Limpiar duración finalizada.
        }
        return p;
      })
    );
  }, []);

  const handleToggleHistoryModal = () => {
    setShowHistoryModal(prev => !prev);
  };

  // --- Renderizado Condicional (Carga) ---
  if (!isLoaded) {
    return (
      <div style={{ backgroundColor: APP_BG_COLOR, color: PRIMARY_TEXT_COLOR }} className="flex items-center justify-center min-h-screen">
        <div className="text-xl" role="status" aria-label="Cargando datos de la aplicación">Cargando datos...</div>
      </div>
    );
  }

  // --- Renderizado Principal ---
  return (
    <>
      {/* Contenedor principal del widget flotante */}
      <div 
        style={{ backgroundColor: APP_BG_COLOR, borderColor: BORDER_COLOR }}
        className="fixed bottom-4 right-4 max-w-sm w-[calc(100%-2rem)] sm:w-full shadow-2xl rounded-lg flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] border z-50"
      >
        {activeSession ? (
          // Vista cuando hay una sesión activa (simplificada, solo el gestor de sesión)
          <main className="flex-grow flex flex-col justify-center items-center p-2 sm:p-4">
            <div className="w-full">
              <CurrentSessionManager
                activeSession={activeSession}
                onStartSession={handleStartSession} // Aunque no se use aquí, se pasa por consistencia de la interfaz del prop.
                onStopSession={handleStopSession}
                onPauseSession={handlePauseSession}
                onResumeSession={handleResumeSession}
              />
            </div>
          </main>
        ) : (
          // Vista cuando no hay sesión activa (con header, footer y botón de historial)
          <>
            <Header />
            <main className="flex-grow p-4 overflow-y-auto"> {/* Scroll interno para esta sección si el contenido excede */}
              <div className="max-w-3xl mx-auto">
                <CurrentSessionManager
                  activeSession={activeSession} // Será null aquí
                  onStartSession={handleStartSession}
                  onStopSession={handleStopSession} // No aplicable aquí (no hay sesión activa para detener).
                  onPauseSession={handlePauseSession} // No aplicable.
                  onResumeSession={handleResumeSession} // No aplicable.
                />
                <div className="mt-6 text-center">
                  <button
                    onClick={handleToggleHistoryModal}
                    style={{ backgroundColor: ACCENT_COLOR, color: TEXT_ON_ACCENT_COLOR }}
                    className={`font-bold py-2.5 px-5 rounded-lg text-base transition duration-150 ease-in-out shadow-md hover:shadow-lg ${ACCENT_HOVER_COLOR_CLASS}`}
                    aria-label="Abrir historial y gestión de proyectos"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 inline-block align-middle">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 4.5 3.75h15A2.25 2.25 0 0 1 21.75 6v3.776" />
                    </svg>
                    HISTORIAL Y PROYECTOS
                  </button>
                </div>
              </div>
            </main>
            <footer style={{ backgroundColor: FOOTER_BG_COLOR, color: FOOTER_TEXT_COLOR }} className="text-center p-3 text-xs mt-auto flex-shrink-0">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                <div className="text-center md:text-left">
                  <p className="font-semibold">Versión: {APP_VERSION}</p>
                  <p>&copy; {new Date().getFullYear()} mercedev</p>
                </div>
                <div className="flex flex-col items-center md:items-end space-y-1">
                  {/* Se usan clases de Tailwind para colores base y hover para consistencia */}
                  <a href="mailto:mercedev@mercedev.es" className={`${LINK_BASE_COLOR_CLASS} ${LINK_HOVER_COLOR_CLASS} transition-colors`}>mercedev@mercedev.es</a>
                  <div className="flex items-center space-x-3">
                    <a href="https://github.com/MercedesDF/02-registro-de-sesiones-v1.0.0" target="_blank" rel="noopener noreferrer" aria-label="GitHub de mercedev" className={`${LINK_BASE_COLOR_CLASS} ${LINK_HOVER_COLOR_CLASS} transition-colors`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.201 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12.017C22 6.484 17.522 2 12 2Z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/mercedesdf" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de mercedev" className={`${LINK_BASE_COLOR_CLASS} ${LINK_HOVER_COLOR_CLASS} transition-colors`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/mercedesdf-ingenieria" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Ingeniería de mercedev" className={`${LINK_BASE_COLOR_CLASS} ${LINK_HOVER_COLOR_CLASS} transition-colors`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.5 5.25A2.25 2.25 0 019.75 3h4.5A2.25 2.25 0 0116.5 5.25V6h3.75a3 3 0 013 3v6a3 3 0 01-3 3H3.75a3 3 0 01-3-3V9a3 3 0 013-3H7.5V5.25zm4.5 3.75a.75.75 0 00-1.5 0v.75H9a.75.75 0 000 1.5h1.5v.75a.75.75 0 001.5 0v-.75H15a.75.75 0 000-1.5h-1.5v-.75a.75.75 0 00-1.5 0v.75h-1.5V9z" clipRule="evenodd" />
                        <path d="M7.5 16.5V21a1.5 1.5 0 001.5 1.5h6A1.5 1.5 0 0016.5 21v-4.5H7.5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
      
      {/* Modal de Historial y Proyectos: se renderiza condicionalmente. */}
      {showHistoryModal && (
        <ProjectManagementModal
          isOpen={showHistoryModal}
          onClose={handleToggleHistoryModal}
          sessions={completedSessions}
          projects={projects}
          onAddProject={handleAddProject}
          onDeleteSelectedProjects={handleDeleteSelectedProjects}
          onDeleteSelectedSessions={handleDeleteSelectedSessions}
          onAssignSessionToProject={handleAssignSessionToProject}
          onFinalizeProject={handleFinalizeProject}
          onReopenProject={handleReopenProject}
          formatDuration={formatDuration} 
          formatDate={formatDate}
        />
      )}
    </>
  );
};

export default App;
