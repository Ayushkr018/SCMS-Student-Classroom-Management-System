import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Home from "./Components/home/app.jsx";

const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";


const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <div className="flex-grow min-h-full">{children}</div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/landing" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  // Protected Pages --------------
  // {
  //   path: "/",
  //   element: (
  //     <Layout>
  //       <ProtectedRoute>
  //         <Home />
  //       </ProtectedRoute>
  //     </Layout>
  //   ),
  // },

  // PUBLIC Pages -----------------
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },  {
    path: "/teacher",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },  {
    path: "/student",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },  {
    path: "/admin",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },

  // // 404 
  // {
  //   path: "*",
  //   element: (
  //     <Layout>
  //       <Notfound />
  //     </Layout>
  //   ),
  // },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
