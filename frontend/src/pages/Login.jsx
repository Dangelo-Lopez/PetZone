import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Login({ t }) {
  const [activeTab, setActiveTab] = useState('login');
  const { login, register } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'login') {
      login(formData.email, formData.password);
    } else {
      register(formData.name, formData.email, formData.password);
    }
    navigate('/');
  };

  return (
    <div className="page-container fade-in">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Iniciar Sesión
            </button>
            <button
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-header">
              <h2>{activeTab === 'login' ? 'Bienvenido a PetZone' : 'Crea tu cuenta'}</h2>
              <p>{activeTab === 'login' ? 'Ingresa para continuar tus compras y ver tus pedidos.' : 'Regístrate rápidamente y accede a beneficios exclusivos.'}</p>
            </div>

            {activeTab === 'register' && (
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" required />
              </div>
            )}
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="tu@correo.com" required />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
            </div>

            <button type="submit" className="button button-primary auth-submit">
              {activeTab === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
