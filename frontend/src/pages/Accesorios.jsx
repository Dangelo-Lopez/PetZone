import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Accesorios({ currency }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch("http://localhost:8082/productos")
      .then(res => res.json())
      .then(data => {
        const accesorios = data.filter(
          producto =>
            producto.categoria &&
            producto.categoria?.toLowerCase() === 'accesorios'
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
            <div
              key={product.id}
              className={`product-card ${(product.stock ?? 0) <= 0 ? 'product-card-out' : ''}`}
            >
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
                  <div className="price-stock-container">
                    <span className="price">
                      {currency.code} {product.precio}
                    </span>
                    {(product.stock ?? 0) > 5 ? (
                      <span className="product-stock stock-high">
                        Stock disponible: {product.stock} unidades
                      </span>
                    ) : (product.stock ?? 0) > 0 ? (
                      <span className="product-stock stock-low">
                        ¡Quedan solo {product.stock} unidades!
                      </span>
                    ) : (
                      <span className="product-stock stock-empty">
                        Producto agotado
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className={`button button-primary btn-small ${(product.stock ?? 0) <= 0 ? 'btn-disabled' : ''}`}
                    disabled={(product.stock ?? 0) <= 0}
                  >
                    {(product.stock ?? 0) <= 0 ? 'Agotado' : 'Añadir'}
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