import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import banner from "../assets/banner-login.jpg";

const LoginPage = () => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [modal, setModal] = useState<{ message: string, success?: boolean } | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user.trim() || !password.trim()) {
            setModal({ message: "Por favor, completa todos los campos." });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/v1/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user, password: password })
            });

            if (!response.ok) {
                setModal({ message: "Credenciales incorrectas. Intenta nuevamente." });
                setLoading(false);
                return;
            }

            const data = await response.json();
            const token = data.token;
            localStorage.setItem("token", token);

            setModal({ message: "¡Inicio de sesión exitoso!", success: true });
            setTimeout(() => {
                setModal(null);
                navigate("/dashboard");
            }, 1200);
        } catch (error) {
            setModal({ message: "Error de conexión. Intenta más tarde." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full h-screen flex items-center justify-center bg-white">
            {modal && (
                <Modal onClose={() => setModal(null)}>
                    <div className="flex flex-col items-center">
                        <span className={`text-2xl mb-2 ${modal.success ? "text-green-600" : "text-red-600"}`}>
                            {modal.success ? "✔️" : "❌"}
                        </span>
                        <p className="mb-4 text-center text-gray-700">{modal.message}</p>
                        <button
                            className={`px-4 py-2 rounded ${modal.success ? "bg-green-600" : "bg-red-600"} text-white`}
                            onClick={() => setModal(null)}
                        >
                            Cerrar
                        </button>
                    </div>
                </Modal>
            )}
            <div className="flex flex-1 justify-center items-center flex-col">
                <form className="w-96 h-2/4 rounded-lg bg-white p-6" onSubmit={handleLogin}>
                    <div className="w-full mb-8">
                        <h1 className="text-4xl font-bold mb-4 text-indigo-500">Iniciar Sesión</h1>
                        <span className="text-gray-500">Ingresa tus credenciales de acceso al sistema.</span>
                    </div>
                    <div className="w-full flex mb-6">
                        <label className="w-full flex flex-col text-gray-600">
                            Usuario
                            <input
                                className="border rounded-lg pt-2 pb-2 pl-5 pr-5 mt-2 border-gray-300"
                                type="text"
                                placeholder="Ingresa el usuario"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                disabled={loading}
                            />
                        </label>
                    </div>
                    <div className="w-full flex mb-6">
                        <label className="w-full flex flex-col text-gray-600">
                            Contraseña
                            <input
                                className="border rounded-lg pt-2 pb-2 pl-5 pr-5 mt-2 border-gray-300"
                                type="password"
                                placeholder="Ingresa la contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full pt-3 pb-3 bg-indigo-500 text-white rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
                <div className="flex w-full justify-center">
                    <span>© 2025, Hecho por Chocoton Luján Carrión</span>
                </div>
            </div>
            <div className="flex-1 bg-gray-800 w-full h-screen">
                <img className="w-full h-screen object-cover opacity-70" src={banner} />
            </div>
        </main>
    );
};

export default LoginPage;