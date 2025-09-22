import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils'
import '@testing-library/jest-dom'
import LoginForm from '../LoginForm'

describe('LoginForm', () => {
  const mockOnSubmit = vi.fn()

  it('renders login form correctly', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation errors for invalid email', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.input(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with valid data', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />)

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })
})