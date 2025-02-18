import React from "react";
import { Map } from "../components/Map";
import { ReportsListWindow } from "../components/ReportListWindow";

export const MapPage = () => {
  return (
    <div>
      <ReportsListWindow />
      <Map />
    </div>
  );
};
