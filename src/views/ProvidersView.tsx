import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { API_BASE_URL } from "../utils/config";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";

type Provider = {
    providerId: number;
    providerCode: string;
    providerName: string;
    providerRuc: string;
};

const ProvidersView = () => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState<"ADD" | "EDIT" | "DELETE" | null>(null);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [form, setForm] = useState<Omit<Provider, "providerId">>({
        providerCode: "",
        providerName: "",
        providerRuc: "",
    });
    const [modalMsg, setModalMsg] = useState<string | null>(null);

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/providers/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        setProviders(data);
        setLoading(false);
    };

    const openAddModal = () => {
        setForm({ providerCode: "", providerName: "", providerRuc: "" });
        setSelectedProvider(null);
        setModalType("ADD");
    };

    const openEditModal = (provider: Provider) => {
        setForm({
            providerCode: provider.providerCode,
            providerName: provider.providerName,
            providerRuc: provider.providerRuc,
        });
        setSelectedProvider(provider);
        setModalType("EDIT");
    };

    const openDeleteModal = (provider: Provider) => {
        setSelectedProvider(provider);
        setModalType("DELETE");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedProvider(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (modalType === "ADD") {
            const res = await fetch(`${API_BASE_URL}/providers/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setModalMsg("Proveedor creado correctamente.");
                fetchProviders();
            } else {
                setModalMsg("Error al crear proveedor.");
            }
        }
        if (modalType === "EDIT" && selectedProvider) {
            const res = await fetch(`${API_BASE_URL}/providers/update/${selectedProvider.providerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ ...form, providerId: selectedProvider.providerId })
            });
            if (res.ok) {
                setModalMsg("Proveedor actualizado correctamente.");
                fetchProviders();
            } else {
                setModalMsg("Error al actualizar proveedor.");
            }
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (!selectedProvider) return;
        const res = await fetch(`${API_BASE_URL}/providers/delete/${selectedProvider.providerId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
            setModalMsg("Proveedor eliminado correctamente.");
            fetchProviders();
        } else {
            setModalMsg("Error al eliminar proveedor.");
        }
        closeModal();
    };

    // Opcional: paginación simple
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(providers.length / itemsPerPage);
    const paginatedProviders = providers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="w-full p-6 bg-white rounded-lg min-w-0">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-indigo-800">Proveedores</h2>
                <button
                    className="bg-indigo-800 text-white flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-indigo-900 transition-colors"
                    onClick={openAddModal}
                >
                    + Agregar
                </button>
            </div>
            <div className="overflow-x-auto w-full min-w-0 p-4 custom-font-s">
                <table className="min-w-[800px] w-full table-auto border-collapse">
                    <thead>
                        <tr className="text-gray-800">
                            <th className="p-3 border-b border-gray-200">ID</th>
                            <th className="p-3 border-b border-gray-200">CODIGO</th>
                            <th className="p-3 border-b border-gray-200">NOMBRE</th>
                            <th className="p-3 border-b border-gray-200">RUC</th>
                            <th className="p-3 border-b border-gray-200">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8">Cargando...</td>
                            </tr>
                        ) : paginatedProviders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8">No hay proveedores registrados.</td>
                            </tr>
                        ) : (
                            paginatedProviders.map(provider => (
                                <tr
                                    key={provider.providerId}
                                    className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                                // Si quieres navegación al detalle, agrega aquí:
                                // onClick={() => navigate(`/dashboard/providers/${provider.providerId}`)}
                                >
                                    <td className="px-4 py-2">{provider.providerId}</td>
                                    <td className="px-4 py-2">{provider.providerCode}</td>
                                    <td className="px-4 py-2">{provider.providerName}</td>
                                    <td className="px-4 py-2">{provider.providerRuc}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                            <button
                                                className="flex items-center justify-center bg-white text-indigo-500 px-4 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-100 hover:cursor-pointer transition-colors"
                                                onClick={e => { e.stopPropagation(); openEditModal(provider); }}
                                            >
                                                <PencilSquareIcon className="size-6 inline-block mr-1 text-indigo-500" />
                                                Editar
                                            </button>
                                            <button
                                                className="flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition-colors ml-2"
                                                onClick={e => { e.stopPropagation(); openDeleteModal(provider); }}
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
            {/* Paginación */}
            <div className="flex items-center gap-2 mt-4">
                <button
                    className="p-1 border rounded bg-white border-indigo-500 hover:bg-indigo-100 text-indigo-500"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    {"<"}
                </button>
                <span className="mx-2">{currentPage} de {totalPages}</span>
                <button
                    className="p-1 border rounded bg-white border-indigo-500 hover:bg-indigo-100 text-indigo-500"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    {">"}
                </button>
            </div>
            {/* Modal para agregar/editar */}
            {modalType && (modalType === "ADD" || modalType === "EDIT") && (
                <Modal onClose={closeModal}>
                    <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
                        <h3 className="text-lg font-bold mb-2">{modalType === "ADD" ? "Agregar Proveedor" : "Editar Proveedor"}</h3>
                        <input
                            className="border border-gray-200 rounded-lg p-2"
                            name="providerCode"
                            placeholder="Código"
                            value={form.providerCode}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="border border-gray-200 rounded-lg p-2"
                            name="providerName"
                            placeholder="Nombre"
                            value={form.providerName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="border border-gray-200 rounded-lg p-2"
                            name="providerRuc"
                            placeholder="RUC"
                            value={form.providerRuc}
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
            )}
            {/* Modal para eliminar */}
            {modalType === "DELETE" && selectedProvider && (
                <Modal onClose={closeModal}>
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-4">¿Eliminar proveedor?</h3>
                        <p className="mb-6">¿Seguro que deseas eliminar el proveedor <b>{selectedProvider.providerName}</b>?</p>
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
                    </div>
                </Modal>
            )}
            {/* Modal de mensaje */}
            {modalMsg && (
                <Modal onClose={() => setModalMsg(null)}>
                    <div className="text-center">{modalMsg}</div>
                </Modal>
            )}
        </div>
    );
};

export default ProvidersView;