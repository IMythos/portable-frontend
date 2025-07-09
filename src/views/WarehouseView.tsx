import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { API_BASE_URL } from "../utils/config";
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";

type WarehouseAPI = {
    warehouseId: number;
    warehouseCode: string;
    warehouseName: string;
    branch: {
        branchId: number;
        branchName: string;
        district: string;
        address: string;
    };
};

type Warehouse = {
    id: number;
    code: string;
    name: string;
    branchName: string;
};

type ModalType = "ADD" | "EDIT" | "DELETE" | null;

const PAGE_SIZE = 8;

function mapWarehouse(apiWarehouse: WarehouseAPI): Warehouse {
    return {
        id: apiWarehouse.warehouseId,
        code: apiWarehouse.warehouseCode,
        name: apiWarehouse.warehouseName,
        branchName: apiWarehouse.branch.branchName,
    };
}

const WarehouseView = () => {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
    const [form, setForm] = useState<Omit<Warehouse, "id">>({
        code: "",
        name: "",
        branchName: "",
    });
    const [modalMsg, setModalMsg] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/warehouses/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data: WarehouseAPI[] = await res.json();
        setWarehouses(data.map(mapWarehouse));
        setLoading(false);
    };

    const openAddModal = () => {
        setForm({ code: "", name: "", branchName: "" });
        setSelectedWarehouse(null);
        setModalType("ADD");
    };

    const openEditModal = (warehouse: Warehouse) => {
        setForm({ code: warehouse.code, name: warehouse.name, branchName: warehouse.branchName });
        setSelectedWarehouse(warehouse);
        setModalType("EDIT");
    };

    const openDeleteModal = (warehouse: Warehouse) => {
        setSelectedWarehouse(warehouse);
        setModalType("DELETE");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedWarehouse(null);
        setModalMsg(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Nota: aquí deberías obtener el branchId real según tu lógica de selección de sucursal
        const branchId = 1; // Cambia esto por el branchId seleccionado
        if (modalType === "ADD") {
            const res = await fetch(`${API_BASE_URL}/warehouses/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    warehouseCode: form.code,
                    warehouseName: form.name,
                    branch: { branchId }
                })
            });
            if (res.ok) {
                setModalMsg("Almacén creado correctamente.");
                fetchWarehouses();
            } else {
                setModalMsg("Error al crear almacén.");
            }
        }
        if (modalType === "EDIT" && selectedWarehouse) {
            const res = await fetch(`${API_BASE_URL}/warehouses/update/${selectedWarehouse.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    warehouseCode: form.code,
                    warehouseName: form.name,
                    branch: { branchId }
                })
            });
            if (res.ok) {
                setModalMsg("Almacén actualizado correctamente.");
                fetchWarehouses();
            } else {
                setModalMsg("Error al actualizar almacén.");
            }
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (!selectedWarehouse) return;
        const res = await fetch(`${API_BASE_URL}/warehouses/delete/${selectedWarehouse.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
            setModalMsg("Almacén eliminado correctamente.");
            fetchWarehouses();
        } else {
            setModalMsg("Error al eliminar almacén.");
        }
        closeModal();
    };

    const totalPages = Math.ceil(warehouses.length / PAGE_SIZE);
    const paginatedWarehouses = warehouses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const renderModal = () => {
        if (!modalType) return null;
        if (modalType === "DELETE" && selectedWarehouse) {
            return (
                <Modal onClose={closeModal}>
                    <h2 className="text-lg font-bold mb-4">¿Eliminar almacén?</h2>
                    <p className="mb-6">¿Seguro que deseas eliminar el almacén <b>{selectedWarehouse.name}</b>?</p>
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
                    <h3 className="text-lg font-bold mb-2">{modalType === "ADD" ? "Agregar Almacén" : "Editar Almacén"}</h3>
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="code"
                        placeholder="Código"
                        value={form.code}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="name"
                        placeholder="Nombre"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="branchName"
                        placeholder="Sucursal (solo visual)"
                        value={form.branchName}
                        onChange={handleChange}
                        disabled
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
                <span className="ml-4 text-gray-600">Cargando almacenes...</span>
            </div>
        );
    }

    return (
        <div className="w-full flex min-w-0">
            <div className="w-full p-6 bg-white rounded-lg min-w-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold ml-4 text-gray-800 ">Almacenes</h2>
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
                                <th className="p-3 border-b border-gray-200">CÓDIGO</th>
                                <th className="p-3 border-b border-gray-200">NOMBRE</th>
                                <th className="p-3 border-b border-gray-200">SUCURSAL</th>
                                <th className="p-3 border-b border-gray-200">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {paginatedWarehouses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8">No hay almacenes registrados.</td>
                                </tr>
                            ) : (
                                paginatedWarehouses.map(warehouse => (
                                    <tr
                                        key={warehouse.id}
                                        className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <td className="px-4 py-2">{warehouse.id}</td>
                                        <td className="px-4 py-2">{warehouse.code}</td>
                                        <td className="px-4 py-2">{warehouse.name}</td>
                                        <td className="px-4 py-2">{warehouse.branchName}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                                <button
                                                    className="flex items-center justify-center bg-white text-indigo-500 px-4 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-100 hover:cursor-pointer transition-colors"
                                                    onClick={e => { e.stopPropagation(); openEditModal(warehouse); }}
                                                >
                                                    <PencilSquareIcon className="size-6 inline-block mr-1 text-indigo-500" />
                                                    Editar
                                                </button>
                                                <button
                                                    className="flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition-colors ml-2"
                                                    onClick={e => { e.stopPropagation(); openDeleteModal(warehouse); }}
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

export default WarehouseView;