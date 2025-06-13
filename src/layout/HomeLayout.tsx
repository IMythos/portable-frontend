import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface LayoutProps {
    children: React.ReactNode;
    roleName?: string | null;
}

const HomeLayout = ({children, roleName}: LayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <main className="w-full h-screen flex">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <section className="flex-1 relative h-screen overflow-y-auto bg-indigo-50">
                <Header onMenuClick={() => setSidebarOpen(true)} roleName={roleName} />
                {children}
            </section>
        </main>
    );
}

export default HomeLayout;