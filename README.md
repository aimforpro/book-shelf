# Book-Shelf

북셀프(Book-Shelf) 프로젝트는 Next.js와 TypeScript를 기반으로 한 웹 애플리케이션입니다.

## 기술 스택

- Frontend: React, Next.js, TypeScript
- Styling: Tailwind CSS, Shadcn/UI
- Backend: Supabase
- Deployment: Vercel
- Monitoring: Sentry
- Version Control: Git

## 프로젝트 구조

```
src/
├── api/          # API 관련 코드
├── components/   # React 컴포넌트
│   ├── ui/      # 공통 UI 컴포넌트
│   ├── layout/  # 레이아웃 컴포넌트
│   └── features/# 기능별 컴포넌트
├── hooks/       # Custom React Hooks
├── pages/       # Next.js 페이지
├── styles/      # 스타일 관련 파일
├── types/       # TypeScript 타입 정의
└── utils/       # 유틸리티 함수
```

## 시작하기

1. 환경 설정:
   ```bash
   cp .env.local.example .env.local
   # .env.local 파일에 필요한 환경 변수를 설정하세요
   ```

2. 의존성 설치:
   ```bash
   npm install
   ```

3. 개발 서버 실행:
   ```bash
   npm run dev
   ```

4. 빌드:
   ```bash
   npm run build
   ```

## 환경 변수

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anonymous Key
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN 