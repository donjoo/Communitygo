import React, { useState } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Ensure Mapbox styles are imported

const MapboxAccessToken =
  "pk.eyJ1IjoiZG9uam8iLCJhIjoiY200NHRxeGp3MG4zNDJqcjQ1dGxpNWo1MSJ9.77K2myuETuMW-S-KQf7Akw";

const RideMapComponent = ({ selectingStartpoint, onStartSelect,onEndSelect}) => {
  const [viewport, setViewport] = useState({
    // latitude: 10.02476,
    // longitude: 76.307768,
    latitude: 10.7689,
    longitude: 75.9287,
    zoom: 12,
  });

 

  const [StartingCoordinates, setStartingCoordinates] = useState(null);
  const [EndCoordinates, setEndCoordinates] = useState(null);

  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;

    if (selectingStartpoint) {
      setStartingCoordinates({ longitude: lng, latitude: lat });
      onStartSelect({ longitude: lng, latitude: lat })
    } else {
       setEndCoordinates({ longitude: lng, latitude: lat });     
       onEndSelect({ longitude: lng, latitude: lat })
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
          {StartingCoordinates && (
            <Marker
            key="pickup-marker"
            longitude={StartingCoordinates.longitude}
            latitude={StartingCoordinates.latitude}
            color="green"
            >
              
            </Marker>
          )}

          {EndCoordinates && (
            <Marker
            key="dropoff-marker"
            longitude={EndCoordinates.longitude}
            latitude={EndCoordinates.latitude}
            color="red"
            >
              
            </Marker>
          )}
        </Map>
      </div>
    </div>
  );
};

export default RideMapComponent;
