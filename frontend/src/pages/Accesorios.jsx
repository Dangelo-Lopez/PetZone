import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const accessoryProducts = [
  { id: 1, name: 'Correa Retráctil 5m', type: 'Perro', price: 22.99, img: '🦮', desc: 'Correa ergonómica con luz LED para paseos nocturnos.' },
  { id: 2, name: 'Cama Nube Relajante', type: 'Perro/Gato', price: 45.00, img: '🛌', desc: 'Cama extra suave y lavable para máximo confort.' },
  { id: 3, name: 'Rascador Árbol 3 Pisos', type: 'Gato', price: 85.50, img: '🐈', desc: 'Centro de juegos con plataformas y nido.' },
  { id: 4, name: 'Juguete Mordedor KONG', type: 'Perro', price: 14.99, img: '🦴', desc: 'Goma resistente para rellenar con snacks.' },
  { id: 5, name: 'Collar de Cuero Premium', type: 'Perro', price: 29.99, img: '🐕‍🦺', desc: 'Cuero genuino ajustable y muy duradero.' },
  { id: 6, name: 'Rueda de Ejercicio', type: 'Hámster/Conejo', price: 18.00, img: '🐹', desc: 'Rueda silenciosa para mantener activo a tu roedor.' },
];

export default function Accesorios({ currency }) {
  const { addToCart } = useContext(CartContext);
  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1>Accesorios y Juguetes</h1>
        <p>Todo lo necesario para la diversión, el paseo y el descanso de tu mejor amigo.</p>
      </div>

      <div className="product-grid">
        {accessoryProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-placeholder">{product.img}</div>
            <div className="product-info">
              <span className="product-tag">{product.type}</span>
              <h3>{product.name}</h3>
              <p>{product.desc}</p>
              <div className="product-bottom">
                <span className="price">{currency.code} {product.price.toFixed(2)}</span>
                <button onClick={() => addToCart({ ...product, nombre: product.name, precio: product.price })} className="button button-primary btn-small">Añadir</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="page-navigation">
        <Link to="/" className="button button-secondary">← Volver al Inicio</Link>
      </div>
    </div>
  );
}
