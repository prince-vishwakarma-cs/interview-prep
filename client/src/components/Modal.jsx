import React from "react";

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {

  if(!isOpen ) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full bg-black/40">
      <div className="relative flex flex-col bg-white shdow-lg rounded-lg overflow-hidden">
        {!hideHeader && (
          <div className="flex items-center justify-between border-b border-gray-200 p-4 ">
            <h3 className="nd:text-lg font-medium text-gray-900">{title}</h3>
          </div>
        )}

        <button type="button" className="text-gray-400 bg-transparent hover:bg-orange-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute top-3.5 right-3.5 cursor-pointer" onClick={onClose}>
        <svg
  xmlns="http://www.w3.org/2000/svg"
  width="14"
  height="14"
  viewBox="0 0 14 14"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <line x1="1" y1="1" x2="13" y2="13" />
  <line x1="13" y1="1" x2="1" y2="13" />
</svg>


        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar ">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
