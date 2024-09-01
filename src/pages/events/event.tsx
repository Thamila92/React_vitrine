import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './event.css';

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
  membersOnly: boolean;
  location: Location[];
  currentParticipants: number;
  maxParticipants: number;
}

const Events = () => {
  const [events, setEvents] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: ''
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const VITE_URL_API = import.meta.env.VITE_URL_API;

  useEffect(() => {
    const userJSON = localStorage.getItem('user');
    setIsUserLoggedIn(!!userJSON);

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${VITE_URL_API}/evenements`);
        setEvents(response.data.evenements);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleInscriptionClick = (eventId: number, membersOnly: boolean) => {
    if (membersOnly && !isUserLoggedIn) {
      alert('Vous ne pouvez pas vous inscrire à cet événement car il est réservé aux membres.');
      return;
    }
    setSelectedEventId(eventId);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedEventId !== null) {
        try {
            const response = await axios.post(`${VITE_URL_API}/evenements/${selectedEventId}/inscrire`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                age: parseInt(formData.age, 10)  // Convertir l'âge en nombre
            });
            alert('Inscription réussie ! Vous êtes maintenant inscrit à l\'événement.');
            setShowModal(false); // Ferme la modale après l'inscription
        } catch (error: unknown) {  // Typage explicite comme unknown
            console.error('Erreur lors de l\'inscription', error);

            // Vérifiez si l'erreur vient de l'API et affichez un message approprié
            if (axios.isAxiosError(error) && error.response) {  // Vérification si c'est une erreur Axios
                if (error.response.data.error === 'You are already registered for this event.') {
                    alert('Vous êtes déjà inscrit à cet événement.');
                } else {
                    alert('Erreur lors de l\'inscription: ' + error.response.data.error);
                }
            } else {
                alert('Erreur lors de l\'inscription. Veuillez réessayer plus tard.');
            }
        }
    }
};


  if (loading) {
    return <p>Chargement des événements...</p>;
  }

  return (
    <div className="events-container">
      <h1>Nos événements</h1>
      <div className="events-list">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h2>{event.type}</h2>
            <p>{event.description}</p>
            <p><strong>Début :</strong> {new Date(event.starting).toLocaleDateString()}</p>
            <p><strong>Fin :</strong> {new Date(event.ending).toLocaleDateString()}</p>
            <p><strong>Lieu :</strong> {event.location[0]?.position}</p>
            <p><strong>Nombre de participants :</strong> {event.currentParticipants}/{event.maxParticipants}</p>
            <p><strong>Accessible aux membres uniquement :</strong> {event.membersOnly ? 'Oui' : 'Non'}</p>
            <button onClick={() => handleInscriptionClick(event.id, event.membersOnly)}>
              Inscrivez-vous
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Inscription à l'événement</h2>
            <form onSubmit={handleSubmit}>
              <label>Prénom:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <label>Nom:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label>Âge:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Soumettre</button>
              <button type="button" onClick={() => setShowModal(false)}>Fermer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
