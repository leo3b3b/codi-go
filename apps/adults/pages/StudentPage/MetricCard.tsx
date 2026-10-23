import { UI } from "@codi-go/ui";

type MetricCardProps = {
	label: string;
	value: string;
};

export const MetricCard = ({ label, value }: MetricCardProps) => (
	<UI.Paper component="article">
		<UI.Text size="sm" c="dimmed">
			{label}
		</UI.Text>

		<UI.Text size="xl" fw={700} mt="xs">
			{value}
		</UI.Text>
	</UI.Paper>
);
