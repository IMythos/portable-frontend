import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import sidebarMenu from "../constants/sidebarMenus";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";

interface SidebarProps {
    open?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ open = false, onClose }: SidebarProps) => {
    const { role } = useAuth();
    const navigate = useNavigate();
    const menu = sidebarMenu[role as keyof typeof sidebarMenu] || [];
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleDropdown = (label: string) => {
        setOpenDropdown(openDropdown === label ? null : label);
    };

    return (
        <>
            {/* Overlay para móvil */}
            <div
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${open ? "block" : "hidden"} sm:hidden`}
                onClick={onClose}
            />
            <aside
                className={`
                fixed top-0 left-0 h-screen w-80 bg-white z-50 transition-transform duration-300
                ${open ? "translate-x-0" : "-translate-x-full"}
                sm:static sm:translate-x-0 sm:block
                sm:h-screen
                p-4
                overflow-y-auto
            `}
            >
                <div className="w-full pl-2 pr-2">
                    <div className="flex items-center h-16 gap-4 mb-6">
                        <span className="text-2xl font-extrabold text-gray-600 tracking-tight">Dashboard</span>
                        {/* Botón cerrar solo en móvil */}
                        <button className="ml-auto sm:hidden" onClick={onClose}>
                            <XMarkIcon className="size-7 text-gray-600" />
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {menu.map((item) => (
                            <li key={item.label}>
                                {item.children && item.children.length === 1 ? (
                                    <div className="rounded-xl shadow-sm transition-all bg-white hover:bg-indigo-100 text-indigo-700">
                                        <button
                                            className="flex items-center w-full text-left font-semibold py-3 px-4"
                                            onClick={() => {
                                                navigate(item.children![0].path);
                                                if (onClose) onClose();
                                            }}
                                        >
                                            <item.icon className="w-6 h-6 mr-3 text-indigo-600" />
                                            {item.children[0].label}
                                        </button>
                                    </div>
                                ) : item.children && item.children.length > 1 ? (
                                    <div className="rounded-xl shadow-sm transition-all bg-white hover:bg-indigo-100 text-indigo-700">
                                        <button
                                            className="flex items-center w-full text-left font-semibold py-3 px-4"
                                            onClick={() => handleDropdown(item.label)}
                                        >
                                            <item.icon className="w-6 h-6 mr-3 text-indigo-600" />
                                            {item.label}
                                            <span className="ml-auto text-indigo-500">{openDropdown === item.label ? "▲" : "▼"}</span>
                                        </button>
                                        <div
                                            className={`
                            overflow-hidden transition-all duration-300
                            ${openDropdown === item.label ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                        `}
                                        >
                                            <ul className="ml-2 mt-1 mb-2 rounded-lg bg-indigo-50">
                                                {item.children.map((child) => (
                                                    <li key={child.label}>
                                                        <button
                                                            className="w-full text-left py-2 px-6 text-gray-700 hover:text-indigo-700 hover:bg-indigo-100 rounded transition"
                                                            onClick={() => {
                                                                navigate(child.path);
                                                                if (onClose) onClose();
                                                            }}
                                                        >
                                                            {child.label}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ) : typeof item.path === "string" ? (
                                    <div className="rounded-xl shadow-sm transition-all bg-white hover:bg-indigo-100 text-indigo-700">
                                        <button
                                            className="flex items-center w-full text-left font-semibold py-3 px-4"
                                            onClick={() => {
                                                navigate(item.path!);
                                                if (onClose) onClose();
                                            }}
                                        >
                                            <item.icon className="w-6 h-6 mr-3 text-indigo-600" />
                                            {item.label}
                                        </button>
                                    </div>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;