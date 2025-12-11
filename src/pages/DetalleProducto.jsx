import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../api/apiService';
import { authService } from '../services/authService'; // ✅ IMPORTANTE

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    try {
      const data = await apiService.getProductoById(id);
      setProducto(data);
    } catch (error) {
      console.error('Error al cargar producto:', error);
      alert('Producto no encontrado');
      navigate('/productos');
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ✅ NUEVA FUNCIÓN PARA CARRITO REAL (con usuario y JWT)
  // ===============================
  const agregarAlCarrito = async () => {
    const usuario = authService.getUsuario();

    if (!usuario) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    try {
      await apiService.agregarAlCarrito(usuario.id, producto.id, cantidad);

      setMensaje(`✓ ${cantidad} ${producto.nombre}(s) agregado(s) al carrito`);

      // Notificar al navbar
      window.dispatchEvent(new Event('carritoActualizado'));

      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      alert('Error al agregar al carrito: ' + error.message);
    }
  };

  // ===============================

  if (loading) {
    return (
      <div className="container text-center" style={{ marginTop: '150px' }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  if (!producto) return null;

  return (
    <div className="container" style={{ marginTop: '100px', marginBottom: '50px' }}>
      <div className="row">
        
        {/* Imagen */}
        <div className="col-lg-6 mb-4">
          <div 
            className="bg-light rounded d-flex align-items-center justify-content-center"
            style={{ height: '400px', overflow: 'hidden' }}
          >
            {producto.imagenUrl ? (
              <img 
                src={producto.imagenUrl} 
                alt={producto.nombre}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span className="text-muted display-1">📦</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="col-lg-6">
          <div className="badge bg-success mb-3">Producto Disponible</div>
          <h1 className="display-5 fw-bold mb-3">{producto.nombre}</h1>
          <h3 className="text-danger fw-bold mb-4">
            ${producto.precio.toLocaleString()}
          </h3>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">📝 Descripción</h5>
              <p>{producto.descripcion || 'Sin descripción disponible'}</p>
            </div>
          </div>

          {/* Cantidad */}
          <div className="mb-4">
            <label className="form-label fw-bold">Cantidad:</label>
            <div className="input-group" style={{ maxWidth: '200px' }}>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              >
                -
              </button>
              <input 
                type="number" 
                className="form-control text-center" 
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setCantidad(cantidad + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Botón Agregar */}
          <button 
            className="btn btn-success btn-lg w-100 mb-3"
            onClick={agregarAlCarrito}
            disabled={!producto.activo}
          >
            🛒 Añadir al carrito
          </button>

          {mensaje && (
            <div className="alert alert-success">{mensaje}</div>
          )}

          <div className="row text-center mt-4">
            <div className="col-6">
              <div className="bg-light p-3 rounded">
                <strong>📦 Stock</strong><br />
                <span className="text-success">Disponible</span>
              </div>
            </div>
            <div className="col-6">
              <div className="bg-light p-3 rounded">
                <strong>🚚 Envío</strong><br />
                <span className="text-info">Gratis</span>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/productos')}
            >
              ← Volver
            </button>
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/')}
            >
              🏠 Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
