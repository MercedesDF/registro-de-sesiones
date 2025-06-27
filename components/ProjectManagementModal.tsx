import React, { useState, useMemo, useEffect } from 'react';
import { Session, Project } from '../types';

interface ProjectManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
  projects: Project[];
  onAddProject: (projectName: string) => void;
  onDeleteSelectedProjects: (projectIds: string[]) => void;
  onDeleteSelectedSessions: (sessionIds: string[]) => void;
  onAssignSessionToProject: (sessionId: string, projectId: string | null) => void;
  onFinalizeProject: (projectId: string) => void;
  onReopenProject: (projectId: string) => void;
  formatDuration: (milliseconds: number) => string;
  formatDate: (timestamp: number) => string;
}

// Colores del Tema Verde (usados en el Modal) y clases de Tailwind correspondientes
const ACCENT_COLOR_CLASS = 'bg-green-500'; 
const ACCENT_HOVER_COLOR_CLASS = 'hover:bg-green-600';
const TEXT_PRIMARY_COLOR = '#1F2937'; // gray-800
const TEXT_SECONDARY_COLOR = '#4B5563'; // gray-600
const SURFACE_MODAL_COLOR = '#FFFFFF'; // white (bg-white)
const MODAL_BG_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.6)';
const BORDER_PRIMARY_COLOR = '#D1D5DB'; // gray-300 (border-gray-300)
const BORDER_INPUT_COLOR = '#9CA3AF'; // gray-400 (border-gray-400)
const DANGER_COLOR_CLASS = 'bg-red-500'; // Corresponde a DANGER_COLOR #EF4444
const DANGER_HOVER_COLOR_CLASS = 'hover:bg-red-400';// Corresponde a DANGER_HOVER_COLOR #F87171
const TEXT_ON_ACCENT_COLOR = 'white'; // text-white
const SUCCESS_BG_COLOR = '#D1FAE5'; // green-100 (bg-green-100)
const SUCCESS_TEXT_COLOR = '#065F46'; // green-700 (text-green-700)
const REOPEN_BUTTON_COLOR_CLASS = 'text-amber-500'; // Corresponde a REOPEN_BUTTON_COLOR #F59E0B
const REOPEN_BUTTON_HOVER_COLOR_CLASS = 'hover:text-amber-400'; // Corresponde a REOPEN_BUTTON_HOVER_COLOR #FBBF24
const TAB_INACTIVE_BG_HOVER_COLOR_CLASS = 'hover:bg-green-50';
const TAB_ACTIVE_TEXT_BORDER_COLOR_CLASS = 'text-green-600 border-green-600';
const TAB_ACTIVE_BG_COLOR_CLASS = 'bg-green-50';

