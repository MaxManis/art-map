import React from "react";
import "./SelectField.css"; // Reuse the miltech-style CSS

export const SelectField = ({ label, options, value, onChange }) => {
  return (
    <div className="select-field">
      <label className="select-label">
        {label && <span style={{ textAlign: "left" }}>{label}</span>}
        <select value={value} onChange={onChange} className="select-input">
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
