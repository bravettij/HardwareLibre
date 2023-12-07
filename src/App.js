import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './componentes/Header';
import SellForm from './componentes/SellForm';
import Publications from './componentes/Publications';
import Login from './componentes/Login';
import MyPublications from './componentes/MyPublications';
import FavoritePublications from './componentes/FavoritePublications';
import { auth } from './firebase';
import Home from './componentes/Home';
import Register from './componentes/Register';
import PageNotFound from './componentes/PageNotFound';
import Footer from './componentes/Footer';

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
      <div style={{ minHeight: '87vh' }}>
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
          <Route path="/login" element={user ? <Navigate to="/publications" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/publications" /> : <Register />} />
          <Route path="*" element={<PageNotFound/>} />
          {/* Rutas protegidas */}
          <Route path="/sell" element={!user ? <Navigate to="/login" /> : <SellForm />} />
          <Route path="/publications" element={!user ? <Navigate to="/login" /> : <Publications/>} />
          <Route path="/my-publications" element={!user ? <Navigate to="/login" /> : <MyPublications />} />
          <Route path="/favorite-publications" element={!user ? <Navigate to="/login" /> : <FavoritePublications />} />
        </Routes>
        <div style={{ marginBottom: '20px' }}></div>
      </div>
        <Footer/>
    </Router>
  );
};

export default App;
