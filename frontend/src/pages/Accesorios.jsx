import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Accesorios({ currency }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch('http://localhost:8080/api/productos')
      .then(res => res.json())
      .then(data => {
        const accesorios = data.filter(
          producto =>
            producto.categoria &&
            producto.categoria.trim().toLowerCase() === 'accesorios'
        );

        setProductos(accesorios);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error cargando accesorios:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1>Accesorios y Juguetes</h1>
        <p>
          Todo lo necesario para la diversión, el paseo y el descanso de tu mejor amigo.
        </p>
      </div>

      {loading ? (
        <p>Cargando accesorios...</p>
      ) : productos.length === 0 ? (
        <p>No hay accesorios disponibles.</p>
      ) : (
        <div className="product-grid">
          {productos.map(product => (
            <div key={product.id} className="product-card">
              {product.imagen ? (
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="product-image"
                />
              ) : (
                <div className="product-image-placeholder">🐾</div>
              )}

              <div className="product-info">
                <span className="product-tag">Accesorio</span>

                <h3>{product.nombre}</h3>

                <p>Producto disponible en tienda PetZone</p>

                <div className="product-bottom">
                  <span className="price">
                    {currency.code} {product.precio}
                  </span>

                  <button
                    onClick={() => addToCart(product)}
                    className="button button-primary btn-small"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="page-navigation">
        <Link to="/" className="button button-secondary">
          ← Volver al Inicio
        </Link>
      </div>
    </div>
  );
}