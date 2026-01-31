type JwtPayload = {
    exp?: number;
    role?: string;
    [key: string]: unknown;
};

const parseJwtPayload = (token: string): JwtPayload | null => {
    try {
        const payloadBase64 = token.split(".")[1];
        if (!payloadBase64) return null;

        const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
};

export const getRoleFromToken = (token: string): string | null => {
    const payload = parseJwtPayload(token);
    const role = payload?.role;
    return typeof role === "string" ? role : null;
};

export const isTokenExpired = (token: string): boolean => {
    const payload = parseJwtPayload(token);
    const exp = payload?.exp;

    if (typeof exp !== "number") return true;

    const nowSeconds = Math.floor(Date.now() / 1000);
    return exp <= nowSeconds;
};



