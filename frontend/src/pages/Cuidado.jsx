import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const serviciosInfo = [
  { key: 'baño', nombre: 'Baño completo', icono: '🛁' },
  { key: 'corte', nombre: 'Corte de pelo', icono: '✂️' },
  { key: 'uñas', nombre: 'Corte de uñas', icono: '🐾' },
  { key: 'cepillado', nombre: 'Cepillado', icono: '🪮' },
];

export default function Cuidado({ currency }) {
  const { user } = useContext(UserContext);

  const [datosCuidado, setDatosCuidado] = useState([]);
  const [animalSeleccionado, setAnimalSeleccionado] = useState('');
  const [pesoSeleccionado, setPesoSeleccionado] = useState('');
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeReserva, setMensajeReserva] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/cuidados')
      .then(res => res.json())
      .then(data => {
        setDatosCuidado(data);
        setLoading(false);

        if (data.length > 0) {
          setAnimalSeleccionado(data[0].animal);
        }
      })
      .catch(err => {
        console.error('Error cargando servicios de cuidado:', err);
        setLoading(false);
      });
  }, []);

  const animales = useMemo(() => {
    return [...new Set(datosCuidado.map(item => item.animal))];
  }, [datosCuidado]);

  const pesosDisponibles = useMemo(() => {
    return [
      ...new Set(
        datosCuidado
          .filter(item => item.animal === animalSeleccionado)
          .map(item => item.peso)
      ),
    ];
  }, [datosCuidado, animalSeleccionado]);

  const serviciosDisponibles = useMemo(() => {
    return datosCuidado.filter(
      item =>
        item.animal === animalSeleccionado &&
        item.peso === pesoSeleccionado
    );
  }, [datosCuidado, animalSeleccionado, pesoSeleccionado]);

  const toggleServicio = servicio => {
    setMensajeReserva('');

    setServiciosSeleccionados(prev =>
      prev.includes(servicio)
        ? prev.filter(s => s !== servicio)
        : [...prev, servicio]
    );
  };

  const total = useMemo(() => {
    return serviciosDisponibles
      .filter(item => serviciosSeleccionados.includes(item.servicio))
      .reduce((acc, item) => acc + Number(item.precio), 0);
  }, [serviciosDisponibles, serviciosSeleccionados]);

  const formatearPrecio = valor =>
    `${currency?.code || 'CLP'} ${Number(valor).toLocaleString('es-CL')}`;

  const puedeReservar = user && pesoSeleccionado && serviciosSeleccionados.length > 0;

  const pagarYReservar = () => {
    if (!puedeReservar) return;

    setMensajeReserva(
      `Reserva generada para ${user.name}. Total a pagar: ${formatearPrecio(total)}`
    );
  };

  return (
    <div className="page-container fade-in">
      <div className="care-premium-hero">
        <div className="care-hero-copy">
          <span className="eyebrow">Servicios PetZone</span>

          <h1>Cuidado y peluquería para mascotas</h1>

          <p>
            Personaliza el cuidado de tu mascota según especie, peso y servicios
            que necesite. Los valores se cargan dinámicamente desde la base de datos.
          </p>

          <div className="hero-actions">
            <a href="#cotizador" className="button button-primary">
              Cotizar servicio
            </a>

            <Link to="/" className="button button-secondary">
              Volver al inicio
            </Link>
          </div>
        </div>

        <div className="care-summary-card">
          <span>Atención personalizada</span>
          <strong>Servicios adaptados para cada mascota</strong>
          <p>
            Para reservar y pagar un servicio debes iniciar sesión con una cuenta registrada.
          </p>
        </div>
      </div>

      <section className="pricing-section" id="cotizador">
        <div className="section-header care-centered">
          <p className="section-label">Cotizador interactivo</p>
          <h2>Configura el servicio ideal</h2>
        </div>

        {loading ? (
          <p>Cargando servicios...</p>
        ) : (
          <div className="care-config-grid">
            <div className="care-selector-card">
              <div className="care-form-group">
                <label>Tipo de mascota</label>

                <div className="care-filter">
                  {animales.map(animal => (
                    <button
                      key={animal}
                      className={
                        animalSeleccionado === animal
                          ? 'care-filter-btn active'
                          : 'care-filter-btn'
                      }
                      onClick={() => {
                        setAnimalSeleccionado(animal);
                        setPesoSeleccionado('');
                        setServiciosSeleccionados([]);
                        setMensajeReserva('');
                      }}
                    >
                      {animal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="care-form-group">
                <label>Rango de peso</label>

                <select
                  className="care-select"
                  value={pesoSeleccionado}
                  onChange={e => {
                    setPesoSeleccionado(e.target.value);
                    setServiciosSeleccionados([]);
                    setMensajeReserva('');
                  }}
                >
                  <option value="">Seleccionar peso</option>

                  {pesosDisponibles.map(peso => (
                    <option key={peso} value={peso}>
                      {peso}
                    </option>
                  ))}
                </select>
              </div>

              <div className="care-form-group">
                <label>Servicios</label>

                <div className="care-services-selector">
                  {serviciosDisponibles.length === 0 ? (
                    <p>Selecciona primero un rango de peso.</p>
                  ) : (
                    serviciosDisponibles.map(item => {
                      const info = serviciosInfo.find(
                        servicio => servicio.key === item.servicio
                      );

                      return (
                        <button
                          key={item.id}
                          className={
                            serviciosSeleccionados.includes(item.servicio)
                              ? 'care-service-option active'
                              : 'care-service-option'
                          }
                          onClick={() => toggleServicio(item.servicio)}
                        >
                          <span>{info?.icono || '🐾'}</span>
                          {info?.nombre || item.servicio}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="care-total-card">
              <span>Total estimado</span>

              <strong>{formatearPrecio(total)}</strong>

              <p>
                Valor aproximado según servicios seleccionados.
              </p>

              <div className="care-selected-services">
                {serviciosSeleccionados.length === 0 ? (
                  <p>No hay servicios seleccionados.</p>
                ) : (
                  serviciosSeleccionados.map(servicio => {
                    const info = serviciosInfo.find(s => s.key === servicio);

                    return (
                      <div className="care-selected-item" key={servicio}>
                        <span>{info?.icono || '🐾'}</span>
                        <p>{info?.nombre || servicio}</p>
                      </div>
                    );
                  })
                )}
              </div>

              {!user ? (
                <Link to="/login" className="button button-primary block-button">
                  Iniciar sesión para reservar
                </Link>
              ) : (
                <button
                  className="button button-primary block-button"
                  disabled={!puedeReservar}
                  onClick={pagarYReservar}
                >
                  Pagar y reservar
                </button>
              )}

              {user && (!pesoSeleccionado || serviciosSeleccionados.length === 0) && (
                <p className="note">
                  Selecciona el peso y al menos un servicio para continuar.
                </p>
              )}

              {mensajeReserva && (
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <h3>Reserva lista</h3>
                  <p>{mensajeReserva}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="pricing-section">
        <div className="section-header care-centered">
          <p className="section-label">Tabla referencial</p>
          <h2>Valores base por mascota</h2>
        </div>

        <div className="table-responsive pricing-scroll">
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Animal</th>
                <th>Peso</th>
                <th>Servicio</th>
                <th>Precio</th>
              </tr>
            </thead>

            <tbody>
              {datosCuidado.map(item => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.animal}</strong>
                  </td>
                  <td>{item.peso}</td>
                  <td>{item.servicio}</td>
                  <td>{formatearPrecio(item.precio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="note">
          Los valores se administran desde MySQL y pueden variar según el estado
          del pelaje, comportamiento de la mascota o servicios adicionales.
        </p>
      </section>
    </div>
  );
}