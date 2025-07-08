import { ArrowLeftEndOnRectangleIcon, Bars3Icon } from "@heroicons/react/16/solid";
import UserBadge from "./UserBadge";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    onMenuClick: () => void;
    roleName?: string | null;
}

const Header = ({ onMenuClick, roleName }: HeaderProps) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="flex items-center h-20 px-8 bg-indigo-600 shadow-lg border-b border-indigo-200 relative">
            {/* Menú hamburguesa solo en móvil */}
            <button
                className="sm:hidden p-2 mr-4 rounded bg-white/10 hover:bg-white/20 transition"
                onClick={onMenuClick}
                aria-label="Abrir menú"
            >
                <Bars3Icon className="w-8 h-8 text-white" />
            </button>
            <span className="font-extrabold text-white text-2xl tracking-tight drop-shadow-md">
                Portable <span className="text-indigo-200">Global</span>
            </span>
            <span className="ml-auto flex items-center gap-3">
                {roleName && <UserBadge label={`Rol: ${roleName}`} />}
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition"
                    onClick={handleLogout}
                >
                    <ArrowLeftEndOnRectangleIcon className="w-6 h-6 text-indigo-500" />
                    Cerrar sesión
                </button>
            </span>
        </header>
    );
};

export default Header;