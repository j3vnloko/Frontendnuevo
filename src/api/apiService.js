// ================== CONFIGURACIÓN ==================
const API_BASE_URL = "http://localhost:8080/api";

// ================== HANDLER DE RESPUESTAS ==================
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(errorData.error || errorData.message || "Error en la petición");
  }

  if (response.status === 204) return null;
  return response.json();
};

// ================== API SERVICE ==================
export const apiService = {

  // ---------------------------------------------------
  // 🟦 PRODUCTOS
  // ---------------------------------------------------

  async getProductos() {
    const resp = await fetch(`${API_BASE_URL}/productos`);
    return handleResponse(resp);
  },

  async getProductoById(id) {
    const resp = await fetch(`${API_BASE_URL}/productos/${id}`);
    return handleResponse(resp);
  },

  async crearProducto(producto) {
    const body = {
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: parseInt(producto.precio),
      stock: parseInt(producto.stock) || 0,
      activo: producto.activo ?? true,
      imagenUrl: producto.imagenUrl || null,
      categoria: producto.categoriaId ? { id: parseInt(producto.categoriaId) } : null
    };

    const resp = await fetch(`${API_BASE_URL}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(body)
    });

    return handleResponse(resp);
  },

  async actualizarProducto(id, producto) {
    const body = {
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: parseInt(producto.precio),
      stock: parseInt(producto.stock) || 0,
      activo: producto.activo,
      imagenUrl: producto.imagenUrl || null,
      categoria: producto.categoriaId ? { id: parseInt(producto.categoriaId) } : null
    };

    const resp = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(body)
    });

    return handleResponse(resp);
  },

  async desactivarProducto(id) {
    const resp = await fetch(`${API_BASE_URL}/productos/${id}/desactivar`, {
      method: "PATCH",
      headers: { "Accept": "application/json" }
    });
    return handleResponse(resp);
  },

  async activarProducto(id) {
    const resp = await fetch(`${API_BASE_URL}/productos/${id}/activar`, {
      method: "PATCH",
      headers: { "Accept": "application/json" }
    });
    return handleResponse(resp);
  },

  async eliminarProducto(id) {
    const resp = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: "DELETE"
    });
    return handleResponse(resp);
  },

  // ---------------------------------------------------
  // 🟩 CATEGORÍAS
  // ---------------------------------------------------

  async getCategorias() {
    const resp = await fetch(`${API_BASE_URL}/categorias`);
    return handleResponse(resp);
  },

  async getCategoriaById(id) {
    const resp = await fetch(`${API_BASE_URL}/categorias/${id}`);
    return handleResponse(resp);
  },

  async crearCategoria(categoria) {
    const resp = await fetch(`${API_BASE_URL}/categorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(categoria)
    });
    return handleResponse(resp);
  },

  async actualizarCategoria(id, categoria) {
    const resp = await fetch(`${API_BASE_URL}/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(categoria)
    });
    return handleResponse(resp);
  },

  async eliminarCategoria(id) {
    const resp = await fetch(`${API_BASE_URL}/categorias/${id}`, {
      method: "DELETE"
    });
    return handleResponse(resp);
  },

  // ---------------------------------------------------
  // 🔐 AUTENTICACIÓN
  // ---------------------------------------------------

  async login(email, password) {
    const resp = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(resp);
  },

  async registrarUsuario(usuario) {
    const resp = await fetch(`${API_BASE_URL}/auth/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });
    return handleResponse(resp);
  },

  // ---------------------------------------------------
  // 🛒 CARRITO (COMPLETO Y CORREGIDO)
  // ---------------------------------------------------

  async obtenerCarrito(usuarioId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/carrito/${usuarioId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      throw error;
    }
  },

  async agregarAlCarrito(usuarioId, productoId, cantidad) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/carrito/${usuarioId}/agregar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productoId, cantidad })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      throw error;
    }
  },

  async actualizarCantidadCarrito(usuarioId, itemId, cantidad) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/carrito/${usuarioId}/item/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ cantidad })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      throw error;
    }
  },

  async eliminarItemCarrito(usuarioId, itemId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/carrito/${usuarioId}/item/${itemId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error al eliminar item:", error);
      throw error;
    }
  },

  async vaciarCarrito(usuarioId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/carrito/${usuarioId}/vaciar`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.status === 204) return null;
      return await handleResponse(response);
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
      throw error;
    }
  },

  // ---------------------------------------------------
  // 📦 ÓRDENES / HISTORIAL / BOLETA
  // ---------------------------------------------------

  async crearOrden(usuarioId) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const resp = await fetch(`${API_BASE_URL}/ordenes/${usuarioId}/crear`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(errorData.error || errorData.message || "Error al crear la orden");
  }

  return resp.json();
},

  async obtenerHistorialUsuario(usuarioId) {
    const token = localStorage.getItem("token");

    const resp = await fetch(`${API_BASE_URL}/ordenes/usuario/${usuarioId}/historial`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return handleResponse(resp);
  },

  async obtenerTodasLasOrdenes() {
    const token = localStorage.getItem("token");

    const resp = await fetch(`${API_BASE_URL}/ordenes/admin/todas`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return handleResponse(resp);
  },

  async descargarBoleta(ordenId) {
    const token = localStorage.getItem("token");

    const resp = await fetch(`${API_BASE_URL}/ordenes/${ordenId}/boleta`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!resp.ok) throw new Error("Error al descargar boleta");

    const blob = await resp.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `boleta_${ordenId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  }
};
