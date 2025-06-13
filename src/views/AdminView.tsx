import { useEffect, useState } from "react";
import type { Employee } from "../interfaces/Employee";
import { PlusIcon } from "@heroicons/react/16/solid";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/16/solid";
import type { ModalType } from "../types/ModalType";
import Modal from "../components/Modal";

import "../css/fonts.css";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { ArrowRightIcon } from "@heroicons/react/16/solid";

const PAGE_SIZE = 5;

const AdminView = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetch("http://localhost:8080/v1/api/admin/employees", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => response.json())
            .then(data => setEmployees(data))
            .catch(error => console.log(error));
    }, []);

    // Paginacion en tabla empleados
    const totalPages = Math.ceil(employees.length / PAGE_SIZE);
    const paginatedEmployees = employees.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    console.log(employees);

    // Manejos de modal [ADD, EDIT, DELETE]

    const openAddModal = () => {
        setSelectedEmployee(null);
        setModalType("ADD_EMPLOYEE");
    }

    const openEditModal = (employee: Employee) => {
        setSelectedEmployee(employee);
        setModalType("EDIT_EMPLOYEE");
    }

    const openDeleteModal = (employee: Employee) => {
        setSelectedEmployee(employee);
        setModalType("DELETE_EMPLOYEE");
    }

    const closeModal = () => {
        setModalType(null);
        setSelectedEmployee(null);
    }

    // Render modal

    const renderModal = () => {
        if (!modalType) return null;
        if (modalType === "DELETE_EMPLOYEE" && selectedEmployee) {
            return (
                <Modal onClose={closeModal}>
                    <h2 className="text-lg font-bold mb-4">Eliminar empleado</h2>
                    <p>¿Seguro que deseas eliminar a <b>{selectedEmployee.employeeName}</b>?</p>
                    <div className="flex gap-2 mt-4">
                        <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 hover:cursor-pointer transition-colors"
                            onClick={closeModal}
                        >
                            Eliminar
                        </button>
                        <button
                            className="bg-white px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-gray-100 hover:cursor-pointer transition-colors"
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
                <h2 className="text-lg font-bold mb-4">
                    {modalType === "ADD_EMPLOYEE" ? "Agregar Empleado" : "Editar Empleado"}
                </h2>
                <form className="flex flex-col gap-4">
                    <input className="border p-2 rounded" placeholder="Nombre" defaultValue={selectedEmployee?.employeeName || ""} />
                    <input className="border p-2 rounded" placeholder="Apellido" defaultValue={selectedEmployee?.employeePaternalSurname || ""} />
                    <input className="border p-2 rounded" placeholder="DNI" defaultValue={selectedEmployee?.employeeDni || ""} />
                    <input className="border p-2 rounded" placeholder="Dirección" defaultValue={selectedEmployee?.employeeAddress || ""} />
                    <input className="border p-2 rounded" placeholder="Teléfono" defaultValue={selectedEmployee?.employeePhoneNumber || ""} />
                    <input className="border p-2 rounded" placeholder="Email" type="email" defaultValue={selectedEmployee?.employeeEmail || ""} />
                    <input className="border p-2 rounded" placeholder="Rol" type="text" defaultValue={selectedEmployee?.employeeRoleName || ""} />
                    <select>
                        <option>ADMINISTRADOR</option>
                        <option>VENTAS</option>
                        <option>COMPRAS</option>
                        <option>LOGISTICA</option>
                        <option>GERENCIA</option>
                    </select>
                    <input className="border p-2 rounded" placeholder="Fecha de nacimiento" type="date" defaultValue={selectedEmployee ? new Date(selectedEmployee.employeeBirthDate).toISOString().split("T")[0] : ""} />
                    <input className="border p-2 rounded" placeholder="Fecha de ingreso" type="date" defaultValue={selectedEmployee ? new Date(selectedEmployee.employeeEntryDate).toISOString().split("T")[0] : ""} />
                    <div className="flex gap-2 mt-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
                            {modalType === "ADD_EMPLOYEE" ? "Agregar" : "Guardar"}
                        </button>
                        <button className="bg-gray-300 px-4 py-2 rounded" type="button" onClick={closeModal}>Cancelar</button>
                    </div>
                </form>
            </Modal>
        );
    }

    return (
        <div className="w-full flex">
            <div className="w-full p-6 bg-white mr-6 rounded-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold ml-4 text-gray-800 ">Empleados</h2>
                    <div className="flex items-center justify-between gap-4">
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
                        </div>
                        <button
                            className="bg-indigo-800 text-white custom-font-m flex items-center gap-1 mr-4 px-3 py-2 rounded-lg hover:bg-indigo-900 hover:cursor-pointer transition-colors"
                            onClick={openAddModal}
                        >
                            <PlusIcon className="size-6" />
                            Agregar
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto p-4">
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-gray-800">
                                <th className="p-3 border-b border-gray-200 custom-font-m">ID</th>
                                <th className="p-2 border-b border-gray-200 custom-font-m">NOMBRE</th>
                                <th className="p-2 border-b border-gray-200 custom-font-m">APELLIDO</th>
                                <th className="p-2 border-b border-gray-200 custom-font-m">DNI</th>
                                <th className="p-2 border-b border-gray-200 custom-font-m">DIRECCION</th>
                                <th className="p-2 border-b border-gray-200 custom-font-m">TELEFONO</th>
                                <th className="p-2 border-b border-gray-200 custom-font-m">EMAIL</th>
                                <th className="p-2 border-b border-gray-200 custom-font-m">ROL</th>
                                <th className="p-2 border-b border-gray-200 custom-font-m">NACIMIENTO</th>
                                <th className="p-2 border-b border-gray-200 custom-font-m">INGRESO</th>
                                <th className="p-2 border-b border-gray-200 custom-font-m">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {
                                paginatedEmployees.map(employee => (
                                    <tr key={employee.employeeId} className="border-b border-gray-200">
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m">{employee.employeeId}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m">{employee.employeeName}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m">{employee.employeePaternalSurname}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m">{employee.employeeDni}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m max-w-[120px] truncate">{employee.employeeAddress}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m">{employee.employeePhoneNumber}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m max-w-[160px] truncate">{employee.employeeEmail}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m">
                                            <div className="flex items-center justify-center bg-indigo-100 p-1 w-30 h-8 rounded-lg custom-font-s">
                                                {employee.employeeRoleName}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m">{new Date(employee.employeeBirthDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m">{new Date(employee.employeeEntryDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m max-w-[540px]">
                                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                                <button
                                                    className="flex items-center justify-center bg-white text-indigo-500 px-4 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-100 hover:cursor-pointer transition-colors"
                                                    onClick={() => openEditModal(employee)}
                                                >
                                                    <PencilSquareIcon className="size-6 inline-block mr-1 text-indigo-500" />
                                                    Editar
                                                </button>
                                                <button
                                                    className="flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition-colors ml-2"
                                                    onClick={() => openDeleteModal(employee)}
                                                >
                                                    <TrashIcon className="size-6 inline-block mr-1" />
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {renderModal()}
        </div>
    );
}

export default AdminView;