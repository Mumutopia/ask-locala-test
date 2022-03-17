import React from "react";

import "./Poi.css";

export default function Poi({ brand, city, state, onClick }) {
  return (
    <button className="poi-wrapper" onClick={onClick}>
      <img
        className="poi-logo"
        src="./img/building-svgrepo-com.svg"
        alt="poi-logo"
      />
      <div className="poi-info-container">
        <h3>{brand}</h3>
        <span>
          {city}, {state}
        </span>
      </div>
    </button>
  );
}
