// src/pages/PublicationDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';

const PublicationDetails = () => {
  const { id } = useParams();
  const [publication, setPublication] = useState(null);

  useEffect(() => {
    // Obtener detalles de la publicación desde Firestore
    const fetchPublicationDetails = async () => {
      try {
        const publicationDoc = await db.collection('publications').doc(id).get();
        if (publicationDoc.exists) {
          setPublication({ id: publicationDoc.id, ...publicationDoc.data() });
        } else {
          console.log('La publicación no existe');
        }
      } catch (error) {
        console.error('Error al obtener detalles de la publicación', error);
      }
    };

    fetchPublicationDetails();
  }, [id]);

  return (
    <div className="container mt-5">
      {publication ? (
        <div>
          <h2>{publication.productName}</h2>
          <p>{publication.productDescription}</p>
          <p>Valor: {publication.productValue} {publication.currency}</p>
          {/* Otros detalles de la publicación... */}
        </div>
      ) : (
        <p>Cargando detalles de la publicación...</p>
      )}
    </div>
  );
};

export default PublicationDetails;
