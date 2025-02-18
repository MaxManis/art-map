import { useContext, useEffect, useState } from "react";
import { httpClient } from "./api/httpClient";
import { Menu } from "./components/Menu";
import { SignWindow } from "./components/SignWindow";
import { GlobalStateContext } from "./context/GlobalStateContext";
import { MapPage } from "./pages/Map";
import { TablePage } from "./pages/Table";
import { UserMapPage } from "./pages/UserMap";
import { LoaderScreen } from "./components/Loader";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Map");
  const { state, dispatch } = useContext(GlobalStateContext);
  const { user, token, loading } = state;

  const getMe = async () => {
    if (user || !token) {
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const userMe = await httpClient.get("/me", token);
      dispatch({ type: "SET_USER", payload: userMe });
    } catch (err) {
      dispatch({ type: "SET_USER", payload: null });
      dispatch({ type: "SET_TOKEN", payload: null });
      console.error(err);
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    if (token) {
      window.localStorage.setItem("auth-token", token);
    }
    if (!user) {
      getMe();
    }
  }, [token]);

  const renderPage = () => {
    switch (activePage) {
      case "Map":
        return <UserMapPage />;
      case "AdminMap":
        return <MapPage />;
      case "Table":
        return <TablePage />;
      default:
        return <UserMapPage />;
    }
  };

  return (
    <div style={{ position: "relative", background: "black" }}>
      {loading && <LoaderScreen />}
      {user ? (
        <div className="app-container">
          {user.role === "admin" && <Menu onPageChange={setActivePage} />}
          {renderPage()}
        </div>
      ) : (
        <SignWindow />
      )}
    </div>
  );
}

export default App;
