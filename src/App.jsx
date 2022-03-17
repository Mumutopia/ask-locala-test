import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./App.css";
import "primereact/resources/themes/saga-blue/theme.css";
import pois from "./data/pois.json";
import Poi from "./Components/Poi";
import { InputText } from "primereact/inputtext";

mapboxgl.accessToken =
  "pk.eyJ1IjoibXVtdXRvcGlhIiwiYSI6ImNsMHFrd3AzcTI4b28zZHVvcnNkcGZ3NnkifQ.XQE3qt3FUBBBxoAKXSyQFw";

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-118.5);
  const [lat, setLat] = useState(36.07);
  const [zoom, setZoom] = useState(5.5);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      map.current.resize();
    });

    // Add zoom and rotation controls to the map.
    map.current.addControl(new mapboxgl.NavigationControl());

    pois.forEach((poi) => {
      const popup = new mapboxgl.Popup({ offset: 30 }).setHTML(
        `<h4>${poi.brand}</h4>
        <span>${poi.address}</span>`
      );

      new mapboxgl.Marker({ color: "red" })
        .setLngLat([poi.longitude, poi.latitude])
        .setPopup(popup)
        .addTo(map.current);
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div className="main-wrapper">
      <div className="data-list-container">
        <h2>Gym Clubs</h2>
        <InputText
          value={inputValue}
          placeholder="Search Gym in your city"
          className="p-inputtext-sm"
          onChange={(e) => setInputValue(e.target.value.toLowerCase())}
        />
        <div className="poi-list-wrapper">
          {(inputValue === ""
            ? pois
            : pois.filter((poi) => poi.city.toLowerCase().includes(inputValue))
          ).map((poi, i) => {
            return (
              <Poi
                className="poi-test"
                key={i}
                brand={poi.brand}
                state={poi.state}
                city={poi.city}
                onClick={() =>
                  map.current.jumpTo({
                    center: [poi.longitude, poi.latitude],
                    zoom: 15,
                  })
                }
              />
            );
          })}
        </div>
      </div>

      <div className="map-wrapper">
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}

export default App;
