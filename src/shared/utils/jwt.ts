export function decodeJwt(token: string): any {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
        atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );
    return JSON.parse(json);
}

export function getRoleFromToken(token: string): string | null {
    const payload = decodeJwt(token);

    // συχνά έρχεται είτε σαν "role" είτε σαν array
    const role =
        payload?.role ||
        payload?.roles?.[0] ||
        payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (Array.isArray(role)) return role[0] ?? null;
    return role ?? null;
}
