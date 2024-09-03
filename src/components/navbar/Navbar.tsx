import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext/AuthContext'; // Assurez-vous que le chemin est correct

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext); // Récupérez l'état et les actions du contexte
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/">Accueil</NavLink>
        </li>
        
        {isAuthenticated ? (
          <>
            <li>
            <NavLink to="/mes-reservations">Nos événements</NavLink>
            </li>
            <li>
            <NavLink to="/mes-demandes">Mes Demande</NavLink>
            </li>
            <li>
            <NavLink to="/mes-dons">Mes Dons</NavLink>
            </li>
      
            <li>
           
            <NavLink to="/contact">contact</NavLink>
            </li>

          </>
        ) : (
          <>
          <li>
           <NavLink to="/events">Nos événements</NavLink>
          </li>
          <li>
          <NavLink to="/demande">Demande</NavLink>
          
          </li>
          <li>
           <NavLink to="/don">Don</NavLink>
          </li>
          <li>
           <NavLink to="/contact">contact</NavLink>
          </li>
          </>

        )}
     
     
         {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/profil">Profil ({user?.name})</NavLink>
            </li>
            <li>
              <button onClick={handleLogout}>Déconnexion</button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/signUp&Login">Connexion</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
