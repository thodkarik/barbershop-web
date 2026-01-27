import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./authApi.ts"

const RegisterPage = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await register({
                firstName,
                lastName,
                username,
                email,
                phoneNumber,
                password,
            });

            navigate("/login");
        } catch (err: any) {
            const data = err?.response?.data;

            if (data?.errors) {
                const messages = Object.values(data.errors).flat().join(", ");
                setError(messages);
            } else {
                setError(data?.message || data?.title || "Registration failed");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
            <h1 className="text-2xl font-bold">Register</h1>

            {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-medium">First name</label>
                        <input
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Last name</label>
                        <input
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium">Phone number</label>
                    <input
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        autoComplete="tel"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Username</label>
                    <input
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
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
                        autoComplete="new-password"
                        required
                    />
                </div>
                <p className="mt-1 text-xs text-gray-600">
                    Password must include uppercase, lowercase, number and special character.
                </p>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-60"
                >
                    {isSubmitting ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="mt-4 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="font-medium underline">
                    Login
                </Link>
            </p>
        </div>
    );
};

export default RegisterPage;

