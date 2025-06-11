import Sidebar from "../components/Sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

const HomeLayout = ({children}: LayoutProps) => {
    return (
        <main className="w-full h-screen flex">
            <Sidebar />
            <section className="flex-1">
                {children}
            </section>
        </main>
    );
}

export default HomeLayout;