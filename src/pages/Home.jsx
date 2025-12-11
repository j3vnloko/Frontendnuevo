import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../api/apiService';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductosDestacados();
  }, []);

  const cargarProductosDestacados = async () => {
    try {
      const data = await apiService.getProductos();
      // Mostrar solo los primeros 6 productos activos
      setProductos(data.filter(p => p.activo).slice(0, 6));
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '80px' }}>
      {/* Hero Section */}
      <section className="hero-section bg-light py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold">TIENDA ONLINE</h1>
              <p className="lead mb-4">
                Descubre nuestra increíble selección de productos de alta calidad 
                para satisfacer todas tus necesidades de cultivo.
              </p>
              <Link to="/productos" className="btn btn-success btn-lg">
                🌿 Ver Productos
              </Link>
            </div>
            <div className="col-lg-6 text-center">
              <img 
                src="https://media.istockphoto.com/id/1475759445/es/vector/mascota-personaje-de-hoja-de-cannabis-con-ojos-rojos-y-cara-apedreada.jpg?s=612x612&w=0&k=20&c=0W2IQWe_oIBsPsYKwQcAR4KUWTS8kLX6ie0l0qf9ldA=" 
                alt="Sativamente" 
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Productos Destacados</h2>
          
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="row">
                {productos.map(producto => (
                  <ProductCard key={producto.id} producto={producto} />
                ))}
              </div>
              
              <div className="text-center mt-4">
                <Link to="/productos" className="btn btn-outline-success">
                  Ver Todos los Productos →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="p-4">
                <i className="bi bi-truck" style={{ fontSize: '3rem', color: '#4CAF50' }}>🚚</i>
                <h4 className="mt-3">Envío Gratis</h4>
                <p className="text-muted">En compras sobre $30.000</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4">
                <i className="bi bi-shield-check" style={{ fontSize: '3rem', color: '#4CAF50' }}>✓</i>
                <h4 className="mt-3">Calidad Garantizada</h4>
                <p className="text-muted">Productos de primera calidad</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4">
                <i className="bi bi-headset" style={{ fontSize: '3rem', color: '#4CAF50' }}>💬</i>
                <h4 className="mt-3">Soporte 24/7</h4>
                <p className="text-muted">Estamos aquí para ayudarte</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}