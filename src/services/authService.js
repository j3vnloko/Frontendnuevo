// src/services/authService.js
const API_BASE_URL = 'http://localhost:8080/api';

export const authService = {
  // ==================== LOGIN ====================
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensaje || 'Error al iniciar sesión');
    }

    const data = await response.json();
    
    // Guardar token y datos del usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify({
      id: data.id,
      nombre: data.nombre,
      email: data.email
    }));

    return data;
  },

  // ==================== REGISTRO ====================
  async registro(datos) {
    const response = await fetch(`${API_BASE_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensaje || 'Error al registrar usuario');
    }

    const data = await response.json();
    
    // Guardar token y datos del usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify({
      id: data.id,
      nombre: data.nombre,
      email: data.email
    }));

    return data;
  },

  // ==================== LOGOUT ====================
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('carrito');
  },

  // ==================== REFRESH TOKEN ====================
  async refreshToken() {
    const token = this.getToken();
    if (!token) throw new Error('No hay token');

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      this.logout();
      throw new Error('Token expirado');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  },

  // ==================== UTILIDADES ====================
  getToken() {
    return localStorage.getItem('token');
  },

  getUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  // Headers con autorización
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }
};