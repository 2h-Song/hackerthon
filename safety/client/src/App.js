import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import axios from "axios";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Main from "./pages/Main";

function App() {

  return (
    <Router>
      <div className="App">
        <Header />
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        <Footer />
    </div>
    </Router>
  );
}

export default App;
