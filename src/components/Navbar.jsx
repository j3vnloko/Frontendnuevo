import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { apiService } from '../api/apiService';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  const usuario = authService.getUsuario();
  const isAuthenticated = authService.isAuthenticated();

  // ============================
  // 🔐 Cerrar sesión
  // ============================
  const handleLogout = () => {
    if (window.confirm('¿Cerrar sesión?')) {
      authService.logout();
      window.location.href = '/';
    }
  };

  // ============================
  // 🛒 Contador REAL desde backend
  // ============================
  const actualizarContador = async () => {
    const usuario = authService.getUsuario();

    if (!usuario) {
      setCartCount(0);
      return;
    }

    try {
      const carrito = await apiService.obtenerCarrito(usuario.id);
      const total = carrito.items?.reduce((sum, item) => sum + item.cantidad, 0) || 0;
      setCartCount(total);
    } catch (error) {
      console.error('Error al actualizar contador:', error);
      setCartCount(0);
    }
  };

  // Escuchar cambios
  useEffect(() => {
    actualizarContador();

    const handleUpdate = () => actualizarContador();

    window.addEventListener('carritoActualizado', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('carritoActualizado', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container-fluid px-4">

        <Link className="navbar-brand fw-bold" to="/">🍃 Sativamente</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          {/* MENÚ IZQUIERDO */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/nosotros">Nosotros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/blog">Blog</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
          </ul>

          {/* MENÚ DERECHA */}
          <div className="d-flex align-items-center">

            {/* CARRITO */}
            <Link to="/carrito" className="nav-link me-3">
              Carrito ({cartCount})
            </Link>

            {/* =============================
               👤 MENÚ DE USUARIO
               ============================= */}
            {isAuthenticated ? (
              <div className="dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  👤 {usuario?.nombre || "Usuario"}
                </a>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/perfil">Mi Perfil</Link></li>
                  <li><Link className="dropdown-item" to="/historial">Mis Compras</Link></li>

                  {/* ⭐ SOLO ADMIN VE ESTO */}
                  {usuario?.rol === "ADMIN" && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item text-danger" to="/admin-dashboard">
                          🛡️ Panel Admin
                        </Link>
                      </li>
                    </>
                  )}

                  <li><hr className="dropdown-divider" /></li>

                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>

            ) : (
              /* Usuario NO autenticado */
              <div className="dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Iniciar sesión
                </a>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/login">Iniciar sesión</Link></li>
                  <li><Link className="dropdown-item" to="/registro">Registrarse</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/admin">Acceder como Admin</Link></li>
                </ul>
              </div>
            )}

          </div>
        </div>

      </div>
    </nav>
  );
}
