// src/app/register/page.tsx
import { Suspense } from "react";
import Register from "./Register";  

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <Register />
    </Suspense>
  );
}