import React, { useState, useEffect } from 'react';
import { useMemo } from "react";
import './App.css';
import { GoogleMap, useLoadScript, MarkerF,InfoWindow } from "@react-google-maps/api";
function App() {
const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div className="App">

       <Map/>
    </div>

  );
}

function Map() {

 const [weatherInfo, setWeatherInfo] = React.useState([]);
 const [variableData, setVariableData] = React.useState([]);

 const [data, setData] = React.useState([]);
 useEffect(() => {
     const dataFetch = async () => {
       fetch('http://localhost:8080/getWeatherStations')
         .then(response => {
           if (!response.ok) {
             throw new Error('Network response was not ok');
           }
           return response.json();
         })
         .then(data => {
            setData(data);
         });

     };

     dataFetch();
   }, []);
 const [selectedElement, setSelectedElement] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showInfoWindow, setInfoWindowFlag] = useState(true);

 const getWeatherInfo = async (station) => {
 fetch('http://localhost:8080/getWeatherInfo?wsId='+station.id)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(weatherInfo => {
             setWeatherInfo(weatherInfo);
             setVariableData(weatherInfo.dataList);
          });

	}

 const center = useMemo(() => ({ lat: -35.882762, lng: 144.217208 }), []);
  return (
    <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">

   {data.map((element, index) => {
             return (
               <MarkerF
                 key={index}
                 title={element.wsName}
                 label={{text:`${element.wsName}`,color:'#fff', backgroundColor: "#7fffd4"}}
                 position={{
                   lat: element.latitude,
                   lng: element.longitude
                 }}
                  onClick={(event) => {
                      setSelectedElement(element);
                      getWeatherInfo(element)}
                  }
               />
             );
           })}


      {selectedElement ? (
                <InfoWindow
                    options={{ width: 320 }}
                   position={{
                     lat: selectedElement.latitude,
                     lng: selectedElement.longitude
                   }}
                  onCloseClick={() => {
                    setSelectedElement(null);
                  }}
                >
                  <div id="info">
                    <p><b>Name: </b>{weatherInfo.name}</p>
                    <p><b>Site: </b>{weatherInfo.site}</p>
                    <p><b>Portfolio: </b>{weatherInfo.portfolio}</p>
                    <p><b>Time: </b>{weatherInfo.timestamp}</p>
                    {variableData ? (
                        <span>
                         {variableData.map((element, index) => {
                            return( <p> <b>{element.name}: </b>{element.value}{element.unit}</p>);
                         })}
                        </span>
                    ) : null}
                  </div>
                </InfoWindow>
              ) : null}
    </GoogleMap>
  );
}

export default App;
