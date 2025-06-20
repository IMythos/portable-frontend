
import { UserIcon } from "@heroicons/react/16/solid";

import "../css/fonts.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Bars4Icon } from "@heroicons/react/16/solid";
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";

interface HeaderProps {
    roleName?: string | null;
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ roleName, onMenuClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const cleanPath = location.pathname.startsWith("/") ? location.pathname.slice(1) : location.pathname;

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <header className="flex flex-col sm:flex-row justify-between items-center bg-indigo-50 w-full h:auto sm:h-24 px-4 sm:px-6 py-3 sm:py-0 gap-3 sm:gap-0">
            <div className="flex flex-row items-center w-full sm:w-auto">
                <button className="sm:hidden mr-3" onClick={onMenuClick}>
                    <Bars4Icon className="size-7 text-gray-700" />
                </button>
                <div className="flex flex-col items-center sm:items-start">
                    <span className="custom-font-s text-gray-500 hidden lg:inline">{cleanPath}</span>
                    <span className="font-bold text-gray-800">DASHBOARD</span>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8 w-full sm:w-auto">
                <div className="flex w-full sm:w-0 lg:w-70">
                    <input className="w-full bg-white border border-gray-200 pt-2 pb-2 pl-5 pr-5 rounded-2xl custom-font-m hidden lg:block lg:items-start" type="text" placeholder="Escribir aqui..." />
                </div>
                <div className="flex items-center">
                    <ul className="flex items-center gap-2 text-gray-800 hover:cursor-pointer pl-3 border-l border-l-gray-300">
                        <UserIcon className="size-5" />
                        <span className="truncate max-w-[250px] sm:max-w-none">Bienvenido, <b>{roleName}</b></span>
                    </ul>
                    <ul className="flex gap-2 pl-3 ml-4 border-l border-l-gray-300 text-red-500 hover:text-red-700 hover:cursor-pointer" onClick={handleLogout} title="Cerrar sesion">
                        <ArrowUturnLeftIcon className="size-6" />
                        <span className="hidden sm:inline">Cerrar sesion</span>
                    </ul>
                </div>
            </div>
        </header>
    );
}

export default Header;