import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import { saveToCsvFile } from "../../utils/savaToCsvFile";
import { OpenIcon, ResetIcon, DownloadIcon } from "../icons";
import "./Table.css"; // Reuse the miltech-style CSS

export const Table = ({ data, columns: initialColumns }) => {
  const [columns, setColumns] = useState(initialColumns);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [dateFilterTo, setDateFilterTo] = useState(null);

  const { dispatch } = useContext(GlobalStateContext);

  const handleFilterReset = () => {
    setDateFilter(null);
    setDateFilterTo(null);
    setFilters({});
    setSortConfig({ key: null, direction: "asc" });
    setSearchTerm("");
  };

  const rowAction = (row) => {
    dispatch({ type: "SET_EDIT", payload: row });
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle filtering
  const handleFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle date from filter
  const handleDateFilter = (date) => {
    setDateFilter(date);
  };

  // Handle date to filter
  const handleDateToFilter = (date) => {
    setDateFilterTo(date);
  };

  // Apply sorting, filtering, and search
  const getFilteredData = () => {
    let filteredData = data;

    if (searchTerm) {
      filteredData = filteredData.filter((row) => {
        return columns.some((column) =>
          String(row[column.key])
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        );
      });
    }

    // Apply column filters
    filteredData = filteredData.filter((row) =>
      columns.every((column) => {
        const filterValue = filters[column.key];
        if (!filterValue) return true;
        return String(row[column.key])
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }),
    );

    // Apply date filter
    if (dateFilter) {
      filteredData = filteredData.filter((row) => {
        const rowDate = new Date(row.date); // Assuming 'date' is the key for the date column

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

    // Apply sorting
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  const dataToShow = getFilteredData();

  const handleSaveToCsv = () => {
    saveToCsvFile(dataToShow);
  };

  return (
    <div className="table-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Пошук..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />

        {/* Date Filter */}
        <div className="search-date">
          <div className="floating-list-window-header-rows">
            <div className="floating-list-window-header-row">
              <span>Усього:</span>
              <span>{data.length}шт.</span>
            </div>
            <div className="floating-list-window-header-row">
              <span>Видимі:</span>
              <span>{dataToShow.length}шт.</span>
            </div>
          </div>

          <DatePicker
            selected={dateFilter}
            onChange={handleDateFilter}
            placeholderText="Дата від"
            dateFormat="dd-MM-yyyy"
            className="date-picker"
          />
          <DatePicker
            selected={dateFilterTo}
            onChange={handleDateToFilter}
            placeholderText="Дата до"
            dateFormat="dd-MM-yyyy"
            className="date-picker"
          />

          <button
            style={{ width: "fit-content" }}
            className="map-admin-panel-button"
            onClick={handleFilterReset}
          >
            <div className="button-content-with-icon">
              <ResetIcon />
              Зкинути фільтри
            </div>
          </button>
          <button
            style={{ width: "fit-content" }}
            className="map-admin-panel-button"
            onClick={handleSaveToCsv}
          >
            <div className="button-content-with-icon">
              <DownloadIcon />
              Зберегти у .CSV
            </div>
          </button>
        </div>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                <div className="header-content">
                  <span>{column.label}</span>
                  <button
                    onClick={() => handleSort(column.key)}
                    className="sort-button"
                  >
                    {sortConfig.key === column.key &&
                      sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={`Пошук за ${column.label}`}
                  value={filters[column.key] || ""}
                  onChange={(e) => handleFilter(column.key, e.target.value)}
                  className="filter-input"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataToShow.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) =>
                column.key === "action" ? (
                  <td key={column.key}>
                    <button
                      className="map-admin-panel-button"
                      onClick={() => rowAction(row)}
                    >
                      <div className="button-content-with-icon">
                        <OpenIcon />
                        Відкрити
                      </div>
                    </button>
                  </td>
                ) : (
                  <td key={column.key}>{row[column.key] || "-"}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
