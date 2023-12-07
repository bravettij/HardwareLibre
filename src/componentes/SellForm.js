import React, { useEffect, useState } from "react";
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import {collection, addDoc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

function SellForm(){
    const [productName, setProductName] = useState('');
    const [productType, setProductType] = useState('CPU');
    const [image,setImage] =useState(null)
    const [imageUrl,setImageUrl] =useState([])
    const [description, setDescription] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [value, setValue] = useState('');
    const [currency, setCurrency] = useState('ARS');
    const [contactError, setContactError] = useState(false);
    const [valueError, setValueError] = useState(false);
    const [fileError, setFileError] = useState(false);
    const productCollection = collection (db, "publications")
    const navigate = useNavigate();
    const userId = auth.currentUser.uid;   

    useEffect(() => {
      // Si se selecciona una imagen, subirla automáticamente
      if (image) {
        uploadImage();
      }
    }, [image]);
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
  
    // Verificar que se haya seleccionado un archivo
    if (file) {
      // Verificar si es una imagen
      if (file.type.startsWith('image/')) {
        setImage(file);
        setFileError(false); // Limpiar el mensaje de error al seleccionar una imagen válida
      } else {
        // Mostrar un mensaje de alerta si el archivo no es una imagen
        window.alert("Por favor, selecciona un archivo de imagen válido.");
  
        // Vaciar el input de archivo restableciendo su valor a una cadena vacía
        e.target.value = "";
        setFileError(true);
      }
    } 
    };
  
    const uploadImage = () => {
      const imgRef = ref(storage, `files/${v4()}`);
      uploadBytes(imgRef, image)
        .then((value) => {
          getDownloadURL(value.ref).then((url) => {
            setImageUrl((data) => [...data, url]);
          });
        })
        .catch((error) => {
          console.error("Error al cargar la imagen:", error);
        });
    };

    const handleFormSubmit = async (e) => {
      e.preventDefault();

      // Validar el número de contacto
      if (contactNumber.startsWith('0') || contactNumber.startsWith('15')) {
        setContactError(true);
        return;
      }
      
      // Validar el campo de valor
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue) || parsedValue <= 0 || parsedValue > 9999999) {
        setValueError(true);
        return;
      }

      if (!imageUrl.length) {
        console.error("Por favor, carga una imagen.");
        setFileError(true);
        return;
      }
    
          
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
          setFileError(false); // Limpiar el mensaje de error al enviar el formulario
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
              <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" required/>
              {fileError && <div className="invalid-feedback">Por favor, selecciona un archivo de imagen válido.</div>}
            </div>
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
                className={`form-control ${contactError ? 'is-invalid' : ''}`}

                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
              {contactError && <div className="invalid-feedback">El número de contacto no puede comenzar con 0 ni 15.</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="value" className="form-label">Valor:</label>
              <input
                type="text"
                className={`form-control ${valueError ? 'is-invalid' : ''}`}
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              {valueError && <div className="invalid-feedback">El valor debe ser un número mayor que 0 y menor o igual a 9999999.</div>}

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