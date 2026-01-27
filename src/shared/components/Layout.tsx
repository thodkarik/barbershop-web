import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
                    <Link to="/" className="text-lg font-bold">
                        BarberShop
                    </Link>

                    <nav className="flex gap-4 text-sm">
                        <Link to="/" className="hover:underline">Services</Link>
                        <Link to="/appointments/book" className="hover:underline">Book</Link>
                        <Link to="/appointments/me" className="hover:underline">My Appointments</Link>
                        <Link to="/login" className="hover:underline">Login</Link>
                        <Link to="/register" className="hover:underline">Register</Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-5xl p-4">
                <Outlet />
            </main>
        </div>
    );
}
