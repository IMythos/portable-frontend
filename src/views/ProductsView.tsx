import { useEffect, useState } from "react";
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import Modal from "../components/Modal";
import { API_BASE_URL } from "../utils/config";
import Chart from "react-google-charts";

import "../css/fonts.css";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 5;

type Product = {
    productId?: number,
    productCode: string,
    productAnnex: string,
    description: string,
    salePrice: number,
    purchasePrice: number,
    wholeSale: number,
    category: string,
    status: boolean,
    brand: string
};

type ModalType = "ADD_PRODUCT" | "EDIT_PRODUCT" | "DELETE_PRODUCT" | null;

const ProductsView = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [topBrands, setTopBrands] = useState<{ brand: string, count: number }[]>([]);
    const [topProducts, setTopProducts] = useState<{ productAnnex: string, description: string, salePrice: number }[]>([]);

    const fetchAllData = () => {
        setLoading(true);

        fetch(`${API_BASE_URL}/products/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(setProducts)
            .finally(() => setLoading(false));

        fetch(`${API_BASE_URL}/products/top-brands`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(setTopBrands);

        fetch(`${API_BASE_URL}/products/top-products`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(setTopProducts);
    }

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const newProduct: Product = {
            productCode: form.productCode.value,
            productAnnex: form.productAnnex.value,
            description: form.description.value,
            salePrice: parseFloat(form.salePrice.value),
            purchasePrice: parseFloat(form.purchasePrice.value),
            wholeSale: parseFloat(form.wholeSale.value),
            category: form.category.value,
            status: true,
            brand: form.brand.value,
        };

        await fetch(`${API_BASE_URL}/products/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(newProduct)
        });

        closeModal();
        fetchAllData();
    };

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedProduct) return;

        const form = e.currentTarget;
        const updatedProduct: Product = {
            ...selectedProduct,
            productCode: form.productCode.value,
            productAnnex: form.productAnnex.value,
            description: form.description.value,
            salePrice: parseFloat(form.salePrice.value),
            purchasePrice: parseFloat(form.purchasePrice.value),
            wholeSale: parseFloat(form.wholeSale.value),
            category: form.category.value,
            brand: form.brand.value,
        };

        await fetch(`${API_BASE_URL}/products/update/${selectedProduct.productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(updatedProduct)
        });

        closeModal();
        fetchAllData();
    }

    const handleDelete = async () => {
        if (!selectedProduct) return;
        await fetch(`${API_BASE_URL}/products/delete/${selectedProduct.productId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        closeModal();
        fetchAllData();
    }

    const filteredProducts = products.filter(product =>
        product.description.toLowerCase().includes(filter.toLowerCase()) ||
        product.productCode.toLowerCase().includes(filter.toLowerCase()) ||
        product.productAnnex.toLowerCase().includes(filter.toLowerCase())
    )

    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const openAddModal = () => {
        setSelectedProduct(null);
        setModalType("ADD_PRODUCT");
    };
    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setModalType("EDIT_PRODUCT");
    };
    const openDeleteModal = (product: Product) => {
        setSelectedProduct(product);
        setModalType("DELETE_PRODUCT");
    };
    const closeModal = () => {
        setModalType(null);
        setSelectedProduct(null);
    };

    // Aquí va la lógica para agregar/editar/eliminar productos (puedes implementarla según tu backend)

    const renderModal = () => {
        if (!modalType) return null;
        if (modalType === "DELETE_PRODUCT") {
            return (
                <Modal onClose={closeModal}>
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-4">¿Eliminar producto?</h3>
                        <p className="mb-6">¿Seguro que deseas eliminar el producto <b>{selectedProduct?.description}</b>?</p>
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
            );
        }
        return (
            <Modal onClose={closeModal}>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={modalType === "ADD_PRODUCT" ? handleAdd : handleEdit}
                >
                    <input
                        className="border p-2 rounded border-gray-300"
                        name="productCode"
                        placeholder="Código"
                        defaultValue={selectedProduct?.productCode || ""}
                        required
                    />
                    <input
                        className="border p-2 rounded border-gray-300"
                        name="productAnnex"
                        placeholder="Anexo"
                        defaultValue={selectedProduct?.productAnnex || ""}
                        required
                    />
                    <input
                        className="border p-2 rounded border-gray-300"
                        name="description"
                        placeholder="Descripción"
                        defaultValue={selectedProduct?.description || ""}
                        required
                    />
                    <input
                        className="border p-2 rounded border-gray-300"
                        name="salePrice"
                        placeholder="Precio Venta"
                        type="number"
                        step="0.01"
                        defaultValue={selectedProduct?.salePrice || ""}
                        required
                    />
                    <input
                        className="border p-2 rounded border-gray-300"
                        name="purchasePrice"
                        placeholder="Precio Compra"
                        type="number"
                        step="0.01"
                        defaultValue={selectedProduct?.purchasePrice || ""}
                        required
                    />
                    <input
                        className="border p-2 rounded border-gray-300"
                        name="wholeSale"
                        placeholder="Precio Mayorista"
                        type="number"
                        step="0.01"
                        defaultValue={selectedProduct?.wholeSale || ""}
                        required
                    />
                    <input
                        className="border p-2 rounded border-gray-300"
                        name="category"
                        placeholder="Categoría"
                        defaultValue={selectedProduct?.category || ""}
                        required
                    />
                    <input
                        className="border p-2 rounded border-gray-300"
                        name="brand"
                        placeholder="Marca"
                        defaultValue={selectedProduct?.brand || ""}
                        required
                    />
                    <div className="flex gap-2 mt-4">
                        <button className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded" type="submit">
                            {modalType === "ADD_PRODUCT" ? "Agregar" : "Guardar"}
                        </button>
                        <button className="bg-white px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-gray-100" type="button" onClick={closeModal}>Cancelar</button>
                    </div>
                </form>
            </Modal>
        );
    };

    return (
        <div className="w-full p-6 bg-white rounded-lg min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-10 mb-4">
                <h2 className="text-xl font-bold text-gray-800 ml-0 md:ml-4">Productos</h2>
                <input
                    type="text"
                    placeholder="Anexo, Código o Descripción"
                    className="border border-gray-300 rounded custom-font-s px-3 py-2 w-full md:w-2/4 focus:outline-indigo-500"
                    value={filter}
                    onChange={e => {
                        setFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        className="p-1 border rounded bg-white border-indigo-500 hover:bg-indigo-100 text-indigo-500"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ArrowLeftIcon className="size-6" />
                    </button>
                    <span className="mx-2">{currentPage} de {totalPages}</span>
                    <button
                        className="p-1 border rounded bg-white border-indigo-500 hover:bg-indigo-100 text-indigo-500"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <ArrowRightIcon className="size-6" />
                    </button>
                    <button
                        className="bg-indigo-800 text-white flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-indigo-900"
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
                            <th className="p-2 border-b border-gray-200">CÓDIGO</th>
                            <th className="p-2 border-b border-gray-200">ANEXO</th>
                            <th className="p-2 border-b border-gray-200">DESCRIPCIÓN</th>
                            <th className="p-2 border-b border-gray-200">VENTA (S/.)</th>
                            <th className="p-2 border-b border-gray-200">COMPRA (S/.)</th>
                            <th className="p-2 border-b border-gray-200">MAYORISTA (S/.)</th>
                            <th className="p-2 border-b border-gray-200">CATEGORÍA</th>
                            <th className="p-2 border-b border-gray-200">ESTADO</th>
                            <th className="p-2 border-b border-gray-200">MARCA</th>
                            <th className="p-2 border-b border-gray-200">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {loading ? (
                            <tr>
                                <td colSpan={11} className="text-center py-8">Cargando productos...</td>
                            </tr>
                        ) : paginatedProducts.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="text-center py-8">No hay productos registrados.</td>
                            </tr>
                        ) : (
                            paginatedProducts.map(product => (
                                <tr 
                                    key={product.productId} 
                                    className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                                    onClick={() => navigate(`/dashboard/products/${product.productId}`)}
                                >
                                    <td className="p-2">{product.productId}</td>
                                    <td className="p-2">{product.productCode}</td>
                                    <td className="p-2">{product.productAnnex}</td>
                                    <td className="p-2">{product.description}</td>
                                    <td className="p-2">{product.salePrice}</td>
                                    <td className="p-2">{product.purchasePrice}</td>
                                    <td className="p-2">{product.wholeSale}</td>
                                    <td className="p-2">{product.category}</td>
                                    <td className="p-2">{product.status ? "Disponible" : "En retiro"}</td>
                                    <td className="p-2">{product.brand}</td>
                                    <td className="p-2">
                                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                            <button
                                                className="flex items-center justify-center bg-white text-indigo-500 px-4 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-100 hover:cursor-pointer transition-colors"
                                                onClick={e => { e.stopPropagation(); openEditModal(product); }}
                                            >
                                                <PencilSquareIcon className="size-6 inline-block mr-1 text-indigo-500" />
                                                Editar
                                            </button>
                                            <button
                                                className="flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition-colors ml-2"
                                                onClick={e => { e.stopPropagation(); openDeleteModal(product); }}
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
                <div className="flex flex-col md:flex-row gap-6 mt-6">
                    <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center min-w-[320px]">
                        <span className="block text-gray-700 font-semibold mb-2">Top 5 Marcas por cantidad de productos</span>
                        {topBrands.length > 0 ? (
                            <Chart
                                chartType="PieChart"
                                width="100%"
                                height="260px"
                                data={[
                                    ["Marca", "Cantidad"],
                                    ...topBrands.map(b => [b.brand, b.count])
                                ]}
                                options={{
                                    legend: { position: "bottom" },
                                    pieHole: 0.4,
                                    colors: ["#6366f1", "#f59e42", "#10b981", "#ef4444", "#fbbf24"],
                                    chartArea: { width: "90%", height: "80%" }
                                }}
                            />
                        ) : (
                            <div className="text-gray-400">Sin datos</div>
                        )}
                    </div>
                    <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col min-w-[320px]">
                        <span className="block text-gray-700 font-semibold mb-2">Top 5 productos por precio de venta</span>
                        <div className="overflow-x-auto w-full min-w-0">
                            <table className="min-w-[500px] w-full table-auto border-collapse">
                                <thead>
                                    <tr className="text-gray-800">
                                        <th className="p-2 border-b border-gray-200">ANEXO</th>
                                        <th className="p-2 border-b border-gray-200">DESCRIPCIÓN</th>
                                        <th className="p-2 border-b border-gray-200">PRECIO VENTA</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600">
                                    {topProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-8">Sin datos</td>
                                        </tr>
                                    ) : (
                                        topProducts.map(p => (
                                            <tr key={p.productAnnex} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                                                <td className="p-2">{p.productAnnex}</td>
                                                <td className="p-2">{p.description}</td>
                                                <td className="p-2">S/ {p.salePrice}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {renderModal()}
        </div>
    );
};

export default ProductsView;