import { useState, useContext, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Alimentos from './pages/Alimentos'
import Accesorios from './pages/Accesorios'
import Cuidado from './pages/Cuidado'
import Login from './pages/Login'
import Cart from './pages/Cart'
import Perfil from './pages/Perfil'
import Admin from './pages/Admin'
import { CartProvider, CartContext } from './context/CartContext'
import { UserProvider, UserContext } from './context/UserContext'
import { ThemeProvider, ThemeContext } from './context/ThemeContext'

const translations = {
  es: {
    welcome: 'Bienvenido a PetZone',
    heading: 'Todo para tu mascota en un solo lugar',
    description:
      'Alimentación balanceada, accesorios confortables y cuidado natural para perros y gatos. Compra fácil, sin iniciar sesión.',
    viewStore: 'Ver tienda',
    learnMore: 'Conócenos',
    categories: 'Categorías',
    whatYouNeed: 'Lo que tu mascota necesita',
    trusted: 'Tu tienda de confianza para mascotas felices y saludables.',
    questions: '¿Dudas? Escríbenos a',
    languageLabel: 'Idioma',
    currencyLabel: 'Moneda',
    changeLanguage: 'Cambiar a English',
    changeCurrency: 'Cambiar a',
    home: 'Inicio',
    products: 'Productos',
    benefits: 'Beneficios',
    contact: 'Contacto',
    shopFast: 'Compra seguro, cómodo y rápido',
    copyright: '© 2024 PetZone. Todos los derechos reservados.',
    followUs: 'Síguenos en:',
  },
  en: {
    welcome: 'Welcome to PetZone',
    heading: 'Everything for your pet in one place',
    description:
      'Balanced food, cozy accessories and natural care for dogs and cats. Shop easily, without logging in.',
    viewStore: 'Shop now',
    learnMore: 'Learn more',
    categories: 'Categories',
    whatYouNeed: 'What your pet needs',
    trusted: 'Your trusted store for happy, healthy pets.',
    questions: 'Questions? Email us at',
    languageLabel: 'Language',
    currencyLabel: 'Currency',
    changeLanguage: 'Switch to Español',
    changeCurrency: 'Change to',
    home: 'Home',
    products: 'Products',
    benefits: 'Benefits',
    contact: 'Contact',
    shopFast: 'Shop safe, comfortable and fast',
    copyright: '© 2024 PetZone. All rights reserved.',
    followUs: 'Follow us on:',
  },
}

const languageList = [
  { code: 'es', labelES: 'Español', labelEN: 'Spanish' },
  { code: 'en', labelES: 'Inglés', labelEN: 'English' },
]

const currencyList = [
  { code: 'USD', labelES: 'Dólar', labelEN: 'Dollar' },
  { code: 'EUR', labelES: 'Euro', labelEN: 'Euro' },
  { code: 'CLP', labelES: 'Peso CLP', labelEN: 'Chilean peso' },
]

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [pathname]);

  return null;
}

function AppRouter() {
  const [language, setLanguage] = useState('es')
  const [currencyCode, setCurrencyCode] = useState('USD')
  const [languageOpen, setLanguageOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)

  const { getCartCount } = useContext(CartContext)
  const { user, logout } = useContext(UserContext)
  const { isDark, toggleTheme } = useContext(ThemeContext)

  const t = translations[language] || translations.en
  const currentCurrency = currencyList.find((item) => item.code === currencyCode) || currencyList[0]

  const languageLabel = languageList.find((option) => option.code === language)
  const currencyLabel = language === 'es' ? currentCurrency.labelES : currentCurrency.labelEN

  const selectLanguage = (code) => {
    setLanguage(code)
    setLanguageOpen(false)
  }

  const selectCurrency = (code) => {
    setCurrencyCode(code)
    setCurrencyOpen(false)
  }

  const toggleLanguageOpen = () => {
    setLanguageOpen((prev) => !prev)
    setCurrencyOpen(false)
  }

  const toggleCurrencyOpen = () => {
    setCurrencyOpen((prev) => !prev)
    setLanguageOpen(false)
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-shell">
        <header className="topbar">
          <div className="brand">
            <img src="/Logo.png" alt="PetZone logo" className="brand-logo" />
            <div>
              <p className="brand-label">PetZone</p>
              <p className="brand-subtitle">Tienda para mascotas</p>
            </div>
          </div>
          <nav className="main-nav" aria-label="Navegación principal">
            <a href="/">{t.home}</a>
            <a href="/#productos">{t.products}</a>
            <a href="/#beneficios">{t.benefits}</a>
            <a href="/#contacto">{t.contact}</a>
          </nav>
          <div className="topbar-actions">
            {user ? (
              <div className="user-area">
                <Link to="/perfil" className="user-avatar-button" title="Ir a Mi Perfil">
                  {user?.fotoPerfil ? (
                    <img
                      src={user.fotoPerfil}
                      alt={user.nombre}
                      className="navbar-avatar"
                    />
                  ) : (
                    <span className="navbar-avatar-fallback">👤</span>
                  )}
                </Link>
                {user.rol === 'ADMIN' && (
                  <Link to="/admin" className="admin-link">
                    Administración
                  </Link>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                <span className="icon">👤</span> Iniciar Sesión
              </Link>
            )}
            <button onClick={toggleTheme} className="theme-btn" title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
              {isDark ? '☀︎' : '⏾'}
            </button>
            <a href="/cart" className="cart-btn">
              <span className="icon">🛒</span>
              {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
            </a>
          </div>
        </header>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home t={t} />} />
            <Route path="/alimentos" element={<Alimentos currency={currentCurrency} />} />
            <Route path="/accesorios" element={<Accesorios currency={currentCurrency} />} />
            <Route path="/cuidado" element={<Cuidado currency={currentCurrency} />} />
            <Route path="/login" element={<Login t={t} />} />
            <Route path="/cart" element={<Cart currency={currentCurrency} />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <footer className="site-footer" id="contacto">
          <div className="footer-branding">
            <h2>PetZone</h2>
            <p>{t.trusted}</p>
          </div>

          <div className="footer-links">
            <a href="/">{t.home}</a>
            <a href="/#productos">{t.products}</a>
            <a href="/#beneficios">{t.benefits}</a>
            <p>{t.followUs}</p>
            <div className="social-links">
              <a href="https://facebook.com/petzone" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://instagram.com/petzone" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>

          <div className="footer-note">
            <p>
              {t.questions} <a href="mailto:contacto@petzone.com">contacto@petzone.com</a>
            </p>
            <p>{t.copyright}</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
