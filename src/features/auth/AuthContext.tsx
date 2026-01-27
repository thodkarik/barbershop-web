import { createContext, useContext, useMemo, useState } from "react";
import type { AuthContextValue } from "./authTypes.ts";
import { clearToken, getToken, setToken } from "../../shared/utils/tokenStorage";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null>(() => getToken());

    const isAuthenticated = !!token;

    const value = useMemo<AuthContextValue>(() => {
        return {
            token,
            isAuthenticated,
            login: (newToken: string) => {
                setToken(newToken);
                setTokenState(newToken);
            },
            logout: () => {
                clearToken();
                setTokenState(null);
            },
        };
    }, [token, isAuthenticated]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
