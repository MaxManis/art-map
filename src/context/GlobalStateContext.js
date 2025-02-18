import React, { useReducer, createContext } from "react";

// Initial state
const initialState = {
  user: null,
  token: window.localStorage.getItem("auth-token"),
  reports: [],
  reportsToShow: [],
  lbz: [],
  loading: false,
  editReport: null,
};

// Create context
export const GlobalStateContext = createContext(initialState);

// Reducer function
const globalStateReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "SET_REPORTS":
      return {
        ...state,
        reports: action.payload,
        reportsToShow: action.payload,
      };
    case "SET_REPORTS_TO_SHOW":
      return { ...state, reportsToShow: action.payload };
    case "SET_LBZ":
      return { ...state, lbz: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_EDIT":
      return { ...state, editReport: action.payload };
    default:
      return state;
  }
};

// Provider component
export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalStateReducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
