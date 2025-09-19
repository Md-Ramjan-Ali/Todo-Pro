import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import './index.css'
import App from './App'

// Function to start the MSW worker
async function enableMocking() {
  // Only enable mocking in development
  if (import.meta.env.MODE !== 'development') {
    return
  }

  const { worker } = await import('./mocks/browser')

  // Start the worker
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
    // Quiet mode to reduce console noise
    quiet: true
  }).catch((error) => {
    console.warn('MSW setup failed, but continuing without mocking:', error)
  })
}

// Enable mocking and then render the app
enableMocking().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  )
})