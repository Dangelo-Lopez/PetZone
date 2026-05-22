import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const pricingServices = [
  { weight: 'Menos de 5 kg', basic: 25.00, premium: 40.00 },
  { weight: 'Entre 5 kg y 15 kg', basic: 35.00, premium: 55.00 },
  { weight: 'Entre 15 kg y 25 kg', basic: 45.00, premium: 70.00 },
  { weight: 'Más de 25 kg', basic: 60.00, premium: 90.00 },
];

export default function Cuidado({ currency }) {
  const { addToCart } = useContext(CartContext);
  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1>Peluquería y Cuidado Canino/Felino</h1>
        <p>Servicios de spa, higiene y peluquería profesional para que tu mascota brille.</p>
      </div>

      <div className="care-services-grid">
        <div className="care-card">
          <div className="care-icon">🫧</div>
          <h3>Paquete Básico</h3>
          <ul className="care-includes">
            <li>✓ Baño con champú natural</li>
            <li>✓ Secado rápido</li>
            <li>✓ Cepillado inicial</li>
            <li>✓ Limpieza superficial de oídos</li>
          </ul>
        </div>
        <div className="care-card premium-card">
          <div className="care-icon">✂️</div>
          <h3>Paquete Premium (Spa)</h3>
          <ul className="care-includes">
            <li>✓ Todo lo del paquete Básico</li>
            <li>✓ Corte de pelo / Styling a tijera</li>
            <li>✓ Corte y limado de uñas</li>
            <li>✓ Limpieza profunda de oídos y glándulas</li>
            <li>✓ Perfume hipoalergénico especial</li>
          </ul>
        </div>
      </div>

      <div className="pricing-section">
        <h2>Tarifas por peso de mascota</h2>
        <div className="table-responsive">
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Peso de la Mascota</th>
                <th>Paquete Básico</th>
                <th>Paquete Premium</th>
              </tr>
            </thead>
            <tbody>
              {pricingServices.map((tier, idx) => (
                <tr key={idx}>
                  <td>{tier.weight}</td>
                  <td>
                    {currency.code} {tier.basic.toFixed(2)}
                    <button onClick={() => addToCart({ id: `basic-${idx}`, nombre: `Peluquería Básico - ${tier.weight}`, precio: tier.basic })} className="button button-secondary btn-small" style={{marginLeft: '10px', fontSize: '0.75rem', padding: '4px 8px'}}>Añadir</button>
                  </td>
                  <td>
                    <strong>{currency.code} {tier.premium.toFixed(2)}</strong>
                    <button onClick={() => addToCart({ id: `premium-${idx}`, nombre: `Spa Premium - ${tier.weight}`, precio: tier.premium })} className="button button-primary btn-small" style={{marginLeft: '10px', fontSize: '0.75rem', padding: '4px 8px'}}>Añadir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="note">* El precio puede variar ligeramente dependiendo de la agresividad, estado del manto (nudos) y requerimientos médicos de la mascota.</p>
      </div>

      <div className="page-navigation">
        <Link to="/" className="button button-secondary">← Volver al Inicio</Link>
      </div>
    </div>
  );
}
