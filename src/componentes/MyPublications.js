import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, getCurrentUser, auth} from '../firebase'; // Asegúrate de importar tu instancia de Firebase configurada
import {  Modal } from 'bootstrap';
import { deleteDoc, doc } from 'firebase/firestore';

const MyPublications = () => {
  const [misPublicaciones, setMisPublicaciones] = useState([]);
  const usuarioActual = getCurrentUser(); // Asume que tienes una función para obtener el usuario actual
  const [detalle, setDetalle] = useState(null);
  const [publicacionAEliminar, setPublicacionAEliminar] = useState(null);

  useEffect(() => {
    const obtenerMisPublicaciones = async () => {
      if (usuarioActual) {
        const publicacionesQuery = query(
          collection(db, 'publications'),
          where('userId', '==', auth.currentUser.uid)
        );
        const publicacionesSnapshot = await getDocs(publicacionesQuery);

        const misPublicaciones = publicacionesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        
        setMisPublicaciones(misPublicaciones);
      }
    };
    
    obtenerMisPublicaciones();
  }, [usuarioActual]);
  
  const mostrarDetalle = (dato) => {
    setDetalle(dato);
    const modal = new Modal(document.getElementById('detalleModal'));
    modal.show();
  };


  const eliminarPublicacion = async (publicacionId) => {
    // Muestra una ventana de confirmación
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta publicación?');

    if (confirmacion) {
      try {
        await deleteDoc(doc(db, 'publications', publicacionId));
        setDetalle(null); // Cierra el modal de detalle después de la eliminación
        setPublicacionAEliminar(null); // Limpia la variable después de la eliminación
      } catch (error) {
        console.error('Error al eliminar la publicación', error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1>Mis Publicaciones</h1>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {misPublicaciones.map(publicacion => (
          <div key={publicacion.id} className="col">
            <div className="card h-100" onClick={() => mostrarDetalle(publicacion)}>
              <img
                src={publicacion.imageUrl}
                className="card-img-top img-fluid"
                alt="Producto"
                style={{ objectFit: 'cover', maxHeight: '70%' , minHeight: '70%' }}
              />
              <div className="card-body">
                <h5 className="card-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {publicacion.productName}
                </h5>
                <p className="card-text">Valor: {publicacion.value}</p>
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
                  <p><strong>Descripción:</strong> {detalle.description}</p>
                  <p><strong>Tipo de Producto:</strong> {detalle.productType}</p>
                  <p><strong>Valor:</strong> {detalle.value}</p>
                  <button type="button" className="btn btn-danger" onClick={() => eliminarPublicacion(detalle.id)}>
                    Eliminar Publicación
                  </button>
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

export default MyPublications;
