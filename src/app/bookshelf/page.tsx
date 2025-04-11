import { Suspense } from "react";
import BookShelf from "./BookShelf";

export default function BookShelfPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <BookShelf />
    </Suspense>
  );
}