import React from 'react';
import './SignUp.css'; // Crée un fichier CSS pour le style

const Signup = () => {
  return (
    <div className="signup-container">
      <h1>Créer un compte</h1>
      <form>
        <label>Nom:</label>
        <input type="text" placeholder="Votre nom" />

        <label>Email:</label>
        <input type="email" placeholder="Votre email" />

        <label>Mot de passe:</label>
        <input type="password" placeholder="Votre mot de passe" />

        <label>Confirmer le mot de passe:</label>
        <input type="password" placeholder="Confirmez votre mot de passe" />

        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Signup;
