import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { API_BASE_URL } from "../utils/config";
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";

type Role = {
    idRole: number;
    roleName: string;
};

type Employee = {
    employeeId: number;
    employeeName: string;
    paternalSurname: string;
    maternalSurname: string;
};

type UserAPI = {
    userId: number;
    username: string;
    password: string;
    status: boolean;
    role: Role;
    employee: Employee;
};

type User = {
    id: number;
    username: string;
    password: string;
    status: boolean;
    roleId: number;
    roleName: string;
    employeeId: number;
    employeeName: string;
};

type ModalType = "ADD" | "EDIT" | "DELETE" | null;

const PAGE_SIZE = 8;

function mapUser(apiUser: UserAPI): User {
    return {
        id: apiUser.userId,
        username: apiUser.username,
        password: apiUser.password,
        status: apiUser.status,
        roleId: apiUser.role.idRole,
        roleName: apiUser.role.roleName,
        employeeId: apiUser.employee.employeeId,
        employeeName: `${apiUser.employee.employeeName} ${apiUser.employee.paternalSurname} ${apiUser.employee.maternalSurname}`,
    };
}

const UserView = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [form, setForm] = useState<Omit<User, "id" | "roleName" | "employeeName">>({
        username: "",
        password: "",
        status: true,
        roleId: 0,
        employeeId: 0,
    });
    const [modalMsg, setModalMsg] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
        fetchEmployees();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/users/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data: UserAPI[] = await res.json();
        setUsers(data.map(mapUser));
        setLoading(false);
    };

    const fetchRoles = async () => {
        const res = await fetch(`${API_BASE_URL}/roles/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data: Role[] = await res.json();
        setRoles(data);
    };

    const fetchEmployees = async () => {
        const res = await fetch(`${API_BASE_URL}/employees/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data: Employee[] = await res.json();
        setEmployees(data);
    };

    const openAddModal = () => {
        setForm({
            username: "",
            password: "",
            status: true,
            roleId: roles.length > 0 ? roles[0].idRole : 0,
            employeeId: employees.length > 0 ? employees[0].employeeId : 0,
        });
        setSelectedUser(null);
        setModalType("ADD");
    };

    const openEditModal = (user: User) => {
        setForm({
            username: user.username,
            password: "",
            status: user.status,
            roleId: user.roleId,
            employeeId: user.employeeId,
        });
        setSelectedUser(user);
        setModalType("EDIT");
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setModalType("DELETE");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedUser(null);
        setModalMsg(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setForm({ ...form, [name]: type === "number" ? Number(value) : value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (modalType === "ADD") {
            const res = await fetch(`${API_BASE_URL}/users/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                    status: form.status,
                    roleId: form.roleId,
                    employeeId: form.employeeId
                })
            });
            if (res.ok) {
                setModalMsg("Usuario creado correctamente.");
                fetchUsers();
            } else {
                setModalMsg("Error al crear usuario.");
            }
        }
        if (modalType === "EDIT" && selectedUser) {
            const res = await fetch(`${API_BASE_URL}/users/update/${selectedUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                    status: form.status,
                    roleId: form.roleId,
                    employeeId: form.employeeId
                })
            });
            if (res.ok) {
                setModalMsg("Usuario actualizado correctamente.");
                fetchUsers();
            } else {
                setModalMsg("Error al actualizar usuario.");
            }
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        const res = await fetch(`${API_BASE_URL}/users/delete/${selectedUser.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
            setModalMsg("Usuario eliminado correctamente.");
            fetchUsers();
        } else {
            setModalMsg("Error al eliminar usuario.");
        }
        closeModal();
    };

    const totalPages = Math.ceil(users.length / PAGE_SIZE);
    const paginatedUsers = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const renderModal = () => {
        if (!modalType) return null;
        if (modalType === "DELETE" && selectedUser) {
            return (
                <Modal onClose={closeModal}>
                    <h2 className="text-lg font-bold mb-4">¿Eliminar usuario?</h2>
                    <p className="mb-6">¿Seguro que deseas eliminar el usuario <b>{selectedUser.username}</b>?</p>
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
                    <h3 className="text-lg font-bold mb-2">{modalType === "ADD" ? "Agregar Usuario" : "Editar Usuario"}</h3>
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="username"
                        placeholder="Usuario"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="password"
                        placeholder="Contraseña"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required={modalType === "ADD"}
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="status"
                            checked={form.status}
                            onChange={handleChange}
                        />
                        Activo
                    </label>
                    <select
                        className="border border-gray-200 rounded-lg p-2"
                        name="roleId"
                        value={form.roleId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione Rol</option>
                        {roles.map(role => (
                            <option key={role.idRole} value={role.idRole}>{role.roleName}</option>
                        ))}
                    </select>
                    <select
                        className="border border-gray-200 rounded-lg p-2"
                        name="employeeId"
                        value={form.employeeId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione Empleado</option>
                        {employees.map(emp => (
                            <option key={emp.employeeId} value={emp.employeeId}>
                                {emp.employeeName} {emp.paternalSurname} {emp.maternalSurname}
                            </option>
                        ))}
                    </select>
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
                <span className="ml-4 text-gray-600">Cargando usuarios...</span>
            </div>
        );
    }

    return (
        <div className="w-full flex min-w-0">
            <div className="w-full p-6 bg-white rounded-lg min-w-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold ml-4 text-gray-800 ">Usuarios</h2>
                    <div className="flex items-center gap-2">
                        <button
                            className="p-1 border rounded bg-white border-indigo-500 hover:bg-indigo-100 hover:cursor-pointer transition-colors text-indigo-500"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ArrowLeftIcon className="size-6 inline-block" />
                        </button>
                        <span className="mx-2">{currentPage} de {totalPages}</span>
                        <button
                            className="p-1 border rounded bg-white border-indigo-500 hover:bg-indigo-100 hover:cursor-pointer transition-colors text-indigo-500"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <ArrowRightIcon className="size-6 inline-block" />
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
                    <table className="min-w-[700px] w-full table-auto border-collapse">
                        <thead>
                            <tr className="text-gray-800">
                                <th className="p-3 border-b border-gray-200">ID</th>
                                <th className="p-3 border-b border-gray-200">USUARIO</th>
                                <th className="p-3 border-b border-gray-200">ROL</th>
                                <th className="p-3 border-b border-gray-200">EMPLEADO</th>
                                <th className="p-3 border-b border-gray-200">ESTADO</th>
                                <th className="p-3 border-b border-gray-200">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8">No hay usuarios registrados.</td>
                                </tr>
                            ) : (
                                paginatedUsers.map(user => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <td className="px-4 py-2">{user.id}</td>
                                        <td className="px-4 py-2">{user.username}</td>
                                        <td className="px-4 py-2">{user.roleName}</td>
                                        <td className="px-4 py-2">{user.employeeName}</td>
                                        <td className="px-4 py-2">{user.status ? "Activo" : "Inactivo"}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                                <button
                                                    className="flex items-center justify-center bg-white text-indigo-500 px-4 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-100 hover:cursor-pointer transition-colors"
                                                    onClick={e => { e.stopPropagation(); openEditModal(user); }}
                                                >
                                                    <PencilSquareIcon className="size-6 inline-block mr-1 text-indigo-500" />
                                                    Editar
                                                </button>
                                                <button
                                                    className="flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition-colors ml-2"
                                                    onClick={e => { e.stopPropagation(); openDeleteModal(user); }}
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

export default UserView;