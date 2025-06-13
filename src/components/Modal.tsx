import { XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";

const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 200);
    }
    
    return (
        <div className={`absolute inset-0 w-full top-20 max-h-screen flex items-center justify-center bg-gray-500/70 z-50 transition-opacity duration-200" ${show ? "bg-gray-500/70 opacity-100" : "bg-gray-500/0 opacity-0"}`}>
            <div className={`bg-white rounded-lg p-6 w-full max-w-lg mx-4 relative transition-all duration-200 ${show ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
                <button 
                    className="absolute top-2 right-2 text-gray-500"
                    onClick={handleClose} 
                >
                    <XMarkIcon className="size-6 hover:text-gray-700 transition-colors" />
                </button>
                { children }
            </div>
        </div>
    );
}

export default Modal;