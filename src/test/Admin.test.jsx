// src/test/Admin.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Admin from '../pages/Admin'
import { apiService } from '../api/apiService'
 
vi.mock('../api/apiService', () => ({
  apiService: {
    getProductos: vi.fn(),
    getCategorias: vi.fn(),
    actualizarProducto: vi.fn(),
    desactivarProducto: vi.fn(),
    eliminarProducto: vi.fn(),
    crearProducto: vi.fn(),
    validateAdmin: vi.fn(),
  },
}))



describe('Admin Component - Gestión de Productos', () => {
  const mockProductos = [
    {
      id: 1,
      nombre: 'Producto 1',
      descripcion: 'Descripción del producto 1',
      precio: 10000,
      stock: 50,
      categoriaId: 1,
      activo: true
    },
    {
      id: 2,
      nombre: 'Producto 2',
      descripcion: 'Descripción del producto 2',
      precio: 20000,
      stock: 30,
      categoriaId: 2,
      activo: false
    }
  ]

  const mockCategorias = [
    { id: 1, nombre: 'Categoría 1' },
    { id: 2, nombre: 'Categoría 2' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Configurar respuestas por defecto
    apiService.getProductos.mockResolvedValue(mockProductos)
    apiService.getCategorias.mockResolvedValue(mockCategorias)
    apiService.validateAdmin.mockReturnValue(true)
    
    // Mock de window.confirm y alert
    global.confirm = vi.fn(() => true)
    global.alert = vi.fn()
  })

   
  const loginAsAdmin = async () => {
    render(<Admin />)
    
    const passwordInput = screen.getByPlaceholderText(/ingrese contraseña admin/i)
    const loginButton = screen.getByRole('button', { name: /ingresar/i })
    
    await userEvent.type(passwordInput, 'admin123')
    await userEvent.click(loginButton)
    
    // Esperar a que cargue la tabla
    await waitFor(() => {
      expect(screen.getByText(/panel de administración/i)).toBeInTheDocument()
    })
  }
//1
  describe('Autenticación', () => {
    it('debe mostrar la pantalla de login inicialmente', () => {
      render(<Admin />)
      
      expect(screen.getByText(/acceso administrador/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/ingrese contraseña admin/i)).toBeInTheDocument()
    })
//2
    it('debe permitir login con contraseña correcta', async () => {
      await loginAsAdmin()
      
      expect(screen.getByText(/panel de administración/i)).toBeInTheDocument()
    })
//3
    it('debe rechazar login con contraseña incorrecta', async () => {
      apiService.validateAdmin.mockReturnValue(false)
      render(<Admin />)
      
      const passwordInput = screen.getByPlaceholderText(/ingrese contraseña admin/i)
      const loginButton = screen.getByRole('button', { name: /ingresar/i })
      
      await userEvent.type(passwordInput, 'wrong_password')
      await userEvent.click(loginButton)
      
      expect(global.alert).toHaveBeenCalledWith('Contraseña incorrecta')
    })
  })
//4
  describe('Carga y renderizado de productos', () => {
    it('debe cargar y renderizar todos los productos', async () => {
      await loginAsAdmin()
      
      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
        expect(screen.getByText('Producto 2')).toBeInTheDocument()
      })
    })
//5
    it('debe mostrar correctamente el estado "Activo" para productos activos', async () => {
      await loginAsAdmin()
      
      await waitFor(() => {
        const badges = screen.getAllByText(/activo/i)
        expect(badges.length).toBeGreaterThan(0)
      })
    })
//6
    it('debe mostrar correctamente el estado "Inactivo" para productos inactivos', async () => {
      await loginAsAdmin()
      
      await waitFor(() => {
        const inactiveBadge = screen.getByText(/inactivo/i)
        expect(inactiveBadge).toBeInTheDocument()
        expect(inactiveBadge).toHaveClass('bg-secondary')
      })
    })
//7
    it('debe mostrar precios formateados correctamente', async () => {
      await loginAsAdmin()
      
      await waitFor(() => {
        expect(screen.getByText(/\$10\.000/)).toBeInTheDocument()
        expect(screen.getByText(/\$20\.000/)).toBeInTheDocument()
      })
    })
//8
    it('debe mostrar los botones de acción correctos', async () => {
      await loginAsAdmin()
      
      await waitFor(() => {
        // Buscar botones por emoji o atributo
        const editButtons = screen.getAllByText('✏️')
        const deleteButtons = screen.getAllByText('🗑️')
        
        expect(editButtons.length).toBe(2)
        expect(deleteButtons.length).toBe(2)
      })
    })
  })
