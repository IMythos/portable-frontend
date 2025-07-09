import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { API_BASE_URL } from "../utils/config";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";

type RoleAPI = {
    idRole: number;
    roleName: string;
};

type Role = {
    id: number;
    name: string;
};

type ModalType = "ADD" | "EDIT" | "DELETE" | null;

const PAGE_SIZE = 8;

function mapRole(apiRole: RoleAPI): Role {
    return {
        id: apiRole.idRole,
        name: apiRole.roleName,
    };
}

const RoleView = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [form, setForm] = useState<Omit<Role, "id">>({ name: "" });
    const [modalMsg, setModalMsg] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/roles/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data: RoleAPI[] = await res.json();
        setRoles(data.map(mapRole));
        setLoading(false);
    };

    const openAddModal = () => {
        setForm({ name: "" });
        setSelectedRole(null);
        setModalType("ADD");
    };

    const openEditModal = (role: Role) => {
        setForm({ name: role.name });
        setSelectedRole(role);
        setModalType("EDIT");
    };

    const openDeleteModal = (role: Role) => {
        setSelectedRole(role);
        setModalType("DELETE");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedRole(null);
        setModalMsg(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (modalType === "ADD") {
            const res = await fetch(`${API_BASE_URL}/roles/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ roleName: form.name })
            });
            if (res.ok) {
                setModalMsg("Rol creado correctamente.");
                fetchRoles();
            } else {
                setModalMsg("Error al crear rol.");
            }
        }
        if (modalType === "EDIT" && selectedRole) {
            const res = await fetch(`${API_BASE_URL}/roles/update/${selectedRole.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ roleName: form.name })
            });
            if (res.ok) {
                setModalMsg("Rol actualizado correctamente.");
                fetchRoles();
            } else {
                setModalMsg("Error al actualizar rol.");
            }
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (!selectedRole) return;
        const res = await fetch(`${API_BASE_URL}/roles/delete/${selectedRole.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
            setModalMsg("Rol eliminado correctamente.");
            fetchRoles();
        } else {
            setModalMsg("Error al eliminar rol.");
        }
        closeModal();
    };

    const totalPages = Math.ceil(roles.length / PAGE_SIZE);
    const paginatedRoles = roles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const renderModal = () => {
        if (!modalType) return null;
        if (modalType === "DELETE" && selectedRole) {
            return (
                <Modal onClose={closeModal}>
                    <h2 className="text-lg font-bold mb-4">¿Eliminar rol?</h2>
                    <p className="mb-6">¿Seguro que deseas eliminar el rol <b>{selectedRole.name}</b>?</p>
                    <div className="flex gap-2">
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            Eliminar
                        </button>
                        <button
                            className="bg-white px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-gray-100"
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                    </div>
                </Modal>
            );
        }
        return (
            <Modal onClose={closeModal}>
                <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
                    <h3 className="text-lg font-bold mb-2">{modalType === "ADD" ? "Agregar Rol" : "Editar Rol"}</h3>
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="name"
                        placeholder="Nombre del rol"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <div className="flex gap-2 justify-end mt-2">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg" type="submit">
                            Guardar
                        </button>
                        <button className="bg-gray-200 px-4 py-2 rounded-lg" type="button" onClick={closeModal}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>
        );
    };

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-indigo-500 border-solid"></div>
                <span className="ml-4 text-gray-600">Cargando roles...</span>
            </div>
        );
    }

    return (
        <div className="w-full flex min-w-0">
            <div className="w-full p-6 bg-white rounded-lg min-w-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold ml-4 text-gray-800 ">Roles</h2>
                    <div className="flex items-center gap-2">
                        <button
                            className="p-1 border rounded bg-white border-indigo-500 hover:bg-indigo-100 hover:cursor-pointer transition-colors text-indigo-500"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            {"<"}
                        </button>
                        <span className="mx-2">{currentPage} de {totalPages}</span>
                        <button
                            className="p-1 border rounded bg-white border-indigo-500 hover:bg-indigo-100 hover:cursor-pointer transition-colors text-indigo-500"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            {">"}
                        </button>
                        <button
                            className="bg-indigo-800 custom-font-m text-white flex items-center gap-1 mr-4 px-3 py-2 rounded-lg hover:bg-indigo-900 hover:cursor-pointer transition-colors"
                            onClick={openAddModal}
                        >
                            <PlusIcon className="size-6" />
                            Agregar
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto w-full min-w-0 p-4 custom-font-s">
                    <table className="min-w-[600px] w-full table-auto border-collapse">
                        <thead>
                            <tr className="text-gray-800">
                                <th className="p-3 border-b border-gray-200">ID</th>
                                <th className="p-3 border-b border-gray-200">NOMBRE</th>
                                <th className="p-3 border-b border-gray-200">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {paginatedRoles.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-8">No hay roles registrados.</td>
                                </tr>
                            ) : (
                                paginatedRoles.map(role => (
                                    <tr
                                        key={role.id}
                                        className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <td className="px-4 py-2">{role.id}</td>
                                        <td className="px-4 py-2">{role.name}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                                <button
                                                    className="flex items-center justify-center bg-white text-indigo-500 px-4 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-100 hover:cursor-pointer transition-colors"
                                                    onClick={e => { e.stopPropagation(); openEditModal(role); }}
                                                >
                                                    <PencilSquareIcon className="size-6 inline-block mr-1 text-indigo-500" />
                                                    Editar
                                                </button>
                                                <button
                                                    className="flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition-colors ml-2"
                                                    onClick={e => { e.stopPropagation(); openDeleteModal(role); }}
                                                >
                                                    <TrashIcon className="size-6 inline-block mr-1" />
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {renderModal()}
                {modalMsg && (
                    <Modal onClose={() => setModalMsg(null)}>
                        <div className="text-center">{modalMsg}</div>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default RoleView;