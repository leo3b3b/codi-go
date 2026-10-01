import { valibotResolver } from "@hookform/resolvers/valibot";
import { Controller, useForm } from "react-hook-form";
import { useRevalidator } from "react-router";
import { HorizontalSeparator, Icon, Select } from "@/components";
import { type InviteOutput, inviteSchema } from "@/schemas";
import { inviteUserToSchool } from "@/services";

export function InviteUserForm({
	school,
}: {
	school: {
		id: string;
		legal_name: string;
		trade_name: string;
		cnpj: string;
	};
}) {
	const { revalidate } = useRevalidator();

	const {
		register,
		handleSubmit,
		setError,
		watch,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<InviteOutput>({
		resolver: valibotResolver(inviteSchema),
		defaultValues: { role: "teacher" },
	});

	async function onSubmit({ username, role }: InviteOutput) {
		try {
			await inviteUserToSchool({
				username,
				role,
				school_id: school.id,
			});
		} catch {
			setError("root", {
				message: "Não foi possível convidar o usuário.",
			});
		}

		revalidate();
		reset();
	}

	return (
		<section className="ui-card">
			<header>
				<h1 className="text-(2xl heading) font-bold">
					Convidar Usuário para {school.trade_name || school.legal_name}
				</h1>
				<HorizontalSeparator />
			</header>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="
                            flex-(~ col)
                            gap-x-4 gap-y-2 py-3
                            md:grid-(~ cols-4)
                            lg:grid-cols-[2fr_1.5fr_1.25fr_1.25fr_2.5fr]
                            items-center
                        "
			>
				<div
					className="
                                flex-(~ row) relative items-center font-bold
                                w-full md:col-span-2 lg:col-span-3
                            "
				>
					<Icon
						icon="i-lucide-at-sign"
						color="muted"
						size={6}
						className="absolute left-3 pointer-events-none"
					/>

					<input
						type="text"
						{...register("username")}
						autoComplete="username"
						placeholder="Digite o nome do usuário"
						aria-invalid={Boolean(errors.username)}
						className="ui-field w-full h-14 pl-10"
					/>
				</div>

				<Controller
					name="role"
					control={control}
					render={({ field }) => (
						<Select
							aria-label="Cargo"
							value={field.value}
							onChange={field.onChange}
							options={[
								{ value: "teacher", label: "Professor" },
								{ value: "admin", label: "Administrador" },
							]}
							className="h-14 w-full"
						/>
					)}
				/>

				<button
					type="submit"
					disabled={isSubmitting || !watch("username")}
					className="ui-button-(~ primary) h-14 mt-4 md:mt-0"
				>
					{isSubmitting ? "Convidando..." : "Convidar"}
				</button>
			</form>
			{errors.username && (
				<p role="alert" className="text-(sm danger) font-medium">
					{errors.username.message}
				</p>
			)}
			{errors.role && (
				<p role="alert" className="text-(sm danger) font-medium">
					{errors.role.message}
				</p>
			)}
			{errors.root && (
				<p role="alert" className="ui-alert-danger">
					{errors.root.message}
				</p>
			)}
		</section>
	);
}
