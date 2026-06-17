import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart({ currency }) {
  const {
    cart,
    removeFromCart,
    getCartTotal,
    clearCart,
    addToCart,
    decreaseQuantity,
    cartMessage,
    setCartMessage,
  } = useContext(CartContext);
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);
  const [mensaje, setMensaje] = useState({ type: '', text: '' });
  const [procesando, setProcesando] = useState(false);

  React.useEffect(() => {
    setCartMessage('');
  }, []);

  React.useEffect(() => {
    if (cartMessage) {
      setMensaje({ type: 'error', text: cartMessage });
    }
  }, [cartMessage]);

  const handleIncrease = (item) => {
    setMensaje({ type: '', text: '' });
    setCartMessage('');
    if (item.quantity >= (item.stock ?? 0)) {
      setMensaje({ type: 'error', text: 'No hay suficiente stock disponible.' });
      return;
    }
    addToCart(item);
  };

  const handleDecrease = (item) => {
    setMensaje({ type: '', text: '' });
    setCartMessage('');
    if (item.quantity <= 1) return;
    decreaseQuantity(item.id);
  };

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const descontarStock = async () => {
    for (const item of cart) {
      const response = await fetch(
        `http://localhost:8082/productos/${item.id}/descontar-stock`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cantidad: item.quantity || 1,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || `No se pudo actualizar stock de ${item.nombre}`);
      }
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    setMensaje({ type: '', text: '' });
    setProcesando(true);

    try {
      await descontarStock();

      setSuccess(true);

      setTimeout(() => {
        clearCart();
        setSuccess(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error(error);

      setMensaje({
        type: 'error',
        text: error.message || 'No se pudo finalizar la compra',
      });
    } finally {
      setProcesando(false);
    }
  };

  if (success) {
    return (
      <div className="page-container fade-in">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>¡Pago Exitoso!</h2>
          <p>Tu orden ha sido procesada correctamente. El stock fue actualizado.</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="page-container fade-in">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p>¡Explora nuestra tienda y encuentra todo para tu mascota!</p>
          <Link to="/" className="button button-primary">Continuar Comprando</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="cart-layout">
        <div className="cart-items-section">
          <h2>
            Carrito de Compras ({cart.length} {cart.length === 1 ? 'producto' : 'productos'})
          </h2>

          {mensaje.text && (
            <div className={`message-alert message-${mensaje.type}`}>
              {mensaje.type === 'success' && '✓ '}
              {mensaje.type === 'error' && '✕ '}
              {mensaje.text}
            </div>
          )}

          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.imagen ? (
                    <img
                      src={item.imagen}
                      alt={item.nombre || item.servicio}
                      className="cart-product-image"
                    />
                  ) : (
                    '🐾'
                  )}
                </div>

                <div className="cart-item-details">
                  <h3>{item.nombre || item.servicio}</h3>
                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() => handleDecrease(item)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleIncrease(item)}
                      className="quantity-btn"
                      disabled={item.quantity >= (item.stock ?? 0)}
                    >
                      +
                    </button>
                  </div>
                  <p>Stock disponible: {item.stock ?? 0} unidades</p>

                  {(item.stock ?? 0) <= 0 && (
                    <span className="product-soldout">Agotado</span>
                  )}
                </div>

                <div className="cart-item-price">
                  <span>
                    {currency?.code || 'USD'} {(parseFloat(item.precio) * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-checkout-section">
          <div className="checkout-summary">
            <h3>Resumen de la Orden</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{currency?.code || 'USD'} {getCartTotal().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Envío</span>
              <span>Gratis</span>
            </div>

            <div className="summary-row total">
              <span>Total a Pagar</span>
              <span>{currency?.code || 'USD'} {getCartTotal().toFixed(2)}</span>
            </div>
          </div>

          <form className="payment-form" onSubmit={handleCheckout}>
            <h3>Método de Pago</h3>

            <div className="form-group">
              <label>Número de Tarjeta</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleChange}
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                required
              />
            </div>

            <div className="form-group">
              <label>Nombre en la Tarjeta</label>
              <input
                type="text"
                name="cardName"
                value={paymentData.cardName}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vencimiento</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/AA"
                  maxLength="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="button button-primary block-button"
              disabled={procesando}
            >
              {procesando
                ? 'Procesando...'
                : `Pagar ${currency?.code || 'USD'} ${getCartTotal().toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}