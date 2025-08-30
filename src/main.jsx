import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";

import Home from "./pages/home";
import Teacher from "./pages/teacher";
import Student from "./pages/student";
import Admin from "./pages/admin";
import Notfound from "./pages/notfound";

const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

const Layout = ({ children }) => (
	<div className="min-h-screen flex flex-col">
		<div className="flex-grow min-h-full">{children}</div>
	</div>
);

const ProtectedRoute = ({ children }) => {
	if (!isLoggedIn) {
		return <Navigate to="/" replace />;
	}
	return children;
};

const router = createBrowserRouter([
	// Protected Pages --------------
	{
		path: "/teacher",
		element: (
			<Layout>
				<ProtectedRoute>
					<Teacher />
				</ProtectedRoute>
			</Layout>
		),
	},
	{
		path: "/student",
		element: (
			<Layout>
				<ProtectedRoute>
					<Student />
				</ProtectedRoute>
			</Layout>
		),
	},
	{
		path: "/admin",
		element: (
			<Layout>
				<ProtectedRoute>
					<Admin />
				</ProtectedRoute>
			</Layout>
		),
	},
	{
		path: "/",
		element: (
			<Layout>
				<Home />
			</Layout>
		),
	},

	{
		path: "*",
		element: (
			<Layout>
				<Notfound />
			</Layout>
		),
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
