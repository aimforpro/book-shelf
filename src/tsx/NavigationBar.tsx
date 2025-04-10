import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface NavigationBarProps {
  currentPath?: string; // 선택적 prop으로 현재 경로를 받아 활성 상태 표시
}

const NavigationBar: React.FC<NavigationBarProps> = ({ currentPath = "" }) => {
  const pathname = usePathname();
  const activePath = currentPath || pathname || "";

  const navItems = [
    { path: "/main", iconOff: "/assets/icons/home-off.svg", iconOn: "/assets/icons/home-on.svg", label: "홈" },
    { path: "/bookshelf", iconOff: "/assets/icons/book-off.svg", iconOn: "/assets/icons/book-on.svg", label: "책꽃이" },
    { path: "/mypage", iconOff: "/assets/icons/profile-off.svg", iconOn: "/assets/icons/profile-on.svg", label: "프로필" },
  ];

  return (
    <div className="bg-[#FFFFFF] border-t border-[#F5F2F0] pt-2 pb-3 flex flex-row items-center justify-around fixed bottom-0 w-full h-[60px]">
      {navItems.map((item) => (
        <Link href={item.path} key={item.path}>
          <div className="flex flex-col items-center justify-center gap-1">
            <Image
              src={activePath === item.path ? item.iconOn : item.iconOff}
              alt={`${item.label} Icon`}
              width={24}
              height={24}
              className="object-contain max-w-[24px] max-h-[24px]"
            />
            <span
              className={`text-[#4A4A4A] font-['Pretendard'] text-xs leading-[18px] ${
                activePath === item.path ? "font-bold" : "font-normal"
              }`}
            >
              {item.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NavigationBar;