import { XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 200);
    };

    // Cierra al hacer click fuera del modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur transition-opacity duration-200 ${show ? "opacity-100" : "opacity-0"}`}
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white rounded-xl shadow-xl p-8 w-full max-w-lg mx-4 relative transition-all duration-200 ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={handleClose}
                    aria-label="Cerrar modal"
                >
                    <XMarkIcon className="size-6" />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;