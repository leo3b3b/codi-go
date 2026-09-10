import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

// Components
import App from './App.tsx';

// CSS
import './index.css';
import 'virtual:uno.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
