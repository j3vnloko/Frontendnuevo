import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../api/apiService';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ordenes');
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  
  // Estados para gestión de productos
  const [mostrarFormProducto, setMostrarFormProducto] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [formDataProducto, setFormDataProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaId: '',
    activo: true,
    imagenUrl: ''
  });

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
        const [prods, cats] = await Promise.all([
          apiService.getProductos(),
          apiService.getCategorias()
        ]);
        setProductos(prods);
        setCategorias(cats);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // ==================== GESTIÓN DE PRODUCTOS ====================
  
  const resetFormProducto = () => {
    setFormDataProducto({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoriaId: '',
      activo: true,
      imagenUrl: ''
    });
    setProductoEditar(null);
    setMostrarFormProducto(false);
  };

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    try {
      const productoData = {
        ...formDataProducto,
        precio: parseInt(formDataProducto.precio),
        stock: parseInt(formDataProducto.stock),
        categoriaId: parseInt(formDataProducto.categoriaId)
      };

      if (productoEditar) {
        await apiService.actualizarProducto(productoEditar.id, productoData);
        alert('Producto actualizado correctamente');
      } else {
        await apiService.crearProducto(productoData);
        alert('Producto creado correctamente');
      }

      resetFormProducto();
      cargarDatos();
    } catch (error) {
      alert('Error al guardar producto: ' + error.message);
    }
  };

  const handleEditarProducto = (producto) => {
    setProductoEditar(producto);
    setFormDataProducto({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio?.toString() || '',
      stock: producto.stock?.toString() || '0',
      categoriaId: producto.categoria?.id?.toString() || '',
      activo: producto.activo,
      imagenUrl: producto.imagenUrl || ''
    });
    setMostrarFormProducto(true);
  };

  const handleActivarProducto = async (id) => {
    if (window.confirm('¿Está seguro de activar este producto?')) {
      try {
        await apiService.activarProducto(id);
        alert('Producto activado');
        cargarDatos();
      } catch (error) {
        alert('Error al activar producto');
      }
    }
  };

  const handleDesactivarProducto = async (id) => {
    if (window.confirm('¿Está seguro de desactivar este producto?')) {
      try {
        await apiService.desactivarProducto(id);
        alert('Producto desactivado');
        cargarDatos();
      } catch (error) {
        alert('Error al desactivar producto');
      }
    }
  };

  const handleEliminarProducto = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        await apiService.eliminarProducto(id);
        alert('Producto eliminado');
        cargarDatos();
      } catch (error) {
        alert('Error al eliminar producto');
      }
    }
  };

  // ==================== GESTIÓN DE USUARIOS ====================
  
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
          {/* ==================== TAB: ÓRDENES ==================== */}
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

          {/* ==================== TAB: USUARIOS ==================== */}
          {activeTab === 'usuarios' && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-4">Gestión de Usuarios ({usuarios.length})</h5>
                
                {editingUser && (
                  <div className="card mb-4 bg-light">
                    <div className="card-body">
                      <h6>Editar Usuario</h6>
                      <div onSubmit={(e) => { e.preventDefault(); handleGuardarUsuario(e); }}>
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
                            <button onClick={(e) => handleGuardarUsuario(e)} className="btn btn-success w-100">Guardar</button>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => setEditingUser(null)}
                        >
                          Cancelar
                        </button>
                      </div>
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

          {/* ==================== TAB: PRODUCTOS ==================== */}
          {activeTab === 'productos' && (
            <div>
              {/* Botón para mostrar/ocultar formulario */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Productos ({productos.length})</h5>
                <button 
                  className="btn btn-success"
                  onClick={() => setMostrarFormProducto(!mostrarFormProducto)}
                >
                  {mostrarFormProducto ? '❌ Cancelar' : '➕ Nuevo Producto'}
                </button>
              </div>

              {/* Formulario de Producto */}
              {mostrarFormProducto && (
                <div className="card mb-4 shadow">
                  <div className="card-body">
                    <h5>{productoEditar ? 'Editar Producto' : 'Crear Producto'}</h5>
                    <div onSubmit={(e) => { e.preventDefault(); handleSubmitProducto(e); }}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Nombre *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formDataProducto.nombre}
                            onChange={(e) => setFormDataProducto({ ...formDataProducto, nombre: e.target.value })}
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Precio *</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formDataProducto.precio}
                            onChange={(e) => setFormDataProducto({ ...formDataProducto, precio: e.target.value })}
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Stock</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formDataProducto.stock}
                            onChange={(e) => setFormDataProducto({ ...formDataProducto, stock: e.target.value })}
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Categoría</label>
                          <select
                            className="form-select"
                            value={formDataProducto.categoriaId}
                            onChange={(e) => setFormDataProducto({ ...formDataProducto, categoriaId: e.target.value })}
                          >
                            <option value="">Seleccione...</option>
                            {categorias.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Imagen (URL)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="https://miimagen.com/foto.jpg"
                            value={formDataProducto.imagenUrl || ''}
                            onChange={(e) => setFormDataProducto({ ...formDataProducto, imagenUrl: e.target.value })}
                          />
                        </div>

                        <div className="col-12 mb-3">
                          <label className="form-label">Descripción</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={formDataProducto.descripcion}
                            onChange={(e) => setFormDataProducto({ ...formDataProducto, descripcion: e.target.value })}
                          />
                        </div>

                        <div className="col-12 mb-3">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={formDataProducto.activo}
                              onChange={(e) => setFormDataProducto({...formDataProducto, activo: e.target.checked})}
                            />
                            <label className="form-check-label">Activo</label>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button onClick={(e) => handleSubmitProducto(e)} className="btn btn-primary">
                          {productoEditar ? 'Actualizar' : 'Crear'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={resetFormProducto}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabla de Productos */}
              <div className="card shadow">
                <div className="card-body">
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
                          <th>Acciones</th>
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
                            <td>
                              <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => handleEditarProducto(producto)}
                              >
                                ✏️
                              </button>

                              {producto.activo ? (
                                <button
                                  className="btn btn-sm btn-secondary me-2"
                                  onClick={() => handleDesactivarProducto(producto.id)}
                                >
                                  🚫
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm btn-success me-2"
                                  onClick={() => handleActivarProducto(producto.id)}
                                >
                                  ✅
                                </button>
                              )}

                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleEliminarProducto(producto.id)}
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
            </div>
          )}
        </>
      )}
    </div>
  );
}