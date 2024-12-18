import React, { useState, useEffect } from "react";
import Map, { Marker, NavigationControl, Source, Layer } from "react-map-gl";

// Your Mapbox access token
const mapboxToken = "pk.eyJ1IjoiZG9uam8iLCJhIjoiY200NHRxeGp3MG4zNDJqcjQ1dGxpNWo1MSJ9.77K2myuETuMW-S-KQf7Akw";

// Mapbox Directions API URL
const directionsUrl = "https://api.mapbox.com/directions/v5/mapbox/driving/";

const Navigation = ({ startlocation, endlocation }) => {
  const [viewport, setViewport] = useState({
    longitude: startlocation[0],
    latitude: startlocation[1],
    zoom: 12,
  });
  const [route, setRoute] = useState(null);

  useEffect(() => {
    const getDirections = async () => {
      try {
        const response = await fetch(
          `${directionsUrl}${startlocation[0]},${startlocation[1]};${endlocation[0]},${endlocation[1]}?access_token=${mapboxToken}&geometries=geojson`
        );
        const data = await response.json();
        setRoute(data.routes[0].geometry); // Set the route geometry for the map

        // Adjust viewport based on the route
        const bounds = data.routes[0].bbox;
        setViewport({
          longitude: (bounds[0] + bounds[2]) / 2,
          latitude: (bounds[1] + bounds[3]) / 2,
          zoom: 12, 
        });
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    if (startlocation && endlocation) {


      getDirections();
    }
  }, [startlocation, endlocation]);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Map
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxToken}
        style={{ width: "100%", height: "100%" }}
        onMove={(evt) => setViewport(evt.viewState)}
      >
        {/* Marker for the starting point */}
        <Marker key="pickup-marker" color="green" longitude={startlocation[0]} latitude={startlocation[1]} />

        {/* Marker for the destination */}
        <Marker key="dropoff-marker" color="red" longitude={endlocation[0]} latitude={endlocation[1]} />

        {/* Display the route using the Source and Layer components */}
        {route && (
          <Source id="route" type="geojson" data={{ type: "Feature", geometry: route }}>
            <Layer
              id="route-layer"
              type="line"
              paint={{
                "line-color": "#007cbf",
                "line-width": 8,
                "line-opacity": 0.8,
              }}
            />
          </Source>
        )}

        {/* Navigation controls */}
        <NavigationControl position="top-left" />
      </Map>
    </div>
  );
};

export default Navigation;
