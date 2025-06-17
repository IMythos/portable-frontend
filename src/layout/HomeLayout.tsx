import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../auth/useAuth";

interface LayoutProps {
    children: React.ReactNode;
    roleName?: string | null;
}

const HomeLayout = ({children}: LayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { role } = useAuth();

    return (
        <main className="w-full h-screen flex">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <section className="flex-1 relative h-screen overflow-y-auto bg-indigo-50">
                <Header onMenuClick={() => setSidebarOpen(true)} roleName={role} />
                {children}
            </section>
        </main>
    );
}

export default HomeLayout;