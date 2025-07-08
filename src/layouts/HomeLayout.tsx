import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../auth/useAuth";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { role } = useAuth();

    return (
        <main className="min-h-screen flex">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <section className="flex-1 flex flex-col min-h-screen min-w-0 bg-indigo-50">
                <Header onMenuClick={() => setSidebarOpen(true)} roleName={role} />
                <main className="flex-1 min-w-0 min-h-0 overflow-y-auto p-6">{children}</main>
            </section>
        </main>
    );
};

export default HomeLayout;