//9
  describe('Desactivar producto', () => {
    it('debe desactivar un producto cuando se confirma', async () => {
      apiService.desactivarProducto.mockResolvedValue({ success: true })
      
      await loginAsAdmin()
      
      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
      })
      
      // Click en botón desactivar del primer producto
      const desactivarButtons = screen.getAllByText('🚫')
      await userEvent.click(desactivarButtons[0])
      
      expect(global.confirm).toHaveBeenCalledWith('¿Está seguro de desactivar este producto?')
      
      await waitFor(() => {
        expect(apiService.desactivarProducto).toHaveBeenCalledWith(1)
        expect(global.alert).toHaveBeenCalledWith('Producto desactivado')
      })
    })
//10
    it('no debe desactivar producto si se cancela la confirmación', async () => {
      global.confirm = vi.fn(() => false)
      
      await loginAsAdmin()
      
      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
      })
      
      const desactivarButtons = screen.getAllByText('🚫')
      await userEvent.click(desactivarButtons[0])
      
      expect(global.confirm).toHaveBeenCalled()
      expect(apiService.desactivarProducto).not.toHaveBeenCalled()
      expect(global.alert).not.toHaveBeenCalled()
    })
//11
    it('debe manejar errores al desactivar', async () => {
      apiService.desactivarProducto.mockRejectedValue(new Error('Error de red'))
      
      await loginAsAdmin()
      
      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
      })
      
      const desactivarButtons = screen.getAllByText('🚫')
      await userEvent.click(desactivarButtons[0])
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error al desactivar producto')
      })
    })
  })
//12
  describe('Eliminar producto', () => {
    it('debe eliminar un producto cuando se confirma', async () => {
      apiService.eliminarProducto.mockResolvedValue({ success: true })
      
      await loginAsAdmin()
      
      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
      })
      
      const deleteButtons = screen.getAllByText('🗑️')
      await userEvent.click(deleteButtons[0])
      
      expect(global.confirm).toHaveBeenCalled()
      
      await waitFor(() => {
        expect(apiService.eliminarProducto).toHaveBeenCalledWith(1)
        expect(global.alert).toHaveBeenCalledWith('Producto eliminado')
      })
    })
  })
//13
  describe('Formulario de producto', () => {
    it('debe mostrar el formulario al hacer click en "Nuevo Producto"', async () => {
      await loginAsAdmin()
      
      const newButton = screen.getByRole('button', { name: /nuevo producto/i })
      await userEvent.click(newButton)
      
      expect(screen.getByText(/crear producto/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/precio/i)).toBeInTheDocument()
    })
//14
    it('debe crear un producto nuevo correctamente', async () => {
      apiService.crearProducto.mockResolvedValue({ id: 3, nombre: 'Nuevo Producto' })
      
      await loginAsAdmin()
      
      // Abrir formulario
      const newButton = screen.getByRole('button', { name: /nuevo producto/i })
      await userEvent.click(newButton)
      
      // Llenar formulario
      await userEvent.type(screen.getByLabelText(/nombre/i), 'Nuevo Producto')
      await userEvent.type(screen.getByLabelText(/precio/i), '15000')
      await userEvent.type(screen.getByLabelText(/stock/i), '10')
      
      // Enviar
      const submitButton = screen.getByRole('button', { name: /crear/i })
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(apiService.crearProducto).toHaveBeenCalled()
        expect(global.alert).toHaveBeenCalledWith('Producto creado correctamente')
      })
    })
  })
//15
  describe('Accesibilidad', () => {
    it('debe tener encabezados de tabla accesibles', async () => {
      await loginAsAdmin()
      
      await waitFor(() => {
        expect(screen.getByRole('columnheader', { name: /nombre/i })).toBeInTheDocument()
        expect(screen.getByRole('columnheader', { name: /precio/i })).toBeInTheDocument()
        expect(screen.getByRole('columnheader', { name: /stock/i })).toBeInTheDocument()
      })
    })
//16
    it('debe usar botones con atributos role correctos', async () => {
      await loginAsAdmin()
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })
})