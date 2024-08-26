import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { AuthContext } from '../../AuthContext/AuthContext'; // Assurez-vous que le chemin est correct

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const authContext = useContext(AuthContext); // Récupérez le contexte

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authContext && authContext.login) { // Vérifiez si le contexte est disponible
      try {
        const response = await axios.post(`${import.meta.env.VITE_URL_API}/login`, { email, password });
        const user = response.data.user;
        
        authContext.login(user); // Appelez la fonction login du contexte
        navigate('/'); // Redirigez vers la page d'accueil après connexion
      } catch (error) {
        console.error('Erreur lors de la connexion', error);
        alert('Erreur lors de la connexion.');
      }
    } else {
      console.error('Le contexte d\'authentification est introuvable');
    }
  };

  return (
    <div className="login-container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          required
        />

        <label>Mot de passe:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Votre mot de passe"
          required
        />

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
