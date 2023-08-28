import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import axios from "axios";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Map from "./components/map";

function App() {

  return (
    <Router>
      <div className="App">
        <Header />
          <Routes>
            <Route path="/" element={<Map/>} />
          </Routes>
        <Footer />
    </div>
    </Router>
  );
}

export default App;
