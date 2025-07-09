import { useEffect, useState } from "react";
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import Modal from "../components/Modal";
import { API_BASE_URL } from "../utils/config";

type ClientAPI = {
    clientId: number;
    firstname: string;
    paternalLastname: string;
    maternalLastname: string;
    rucDni: string;
    address: string;
    phone: string;
    email: string;
    registerDate: string;
};

type Client = {
    clientId: number;
    name: string;
    paternalSurname: string;
    maternalSurname: string;
    rucDni: string;
    address: string;
    phone: string;
    email: string;
    registrationDate: string;
};

type ModalType = "ADD_CLIENT" | "EDIT_CLIENT" | "DELETE_CLIENT" | null;

const PAGE_SIZE = 5;

function mapClient(apiClient: ClientAPI): Client {
    return {
        clientId: apiClient.clientId,
        name: apiClient.firstname,
        paternalSurname: apiClient.paternalLastname,
        maternalSurname: apiClient.maternalLastname,
        rucDni: apiClient.rucDni,
        address: apiClient.address,
        phone: apiClient.phone,
        email: apiClient.email,
        registrationDate: apiClient.registerDate,
    };
}

const ClientsView = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Omit<Client, "clientId" | "registrationDate">>({
        name: "",
        paternalSurname: "",
        maternalSurname: "",
        rucDni: "",
        address: "",
        phone: "",
        email: "",
    });
    const [modalMsg, setModalMsg] = useState<string | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/clients/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data: ClientAPI[] = await res.json();
        setClients(data.map(mapClient));
        setLoading(false);
    };

    const openAddModal = () => {
        setForm({
            name: "",
            paternalSurname: "",
            maternalSurname: "",
            rucDni: "",
            address: "",
            phone: "",
            email: "",
        });
        setSelectedClient(null);
        setModalType("ADD_CLIENT");
    };

    const openEditModal = (client: Client) => {
        setForm({
            name: client.name,
            paternalSurname: client.paternalSurname,
            maternalSurname: client.maternalSurname,
            rucDni: client.rucDni,
            address: client.address,
            phone: client.phone,
            email: client.email,
        });
        setSelectedClient(client);
        setModalType("EDIT_CLIENT");
    };

    const openDeleteModal = (client: Client) => {
        setSelectedClient(client);
        setModalType("DELETE_CLIENT");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedClient(null);
        setModalMsg(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (modalType === "ADD_CLIENT") {
            const res = await fetch(`${API_BASE_URL}/clients/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    firstname: form.name,
                    paternalLastname: form.paternalSurname,
                    maternalLastname: form.maternalSurname,
                    rucDni: form.rucDni,
                    address: form.address,
                    phone: form.phone,
                    email: form.email
                })
            });
            if (res.ok) {
                setModalMsg("Cliente creado correctamente.");
                fetchClients();
            } else {
                setModalMsg("Error al crear cliente.");
            }
        }
        if (modalType === "EDIT_CLIENT" && selectedClient) {
            const res = await fetch(`${API_BASE_URL}/clients/update/${selectedClient.clientId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    firstname: form.name,
                    paternalLastname: form.paternalSurname,
                    maternalLastname: form.maternalSurname,
                    rucDni: form.rucDni,
                    address: form.address,
                    phone: form.phone,
                    email: form.email
                })
            });
            if (res.ok) {
                setModalMsg("Cliente actualizado correctamente.");
                fetchClients();
            } else {
                setModalMsg("Error al actualizar cliente.");
            }
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (!selectedClient) return;
        const res = await fetch(`${API_BASE_URL}/clients/delete/${selectedClient.clientId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
            setModalMsg("Cliente eliminado correctamente.");
            fetchClients();
        } else {
            setModalMsg("Error al eliminar cliente.");
        }
        closeModal();
    };

    const filteredClients = clients; // Puedes agregar filtro si lo necesitas
    const totalPages = Math.ceil(filteredClients.length / PAGE_SIZE);
    const paginatedClients = filteredClients.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const renderModal = () => {
        if (!modalType) return null;
        if (modalType === "DELETE_CLIENT" && selectedClient) {
            return (
                <Modal onClose={closeModal}>
                    <h2 className="text-lg font-bold mb-4">¿Eliminar cliente?</h2>
                    <p className="mb-6">¿Seguro que deseas eliminar al cliente <b>{selectedClient.name} {selectedClient.paternalSurname}</b>?</p>
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
                    <h3 className="text-lg font-bold mb-2">{modalType === "ADD_CLIENT" ? "Agregar Cliente" : "Editar Cliente"}</h3>
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
                        name="paternalSurname"
                        placeholder="Apellido Paterno"
                        value={form.paternalSurname}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="maternalSurname"
                        placeholder="Apellido Materno"
                        value={form.maternalSurname}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="rucDni"
                        placeholder="RUC/DNI"
                        value={form.rucDni}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="address"
                        placeholder="Dirección"
                        value={form.address}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="phone"
                        placeholder="Teléfono"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="email"
                        placeholder="Email"
                        value={form.email}
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
                <span className="ml-4 text-gray-600">Cargando clientes...</span>
            </div>
        );
    }

    return (
        <div className="w-full flex min-w-0">
            <div className="w-full p-6 bg-white rounded-lg min-w-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold ml-4 text-gray-800 ">Clientes</h2>
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
                    <table className="min-w-[1100px] w-full table-auto border-collapse">
                        <thead>
                            <tr className="text-gray-800">
                                <th className="p-3 border-b border-gray-200">ID</th>
                                <th className="p-2 border-b border-gray-200">NOMBRE</th>
                                <th className="p-2 border-b border-gray-200">APELLIDO PATERNO</th>
                                <th className="p-2 border-b border-gray-200">APELLIDO MATERNO</th>
                                <th className="p-2 border-b border-gray-200">RUC/DNI</th>
                                <th className="p-2 border-b border-gray-200">DIRECCIÓN</th>
                                <th className="p-2 border-b border-gray-200">TELÉFONO</th>
                                <th className="p-2 border-b border-gray-200">EMAIL</th>
                                <th className="p-2 border-b border-gray-200">FECHA REGISTRO</th>
                                <th className="p-2 border-b border-gray-200">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {paginatedClients.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-8">No hay clientes registrados.</td>
                                </tr>
                            ) : (
                                paginatedClients.map(client => (
                                    <tr
                                        key={client.clientId}
                                        className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <td className="px-4 py-2">{client.clientId}</td>
                                        <td className="px-4 py-2">{client.name}</td>
                                        <td className="px-4 py-2">{client.paternalSurname}</td>
                                        <td className="px-4 py-2">{client.maternalSurname}</td>
                                        <td className="px-4 py-2">{client.rucDni}</td>
                                        <td className="px-4 py-2">{client.address}</td>
                                        <td className="px-4 py-2">{client.phone}</td>
                                        <td className="px-4 py-2">{client.email}</td>
                                        <td className="px-4 py-2">{new Date(client.registrationDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                                <button
                                                    className="flex items-center justify-center bg-white text-indigo-500 px-4 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-100 hover:cursor-pointer transition-colors"
                                                    onClick={e => { e.stopPropagation(); openEditModal(client); }}
                                                >
                                                    <PencilSquareIcon className="size-6 inline-block mr-1 text-indigo-500" />
                                                    Editar
                                                </button>
                                                <button
                                                    className="flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition-colors ml-2"
                                                    onClick={e => { e.stopPropagation(); openDeleteModal(client); }}
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

export default ClientsView;