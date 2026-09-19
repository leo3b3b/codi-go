import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from './App.tsx';
import { AuthLayout, CheckEmailPage, SignInPage, SignUpPage } from '@/features/auth';

import '@codi-go/ui/css';
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
        path: "login",
        Component: SignInPage,
      },
      {
        path: "signup",
        Component: SignUpPage,
      },
      {
        path: "check-email",
        Component: CheckEmailPage,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
