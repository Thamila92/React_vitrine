import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // Crée un fichier CSS pour le style

const Login = () => {
  return (
    <div className="login-container">
      <h1>Connexion</h1>
      <form>
        <label>Email:</label>
        <input type="email" placeholder="Votre email" />

        <label>Mot de passe:</label>
        <input type="password" placeholder="Votre mot de passe" />

        <button type="submit">Se connecter</button>
      </form>

      <div className="extra-links">
        <Link to="/forgot-password">Mot de passe oublié ?</Link>
        <Link to="/signup">Vous n'avez pas encore de compte ? Créez-en un</Link>
      </div>
    </div>
  );
};

export default Login;
