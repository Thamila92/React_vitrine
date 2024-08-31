import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './mes_demande.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom';

const MesDemandes = () => {
  const [demandes, setDemandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDemande, setCurrentDemande] = useState<any | null>(null);
  const navigate = useNavigate();  

  const VITE_URL_API = import.meta.env.VITE_URL_API;
  
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
    const fetchDemandes = async () => {
      if (!userId) {
        setError("Impossible de récupérer l'ID utilisateur.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${VITE_URL_API}/getUserDemandes/${userId}`);
        setDemandes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des demandes.');
        setLoading(false);
      }
    };

    fetchDemandes();
  }, [userId]);

  // Fonction pour supprimer une demande
  const handleDelete = async (demandeId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      try {
        await axios.delete(`${VITE_URL_API}/demandes/${demandeId}`);
        setDemandes(demandes.filter(demande => demande.id !== demandeId));
      } catch (error) {
        console.error('Erreur lors de la suppression de la demande', error);
      }
    }
  };

  // Fonction pour éditer une demande
  const handleEdit = (demande: any) => {
    setIsEditing(true);
    setCurrentDemande(demande); // On remplit le formulaire avec les infos de la demande actuelle
  };
  const handleSeeMoreDemandes = () => {
    navigate('/demande'); // Redirection vers la page des événements
  };

  const handleSaveEdit = async () => {
    if (!currentDemande || !currentDemande.id) {
      console.error("Aucune demande sélectionnée pour la modification.");
      return;
    }
  
    try {
      // Assure-toi que l'URL est correcte
      const response = await axios.patch(`${VITE_URL_API}/demandes/${currentDemande.id}`, currentDemande);
      
      if (response.status === 200) {
        // Mise à jour réussie
        setIsEditing(false);
        setCurrentDemande(null);
  
        // Met à jour la liste des demandes après la modification
        const updatedDemandes = demandes.map((demande) =>
          demande.id === currentDemande.id ? currentDemande : demande
        );
        setDemandes(updatedDemandes);
      } else {
        console.error('Erreur lors de la modification : ', response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la demande', error);
    }
  };
  

  if (loading) {
    return <p>Chargement des demandes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="demandes-container">
      <h1>Mes Demandes</h1>
      {demandes.length > 0 ? (
        <div className="demandes-list">
          {demandes.map((demande) => (
            <div key={demande.id} className="demande-card">
              <h2>{demande.titre}</h2>
              <p>{demande.description}</p>
              <p><strong>Budget:</strong> {demande.budget} €</p>
              <p><strong>Deadline:</strong> {new Date(demande.deadline).toLocaleDateString()}</p>
              <p><strong>Statut:</strong> <span className={`statut ${demande.statut}`}>{demande.statut}</span></p>
              <div className="action-buttons">
                <FontAwesomeIcon 
                  icon={faEdit} 
                  className="edit-icon" 
                  onClick={() => handleEdit(demande)} 
                />
                <FontAwesomeIcon 
                  icon={faTrash} 
                  className="delete-icon" 
                  onClick={() => handleDelete(demande.id)} 
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune demande trouvée.</p>
      )}

      {/* Formulaire d'édition */}
      {isEditing && currentDemande && (
        <div className="edit-form">
          <h2>Modifier la demande</h2>
          <form>
            <label>Titre</label>
            <input 
              type="text" 
              value={currentDemande.titre} 
              onChange={(e) => setCurrentDemande({ ...currentDemande, titre: e.target.value })} 
            />
            <label>Description</label>
            <textarea 
              value={currentDemande.description} 
              onChange={(e) => setCurrentDemande({ ...currentDemande, description: e.target.value })} 
            />
            <label>Budget</label>
            <input 
              type="number" 
              value={currentDemande.budget} 
              onChange={(e) => setCurrentDemande({ ...currentDemande, budget: e.target.value })} 
            />
            <label>Deadline</label>
            <input 
              type="date" 
              value={currentDemande.deadline} 
              onChange={(e) => setCurrentDemande({ ...currentDemande, deadline: e.target.value })} 
            />
            <button type="button" onClick={handleSaveEdit}>Sauvegarder</button>
          </form>
        </div>
      )}

       {/* Bouton pour voir d'autres événements */}
       <button onClick={handleSeeMoreDemandes} className="see-more-demande-btn">
        Cree une nouvelle demande 
      </button>
    </div>
  );
};

export default MesDemandes;
