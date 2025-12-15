// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../api/apiService';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ordenes');
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [activeTab]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      if (activeTab === 'ordenes') {
        const data = await apiService.obtenerTodasLasOrdenes();
        setOrdenes(data);
      } else if (activeTab === 'usuarios') {
        const data = await apiService.getUsuarios();
        setUsuarios(data);
      } else if (activeTab === 'productos') {
        const data = await apiService.getProductos();
        setProductos(data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarUsuario = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await apiService.eliminarUsuario(id);
        alert('Usuario eliminado');
        cargarDatos();
      } catch (error) {
        alert('Error al eliminar usuario');
      }
    }
  };

  const handleEditarUsuario = (usuario) => {
    setEditingUser(usuario);
  };

  const handleGuardarUsuario = async (e) => {
    e.preventDefault();
    try {
      await apiService.actualizarUsuario(editingUser.id, editingUser);
      alert('Usuario actualizado');
      setEditingUser(null);
      cargarDatos();
    } catch (error) {
      alert('Error al actualizar usuario');
    }
  };

  const descargarBoleta = async (ordenId) => {
    try {
      await apiService.descargarBoleta(ordenId);
    } catch (error) {
      alert('Error al descargar boleta');
    }
  };

  return (
    <div className="container" style={{ marginTop: '100px', marginBottom: '50px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🛡️ Dashboard Administrativo</h2>
        <Link to="/" className="btn btn-outline-secondary">
          ← Volver al Inicio
        </Link>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'ordenes' ? 'active' : ''}`}
            onClick={() => setActiveTab('ordenes')}
          >
            📦 Órdenes de Compra
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('usuarios')}
          >
            👥 Usuarios
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            🛍️ Productos
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <>
          {/* TAB: ÓRDENES */}
          {activeTab === 'ordenes' && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-4">Historial de Compras de Clientes ({ordenes.length})</h5>
                
                {ordenes.length === 0 ? (
                  <div className="alert alert-info">No hay compras registradas</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Boleta</th>
                          <th>Cliente</th>
                          <th>Fecha</th>
                          <th>Subtotal</th>
                          <th>IVA</th>
                          <th>Total</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordenes.map(orden => (
                          <tr key={orden.id}>
                            <td><strong>{orden.numeroBoleta}</strong></td>
                            <td>{orden.usuario?.nombre || 'N/A'}<br />
                              <small className="text-muted">{orden.usuario?.email}</small>
                            </td>
                            <td>{new Date(orden.fecha).toLocaleString('es-CL')}</td>
                            <td>${orden.subtotal?.toLocaleString()}</td>
                            <td>${orden.iva?.toLocaleString()}</td>
                            <td><strong className="text-success">${orden.total?.toLocaleString()}</strong></td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => descargarBoleta(orden.id)}
                              >
                                📄 Boleta
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: USUARIOS */}
          {activeTab === 'usuarios' && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-4">Gestión de Usuarios ({usuarios.length})</h5>
                
                {editingUser && (
                  <div className="card mb-4 bg-light">
                    <div className="card-body">
                      <h6>Editar Usuario</h6>
                      <form onSubmit={handleGuardarUsuario}>
                        <div className="row">
                          <div className="col-md-4 mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nombre"
                              value={editingUser.nombre}
                              onChange={(e) => setEditingUser({...editingUser, nombre: e.target.value})}
                              required
                            />
                          </div>
                          <div className="col-md-4 mb-2">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Email"
                              value={editingUser.email}
                              onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                              required
                            />
                          </div>
                          <div className="col-md-2 mb-2">
                            <select
                              className="form-select"
                              value={editingUser.rol}
                              onChange={(e) => setEditingUser({...editingUser, rol: e.target.value})}
                            >
                              <option value="CLIENTE">CLIENTE</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </div>
                          <div className="col-md-2 mb-2">
                            <button type="submit" className="btn btn-success w-100">Guardar</button>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => setEditingUser(null)}
                        >
                          Cancelar
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
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
                            <span className={`badge ${usuario.rol === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                              {usuario.rol}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${usuario.activo ? 'bg-success' : 'bg-secondary'}`}>
                              {usuario.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEditarUsuario(usuario)}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleEliminarUsuario(usuario.id)}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTOS */}
          {activeTab === 'productos' && (
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Gestión de Productos ({productos.length})</h5>
                  <Link to="/admin" className="btn btn-success">
                    ➕ Ir a Panel de Productos
                  </Link>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map(producto => (
                        <tr key={producto.id}>
                          <td>{producto.id}</td>
                          <td>{producto.nombre}</td>
                          <td>${producto.precio?.toLocaleString()}</td>
                          <td>{producto.stock || 'N/A'}</td>
                          <td>{producto.categoria?.nombre || 'Sin categoría'}</td>
                          <td>
                            <span className={`badge ${producto.activo ? 'bg-success' : 'bg-secondary'}`}>
                              {producto.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}