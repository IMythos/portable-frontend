import { useAuth } from "../auth/useAuth";
import HomeLayout from "../layout/HomeLayout";
import AdminView from "../views/AdminView";
import InventoryView from "../views/InventoryView";

const Home = () => {
    const { role } = useAuth();
    return (
        <HomeLayout>
            { role === "ADMINISTRADOR" && <AdminView /> }
            { role === "INVENTARIO" && <InventoryView /> }
        </HomeLayout>
    );
}

export default Home;