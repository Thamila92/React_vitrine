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
  state: string;
  isDeleted: boolean;
  isVirtual: boolean;
  maxParticipants: number;
  currentParticipants: number;
  membersOnly: boolean;
  quorum: number;
  repetitivity: string;
  virtualLink: string | null;
}

interface Attendee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  evenement: Evenement;
  event: Evenement; // Ajout de cette propriété
}

const MesReservations = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        console.log('Données reçues:', response.data);
        setAttendees(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des événements.');
        setLoading(false);
      }
    };
  
    fetchReservations();
  }, [userId, VITE_URL_API]);
 
  const handleCancelReservation = async (eventId: number) => {
    try {
      await axios.delete(`${VITE_URL_API}/events/attendees/${eventId}`);
      setAttendees(attendees.filter(attendee => attendee.evenement.id !== eventId));
      alert("Votre inscription a été annulée.");
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'inscription", error);
      alert("Erreur lors de l'annulation de l'inscription.");
    }
  };

  const handleSeeMoreEvents = () => {
    navigate('/events');
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
          {attendees.map((attendee) => {
            const event = attendee.event || attendee.evenement;
            return (
              <div key={attendee.id} className="reservation-card">
                <h2>{event.type === 'PORTE_OUVERTE' ? 'Porte Ouverte' : event.type}</h2>
                <p>{event.description}</p>
                <p><strong>Début :</strong> {event.starting ? new Date(event.starting).toLocaleDateString() : 'Date non spécifiée'}</p>
                <p><strong>Fin :</strong> {event.ending ? new Date(event.ending).toLocaleDateString() : 'Date non spécifiée'}</p>
                <p><strong>Lieu :</strong> {event.location && event.location.length > 0 ? event.location[0].position : 'Lieu non spécifié'}</p>
                <button onClick={() => handleCancelReservation(event.id)}>Annuler votre inscription</button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-reservation">Aucune réservation trouvée.</p>
      )}
      
      <button onClick={handleSeeMoreEvents} className="see-more-events-btn">
        Voir les autres événements
      </button>
    </div>
  );
};

export default MesReservations;