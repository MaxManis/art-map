import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import { httpClient } from "../../api/httpClient";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import { sourcesToLable } from "../../pages/Table";
import { CheckMarkIcon } from "../icons";

import "./ReportsListWindow.css";

export const ReportsListWindow = () => {
  const [dateFilter, setDateFilter] = useState(null);
  const [dateFilterTo, setDateFilterTo] = useState(null);
  const { state, dispatch } = useContext(GlobalStateContext);
  const { reportsToShow, token, reports } = state;

  const onDelete = async (target) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await httpClient.delete(`/reports/${target._id}`, token, false);
      const newReports = await httpClient.get("/reports", token);
      dispatch({ type: "SET_REPORTS", payload: newReports });
      setDateFilter(null);
    } catch (err) {
      console.error(err);
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const handleItemClick = (item) => {
    dispatch({ type: "SET_REPORTS_TO_SHOW", payload: [item] });
  };
  const handleFilterReset = () => {
    setDateFilter(null);
    setDateFilterTo(null);
    dispatch({ type: "SET_REPORTS_TO_SHOW", payload: reports });
  };

  useEffect(() => {
    let filteredData = reports;
    if (dateFilter) {
      filteredData = filteredData.filter((row) => {
        const rowDate = new Date(row.eventDate);

        if (dateFilterTo) {
          const target = rowDate.getTime();
          const from = dateFilter.getTime();
          const to = dateFilterTo.getTime();

          const withinRange = target >= from && target <= to;
          return withinRange;
        }

        return rowDate.toDateString() === dateFilter.toDateString();
      });
    }

    dispatch({ type: "SET_REPORTS_TO_SHOW", payload: filteredData });
  }, [dateFilter, dateFilterTo]);

  return (
    <div className="floating-list-window">
      <div className="floating-list-window-header">
        <div className="floating-list-window-header-rows">
          <div className="floating-list-window-header-row">
            <span style={{ fontWeight: "bold" }}>Звіти:</span>
          </div>
          <div className="floating-list-window-header-row">
            <span>Усього:</span>
            <span>{reports.length}шт.</span>
          </div>
          <div className="floating-list-window-header-row">
            <span>Видимі:</span>
            <span>{reportsToShow.length}шт.</span>
          </div>
          <button
            className="floating-list-window-header-button"
            onClick={handleFilterReset}
          >
            Зкинути фільтри
          </button>
        </div>
        <div className="date-filter">
          <DatePicker
            selected={dateFilter}
            onChange={(date) => setDateFilter(date)}
            placeholderText="Дата від"
            dateFormat="dd-MM-yyyy"
            className="date-picker"
            icon={<CheckMarkIcon />}
            todayButton={<CheckMarkIcon />}
          />
          <DatePicker
            selected={dateFilterTo}
            onChange={(date) => setDateFilterTo(date)}
            placeholderText="Дата до"
            dateFormat="dd-MM-yyyy"
            className="date-picker"
          />
        </div>
      </div>

      <div className="floating-list-container">
        {reportsToShow.length > 0 ? (
          reportsToShow.map((item, index) => (
            <div
              key={index}
              className="floating-list-item"
              onClick={() => handleItemClick(item)}
            >
              <div className="floating-list-item-field">
                <span className="floating-list-field-label">Тип:</span>
                <span className="floating-list-field-value">
                  {sourcesToLable[item.type]}
                </span>
              </div>
              <div className="floating-list-item-field">
                <span className="floating-list-field-label">Точка виходу:</span>
                <span className="floating-list-field-value">
                  {item.fromMgrs}
                </span>
              </div>
              <div className="floating-list-item-field">
                <span className="floating-list-field-label">
                  Точка приходу:
                </span>
                <span className="floating-list-field-value">
                  {item.toMgrs || "-"}
                </span>
              </div>
              <div className="floating-list-item-field">
                <span className="floating-list-field-label">Дата/Час:</span>
                <span className="floating-list-field-value">
                  {new Date(item.eventDate).toLocaleString()}
                </span>
              </div>
              <button
                className="floating-list-action-button"
                onClick={() => onDelete(item)}
              >
                Видалити
              </button>
            </div>
          ))
        ) : (
          <div style={{ fontWeight: "600", marginBottom: "224px" }}>
            NO DATA
          </div>
        )}
      </div>
    </div>
  );
};
