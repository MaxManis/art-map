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
  Circle,
  LayerGroup,
} from "react-leaflet";
import L, { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { forward } from "mgrs";
import { GlobalStateContext } from "../../context/GlobalStateContext";

const MarkerIcon = new Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const UserMap = ({ userPoints }) => {
  const mapInitPoint = JSON.parse(
    window.localStorage.getItem("last-report-point"),
  );
  const { state, dispatch } = useContext(GlobalStateContext);
  const { reports, user, lbz } = state;

  const [circles, setCircles] = useState([]);
  const [lines, setLines] = useState([]);

  const [markerPoints, setMarkerPoints] = useState([]);

  useEffect(() => {
    splitReports();
  }, [reports]);

  const splitReports = async () => {
    const circlesData = reports.filter((c) => c.pointsCount === 1);
    setCircles(circlesData);

    const linesData = reports.filter((l) => l.pointsCount === 2);
    setLines(linesData);
  };

  // Handle map click to add points
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
  };

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        if (markerPoints.length) {
          setMarkerPoints([]);
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

  const MapMover = () => {
    const map = useMapEvents({});
    useEffect(() => {
      if (!userPoints || !userPoints.length) {
        return;
      }

      if (Array.isArray(userPoints[0])) {
        map.panTo(userPoints[0]);
      } else {
        map.panTo(userPoints);
      }
    }, [userPoints]);
    return null;
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <MapContainer
        center={mapInitPoint || [50.77, 34.7]}
        zoom={10}
        style={{ height: `100vh` }}
        onClick={handleMapClick}
      >
        <MapPanes />
        <MapMover />
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
        <MapEvents />

        <LayersControl position="topright">
          <LayersControl.Overlay name="Основне" checked>
            <LayerGroup>
              {userPoints &&
                userPoints.length > 1 &&
                typeof userPoints[0] !== "number" && (
                  <Polyline positions={userPoints} color="orange"></Polyline>
                )}
              {userPoints && typeof userPoints[0] === "number" && (
                <CircleMarker
                  center={userPoints}
                  radius={10}
                  color="orange"
                ></CircleMarker>
              )}

              {markerPoints.length > 0 && (
                <Marker position={markerPoints} icon={MarkerIcon}>
                  <Tooltip
                    direction="top"
                    offset={[0, -40]}
                    opacity={1}
                    permanent
                  >
                    {forward([markerPoints[1], markerPoints[0]])}
                  </Tooltip>
                </Marker>
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
                lbz?.points?.length > 0 &&
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
