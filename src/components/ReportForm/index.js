import React, { useContext, useState } from "react";
import { toPoint } from "mgrs";
import L from "leaflet";
import { SelectField } from "../SelectField";
import { SOURCE_TYPES_SELECT } from "../../constants";
import { timeStringToDate } from "../../utils/timeStrToDate";
import { extractTimeAndText } from "../../utils/extractTimeAndText";
import { httpClient } from "../../api/httpClient";
import { GlobalStateContext } from "../../context/GlobalStateContext";

import "./ReportForm.css";
import { SendIcon } from "../icons/Send";

export const ReportForm = ({ setPoints }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { token, loading } = state;
  const [inputText, setInputText] = useState("");

  const [parsedFields, setParsedFields] = useState(["", "", ""]);

  const [locFrom, setLocFrom] = useState("");
  const [locTo, setLocTo] = useState("");
  const [pointsLocFrom, setPointsLocFrom] = useState("");
  const [pointsLocTo, setPointsLocTo] = useState("");

  const saveReport = async (from, to, pointsAmount) => {
    const distance = pointsAmount === 2 ? L.latLng(from).distanceTo(to) : 0;
    const reportToSave = {
      fromLat: from[0],
      fromLng: from[1],
      toLat: to ? to[0] : null,
      toLng: to ? to[1] : null,
      fromMgrs: locFrom,
      toMgrs: to ? locTo : null,
      type: parsedFields[0],
      color: sourcesColors[parsedFields[0]] || "orange",
      distance,
      pointsCount: pointsAmount,
      comment: "",
      rawReport: inputText,
      eventDate: parsedFields[1] ? new Date(parsedFields[1]) : null,
      actor: parsedFields[2] || null,
    };

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await httpClient.post("/reports", token, reportToSave, false);
      const newReports = await httpClient.get("/reports", token);
      dispatch({ type: "SET_REPORTS", payload: newReports });
    } catch (err) {
      console.error(err);
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const handleParse = (e) => {
    try {
      if (!e.target.value || e.target.value.length < 5) {
        setInputText("");
        return;
      }
      setInputText(e.target.value);
      const lines = e.target.value.split("\n").slice(0, 3);
      if (lines.length < 2) {
        setInputText("");
        return;
      }

      setLocFrom(() => lines[1]);
      setLocTo(() => lines[2] || "");

      const sourceKey = e.target.value[0] || "unk";
      const source = sourcesMap[sourceKey.toLowerCase()] || sourcesMap.unk;

      const parsedTime = extractTimeAndText(lines[0]);
      let time = "";
      let name = "";
      if (parsedTime) {
        const pTime = parsedTime.time;
        const timeDate = timeStringToDate(pTime);

        time = timeDate.toString();
        name = parsedTime.textAfterTime || "";
      }

      const fields = [source, time, name];
      setParsedFields(fields);

      const mgrsToFromPoints = toPoint(lines[1]);
      let mgrsToToPoints = null;

      setPointsLocFrom(() => mgrsToFromPoints);
      if (lines[2] && lines[2].length) {
        mgrsToToPoints = toPoint(lines[2]);
        setPointsLocTo(() => mgrsToToPoints || "");
      } else {
        setPointsLocTo("");
      }

      let userPoints = [
        [mgrsToFromPoints[1], mgrsToFromPoints[0]],
        [mgrsToToPoints[1], mgrsToToPoints[0]],
      ];
      if (!mgrsToToPoints) {
        userPoints = [mgrsToFromPoints[1], mgrsToFromPoints[0]];
      }
      setPoints(userPoints);
    } catch (err) {
      console.error(err);
      alert(
        "Помилка зчитування данних! Спробуйте вставити повне повідомлення ще раз.",
      );
    }
  };

  const handleFieldChange = (index, value) => {
    const updatedFields = [...parsedFields];
    updatedFields[index] = value;
    setParsedFields(updatedFields);
  };

  const handleReport = async () => {
    if (!pointsLocFrom[0]) {
      return;
    }

    let pointsAmount = 2;
    let userPoints = [
      [pointsLocFrom[1], pointsLocFrom[0]],
      [pointsLocTo[1], pointsLocTo[0]],
    ];
    let lastReportPoint = userPoints[0];
    if (!pointsLocTo || !pointsLocTo[0]) {
      userPoints = [pointsLocFrom[1], pointsLocFrom[0]];
      pointsAmount = 1;
      lastReportPoint = userPoints;
    }

    window.localStorage.setItem(
      "last-report-point",
      JSON.stringify(lastReportPoint),
    );

    dispatch({ type: "SET_LOADING", payload: true });
    setPoints(userPoints);
    try {
      await saveReport(
        pointsAmount === 2 ? userPoints[0] : userPoints,
        pointsAmount === 2 ? userPoints[1] : null,
        pointsAmount,
      );
    } catch (err) {
      console.error(err);
      alert("Помилка звʼязку з сервером! Перевірте зʼєднання.");
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  return (
    <div className="parse-form-container">
      {/* Raw Report input */}
      <textarea
        rows={3}
        placeholder="Введіть вхідні дані (2-3 стрічки)..."
        value={inputText}
        onChange={(e) => handleParse(e)}
        className="parse-textarea"
      />

      <hr color="#ff6b6b" />

      {/* Parsed Fields */}
      <div className="parsed-fields">
        <div className="parsed-fields-group">
          <div style={{ flex: 1 }}>
            <SelectField
              label=""
              value={parsedFields[0]}
              options={SOURCE_TYPES_SELECT}
              onChange={(e) => handleFieldChange(0, e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder={`Дата/Час`}
            value={
              parsedFields[1] ? new Date(parsedFields[1]).toLocaleString() : ""
            }
            onChange={(e) => handleFieldChange(1, e.target.value)}
            className="parsed-field"
            disabled={!parsedFields[1]}
          />
          <input
            style={{ marginBottom: "0.5rem" }}
            type="text"
            placeholder={`Позивний`}
            value={parsedFields[2]}
            onChange={(e) => handleFieldChange(2, e.target.value)}
            className="parsed-field"
            disabled={!parsedFields[2]}
          />
        </div>
        <input
          type="text"
          placeholder={`Вихід`}
          value={locFrom}
          onChange={(e) => setLocFrom(e.target.value)}
          className="parsed-field"
          disabled={!locFrom}
        />
        <input
          type="text"
          placeholder={`Прихід`}
          value={locTo}
          onChange={(e) => setLocTo(e.target.value)}
          className="parsed-field"
          disabled={!locTo}
        />
      </div>
      <button
        disabled={loading}
        onClick={handleReport}
        className="parse-button"
      >
        <div className="button-content-with-icon">
          <SendIcon />
          {loading ? "Чекайте..." : "Надіслати"}
        </div>
      </button>
    </div>
  );
};

// constants and mapping
const sourcesMap = {
  a: "A",
  а: "A",
  m: "M",
  м: "M",
  r: "R",
  р: "R",
  p: "R",
  s: "S",
  з: "S",
  unk: "UNK",
};

const sourcesColors = {
  A: "red",
  M: "yellow",
  R: "blue",
  S: "white",
  UNK: "grey",
};
