import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { UseContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Login({ t }) {
  const [activeTab, setActiveTab] = useState('login');
  const { login, register } = useContext(UserContext);
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    direccion: '',
    telefono: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setMensaje('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      let result;

      if (activeTab === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setMensaje('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }
        result = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.direccion,
          formData.telefono
        );
      }

      if (result.success) {
        navigate('/');
      } else {
        setMensaje(result.message || 'Ocurrió un error');
      }
    } catch (error) {
      console.error(error);
      setMensaje('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setMensaje('');
                setShowPassword(false);
                setShowConfirmPassword(false);
              }}
            >
              Iniciar Sesión
            </button>

            <button
              type="button"
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('register');
                setMensaje('');
                setShowPassword(false);
                setShowConfirmPassword(false);
              }}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-header">
              <h2>
                {activeTab === 'login'
                  ? 'Bienvenido a PetZone'
                  : 'Crea tu cuenta'}
              </h2>

              <p>
                {activeTab === 'login'
                  ? 'Ingresa para continuar tus compras y reservar servicios.'
                  : 'Regístrate rápidamente y accede a beneficios exclusivos.'}
              </p>
            </div>

            {activeTab === 'register' && (
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@correo.com"
                required
              />
            </div>

            {activeTab === 'register' && (
              <>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej. +56 9 1234 5678"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Ej. Av. Siempre Viva 123"
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <img
                    src={showPassword ? "/public/ojo-abierto.png" : "/public/ojo-cerrado.png"}
                    alt="Mostrar contraseña"
                    style={{
                      width: "22px",
                      height: "22px",
                      filter: isDark ? "invert(1)" : "none",
                    }}
                  />
                </button>
              </div>
            </div>

            {activeTab === 'register' && (
              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <img
                      src={showConfirmPassword ? "/public/ojo-abierto.png" : "/public/ojo-cerrado.png"}
                      alt="Mostrar contraseña"
                      style={{
                        width: "22px",
                        height: "22px",
                        filter: isDark ? "invert(1)" : "none",
                      }}
                    />
                  </button>
                </div>
              </div>
            )}

            {mensaje && (
              <p className="auth-message-error">
                {mensaje}
              </p>
            )}

            <button
              type="submit"
              className="button button-primary auth-submit"
              disabled={loading}
            >
              {loading
                ? 'Procesando...'
                : activeTab === 'login'
                  ? 'Ingresar'
                  : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}