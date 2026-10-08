import * as UI from "@codi-go/ui";
import { Outlet, useLocation } from "react-router";
import { Header } from "@/components";
import { requireSession } from "@/middlewares";

export const clientMiddleware = [requireSession];

export default function ProtectedLayout() {
	const location = useLocation();

	return (
		<div className="ui-root">
			<Header />

			<UI.Container
				key={location.pathname}
				component="main"
				size="xl"
				px={{ base: "md", sm: "xl" }}
				py={{ base: "lg", sm: "xl" }}
			>
				<Outlet />
			</UI.Container>

			<UI.Box
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
			</UI.Box>
		</div>
	);
}