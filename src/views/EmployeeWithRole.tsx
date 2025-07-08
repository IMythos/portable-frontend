import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { API_BASE_URL } from "../utils/config";

type EmployeeDto = {
    employeeId: number;
    roleId: number | null;
    roleName: string | null;
    employeeName: string;
    employeeMaternalSurname: string;
    employeePaternalSurname: string;
    employeeDni: string;
    employeeAddress: string;
    employeePhoneNumber: string;
    employeeEmail: string;
    employeeSex: string;
    employeeBirthDate: string;
    employeeEntryDate: string;
};

type Role = {
    idRole: number;
    roleName: string;
};

const EmployeeWithRole = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState<EmployeeDto | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const [modal, setModal] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/employees/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then((data: EmployeeDto) => {
                setEmployee(data);
                setSelectedRole(data.roleId ?? null);
            });

        fetch(`${API_BASE_URL}/roles/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(setRoles);
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employee || !selectedRole) return;
        // Aquí asume que tienes un endpoint para actualizar el rol del usuario
        const res = await fetch(`${API_BASE_URL}/users/update-role-by-employee/${employee.employeeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ roleId: selectedRole })
        });
        if (res.ok) {
            setModal("Rol actualizado correctamente.");
        } else {
            setModal("Error al actualizar el rol.");
        }
    };

    if (!employee) {
        return <div className="text-center text-red-500 mt-10">Empleado no encontrado.</div>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
            {modal && (
                <Modal onClose={() => setModal(null)}>
                    <div className="text-center">{modal}</div>
                </Modal>
            )}
            <button
                className="mb-8 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors font-medium"
                onClick={() => navigate(-1)}
            >
                ← Volver
            </button>
            <h2 className="text-2xl font-bold mb-8 text-indigo-800 text-center tracking-tight">Datos del Empleado</h2>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Nombre</label>
                        <input className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition" value={employee.employeeName} disabled />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Apellido Paterno</label>
                        <input className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition" value={employee.employeePaternalSurname} disabled />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Apellido Materno</label>
                        <input className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition" value={employee.employeeMaternalSurname} disabled />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">DNI</label>
                        <input className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition" value={employee.employeeDni} disabled />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Teléfono</label>
                        <input className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition" value={employee.employeePhoneNumber} disabled />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Correo electrónico</label>
                    <input className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition" value={employee.employeeEmail} disabled />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                    <input className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition" value={employee.employeeAddress} disabled />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Sexo</label>
                        <input className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition" value={employee.employeeSex} disabled />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Nacimiento</label>
                        <input className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition" value={employee.employeeBirthDate} disabled />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Ingreso</label>
                        <input className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition" value={employee.employeeEntryDate} disabled />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Rol</label>
                    <select
                        className="border border-gray-200 rounded-lg p-2 w-full bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                        value={selectedRole ?? ""}
                        onChange={e => setSelectedRole(Number(e.target.value))}
                        required
                    >
                        <option value="">Seleccione un rol</option>
                        {roles.map(role => (
                            <option key={role.idRole} value={role.idRole}>{role.roleName}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                        type="submit"
                    >
                        Guardar cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeWithRole;