import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";
import Modal from "../components/Modal";

type Product = {
    productId: number;
    productCode: string;
    productAnnex: string;
    description: string;
    salePrice: number;
    purchasePrice: number;
    wholeSale: number;
    category: string;
    status: boolean;
    brand: string;
};

const ProductDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [modal, setModal] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/products/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(setProduct);
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!product) return;
        const { name, value } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
            setProduct({
                ...product,
                [name]: e.target.checked
            });
        } else {
            setProduct({
                ...product,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        const res = await fetch(`${API_BASE_URL}/products/update/${product.productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(product)
        });
        if (res.ok) {
            setModal("Producto actualizado correctamente.");
        } else {
            setModal("Error al actualizar el producto.");
        }
    };

    if (!product) return <div className="text-center text-gray-500 mt-10">Cargando...</div>;

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
            <h2 className="text-2xl font-bold mb-8 text-indigo-800 text-center tracking-tight">Detalle del Producto</h2>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Código</label>
                        <input
                            className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                            name="productCode"
                            value={product.productCode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Anexo</label>
                        <input
                            className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                            name="productAnnex"
                            value={product.productAnnex}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Descripción</label>
                    <input
                        className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Precio Venta</label>
                        <input
                            type="number"
                            step="0.01"
                            className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                            name="salePrice"
                            value={product.salePrice}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Precio Compra</label>
                        <input
                            type="number"
                            step="0.01"
                            className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                            name="purchasePrice"
                            value={product.purchasePrice}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Precio Mayorista</label>
                        <input
                            type="number"
                            step="0.01"
                            className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                            name="wholeSale"
                            value={product.wholeSale}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Categoría</label>
                        <input
                            className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Marca</label>
                        <input
                            className="border border-gray-200 rounded-lg p-2 w-full bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                            name="brand"
                            value={product.brand}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="status"
                        checked={product.status}
                        onChange={handleChange}
                        className="accent-indigo-600"
                    />
                    <label className="text-xs text-gray-500">Activo</label>
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

export default ProductDetailView;