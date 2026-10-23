import { UI } from "@codi-go/ui";

type SectionHeadingProps = {
	eyebrow: string;
	title: string;
	description: string;
};

export const SectionHeading = ({
	eyebrow,
	title,
	description,
}: SectionHeadingProps) => (
	<UI.Stack gap="md" align="center">
		<UI.Text
			size="sm"
			fw={700}
			c="violet"
			tt="uppercase"
			ta="center"
			style={{ letterSpacing: "0.09em" }}
		>
			{eyebrow}
		</UI.Text>

		<UI.Title
			order={2}
			size="clamp(2rem, 4vw, 3rem)"
			ta="center"
			lh={1.15}
			maw={820}
		>
			{title}
		</UI.Title>

		<UI.Text c="dimmed" ta="center" maw={760} lh={1.8}>
			{description}
		</UI.Text>
	</UI.Stack>
);
