import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';import Header from './componentes/Header';
import SellForm from './componentes/SellForm';
import Publications from './componentes/Publications';
import Login from './componentes/Login';
import MyPublications from './componentes/MyPublications';
import FavoritePublications from './componentes/FavoritePublications';
import PublicationDetail from './componentes/PublicationDetails';
import { auth } from './firebase';
import Home from './componentes/Home';
import Register from './componentes/Register';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Lógica adicional después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión', error.message);
      // Manejar el error de cierre de sesión
    }
  };

  return (
    <Router>
      <div>
        {/* Header siempre visible, independientemente de la ruta */}
        <Header user={user} handleLogout={handleLogout} />

        <Routes>
          {/* Página principal - Redirecciona a /login si no está autenticado */}
          <Route
            path="/"
            element={user ? <Navigate to="/publications" /> : <Navigate to="/home" />}
          />

          {/* Resto de las rutas */}
          <Route path="/home" element={<Home />} />
          <Route path="/sell" element={<SellForm />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-publications" element={<MyPublications />} />
          <Route path="/favorite-publications" element={<FavoritePublications />} />
          <Route path="/publication/:id" element={<PublicationDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
