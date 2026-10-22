import {
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
	Notifications,
	theme,
	UI,
} from "@codi-go/ui";
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	useRouteError,
} from "react-router";

import "@codi-go/ui/styles.css";

export const Layout = ({ children }: { children: React.ReactNode }) => (
	<html lang="pt-BR" {...mantineHtmlProps}>
		<head>
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>CodiGO!</title>
			<link rel="icon" href="/favicon.svg" />
			<ColorSchemeScript defaultColorScheme="auto" />
			<Meta />
			<Links />
		</head>
		<body>
			<MantineProvider theme={theme} defaultColorScheme="auto">
				<Notifications />
				{children}
			</MantineProvider>
			<Scripts />
		</body>
	</html>
);

export default function Root() {
	return <Outlet />;
}

export const HydrateFallback = () => (
	<UI.Box className="ui-root">
		<UI.Stack h="100%" align="center" justify="center">
			<UI.Loader />
			<UI.Image w={200} h={200} src="/codiPisca.png" aria-hidden />
		</UI.Stack>
	</UI.Box>
);

export function ErrorBoundary() {
	const error = useRouteError();
	const status = isRouteErrorResponse(error) ? error.status : 500;
	const message = getErrorMessage(error);

	return (
		<main className="ui-root">
			<UI.Container size="sm" py="xl">
				<UI.Paper w="100%" p="xl">
					<UI.Stack align="center" gap="md">
						<UI.Text c="dimmed" size="sm" fw={600}>
							Erro {status}
						</UI.Text>
						<UI.Title order={1} ta="center">
							Não foi possível abrir esta página
						</UI.Title>
						<UI.Text c="dimmed" ta="center">
							{message}
						</UI.Text>
						<UI.Text ta="center" size="sm">
							<UI.Anchor href="/">
								Clique aqui para voltar à página inicial
							</UI.Anchor>
						</UI.Text>
					</UI.Stack>
				</UI.Paper>
			</UI.Container>
		</main>
	);
}

const ERROR_MESSAGES: Record<number, string> = {
	400: "A solicitação é inválida.",
	401: "Você precisa entrar na sua conta para continuar.",
	403: "Você não tem permissão para acessar esta página.",
	404: "A página solicitada não foi encontrada.",
	408: "A solicitação demorou demais. Tente novamente.",
	409: "Não foi possível concluir a operação devido a um conflito.",
	422: "Não foi possível processar os dados enviados.",
	429: "Muitas solicitações foram feitas. Aguarde um pouco e tente novamente.",
	500: "Ocorreu um erro interno. Tente novamente mais tarde.",
	502: "O serviço está temporariamente indisponível.",
	503: "O serviço está temporariamente indisponível.",
	504: "O serviço demorou demais para responder.",
};

function getErrorMessage(error: unknown): string {
	if (isRouteErrorResponse(error)) {
		if (error.status === 404) return ERROR_MESSAGES[404];
		if (typeof error.data === "string" && error.data.trim()) return error.data;
		return ERROR_MESSAGES[error.status] ?? "Ocorreu um erro inesperado.";
	}
	return "Ocorreu um erro inesperado.";
}
