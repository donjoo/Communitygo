import React, { useEffect, useState } from "react";
import Map, { Marker ,Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Ensure Mapbox styles are imported

const MapboxAccessToken =
  "pk.eyJ1IjoiZG9uam8iLCJhIjoiY200NHRxeGp3MG4zNDJqcjQ1dGxpNWo1MSJ9.77K2myuETuMW-S-KQf7Akw";

const MapComponent = ({ selectingPickup, onPickupSelect,onDropoffSelect ,onRouteDistance}) => {
  const [viewport, setViewport] = useState({
    // latitude: 10.02476,
    // longitude: 76.307768,
    latitude: 10.7689,
    longitude: 75.9287,
    zoom: 12,
  });

 

  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropoffCoordinates, setDropoffCoordinates] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const [route, setRoute] = useState(null); // To store route geometry


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




  

  useEffect(() => {
    if (pickupCoordinates && dropoffCoordinates) {
      const getRoute = async () => {
        const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates.longitude},${pickupCoordinates.latitude};${dropoffCoordinates.longitude},${dropoffCoordinates.latitude}?alternatives=true&annotations=distance&geometries=geojson&language=en&overview=full&steps=true&access_token=${MapboxAccessToken}`);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          // Set the route geometry && distance
          // setRouteDistance(data.routes[0].distance);
          onRouteDistance(data.routes[0].distance);
          setRoute(data.routes[0].geometry);
        }
      };

      getRoute();
    }
  }, [pickupCoordinates, dropoffCoordinates]);




  useEffect(()=>{
    console.log(routeDistance,'this is diestance between two pointssssssssss')
  },[routeDistance])


  return (
    <div>
      <div style={{ width: "100%", height: "500px" }}>
        <Map
          initialViewState={viewport}
          style={{ width: "100%", height: "100%" }}
          // mapStyle="mapbox://styles/mapbox/streets-v12"
          mapStyle="mapbox://styles/donjo/cm5pmc8bv00hn01rz8ss36y6z"
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

export default MapComponent;
