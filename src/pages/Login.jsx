import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      await authService.login(formData.email, formData.password);
      alert('¡Inicio de sesión exitoso!');
      navigate('/');
      window.location.reload(); // Recargar para actualizar navbar
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '120px', maxWidth: '450px', marginBottom: '50px' }}>
      <div className="card shadow">
        <div className="card-body p-5">
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
          
          {mensaje && (
            <div className="alert alert-danger">{mensaje}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                placeholder="tu@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

            <div className="text-center">
              <small>¿No tienes cuenta? </small>
              <Link to="/registro">Crear una cuenta</Link>
            </div>

            <div className="text-center mt-3">
              <Link to="/" className="btn btn-outline-secondary w-100">
                ← Volver al Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}