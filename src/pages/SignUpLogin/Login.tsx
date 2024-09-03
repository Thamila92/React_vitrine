import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { AuthContext } from '../../AuthContext/AuthContext';

interface Cotisation {
  id: number;
  date: string; // Utilisez 'Date' si vous traitez avec des objets Date directement
  // Autres propriétés de Cotisation
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authContext && authContext.login) {
      try {
        console.log("Tentative de connexion...");

        const response = await axios.post(`${import.meta.env.VITE_URL_API}/login`, { email, password });
        const user = response.data.user;
        
        console.log("Connexion réussie, utilisateur:", user);

        authContext.login(user);
        
        console.log("Récupération des cotisations pour l'utilisateur ID:", user.id);
        const cotisationsResponse = await axios.get(`${import.meta.env.VITE_URL_API}/cotisations/${user.id}`);
        const cotisations: Cotisation[] = cotisationsResponse.data;

        console.log("Cotisations récupérées:", cotisations);

        const latestCotisation = cotisations.reduce((latest: Cotisation, cotisation: Cotisation) => {
          const cotisationDate = new Date(cotisation.date);
          return cotisationDate > new Date(latest.date) ? cotisation : latest;
        }, cotisations[0]);

        console.log("Dernière cotisation:", latestCotisation);

        const expirationDate = new Date(latestCotisation.date);
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        console.log("Date d'expiration après ajout d'un an:", expirationDate);

        const currentDate = new Date();
        const isExpired = currentDate > expirationDate;

        console.log("Date actuelle:", currentDate);
        console.log("La cotisation est-elle expirée?", isExpired);

        if (isExpired || !expirationDate || !cotisations ) {
          console.log("Redirection vers la page de renouvellement de la cotisation...");
          navigate('/renew-subscription');
        } else {
          console.log("Redirection vers la page d'accueil...");
          navigate('/');
        }
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
        <Link to="/ForgotPassword">Mot de passe oublié ?</Link>
        <Link to="/signup">Vous n'avez pas encore de compte ? Créez-en un</Link>
      </div>
    </div>
  );
};

export default Login;
