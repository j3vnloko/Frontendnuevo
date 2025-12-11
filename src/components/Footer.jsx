import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-light py-5 mt-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-6">
            <h5>Suscríbete a nuestro Grow</h5>
            <p className="text-muted">Recibe las últimas ofertas y novedades.</p>
          </div>
          <div className="col-md-6">
            <form className="d-flex">
              <input 
                type="email" 
                className="form-control me-2" 
                placeholder="Tu email"
              />
              <button className="btn btn-dark" type="submit">
                Suscribirse
              </button>
            </form>
          </div>
        </div>
        
        <hr />
        
        <div className="row">
          <div className="col-md-6">
            <p className="mb-0">&copy; 2025 Sativamente. Todos los derechos reservados.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="text-muted">
              Contacto: info@sativamente.com | Tel: +56 9 1234 5678
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
}