import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../api/apiService';
import { authService } from '../services/authService';

export default function Carrito() {
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const usuario = authService.getUsuario();

  useEffect(() => {
    if (!usuario) {
      alert('Debes iniciar sesión para ver el carrito');
      navigate('/login');
      return;
    }
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      const data = await apiService.obtenerCarrito(usuario.id);
      setCarrito(data);
      
      // Actualizar contador del navbar
      window.dispatchEvent(new Event('carritoActualizado'));
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      alert('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const calcularSubtotal = () => {
    if (!carrito || !carrito.items) return 0;
    return carrito.items.reduce((total, item) => 
      total + (item.producto.precio * item.cantidad), 0
    );
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const envio = subtotal > 30000 ? 0 : 5000;
    return subtotal + envio;
  };

  const actualizarCantidad = async (itemId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    try {
      await apiService.actualizarCantidadCarrito(usuario.id, itemId, nuevaCantidad);
      await cargarCarrito();
    } catch (error) {
      alert('Error al actualizar cantidad');
    }
  };

  const eliminarProducto = async (itemId) => {
    if (window.confirm('¿Eliminar este producto del carrito?')) {
      try {
        await apiService.eliminarItemCarrito(usuario.id, itemId);
        await cargarCarrito();
      } catch (error) {
        alert('Error al eliminar producto');
      }
    }
  };

  const vaciarCarrito = async () => {
    if (window.confirm('¿Vaciar todo el carrito?')) {
      try {
        await apiService.vaciarCarrito(usuario.id);
        await cargarCarrito();
      } catch (error) {
        alert('Error al vaciar carrito');
      }
    }
  };

  const procesarCompra = async () => {
    if (!carrito || !carrito.items || carrito.items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    try {
      await apiService.crearOrden(usuario.id);
      alert('¡Compra procesada exitosamente! Revisa tu historial.');
      navigate('/historial');
    } catch (error) {
      alert('Error al procesar la compra: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ marginTop: '150px' }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  const subtotal = calcularSubtotal();
  const envio = subtotal > 30000 ? 0 : 5000;
  const total = calcularTotal();
  const items = carrito?.items || [];

  return (
    <div className="container" style={{ marginTop: '100px', marginBottom: '50px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Tu Carrito 🛒</h1>
        <Link to="/productos" className="btn btn-outline-secondary">
          ← Seguir comprando
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-1 mb-4">🛒</div>
          <h3 className="mb-3">Tu carrito está vacío</h3>
          <p className="text-muted mb-4">¡Agrega productos para comenzar!</p>
          <Link to="/productos" className="btn btn-success btn-lg">
            Ver Productos
          </Link>
        </div>
      ) : (
        <div className="row">
          {/* Lista de productos */}
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Productos ({items.length})</h5>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={vaciarCarrito}
                  >
                    🗑️ Vaciar carrito
                  </button>
                </div>
                
                <hr />

                {items.map(item => (
                  <div key={item.id} className="row align-items-center mb-3 pb-3 border-bottom">
                    <div className="col-md-2 col-3 text-center">
                      <div 
                        className="bg-light rounded d-flex align-items-center justify-content-center"
                        style={{ height: '80px' }}
                      >
                        {item.producto.imagenUrl ? (
                          <img 
                            src={item.producto.imagenUrl} 
                            alt={item.producto.nombre}
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                          />
                        ) : (
                          <span style={{ fontSize: '2rem' }}>📦</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4 col-9">
                      <h6 className="mb-1">{item.producto.nombre}</h6>
                      <p className="text-muted small mb-0">
                        {item.producto.descripcion?.substring(0, 50) || 'Sin descripción'}
                      </p>
                    </div>

                    <div className="col-md-2 col-4 text-center">
                      <small className="text-muted d-block">Precio</small>
                      <strong>${item.producto.precio?.toLocaleString()}</strong>
                    </div>

                    <div className="col-md-2 col-4">
                      <div className="input-group input-group-sm">
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          className="form-control text-center" 
                          value={item.cantidad}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            actualizarCantidad(item.id, val);
                          }}
                          min="1"
                          style={{ maxWidth: '60px' }}
                        />
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="col-md-2 col-4 text-end">
                      <div className="mb-2">
                        <strong className="text-success">
                          ${(item.producto.precio * item.cantidad).toLocaleString()}
                        </strong>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarProducto(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: '100px' }}>
              <div className="card-body">
                <h5 className="card-title mb-4">Resumen de Compra</h5>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <strong>${subtotal.toLocaleString()}</strong>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Envío:</span>
                  <strong className={envio === 0 ? 'text-success' : ''}>
                    {envio === 0 ? 'GRATIS' : `$${envio.toLocaleString()}`}
                  </strong>
                </div>

                {subtotal < 30000 && (
                  <small className="text-muted d-block mb-3">
                    💡 Compra ${(30000 - subtotal).toLocaleString()} más para envío gratis
                  </small>
                )}

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <h5>Total:</h5>
                  <h5 className="text-success">${total.toLocaleString()}</h5>
                </div>

                <button 
                  className="btn btn-success w-100 mb-3"
                  onClick={procesarCompra}
                >
                  Procesar Compra 💳
                </button>

                <Link to="/productos" className="btn btn-outline-secondary w-100">
                  Seguir comprando
                </Link>

                <div className="bg-light rounded p-3 mt-3">
                  <small className="d-block mb-2">✓ Compra segura</small>
                  <small className="d-block mb-2">✓ Envío a todo Chile</small>
                  <small className="d-block">✓ Devolución gratis</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}