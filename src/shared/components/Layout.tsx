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
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
                    <Link to="/" className="text-lg font-bold">
                        BarberShop
                    </Link>

                    <nav className="flex items-center gap-4 text-sm">
                        <Link to="/">Services</Link>

                        {auth.isAuthenticated && (
                            <>
                                <Link to="/appointments/book">Book</Link>
                                <Link to="/appointments/me">My Appointments</Link>
                            </>
                        )}

                        {!auth.isAuthenticated ? (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="font-medium text-red-600 hover:underline"
                            >
                                Logout
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-5xl p-4">
                <Outlet />
            </main>
        </div>
    );
}

