import React from 'react';
import { useLoadScript} from "@react-google-maps/api";

import './App.css';
import WeatherMap from './GoogleMap/WeatherMap';

function App() {
const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div className="App">
       <WeatherMap/>
    </div>
  );
}
export default App;
