import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";

// Pages
import App from './App.tsx';
import SignInPage from './pages/auth/SignIn.tsx';
import SignUpPage from './pages/auth/SignUp.tsx';

// Layouts
import AuthLayout from './layouts/auth.tsx';

// CSS
import './index.css';
import 'virtual:uno.css';

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    Component: AuthLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        Component: SignInPage,
      },
      {
        path: "signup",
        Component: SignUpPage,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
