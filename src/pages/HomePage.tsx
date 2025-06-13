import { useAuth } from "../auth/useAuth";
import HomeLayout from "../layout/HomeLayout";
import AdminView from "../views/AdminView";

const Home = () => {
    const { role, roleName } = useAuth();
    console.log(role)
    return (
        <HomeLayout roleName={roleName}>
            { role === "ADMINISTRADOR" && <AdminView /> }
        </HomeLayout>
    );
}

export default Home;