import React, { useContext, useState } from "react";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import UAFimg from "../../imgs/UAF.png";
import "./Menu.css"; // Reuse the miltech-style CSS

export const Menu = ({ onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state, dispatch } = useContext(GlobalStateContext);
  const { page } = state;

  const handlePageChange = (page) => {
    dispatch({ type: "SET_PAGE", payload: page });
    setIsMenuOpen(false); // Close the menu after selecting a page
  };

  return (
    <div className="menu-container">
      {/* Hamburger Button */}
      <button
        style={{ display: isMenuOpen ? "none" : "flex" }}
        className={`hamburger-button ${isMenuOpen ? "hamburger-button-active" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </button>

      {/* Vertical Menu */}
      <div className={`menu-sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="menu-header">
          <img src={UAFimg} style={{ height: "48px", alignSelf: "center" }} />
          <h1 className="app-title">EmAAA</h1>
        </div>
        <div className="menu-items">
          <div>
            <button
              className={`menu-item ${page === "Map" ? "active" : ""}`}
              onClick={() => handlePageChange("Map")}
            >
              Звітувати
            </button>
            <button
              className={`menu-item ${page === "AdminMap" ? "active" : ""}`}
              onClick={() => handlePageChange("AdminMap")}
            >
              Мапа звітів
            </button>
            <button
              className={`menu-item ${page === "Table" ? "active" : ""}`}
              onClick={() => handlePageChange("Table")}
            >
              Таблиця звітів
            </button>
          </div>

          <div>
            <button
              className={`menu-item active`}
              onClick={() => {
                window.localStorage.removeItem("auth-token");
                window.location.reload();
              }}
            >
              Вийти
            </button>
          </div>
        </div>
      </div>

      {/* Overlay to close the menu when clicking outside */}
      {isMenuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};
