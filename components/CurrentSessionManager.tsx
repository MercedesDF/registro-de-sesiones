import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '../types';
import { formatDuration } from '../utils/time';

interface CurrentSessionManagerProps {
  activeSession: Session | null;
  onStartSession: () => void;
  onStopSession: () => void;
  onPauseSession: () => void;
  onResumeSession: () => void;
}

// Colores del Tema Azul
const ACCENT_COLOR = '#3B82F6'; // blue-500 (Usado por Tailwind: bg-blue-500, text-blue-500)
const ACCENT_HOVER_COLOR_CLASS = 'hover:bg-blue-400'; // Tailwind class for blue-400
const TEXT_PRIMARY_COLOR = '#1F2937'; // gray-800
const TEXT_SECONDARY_COLOR = '#4B5563'; // gray-600
const SURFACE_CARD_COLOR = '#FFFFFF'; // white
const BORDER_CARD_COLOR = '#E5E7EB'; // gray-200
const DANGER_COLOR = '#EF4444'; // red-500 (Usado por Tailwind: bg-red-500)
const DANGER_HOVER_COLOR_CLASS = 'hover:bg-red-400'; // Tailwind class for red-400
const TEXT_ON_ACCENT_COLOR = 'white'; // Para texto en botones con color de acento
const TEXT_ON_DANGER_COLOR = 'white'; // Para texto en botones con color de peligro
const PAUSE_BUTTON_COLOR = '#F59E0B'; // amber-500 (Usado por Tailwind: bg-amber-500)
const PAUSE_BUTTON_HOVER_COLOR_CLASS = 'hover:bg-amber-400'; // Tailwind class for amber-400
const TEXT_ON_PAUSE_COLOR = 'white'; // Para texto en botones de pausa/reanudar


