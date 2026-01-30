import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { login } from "./api.auth.ts";
import { getRoleFromToken } from "../../shared/utils/jwt";


import Button from "../../shared/components/ui/Button";
import TextInput from "../../shared/components/ui/TextInput";
import Alert from "../../shared/components/ui/Alert";

const LoginPage = () => {
    const navigate = useNavigate();
    const auth = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const result = await login({ username, password });
            auth.login(result.token);
            const role = getRoleFromToken(result.token);

            if (role === "Admin") {
                navigate("/admin/services");
            } else if (role === "Barber") {
                navigate("/barber/appointments");
            } else if (role === "Receptionist") {
                navigate("/receptionist/appointments");
            } else {
                navigate("/appointments/me");
            }
        } catch (err: any) {
            const data = err?.response?.data;
            const msg =
                data?.message ||
                data?.title ||
                (typeof data === "string" ? data : null) ||
                "Invalid username or password";
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
            <h1 className="text-2xl font-bold">Login</h1>
            <p className="mt-1 text-sm text-gray-600">Sign in to book appointments.</p>

            {error && (
                <div className="mt-4">
                    <Alert variant="error">{error}</Alert>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <TextInput
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                />

                <TextInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Signing in..." : "Login"}
                </Button>
            </form>

            <p className="mt-4 text-sm text-gray-600">
                No account?{" "}
                <Link to="/register" className="font-medium text-black hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
};

export default LoginPage;


