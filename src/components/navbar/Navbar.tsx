import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Accueil
          </NavLink>
        </li>
        <li>
          <NavLink to="/events" className={({ isActive }) => (isActive ? "active" : "")}>
            Nos événements
          </NavLink>
        </li>
        <li>
          <NavLink to="/demande" className={({ isActive }) => (isActive ? "active" : "")}>
            Demande
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink to="/signUp&Login" className={({ isActive }) => (isActive ? "active" : "")}>
            Connexion
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
