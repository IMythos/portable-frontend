import { HomeIcon, ShoppingCartIcon } from "@heroicons/react/16/solid";
import { useRouteHandler } from "../utils/utils";
import { DocumentCurrencyDollarIcon } from "@heroicons/react/16/solid";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/16/solid";
import { TruckIcon } from "@heroicons/react/16/solid";

import "../css/fonts.css";

const Sidebar = () => {
    const routeHandler = useRouteHandler();

    return (
        <div className="w-80 h-full bg-blue-50">
            <div className="w-full pl-6 pr-6">
                <h1 className="text-2xl font-bold mt-5 mb-5 text-gray-600">Portable App</h1>
                <nav className="w-full mt-12">
                    <p className="pl-4 pr-4 pb-4 custom-font-s text-gray-500">MENU</p>
                    <li className="flex items-center list-none pt-3 pb-3 pl-4 pr-4 mb-3 text-gray-500 hover:text-gray-700 hover:bg-blue-100 hover:cursor-pointer rounded-lg" onClick={() => routeHandler("/dashboard")}>
                        <HomeIcon className="size-6" />
                        <a className="ml-3">Home</a>
                    </li>
                    <li className="flex items-center list-none pt-3 pb-3 pl-4 pr-4 mb-3 text-gray-500 hover:text-gray-700 hover:bg-blue-100 hover:cursor-pointer rounded-lg" onClick={() => routeHandler("/dashboard/sales")}>
                        <ShoppingCartIcon className="size-6" />
                        <a className="ml-3">Ventas</a>
                    </li>
                    <li className="flex items-center list-none pt-3 pb-3 pl-4 pr-4 mb-3 text-gray-500 hover:text-gray-700 hover:bg-blue-100 hover:cursor-pointer rounded-lg" onClick={() => routeHandler("/dashboard/purchases")}>
                        <DocumentCurrencyDollarIcon className="size-6" />
                        <a className="ml-3">Compras</a>
                    </li>
                    <li className="flex items-center list-none pt-3 pb-3 pl-4 pr-4 mb-3 text-gray-500 hover:text-gray-700 hover:bg-blue-100 hover:cursor-pointer rounded-lg" onClick={() => routeHandler("/dashboard/logistics")}>
                        <TruckIcon className="size-6"/>
                        <a className="ml-3">Logistica</a>
                    </li>
                    <li className="flex items-center flist-none pt-3 pb-3 pl-4 pr-4 mb-3 text-gray-500 hover:text-gray-700 hover:bg-blue-100 hover:cursor-pointer rounded-lg" onClick={() => routeHandler("/dashboard/inventory")}>
                        <ClipboardDocumentCheckIcon className="size-6" />
                        <a className="ml-3">Inventario</a>
                    </li>
                </nav>
            </div>
        </div>
    );
}

export default Sidebar;