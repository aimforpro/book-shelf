"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="rounded-lg p-6 max-w-sm w-full mx-4 bg-[#FFFFFF] shadow-md">
        <h3
          className={`text-lg font-semibold mb-2 ${
            type === "success" ? "text-green-800" : "text-gray-800"
          }`}
        >
          {type === "success" ? "알림" : "안내"} {/* "오류" 대신 "안내" */}
        </h3>
        <p className="text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-2 rounded ${
            type === "success" ? "bg-green-500" : "bg-[#A7A7A7]"
          } text-white hover:opacity-90`}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default Modal;