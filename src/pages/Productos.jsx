import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';
import ProductCard from '../components/ProductCard';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [prods, cats] = await Promise.all([
        apiService.getProductos(),
        apiService.getCategorias()
      ]);
      setProductos(prods);
      setCategorias(cats);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar productos. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter(producto => {
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleCategoria = filtroCategoria === 'todas' || 
                           producto.categoriaId?.toString() === filtroCategoria;
    return cumpleBusqueda && cumpleCategoria && producto.activo;
  });

  return (
    <div className="container" style={{ marginTop: '100px', marginBottom: '50px' }}>
      <h2 className="text-center mb-4 fw-bold">
        Catálogo de Productos ({productosFiltrados.length})
      </h2>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <select
            className="form-select"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Productos */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="alert alert-info text-center">
          No se encontraron productos con los filtros aplicados.
        </div>
      ) : (
        <div className="row">
          {productosFiltrados.map(producto => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}