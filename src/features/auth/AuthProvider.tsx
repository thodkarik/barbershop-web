import { useEffect, useMemo, useState } from "react";
import type { AuthContextValue } from "./authTypes";
import { AuthContext } from "./AuthContext";
import { clearToken, getToken, setToken } from "../../shared/utils/tokenStorage";
import { isTokenExpired } from "../../shared/utils/jwt";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null>(() => {
        const storedToken = getToken();
        if (!storedToken) return null;

        if (isTokenExpired(storedToken)) {
            clearToken();
            return null;
        }

        return storedToken;
    });

    const isAuthenticated = !!token;

    const logout = () => {
        clearToken();
        setTokenState(null);
    };

    useEffect(() => {
        if (!token) return;

        if (isTokenExpired(token)) {
            clearToken();
            window.location.href = "/login";
            return;
        }

        const id = window.setInterval(() => {
            const current = getToken();
            if (!current || isTokenExpired(current)) {
                clearToken();
                window.location.href = "/login";
            }
        }, 30_000);

        return () => window.clearInterval(id);
    }, [token]);

    const value = useMemo<AuthContextValue>(() => {
        return {
            token,
            isAuthenticated,
            login: (newToken: string) => {
                setToken(newToken);
                setTokenState(newToken);
            },
            logout,
        };
    }, [token, isAuthenticated]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
