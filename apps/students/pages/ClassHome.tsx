import logo from "@codi-go/ui/images/logo.png";
import { useLoaderData } from "react-router";
import { Icon } from "@/components";
import type { classLoader } from "@/router";

export function ClassHome() {
	const { classData } = useLoaderData<typeof classLoader>();

	return (
		<section className="ui-card w-full grid-(~ cols-[1fr_3fr_1fr]) items-center py-2">
			<img src={logo} alt="Logo do CodiGO!" className="w-full" />
			<h1 className="text-(4xl heading center) font-bold">{classData.name}</h1>
			<div
				className={`ui-button ${classData.is_playing ? "ui-button-primary" : "ui-button-danger"}`}
			>
				<Icon
					icon={
						classData.is_playing
							? "i-lucide-lock-keyhole-open"
							: "i-lucide-lock-keyhole"
					}
					color={classData.is_playing ? "on-primary" : "on-danger"}
					size={5}
				/>
				{classData.is_playing ? "Sala Aberta" : "Sala Fechada"}
			</div>
		</section>
	);
}
