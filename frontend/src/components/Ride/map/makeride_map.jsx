import React, { useEffect, useState } from "react";
import Map, { Marker ,Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Ensure Mapbox styles are imported

const MapboxAccessToken =
  "pk.eyJ1IjoiZG9uam8iLCJhIjoiY200NHRxeGp3MG4zNDJqcjQ1dGxpNWo1MSJ9.77K2myuETuMW-S-KQf7Akw";

const RideMapComponent = ({ selectingStartpoint, onStartSelect,onEndSelect,onRouteDistance}) => {
  const [viewport, setViewport] = useState({
    // latitude: 10.02476,
    // longitude: 76.307768,
    latitude: 10.7689,
    longitude: 75.9287,
    zoom: 12,
  });

 

  const [StartingCoordinates, setStartingCoordinates] = useState(null);
  const [EndCoordinates, setEndCoordinates] = useState(null);
  const [route, setRoute] = useState(null); // To store route geometry
  const [routeDistance, setRouteDistance] = useState(null);
  

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




  useEffect(() => {
    if (StartingCoordinates && EndCoordinates) {
      const getRoute = async () => {
        const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${StartingCoordinates.longitude},${StartingCoordinates.latitude};${EndCoordinates.longitude},${EndCoordinates.latitude}?alternatives=true&annotations=distance&geometries=geojson&language=en&overview=full&steps=true&access_token=${MapboxAccessToken}`);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          // Set the route geometry && distance
          setRouteDistance(data.routes[0].distance);
          onRouteDistance(data.routes[0].distance);
          setRoute(data.routes[0].geometry);
        }
      };

      getRoute();
    }
  }, [StartingCoordinates, EndCoordinates]);








 useEffect(()=>{
    console.log(routeDistance,'this is diestance between two pointssssssssss')
  },[routeDistance])

  return (
    <div>
      <div style={{ width: "100%", height: "500px" }}>
        <Map
          initialViewState={viewport}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          // mapStyle="mapbox://styles/donjo/cm5pmc8bv00hn01rz8ss36y6z"
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

            {route && (
            <Source id="route" type="geojson" data={{
              type: "Feature",
              geometry: route,
            }}>
              <Layer
                id="route-layer"
                type="line"
                layout={{
                  "line-join": "round",
                  "line-cap": "round",
                }}
                paint={{
                  "line-color": "#FFFFFF",
                  "line-width": 8,
                }}
              />
            </Source>
          )}


        </Map>
      </div>
    </div>
  );
};

export default RideMapComponent;
