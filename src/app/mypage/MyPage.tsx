"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import NavigationBar from "@/tsx/NavigationBar";
import { useAuth } from "@/ts/useAuth";
import { useRouter } from "next/navigation";
import { supabase } from "@/ts/supabase";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import TermsOfServiceModal from "./TermsOfServiceModal";

const MyPage: React.FC = () => {
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [supportMessage, setSupportMessage] = useState<string>("");
  const [contactInfo, setContactInfo] = useState<string>("");
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  const { user, loading: authLoading, deleteUser } = useAuth();
  const router = useRouter();

  const colorOptions = [
    { name: "Pure White", value: "#FFFFFF" },
    { name: "Soft Gray", value: "#F4F4F4" },
    { name: "Dark Gray", value: "#2D2D2D" },
    { name: "Pastel Blue", value: "#E6F0FA" },
    { name: "Warm Beige", value: "#FAF7F0" },
    { name: "Mint Green", value: "#E8F5E9" },
    { name: "Blush Pink", value: "#FFF1F3" },
  ];

  const selectedColorName = colorOptions.find((color) => color.value === backgroundColor)?.name || "Pure White";

  const handleBackgroundChange = (color: string) => {
    setBackgroundColor(color);
    setIsBackgroundModalOpen(false);
  };

  const handleSupportSubmit = async () => {
    if (!supportMessage.trim()) {
      setIsAlertModalOpen(true);
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user?.id)
        .single();

      if (userError) throw userError;

      const { error } = await supabase.from("support").insert({
        user_id: userData?.id || null,
        contact_info: contactInfo || null,
        message: supportMessage,
      });

      if (error) throw error;
      setSupportMessage("");
      setContactInfo("");
      setIsSupportModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("문의 저장 실패:", error);
      alert("문의 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleLogoutPrompt = () => setIsLogoutModalOpen(true);

  const handleLogoutConfirm = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      document.cookie = "sb-access-token=; Max-Age=0; path=/;";
      if (error) throw error;
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLogoutModalOpen(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(); // useAuth에서 제공하는 deleteUser 호출
    } catch (error) {
      console.error("계정 삭제 실패:", error);
      alert("계정 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleteModalOpen(false);
      setIsProfileModalOpen(false);
    }
  };

  const toggleBackgroundModal = () => setIsBackgroundModalOpen(!isBackgroundModalOpen);
  const toggleProfileModal = () => setIsProfileModalOpen(!isProfileModalOpen);
  const toggleTermsModal = () => setIsTermsModalOpen(!isTermsModalOpen);
  const togglePrivacyModal = () => setIsPrivacyModalOpen(!isPrivacyModalOpen);
  const toggleSupportModal = () => setIsSupportModalOpen(!isSupportModalOpen);
  const toggleLogoutModal = () => setIsLogoutModalOpen(!isLogoutModalOpen);
  const toggleAlertModal = () => setIsAlertModalOpen(!isAlertModalOpen);
  const toggleSuccessModal = () => setIsSuccessModalOpen(!isSuccessModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) return <div className="text-center mt-10">로딩 중...</div>;
  if (!user) return null;

  return (
    <div className="flex flex-col items-start justify-start min-h-screen" style={{ backgroundColor }}>
      <div className="flex flex-col gap-0 items-start justify-start w-full max-w-[390px] min-h-screen mx-auto relative overflow-auto">
        <div
          className="pt-4 px-4 pb-2 flex flex-row items-center justify-between w-full h-[72px] shadow-sm"
          style={{ backgroundColor }}
        >
          <div className="text-[#1C2526] text-center font-['Pretendard'] text-xl font-semibold">설정화면</div>
        </div>

        <div className="pt-6 px-4 pb-4 flex flex-col gap-6 items-start justify-center w-full">
          {/* 배경 설정 */}
          {/*
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">배경 설정</h3>
            <div
              onClick={toggleBackgroundModal}
              className="flex flex-row items-center justify-between w-full py-2 rounded-md cursor-pointer"
            >
              <div className="text-[#1C2526] text-base font-['Pretendard'] font-medium">배경 색상</div>
              <div className="flex items-center gap-2">
                <div className="text-[#6B7280] text-base font-['Pretendard'] font-normal">{selectedColorName}</div>
                <Image
                  src="/assets/icons/keyboard-arrow-right.svg"
                  alt="Arrow Right"
                  width={24}
                  height={24}
                  className="shrink-0"
                />
              </div>
            </div>
          </div>
          */}
          {isBackgroundModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[90%] max-w-[350px] flex flex-col gap-4">
                <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">배경 색상 선택</h3>
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleBackgroundChange(color.value)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        backgroundColor === color.value ? "border-[#EBBA61] scale-110" : "border-[#E0E0E0]"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <button
                  onClick={toggleBackgroundModal}
                  className="bg-[#E0E0E0] text-[#1C2526] text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#D0D0D0] transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 계정 관리 */}
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">계정 관리</h3>
            <div
              onClick={toggleProfileModal}
              className="flex flex-row items-center justify-between w-full py-2 rounded-md cursor-pointer"
            >
              <div className="text-[#1C2526] text-base font-['Pretendard'] font-medium">프로필</div>
              <Image
                src="/assets/icons/keyboard-arrow-right.svg"
                alt="Arrow Right"
                width={24}
                height={24}
                className="shrink-0"
              />
            </div>
          </div>

          {isProfileModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[90%] max-w-[350px] flex flex-col gap-4">
                <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">프로필 정보</h3>
                <div className="flex flex-col gap-2">
                  <p className="text-[#1C2526] text-base font-['Pretendard'] font-medium">
                    이메일: {user?.email || "정보 없음"}
                  </p>
                  <p className="text-[#1C2526] text-base font-['Pretendard'] font-medium">
                    이름: {user?.user_metadata?.name || "정보 없음"}
                  </p>
                  <button
                    onClick={toggleDeleteModal}
                    className="bg-[#FF6B6B] text-white text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#e65c5c] transition-colors mt-2"
                  >
                    탈퇴하기
                  </button>
                </div>
                <button
                  onClick={toggleProfileModal}
                  className="bg-[#E0E0E0] text-[#1C2526] text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#D0D0D0] transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          )}

          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[90%] max-w-[350px] flex flex-col gap-4">
                <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">계정 탈퇴</h3>
                <p className="text-[#1C2526] text-base font-['Pretendard'] font-normal">
                  계정을 탈퇴하면 모든 정보가 삭제되며 복구할 수 없습니다. 정말 탈퇴하시겠습니까?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-[#FF6B6B] text-white text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#e65c5c] transition-colors flex-1"
                  >
                    확인
                  </button>
                  <button
                    onClick={toggleDeleteModal}
                    className="bg-[#E0E0E0] text-[#1C2526] text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#D0D0D0] transition-colors flex-1"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 앱 정보 */}
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">앱 정보</h3>
            <div className="flex flex-row items-center justify-between w-full py-2">
              <div className="text-[#1C2526] text-base font-['Pretendard'] font-medium">버전 정보</div>
              <div className="text-[#6B7280] text-base font-['Pretendard'] font-normal">1.0</div>
            </div>
            <div
              onClick={toggleTermsModal}
              className="flex flex-row items-center justify-between w-full py-2 rounded-md cursor-pointer"
            >
              <div className="text-[#1C2526] text-base font-['Pretendard'] font-medium">이용약관</div>
              <Image
                src="/assets/icons/keyboard-arrow-right.svg"
                alt="Arrow Right"
                width={24}
                height={24}
                className="shrink-0"
              />
            </div>
            <div
              onClick={togglePrivacyModal}
              className="flex flex-row items-center justify-between w-full py-2 rounded-md cursor-pointer"
            >
              <div className="text-[#1C2526] text-base font-['Pretendard'] font-medium">개인정보처리방침</div>
              <Image
                src="/assets/icons/keyboard-arrow-right.svg"
                alt="Arrow Right"
                width={24}
                height={24}
                className="shrink-0"
              />
            </div>
          </div>

          {isTermsModalOpen && <TermsOfServiceModal onClose={toggleTermsModal} />}
          {isPrivacyModalOpen && <PrivacyPolicyModal onClose={togglePrivacyModal} />}

          {/* 도움말 및 지원 */}
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">도움말 및 지원</h3>
            <div
              onClick={toggleSupportModal}
              className="flex flex-row items-center justify-between w-full py-2 rounded-md cursor-pointer"
            >
              <div className="text-[#1C2526] text-base font-['Pretendard'] font-medium">고객지원 및 광고문의</div>
              <Image
                src="/assets/icons/keyboard-arrow-right.svg"
                alt="Arrow Right"
                width={24}
                height={24}
                className="shrink-0"
              />
            </div>
          </div>

          {isSupportModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[90%] max-w-[350px] flex flex-col gap-4">
                <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">고객지원 및 광고문의</h3>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setContactInfo(value.slice(0, 11));
                  }}
                  maxLength={11}
                  placeholder="연락처 (선택, 숫자만 입력)"
                  className="w-full p-3 border border-[#E0E0E0] rounded-lg text-[#1C2526] text-base font-['Pretendard'] font-normal focus:outline-none focus:border-[#EBBA61]"
                />
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="문의 내용을 입력해주세요."
                  className="w-full h-32 p-3 border border-[#E0E0E0] rounded-lg text-[#1C2526] text-base font-['Pretendard'] font-normal resize-none focus:outline-none focus:border-[#EBBA61]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSupportSubmit}
                    className="bg-[#EBBA61] text-white text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#e0a852] transition-colors flex-1"
                  >
                    저장
                  </button>
                  <button
                    onClick={toggleSupportModal}
                    className="bg-[#E0E0E0] text-[#1C2526] text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#D0D0D0] transition-colors flex-1"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}

          {isAlertModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[90%] max-w-[350px] flex flex-col gap-4">
                <p className="text-[#1C2526] text-base font-['Pretendard'] font-normal">문의 내용을 입력해주세요.</p>
                <button
                  onClick={toggleAlertModal}
                  className="bg-[#EBBA61] text-white text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#e0a852] transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {isSuccessModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[90%] max-w-[350px] flex flex-col gap-4">
                <p className="text-[#1C2526] text-base font-['Pretendard'] font-normal">
                  문의가 성공적으로 저장되었습니다.
                </p>
                <button
                  onClick={toggleSuccessModal}
                  className="bg-[#EBBA61] text-white text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#e0a852] transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {/* 로그아웃 */}
          <div
            onClick={handleLogoutPrompt}
            className="flex flex-row items-center justify-start w-full py-4 rounded-md cursor-pointer gap-3"
          >
            <Image src="/assets/icons/logout.svg" alt="Log Out" width={24} height={24} className="shrink-0" />
            <div className="text-[#1C2526] text-base font-['Pretendard'] font-medium">로그아웃</div>
          </div>

          {isLogoutModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[90%] max-w-[350px] flex flex-col gap-4">
                <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">로그아웃</h3>
                <p className="text-[#1C2526] text-base font-['Pretendard'] font-normal">로그아웃 하시겠습니까?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleLogoutConfirm}
                    className="bg-[#EBBA61] text-white text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#e0a852] transition-colors flex-1"
                  >
                    확인
                  </button>
                  <button
                    onClick={toggleLogoutModal}
                    className="bg-[#E0E0E0] text-[#1C2526] text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#D0D0D0] transition-colors flex-1"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-[80px] bg-transparent" />
      </div>

      <div>
        <NavigationBar />
      </div>
    </div>
  );
};

export default MyPage;