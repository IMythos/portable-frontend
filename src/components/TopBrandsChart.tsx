import { useEffect, useState } from "react"
import type { UnitBrand } from "../interfaces/UnitBrand";
import Chart from "react-google-charts";
import { hasRole } from "../utils/roles";
import { useAuth } from "../auth/useAuth";

const TopBrandsChart = () => {
    const { role } = useAuth();
    const [data, setData] = useState<(string | number)[][]>([["Marca", "Unidades"]]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = async () => {
            const endPointRole = hasRole(role);
            if (!endPointRole) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/v1/api/${endPointRole}/top-brands`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const result: UnitBrand[] = await response.json();
                console.log(result);
                const chartData: (string | number)[][] = [
                    ["Marca", "Unidades"],
                    ...result.map((item) => [item.brand, item.quantity]),
                ];
                setData(chartData);
            } catch (error) {
                console.error(error);
                setData([["Marca", "Unidades"], ["Sin datos", 0]]);
            } finally {
                setLoading(false);
            }
        };
        data();
    }, [role]);

    if (loading) return <div>Cargando gráfico...</div>

    return (
        <div className="flex justify-center items-center">
            <Chart
                chartType="ColumnChart"
                width="600px"
                height="300px"
                data={data}
                options={{
                    title: "Top 7 Marcas por Unidades",
                    legend: { position: "none" },
                    vAxis: { title: "Unidades" },
                    hAxis: { title: "Marca" },
                    colors: ["#6366f1"]
                }}
            />
        </div>
    );
}

export default TopBrandsChart;