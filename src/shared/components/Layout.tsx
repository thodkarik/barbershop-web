import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

export default function Layout() {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <header className="bg-white shadow">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    {/* Left */}
                    <Link to="/" className="text-lg font-bold">
                        BarberShop
                    </Link>

                    {/* Right */}
                    <nav className="flex items-center gap-3">
                        {auth.isAuthenticated ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}


