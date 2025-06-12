import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/v1/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: user, password: password })
            });
 
            if (!response.ok) {
                throw new Error("Credenciales incorrectas");
            }

            const data = await response.json();
            const token = data.token;

            localStorage.setItem("token", token);
            navigate("/dashboard");
        } catch (error) {
            alert("Error de inicio de sesión. Por favor, verifica tus credenciales.");
        }
    }

    return (
        <main className="w-full h-screen flex items-center justify-center bg-white">
            <form className="w-96 h-2/4 rounded-lg bg-white p-6" onSubmit={handleLogin}>
                <div className="w-full mb-6">
                    <h1 className="text-4xl font-bold mb-2">Ingresar</h1>
                </div>
                <div className="w-full flex mb-6">
                    <label className="w-full flex flex-col">
                        Usuario
                        <input 
                            className="border rounded-lg pt-2 pb-2 pl-5 pr-5 mt-2 border-gray-400" 
                            type="text" 
                            placeholder="Ingresa el usuario" 
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                    </label>
                </div>
                <div className="w-full flex mb-6">
                    <label className="w-full flex flex-col">
                        Contraseña
                        <input 
                            className="border rounded-lg pt-2 pb-2 pl-5 pr-5 mt-2 border-gray-400" 
                            type="password" 
                            placeholder="Ingresa la contraseña" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                </div>
                <div className="w-full flex mb-6">
                    <select className="border rounded-lg p-2 border-gray-400 text-gray-600" disabled>
                        <option>Admin</option>
                    </select>
                </div>
                <button type="submit" className="w-full pt-3 pb-3 bg-blue-500 text-white rounded-lg">Ingresar</button>
            </form>
        </main>
    );
}

export default LoginPage;