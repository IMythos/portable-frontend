import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Chart from "react-google-charts";
import { API_BASE_URL } from "../utils/config";
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";

type Client = {
    clientId: number;
    firstname: string;
    paternalLastname: string;
    maternalLastname: string;
};

type User = {
    userId: number;
    username: string;
};

type Receipt = {
    receiptId: number;
    document: string;
    series: string;
    number: string;
    issueDate: string;
    dueDate: string;
    currency: string;
};

type SaleAPI = {
    saleId: number;
    client: Client;
    user: User;
    receipt: Receipt;
    paymentType: string;
    saleType: boolean;
    total: number;
};

type Sale = {
    saleId: number;
    clientName: string;
    userName: string;
    receiptInfo: string;
    paymentType: string;
    saleType: boolean;
    total: number;
};

type ModalType = "ADD" | "EDIT" | "DELETE" | null;

const PAGE_SIZE = 8;

function mapSale(apiSale: SaleAPI): Sale {
    return {
        saleId: apiSale.saleId,
        clientName: `${apiSale.client.firstname} ${apiSale.client.paternalLastname} ${apiSale.client.maternalLastname}`,
        userName: apiSale.user.username,
        receiptInfo: `${apiSale.receipt.document} ${apiSale.receipt.series}-${apiSale.receipt.number}`,
        paymentType: apiSale.paymentType,
        saleType: apiSale.saleType,
        total: apiSale.total,
    };
}

