import { type ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '../store'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Explicitly export only the required testing-library functions
export {
  render as rtlRender,
  screen,
  fireEvent,
  waitFor,
  act,
  cleanup,
  within,
  getByText,
  getByRole,
  getByLabelText,
  getByTestId,
  queryByText,
  queryByRole,
  queryByLabelText,
  queryByTestId,
  findByText,
  findByRole,
  findByLabelText,
  findByTestId,
} from '@testing-library/react'
export { customRender as render }