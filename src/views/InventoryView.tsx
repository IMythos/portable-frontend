import { useEffect, useState } from "react";
import type { Product } from "../interfaces/Product";
import { useAuth } from "../auth/useAuth";
import { hasRole } from "../utils/roles";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { PlusIcon } from "@heroicons/react/16/solid";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/16/solid";
import { TruckIcon } from "@heroicons/react/16/solid";
import TopBrandsChart from "../components/TopBrandsChart";
import type Warehouse from "../interfaces/Warehouse";

const PAGE_SIZE = 5;

const InventoryView = () => {
    const { role } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const endpointRole = hasRole(role);
        const getProducts = async () => {
            if (!endpointRole) return;

            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/v1/api/${endpointRole}/products`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await response.json();
                console.log(data);
                setProducts(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        const getWarehouses = async () => {
            try {
                const response = await fetch(`http://localhost:8080/v1/api/${endpointRole}/warehouses`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await response.json();
                console.log(data);
                setWarehouses(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        getWarehouses();
        getProducts();
    }, [role]);

    const totalPages = Math.ceil(products.length / PAGE_SIZE);
    const paginatedProducts = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    if (loading) return <div>Cargando productos...</div>;

    return (
        <div className="w-full flex flex-col">
            <div className="w-auto p-6 bg-white mr-6 rounded-lg ml-7 mb-7">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold ml-4 text-gray-800">Productos</h2>
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
                                <th className="p-3 border-b border-gray-200 custom-font-m">CODIGO</th>
                                <th className="p-3 border-b border-gray-200 custom-font-m">ANEXO</th>
                                <th className="p-3 border-b border-gray-200 custom-font-m">DESCRIPCION</th>
                                <th className="p-3 border-b border-gray-200 custom-font-m">VENTA (S/.)</th>
                                <th className="p-3 border-b border-gray-200 custom-font-m">COMPRA (S/.)</th>
                                <th className="p-3 border-b border-gray-200 custom-font-m">MAYOR (S/.)</th>
                                <th className="p-3 border-b border-gray-200 custom-font-m">CATEGORIA</th>
                                <th className="p-3 border-b border-gray-200 custom-font-m">BRAND</th>
                                <th className="p-3 border-b border-gray-200 custom-font-m">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {
                                paginatedProducts.map(product => (
                                    <tr key={product.productId} className="border-b border-gray-200 hover:bg-gray-100 transition-colors hover:cursor-pointer ">
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m max-w-[56px] truncate text-center">{product.productId}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m text-center">{product.productCode}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m text-center">{product.productAnnex}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m max-w-[250px] truncate" title={product.description}>{product.description}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m max-w-[120px] truncate text-center">{product.salePrice}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m max-w-[120px] truncate text-center">{product.purchasePrice}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m max-w-[120px] truncate text-center">{product.wholeSale}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m text-center">{product.category}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m max-w-[90px] truncate text-center">{product.brand}</td>
                                        <td className="px-4 py-2 whitespace-nowrap custom-font-m max-w-[540px]">
                                            <div className="flex flex-col sm:flex-row justify-center">
                                                <button
                                                    className="flex items-center justify-center bg-white text-indigo-500 px-4 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-100 hover:cursor-pointer transition-colors"
                                                >
                                                    <PencilSquareIcon className="size-6 inline-block mr-1 text-indigo-500" />
                                                    Editar
                                                </button>
                                                <button
                                                    className="flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition-colors ml-2"
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
            <div className="w-auto flex gap-8 mr-7 ml-7">
                <div className="flex flex-1 w-full bg-white rounded-lg p-6 flex-col gap-8">
                    <h2 className="text-xl font-bold ml-4 text-gray-800">Almacenes</h2>
                    <div className="w-full flex flex-1 items-center gap-7 justify-center">
                        {
                            warehouses.map(warehouse => (
                                <div className="w-40 h-40 border bg-white border-indigo-500 hover:bg-indigo-100 hover:cursor-pointer transition-all text-indigo-500 custom-font-m rounded-2xl flex items-center justify-center flex-col text-center hover:scale-105">
                                    <TruckIcon className="size-10 mb-3" />
                                    <span className="font-bold">{warehouse.warehouseCode}</span>
                                    <h2>{warehouse.warehouseName}</h2>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="flex flex-1 justify-center items-center bg-white rounded-lg">
                    <TopBrandsChart />
                </div>
            </div>
        </div>
    );
}

export default InventoryView;