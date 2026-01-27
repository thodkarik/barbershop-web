import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const auth = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            auth.login("demo-token");
            navigate("/appointments/me");
        } catch {
            setError("Login failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
            <h1 className="text-2xl font-bold">Login</h1>

            {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Password</label>
                    <input
                        type="password"
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-60"
                >
                    {isSubmitting ? "Signing in..." : "Login"}
                </button>
            </form>

            <p className="mt-4 text-sm">
                No account?{" "}
                <Link to="/register" className="font-medium underline">
                    Register
                </Link>
            </p>
        </div>
    );
};

export default LoginPage;

