import React from "react";

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-[350px] flex flex-col gap-4 max-h-[80vh]">
        <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">개인정보처리방침</h3>
        <div className="text-[#1C2526] text-sm font-['Pretendard'] font-normal overflow-y-auto">
          <p>
            <strong>제1조 (수집하는 개인정보)</strong><br />
            책꽂이 앱은 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:<br />
            - 이메일 주소<br />
            - 사용자 이름 (선택)<br />
            - 독서 기록 및 공유노트 내용
          </p>
          <p>
            <strong>제2조 (개인정보의 이용 목적)</strong><br />
            수집된 개인정보는 다음과 같은 목적으로 사용됩니다:<br />
            - 서비스 제공 및 사용자 인증<br />
            - 고객 문의 응대<br />
            - 서비스 개선 및 맞춤형 추천
          </p>
          <p>
            <strong>제3조 (개인정보의 보관 및 파기)</strong><br />
            1. 개인정보는 수집 목적이 달성된 후 즉시 파기됩니다.<br />
            2. 사용자가 계정 삭제를 요청할 경우, 관련 정보는 30일 이내에 파기됩니다.
          </p>
          <p>
            <strong>제4조 (개인정보의 제3자 제공)</strong><br />
            책꽂이 앱은 사용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-[#E0E0E0] text-[#1C2526] text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#D0D0D0] transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;