import React, { useState, useEffect } from 'react';
import { useMemo } from "react";
import Constants from '../Constants'

import { Select, MenuItem, InputLabel, FormHelperText } from '@material-ui/core';
function StateFilter(props) {

 const filterStations = (event) => {
    props.handleCallback(event.target.value);
    //setZoom(7)
 };
return (
<>
    <FormHelperText
        style={{fontSize: '1em',color: 'black', marginTop: 0, marginLeft: 10, backgroundColor: 'white'}}>
        Select a state
    </FormHelperText>
    <Select defaultValue={props.defaultState} displayEmpty label="State" style={{ marginTop: 5,
        marginLeft: 10 ,
        backgroundColor: 'white'}}
        onChange={filterStations}>
      <MenuItem value={'VIC'}>VIC</MenuItem>
      <MenuItem value={'NSW'}>NSW</MenuItem>
      <MenuItem value={'SA'}>SA</MenuItem>
      <MenuItem value={'QLD'}>QLD</MenuItem>
      <MenuItem value=""><em>All</em></MenuItem>
    </Select>
</>
    );
 }
 export default StateFilter;