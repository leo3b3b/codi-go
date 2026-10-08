import {
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
	theme,
} from "@codi-go/ui";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import "@codi-go/ui/styles.css";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" {...mantineHtmlProps}>
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>CodiGO!</title>
				<link rel="icon" href="/favicon.svg" />
				<ColorSchemeScript />
				<Meta />
				<Links />
			</head>
			<body>
				<MantineProvider theme={theme}>{children}</MantineProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function Root() {
	return <Outlet />;
}
