import Link from 'next/link';

export default function NavigationBar() {
  return (
    <nav className="w-full border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Book Shelf
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="hover:text-gray-600">
            로그인
          </Link>
          <Link href="/register" className="hover:text-gray-600">
            회원가입
          </Link>
        </div>
      </div>
    </nav>
  );
} 