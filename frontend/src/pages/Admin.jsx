import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

// Componente de pestaña Productos
function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [newProducto, setNewProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: 'Alimentos',
    imagen: '',
  });

  const [imagenFile, setImagenFile] = useState(null);
  const [mensaje, setMensaje] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8082/productos');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error(error);
      setMensaje({ type: 'error', text: 'Error al cargar productos' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const subirImagenProducto = async (productoId) => {
    if (!imagenFile) return null;

    const formData = new FormData();
    formData.append('file', imagenFile);

    const response = await fetch(`http://localhost:8082/productos/${productoId}/imagen`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Error al subir imagen');
    }

    return data.producto;
  };

  const iniciarEdicion = (producto) => {
    setEditingId(producto.id);
    setNewProducto({
      nombre: producto.nombre || '',
      precio: producto.precio || '',
      stock: producto.stock !== undefined && producto.stock !== null ? producto.stock : '',
      categoria: producto.categoria || 'Alimentos',
      imagen: producto.imagen || '',
    });
    setImagenFile(null);
    setMensaje({ type: '', text: '' });
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setNewProducto({
      nombre: '',
      precio: '',
      stock: '',
      categoria: 'Alimentos',
      imagen: '',
    });
    setImagenFile(null);
    setMensaje({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ type: '', text: '' });

    if (!newProducto.nombre || !newProducto.precio || newProducto.stock === '') {
      setMensaje({ type: 'error', text: 'Completa nombre, precio y stock' });
      return;
    }

    try {
      if (editingId) {
        const response = await fetch(`http://localhost:8082/productos/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: newProducto.nombre,
            precio: parseFloat(newProducto.precio),
            stock: parseInt(newProducto.stock),
            categoria: newProducto.categoria,
            imagen: newProducto.imagen,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Error al actualizar producto');
        }

        if (imagenFile) {
          await subirImagenProducto(editingId);
        }

        setMensaje({ type: 'success', text: 'Producto actualizado correctamente' });
        setEditingId(null);
      } else {
        const response = await fetch('http://localhost:8082/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: newProducto.nombre,
            precio: parseFloat(newProducto.precio),
            stock: parseInt(newProducto.stock),
            categoria: newProducto.categoria,
            imagen: '',
          }),
        });

        const productoCreado = await response.json();

        if (imagenFile) {
          await subirImagenProducto(productoCreado.id);
        }

        setMensaje({ type: 'success', text: 'Producto creado correctamente' });
      }

      await cargarProductos();

      setNewProducto({
        nombre: '',
        precio: '',
        stock: '',
        categoria: 'Alimentos',
        imagen: '',
      });

      setImagenFile(null);
    } catch (error) {
      console.error(error);
      setMensaje({
        type: 'error',
        text: editingId ? 'Error al actualizar producto' : 'Error al crear producto',
      });
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const response = await fetch(`http://localhost:8082/productos/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await cargarProductos();
        setMensaje({ type: 'success', text: 'Producto eliminado correctamente' });
      }
    } catch (error) {
      console.error(error);
      setMensaje({ type: 'error', text: 'Error al eliminar producto' });
    }
  };

  return (
    <div className="admin-tab-content">
      <h3>{editingId ? 'Editar Producto' : 'Gestión de Productos'}</h3>

      {mensaje.text && (
        <div className={`message-alert message-${mensaje.type}`}>
          {mensaje.type === 'success' && '✓ '}
          {mensaje.type === 'error' && '✕ '}
          {mensaje.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nombre del Producto</label>
            <input
              type="text"
              value={newProducto.nombre}
              onChange={(e) => setNewProducto({ ...newProducto, nombre: e.target.value })}
              placeholder="Nombre"
            />
          </div>

          <div className="form-group">
            <label>Precio</label>
            <input
              type="number"
              step="0.01"
              value={newProducto.precio}
              onChange={(e) => setNewProducto({ ...newProducto, precio: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              min="0"
              value={newProducto.stock}
              onChange={(e) => setNewProducto({ ...newProducto, stock: e.target.value })}
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Categoría</label>
            <select
              value={newProducto.categoria}
              onChange={(e) => setNewProducto({ ...newProducto, categoria: e.target.value })}
            >
              <option value="Alimentos">Alimentos</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>

          <div className="form-group">
            <label>Imagen del producto</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={(e) => setImagenFile(e.target.files[0])}
            />
          </div>
        </div>

        {editingId ? (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="button button-primary btn-create">
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={cancelarEdicion}
              className="button button-secondary"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button type="submit" className="button button-primary btn-create">
            Crear Producto
          </button>
        )}
      </form>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>

                  <td>
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="admin-product-image"
                      />
                    ) : (
                      'Sin imagen'
                    )}
                  </td>

                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td className="price-cell">${Number(producto.precio).toFixed(2)}</td>
                  <td>{producto.stock ?? 0}</td>

                  <td className="actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => iniciarEdicion(producto)}
                      style={{ marginRight: '8px' }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {productos.length === 0 && (
                <tr>
                  <td colSpan="7">No hay productos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Componente de pestaña Servicios
function AdminServicios() {
  const [servicios, setServicios] = useState([
    { id: 1, animal: 'Perro', peso: 'Mediano', servicio: 'Baño y Corte', precio: 60.00 },
    { id: 2, animal: 'Gato', peso: 'Pequeño', servicio: 'Baño', precio: 40.00 },
  ]);

  const [newServicio, setNewServicio] = useState({
    animal: 'Perro',
    peso: 'Mediano',
    servicio: 'Baño',
    precio: '',
  });

  const [mensaje, setMensaje] = useState({ type: '', text: '' });

  // TODO: Conectar con backend
  const cargarServicios = async () => {
    // const response = await fetch('http://localhost:8081/servicios');
    // const data = await response.json();
    // setServicios(data);
    console.log('Cargando servicios desde backend...');
  };

  const crearServicio = (e) => {
    e.preventDefault();
    setMensaje({ type: '', text: '' });

    if (!newServicio.precio) {
      setMensaje({ type: 'error', text: 'Por favor completa todos los campos' });
      return;
    }

    const servicio = {
      id: Math.max(...servicios.map(s => s.id), 0) + 1,
      ...newServicio,
      precio: parseFloat(newServicio.precio),
    };

    setServicios([...servicios, servicio]);
    setNewServicio({ animal: 'Perro', peso: 'Mediano', servicio: 'Baño', precio: '' });
    setMensaje({ type: 'success', text: 'Servicio creado exitosamente' });
  };

  const editarServicio = (id) => {
    // TODO: Implementar edición
    setMensaje({ type: 'success', text: 'Editar servicio (por implementar)' });
  };

  const eliminarServicio = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return;


    setServicios(servicios.filter(s => s.id !== id));
    setMensaje({ type: 'success', text: 'Servicio eliminado' });
  };

  return (
    <div className="admin-tab-content">
      <h3>Gestión de Servicios de Cuidado</h3>

      {mensaje.text && (
        <div className={`message-alert message-${mensaje.type}`}>
          {mensaje.type === 'success' && '✓ '}
          {mensaje.type === 'error' && '✕ '}
          {mensaje.text}
        </div>
      )}

      {/* Formulario para crear servicio */}
      <form onSubmit={crearServicio} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Animal</label>
            <select
              value={newServicio.animal}
              onChange={(e) => setNewServicio({ ...newServicio, animal: e.target.value })}
            >
              <option>Perro</option>
              <option>Gato</option>
            </select>
          </div>
          <div className="form-group">
            <label>Peso</label>
            <select
              value={newServicio.peso}
              onChange={(e) => setNewServicio({ ...newServicio, peso: e.target.value })}
            >
              <option>Pequeño</option>
              <option>Mediano</option>
              <option>Grande</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tipo de Servicio</label>
            <select
              value={newServicio.servicio}
              onChange={(e) => setNewServicio({ ...newServicio, servicio: e.target.value })}
            >
              <option>Baño</option>
              <option>Corte</option>
              <option>Baño y Corte</option>
              <option>Masaje</option>
              <option>Limpieza de Oídos</option>
            </select>
          </div>
          <div className="form-group">
            <label>Precio</label>
            <input
              type="number"
              step="0.01"
              value={newServicio.precio}
              onChange={(e) => setNewServicio({ ...newServicio, precio: e.target.value })}
              placeholder="0.00"
            />
          </div>
        </div>

        <button type="submit" className="button button-primary btn-create">
          Crear Servicio
        </button>
      </form>

      {/* Tabla de servicios */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Animal</th>
              <th>Peso</th>
              <th>Servicio</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map(servicio => (
              <tr key={servicio.id}>
                <td>{servicio.id}</td>
                <td>{servicio.animal}</td>
                <td>{servicio.peso}</td>
                <td>{servicio.servicio}</td>
                <td className="price-cell">${servicio.precio.toFixed(2)}</td>
                <td className="actions-cell">
                  <button
                    className="btn-action btn-edit"
                    onClick={() => editarServicio(servicio.id)}
                    title="Editar"
                  >
                    Editar
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => eliminarServicio(servicio.id)}
                    title="Eliminar"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente de pestaña Usuarios
function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'USER',
  });

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/auth/usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
      setMensaje({ type: 'error', text: 'Error al cargar usuarios' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const crearUsuario = async (e) => {
    e.preventDefault();
    setMensaje({ type: '', text: '' });

    if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.password) {
      setMensaje({ type: 'error', text: 'Completa todos los campos del usuario' });
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario),
      });

      const data = await response.json();

      if (data.success) {
        setUsuarios(prev => [...prev, data.user]);
        setNuevoUsuario({
          nombre: '',
          email: '',
          password: '',
          rol: 'USER',
        });
        setMostrarFormulario(false);
        setMensaje({ type: 'success', text: 'Usuario creado correctamente' });
      } else {
        setMensaje({ type: 'error', text: data.message || 'No se pudo crear el usuario' });
      }
    } catch (error) {
      console.error(error);
      setMensaje({ type: 'error', text: 'Error al crear usuario' });
    }
  };

  const cambiarRolUsuario = async (id, nuevoRol) => {
    try {
      const response = await fetch(`http://localhost:8081/auth/usuarios/${id}/rol`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol: nuevoRol }),
      });

      const data = await response.json();

      if (data.success) {
        setUsuarios(prev =>
          prev.map(usuario =>
            usuario.id === id ? { ...usuario, rol: nuevoRol } : usuario
          )
        );
        setMensaje({ type: 'success', text: 'Rol actualizado correctamente' });
      } else {
        setMensaje({ type: 'error', text: data.message || 'No se pudo actualizar el rol' });
      }
    } catch (error) {
      console.error(error);
      setMensaje({ type: 'error', text: 'Error al actualizar rol' });
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const response = await fetch(`http://localhost:8081/auth/usuarios/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
        setMensaje({ type: 'success', text: 'Usuario eliminado correctamente' });
      } else {
        setMensaje({ type: 'error', text: data.message || 'No se pudo eliminar el usuario' });
      }
    } catch (error) {
      console.error(error);
      setMensaje({ type: 'error', text: 'Error al eliminar usuario' });
    }
  };

  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter(usuario => usuario.rol === 'ADMIN').length;
  const totalUsers = usuarios.filter(usuario => usuario.rol === 'USER').length;

  return (
    <div className="admin-tab-content">
      <h3>Gestión de Usuarios</h3>

      <div className="admin-section-actions">
        <button
          type="button"
          className="button button-primary"
          onClick={() => setMostrarFormulario(prev => !prev)}
        >
          {mostrarFormulario ? 'Cancelar creación' : 'Crear nuevo usuario'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={crearUsuario} className="admin-form admin-user-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={nuevoUsuario.nombre}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
                }
                placeholder="Nombre completo"
              />
            </div>

            <div className="form-group">
              <label>Correo</label>
              <input
                type="email"
                value={nuevoUsuario.email}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
                }
                placeholder="correo@petzone.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contraseña temporal</label>
              <input
                type="password"
                value={nuevoUsuario.password}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
                }
                placeholder="Contraseña inicial"
              />
            </div>

            <div className="form-group">
              <label>Rol</label>
              <select
                value={nuevoUsuario.rol}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
                }
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <button type="submit" className="button button-primary btn-create">
            Guardar usuario
          </button>
        </form>
      )}

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Total usuarios</span>
          <strong>{totalUsuarios}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Administradores</span>
          <strong>{totalAdmins}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Clientes</span>
          <strong>{totalUsers}</strong>
        </div>
      </div>

      {mensaje.text && (
        <div className={`message-alert message-${mensaje.type}`}>
          {mensaje.type === 'success' && '✓ '}
          {mensaje.type === 'error' && '✕ '}
          {mensaje.text}
        </div>
      )}

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol Actual</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>

                  <td>
                    <span className={`rol-badge rol-${usuario.rol?.toLowerCase()}`}>
                      {usuario.rol}
                    </span>
                  </td>

                  <td className="actions-cell">
                    <select
                      className="rol-select"
                      value={usuario.rol}
                      onChange={(e) => cambiarRolUsuario(usuario.id, e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>

                    <button
                      className="btn-action btn-delete"
                      onClick={() => eliminarUsuario(usuario.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Componente principal Admin
export default function Admin() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('productos');

  // Protección de ruta
  if (!user) {
    return (
      <div className="page-container fade-in">
        <div className="admin-denied">
          <div className="admin-denied-card">
            <div className="admin-denied-icon">�</div>
            <h2>Acceso Denegado</h2>
            <p>Por favor inicia sesión para acceder al panel administrativo</p>
            <button className="button button-primary" onClick={() => navigate('/login')}>
              Ir a Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user.rol !== 'ADMIN') {
    return (
      <div className="page-container fade-in">
        <div className="admin-denied">
          <div className="admin-denied-card">
            <div className="admin-denied-icon">⛔</div>
            <h2>No tienes permisos</h2>
            <p>No tienes los permisos de administrador necesarios para acceder a esta área</p>
            <p className="admin-denied-info">Tu rol actual: <strong>{user.rol}</strong></p>
            <button className="button button-secondary" onClick={() => navigate('/')}>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="admin-header">
        <h1>Panel Administrativo</h1>
        <p>Bienvenido, {user.nombre}. Gestiona todos los aspectos de PetZone</p>
      </div>

      <div className="admin-container">
        {/* Pestañas */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            Productos
          </button>
          <button
            className={`admin-tab ${activeTab === 'servicios' ? 'active' : ''}`}
            onClick={() => setActiveTab('servicios')}
          >
            Servicios de Cuidado
          </button>
          <button
            className={`admin-tab ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('usuarios')}
          >
            Usuarios
          </button>
        </div>

        {/* Contenido de pestañas */}
        <div className="admin-tab-container">
          {activeTab === 'productos' && <AdminProductos />}
          {activeTab === 'servicios' && <AdminServicios />}
          {activeTab === 'usuarios' && <AdminUsuarios />}
        </div>
      </div>
    </div>
  );
}
