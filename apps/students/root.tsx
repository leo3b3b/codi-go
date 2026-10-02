import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import "@codi-go/ui/css";
import "virtual:uno.css";
import { Toaster } from "react-hot-toast";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>CodiGO!</title>
				<link rel="icon" href="/favicon.svg" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function Root() {
	return (
		<>
			<Outlet />

			<Toaster
				position="top-center"
				toastOptions={{
					duration: 3000,
					style: {
						background: "var(--color-surface)",
						color: "var(--color-fg)",
						padding: "8px",
					},
				}}
			/>
		</>
	);
}
