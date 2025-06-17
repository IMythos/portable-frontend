import { HomeIcon, ShoppingCartIcon } from "@heroicons/react/16/solid";
import { useRouteHandler } from "../utils/utils";
import { DocumentCurrencyDollarIcon } from "@heroicons/react/16/solid";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/16/solid";
import { TruckIcon } from "@heroicons/react/16/solid";
import LogoImg from "../assets/microsoft.png";

import "../css/fonts.css";
import { XMarkIcon } from "@heroicons/react/16/solid";

interface SidebarProps {
    open?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ open = false, onClose }: SidebarProps) => {
    const routeHandler = useRouteHandler();

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${open ? "block" : "hidden"} sm:hidden`}
                onClick={onClose}
            />
            <div
                className={`
                    fixed top-0 left-0 h-full w-80 bg-indigo-50 z-50 transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    sm:static sm:translate-x-0 sm:block
                `}
            >
                <div className="w-full pl-6 pr-6">
                    <div className="flex items-center h-24 gap-4">
                        <img src={LogoImg} alt="Logo" className="w-8 h-8" />
                        <h1 className="text-xl font-bold text-gray-600">POGLOTECH</h1>
                        <button className="ml-auto sm:hidden" onClick={onClose}>
                            <XMarkIcon className="size-6 text-gray-600" />
                        </button>
                    </div>
                    <nav className="w-full mt-12">
                        <p className="pl-4 pr-4 pb-4 custom-font-s text-gray-500">MENU</p>
                        <li
                            className="flex items-center list-none pt-3 pb-3 pl-4 pr-4 mb-3 text-gray-500 hover:text-gray-700 hover:bg-indigo-100 hover:cursor-pointer rounded-lg transition-colors"
                            onClick={() => routeHandler("/dashboard")}
                        >
                            <HomeIcon className="size-6" />
                            <a className="ml-3">Home</a>
                        </li>
                        <li 
                            className="flex items-center list-none pt-3 pb-3 pl-4 pr-4 mb-3 text-gray-500 hover:text-gray-700 hover:bg-indigo-100 hover:cursor-pointer rounded-lg transition-colors" 
                            onClick={() => routeHandler("/dashboard/sales")}
                        >
                            <ShoppingCartIcon className="size-6" />
                            <a className="ml-3">Ventas</a>
                        </li>
                        <li 
                            className="flex items-center list-none pt-3 pb-3 pl-4 pr-4 mb-3 text-gray-500 hover:text-gray-700 hover:bg-indigo-100 hover:cursor-pointer rounded-lg transition-colors" 
                            onClick={() => routeHandler("/dashboard/purchases")}
                        >
                            <DocumentCurrencyDollarIcon className="size-6" />
                            <a className="ml-3">Compras</a>
                        </li>
                        <li 
                            className="flex items-center list-none pt-3 pb-3 pl-4 pr-4 mb-3 text-gray-500 hover:text-gray-700 hover:bg-indigo-100 hover:cursor-pointer rounded-lg transition-colors" 
                            onClick={() => routeHandler("/dashboard/logistics")}
                        >
                            <TruckIcon className="size-6" />
                            <a className="ml-3">Logistica</a>
                        </li>
                        <li 
                            className="flex items-center list-none pt-3 pb-3 pl-4 pr-4 mb-3 text-gray-500 hover:text-gray-700 hover:bg-indigo-100 hover:cursor-pointer rounded-lg transition-colors" 
                            onClick={() => routeHandler("/dashboard/inventory")}
                        >
                            <ClipboardDocumentCheckIcon className="size-6" />
                            <a className="ml-3">Inventario</a>
                        </li>
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Sidebar;