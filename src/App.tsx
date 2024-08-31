import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/home';
import Events from './pages/events/event';
import Demande from './pages/Demande/demande';
import Contact from './pages/Contact/contact';
import SignUpLogin from './pages/SignUpLogin/Login';
import HeaderLayout from './components/HeaderLayout/HeaderLayout';
import SignUp from './pages/SignUpLogin/SignUp';
import Profile from './pages/Profil/profil';
import MesDemandes from './pages/Mes_Demande/mes_demande';
import MesReservations from './pages/mes_reservations/mes_reservations';
import Don from './pages/Don/don';
import ChatbotComponent from './components/chatbot/ChatbotComponent';

 import DonutChart from './pages/Mes_Dons/mes_dons';
function App() {
  return (
    <div className="App">
      <ChatbotComponent />

    <Router>
      <Routes>
        <Route element={<HeaderLayout />}>
           <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/demande" element={<Demande />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signUp&Login" element={<SignUpLogin />} />
          <Route path="/signup" element={<SignUp />} /> 
          <Route path="/profil" element={<Profile />} />
          <Route path="/mes-demandes" element={<MesDemandes />} />  
          <Route path="/mes-reservations" element={<MesReservations />} />  
          <Route path="/don" element={<Don />} />  
          <Route path="/mes-dons" element={<DonutChart />} />  

          



        </Route>
 

      </Routes>
    </Router>
    </div>
  );
}

export default App;
