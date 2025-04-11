// src/app/login/page.tsx
import { Suspense } from "react";
import Login from "@/app/login/Login";
import NavigationBar from "@/tsx/NavigationBar";

export default function LoginPage() {
  return (
    <div className="bg-[#FFFFFF] flex flex-col items-start justify-start min-h-screen">
      <Suspense fallback={<div className="text-center mt-10">로딩 중...</div>}>
        <Login />
      </Suspense>
      <NavigationBar currentPath="/login" />
    </div>
  );
}