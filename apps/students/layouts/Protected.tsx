import * as M from "@mantine/core";
import { Outlet, useLocation } from "react-router";
import { Header } from "@/components";
import { requireSession } from "@/middlewares";

export const clientMiddleware = [requireSession];

export default function ProtectedLayout() {
	const location = useLocation();

	return (
		<div className="ui-root">
			<Header />

			<M.Container
				key={location.pathname}
				component="main"
				size="xl"
				px={{ base: "md", sm: "xl" }}
				py={{ base: "lg", sm: "xl" }}
			>
				<Outlet />
			</M.Container>

			<M.Box
				pos="fixed"
				bottom={0}
				left="50%"
				style={{
					zIndex: 50,
					transform: "translateX(-50%)",
					pointerEvents: "none",
				}}
			>
				<span id="confettiDiv" />
			</M.Box>
		</div>
	);
}