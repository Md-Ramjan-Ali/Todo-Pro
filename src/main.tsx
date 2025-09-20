import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import './index.css'
import App from './App'

// Start the mocking conditionally
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return
  }

  try {
    const { worker } = await import('./mocks/browser')

    // Test if MSW is working by making a simple request
    const testResponse = await fetch('/test-msw');
    if (testResponse.status === 404) {
      console.log('MSW is working correctly');
    }

    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      quiet: false, // Show MSW logs for debugging
    }).then(() => {
      console.log('MSW worker started successfully');
    }).catch((error) => {
      console.warn('MSW worker failed to start:', error);
    });
  } catch (error) {
    console.warn('MSW import failed, continuing without mocking:', error);
  }
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
});