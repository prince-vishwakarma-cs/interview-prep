import { X } from 'lucide-react'; 

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-primary-background">
      <div className="relative flex flex-col  overflow-hidden">
        {!hideHeader && (
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
        )}
        
       <button
          type="button"
          className="text-secondary-text bg-transparent hover:bg-hover-alpha hover:text-primary-text rounded-lg text-sm w-8 h-8 grid place-items-center absolute top-3.5 right-3.5 transition-colors"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;