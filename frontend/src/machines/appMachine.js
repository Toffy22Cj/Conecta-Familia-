export const appMachineInitialState = {
  view: "loading",
  theme: "light",
  error: null,
};

export function appMachineReducer(state, event) {
  switch (event.type) {
    case "NAVIGATE":
      return { ...state, view: event.view, error: null };
    case "AUTH_SUCCESS":
      return { ...state, view: "dashboard", error: null };
    case "AUTH_FAIL":
      return { ...state, view: "home", error: event.error || null };
    case "SET_THEME":
      return { ...state, theme: event.theme };
    case "ERROR":
      return { ...state, error: event.error };
    default:
      return state;
  }
}
