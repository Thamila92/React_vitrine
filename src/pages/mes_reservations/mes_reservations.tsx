import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './mes_reservations.css';

interface Location {
  id: number;
  position: string;
}

interface Evenement {
  id: number;
  type: string;
  description: string;
  starting: string;
  ending: string;
  location?: Location[];
}

// Nouvelle interface pour le participant
interface Attendee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  evenement: Evenement; // Assurez-vous que c'est bien structuré
}

const MesReservations = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]); // Utilisation de la nouvelle interface

  const [events, setEvents] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Ajoutez le hook useNavigate

  const VITE_URL_API = import.meta.env.VITE_URL_API;

  // Récupérer l'utilisateur du localStorage
  const userJSON = localStorage.getItem('user');
  let userId: string | undefined;

  if (userJSON) {
    try {
      const user = JSON.parse(userJSON);
      userId = user?.id;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur', error);
    }
  }

  useEffect(() => {
    const fetchReservations = async () => {
      if (!userId) {
        setError("Impossible de récupérer l'ID utilisateur.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get(`${VITE_URL_API}/getUserEvenementAttendees/${userId}`);
        console.log(response.data); // Ajoutez cette ligne pour voir ce que vous recevez exactement
        setEvents(response.data);
        setAttendees(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des événements.');
        setLoading(false);
      }
    };
  
    fetchReservations();
  }, [userId]);
 

  const handleCancelReservation = async (eventId: number) => {
    try {
      await axios.delete(`${VITE_URL_API}/events/attendees/${eventId}`);
      setEvents(events.filter(event => event.id !== eventId));
      alert("Votre inscription a été annulée.");
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'inscription", error);
      alert("Erreur lors de l'annulation de l'inscription.");
    }
  };

  const handleSeeMoreEvents = () => {
    navigate('/events'); // Redirection vers la page des événements
  };

  if (loading) {
    return <p>Chargement des événements réservés...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="reservations-container">
      <h1>Mes Réservations</h1>
      {attendees.length > 0 ? (
        <div className="reservations-list">
          {attendees.map((attendee) => (
            <div key={attendee.evenement.id} className="reservation-card">
              <h2>{attendee.evenement.type === 'PORTE_OUVERTE' ? 'Porte Ouverte' : attendee.evenement.type}</h2>
              <p>{attendee.evenement.description}</p>
              <p><strong>Début :</strong> {attendee.evenement.starting ? new Date(attendee.evenement.starting).toLocaleDateString() : 'Date non spécifiée'}</p>
              <p><strong>Fin :</strong> {attendee.evenement.ending ? new Date(attendee.evenement.ending).toLocaleDateString() : 'Date non spécifiée'}</p>
              <p><strong>Lieu :</strong> {attendee.evenement.location && attendee.evenement.location.length > 0 ? attendee.evenement.location[0].position : 'Lieu non spécifié'}</p>
              <button onClick={() => handleCancelReservation(attendee.evenement.id)}>Annuler votre inscription</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-reservation">Aucune réservation trouvée.</p>
      )}
      
      
      {/* Bouton pour voir d'autres événements */}
      <button onClick={handleSeeMoreEvents} className="see-more-events-btn">
        Voir les autres événements
      </button>
    </div>
  );
};

export default MesReservations;
