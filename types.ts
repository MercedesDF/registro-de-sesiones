export interface Project {
  id: string;
  name: string;
  isFinalized?: boolean;
  finalizedTotalDuration?: number; // Duración en milisegundos
}

export interface Session {
  id: string;
  startTime: number; // Almacenado como timestamp para cálculos más fáciles
  endTime: number | null;
  projectId?: string | null; // Enlace a un proyecto
  // Duración en milisegundos, calculada cuando la sesión termina

  // Campos para la funcionalidad de pausa
  isPaused?: boolean;
  pausedStartTime?: number | null; // Timestamp de cuándo comenzó la pausa actual
  totalPausedDuration?: number; // Milisegundos acumulados que la sesión ha estado en pausa
}