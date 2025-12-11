import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const [formData, setFormData] = useState({
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoriaId: '',
  activo: true,
  imagenUrl: ''    // nuevo
});


  useEffect(() => {
    if (isAuthenticated) cargarDatos();
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (apiService.validateAdmin(password)) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const cargarDatos = async () => {
    try {
      const [prods, cats] = await Promise.all([
        apiService.getProductos(),
        apiService.getCategorias()
      ]);
      setProductos(prods);
      setCategorias(cats);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar datos');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoriaId: '',
      activo: true,
      imagenUrl: ''
    });
    setProductoEditar(null);
    setMostrarForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productoData = {
        ...formData,
        precio: parseInt(formData.precio),
        stock: parseInt(formData.stock),
        categoriaId: parseInt(formData.categoriaId)
      };

      if (productoEditar) {
        await apiService.actualizarProducto(productoEditar.id, productoData);
        alert('Producto actualizado correctamente');
      } else {
        await apiService.crearProducto(productoData);
        alert('Producto creado correctamente');
      }

      resetForm();
      cargarDatos();
    } catch (error) {
      alert('Error al guardar producto: ' + error.message);
    }
  };

  const handleEditar = (producto) => {
  setProductoEditar(producto);
  setFormData({
    nombre: producto.nombre,
    descripcion: producto.descripcion || '',
    precio: producto.precio?.toString() || '',
    stock: producto.stock?.toString() || '0',
    categoriaId: producto.categoria?.id?.toString() || '',
    activo: producto.activo,
    imagenUrl: producto.imagenUrl || ''
  });
  setMostrarForm(true);
};

  const handleActivar = async (id) => {
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



  const handleDesactivar = async (id) => {
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

  const handleEliminar = async (id) => {
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

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ marginTop: '150px', maxWidth: '400px' }}>
        <div className="card shadow">
          <div className="card-body">
            <h3 className="text-center mb-4">🔒 Acceso Administrador</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese contraseña admin"
                  autoFocus
                />
                <small className="text-muted">Hint: admin123</small>
              </div>
              <button type="submit" className="btn btn-danger w-100">
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Panel de administración
  return (
    <div className="container" style={{ marginTop: '100px', marginBottom: '50px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Panel de Administración</h2>
        <div>
          <button 
            className="btn btn-success me-2"
            onClick={() => setMostrarForm(!mostrarForm)}
          >
            {mostrarForm ? '❌ Cancelar' : '➕ Nuevo Producto'}
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => setIsAuthenticated(false)}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <div className="card mb-4 shadow">
          <div className="card-body">
            <h4>{productoEditar ? 'Editar Producto' : 'Crear Producto'}</h4>
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Nombre */}
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="nombre">
                    Nombre *
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    className="form-control"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                {/* Precio */}
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="precio">
                    Precio *
                  </label>
                  <input
                    id="precio"
                    type="number"
                    className="form-control"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                  />
                </div>

                {/* Stock */}
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="stock">
                    Stock
                  </label>
                  <input
                    id="stock"
                    type="number"
                    className="form-control"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>

                {/* Categoría */}
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="categoria">
                    Categoría
                  </label>
                  <select
                    id="categoria"
                    className="form-select"
                    value={formData.categoriaId}
                    onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                  >
                    <option value="">Seleccione...</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Imagen (URL) */}
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="imagenUrl">
                    Imagen (URL)
                  </label>
                  <input
                    id="imagenUrl"
                    type="text"
                    className="form-control"
                    placeholder="https://miimagen.com/foto.jpg"
                    value={formData.imagenUrl || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, imagenUrl: e.target.value })
                    }
                  />
                </div>

                {/* Descripción */}
                <div className="col-12 mb-3">
                  <label className="form-label" htmlFor="descripcion">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    className="form-control"
                    rows="3"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </div>
                <div className="col-12 mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.activo}
                      onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                    />
                    <label className="form-check-label">Activo</label>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {productoEditar ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de productos */}
      <div className="card shadow">
        <div className="card-body">
          <h4 className="mb-3">Productos ({productos.length})</h4>
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
                    <td>${producto.precio.toLocaleString()}</td>
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
                        onClick={() => handleEditar(producto)}
                      >
                        ✏️
                      </button>

                      {producto.activo ? (
                        <button
                          className="btn btn-sm btn-secondary me-2"
                          onClick={() => handleDesactivar(producto.id)}
                        >
                          🚫
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleActivar(producto.id)}
                        >
                          ✅
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleEliminar(producto.id)}
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
  );
}
