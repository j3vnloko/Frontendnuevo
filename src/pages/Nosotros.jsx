import React from 'react';
import { Link } from 'react-router-dom';

export default function Nosotros() {
  return (
    <div style={{ marginTop: '100px', marginBottom: '50px' }}>
      <div className="container">
        <Link to="/" className="btn btn-outline-secondary mb-4">
          ← Volver al inicio
        </Link>

        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-4">¿Quiénes somos?</h1>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <p className="lead text-muted">
                Somos una empresa dedicada a la venta de productos para el cultivo de plantas,
                con años de experiencia en el mercado y un equipo de expertos que te asesorarán 
                en todo lo que necesites.
              </p>
              <p className="lead text-muted">
                Ofrecemos los mejores productos de calidad y al mejor precio.
              </p>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="row text-center mb-5">
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="display-4 mb-3">🎯</div>
                <h4>Misión</h4>
                <p className="text-muted">
                  Proveer productos de calidad para el cultivo, garantizando la satisfacción 
                  de nuestros clientes.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="display-4 mb-3">👁️</div>
                <h4>Visión</h4>
                <p className="text-muted">
                  Ser la tienda líder en productos de cultivo en Chile, reconocidos por nuestra 
                  calidad y servicio.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="display-4 mb-3">💚</div>
                <h4>Valores</h4>
                <p className="text-muted">
                  Honestidad, responsabilidad, calidad y compromiso con nuestros clientes 
                  y el medio ambiente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Equipo */}
        <div className="bg-light rounded p-5 text-center">
          <h3 className="mb-4">Nuestro Equipo</h3>
          <p className="text-muted mb-4">
            Contamos con profesionales expertos en cultivo y atención al cliente, 
            listos para ayudarte en cada paso.
          </p>
          <div className="row justify-content-center">
            <div className="col-md-3 mb-3">
              <div className="bg-white rounded p-3 shadow-sm">
                <div className="display-1 mb-2">👨‍💼</div>
                <h5>Jean Flores</h5>
                <small className="text-muted">Product Owner</small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="bg-white rounded p-3 shadow-sm">
                <div className="display-1 mb-2">👩‍🔬</div>
                <h5>Maria Ortis</h5>
                <small className="text-muted">Especialista en Cultivo, dueña Growshop</small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="bg-white rounded p-3 shadow-sm">
                <div className="display-1 mb-2">👨‍💻</div>
                <h5>Joshua Mardones</h5>
                <small className="text-muted">Scrum Master</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}