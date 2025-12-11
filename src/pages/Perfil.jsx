import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = authService.getUsuario();
    setUsuario(user);
  }, []);

  if (!usuario) {
    return <div className="container mt-5">Cargando...</div>;
  }

  return (
    <div className="container" style={{ marginTop: '100px', marginBottom: '50px' }}>
      <h2 className="mb-4">Mi Perfil</h2>
      
      <div className="card shadow">
        <div className="card-body p-4">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Nombre</label>
              <p className="form-control-plaintext">{usuario.nombre}</p>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Email</label>
              <p className="form-control-plaintext">{usuario.email}</p>
            </div>
          </div>

          <hr />

          <div className="d-flex gap-2">
            <Link to="/historial" className="btn btn-primary">
              📋 Ver Mis Compras
            </Link>
            <Link to="/" className="btn btn-outline-secondary">
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}