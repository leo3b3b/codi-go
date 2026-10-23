import { UI } from "@codi-go/ui";
import * as Self from "./LandingPage";

const LandingPage = () => (
	<UI.Box className="ui-root" mih="100vh">
		<Self.Header />
		<UI.Container size="xl" px={{ base: "md", md: "xl" }}>
			<main>
				<Self.Hero />
				<Self.AccessBenefits />
				<Self.PillarsSection />
				<Self.HowItWorksSection />
				<Self.SchoolValueSection />
				<Self.FAQSection />
				<Self.FinalCTASection />
			</main>

			<Self.Footer />
		</UI.Container>
	</UI.Box>
);

export default LandingPage;
