import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService'; // ⭐ IMPORTANTE: agregado

export default function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    region: '',
    comuna: '',
    direccion: '',
    fechaNacimiento: ''
  });

  const [mensaje, setMensaje] = useState('');

  const regiones = ['Metropolitana', 'Valparaíso', 'Biobío', 'Araucanía'];
  const comunas = ['Santiago', 'Maipú', 'Providencia', 'Las Condes', 'Puente Alto'];

  // Validación simple de RUN sin puntos ni guion
  const validarRun = (run) => /^\d{7,8}[0-9kK]$/.test(run);

  // ⭐ NUEVA FUNCIÓN HANDLE SUBMIT (REEMPLAZA LA ANTERIOR)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!validarRun(formData.run)) {
      setMensaje('RUN inválido. Formato: 12345678K (sin puntos ni guion)');
      return;
    }

    if (formData.nombre.length > 50) {
      setMensaje('El nombre no puede superar los 50 caracteres');
      return;
    }

    if (formData.apellido.length > 100) {
      setMensaje('Los apellidos no pueden superar los 100 caracteres');
      return;
    }

    const dominiosValidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    const emailValido = dominiosValidos.some((d) => formData.email.endsWith(d));

    if (!emailValido) {
      setMensaje('Dominio de correo no válido');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMensaje('Las contraseñas no coinciden');
      return;
    }

    if (formData.direccion.length > 300) {
      setMensaje('La dirección no puede superar los 300 caracteres');
      return;
    }

    // ⭐ ENVÍO REAL AL BACKEND
    try {
      await authService.registro({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        rol: 'CLIENTE'
      });

      alert('¡Registro exitoso! Ya puedes iniciar sesión');
      navigate('/');
      window.location.reload();

    } catch (error) {
      setMensaje(error.message);
    }
  };

  return (
    <div className="container" style={{ marginTop: '120px', maxWidth: '600px', marginBottom: '50px' }}>
      <div className="card shadow">
        <div className="card-body p-5">
          <h2 className="text-center mb-4">Crear una Cuenta</h2>

          {mensaje && <div className="alert alert-danger">{mensaje}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">RUN *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="12345678K"
                  value={formData.run}
                  onChange={(e) => setFormData({ ...formData, run: e.target.value })}
                  required
                />
                <small className="text-muted">Sin puntos ni guion</small>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Fecha Nacimiento</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tu nombre"
                  maxLength="50"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Apellidos *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tus apellidos"
                  maxLength="100"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  required
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Correo *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="tu@ejemplo.com"
                  maxLength="100"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Contraseña *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Confirmar Contraseña *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Región *</label>
                <select
                  className="form-select"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  required
                >
                  <option value="">Seleccione...</option>
                  {regiones.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Comuna *</label>
                <select
                  className="form-select"
                  value={formData.comuna}
                  onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                  required
                >
                  <option value="">Seleccione...</option>
                  {comunas.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Dirección *</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Tu dirección completa"
                  maxLength="300"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-3">
              Registrarse
            </button>

            <div className="text-center">
              <Link to="/" className="btn btn-outline-secondary w-100 mb-2">
                ← Volver al Home
              </Link>
            </div>

            <div className="text-center mt-3">
              <span>¿Ya tienes cuenta? </span>
              <Link to="/login">Inicia sesión</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
