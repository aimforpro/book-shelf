// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,vue,svelte,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"], // Pretendard를 기본 폰트로 정의
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        "22px": "22px",
      },
      fontWeight: {
        normal: 400,
        medium: 500,
      },
      lineHeight: {
        18: "18px",
        21: "21px",
        6: "24px",
        7: "28px",
        23: "23px",
      },
      borderRadius: {
        "20px": "20px",
        "27px": "27px",
      },
      colors: {
        "primary-bg": "#fafaf7",
        "white-bg": "#ffffff",
        "text-primary": "#1c140d",
        "text-secondary": "#96704f",
        "border-color": "#f2ede8",
        "progress-bg": "#e5dbd1",
        "progress-fill": "#eba161",
        "button-bg": "#ebba61",
      },
      spacing: {
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
      },
      width: {
        5: "20px",
        6: "24px",
        12: "48px",
        54: "54px",
        215: "215px",
      },
      minWidth: {
        160: "160px",
        240: "240px",
      },
      maxWidth: {
        480: "480px",
      },
      height: {
        2: "8px",
        5: "20px",
        6: "24px",
        8: "32px",
        12: "48px",
        52: "52px",
        60: "60px",
        135: "135px",
        213: "213px",
      },
      minHeight: {
        844: "844px",
      },
    },
  },
};

