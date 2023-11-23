import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa el CSS de Bootstrap
import {  Modal } from 'bootstrap';


const Publications = () => {
  const [datos, setDatos] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [filtroProductType, setFiltroProductType] = useState(''); // Estado para almacenar el tipo de filtro

  useEffect(() => {
    const obtenerDatos = async () => {
      const datosCollection = collection(db, 'publications');
      const datosSnapshot = await getDocs(datosCollection);
      const datos = datosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setDatos(datos);
    };

    obtenerDatos();
  }, []);

  const mostrarDetalle = (dato) => {
    setDetalle(dato);
    const modal = new Modal(document.getElementById('detalleModal'));
    modal.show();
  };

  const filtrarPorProductType = (tipo) => {
    setFiltroProductType(tipo);
  };

  const filtrarDatos = () => {
    if (filtroProductType === '') {
      return datos;
    } else {
      return datos.filter(dato => dato.productType === filtroProductType);
    }
  };

  return (
    <div className="container mt-4">
      {/* Filtro por tipo de producto */}
  <div className="mb-3">
    <label htmlFor="filtroProductType" className="form-label">Filtrar por Tipo de Producto:</label>
    <select
      id="filtroProductType"
      className="form-select"
      onChange={(e) => filtrarPorProductType(e.target.value)}
      value={filtroProductType}
    >
      <option value="">Todos</option>
      <option value="CPU">CPU</option>
      <option value="Motherboard">Motherboard</option>
      <option value="RAM">RAM</option>
      <option value="Placa de video">Placa de video</option>
      <option value="Fuente de alimentación">Fuente de alimentación</option>
      <option value="Coolers">Coolers</option>
      <option value="Gabinetes">Gabinetes</option>
      <option value="Perifericos">Periféricos</option>
    </select>
  </div>

  {/* Lista de publicaciones filtradas */}
  <div className="row row-cols-1 row-cols-md-4 g-4">
    {filtrarDatos().map(dato => (
      <div key={dato.id} className="col">
        <div className="card h-100" onClick={() => mostrarDetalle(dato)}>
          <img
            src={dato.imageUrl}
            className="card-img-top img-fluid"
            alt="Producto"
            style={{ objectFit: 'cover', maxHeight: '70%' , minHeight: '70%' }}
          />
          <div className="card-body">
            <h5 className="card-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {dato.productName}
            </h5>
            <p className="card-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Valor: {dato.value} {dato.currency}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
   {/* Modal de Detalle */}
   <div className="modal" id="detalleModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Detalles de la Publicación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {detalle && (
                <>
                  <img src={detalle.imageUrl} className="img-fluid mb-3" alt="Producto Detalle" />
                  <p><strong>Nombre del Producto:</strong> {detalle.productName}</p>
                  <p><strong>Tipo de Producto:</strong> {detalle.productType}</p>
                  <p><strong>Descripción:</strong> {detalle.description}</p>
                  <p><strong>Contacto:</strong> <a href={`https://wa.me/${detalle.contactNumber}`} target="_blank" rel="noopener noreferrer">
                      Envíame un mensaje!
                    </a></p>
                  <p><strong>Valor:</strong> {detalle.value} {detalle.currency}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5"></div>
    </div>
  );
};


export default Publications;
