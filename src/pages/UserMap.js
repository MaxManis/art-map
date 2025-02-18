import React, { useContext, useEffect, useState } from "react";
import { httpClient } from "../api/httpClient";
import { ReportForm } from "../components/ReportForm";
import { UserMap } from "../components/UserMap";
import { GlobalStateContext } from "../context/GlobalStateContext";

export const UserMapPage = () => {
  const [points, setPoints] = useState([]);
  const { state, dispatch } = useContext(GlobalStateContext);
  const { token, reports } = state;

  const fetchReports = async () => {
    if (reports.length) {
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const [newReports, newLbz] = await Promise.all([
        httpClient.get("/reports", token),
        httpClient.get("/lbz", token),
      ]);
      dispatch({ type: "SET_REPORTS", payload: newReports });
      dispatch({ type: "SET_LBZ", payload: newLbz });
    } catch (err) {
      console.error(err);
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="user-map-container">
      <ReportForm setPoints={setPoints} />
      <UserMap userPoints={points} />
    </div>
  );
};
