import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">404 - Página no encontrada</h2>
              <p className="text-center">
                Lo sentimos, la página que estás buscando no existe.
              </p>
              <div className="text-center">
                <Link to="/" className="btn btn-primary">
                  Ir a la página de inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
