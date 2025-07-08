import { useEffect, useState } from "react";
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import Modal from "../components/Modal";
import Chart from "react-google-charts";
import { API_BASE_URL } from "../utils/config";

import "../css/fonts.css";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 4;

type Employee = {
    employeeId: number;
    employeeName: string;
    employeePaternalSurname: string;
    employeeMaternalSurname: string;
    employeeDni: string;
    employeeAddress: string;
    employeePhoneNumber: string;
    employeeEmail: string;
    employeeBirthDate: string;
    employeeEntryDate: string;
    employeeRoleName: string;
};

type ModalType = "ADD_EMPLOYEE" | "EDIT_EMPLOYEE" | "DELETE_EMPLOYEE" | null;

const EmployeesView = () => {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState<number | null>(null);
    const [chartData, setChartData] = useState<(string | number)[][]>([["Año", "Empleados"]]);
    const [loadingChart, setLoadingChart] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/employees/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setEmployees(data))
            .finally(() => setLoading(false));


        fetch(`${API_BASE_URL}/employees/total-users`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(setTotalUsers);

        fetch(`${API_BASE_URL}/employees/employees-by-year`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then((result) => {
                const data: (string | number)[][] = [
                    ["Año", "Empleados"],
                    ...result.map((item: { year: number, totalEmployees: number }) => [item.year.toString(), item.totalEmployees])
                ];
                setChartData(data);
            })
            .catch(() => setChartData([["Año", "Empleados"], ["Sin datos", 0]]))
            .finally(() => setLoadingChart(false));
    }, []);

    const totalPages = Math.ceil(employees.length / PAGE_SIZE);
    const paginatedEmployees = employees.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const openAddModal = () => {
        setSelectedEmployee(null);
        setModalType("ADD_EMPLOYEE");
    };

    const openEditModal = (employee: Employee) => {
        setSelectedEmployee(employee);
        setModalType("EDIT_EMPLOYEE");
    };

    const openDeleteModal = (employee: Employee) => {
        setSelectedEmployee(employee);
        setModalType("DELETE_EMPLOYEE");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedEmployee(null);
    };

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
                <h2 className="text-lg font-bold mb-4 text-gray-700">
                    {modalType === "ADD_EMPLOYEE" ? "AGREGAR EMPLEADO" : "EDITAR EMPLEADO"}
                </h2>
                <form className="flex flex-col gap-4">
                    <input className="border p-2 rounded border-gray-300 text-gray-600 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2" placeholder="Nombre" defaultValue={selectedEmployee?.employeeName || ""} />
                    <input className="border p-2 rounded border-gray-300 text-gray-600 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2" placeholder="Apellido Paterno" defaultValue={selectedEmployee?.employeePaternalSurname || ""} />
                    <input className="border p-2 rounded border-gray-300 text-gray-600 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2" placeholder="Apellido Materno" defaultValue={selectedEmployee?.employeeMaternalSurname || ""} />
                    <input className="border p-2 rounded border-gray-300 text-gray-600 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2" placeholder="DNI" defaultValue={selectedEmployee?.employeeDni || ""} />
                    <input className="border p-2 rounded border-gray-300 text-gray-600 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2" placeholder="Dirección" defaultValue={selectedEmployee?.employeeAddress || ""} />
                    <input className="border p-2 rounded border-gray-300 text-gray-600 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2" placeholder="Teléfono" defaultValue={selectedEmployee?.employeePhoneNumber || ""} />
                    <input className="border p-2 rounded border-gray-300 text-gray-600 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2" placeholder="Email" type="email" defaultValue={selectedEmployee?.employeeEmail || ""} />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block mb-1 text-gray-600">Fecha de nacimiento</label>
                            <input className="border w-full p-2 rounded border-gray-300 text-gray-600 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2" placeholder="Fecha de nacimiento" type="date" defaultValue={selectedEmployee ? new Date(selectedEmployee.employeeBirthDate).toISOString().split("T")[0] : ""} />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 text-gray-600">Fecha de ingreso</label>
                            <input className="border w-full p-2 rounded border-gray-300 text-gray-600 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2" placeholder="Fecha de ingreso" type="date" defaultValue={selectedEmployee ? new Date(selectedEmployee.employeeEntryDate).toISOString().split("T")[0] : ""} />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button className="bg-indigo-500 hover:bg-indigo-700 hover:cursor-pointer transition-colors text-white px-4 py-2 rounded" type="submit">
                            {modalType === "ADD_EMPLOYEE" ? "Agregar" : "Guardar"}
                        </button>
                        <button className="bg-white px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-gray-100 hover:cursor-pointer transition-colors" type="button" onClick={closeModal}>Cancelar</button>
                    </div>
                </form>
            </Modal>
        );
    };

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-indigo-500 border-solid"></div>
                <span className="ml-4 text-gray-600">Cargando empleados...</span>
            </div>
        );
    }

    return (
        <div className="w-full flex min-w-0">
            <div className="w-full p-6 bg-white rounded-lg min-w-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold ml-4 text-gray-800 ">Empleados con Usuario</h2>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 custom-font-m">
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
                            className="bg-indigo-800 custom-font-m text-white flex items-center gap-1 mr-4 px-3 py-2 rounded-lg hover:bg-indigo-900 hover:cursor-pointer transition-colors"
                            onClick={openAddModal}
                        >
                            <PlusIcon className="size-6" />
                            Agregar
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto w-full min-w-0 p-4 custom-font-s">
                    <table className="min-w-[1100px] w-full table-auto border-collapse">
                        <thead>
                            <tr className="text-gray-800">
                                <th className="p-3 border-b border-gray-200">ID</th>
                                <th className="p-2 border-b border-gray-200">NOMBRE</th>
                                <th className="p-2 border-b border-gray-200">APELLIDO PATERNO</th>
                                <th className="p-2 border-b border-gray-200">APELLIDO MATERNO</th>
                                <th className="p-2 border-b border-gray-200">DNI</th>
                                <th className="p-2 border-b border-gray-200">DIRECCIÓN</th>
                                <th className="p-2 border-b border-gray-200">TELÉFONO</th>
                                <th className="p-2 border-b border-gray-200">EMAIL</th>
                                <th className="p-2 border-b border-gray-200">ROL</th>
                                <th className="p-2 border-b border-gray-200">NACIMIENTO</th>
                                <th className="p-2 border-b border-gray-200">INGRESO</th>
                                <th className="p-2 border-b border-gray-200">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {paginatedEmployees.map(employee => (
                                <tr 
                                    key={employee.employeeId} 
                                    className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                                    onClick={() => navigate(`/dashboard/employees/${employee.employeeId}`)}
                                >
                                    <td className="px-4 py-2">{employee.employeeId}</td>
                                    <td className="px-4 py-2">{employee.employeeName}</td>
                                    <td className="px-4 py-2">{employee.employeePaternalSurname}</td>
                                    <td className="px-4 py-2">{employee.employeeMaternalSurname}</td>
                                    <td className="px-4 py-2">{employee.employeeDni}</td>
                                    <td className="px-4 py-2 max-w-[120px] truncate">{employee.employeeAddress}</td>
                                    <td className="px-4 py-2">{employee.employeePhoneNumber}</td>
                                    <td className="px-4 py-2 max-w-[160px] truncate">{employee.employeeEmail}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-center custom-font-s bg-indigo-100 p-1 w-30 h-8 rounded-lg">
                                            {employee.employeeRoleName}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">{new Date(employee.employeeBirthDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{new Date(employee.employeeEntryDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                            <button
                                                className="flex items-center justify-center bg-white text-indigo-500 px-4 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-100 hover:cursor-pointer transition-colors"
                                                onClick={e => { e.stopPropagation(); openEditModal(employee); }}
                                            >
                                                <PencilSquareIcon className="size-6 inline-block mr-1 text-indigo-500" />
                                                Editar
                                            </button>
                                            <button
                                                className="flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition-colors ml-2"
                                                onClick={e => { e.stopPropagation(); openDeleteModal(employee); }}
                                            >
                                                <TrashIcon className="size-6 inline-block mr-1" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col md:flex-row gap-6 mt-6">
                    {/* Card: Total empleados con usuario */}
                    <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center min-w-[220px]">
                        <span className="text-4xl font-bold text-indigo-700">{totalUsers ?? "--"}</span>
                        <span className="text-gray-500 mt-2 font-semibold">Empleados con Usuario</span>
                    </div>
                    {/* Card: Gráfica */}
                    <div className="flex-1 bg-white rounded-xl shadow p-6 min-w-[320px]">
                        <span className="block text-gray-700 font-semibold mb-2">Empleados por año de ingreso</span>
                        {loadingChart ? (
                            <div className="flex justify-center items-center h-40">Cargando gráfico...</div>
                        ) : (
                            <Chart
                                chartType="ColumnChart"
                                width="100%"
                                height="260px"
                                data={chartData}
                                options={{
                                    legend: { position: "none" },
                                    colors: ["#6366f1"],
                                    hAxis: { title: "Año" },
                                    vAxis: { title: "Cantidad" },
                                    backgroundColor: "transparent",
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
            {renderModal()}
        </div>
    );
};

export default EmployeesView;