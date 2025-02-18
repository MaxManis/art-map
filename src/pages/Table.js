import React, { useContext } from "react";
import { Modal } from "../components/Modal";
import { Table } from "../components/Table";
import { GlobalStateContext } from "../context/GlobalStateContext";

export const TablePage = () => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { reports } = state;

  const columns = [
    { key: "type", label: "Вид озброєння" },
    //{ key: "id", label: "ID" },
    //{ key: "fromLat", label: "From Lat" },
    //{ key: "fromLng", label: "From Lng" },
    //{ key: "toLat", label: "To Lat" },
    //{ key: "toLng", label: "To Lng" },
    { key: "fromMgrs", label: "Вихід MGRS" },
    { key: "toMgrs", label: "Прихід MGRS" },
    //{ key: "color", label: "Color" },
    { key: "distance", label: "Дистанція (мерти)" },
    //{ key: "eventDate", label: "Час події" },
    //{ key: "pointsCount", label: "Points count" },
    { key: "comment", label: "Коментар" },
    //{ key: "createdAt", label: "Час створення запису" },
    { key: "dateString", label: "Дата/Час" },
    { key: "rawReport", label: "Звіт" },
    { key: "actor", label: "Позивний" },
    { key: "action", label: "Дія" },
  ];

  const tableReports = reports.map((r) => ({
    ...r,
    id: r.title,
    type: sourcesToLable[r.type],
    date: new Date(r.eventDate),
    dateString: new Date(r.eventDate).toLocaleString(),
  }));

  return (
    <div style={{ background: "black" }}>
      <Modal />
      <Table data={tableReports} columns={columns} />
    </div>
  );
};

export const sourcesToLable = {
  A: "Артилерія",
  M: "Міномет",
  R: "РСЗВ",
  S: "Звук",
  UNK: "Невідомо",
};
