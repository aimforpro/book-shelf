"use client";

import { ModalProvider } from "@/context/ModalContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}