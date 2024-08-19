import React from 'react';
import './Demande.css'; // Crée un fichier CSS pour le style

const Demande = () => {
  return (
    <div className="demande-container">
      <h1>Formulaire de demande</h1>
      <form>
        <label>Email:</label>
        <input type="email" placeholder="Rentrer votre email" />

        <label>Nom:</label>
        <input type="text" placeholder="Rentrer votre nom" />

        <label>Prénom:</label>
        <input type="text" placeholder="Rentrer votre prénom" />

        <label>Âge:</label>
        <input type="number" placeholder="Rentrer votre âge" />

        <label>Numéro de téléphone:</label>
        <input type="tel" placeholder="Rentrer votre numéro de téléphone" />

        <label>Profession:</label>
        <input type="text" placeholder="Rentrer votre profession" />

        <label>Titre:</label>
        <input type="text" placeholder="Rentrer le titre de votre projet" />

        <label>Description du projet:</label>
        <textarea placeholder="Décrivez votre projet"></textarea>

        <label>Budget:</label>
        <input type="number" placeholder="Budget estimé" />

        <label>Deadline:</label>
        <input type="date" />

        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default Demande;
