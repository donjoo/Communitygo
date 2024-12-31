import React, { useState } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Ensure Mapbox styles are imported

const MapboxAccessToken =
  "pk.eyJ1IjoiZG9uam8iLCJhIjoiY200NHRxeGp3MG4zNDJqcjQ1dGxpNWo1MSJ9.77K2myuETuMW-S-KQf7Akw";

const MapComponent = ({ selectingPickup, onPickupSelect,onDropoffSelect}) => {
  const [viewport, setViewport] = useState({
    // latitude: 10.02476,
    // longitude: 76.307768,
    latitude: 10.7689,
    longitude: 75.9287,
    zoom: 12,
  });

 

  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropoffCoordinates, setDropoffCoordinates] = useState(null);

  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;

    if (selectingPickup) {
      setPickupCoordinates({ longitude: lng, latitude: lat });
      onPickupSelect({ longitude: lng, latitude: lat })
    } else {
      setDropoffCoordinates({ longitude: lng, latitude: lat });     
      onDropoffSelect({ longitude: lng, latitude: lat })
    }
  };

  return (
    <div>
      <div style={{ width: "100%", height: "500px" }}>
        <Map
          initialViewState={viewport}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MapboxAccessToken}
          onMove={(evt) => setViewport(evt.viewState)}
          onClick={handleMapClick}
        >
          {pickupCoordinates && (
            <Marker
            key="pickup-marker"
            longitude={pickupCoordinates.longitude}
            latitude={pickupCoordinates.latitude}
            color="green"
            >
              
            </Marker>
          )}

          {dropoffCoordinates && (
            <Marker
            key="dropoff-marker"
            longitude={dropoffCoordinates.longitude}
            latitude={dropoffCoordinates.latitude}
            color="red"
            >
              
            </Marker>
          )}
        </Map>
      </div>
    </div>
  );
};

export default MapComponent;
