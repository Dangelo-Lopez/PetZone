import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [mensaje, setMensaje] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
    fotoPerfil: user?.fotoPerfil || '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setMensaje({ type: '', text: '' });

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFotoUpload = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  try {
    const formDataFoto = new FormData();

    formDataFoto.append('file', file);

    const response = await fetch(
      `http://localhost:8081/auth/usuarios/${user.id}/foto`,
      {
        method: 'POST',
        body: formDataFoto,
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem(
        'petzone-user',
        JSON.stringify(data.user)
      );

      setMensaje({
        type: 'success',
        text: 'Foto actualizada correctamente',
      });

      window.location.reload();
    } else {
      setMensaje({
        type: 'error',
        text: data.message,
      });
    }
  } catch (error) {
    console.error(error);

    setMensaje({
      type: 'error',
      text: 'Error al subir la imagen',
    });
  }
};

  const actualizarUsuarioLocal = (usuarioActualizado) => {
    localStorage.setItem('petzone-user', JSON.stringify(usuarioActualizado));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMensaje({ type: '', text: '' });

    if (!formData.nombre.trim()) {
      setMensaje({ type: 'error', text: 'El nombre no puede estar vacío' });
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setMensaje({ type: 'error', text: 'El correo no puede estar vacío' });
      setLoading(false);
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMensaje({ type: 'error', text: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/auth/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
          fotoPerfil: formData.fotoPerfil,
          password: formData.newPassword || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        actualizarUsuarioLocal(data.user);

        setMensaje({
          type: 'success',
          text: 'Perfil actualizado correctamente',
        });

        setIsEditing(false);

        setTimeout(() => {
          window.location.reload();
        }, 700);
      } else {
        setMensaje({
          type: 'error',
          text: data.message || 'No se pudo actualizar el perfil',
        });
      }
    } catch (error) {
      console.error(error);

      setMensaje({
        type: 'error',
        text: 'Error al conectar con el servidor',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fotoPerfil =
    user?.fotoPerfil && user.fotoPerfil.trim() !== ''
      ? user.fotoPerfil
      : null;

  if (!user) {
    return (
      <div className="page-container fade-in">
        <div className="profile-not-logged">
          <div className="profile-card">
            <div className="profile-empty-icon">👤</div>
            <h2>No estás logeado</h2>
            <p>Inicia sesión para ver tu perfil</p>

            <button
              className="button button-primary"
              onClick={() => navigate('/login')}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal y configuración</p>
      </div>

      <div className="profile-panel">
        <div className="profile-layout">
          {!isEditing && (
          <div className="profile-info-card">
            <div className="profile-info-header">
              <div className="profile-avatar-display">
                {fotoPerfil ? (
                  <img
                      src={user.fotoPerfil}
                      alt={user.nombre}
                      className="avatar-image"
                    />
                ) : (
                  <div className="avatar-emoji">👤</div>
                )}
              </div>

              <div className="profile-info-text">
                <h2>{user.nombre}</h2>

                <p className="profile-role">
                  <span className="role-badge">{user.rol || 'USER'}</span>
                </p>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Correo Electrónico</span>
                <span className="detail-value">{user.email}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Teléfono</span>
                <span className="detail-value">
                  {user.telefono || 'No registrado'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Dirección</span>
                <span className="detail-value">
                  {user.direccion || 'No registrada'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">ID Usuario</span>
                <span className="detail-value">#{user.id}</span>
              </div>

              <div className="detail-item full-width">
                <span className="detail-label">Rol del sistema</span>
                <span className="detail-value">{user.rol || 'USER'}</span>
              </div>
            </div>

            {mensaje.text && (
              <div className={`message-alert message-${mensaje.type}`}>
                {mensaje.type === 'success' && '✓ '}
                {mensaje.type === 'error' && '✕ '}
                {mensaje.text}
              </div>
            )}

            <div className="profile-card-actions">
              <button
                className="button button-primary btn-icon"
                onClick={() => setIsEditing(true)}
              >
                <span>✎</span> Editar Perfil
              </button>

              <button
                className="button button-secondary btn-icon"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="profile-edit-card">
            <div className="edit-card-header">
              <h3>Editar Información</h3>
              <p>Actualiza tus datos personales</p>
            </div>

            {mensaje.text && (
              <div className={`message-alert message-${mensaje.type}`}>
                {mensaje.type === 'success' && '✓ '}
                {mensaje.type === 'error' && '✕ '}
                {mensaje.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-divider">Información Personal</div>

              <div className="form-group">
                <label>Foto de Perfil</label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoUpload}
                />
                </div>

              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej: Av. Siempre Viva 123"
                />
              </div>

              <div className="form-group">
                <label>Foto de Perfil URL</label>
                <input
                  type="text"
                  name="fotoPerfil"
                  value={formData.fotoPerfil}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-divider">Cambiar Contraseña</div>

              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Deja vacío si no deseas cambiar"
                />
              </div>

              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="button button-primary btn-icon full-width-mobile"
                  disabled={loading}
                >
                  <span>✓</span> {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>

                <button
                  type="button"
                  className="button button-secondary btn-icon full-width-mobile"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      nombre: user?.nombre || '',
                      email: user?.email || '',
                      telefono: user?.telefono || '',
                      direccion: user?.direccion || '',
                      fotoPerfil: user?.fotoPerfil || '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                    setMensaje({ type: '', text: '' });
                  }}
                >
                  <span>✕</span> Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