const SalesView = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [salesApi, setSalesApi] = useState<SaleAPI[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedSale, setSelectedSale] = useState<SaleAPI | null>(null);
    const [form, setForm] = useState({
        clientId: 0,
        userId: 0,
        receiptId: 0,
        paymentType: "",
        saleType: false,
        total: 0,
    });
    const [modalMsg, setModalMsg] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSales();
        fetchClients();
        fetchUsers();
        fetchReceipts();
    }, []);

    const fetchSales = async () => {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/sales/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data: SaleAPI[] = await res.json();
        setSalesApi(data);
        setSales(data.map(mapSale));
        setLoading(false);
    };

    const fetchClients = async () => {
        const res = await fetch(`${API_BASE_URL}/clients/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data: Client[] = await res.json();
        setClients(data);
    };

    const fetchUsers = async () => {
        const res = await fetch(`${API_BASE_URL}/users/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data: User[] = await res.json();
        setUsers(data);
    };

    const fetchReceipts = async () => {
        const res = await fetch(`${API_BASE_URL}/receipts/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data: Receipt[] = await res.json();
        setReceipts(data);
    };

    const openAddModal = () => {
        setForm({
            clientId: clients.length > 0 ? clients[0].clientId : 0,
            userId: users.length > 0 ? users[0].userId : 0,
            receiptId: receipts.length > 0 ? receipts[0].receiptId : 0,
            paymentType: "",
            saleType: false,
            total: 0,
        });
        setSelectedSale(null);
        setModalType("ADD");
    };

    const openEditModal = (sale: SaleAPI) => {
        setForm({
            clientId: sale.client.clientId,
            userId: sale.user.userId,
            receiptId: sale.receipt.receiptId,
            paymentType: sale.paymentType,
            saleType: sale.saleType,
            total: sale.total,
        });
        setSelectedSale(sale);
        setModalType("EDIT");
    };

    const openDeleteModal = (sale: SaleAPI) => {
        setSelectedSale(sale);
        setModalType("DELETE");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedSale(null);
        setModalMsg(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
        } else if (type === "number") {
            setForm({ ...form, [name]: Number(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (modalType === "ADD") {
            const res = await fetch(`${API_BASE_URL}/sales/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setModalMsg("Venta creada correctamente.");
                fetchSales();
            } else {
                setModalMsg("Error al crear venta.");
            }
        }
        if (modalType === "EDIT" && selectedSale) {
            const res = await fetch(`${API_BASE_URL}/sales/update/${selectedSale.saleId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setModalMsg("Venta actualizada correctamente.");
                fetchSales();
            } else {
                setModalMsg("Error al actualizar venta.");
            }
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (!selectedSale) return;
        const res = await fetch(`${API_BASE_URL}/sales/delete/${selectedSale.saleId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
            setModalMsg("Venta eliminada correctamente.");
            fetchSales();
        } else {
            setModalMsg("Error al eliminar venta.");
        }
        closeModal();
    };

    const totalPages = Math.ceil(sales.length / PAGE_SIZE);
    const paginatedSales = sales.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Gráfico de ventas por cliente
    const chartData: (string | number)[][] = [
        ["Cliente", "Total vendido"],
        ...Object.entries(
            sales.reduce((acc: Record<string, number>, sale) => {
                acc[sale.clientName] = (acc[sale.clientName] || 0) + sale.total;
                return acc;
            }, {})
        ),
    ];

    // Gráfico de ventas por usuario
    const chartDataByUser: (string | number)[][] = [
        ["Usuario", "Total vendido"],
        ...Object.entries(
            sales.reduce((acc: Record<string, number>, sale) => {
                acc[sale.userName] = (acc[sale.userName] || 0) + sale.total;
                return acc;
            }, {})
        ),
    ];

    // Gráfico de cantidad de ventas por tipo de pago
    const chartDataByPayment: (string | number)[][] = [
        ["Tipo de Pago", "Cantidad"],
        ...Object.entries(
            sales.reduce((acc: Record<string, number>, sale) => {
                acc[sale.paymentType] = (acc[sale.paymentType] || 0) + 1;
                return acc;
            }, {})
        ),
    ];

    // Gráfico de ventas por tipo (mayorista/minorista)
    const chartDataBySaleType: (string | number)[][] = [
        ["Tipo de Venta", "Cantidad"],
        [
            "Mayorista",
            sales.filter(sale => sale.saleType).length
        ],
        [
            "Minorista",
            sales.filter(sale => !sale.saleType).length
        ]
    ];

    const renderModal = () => {
        if (!modalType) return null;
        if (modalType === "DELETE" && selectedSale) {
            return (
                <Modal onClose={closeModal}>
                    <h2 className="text-lg font-bold mb-4">¿Eliminar venta?</h2>
                    <p className="mb-6">¿Seguro que deseas eliminar la venta <b>#{selectedSale.saleId}</b>?</p>
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
                    <h3 className="text-lg font-bold mb-2">{modalType === "ADD" ? "Agregar Venta" : "Editar Venta"}</h3>
                    <select
                        className="border border-gray-200 rounded-lg p-2"
                        name="clientId"
                        value={form.clientId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione Cliente</option>
                        {clients.map(client => (
                            <option key={client.clientId} value={client.clientId}>
                                {client.firstname} {client.paternalLastname} {client.maternalLastname}
                            </option>
                        ))}
                    </select>
                    <select
                        className="border border-gray-200 rounded-lg p-2"
                        name="userId"
                        value={form.userId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione Usuario</option>
                        {users.map(user => (
                            <option key={user.userId} value={user.userId}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                    <select
                        className="border border-gray-200 rounded-lg p-2"
                        name="receiptId"
                        value={form.receiptId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione Comprobante</option>
                        {receipts.map(receipt => (
                            <option key={receipt.receiptId} value={receipt.receiptId}>
                                {receipt.document} {receipt.series}-{receipt.number}
                            </option>
                        ))}
                    </select>
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="paymentType"
                        placeholder="Tipo de Pago"
                        value={form.paymentType}
                        onChange={handleChange}
                        required
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="saleType"
                            checked={form.saleType}
                            onChange={handleChange}
                        />
                        Venta Mayorista
                    </label>
                    <input
                        className="border border-gray-200 rounded-lg p-2"
                        name="total"
                        type="number"
                        placeholder="Total"
                        value={form.total}
                        onChange={handleChange}
                        required
                        min={0}
                        step={0.01}
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
                <span className="ml-4 text-gray-600">Cargando ventas...</span>
            </div>
        );
    }

    return (
        <div className="w-full flex min-w-0">
            <div className="w-full p-6 bg-white rounded-lg min-w-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold ml-4 text-gray-800 ">Ventas</h2>
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
                    <table className="min-w-[900px] w-full table-auto border-collapse">
                        <thead>
                            <tr className="text-gray-800">
                                <th className="p-3 border-b border-gray-200">ID</th>
                                <th className="p-3 border-b border-gray-200">CLIENTE</th>
                                <th className="p-3 border-b border-gray-200">USUARIO</th>
                                <th className="p-3 border-b border-gray-200">COMPROBANTE</th>
                                <th className="p-3 border-b border-gray-200">TIPO DE PAGO</th>
                                <th className="p-3 border-b border-gray-200">MAYORISTA</th>
                                <th className="p-3 border-b border-gray-200">TOTAL</th>
                                <th className="p-3 border-b border-gray-200">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {paginatedSales.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-8">No hay ventas registradas.</td>
                                </tr>
                            ) : (
                                paginatedSales.map((sale) => (
                                    <tr
                                        key={sale.saleId}
                                        className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <td className="px-4 py-2">{sale.saleId}</td>
                                        <td className="px-4 py-2">{sale.clientName}</td>
                                        <td className="px-4 py-2">{sale.userName}</td>
                                        <td className="px-4 py-2">{sale.receiptInfo}</td>
                                        <td className="px-4 py-2">{sale.paymentType}</td>
                                        <td className="px-4 py-2">{sale.saleType ? "Sí" : "No"}</td>
                                        <td className="px-4 py-2">{sale.total.toFixed(2)}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                                <button
                                                    className="flex items-center justify-center bg-white text-indigo-500 px-4 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-100 hover:cursor-pointer transition-colors"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        const apiSale = salesApi.find(s => s.saleId === sale.saleId);
                                                        if (apiSale) openEditModal(apiSale);
                                                    }}
                                                >
                                                    <PencilSquareIcon className="size-6 inline-block mr-1 text-indigo-500" />
                                                    Editar
                                                </button>
                                                <button
                                                    className="flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition-colors ml-2"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        const apiSale = salesApi.find(s => s.saleId === sale.saleId);
                                                        if (apiSale) openDeleteModal(apiSale);
                                                    }}
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
                {/* Gráfico de ventas por cliente */}
                <div className="mt-8">
                    <span className="block text-gray-700 font-semibold mb-2">Ventas totales por cliente</span>
                    <Chart
                        chartType="ColumnChart"
                        width="100%"
                        height="300px"
                        data={sales.length > 0 ? chartData : [["Cliente", "Total vendido"], ["Sin datos", 0]]}
                        options={{
                            legend: { position: "none" },
                            colors: ["#6366f1"],
                            hAxis: { title: "Cliente" },
                            vAxis: { title: "Total vendido" },
                            backgroundColor: "transparent",
                        }}
                    />
                </div>
                {/* Gráfico de ventas por usuario */}
                <div className="mt-8">
                    <span className="block text-gray-700 font-semibold mb-2">Ventas totales por usuario</span>
                    <Chart
                        chartType="ColumnChart"
                        width="100%"
                        height="300px"
                        data={sales.length > 0 ? chartDataByUser : [["Usuario", "Total vendido"], ["Sin datos", 0]]}
                        options={{
                            legend: { position: "none" },
                            colors: ["#10b981"],
                            hAxis: { title: "Usuario" },
                            vAxis: { title: "Total vendido" },
                            backgroundColor: "transparent",
                        }}
                    />
                </div>
                {/* Gráfico de cantidad de ventas por tipo de pago */}
                <div className="mt-8">
                    <span className="block text-gray-700 font-semibold mb-2">Cantidad de ventas por tipo de pago</span>
                    <Chart
                        chartType="PieChart"
                        width="100%"
                        height="300px"
                        data={sales.length > 0 ? chartDataByPayment : [["Tipo de Pago", "Cantidad"], ["Sin datos", 0]]}
                        options={{
                            legend: { position: "right" },
                            colors: ["#6366f1", "#10b981", "#f59e42", "#ef4444"],
                            backgroundColor: "transparent",
                        }}
                    />
                </div>
                {/* Gráfico de ventas por tipo (mayorista/minorista) */}
                <div className="mt-8">
                    <span className="block text-gray-700 font-semibold mb-2">Ventas por tipo</span>
                    <Chart
                        chartType="PieChart"
                        width="100%"
                        height="300px"
                        data={sales.length > 0 ? chartDataBySaleType : [["Tipo de Venta", "Cantidad"], ["Sin datos", 0]]}
                        options={{
                            legend: { position: "right" },
                            colors: ["#6366f1", "#f59e42"],
                            backgroundColor: "transparent",
                        }}
                    />
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

export default SalesView;