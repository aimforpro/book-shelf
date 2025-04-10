"use client";

import React, { createContext, useContext, useState } from "react";
import Modal from "@/components/Modal";

interface ModalState {
  isOpen: boolean;
  message: string;
  type: "success" | "error";
}

interface ModalContextType {
  showModal: (message: string, type: "success" | "error") => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<ModalState>({ isOpen: false, message: "", type: "success" });

  const showModal = (message: string, type: "success" | "error") => {
    setModal({ isOpen: true, message, type });
  };

  const hideModal = () => {
    setModal({ isOpen: false, message: "", type: "success" });
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        type={modal.type}
        onClose={hideModal}
      />
    </ModalContext.Provider>
  );
};

// 커스텀 훅
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal은 ModalProvider 내에서 사용해야 합니다.");
  }
  return context;
};