import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart({ currency }) {
  const { cart, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      clearCart();
      setSuccess(false);
      navigate('/');
    }, 3000);
  };

  if (success) {
    return (
      <div className="page-container fade-in">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>¡Pago Exitoso!</h2>
          <p>Tu orden ha sido procesada correctamente. Recibirás un correo con los detalles.</p>
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
          <h2>Carrito de Compras ({cart.length} {cart.length === 1 ? 'producto' : 'productos'})</h2>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">🐾</div>
                <div className="cart-item-details">
                  <h3>{item.nombre || item.servicio}</h3>
                  <p>Cantidad: {item.quantity}</p>
                </div>
                <div className="cart-item-price">
                  <span>{currency?.code || 'USD'} {(parseFloat(item.precio) * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="remove-btn">Eliminar</button>
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
              <input type="text" name="cardNumber" value={paymentData.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" maxLength="19" required />
            </div>
            <div className="form-group">
              <label>Nombre en la Tarjeta</label>
              <input type="text" name="cardName" value={paymentData.cardName} onChange={handleChange} placeholder="Ej. Juan Pérez" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Vencimiento</label>
                <input type="text" name="expiryDate" value={paymentData.expiryDate} onChange={handleChange} placeholder="MM/AA" maxLength="5" required />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="text" name="cvv" value={paymentData.cvv} onChange={handleChange} placeholder="123" maxLength="4" required />
              </div>
            </div>
            
            <button type="submit" className="button button-primary block-button">
              Pagar {currency?.code || 'USD'} {getCartTotal().toFixed(2)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
