import { useContext, useEffect, useState } from "react";
import { httpClient } from "../../api/httpClient";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import { sleep } from "../../utils/sleep";
import { CheckMarkIcon, CloseIcon, MapIcon, TrashBoxIcon } from "../icons";
import "./Modal.css";

export const Modal = () => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { editReport, token } = state;
  const [report, setReport] = useState(editReport ? { ...editReport } : {});

  const handleSave = () => {
    return;
    //TODO: enable when editing is ready on BE and FE
    //dispatch({ type: "SET_LOADING", payload: true });
    //try {
    //  await httpClient.put(`/reports/${report?._id}`, token, report, false);
    //  const newReports = await httpClient.get("/reports", token);
    //  dispatch({ type: "SET_REPORTS", payload: newReports });
    //} catch (err) {
    //  console.error(err);
    //}
    //dispatch({ type: "SET_LOADING", payload: false });
  };
  const handleShowOnMap = async () => {
    dispatch({ type: "SET_PAGE", payload: "AdminMap" });
    await sleep(150);
    dispatch({ type: "SET_REPORTS_TO_SHOW", payload: [report] });
    handleClose();
  };
  const handleClose = () => {
    dispatch({ type: "SET_EDIT", payload: null });
  };
  const handleDelete = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await httpClient.delete(`/reports/${report?._id}`, token, false);
      const newReports = await httpClient.get("/reports", token);
      dispatch({ type: "SET_REPORTS", payload: newReports });
    } catch (err) {
      console.error(err);
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  useEffect(() => {
    setReport(editReport);
  }, [editReport]);

  if (!editReport) {
    return null;
  }

  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="modal-content">
          <div className="">
            Звіт {editReport.title.split("-")[0]}
            <div className="parsed-fields">
              <div className="parsed-fields-group">
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder={`Тип`}
                    value={report?.type}
                    onChange={(e) =>
                      setReport({ ...report, type: e.target.value })
                    }
                    className="parsed-field"
                    disabled
                  />
                </div>
                <input
                  type="text"
                  placeholder={`Дата/Час`}
                  value={new Date(report?.eventDate).toLocaleString()}
                  onChange={(e) => {
                    console.log(new Date(e.target.value).getTime());
                    setReport({ ...report, eventDate: e.target.value });
                  }}
                  className="parsed-field"
                  disabled
                />
                <input
                  style={{ marginBottom: "0.5rem" }}
                  type="text"
                  placeholder={`Позивний`}
                  value={report?.actor}
                  onChange={(e) =>
                    setReport({ ...report, actor: e.target.value })
                  }
                  className="parsed-field"
                />
              </div>
              <input
                type="text"
                placeholder={`Вихід`}
                value={report?.fromMgrs}
                onChange={(e) =>
                  setReport({ ...report, fromMgrs: e.target.value })
                }
                className="parsed-field"
              />
              <input
                type="text"
                placeholder={`Прихід`}
                value={report?.toMgrs}
                onChange={(e) =>
                  setReport({ ...report, toMgrs: e.target.value })
                }
                className="parsed-field"
              />
              <input
                type="text"
                placeholder={`Коментар`}
                value={report?.comment}
                onChange={(e) =>
                  setReport({ ...report, comment: e.target.value })
                }
                className="parsed-field"
              />
            </div>
          </div>
          <div className="modal-buttons-group">
            <button
              className="map-admin-panel-button-blue"
              onClick={handleShowOnMap}
            >
              <div className="button-content-with-icon">
                <MapIcon />
                На мапі
              </div>
            </button>
            <button
              className="map-admin-panel-button-blue"
              onClick={handleSave}
              disabled
            >
              <div className="button-content-with-icon">
                <CheckMarkIcon />
                Зберегти
              </div>
            </button>
            <button className="map-admin-panel-button" onClick={handleClose}>
              <div className="button-content-with-icon">
                <CloseIcon />
                Закрити
              </div>
            </button>
            <button className="map-admin-panel-button" onClick={handleDelete}>
              <div className="button-content-with-icon">
                <TrashBoxIcon />
                Видалити
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
