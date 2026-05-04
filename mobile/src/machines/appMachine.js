export const appMachineInitialState = {
  status: "booting",
  activeView: "boot",
  theme: "light",
  notificationsEnabled: false,
  error: null,
};

export function appMachineReducer(state, event) {
  switch (event.type) {
    case "CHECK_AUTH":
      return { ...state, status: "checking", error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        status: "ready",
        activeView: "dashboard",
        error: null,
      };
    case "AUTH_FAILED":
      return {
        ...state,
        status: "ready",
        activeView: "login",
        error: event.error || null,
      };
    case "SET_THEME":
      return { ...state, theme: event.theme };
    case "SET_NOTIFICATIONS":
      return { ...state, notificationsEnabled: event.enabled };
    case "NAVIGATE":
      return { ...state, activeView: event.view };
    case "ERROR":
      return { ...state, status: "error", error: event.error };
    default:
      return state;
  }
}
