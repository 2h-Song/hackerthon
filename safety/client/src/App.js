import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Map from "./components/map"; // Make sure the path is correct
// import Admin from "./components/admin"; // Make sure the path is correct

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Footer />
        <Routes>
          <Route path="/" element={<Map />} />
          {/* <Route path="/admin" element={<Admin />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
