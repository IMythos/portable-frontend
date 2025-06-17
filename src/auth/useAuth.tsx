import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react"

type JwtPayload = {
    authorities?: string[];
};

export const useAuth = () => {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode<JwtPayload>(token);

                if (Array.isArray(decodedToken.authorities) && decodedToken.authorities.length > 0) {
                    setRole(decodedToken.authorities[0]);
                } else {
                    setRole(null);
                }
            } catch (e) {
                setRole(null);
                console.error("Error decoding token:", e);
            }
        } else {
            setRole(null);
        }
        setLoading(false);
    }, []);

    return { role, roleName: role, loading }; 
}