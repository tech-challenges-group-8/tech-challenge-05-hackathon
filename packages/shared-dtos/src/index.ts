// Ensure decorator metadata is available for class-validator
import 'reflect-metadata';

// Export all DTOs
export * from './user/CreateUserDTO';
export * from './user/UserResponseDTO';

// Auth DTOs
export * from './auth/LoginDTO';
export * from './auth/AuthResponseDTO';
export * from './auth/JwtPayloadDTO';

// Export CognitiveSettings DTOs
export * from './cognitive-settings/CreateCognitiveSettingsDTO';
export * from './cognitive-settings/UpdateCognitiveSettingsDTO';
export * from './cognitive-settings/ResponseCognitiveSettingsDTO';

// Export FocusSettings DTOs
export * from './focus-settings/CreateFocusSettingsDTO';
export * from './focus-settings/UpdateFocusSettingsDTO';
export * from './focus-settings/ResponseFocusSettingsDTO';
export * from './focus-settings/FocusTaskDTO';
export * from './focus-settings/AudioThemeDTO';
export * from './focus-settings/FocusSessionDTO';

// Export TaskKanban DTOs
export * from './task-kanban/CreateTaskKanbanDTO';
export * from './task-kanban/UpdateTaskKanbanDTO';
export * from './task-kanban/ResponseTaskKanbanDTO';

// Export TaskCheckList DTOs
export * from './task-checklist/CreateTaskCheckListDTO';
export * from './task-checklist/ResponseTaskCheckListDTO';

