import { Cog8ToothIcon } from "@heroicons/react/16/solid";
import { UserIcon } from "@heroicons/react/16/solid";

import "../css/fonts.css";
import { useLocation } from "react-router-dom";
import { Bars4Icon } from "@heroicons/react/16/solid";

interface HeaderProps {
    roleName?: string | null;
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ roleName, onMenuClick }) => {
    const location = useLocation();

    const cleanPath = location.pathname.startsWith("/") ? location.pathname.slice(1) : location.pathname;

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
                    <ul className="flex items-center gap-2 text-gray-800 hover:cursor-pointer">
                        <UserIcon className="size-6" />
                        <span className="truncate max-w-[250px] sm:max-w-none">Bienvenido, <b>{roleName}</b></span>
                    </ul>
                    <ul className="ml-4 hover:text-gray-700 hover:cursor-pointer">
                        <Cog8ToothIcon className="size-6" />
                    </ul>
                </div>
            </div>
        </header>
    );
}

export default Header;