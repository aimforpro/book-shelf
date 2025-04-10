"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  showModal: (message: string, type: "success" | "error") => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error">("success");

  const showModal = (msg: string, modalType: "success" | "error") => {
    setMessage(msg);
    setType(modalType);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setMessage("");
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-[350px] flex flex-col gap-4">
            <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">
              {type === "success" ? "알림" : "오류"}
            </h3>
            <p className="text-[#1C2526] text-base font-['Pretendard'] font-normal">
              {message}
            </p>
            <button
              onClick={closeModal}
              className="bg-[#EBBA61] text-white text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#e0a852] transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};