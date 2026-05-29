import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Navbar from '../components/Navbar'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>
}

describe('Navbar quick search', () => {
  it('navigates to the search page with the submitted query', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
        <LocationDisplay />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByPlaceholderText(/rechercher un livre/i), {
      target: { value: 'Dune' },
    })

    fireEvent.submit(screen.getByRole('button', { name: /rechercher/i }).closest('form'))

    expect(screen.getByTestId('location')).toHaveTextContent('/search?q=Dune')
  })
})

