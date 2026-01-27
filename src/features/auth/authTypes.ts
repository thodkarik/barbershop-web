export type AuthState = {
    token: string | null;
    isAuthenticated: boolean;
};

export type AuthContextValue = AuthState & {
    login: (token: string) => void;
    logout: () => void;
};
