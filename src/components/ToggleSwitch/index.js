import React, { useState } from "react";

export const ToggleSwitch = ({ label, isOn, onToggle }) => {
  return (
    <div className="toggle-switch">
      <label className="toggle-label">
        {label}
        <input
          type="checkbox"
          checked={isOn}
          onChange={onToggle}
          className="toggle-input"
        />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );
};
