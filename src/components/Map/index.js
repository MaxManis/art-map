import React, { useState, useEffect, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Popup,
  CircleMarker,
  Marker,
  LayersControl,
  Tooltip,
  useMapEvents,
  LayerGroup,
  Circle,
} from "react-leaflet";
import { forward } from "mgrs";
import L, { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

import { GlobalStateContext } from "../../context/GlobalStateContext";
import { httpClient } from "../../api/httpClient";
import {
  DrawIcon,
  CheckMarkIcon,
  CloseIcon,
  PinIcon,
  OpenIcon,
} from "../icons";

const MarkerIcon = new Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const Map = () => {
  const mapInitPoint = JSON.parse(
    window.localStorage.getItem("last-report-point"),
  );
  const [circles, setCircles] = useState([]);
  const [lines, setLines] = useState([]);

  const [drawing, setDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState([]);
  const [measurePoints, setMeasurePoints] = useState([]);

  const [markerPoints, setMarkerPoints] = useState([]);

  const [isCircleFilter, setIsCircleFilter] = useState(false);
  const [filterCircle, setFilterCircle] = useState(null);
  const [circleRadiusKm, setCircleRadiusKm] = useState(1);

  const [mapMode, setMapMode] = useState(1);

  const { state, dispatch } = useContext(GlobalStateContext);
  const { reportsToShow, reports, user, token, lbz } = state;

  const splitReports = () => {
    const circlesData = reportsToShow.filter((c) => c.pointsCount === 1);
    setCircles(circlesData);

    const linesData = reportsToShow.filter((l) => l.pointsCount === 2);
    setLines(linesData);
  };

  const saveLbz = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const lbzData = {
        points: drawPoints,
        color: "darkred",
        comment: "ЛБЗ",
      };
      await httpClient.post("/lbz", token, lbzData, false);
      const newLbz = await httpClient.get("/lbz", token);
      setDrawPoints([]);
      dispatch({ type: "SET_LBZ", payload: newLbz });
    } catch (err) {}
    dispatch({ type: "SET_LOADING", payload: false });
  };

  useEffect(() => {
    splitReports();
  }, [reportsToShow]);

  const MapEvents = () => {
    useMapEvents({
      contextmenu: (e) => {
        if (isCircleFilter) {
          setCircleRadiusKm(circleRadiusKm + 2);
          return;
        }

        if (drawing) {
          setDrawPoints(() => [...drawPoints.slice(0, drawPoints.length - 1)]);
          return;
        }

        setMeasurePoints(() => [
          ...measurePoints,
          [e.latlng.lat, e.latlng.lng],
        ]);
        if (measurePoints.length === 1) {
          const fromMgrs = forward([measurePoints[0][1], measurePoints[0][0]]);
          const toMgrs = forward([e.latlng.lng, e.latlng.lat]);
          const distance = L.latLng(measurePoints[0]).distanceTo(e.latlng);
          alert(
            `${fromMgrs}-${toMgrs}\nDistance:\n${distance.toFixed(2)} m\n${(distance / 1000).toFixed(2)} km`,
          );
          setMeasurePoints([]);
        }
      },
      click: (e) => {
        if (drawing) {
          setDrawPoints(() => [...drawPoints, [e.latlng.lat, e.latlng.lng]]);
        } else if (isCircleFilter) {
          selectPoints(e.latlng.lat, e.latlng.lng, circleRadiusKm);
        } else {
          setMarkerPoints([e.latlng.lat, e.latlng.lng]);
        }
      },
    });
    return null;
  };

  const MapPanes = () => {
    const map = useMapEvents({});
    useEffect(() => {
      if (!map.getPane("labels")) {
        map.createPane("labels");
        map.getPane("labels").style.zIndex = 650;
        map.getPane("labels").style.pointerEvents = "none";
      }
    }, [map]);
    return null;
  };

  // Select points within a radius
  const selectPoints = (lat, lng, radiusKm) => {
    const radiusMeters = radiusKm * 1000; // Convert km to meters
    const centerLatLng = L.latLng(lat, lng);
    const selected = reports.filter((point) => {
      const pointFromLatLng = L.latLng(point.fromLat, point.fromLng);
      let pointToLatLng = null;

      if (point.toMgrs) {
        pointToLatLng = L.latLng(point.toLat, point.toLng);
        return (
          centerLatLng.distanceTo(pointFromLatLng) <= radiusMeters ||
          centerLatLng.distanceTo(pointToLatLng) <= radiusMeters
        );
      }
      return centerLatLng.distanceTo(pointFromLatLng) <= radiusMeters;
    });

    dispatch({ type: "SET_REPORTS_TO_SHOW", payload: selected });
    setFilterCircle({ points: [lat, lng], radius: radiusMeters });
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="map-admin-panel">
        {!drawing && (
          <>
            <button
              className="map-admin-panel-button"
              onClick={() => {
                setIsCircleFilter(!isCircleFilter);
                setCircleRadiusKm(1);
              }}
            >
              <div className="button-content-with-icon">
                <PinIcon />
                Радіус ({circleRadiusKm}km)
              </div>
            </button>
            <button
              className="map-admin-panel-button"
              onClick={() => setDrawing(!drawing)}
            >
              <div className="button-content-with-icon">
                <DrawIcon />
                Задати ЛБЗ
              </div>
            </button>
          </>
        )}
        {drawing && (
          <>
            <button
              className="map-admin-panel-button-blue"
              onClick={() => saveLbz()}
            >
              <div className="button-content-with-icon">
                <CheckMarkIcon />
                Зберегти
              </div>
            </button>
            <button
              className="map-admin-panel-button"
              onClick={() => {
                setDrawPoints([]);
                setDrawing(false);
              }}
            >
              <div className="button-content-with-icon">
                <CloseIcon />
                Відмінити
              </div>
            </button>
          </>
        )}
      </div>

      <button
        className="layers-map-button map-admin-panel-button"
        onClick={() => {
          setMapMode(() => (mapMode >= 3 ? 1 : mapMode + 1));
        }}
      >
        <div className="button-content-with-icon">
          <OpenIcon />
        </div>
      </button>

      <MapContainer
        center={mapInitPoint || [48.5, 38.5]}
        zoom={10}
        style={{ height: `100vh` }}
      >
        <MapPanes />
        <MapMover reportsToShowProp={reportsToShow} />
        {mapMode === 1 && (
          <>
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Enemy Artillery Activity Analyzer"
            />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
              attribution="ReportMap"
              pane="labels"
              zIndex={650}
              opacity={1}
            />
          </>
        )}
        {mapMode === 2 && (
          <>
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution="Enemy Artillery Activity Analyzer"
            />
            <TileLayer
              url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
              attribution="ReportMap"
              pane="labels"
              maxZoom={19}
              zIndex={650}
              opacity={1}
            />
          </>
        )}
        {mapMode === 3 && (
          <>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution="Enemy Artillery Activity Analyzer"
            />
          </>
        )}
        {mapMode === 4 && (
          <>
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}"
              attribution="Enemy Artillery Activity Analyzer"
              ext="jpg"
            />
          </>
        )}
        <MapEvents />

        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Основне">
            <LayerGroup>
              {markerPoints.length !== 0 && (
                <Marker position={markerPoints} icon={MarkerIcon}>
                  <Tooltip
                    direction="top"
                    offset={[0, -40]}
                    opacity={1}
                    permanent
                  >
                    {(() => {
                      const mgrsC = forward([markerPoints[1], markerPoints[0]]);
                      return mgrsC;
                    })()}
                  </Tooltip>
                </Marker>
              )}

              {measurePoints.length > 0 &&
                measurePoints.map((p, i) => (
                  <CircleMarker key={i} center={p} color="white">
                    <Tooltip
                      direction="bottom"
                      offset={[0, 10]}
                      opacity={1}
                      permanent
                    >
                      <div>{forward([p[1], p[0]])}</div>
                    </Tooltip>
                  </CircleMarker>
                ))}

              {drawPoints &&
                drawPoints.length > 1 &&
                drawPoints.map((line, i) => {
                  return drawPoints[i + 1] ? (
                    <Polyline
                      key={i}
                      positions={[line, drawPoints[i + 1]]}
                      color="orange"
                    ></Polyline>
                  ) : null;
                })}

              {isCircleFilter && filterCircle && (
                <Circle
                  center={filterCircle.points}
                  radius={filterCircle.radius}
                  color="orange"
                  fillOpacity="0"
                  opacity="0.5"
                ></Circle>
              )}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Звуки">
            <LayerGroup>
              {circles &&
                circles.length > 0 &&
                circles.map((circle) => {
                  return (
                    <Circle
                      key={circle.id}
                      center={[circle.fromLat, circle.fromLng]}
                      radius={35}
                      color={circle.color}
                    >
                      {circle.rawReport && <Popup>{circle.rawReport}</Popup>}
                    </Circle>
                  );
                })}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Звіти">
            <LayerGroup>
              {lines &&
                lines.length &&
                lines.map((line) => {
                  const { fromLat, fromLng, toLat, toLng, distance } = line;
                  const distMsg = distance
                    ? "; Distance: " + distance.toFixed(2) + " m"
                    : "";

                  return (
                    <Polyline
                      key={line.id}
                      positions={[
                        [fromLat, fromLng],
                        [toLat, toLng],
                      ]}
                      color={line.color}
                    >
                      {line.rawReport && (
                        <Popup>{line.rawReport + distMsg}</Popup>
                      )}
                    </Polyline>
                  );
                })}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="ЛБЗ">
            <LayerGroup>
              {lbz &&
                lbz.points.length > 0 &&
                lbz.points.map((line, i) => {
                  return lbz.points[i + 1] ? (
                    <Polyline
                      key={i}
                      positions={[line, lbz.points[i + 1]]}
                      color={lbz.color}
                    >
                      {lbz.comment && <Popup>{lbz.comment}</Popup>}
                    </Polyline>
                  ) : null;
                })}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

// NOTE: function to move map to a specific report.
// Its moved out of Map component ot fix a but when map changed all the time
// and move the map constantly if only one report to show.
const MapMover = ({ reportsToShowProp }) => {
  const map = useMapEvents({});

  useEffect(() => {
    if (!reportsToShowProp || reportsToShowProp.length !== 1) {
      return;
    }

    map.panTo([reportsToShowProp[0].fromLat, reportsToShowProp[0].fromLng]);
  }, [reportsToShowProp]);

  return null;
};
