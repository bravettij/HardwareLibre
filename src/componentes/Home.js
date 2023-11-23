import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="text-center">
            <h1 className="mb-4">Bienvenidos a Hardware Libre</h1>
            <h4 className="mb-4">
              Donde encontrarás el mejor hardware usado de Argentina{' '}
            </h4>
            <img src={"https://firebasestorage.googleapis.com/v0/b/tpfinalcui.appspot.com/o/pc%20comp.jpg?alt=media&token=60ff5e87-9b70-4456-b498-1ea6fefdbe5c"} />

            <p className="mb-4">¡Regístrate o inicia sesión para explorar nuestro marketplace!</p>
            <Link to="/login" className="btn btn-primary">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;