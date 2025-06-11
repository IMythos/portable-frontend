import { useNavigate } from "react-router-dom";

const NotFound = () => {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    return(
        <main className="w-full h-screen flex items-center justify-center">
            <div className="w-2xl flex items-center justify-center flex-col">
                <h1 className="text-8xl mb-3 text-gray-800">404</h1>
                <h1 className="text-2xl text-gray-500">Not Found</h1>
                <span className="mt-2">El recurso o vista no se encuentra.</span>
                <a 
                    className="text-blue-50 bg-blue-600 p-3 mt-4 hover:bg-blue-400 hover:text-gray-800 hover:cursor-pointer"
                    onClick={handleBack}
                >Pagina Anterior</a>
            </div>
        </main>
    );
}

export default NotFound;