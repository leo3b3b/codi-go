import codiIcon from "@codi-go/ui/images/codi.png";
import type { Toast } from "react-hot-toast";

type CodiToastProps = {
	t: Toast;
	is_class_playing: boolean;
};

export function CodiToast({ t, is_class_playing }: CodiToastProps) {
	return (
		<div
			className={`
				pointer-events-auto w-[min(90vw,28rem)]
				transition-all duration-300
				${t.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
			`}
		>
			<div className="ui-card flex items-center gap-4 border-(2 danger/20) bg-bg p-4 shadow-lg">
				<img
					src={codiIcon}
					alt=""
					className="h-16 w-16 shrink-0 object-contain"
				/>

				<div className="flex-1">
					<p className="text-(xl heading) font-bold">
						{is_class_playing
							? "Ops! Não deu certo."
							: "Ops! A sala está fechada."}
					</p>

					<p className="mt-1 text-(base fg)">
						{is_class_playing
							? "Tente escolher outra imagem."
							: "Tente de novo depois"}
					</p>
				</div>
			</div>
		</div>
	);
}
