import React, { useState, useEffect } from 'react';
import { useMemo } from "react";
import './Map.css';
import StateFilter from '../Filter/StateFilter';
import { GoogleMap, useLoadScript, MarkerF,InfoWindowF } from "@react-google-maps/api";
function WeatherMap() {

 const [weatherInfo, setWeatherInfo] = React.useState([]);
 const [all, setAll] = React.useState(['']);
 const [variableData, setVariableData] = React.useState([]);
 const [state, setState] = React.useState([]);
 const [data, setData] = React.useState([]);
 const [selectedElement, setSelectedElement] = useState(null);
 const center = useMemo(() => ({ lat: -27.882762, lng: 144.217208 }), []);
 const [newCenter, setNewCenter] = useState(center)
 const [zoom, setZoom] = useState(5);
 useEffect(() => {
     const dataFetch = async () => {
       fetch('http://localhost:8080/getWeatherStationsForState?state='+state)
         .then(response => {
           if (!response.ok) {
             throw new Error('Network response was not ok');
           }
           return response.json();
         })
         .then(data => {
            setData(data);
            setNewCenter({lat: data[0].latitude, lng: data[0].longitude })
            setSelectedElement(null);
           // setZoom(7)
         });
     };
     dataFetch();
   }, [state]);

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
	function setNewState (newState) {setState(newState); setZoom(7)}

  return (
  <>
   <StateFilter defaultState={all} handleCallback={setNewState}/>

    <GoogleMap zoom={zoom}
    center={newCenter}
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
              getWeatherInfo(element)
              }
          }
       />
     );
   })}

//Showing info popup
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
    </>
  );
}
export default WeatherMap;