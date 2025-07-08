import { ArrowTrendingUpIcon, ClipboardDocumentListIcon, DocumentChartBarIcon, MagnifyingGlassIcon, ShieldCheckIcon, TruckIcon } from "@heroicons/react/16/solid";
import { UsersIcon } from "@heroicons/react/16/solid";
import { ChartBarIcon } from "@heroicons/react/16/solid";
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

type MenuIcon = ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & { title?: string; titleId?: string } & RefAttributes<SVGSVGElement>>;

export interface SidebarMenuItem {
    label: string;
    icon: MenuIcon;
    path?: string;
    children?: { label: string; path: string }[];
}

const sidebarMenu = {
    ADMINISTRADOR: [
        {
            label: "Metricas generales",
            icon: ChartBarIcon,
            children: [
                { label: "Empleados", path: "/dashboard/employees" },
                { label: "Productos", path: "/dashboard/products" },
                { label: "Proveedores", path: "/dashboard/providers" },
                { label: "Clientes", path: "/dashboard/clients" },
                { label: "Almacenes", path: "/dashboard/warehouses" },
            ]
        } as SidebarMenuItem,
        {
            label: "Gestion de usuarios",
            icon: UsersIcon,
            children: [
                { label: "Usuarios", path: "/dashboard/users" },
                { label: "Roles", path: "/dashboard/roles" },
            ]
        } as SidebarMenuItem,
        {
            label: "Reportes Globales",
            icon: DocumentChartBarIcon,
            children: [
                { label: "Ventas", path: "/dashboard/reports/sales" },
                { label: "Compras", path: "/dashboard/reports/purchases" },
                { label: "Inventario", path: "/dashboard/reports/inventory" }
            ]
        } as SidebarMenuItem,
    ],
    VENTAS: [
        {
            label: "Clientes",
            icon: UsersIcon,
            children: [
                { label: "Registro de clientes", path: "/dashboard/clients/register" },
                { label: "Listado de clientes", path: "/dashboard/clients/list" },
                { label: "Historial de ventas por cliente", path: "/dashboard/clients/history" }
            ]
        } as SidebarMenuItem,
        {
            label: "Ventas",
            icon: ClipboardDocumentListIcon,
            children: [
                { label: "Registro de venta", path: "/dashboard/sales/register" },
                { label: "Generación de comprobantes", path: "/dashboard/sales/receipts" },
                { label: "Registro de pagos", path: "/dashboard/sales/payments" },
                { label: "Cotizaciones", path: "/dashboard/sales/quotes" },
                { label: "Garantías", path: "/dashboard/sales/warranties" }
            ]
        } as SidebarMenuItem,
    ],
    COMPRAS: [
        {
            label: "Proveedores",
            icon: UsersIcon,
            children: [
                { label: "Registro de proveedores", path: "/dashboard/providers/register" }
            ]
        } as SidebarMenuItem,
        {
            label: "Compras",
            icon: ClipboardDocumentListIcon,
            children: [
                { label: "Registro de compras", path: "/dashboard/purchases/register" },
                { label: "Actualización de stock", path: "/dashboard/purchases/stock-update" },
                { label: "Historial de compras", path: "/dashboard/purchases/history" },
                { label: "Exportación de compras a PDF", path: "/dashboard/purchases/export-pdf" }
            ]
        } as SidebarMenuItem,
    ],
    LOGISTICA: [
        {
            label: "Inventario",
            icon: MagnifyingGlassIcon,
            children: [
                { label: "Consulta y gestión de inventario", path: "/dashboard/logistics/inventory" },
                { label: "Ajustes manuales de stock", path: "/dashboard/logistics/stock-adjustments" }
            ]
        } as SidebarMenuItem,
        {
            label: "Envíos",
            icon: TruckIcon,
            children: [
                { label: "Gestión de envíos a provincia", path: "/dashboard/logistics/shipments" },
                { label: "Seguimiento de envíos", path: "/dashboard/logistics/shipments/tracking" }
            ]
        } as SidebarMenuItem,
        {
            label: "Garantías",
            icon: ShieldCheckIcon,
            children: [
                { label: "Gestión de garantías", path: "/dashboard/logistics/warranties" }
            ]
        } as SidebarMenuItem,
        {
            label: "Reportes logísticos",
            icon: ArrowTrendingUpIcon,
            children: [
                { label: "Reportes logísticos", path: "/dashboard/logistics/reports" }
            ]
        } as SidebarMenuItem
    ],
    INVENTARIO: [
    {
        label: "Detalle de inventario",
        icon: MagnifyingGlassIcon,
        children: [
            { label: "Productos", path: "/dashboard/products" },
            { label: "Stock", path: "/dashboard/inventory/stock" },
            { label: "Transferencias", path: "/dashboard/inventory/transfers" }
        ]
    } as SidebarMenuItem,
    {
        label: "Reportes de stock",
        icon: DocumentChartBarIcon,
        children: [
            { label: "Reportes de stock", path: "/dashboard/inventory/stock-reports" }
        ]
    } as SidebarMenuItem,
    {
        label: "Transferencias entre almacenes",
        icon: TruckIcon,
        children: [
            { label: "Transferencias entre almacenes", path: "/dashboard/inventory/warehouse-transfers" }
        ]
    } as SidebarMenuItem,
    {
        label: "Reportes de entradas y salidas",
        icon: ArrowTrendingUpIcon,
        children: [
            { label: "Reportes de entradas y salidas", path: "/dashboard/inventory/in-out-reports" }
        ]
    } as SidebarMenuItem
],
};

export default sidebarMenu;