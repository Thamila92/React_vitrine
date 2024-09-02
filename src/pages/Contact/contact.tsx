import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import './contact.css';

const Contact: React.FC = () => {

  const form = useRef<HTMLFormElement>(null);

  // Fonction pour envoyer l'email
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.current) {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const userId = import.meta.env.VITE_EMAILJS_USER_ID;

      emailjs
        .sendForm(serviceId, templateId, form.current, userId)
        .then(
          (result) => {
            console.log(result.text);
            alert('Message envoyé avec succès !');
          },
          (error) => {
            console.log(error.text);
            alert('Erreur lors de l\'envoi du message, veuillez réessayer.');
          }
        );

      // Réinitialise le formulaire après l'envoi
      form.current.reset();
    }
  };

  return (
    <div className="contact-container">
      <h1>Contactez-nous</h1>
      <form ref={form} onSubmit={sendEmail}>
        <label>Nom:</label>
        <input type="text" name="user_name" placeholder="Votre nom" required />

        <label>Email:</label>
        <input type="email" name="user_email" placeholder="Votre email" required />

        <label>Message:</label>
        <textarea name="message" placeholder="Votre message" required></textarea>

        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default Contact;
