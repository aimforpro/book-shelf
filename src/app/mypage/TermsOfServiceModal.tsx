import React from "react";

interface TermsOfServiceModalProps {
  onClose: () => void;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-[350px] flex flex-col gap-4 max-h-[80vh]">
        <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">이용약관</h3>
        <div className="text-[#1C2526] text-sm font-['Pretendard'] font-normal overflow-y-auto">
          <p>
            <strong>제1조 (목적)</strong><br />
            본 약관은 책꽂이 앱(이하 "앱")이 제공하는 서비스의 이용 조건 및 절차, 이용자와 앱의 권리, 의무, 책임 사항을 규정함을 목적으로 합니다.
          </p>
          <p>
            <strong>제2조 (서비스 제공)</strong><br />
            1. 책꽂이 앱은 사용자가 책을 검색하고, 독서 기록을 관리하며, 공유노트를 작성할 수 있는 서비스를 제공합니다.<br />
            2. 서비스는 무료로 제공되며, 일부 기능은 유료로 전환될 수 있습니다.
          </p>
          <p>
            <strong>제3조 (이용자의 의무)</strong><br />
            1. 이용자는 앱을 이용함에 있어 타인의 권리를 침해하거나 불법적인 행위를 해서는 안 됩니다.<br />
            2. 이용자는 본인의 계정 정보를 안전하게 관리할 책임이 있습니다.
          </p>
          <p>
            <strong>제4조 (책임의 제한)</strong><br />
            앱은 서비스 제공과 관련하여 발생한 손해에 대해 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.
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

export default TermsOfServiceModal;