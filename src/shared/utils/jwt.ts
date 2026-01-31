type JwtPayload = Record<string, unknown>;

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
    if (!payload) return null;

    const candidates = [
        "role",
        "roles",
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    ];

    for (const key of candidates) {
        const value = payload[key];

        if (typeof value === "string") return value;

        if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    }

    for (const [k, v] of Object.entries(payload)) {
        if (k.toLowerCase().endsWith("/role")) {
            if (typeof v === "string") return v;
            if (Array.isArray(v) && typeof v[0] === "string") return v[0];
        }
    }

    return null;
};

export const isTokenExpired = (token: string): boolean => {
    const payload = parseJwtPayload(token);
    if (!payload) return true;

    const exp = payload["exp"];

    if (typeof exp !== "number") return true;

    const nowSeconds = Math.floor(Date.now() / 1000);
    return exp <= nowSeconds;
};



