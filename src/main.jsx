import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './components/custom/theme-provider.jsx';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Home, Scrape } from './pages/index';

// Define routes with createMemoryRouter
const router = createMemoryRouter([
  {
    path: `/`,
    element: <App />,
    children: [
      {
        path: `/`,
        element: <Home />
      },
      {
        path: `/scrape/:id`,
        element: <Scrape />
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);