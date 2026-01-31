import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth.ts";
import { getRoleFromToken } from "../../shared/utils/jwt";

type Props = {
    allowed: string[];
};

const RoleRoute = ({ allowed }: Props) => {
    const { token } = useAuth();

    if (!token) return <Navigate to="/login" replace />;

    const role = getRoleFromToken(token);
    if (!role || !allowed.includes(role)) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default RoleRoute;
