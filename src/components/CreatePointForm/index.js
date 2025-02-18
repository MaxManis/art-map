import React, { useState } from "react";
import { config } from "../../config";
import { ToggleSwitch } from "../ToggleSwitch";
//import "./PointForm.css"; // We'll create this CSS file

export const CreatePointForm = ({ onSubmit, token, onSwitchMode }) => {
  const [formData, setFormData] = useState({
    startLat: "",
    startLng: "",
    endLat: "",
    endLng: "",
    comment: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${config.apiBaseUrl}/points`, {
      method: "POST",
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    onSubmit(formData);
  };

  return (
    <div className="point-form-container">
      <div className="point-form-box">
        <h2>Create Line</h2>
        <form onSubmit={handleSubmit}>
          <div className="point-form-group">
            <ToggleSwitch label="Switch to POLY" onToggle={onSwitchMode} />
          </div>
          <div className="point-form-group">
            <label htmlFor="startLat">Start Latitude</label>
            <input
              type="number"
              id="startLat"
              placeholder="Start Latitude"
              value={formData.startLat}
              onChange={(e) =>
                setFormData({ ...formData, startLat: e.target.value })
              }
            />
          </div>
          <div className="point-form-group">
            <label htmlFor="startLng">Start Longitude</label>
            <input
              type="number"
              id="startLng"
              placeholder="Start Longitude"
              value={formData.startLng}
              onChange={(e) =>
                setFormData({ ...formData, startLng: e.target.value })
              }
            />
          </div>
          <div className="point-form-group">
            <label htmlFor="endLat">End Latitude</label>
            <input
              type="number"
              id="endLat"
              placeholder="End Latitude"
              value={formData.endLat}
              onChange={(e) =>
                setFormData({ ...formData, endLat: e.target.value })
              }
            />
          </div>
          <div className="point-form-group">
            <label htmlFor="endLng">End Longitude</label>
            <input
              type="number"
              id="endLng"
              placeholder="End Longitude"
              value={formData.endLng}
              onChange={(e) =>
                setFormData({ ...formData, endLng: e.target.value })
              }
            />
          </div>
          <div className="point-form-group">
            <label htmlFor="comment">Comment</label>
            <input
              type="text"
              id="comment"
              placeholder="Comment"
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
            />
          </div>
          <button type="submit" className="point-submit-button">
            Add Point
          </button>
        </form>
      </div>
    </div>
  );
};
