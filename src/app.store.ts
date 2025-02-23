import { proxy } from 'valtio';

export const sidebarState = proxy({
  isSidebarOpen: true,
});

export const editorModeState = proxy({
  isFocusMode: false,
});

export const commandDialogState = proxy({
  isCommandDialogOpen: false,
});

export const setSidebarState = (isSidebarOpen: boolean) => {
  sidebarState.isSidebarOpen = isSidebarOpen;
};

export const toggleSidebarState = () => {
  sidebarState.isSidebarOpen = !sidebarState.isSidebarOpen;
};

export const toggleFocusModeState = () => {
  editorModeState.isFocusMode = !editorModeState.isFocusMode;
};

export const toggleCommandDialogState = () => {
  commandDialogState.isCommandDialogOpen = !commandDialogState.isCommandDialogOpen;
};
