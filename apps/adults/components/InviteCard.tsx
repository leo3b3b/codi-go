import { useRevalidator } from "react-router";
import { Icon } from "@/components";
import { deleteMembership } from "@/services";
import { acceptInvite } from "@/services/memberships";

type InviteCardProps = {
	profile_id: string;
	school_id: string;
	legal_name: string;
	trade_name: string;
	user_role: "admin" | "teacher";
	invite_status: "active" | "pending";
};

export function InviteCard({
	profile_id,
	school_id,
	legal_name,
	trade_name,
	user_role,
	invite_status,
}: InviteCardProps) {
	const { revalidate } = useRevalidator();

	return (
		<article className="bg-surface-subtle px-3 py-2 rounded-lg md:(px-5 py-4)">
			<header className="mb-2 flex-(~ row) items-center justify-between">
				<h3 className="text-(lg heading) font-bold">{trade_name}</h3>
				<span className="text-primary">
					{user_role === "admin" ? "Administrador" : "Professor"}
				</span>
			</header>
			<p className="text-(sm muted) mb-4">{legal_name}</p>
			{invite_status === "active" ? (
				<button
					type="button"
					className="ui-button-(~ danger)"
					onClick={() => {
						deleteMembership({ profile_id, school_id });
						revalidate();
					}}
				>
					<Icon icon="i-lucide-log-out" color="on-danger" size={5} />
					Sair da escola
				</button>
			) : (
				<div className="flex-(~ row) gap-2">
					<button
						type="button"
						className="ui-button-(~ primary)"
						onClick={() => {
							acceptInvite({ profile_id, school_id });
							revalidate();
						}}
					>
						<Icon icon="i-lucide-check" color="on-primary" size={5} />
						Aceitar
					</button>
					<button
						type="button"
						className="ui-button-(~ danger)"
						onClick={() => {
							deleteMembership({ profile_id, school_id });
							revalidate();
						}}
					>
						<Icon icon="i-lucide-x" color="on-danger" size={5} />
						Recusar
					</button>
				</div>
			)}
		</article>
	);
}
