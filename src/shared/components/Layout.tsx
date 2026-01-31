import {NavLink, Outlet, useNavigate} from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

export default function Layout() {
    const auth = useAuth();
    const navigate = useNavigate();

    const role = auth.role;

    const handleLogout = () => {
        auth.logout();
        navigate("/login");
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "text-sm font-semibold text-black underline underline-offset-4"
            : "text-sm font-medium text-gray-700 hover:text-black";


    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    {/* Brand */}
                    <NavLink to="/" className={navLinkClass}>
                        BarberShop
                    </NavLink>

                    {/* Nav */}
                    <nav className="flex items-center gap-6">
                        {/* Navigation links */}
                        <div className="flex items-center gap-5">
                            <NavLink to="/" className={navLinkClass}>
                                Services
                            </NavLink>

                            {auth.isAuthenticated && role === "Customer" && (
                                <>
                                    <NavLink to="/appointments/book" className={navLinkClass}>
                                        Book Appointment
                                    </NavLink>
                                    <NavLink to="/appointments/me" className={navLinkClass}>
                                        My Appointments
                                    </NavLink>
                                </>
                            )}

                            {auth.isAuthenticated && role === "Barber" && (
                                <NavLink to="/barber/appointments" className={navLinkClass}>
                                    My Schedule
                                </NavLink>
                            )}

                            {auth.isAuthenticated && (role === "Receptionist" || role === "Admin") && (
                                <NavLink to="/receptionist/appointments" className={navLinkClass}>
                                    Manage Bookings
                                </NavLink>
                            )}

                            {auth.isAuthenticated && role === "Admin" && (
                                <NavLink to="/admin/services" className={navLinkClass}>
                                    Manage Services
                                </NavLink>
                            )}
                            {auth.isAuthenticated && role === "Admin" && (
                                <NavLink to="/admin/staff" className={navLinkClass}>
                                    Staff Directory
                                </NavLink>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="h-6 w-px bg-gray-300" />

                        {/* Auth actions */}
                        <div className="flex items-center gap-3">
                            {auth.isAuthenticated && role && (
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                                    {role} Access
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
                                    <NavLink
                                        to="/login"
                                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                                    >
                                        Login
                                    </NavLink>
                                    <NavLink
                                        to="/register"
                                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"
                                    >
                                        Register
                                    </NavLink>
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