const ProjectManagementModal: React.FC<ProjectManagementModalProps> = ({
  isOpen,
  onClose,
  sessions,
  projects,
  onAddProject,
  onDeleteSelectedProjects,
  onDeleteSelectedSessions,
  onAssignSessionToProject,
  onFinalizeProject,
  onReopenProject,
  formatDuration,
  formatDate,
}) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [activeTab, setActiveTab] = useState<'sessions' | 'projects'>('sessions');
  
  // Usar Set para selectedSessionIds y selectedProjectIds es eficiente para operaciones de
  // agregar, eliminar y verificar la existencia (O(1) en promedio).
  const [selectedSessionIds, setSelectedSessionIds] = useState<Set<string>>(new Set());
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(new Set());

  // useEffect para resetear las selecciones cuando cambia la pestaña activa o cuando el modal se abre/cierra.
  // Esto asegura que el usuario comience con una selección limpia en cada contexto.
  useEffect(() => {
    setSelectedSessionIds(new Set());
    setSelectedProjectIds(new Set());
  }, [activeTab, isOpen]);

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim());
      setNewProjectName('');
    } else {
      alert("El nombre del proyecto no puede estar vacío.");
    }
  };

  // useMemo se utiliza para memoizar los resultados de cálculos costosos (como ordenar arrays).
  // La función solo se re-ejecuta si una de sus dependencias (sessions o projects) cambia.
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => b.startTime - a.startTime); // Sesiones más recientes primero.
  }, [sessions]);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a,b) => {
      // Ordenar: Proyectos activos primero (por nombre), luego proyectos finalizados (por nombre).
      if (a.isFinalized && !b.isFinalized) return 1;
      if (!a.isFinalized && b.isFinalized) return -1;
      return a.name.localeCompare(b.name);
    });
  }, [projects]);

  const getSessionEffectiveDuration = (session: Session): number => {
    if (session.endTime === null || session.startTime === null) return 0;
    const rawDuration = Number(session.endTime) - Number(session.startTime);
    const pausedDuration = Number(session.totalPausedDuration) || 0;
    return Math.max(0, rawDuration - pausedDuration); // Asegurar que no sea negativo.
  };

  const projectTotalTimes = useMemo(() => {
    const totals: { [projectId: string]: number } = {};
    projects.forEach(project => {
      if (project.isFinalized && typeof project.finalizedTotalDuration === 'number') { 
        // Si el proyecto está finalizado y tiene una duración guardada, usarla.
        totals[project.id] = project.finalizedTotalDuration;
      } else {
        // Calcular dinámicamente para proyectos no finalizados.
        const projectSessions = sessions.filter(
          s => s.projectId === project.id && s.endTime !== null && s.startTime !== null
        );
        const totalDuration = projectSessions.reduce(
          (sum, s) => {
            const sessionStartTime = Number(s.startTime);
            const sessionEndTime = Number(s.endTime);
            if (isNaN(sessionStartTime) || isNaN(sessionEndTime) || sessionEndTime < sessionStartTime) {
              console.warn(`Omitiendo sesión ${s.id} para proyecto ${project.name} (ID: ${project.id}) debido a datos de tiempo inválidos para la visualización dinámica.`);
              return sum;
            }
            return sum + getSessionEffectiveDuration(s);
          }, 
          0
        );
        totals[project.id] = totalDuration;
      }
    });
    return totals;
  }, [sessions, projects]); // Recalcular si cambian las sesiones o los proyectos.

  const handleSessionSelectionChange = (sessionId: string) => {
    setSelectedSessionIds(prev => {
      const newSet = new Set(prev); // Crear una nueva instancia de Set para la inmutabilidad.
      if (newSet.has(sessionId)) newSet.delete(sessionId);
      else newSet.add(sessionId);
      return newSet;
    });
  };
  
  const handleSelectAllSessions = () => {
    if (selectedSessionIds.size === sortedSessions.length && sortedSessions.length > 0) {
      setSelectedSessionIds(new Set()); // Deseleccionar todos.
    } else {
      setSelectedSessionIds(new Set(sortedSessions.map(s => s.id))); // Seleccionar todos.
    }
  };

  const handleProjectSelectionChange = (projectId: string) => {
    setSelectedProjectIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) newSet.delete(projectId);
      else newSet.add(projectId);
      return newSet;
    });
  };

  const handleSelectAllProjects = () => {
    if (selectedProjectIds.size === sortedProjects.length && sortedProjects.length > 0) {
      setSelectedProjectIds(new Set());
    } else {
      setSelectedProjectIds(new Set(sortedProjects.map(p => p.id)));
    }
  };

  const handleDeleteSelectedSessionsClick = () => {
    if (selectedSessionIds.size === 0) return;
    if (window.confirm(`¿Seguro que quieres eliminar ${selectedSessionIds.size} sesión(es) seleccionada(s)? Esta acción no se puede deshacer.`)) {
      onDeleteSelectedSessions(Array.from(selectedSessionIds));
      setSelectedSessionIds(new Set()); // Limpiar selección después de eliminar.
    }
  };

  const handleDeleteSelectedProjectsClick = () => {
    if (selectedProjectIds.size === 0) return;
    if (window.confirm(`¿Seguro que quieres eliminar ${selectedProjectIds.size} proyecto(s) seleccionado(s)? Las sesiones previamente asociadas perderán su asignación de proyecto. Esta acción no se puede deshacer.`)) {
      onDeleteSelectedProjects(Array.from(selectedProjectIds));
      setSelectedProjectIds(new Set()); 
    }
  };


  if (!isOpen) return null;

  return (
    <div 
      style={{ backgroundColor: MODAL_BG_OVERLAY_COLOR }}
      className="fixed inset-0 flex items-center justify-center p-4 z-[100] transition-opacity duration-300 ease-in-out"
      aria-labelledby="modal-title" // Asocia el título del modal con el div para accesibilidad.
      role="dialog" // Indica que este elemento es un diálogo.
      aria-modal="true" // Indica que el contenido fuera del diálogo está inerte.
    >
      <div 
        style={{ backgroundColor: SURFACE_MODAL_COLOR, borderColor: BORDER_PRIMARY_COLOR }}
        className="rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border"
      >
        {/* Cabecera del Modal */}
        <div style={{ borderColor: BORDER_PRIMARY_COLOR }} className="flex justify-center items-center p-4 sm:p-6 border-b relative">
          <h2 id="modal-title" style={{ color: TEXT_PRIMARY_COLOR }} className={`text-xl sm:text-2xl font-semibold text-green-600`}>
            Historial y Gestión de Proyectos
          </h2>
          <button
            onClick={onClose}
            style={{ color: TEXT_SECONDARY_COLOR }}
            className="absolute top-1/2 right-4 -translate-y-1/2 hover:text-gray-700 transition-colors p-1 -m-1 sm:right-6"
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Pestañas de Navegación */}
        <div style={{ borderColor: BORDER_PRIMARY_COLOR }} className="flex border-b">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-colors ${activeTab === 'sessions' ? `border-b-2 ${TAB_ACTIVE_TEXT_BORDER_COLOR_CLASS} ${TAB_ACTIVE_BG_COLOR_CLASS}` : `text-gray-600 ${TAB_INACTIVE_BG_HOVER_COLOR_CLASS} hover:text-green-600`}`}
            aria-pressed={activeTab === 'sessions'} // Indica si la pestaña está activa.
          >
            Sesiones Grabadas
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-colors ${activeTab === 'projects' ? `border-b-2 ${TAB_ACTIVE_TEXT_BORDER_COLOR_CLASS} ${TAB_ACTIVE_BG_COLOR_CLASS}` : `text-gray-600 ${TAB_INACTIVE_BG_HOVER_COLOR_CLASS} hover:text-green-600`}`}
            aria-pressed={activeTab === 'projects'}
          >
            Gestionar Proyectos
          </button>
        </div>

        {/* Contenido de las Pestañas */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow" style={{color: TEXT_PRIMARY_COLOR}}>
          {activeTab === 'sessions' && (
            <div>
              {selectedSessionIds.size > 0 && (
                <div className="mb-4 text-right">
                  {/* Botones con estilos y hovers manejados por clases Tailwind */}
                  <button
                    onClick={handleDeleteSelectedSessionsClick}
                    style={{ color: TEXT_ON_ACCENT_COLOR }}
                    className={`font-semibold py-2 px-4 rounded-lg text-xs sm:text-sm transition duration-150 ease-in-out flex items-center ml-auto shadow hover:shadow-md ${DANGER_COLOR_CLASS} ${DANGER_HOVER_COLOR_CLASS}`}
                    title={`Eliminar ${selectedSessionIds.size} sesión(es) seleccionada(s)`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 sm:mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.077m3.22-.077L10.879 3.287a1.125 1.125 0 0 1 1.121-.828h1.008a1.125 1.125 0 0 1 1.121.828L15.17 5.79m-4.895-.397A48.732 48.732 0 0 1 12 5.4c.873 0 1.732.084 2.559.226M15.17 5.79L12 5.4m3.17 0L12 5.4" />
                    </svg>
                    Eliminar Seleccionadas ({selectedSessionIds.size})
                  </button>
                </div>
              )}
              {sortedSessions.length === 0 ? (
                <p style={{ color: TEXT_SECONDARY_COLOR }} className="text-center py-8">No hay sesiones grabadas.</p>
              ) : (
                <div className="overflow-x-auto"> {/* Permite scroll horizontal en tablas pequeñas */}
                  <table className="min-w-full divide-y border-gray-300"> {/* Estilo de borde directo en tabla */}
                    <thead className="bg-gray-100"> {/* Estilo de fondo directo en thead */}
                      <tr>
                        <th className="px-2 py-3 sm:px-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700"> {/* Color de texto explícito */}
                          <input 
                            type="checkbox"
                            className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 border-gray-400 rounded focus:ring-offset-0 text-green-600 focus:ring-green-500" // Clases Tailwind para estilo y foco. accentColor no es necesario si se usa text-green-600
                            checked={sortedSessions.length > 0 && selectedSessionIds.size === sortedSessions.length}
                            onChange={handleSelectAllSessions}
                            aria-label="Seleccionar todas las sesiones"
                            disabled={sortedSessions.length === 0}
                          />
                        </th>
                        <th className="px-2 py-3 sm:px-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Inicio</th>
                        <th className="px-2 py-3 sm:px-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Fin</th>
                        <th className="px-2 py-3 sm:px-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Duración (Efectiva)</th>
                        <th className="px-2 py-3 sm:px-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Proyecto</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y border-gray-300">
                      {sortedSessions.map(session => (
                        <tr key={session.id} className={`transition-colors ${selectedSessionIds.has(session.id) ? `bg-green-100` : `hover:bg-gray-50`}`}>
                          <td className="px-2 py-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 border-gray-400 rounded focus:ring-offset-0 text-green-600 focus:ring-green-500"
                              checked={selectedSessionIds.has(session.id)}
                              onChange={() => handleSessionSelectionChange(session.id)}
                              aria-labelledby={`session-start-time-${session.id}`} // Asocia checkbox con info de la fila.
                            />
                          </td>
                          <td id={`session-start-time-${session.id}`} style={{ color: TEXT_PRIMARY_COLOR }} className="px-2 py-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">{formatDate(session.startTime)}</td>
                          <td style={{ color: TEXT_PRIMARY_COLOR }} className="px-2 py-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">{session.endTime ? formatDate(session.endTime) : 'En curso'}</td>
                          <td style={{ color: TEXT_PRIMARY_COLOR }} className="px-2 py-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm font-mono">
                            {session.endTime ? formatDuration(getSessionEffectiveDuration(session)) : '-'}
                          </td>
                          <td className="px-2 py-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                            <select
                              value={session.projectId || ''}
                              onChange={(e) => onAssignSessionToProject(session.id, e.target.value || null)}
                              className="w-full border-gray-400 text-gray-800 bg-white text-xs sm:text-sm rounded-md p-1.5 focus:ring-green-500 focus:border-green-500"
                              aria-label={`Asignar proyecto a sesión iniciada el ${formatDate(session.startTime)}`}
                            >
                              <option value="">Sin proyecto</option>
                              {sortedProjects.map(p => (
                                <option 
                                  key={p.id} 
                                  value={p.id} 
                                  disabled={p.isFinalized} // No se puede asignar a proyectos finalizados.
                                  className={p.isFinalized ? `text-gray-400 italic` : ""}
                                >
                                  {p.name} {p.isFinalized ? "(Finalizado)" : ""}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <form onSubmit={handleAddProjectSubmit} className="mb-6 flex justify-center gap-2 sm:gap-4">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Nombre del nuevo proyecto"
                  className="flex-grow border-gray-400 text-gray-800 bg-white placeholder-gray-400 placeholder-opacity-75 text-sm sm:text-base rounded-md p-2.5 focus:ring-green-500 focus:border-green-500"
                  aria-label="Nombre del nuevo proyecto"
                />
                <button 
                  type="submit"
                  style={{ color: TEXT_ON_ACCENT_COLOR }}
                  className={`font-semibold py-2.5 px-4 sm:px-6 rounded-md text-sm sm:text-base transition-colors flex items-center shadow hover:shadow-md ${ACCENT_COLOR_CLASS} ${ACCENT_HOVER_COLOR_CLASS}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 sm:mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Crear
                </button>
              </form>
              {selectedProjectIds.size > 0 && (
                <div className="mb-4 text-right">
                  <button
                    onClick={handleDeleteSelectedProjectsClick}
                    style={{ color: TEXT_ON_ACCENT_COLOR }}
                    className={`font-semibold py-2 px-4 rounded-lg text-xs sm:text-sm transition duration-150 ease-in-out flex items-center ml-auto shadow hover:shadow-md ${DANGER_COLOR_CLASS} ${DANGER_HOVER_COLOR_CLASS}`}
                    title={`Eliminar ${selectedProjectIds.size} proyecto(s) seleccionado(s)`}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 sm:mr-2">
                       <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.077m3.22-.077L10.879 3.287a1.125 1.125 0 0 1 1.121-.828h1.008a1.125 1.125 0 0 1 1.121.828L15.17 5.79m-4.895-.397A48.732 48.732 0 0 1 12 5.4c.873 0 1.732.084 2.559.226M15.17 5.79L12 5.4m3.17 0L12 5.4" />
                    </svg>
                    Eliminar Seleccionados ({selectedProjectIds.size})
                  </button>
                </div>
              )}
              {sortedProjects.length === 0 ? (
                <p style={{ color: TEXT_SECONDARY_COLOR }} className="text-center py-8">No hay proyectos creados.</p>
              ) : (
                <ul className="space-y-2">
                   {/* Cabecera de la lista de proyectos, estilada como la cabecera de la tabla */}
                   <li className="bg-gray-100 text-gray-700 border-b border-gray-300 p-3 sm:p-4 rounded-t-md flex items-center justify-between text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center flex-grow min-w-0"> {/* min-w-0 para truncar texto si es necesario */}
                        <input 
                          type="checkbox"
                          className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 border-gray-400 rounded focus:ring-offset-0 text-green-600 focus:ring-green-500 mr-2 sm:mr-3 flex-shrink-0"
                          checked={sortedProjects.length > 0 && selectedProjectIds.size === sortedProjects.length}
                          onChange={handleSelectAllProjects}
                          aria-label="Seleccionar todos los proyectos"
                          disabled={sortedProjects.length === 0}
                        />
                        <span className="truncate">Nombre del Proyecto</span>
                      </div>
                      <span className="flex-shrink-0 ml-2">Tiempo / Estado</span>
                    </li>
                  {sortedProjects.map(project => (
                    <li 
                      key={project.id} 
                      className={`p-3 sm:p-4 flex items-center justify-between transition-colors border rounded-b-md
                        hover:bg-gray-50 
                        ${project.isFinalized ? 'opacity-80' : ''}
                        ${selectedProjectIds.has(project.id) ? 'bg-green-100 border-green-500' : 'bg-white border-gray-300'}`} // Clases Tailwind para selección
                    >
                      <div className="flex items-center flex-grow min-w-0">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 border-gray-400 rounded focus:ring-offset-0 text-green-600 focus:ring-green-500 mr-2 sm:mr-3 flex-shrink-0"
                          checked={selectedProjectIds.has(project.id)}
                          onChange={() => handleProjectSelectionChange(project.id)}
                          aria-labelledby={`project-name-${project.id}`}
                        />
                        <span id={`project-name-${project.id}`} className={`text-sm sm:text-base flex-grow truncate pr-2 ${project.isFinalized ? `italic text-gray-500` : `text-gray-800`}`}>
                          {project.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 ml-2 whitespace-nowrap flex-shrink-0">
                        {project.isFinalized ? (
                          <>
                            <span style={{ color: SUCCESS_TEXT_COLOR }} className="text-xs sm:text-sm font-mono" title="Tiempo total al finalizar">
                              {formatDuration(project.finalizedTotalDuration || 0)}
                            </span>
                            <span style={{ color: SUCCESS_TEXT_COLOR, backgroundColor: SUCCESS_BG_COLOR }} className="text-xs px-1.5 py-0.5 rounded-sm">(Finalizado)</span>
                            <button 
                              onClick={() => onReopenProject(project.id)} 
                              title="Reabrir proyecto" 
                              className={`p-1 rounded transition-colors ${REOPEN_BUTTON_COLOR_CLASS} ${REOPEN_BUTTON_HOVER_COLOR_CLASS} hover:bg-amber-100`} // hover:bg-opacity-20 es más complejo sin config
                              aria-label={`Reabrir proyecto ${project.name}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ color: TEXT_SECONDARY_COLOR }} className="text-xs sm:text-sm font-mono" title="Tiempo total actual (dinámico)">
                              {formatDuration(projectTotalTimes[project.id] || 0)}
                            </span>
                            <button 
                              onClick={() => onFinalizeProject(project.id)} 
                              title="Finalizar proyecto y registrar tiempo total" 
                              className={`p-1 rounded transition-colors text-green-600 hover:text-green-700 hover:bg-green-100`}
                              aria-label={`Finalizar proyecto ${project.name}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagementModal;