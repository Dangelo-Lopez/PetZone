import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home({ t }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8082/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error al cargar productos:', error));
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.12,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-zoom'
    );
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [productos]);

  return (
    <>
      <section className="hero-section" id="inicio">
        <div className="hero-copy reveal-left">
          <span className="eyebrow">{t.welcome}</span>
          <h1>{t.heading}</h1>
          <p>{t.description}</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/alimentos">
              {t.viewStore}
            </Link>
            <a className="button button-secondary" href="#beneficios">
              {t.learnMore}
            </a>
          </div>
        </div>

        <div className="hero-panel reveal-right">
          <div className="hero-card card-feature">
            <span>Nuevo</span>
            <strong>Alimento Premium</strong>
            <p>Receta natural con pollo y arroz para energía diaria.</p>
          </div>
          <div className="hero-card card-stats">
            <strong>+150</strong>
            <p>Productos seleccionados para tu mascota.</p>
          </div>
        </div>
      </section>

      <section className="section-panel" id="productos-api">
        <div className="section-header reveal">
          <p className="section-label">Productos desde Backend</p>
          <h2>Productos disponibles</h2>
        </div>

        <div className="category-grid">
          {productos.length === 0 ? (
            <p>No hay productos disponibles.</p>
          ) : (
            productos.map((producto, index) => (
              <article className={`category-card reveal delay-${(index % 3 + 1) * 100}`} key={producto.id}>
                <div className="category-icon">🐾</div>
                <h3>{producto.nombre}</h3>
                <p>Precio: ${producto.precio}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="section-panel" id="productos">
        <div className="section-header reveal">
          <p className="section-label">{t.categories || 'Categorías'}</p>
          <h2>{t.whatYouNeed || 'Lo que tu mascota necesita'}</h2>
        </div>

        <div className="category-grid">
          <Link to="/alimentos" className="category-card reveal delay-100" style={{ textDecoration: 'none' }}>
            <div className="category-icon">🥕</div>
            <h3>Alimentos</h3>
            <p>Pienso y snacks saludables para Perros, Gatos, Conejos y Aves.</p>
          </Link>

          <Link to="/accesorios" className="category-card reveal delay-200" style={{ textDecoration: 'none' }}>
            <div className="category-icon">🛋️</div>
            <h3>Accesorios</h3>
            <p>Camas, collares, correas, juguetes y todo para el confort diario.</p>
          </Link>

          <Link to="/cuidado" className="category-card reveal delay-300" style={{ textDecoration: 'none' }}>
            <div className="category-icon">🧼</div>
            <h3>Cuidado y Peluquería</h3>
            <p>Baños, cortes de uñas y servicios de spa canino y felino.</p>
          </Link>
        </div>
      </section>

      <section className="section-panel" id="beneficios">
        <div className="section-header reveal">
          <p className="section-label">PetZone</p>
          <h2>{t.shopFast || 'Compra seguro, cómodo y rápido'}</h2>
        </div>

        <div className="feature-grid">
          <article className="feature-card reveal delay-100">
            <h3>Sin login</h3>
            <p>Accede directamente a la tienda y navega sin barreras.</p>
          </article>

          <article className="feature-card reveal delay-200">
            <h3>Envío rápido</h3>
            <p>Envío local en 24-48 horas para artículos esenciales.</p>
          </article>

          <article className="feature-card reveal delay-300">
            <h3>Fácil navegación</h3>
            <p>Diseño adaptable que se acomoda al tamaño de pantalla.</p>
          </article>
        </div>
      </section>
    </>
  );
}