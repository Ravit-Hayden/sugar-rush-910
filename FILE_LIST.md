# 파일 목록 및 설명

## 📁 파일 구조

```
left sidebar/
├── Sidebar.svelte              # 사이드바 컴포넌트 (메인)
├── +layout.svelte              # 레이아웃 (body 클래스 동기화)
├── Header.svelte               # 헤더 (사이드바 너비 연동)
├── sidebar.css                 # 사이드바 관련 모든 CSS
├── ui.js                       # 사이드바 토글 스크립트
├── README.md                   # 메인 문서
├── IMPLEMENTATION_DETAILS.md   # 구현 상세 가이드
├── RESTORE_GUIDE.md            # 빠른 복구 가이드
├── GIT_SETUP.md                # Git 설정 가이드
├── FILE_LIST.md                # 이 파일
└── .gitignore                  # Git 무시 파일
```

## 📄 파일 설명

### Sidebar.svelte
- **위치**: `src/lib/components/Sidebar.svelte`
- **역할**: 사이드바 메인 컴포넌트
- **핵심 기능**:
  - Body 클래스 동기화 (`updateBodyClass()`)
  - 사이드바 토글 핸들러
  - 반응형 처리 (768px 기준)
  - 이벤트 시스템 통합

### +layout.svelte
- **위치**: `src/routes/+layout.svelte`
- **역할**: 레이아웃 래퍼
- **핵심 기능**:
  - Body 클래스 동기화
  - 사이드바 이벤트 리스너
  - 검색 상태 관리

### Header.svelte
- **위치**: `src/lib/components/Header.svelte`
- **역할**: 상단 헤더
- **핵심 기능**:
  - 사이드바 너비 연동 (이벤트 기반)
  - 인라인 스타일 제거 (body 클래스 기반)

### sidebar.css
- **위치**: `src/app.css` (맨 아래 추가)
- **역할**: 사이드바 관련 모든 CSS
- **핵심 내용**:
  - CSS 변수 정의
  - Body 클래스 기반 동기화
  - 호버/포커스/활성화 규칙
  - 핵폭탄 CSS (최종 보장)

### ui.js
- **위치**: `src/scripts/ui.js`
- **역할**: 사이드바 토글 스크립트
- **핵심 기능**:
  - Body 클래스 동기화
  - localStorage 관리
  - 이벤트 발생

### README.md
- **역할**: 메인 문서
- **내용**:
  - 파일 구조
  - 핵심 원리
  - CSS 우선순위 체계
  - 복구 방법

### IMPLEMENTATION_DETAILS.md
- **역할**: 구현 상세 가이드
- **내용**:
  - 포커스 위 호버 겹침 방지 상세
  - 상태 조합 매트릭스
  - CSS 규칙 상세 분석
  - 문제 해결

### RESTORE_GUIDE.md
- **역할**: 빠른 복구 가이드
- **내용**:
  - 5분 복구 가이드
  - 파일 매핑
  - 문제 해결

### GIT_SETUP.md
- **역할**: Git 설정 가이드
- **내용**:
  - Git 초기화 방법
  - 원격 저장소 푸시
  - 커밋 메시지 예시

---

## 🔄 복구 순서

1. **파일 복사**: `Sidebar.svelte`, `+layout.svelte`, `Header.svelte`, `ui.js`
2. **CSS 추가**: `sidebar.css` 내용을 `app.css` 맨 아래에 추가
3. **검증**: 브라우저에서 테스트
4. **문제 해결**: `RESTORE_GUIDE.md` 참고

---

**모든 파일이 준비되었습니다. 언제든지 완벽하게 복구할 수 있습니다.**
