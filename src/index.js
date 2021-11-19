import React from 'react';
import ReactDOM from 'react-dom';

/*** Import needed component and CSS  ***/
import './index.css';
import Booking from './Booking';

/*** Render component to div on HTML  ***/
ReactDOM.render(
  <React.StrictMode>
    <Booking />
  </React.StrictMode>,
  document.getElementById('airplane_booking')
);


