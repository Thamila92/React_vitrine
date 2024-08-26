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

const MesReservations = () => {
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
        setEvents(response.data);
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
      await axios.delete(`${VITE_URL_API}/evenements/${eventId}/cancelReservation`);
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
      {events.length > 0 ? (
        <div className="reservations-list">
          {events.map((event) => (
            <div key={event.id} className="reservation-card">
              <h2>{event.type === 'PORTE_OUVERTE' ? 'Porte Ouverte' : event.type}</h2>
              <p>{event.description}</p>
              <p><strong>Début :</strong> {new Date(event.starting).toLocaleDateString()}</p>
              <p><strong>Fin :</strong> {new Date(event.ending).toLocaleDateString()}</p>
              <p><strong>Lieu :</strong> {event.location && event.location.length > 0 ? event.location[0].position : 'Lieu non spécifié'}</p>
              <button onClick={() => handleCancelReservation(event.id)}>Annuler votre inscription</button>
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
