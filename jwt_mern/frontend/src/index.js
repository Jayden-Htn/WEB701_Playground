import React from "react";
import ReactDOM from "react-dom/client"; // Use 'react-dom/client' instead of 'react-dom'
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// Create a root for React to render into
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component within BrowserRouter
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
