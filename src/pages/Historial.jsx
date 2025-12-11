import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../api/apiService';
import { authService } from '../services/authService';

export default function Historial() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const usuario = authService.getUsuario();

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      const data = await apiService.obtenerHistorialUsuario(usuario.id);
      setOrdenes(data);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      alert('Error al cargar el historial de compras');
    } finally {
      setLoading(false);
    }
  };

  const descargarBoleta = async (ordenId) => {
    try {
      await apiService.descargarBoleta(ordenId);
    } catch (error) {
      alert('Error al descargar la boleta');
    }
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ marginTop: '150px' }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '100px', marginBottom: '50px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📋 Historial de Compras</h2>
        <Link to="/" className="btn btn-outline-secondary">
          ← Volver al Inicio
        </Link>
      </div>

      {ordenes.length === 0 ? (
        <div className="alert alert-info text-center">
          No tienes compras realizadas aún.
        </div>
      ) : (
        <div className="row">
          {ordenes.map(orden => (
            <div key={orden.id} className="col-12 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <strong>Boleta: {orden.numeroBoleta}</strong>
                      <br />
                      <small className="text-muted">
                        {new Date(orden.fecha).toLocaleString('es-CL')}
                      </small>
                    </div>
                    <div className="col-md-3">
                      <small className="text-muted">Subtotal</small>
                      <br />
                      <strong>${orden.subtotal?.toLocaleString()}</strong>
                    </div>
                    <div className="col-md-2">
                      <small className="text-muted">IVA (19%)</small>
                      <br />
                      <strong>${orden.iva?.toLocaleString()}</strong>
                    </div>
                    <div className="col-md-2">
                      <small className="text-muted">Total</small>
                      <br />
                      <strong className="text-success">
                        ${orden.total?.toLocaleString()}
                      </strong>
                    </div>
                    <div className="col-md-2 text-end">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => descargarBoleta(orden.id)}
                      >
                        📄 Descargar
                      </button>
                    </div>
                  </div>

                  <hr />

                  <small className="text-muted">
                    <strong>Productos:</strong>
                  </small>
                  <ul className="list-unstyled mb-0">
                    {orden.items?.map((item, idx) => (
                      <li key={idx}>
                        • {item.producto.nombre} - Cant: {item.cantidad} - 
                        ${item.precioUnitario?.toLocaleString()} c/u
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}