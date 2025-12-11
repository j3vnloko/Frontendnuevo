import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.nombre.length > 100) {
      alert('El nombre no puede superar los 100 caracteres');
      return;
    }

    const dominiosValidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    const emailValido = dominiosValidos.some(dominio => formData.correo.endsWith(dominio));
    
    if (!emailValido) {
      alert('Dominio de correo no válido');
      return;
    }

    if (formData.mensaje.length > 500) {
      alert('El mensaje no puede superar los 500 caracteres');
      return;
    }

    // Guardar mensaje (simulación)
    const mensajes = JSON.parse(localStorage.getItem('mensajes') || '[]');
    mensajes.push({
      ...formData,
      id: Date.now(),
      fecha: new Date().toISOString()
    });
    localStorage.setItem('mensajes', JSON.stringify(mensajes));

    setEnviado(true);
    setFormData({ nombre: '', correo: '', mensaje: '' });

    setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <div style={{ marginTop: '100px', marginBottom: '50px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <Link to="/" className="btn btn-outline-secondary mb-4">
              ← Volver al inicio
            </Link>

            <div className="card shadow">
              <div className="card-body p-5">
                <h2 className="text-center mb-4">Contáctanos</h2>
                <p className="text-center text-muted mb-4">
                  ¿Tienes alguna pregunta, comentario o solicitud? Completa el formulario 
                  y nos pondremos en contacto contigo lo antes posible.
                </p>

                {enviado && (
                  <div className="alert alert-success">
                    ✓ ¡Mensaje enviado correctamente! Te contactaremos pronto.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      maxLength="100"
                      value={formData.correo}
                      onChange={(e) => setFormData({...formData, correo: e.target.value})}
                      required
                    />
                    <small className="text-muted">
                      Dominios válidos: @duoc.cl, @profesor.duoc.cl, @gmail.com
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mensaje o solicitud</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      maxLength="500"
                      value={formData.mensaje}
                      onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                      required
                    />
                    <small className="text-muted">
                      {formData.mensaje.length}/500 caracteres
                    </small>
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Enviar mensaje
                  </button>
                </form>

                {/* Información de contacto */}
                <div className="bg-light rounded p-4 mt-4">
                  <h5 className="mb-3">Información de contacto</h5>
                  <p className="mb-2">📧 Email: info@sativamente.com</p>
                  <p className="mb-2">📞 Teléfono: +56 9 1234 5678</p>
                  <p className="mb-0">🕐 Horario: Lunes a Viernes de 9:00 a 18:00 hrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}