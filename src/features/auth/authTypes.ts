export type AuthContextValue = {
    token: string | null;
    isAuthenticated: boolean;
    role: string | null;
    login: (token: string) => void;
    logout: () => void;
};

