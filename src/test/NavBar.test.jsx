// src/test/NavBar.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../components/Navbar'

const renderNavbar = () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}
//17
describe('Navbar', () => {
  it('renderiza los enlaces principales', () => {
    renderNavbar()

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Productos')).toBeInTheDocument()
    expect(screen.getByText('Nosotros')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Contacto')).toBeInTheDocument()
  })
//18
  it('muestra el contador del carrito', () => {
    // Carrito vacío inicialmente
    localStorage.setItem('carrito', JSON.stringify([]))

    renderNavbar()

    expect(screen.getByText(/Carrito \(0\)/)).toBeInTheDocument()
  })
})
