const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 p-6 rounded-xl z-10 text-center shadow-xl w-[90%] md:w-auto min-w-[300px]">
            <div className="flex justify-end w-full mb-2">
              <button
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-2xl font-semibold focus:outline-none transition-colors"
                onClick={onClose}
              >
                &times;
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
