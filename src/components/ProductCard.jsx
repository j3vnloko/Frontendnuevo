import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ producto }) {
  return (
    <div className="col-md-4 col-sm-6 mb-4">
      <div className="card h-100 shadow-sm producto-card">
        <div 
          className="card-img-top bg-light d-flex align-items-center justify-content-center" 
          style={{ height: '200px', overflow: 'hidden' }}
        >
          {producto.imagenUrl ? (
            <img 
              src={producto.imagenUrl} 
              alt={producto.nombre} 
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span className="text-muted">📦 {producto.nombre}</span>
          )}
        </div>
        <div className="card-body text-center">
          <h5 className="card-title">{producto.nombre}</h5>
          <p className="card-text text-muted small">{producto.descripcion}</p>
          <p className="precio text-danger fw-bold">${producto.precio.toLocaleString()}</p>
          <div className="d-flex justify-content-between align-items-center">
            <span className={`badge ${producto.activo ? 'bg-success' : 'bg-secondary'}`}>
              {producto.activo ? 'Disponible' : 'No disponible'}
            </span>
            <Link 
              to={`/productos/${producto.id}`} 
              className="btn btn-sm btn-primary"
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}