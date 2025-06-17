// rol = ADMINISTRADOR -> "admin"
// rol = INVENTARIO -> "inventory"

export const hasRole = (role: string | null): (string | null) => {
    if (role === "ADMINISTRADOR") return "admin";
    if (role === "INVENTARIO") return "inventory";
    return null;
}