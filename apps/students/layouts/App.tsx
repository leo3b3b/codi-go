import * as M from "@mantine/core";
import { Outlet, useLocation } from "react-router";

export default function AppLayout() {
	const location = useLocation();

	return (
		<div className="ui-root">
			<M.Container
				key={location.pathname}
				component="main"
				size="xl"
				px={{ base: "md", sm: "xl", lg: "2xl" }}
				py={{ base: "lg", lg: "xl" }}
			>
				<Outlet />
			</M.Container>
		</div>
	);
}