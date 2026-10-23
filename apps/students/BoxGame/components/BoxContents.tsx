import { UI } from "@codi-go/ui";
import { type ObjectType, objectImages } from "../types";

type BoxContentsProps = {
	objects: ObjectType[];
};

export const BoxContents = ({ objects }: BoxContentsProps) => (
	<UI.Stack gap="md">
		<UI.Title order={2} ta="center">
			A caixa misteriosa
		</UI.Title>

		<UI.Box
			w="100%"
			p="md"
			style={{
				border: "6px solid #a66b36",
				borderRadius: "var(--mantine-radius-lg)",
				background: "#fff8eb",
				minHeight: 320,
			}}
		>
			<UI.SimpleGrid cols={{ base: 2, sm: 3 }} spacing="lg">
				{objects.map((object, index) => (
					<UI.Stack key={`${object}-${index}`} gap="xs" align="center">
						<img
							src={objectImages[object].src}
							alt=""
							draggable={false}
							style={{
								width: 96,
								height: 96,
								objectFit: "contain",
							}}
						/>

						<UI.Text size="sm" ta="center">
							{objectImages[object].label}
						</UI.Text>
					</UI.Stack>
				))}
			</UI.SimpleGrid>
		</UI.Box>
	</UI.Stack>
);