const CurrentSessionManager: React.FC<CurrentSessionManagerProps> = ({ 
  activeSession, 
  onStartSession, 
  onStopSession,
  onPauseSession,
  onResumeSession
}) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // useCallback se usa para memoizar la función, evitando que se recree en cada render
  // a menos que sus dependencias (activeSession) cambien. Esto es útil si calculateElapsedTime
  // se pasa como prop a componentes hijos optimizados.
  const calculateElapsedTime = useCallback(() => {
    if (activeSession && activeSession.startTime) {
      const now = Date.now();
      let runningTime = now - activeSession.startTime;
      
      let currentPauseDuration = 0;
      if (activeSession.isPaused && activeSession.pausedStartTime) {
        currentPauseDuration = now - activeSession.pausedStartTime;
      }
      
      const totalEffectivePausedTime = (activeSession.totalPausedDuration || 0) + currentPauseDuration;
      return Math.max(0, runningTime - totalEffectivePausedTime);
    }
    return 0;
  }, [activeSession]);

  useEffect(() => {
    let timerId: number | undefined;
    if (activeSession) {
      setElapsedTime(calculateElapsedTime()); 
      // Iniciar intervalo para actualizar el tiempo transcurrido cada segundo
      timerId = window.setInterval(() => {
        setElapsedTime(calculateElapsedTime());
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    // Función de limpieza: se ejecuta cuando el componente se desmonta o antes de que el efecto se vuelva a ejecutar.
    // Es crucial para limpiar recursos como intervalos o suscripciones y evitar fugas de memoria.
    return () => {
      if (timerId) {
        window.clearInterval(timerId);
      }
    };
  }, [activeSession, calculateElapsedTime]); // El efecto se re-ejecuta si activeSession o calculateElapsedTime cambian.

  if (activeSession) {
    return (
      <div style={{ backgroundColor: SURFACE_CARD_COLOR, borderColor: BORDER_CARD_COLOR }} className="p-4 sm:p-6 rounded-lg shadow-xl flex flex-col items-center justify-center text-center min-h-[280px] sm:min-h-[320px] relative border">
        <div 
          style={{ backgroundColor: activeSession.isPaused ? PAUSE_BUTTON_COLOR : ACCENT_COLOR }}
          className={`absolute top-3 right-3 w-3 h-3 sm:w-4 sm:h-4 rounded-full ${activeSession.isPaused ? '' : 'animate-pulse'}`}
          aria-label={`Indicador de sesión ${activeSession.isPaused ? 'pausada' : 'activa'}`}
          role="status" // Indica que este elemento representa el estado de algo.
          title={`Sesión ${activeSession.isPaused ? 'pausada' : 'activa'}`}
        ></div>
        
        <div 
          style={{ color: ACCENT_COLOR }}
          className="text-5xl sm:text-6xl font-mono font-bold my-6 sm:my-8"
          aria-live="polite" // Indica que las actualizaciones deben ser anunciadas por lectores de pantalla, pero de forma no intrusiva.
          aria-atomic="true" // Indica que toda la región debe ser presentada como un todo cuando cambie.
        >
          {formatDuration(elapsedTime)}
          {activeSession.isPaused && <span style={{color: TEXT_SECONDARY_COLOR}} className="block text-sm font-normal mt-1">(Pausado)</span>}
        </div>
        
        <div className="w-full max-w-xs sm:max-w-sm space-y-3">
          {/* Se utilizan clases de Tailwind para los estados hover (ej. hover:bg-red-400) 
              en lugar de onMouseOver/onMouseOut para manejar los estilos. 
              Esto es generalmente una mejor práctica porque:
              1. Mantiene la lógica de presentación en CSS (o clases de utilidad) en lugar de JavaScript.
              2. Es más declarativo y fácil de entender.
              3. Puede ser más performante en algunos casos.
          */}
          <button
            onClick={onStopSession}
            // Los estilos base se aplican con 'style' o clases directas de Tailwind.
            // Los estilos hover se aplican con clases 'hover:' de Tailwind.
            style={{ backgroundColor: DANGER_COLOR, color: TEXT_ON_DANGER_COLOR }}
            className={`w-full font-bold py-2.5 sm:py-3 px-4 rounded-lg text-base sm:text-lg transition duration-150 ease-in-out flex items-center justify-center shadow-md hover:shadow-lg ${DANGER_HOVER_COLOR_CLASS}`}
            aria-label="Detener la sesión actual"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
            </svg>
            Detener
          </button>

          {activeSession.isPaused ? (
            <button
              onClick={onResumeSession}
              style={{ backgroundColor: PAUSE_BUTTON_COLOR, color: TEXT_ON_PAUSE_COLOR }}
              className={`w-full font-bold py-2.5 sm:py-3 px-4 rounded-lg text-base sm:text-lg transition duration-150 ease-in-out flex items-center justify-center shadow-md hover:shadow-lg ${PAUSE_BUTTON_HOVER_COLOR_CLASS}`}
              aria-label="Reanudar la sesión"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
              </svg>
              Reanudar
            </button>
          ) : (
            <button
              onClick={onPauseSession}
              style={{ backgroundColor: PAUSE_BUTTON_COLOR, color: TEXT_ON_PAUSE_COLOR }}
              className={`w-full font-bold py-2.5 sm:py-3 px-4 rounded-lg text-base sm:text-lg transition duration-150 ease-in-out flex items-center justify-center shadow-md hover:shadow-lg ${PAUSE_BUTTON_HOVER_COLOR_CLASS}`}
              aria-label="Pausar la sesión"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
              Pausar
            </button>
          )}
        </div>
        <p style={{ color: TEXT_SECONDARY_COLOR }} className="mt-4 text-xs sm:text-sm">
          {activeSession.isPaused ? "Sesión en pausa." : "Sesión activa. Registrando tiempo..."}
        </p>
      </div>
    );
  } else {
    // VISTA SIN SESIÓN ACTIVA
    return (
      <div style={{ backgroundColor: SURFACE_CARD_COLOR, borderColor: BORDER_CARD_COLOR }} className="p-4 sm:p-6 rounded-lg shadow-xl border">
        <h2 style={{ color: ACCENT_COLOR }} className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Control de Sesión</h2>
        <div>
          <p style={{ color: TEXT_SECONDARY_COLOR }} className="text-base sm:text-lg mb-4 sm:mb-6">No hay ninguna sesión activa.</p>
          <button
            onClick={onStartSession}
            style={{ backgroundColor: ACCENT_COLOR, color: TEXT_ON_ACCENT_COLOR }}
            className={`w-full font-bold py-3 px-4 rounded-lg text-base sm:text-lg transition duration-150 ease-in-out flex items-center justify-center shadow-md hover:shadow-lg ${ACCENT_HOVER_COLOR_CLASS}`}
            aria-label="Iniciar nueva sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L8.029 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" />
            </svg>
            Iniciar Nueva Sesión
          </button>
        </div>
        <p style={{ color: TEXT_SECONDARY_COLOR }} className="mt-3 text-xs sm:text-sm opacity-75 text-center">
          Haz clic para comenzar a trabajar.
        </p>
      </div>
    );
  }
};

export default CurrentSessionManager;
