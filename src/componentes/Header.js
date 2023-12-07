import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { auth } from '../firebase';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };
  const handleLogout = async () => {
    try {
      // Lógica de cierre de sesión aquí (usando Firebase, por ejemplo)
      await auth.signOut();
  
      // Redirigir a la página de inicio después del cierre de sesión
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };
  const handleLoginClick = () => {
    if (user) {
      navigate('/my-publications');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="navbar navbar-expand-lg navbar-light bg-warning">
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={handleLogoClick}>
        <img src={'https://firebasestorage.googleapis.com/v0/b/tpfinalcui.appspot.com/o/HWLibre.jfif?alt=media&token=9d059c58-f8ca-4893-83d6-af4e25efa2ae'} alt="TuLogo" style={{ maxWidth: '50px', maxHeight: '50px' }} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/sell" className="nav-link">
                    Vender
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/publications" className="nav-link">
                    Publicaciones
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/my-publications" className="nav-link">
                    Mis Publicaciones
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="nav-link" onClick={handleLoginClick}>
                  Iniciar Sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Header;