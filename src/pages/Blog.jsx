import React from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const noticias = [
    {
      id: 1,
      titulo: 'CASO CURIOSO #1',
      descripcion: '¿Quiénes son los famosos que más consumen marihuana? Revísalo aquí',
      url: 'https://www.guioteca.com/mitos-y-enigmas/que-celebridades-mundiales-son-declarados-consumidores-de-marihuana/',
      imagen: '🌿'
    },
    {
      id: 2,
      titulo: 'CASO CURIOSO #2',
      descripcion: 'Los beneficios de la marihuana medicinal',
      url: 'https://conecta.tec.mx/es/noticias/nacional/salud/cuales-son-las-ventajas-del-cannabis-para-fines-medicinales',
      imagen: '💊'
    }
  ];

  return (
    <div style={{ marginTop: '100px', marginBottom: '50px' }}>
      <div className="container">
        <Link to="/" className="btn btn-outline-secondary mb-4">
          ← Volver al inicio
        </Link>

        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">NOTICIAS IMPORTANTES</h1>
          <p className="lead text-muted">
            Mantente informado con las últimas noticias y artículos sobre cannabis y cultivo
          </p>
        </div>

        <div className="row justify-content-center">
          {noticias.map(noticia => (
            <div key={noticia.id} className="col-12 mb-4">
              <div className="card shadow-sm">
                <div className="row g-0 align-items-center">
                  <div className="col-md-6 p-5">
                    <h3 className="fw-bold text-success">{noticia.titulo}</h3>
                    <p className="text-muted mb-4">{noticia.descripcion}</p>
                    <a 
                      href={noticia.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      VER CASO →
                    </a>
                  </div>
                  <div className="col-md-6 text-center bg-light p-5">
                    <div style={{ fontSize: '150px' }}>{noticia.imagen}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de información adicional */}
        <div className="bg-light rounded p-5 mt-5">
          <h3 className="text-center mb-4">¿Sabías que...?</h3>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="text-center">
                <div className="display-4 mb-3">🌱</div>
                <h5>Cultivo Sustentable</h5>
                <p className="text-muted">
                  El cannabis puede cultivarse de forma ecológica y sustentable
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="text-center">
                <div className="display-4 mb-3">🏥</div>
                <h5>Uso Medicinal</h5>
                <p className="text-muted">
                  Reconocido por sus propiedades terapéuticas en varios países
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="text-center">
                <div className="display-4 mb-3">📚</div>
                <h5>Educación</h5>
                <p className="text-muted">
                  La información correcta es clave para un cultivo exitoso
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}