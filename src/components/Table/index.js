import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import { OpenIcon } from "../icons";
import "./Table.css"; // Reuse the miltech-style CSS

export const Table = ({ data, columns: initialColumns }) => {
  const [columns, setColumns] = useState(initialColumns);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(null);

  const { state, dispatch } = useContext(GlobalStateContext);

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

  // Handle date filter
  const handleDateFilter = (date) => {
    setDateFilter(date);
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

  return (
    <div className="table-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />

        {/* Date Filter */}
        <div className="date-filter">
          <DatePicker
            selected={dateFilter}
            onChange={handleDateFilter}
            placeholderText="Filter by date"
            dateFormat="yyyy-MM-dd"
            className="date-picker"
          />
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
                  placeholder={`Filter ${column.label}`}
                  value={filters[column.key] || ""}
                  onChange={(e) => handleFilter(column.key, e.target.value)}
                  className="filter-input"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getFilteredData().map((row, rowIndex) => (
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
