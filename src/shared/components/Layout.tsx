import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { getRoleFromToken } from "../../shared/utils/jwt";

export default function Layout() {
    const auth = useAuth();
    const navigate = useNavigate();

    const role = auth.token ? getRoleFromToken(auth.token) : null;

    const handleLogout = () => {
        auth.logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    {/* Brand */}
                    <Link to="/" className="text-lg font-bold">
                        BarberShop
                    </Link>

                    {/* Nav */}
                    <nav className="flex items-center gap-4">
                        <Link to="/" className="text-sm font-medium hover:underline">
                            Services
                        </Link>

                        {auth.isAuthenticated && (role === "Customer") && (
                            <>
                                <Link
                                    to="/appointments/book"
                                    className="text-sm font-medium hover:underline"
                                >
                                    Book
                                </Link>
                                <Link
                                    to="/appointments/me"
                                    className="text-sm font-medium hover:underline"
                                >
                                    My Appointments
                                </Link>
                            </>
                        )}

                        {auth.isAuthenticated && (role === "Barber") && (
                            <Link
                                to="/barber/appointments"
                                className="text-sm font-medium hover:underline"
                            >
                                My Schedule
                            </Link>
                        )}

                        {auth.isAuthenticated && (role === "Receptionist" || role === "Admin") && (
                            <Link
                                to="/receptionist/appointments"
                                className="text-sm font-medium hover:underline"
                            >
                                Receptionist
                            </Link>
                        )}

                        {auth.isAuthenticated && role === "Admin" && (
                            <Link
                                to="/admin/services"
                                className="text-sm font-medium hover:underline"
                            >
                                Admin
                            </Link>
                        )}

                        <div className="ml-2 flex items-center gap-3">
                            {auth.isAuthenticated && role && (
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                                    Logged in as: {role}
                                </span>
                            )}

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
                        </div>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}