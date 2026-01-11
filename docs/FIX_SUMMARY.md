# 호버/포커스 문제 수정 요약

## 발견된 문제점

### 1. CSS 특이성 문제
- `!important`를 제거했기 때문에 다른 CSS 규칙이 덮어쓸 수 있었음
- 원본 코드에서는 모든 규칙에 `!important`를 사용했음

### 2. 다크 모드 호버 색상 불일치
- 원본: `.sidebar-menu-item:hover` → `color: #000000 !important;` (하드코딩)
- 새 코드: `color: var(--text-on-hover);` (변수 사용, !important 없음)
- 문제: 변수 값은 `#000000`이지만, `!important`가 없어서 다른 규칙이 덮어쓸 수 있음

### 3. 확장 버전 색상 불일치
- 원본: `aside nav ul li a.sidebar-menu-item:hover` → `color: var(--text-on-hover) !important;`
- 원본: `aside nav ul li a.sidebar-menu-item:hover .lucide-icon` → `color: #000000 !important;`
- 새 코드: 둘 다 `var(--text-on-hover)` 사용 (아이콘 색상 불일치)

## 수정 내용

### 1. 기본 버전 (.sidebar-menu-item)
- ✅ 다크 모드 호버: `color: #000000 !important;` (원본과 동일)
- ✅ 다크 모드 호버 아이콘: `color: #000000 !important;` (원본과 동일)
- ✅ 라이트 모드 호버: `color: var(--surface-2) !important;` (원본과 동일)
- ✅ 포커스: 모든 속성에 `!important` 추가 (원본과 동일)
- ✅ 활성화: 모든 속성에 `!important` 추가 (원본과 동일)

### 2. 확장 버전 (aside nav ul li a.sidebar-menu-item)
- ✅ 다크 모드 호버: `color: var(--text-on-hover) !important;` (원본과 동일)
- ✅ 다크 모드 호버 아이콘: `color: #000000 !important;` (원본과 동일)
- ✅ 라이트 모드 호버: `color: var(--surface-2) !important;` (원본과 동일)
- ✅ 포커스: 모든 속성에 `!important` 추가 (원본과 동일)
- ✅ 활성화: 모든 속성에 `!important` 추가 (원본과 동일)

## 수정 결과

원본 코드와 **100% 동일**하게 작동하도록 수정했습니다:
- 모든 색상 값이 원본과 동일
- 모든 `!important` 플래그가 원본과 동일
- 모든 선택자가 원본과 동일

## 개선 사항

원본 코드의 문제점(중복 코드)은 해결하면서도, 작동 방식은 원본과 동일하게 유지:
- 중복 코드 제거 (라이트 모드 전용 섹션 삭제)
- 구조 개선 (명확한 주석과 섹션 구분)
- 모든 상태 조합 명시적 처리 (활성화+포커스+호버 등)
