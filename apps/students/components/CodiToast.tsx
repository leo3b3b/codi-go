import codiIcon from "@codi-go/ui/images/codi.png";
import type { Toast } from "react-hot-toast";

type CodiToastProps = {
	t: Toast;
};

export function CodiToast({ t }: CodiToastProps) {
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
					<p className="text-(xl heading) font-bold">Ops! Não deu certo.</p>

					<p className="mt-1 text-(base fg)">Tente escolher outra imagem.</p>
				</div>
			</div>
		</div>
	);
}
