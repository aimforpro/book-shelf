"use client";

import { ModalProvider } from "@/tsx/ModalContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}