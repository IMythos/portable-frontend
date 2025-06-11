interface NavLayoutProps {
    children: React.ReactNode;
}

const NavLayout = ({children}: NavLayoutProps) => {
    return (
        <nav className="">{children}</nav>
    );
}

export default NavLayout;