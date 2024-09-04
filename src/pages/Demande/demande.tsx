import React, { useState } from 'react';
import axios from 'axios';
import './demande.css';
import emailjs from 'emailjs-com';

interface FormData {
  email: string;
  nom: string;
  prenom: string;
  age: string;
  phone: string;
  profession: string;
  titre: string;
  description: string;
  budget: string;
  deadline: string;
}

const Demande: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    nom: '',
    prenom: '',
    age: '',
    phone: '',
    profession: '',
    titre: '',
    description: '',
    budget: '',
    deadline: ''
  });

  const VITE_URL_API = import.meta.env.VITE_URL_API;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const sendConfirmationEmail = (formData: FormData) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_OTHER;
    const userId = import.meta.env.VITE_EMAILJS_USER_ID;
    const messageContent = `
      Bonjour ${formData.nom} ${formData.prenom},

      Nous accusons réception de votre demande concernant le projet "${formData.titre}".

      Nous traiterons votre demande dans les plus brefs délais et reviendrons vers vous si nous avons besoin de plus d'informations.

      Détails de votre demande :
      - Description : ${formData.description}
      - Budget estimé : ${formData.budget}€
      - Deadline : ${formData.deadline}

      Merci de votre confiance.

      Cordialement,
      L'équipe de gestion des demandes
    `;

    emailjs.send(
      serviceId,
      templateId,
      {
        to_name: `${formData.nom} ${formData.prenom}`, // Nom complet de l'utilisateur
        from_subject: `Accusé de réception de votre demande`, // Sujet de l'email
        message: messageContent, // Contenu du message
        user_email: formData.email // Email du destinataire
      },
      userId
    )
    .then((result) => {
      console.log('Email envoyé avec succès:', result.text);
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi de l'email :", error.text);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    const deadlineDate = new Date(formData.deadline);

    if (deadlineDate > today) {
      try {
        await axios.post(`${VITE_URL_API}/demandes`, formData);
        alert('Demande envoyée avec succès !');
        sendConfirmationEmail(formData); // Appel pour envoyer l'email de confirmation
      } catch (error) {
        console.error("Erreur lors de l'envoi de la demande", error);
        alert("Erreur lors de l'envoi de la demande.");
      }
    } else {
      alert("La deadline doit être supérieure à la date d'aujourd'hui.");
    }
  };

  return (
    <div className="demande-container">
      <h1>Formulaire de demande</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" placeholder="Rentrer votre email" value={formData.email} onChange={handleChange} required />

        <label htmlFor="nom">Nom:</label>
        <input id="nom" type="text" placeholder="Rentrer votre nom" value={formData.nom} onChange={handleChange} required />

        <label htmlFor="prenom">Prénom:</label>
        <input id="prenom" type="text" placeholder="Rentrer votre prénom" value={formData.prenom} onChange={handleChange} required />

        <label htmlFor="age">Âge:</label>
        <input id="age" type="number" placeholder="Rentrer votre âge" value={formData.age} onChange={handleChange} min="0" required />

        <label htmlFor="phone">Numéro de téléphone:</label>
        <input id="phone" type="tel" placeholder="Rentrer votre numéro de téléphone" value={formData.phone} onChange={handleChange} required />

        <label htmlFor="profession">Profession:</label>
        <input id="profession" type="text" placeholder="Rentrer votre profession" value={formData.profession} onChange={handleChange} />

        <label htmlFor="titre">Titre:</label>
        <input id="titre" type="text" placeholder="Rentrer le titre de votre projet" value={formData.titre} onChange={handleChange} required />

        <label htmlFor="description">Description du projet:</label>
        <textarea id="description" placeholder="Décrivez votre projet" value={formData.description} onChange={handleChange} required></textarea>

        <label htmlFor="budget">Budget:</label>
        <input id="budget" type="number" placeholder="Budget estimé" value={formData.budget} onChange={handleChange} min="0" required />

        <label htmlFor="deadline">Deadline:</label>
        <input id="deadline" type="date" value={formData.deadline} onChange={handleChange} required />

        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default Demande;
