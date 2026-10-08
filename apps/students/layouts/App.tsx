import * as UI from "@codi-go/ui";
import { Outlet, useLocation } from "react-router";

export default function AppLayout() {
	const location = useLocation();

	return (
		<div className="ui-root">
			<UI.Container
				key={location.pathname}
				component="main"
				size="xl"
				px={{ base: "md", sm: "xl", lg: "2xl" }}
				py={{ base: "lg", lg: "xl" }}
			>
				<Outlet />
			</UI.Container>
		</div>
	);
}