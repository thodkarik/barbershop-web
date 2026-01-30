import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./api.auth.ts";

import Button from "../../shared/components/ui/Button";
import TextInput from "../../shared/components/ui/TextInput";
import Alert from "../../shared/components/ui/Alert";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                phoneNumber,
                username,
                email,
                password,
            });

            navigate("/login");
        } catch (err: any) {
            const data = err?.response?.data;
            const msg =
                data?.message ||
                data?.title ||
                (data?.errors ? Object.values(data.errors).flat().join(", ") : null) ||
                (typeof data === "string" ? data : null) ||
                "Registration failed";
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
            <h1 className="text-2xl font-bold">Register</h1>
            <p className="mt-1 text-sm text-gray-600">Create a new customer account.</p>

            {error && (
                <div className="mt-4">
                    <Alert variant="error">{error}</Alert>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <TextInput
                        label="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <TextInput
                        label="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <TextInput
                    label="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    autoComplete="tel"
                    required
                />

                <TextInput
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                />

                <TextInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />

                <div>
                    <TextInput
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                    <p className="mt-1 text-xs text-gray-600">
                        Password must include uppercase, lowercase, number and special character.
                    </p>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
            </form>

            <p className="mt-4 text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-black hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
};

export default RegisterPage;


