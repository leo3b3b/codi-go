import { Outlet } from "react-router";
import icebergBackground from "@codi-go/ui/images/backgroundIceberg.png";
import mascot from "@codi-go/ui/images/codiPisca.png";
import logo from "@codi-go/ui/images/logo.png";

export default function AuthLayout() {
    return (
        <main className="grid h-screen bg-bg text-fg lg:grid-cols-2">
            <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
                <div className="w-full max-w-md">
                    <img
                        src={logo}
                        alt="CodiGO!"
                        className="mx-auto mb-3 h-18 w-auto object-contain lg:hidden"
                    />

                    <Outlet />
                </div>
            </section>

            <section
                className="relative hidden min-h-screen overflow-hidden bg-hero px-12 py-16 lg:(flex flex-col justify-between) xl:px-20"
                style={{
                    backgroundImage: `linear-gradient(180deg, var(--color-hero-overlay-start), var(--color-hero-overlay-end)), url(${icebergBackground})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.24),transparent_26%),radial-gradient(circle_at_80%_76%,rgba(230,201,255,0.34),transparent_24%)]" />

                <div className="relative max-w-md text-on-primary">
                    <img
                        src={logo}
                        alt="CodiGO!"
                        className="h-32 w-auto object-contain"
                    />

                    <h1 className="mt-6 text-4xl leading-tight font-black tracking-tight xl:text-5xl">
                        Pronto para se aventurar?
                    </h1>

                    <p className="mt-4 max-w-sm text-(lg on-primary/88) leading-relaxed">
                        Entre na sua conta e acompanhe a jornada dos seus alunos!
                    </p>
                </div>

                <img
                    src={mascot}
                    alt="Mascote do CodiGO!"
                    className="relative mx-auto mt-12 w-full max-w-sm object-contain xl:max-w-md"
                />
            </section>
        </main>
    );
}