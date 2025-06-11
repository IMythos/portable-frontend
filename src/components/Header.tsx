import { Cog8ToothIcon } from "@heroicons/react/16/solid";
import { UserIcon } from "@heroicons/react/16/solid";

import "../css/fonts.css";
import { useLocation } from "react-router-dom";

const Header = () => {
    const location = useLocation();

    const cleanPath = location.pathname.startsWith("/") ? location.pathname.slice(1) : location.pathname;

    return (
        <header className="flex justify-between items-center w-full h-20 pl-5 pr-5">
            <div className="flex flex-col">
                <span className="custom-font-s text-gray-500">{cleanPath}</span>
                <span className="font-bold text-gray-800">Dashboard</span>
            </div>
            <div className="flex items-center gap-5">
                <div className="flex w-60">
                    <input className="w-full border border-gray-400 pt-1 pb-1 pl-2 pr-2 rounded-lg custom-font-m" type="text" placeholder="Escribir aqui..."/>
                </div>
                <div className="flex items-center">
                    <li className="flex items-center gap-6 text-gray-500">
                        <ul className="flex gap-2 hover:text-gray-700 hover:cursor-pointer">
                            <UserIcon className="size-6" />
                            <span>Iniciar Sesion</span>
                        </ul>
                        <ul className="hover:text-gray-700 hover:cursor-pointer">
                            <Cog8ToothIcon className="size-6" />
                        </ul>
                    </li>
                </div>
            </div>
        </header>
    );
}

export default Header;