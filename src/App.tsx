// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/home';
import Events from './pages/events/event';
import Demande from './pages/Demande/demande';
import Contact from './pages/Contact/contact';
import SignUpLogin from './pages/SignUpLogin/Login';
import HeaderLayout from './components/HeaderLayout/HeaderLayout';  // Assure-toi que le chemin est correct

function App() {
  return (
    <Router>
      <Routes>
        {/* Toutes ces routes seront englobées par HeaderLayout */}
        <Route element={<HeaderLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/demande" element={<Demande />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signUp&Login" element={<SignUpLogin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
