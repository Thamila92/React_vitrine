import React from 'react';
import './Contact.css'; // Crée un fichier CSS pour le style

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contactez-nous</h1>
      <form>
        <label>Nom:</label>
        <input type="text" placeholder="Votre nom" />

        <label>Email:</label>
        <input type="email" placeholder="Votre email" />

        <label>Message:</label>
        <textarea placeholder="Votre message"></textarea>

        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default Contact;
