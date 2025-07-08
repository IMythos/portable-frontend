const DefaultContent = () => (
    <div className="flex flex-col items-center justify-center w-full h-[60vh]">
        <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center max-w-md w-full">
            <svg className="w-16 h-16 text-indigo-400 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">Selecciona una acción</h2>
            <p className="text-gray-500 text-center">Elige una opción del menú lateral para comenzar a gestionar tu información.</p>
        </div>
    </div>
);

export default DefaultContent;