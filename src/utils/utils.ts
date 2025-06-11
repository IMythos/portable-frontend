import { useNavigate } from "react-router-dom";

export function useRouteHandler() {
    const navigate = useNavigate();

    return (path: string) => {
        const validRoutes = ["/dashboard", "/dashboard/sales", "/dashboard/purchases", "/dashboard/logistics", "/dashboard/inventory"];

        if (validRoutes.includes(path)) {
            navigate(path);
        } else {
            navigate("*");
        }
    }
} 