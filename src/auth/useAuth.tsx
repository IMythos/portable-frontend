import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react"

type JwtPayload = {
    authorities?: string[];
};

export const useAuth = () => {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode<JwtPayload>(token);

                if (decodedToken.authorities && decodedToken.authorities.length > 0) {
                    setRole(decodedToken.authorities[0]);
                }
            } catch (e) {
                setRole(null);
                console.error("Error decoding token:", e);
            }
        }
    }, []);

    return { role, roleName: role }; 
}