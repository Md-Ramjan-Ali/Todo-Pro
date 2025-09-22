import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils'
import TodoForm from '../TodoForm'
import { todoService } from '../../../services/todoService'

vi.mock('../../../services/todoService')

describe('TodoForm', () => {
  const mockOnClose = vi.fn()
  const mockOnTodoChanged = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders create form correctly', () => {
    render(<TodoForm onClose={mockOnClose} onTodoChanged={mockOnTodoChanged} />)

    expect(screen.getByText('Create Todo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter todo title')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<TodoForm onClose={mockOnClose} onTodoChanged={mockOnTodoChanged} />)

    const submitButton = screen.getByText('Create')
    fireEvent.click(submitButton)

    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('creates a new todo successfully', async () => {
    const mockCreateTodo = vi.spyOn(todoService, 'createTodo').mockResolvedValue({
      id: '1',
      title: 'Test Todo',
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any)

    render(<TodoForm onClose={mockOnClose} onTodoChanged={mockOnTodoChanged} />)

    fireEvent.input(screen.getByPlaceholderText('Enter todo title'), {
      target: { value: 'Test Todo' }
    })

    fireEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        dueDate: '',
      })
      expect(mockOnTodoChanged).toHaveBeenCalled()
      expect(mockOnClose).toHaveBeenCalled()
    })
  })
})