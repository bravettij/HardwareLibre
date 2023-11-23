import React, { useEffect, useState } from "react";
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import {collection, addDoc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

function SellForm(){
    const [productName, setProductName] = useState('');
    const [productType, setProductType] = useState('CPU');
    const [image,setImage] =useState('')
    const [imageUrl,setImageUrl] =useState([])
    const [description, setDescription] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [value, setValue] = useState('');
    const [currency, setCurrency] = useState('ARS');
    const productCollection = collection (db, "publications")

    const navigate = useNavigate();

    const userId = auth.currentUser.uid;

     const handleClick = () =>{
      if(image !==null){
         const imgRef =  ref(storage,`files/${v4()}`)
         uploadBytes(imgRef,image).then(value=>{
             console.log(value)
             getDownloadURL(value.ref).then(url=>{
                 setImageUrl(data=>[...data,url])
             })
         })
      }
     }
    const handleFormSubmit = async (e) => {
      e.preventDefault();
          
          const postData = {
            productName,
            productType,
            imageUrl,
            description,
            contactNumber,
            value,
            currency,
            userId,
          };
          // Guardar postData en Firestore
          //await db.collection('publicaciones').add(postData);
          await addDoc(productCollection, postData)
           //Limpia los campos después de enviar el formulario
          setProductName('');
          setProductType('CPU');
           setImage(null);
          setDescription('');
          setContactNumber('');
          setValue('');
          setCurrency('ARS');
          navigate("/publications")
    };

    return(
      <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleFormSubmit}>
            {/* Campos del formulario */}
            <div className="mb-3">
              <label htmlFor="productName" className="form-label">Nombre del Producto:</label>
              <input
                type="text"
                className="form-control"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="productType" className="form-label">Tipo de Producto:</label>
              <select
                className="form-select"
                id="productType"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                required
              >
                <option value="" disabled>Selecciona un tipo</option>
                <option value="CPU">CPU</option>
                <option value="Motherboard">Motherboard</option>
                <option value="RAM">RAM</option>
                <option value="Placa de video">Placa de video</option>
                <option value="Fuente de alimentación">Fuente de alimentación</option>
                <option value="Coolers">Coolers</option>
                <option value="Gabinetes">Gabinetes</option>
                <option value="Periféricos">Periféricos</option>
              </select>
            </div>
             <div className="mb-3">
                  <label className="form-label">Cargar imagen</label>
                  <input type="file" className="form-control" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
            <button onClick={handleClick}>Upload</button> 
            <div className="mb-3">
              <label htmlFor="productDescription" className="form-label">Descripción del Producto:</label>
              <textarea
                className="form-control"
                id="productDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contactNumber" className="form-label">Número de Contacto:</label>
              <input
                type="text"
                className="form-control"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="productValue" className="form-label">Valor:</label>
              <input
                type="text"
                className="form-control"
                id="productValue"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="currency" className="form-label">Moneda:</label>
              <select
                className="form-select"
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Crear Publicación
            </button>
          </form>
        </div>
      </div>
      <div className="mb-5"></div>
    </div>
  );
};
export default SellForm;