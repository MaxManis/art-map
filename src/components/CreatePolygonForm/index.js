import React, { useState } from "react";
import { config } from "../../config";
import { SOURCE_TYPES_SELECT } from "../../constants";
import { SelectField } from "../SelectField";

export const CreatePolygonForm = ({ onSubmit, token }) => {
  const [formData, setFormData] = useState({
    comment: "",
    color: "red",
  });
  const [points, setPoints] = useState([
    {
      Lat: "",
      Lng: "",
    },
  ]);

  const getInstanceName = () => {
    if (points.length === 1) {
      return "Point";
    } else if (points.length === 2) {
      return "Line";
    }
    return "Polygon";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const polyData = {
      ...formData,
      points,
      count: points.length,
    };
    await fetch(`${config.apiBaseUrl}/points`, {
      method: "POST",
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(polyData),
    });
    onSubmit(formData);
  };

  const onAddPoint = () => {
    const newPoint = {
      Lat: "",
      Lng: "",
    };

    setPoints([...points, newPoint]);
  };

  return (
    <div className="point-form-container poly-container-size">
      <div className="point-form-box">
        <h2>Create {getInstanceName()}</h2>
        <form onSubmit={handleSubmit}>
          {points.map((point, i) => (
            <div key={i}>
              <span className="text">{"Point " + (i + 1)}</span>
              <div className="point-form-group">
                <label htmlFor="startLat">Latitude</label>
                <input
                  type="number"
                  id="startLat"
                  placeholder="Point Latitude"
                  value={points[i].Lat}
                  onChange={(e) => {
                    const pointData = {
                      Lng: point.Lng,
                      Lat: e.target.value,
                    };
                    setPoints([
                      ...points.slice(0, i),
                      pointData,
                      ...points.slice(i + 1),
                    ]);
                  }}
                />
              </div>
              <div className="point-form-group">
                <label htmlFor="startLng">Longitude</label>
                <input
                  type="number"
                  id="startLng"
                  placeholder="Start Longitude"
                  value={points[i].Lng}
                  onChange={(e) => {
                    const pointData = {
                      Lat: point.Lat,
                      Lng: e.target.value,
                    };
                    setPoints([
                      ...points.slice(0, i),
                      pointData,
                      ...points.slice(i + 1),
                    ]);
                  }}
                />
              </div>
            </div>
          ))}
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
          <SelectField
            label="Color"
            options={SOURCE_TYPES_SELECT}
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
          />
          <button
            type="button"
            onClick={onAddPoint}
            className="point-submit-button-sec"
          >
            Add point +
          </button>
          <button type="submit" className="point-submit-button">
            Create {getInstanceName()}
          </button>
        </form>
      </div>
    </div>
  );
};
