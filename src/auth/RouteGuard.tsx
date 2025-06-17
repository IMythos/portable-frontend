import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth"
import { rolePermissions } from "./rolePermissions";

interface RouteGuardProps {
    children: React.ReactNode;
    routeKey: string;
}

const RouteGuard = ({ children, routeKey }: RouteGuardProps) => {
    const { role, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-indigo-500 border-solid"></div>
                <span className="ml-4 text-gray-600">Verificando permisos...</span>
            </div>
        );
    }

    if (!role || !rolePermissions[role]?.includes(routeKey)) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return <>{children}</>
}

export default RouteGuard;