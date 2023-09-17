import React, { useState, useEffect } from 'react';
import { useMemo } from "react";
import './App.css';
import { GoogleMap, useLoadScript, MarkerF,InfoWindowF } from "@react-google-maps/api";
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
            setSelectedElement(null);
         });

     };

     dataFetch();
   }, []);
 const [selectedElement, setSelectedElement] = useState(null);

 const getWeatherInfo = async (station) => {
        fetch('http://localhost:8080/getWeatherInfo?wsId='+station.id)
          .then(response => {
            if (!response.ok) {
             return response.json();
            }
            return response.json();
          })
          .then(weatherInfo => {
             if(weatherInfo.code === null || weatherInfo.code === undefined)
             {
             setWeatherInfo(weatherInfo);
             setVariableData(weatherInfo.dataList);
             setSelectedElement(station)
             } else
             {
             alert(weatherInfo.message)
             }
          });
	}

 const center = useMemo(() => ({ lat: -35.882762, lng: 144.217208 }), []);
  return (
    <GoogleMap zoom={7}
    center={center}
    mapContainerClassName="map-container"
    onClick={(event) => {
        setSelectedElement(null);
       }
     }>

   {data.map((element, index) => {
             return (
               <MarkerF
                 key={element.id}
                 title={element.wsName}
                 label={{text:`${element.wsName}`,color:'#fff', backgroundColor: "#7fffd4"}}
                 position={{
                   lat: element.latitude,
                   lng: element.longitude
                 }}
                  onClick={(event) => {
                      getWeatherInfo(element)}
                  }
               />
             );
           })}


      {selectedElement && (
                <InfoWindowF
                id={selectedElement.id}
                   position={{
                     lat: selectedElement.latitude,
                     lng: selectedElement.longitude
                   }}
                  onCloseClick={() => {
                    setSelectedElement(null);
                  }}
                >
                  <div id={selectedElement.id}>
                    <p><b>Name: {weatherInfo.name}</b></p>
                    <p><b>Site: </b>{weatherInfo.site}</p>
                    <p><b>Portfolio: </b>{weatherInfo.portfolio}</p>
                    <p><b>Time: </b>{weatherInfo.timestamp}</p>
                    {variableData ? (
                        <span>
                         {variableData.map((element, index) => {
                            return( <p id={element.varId}> <b>{element.name}: </b>{element.value}{element.unit}</p>);
                         })}
                        </span>
                    ) : null}
                  </div>
                </InfoWindowF>
              ) }
    </GoogleMap>
  );
}

export default App;
