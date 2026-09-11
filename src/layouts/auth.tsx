import { Outlet } from "react-router";

function AuthLayout() {
    return (
        <main className="min-h-screen bg-bg text-fg flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <Outlet />
            </div>
        </main>
    );
}

export default AuthLayout;