# 좌측 사이드바 완벽판 - 구현 상세 가이드

**작성일**: 2026-01-12  
**버전**: v3 최종

---

## 🎯 포커스 위 호버 겹침 방지 - 완전 가이드

### 문제 정의

**발생 가능한 상황**:
1. 포커스 상태에서 마우스 호버 시 → 호버 색상이 포커스 색상을 덮어씀
2. 활성화 상태에서 마우스 호버 시 → 호버 색상이 활성화 색상을 덮어씀
3. 포커스 + 활성화 상태에서 마우스 호버 시 → 호버 색상이 덮어씀

### 해결 원리

#### 1. CSS 우선순위 (Cascade Order)

**규칙**: 나중에 정의된 규칙이 우선 (같은 특이성일 때)

```css
/* 1단계: 호버 규칙 (활성화/포커스 제외) */
.sidebar-menu-item:hover:not(.active):not(:focus) {
  /* 호버 효과 */
}

/* 2단계: 포커스 규칙 (호버보다 나중) */
.sidebar-menu-item:focus {
  /* 포커스 효과 */
}

/* 3단계: 포커스 + 호버 (명시적 조합) */
.sidebar-menu-item:focus:hover {
  /* 포커스 색상 유지 */
}

/* 4단계: 활성화 규칙 (가장 나중) */
.sidebar-menu-item.active {
  /* 활성화 효과 */
}

/* 5단계: 활성화 + 호버 (명시적 조합) */
.sidebar-menu-item.active:hover {
  /* 활성화 색상 유지 */
}

/* 6단계: 핵폭탄 CSS (파일 맨 아래) */
.sidebar-menu-item[aria-current="page"]:hover {
  /* 최종 보장 */
}
```

#### 2. 선택자 특이성 (Specificity)

**계산 방식**:
- ID: 100점
- 클래스/속성/가상클래스: 10점
- 요소: 1점

**예시**:
```css
.sidebar-menu-item                    /* 0,1,0 = 10점 */
.sidebar-menu-item:hover              /* 0,2,0 = 20점 */
.sidebar-menu-item.active             /* 0,2,0 = 20점 */
.sidebar-menu-item.active:hover       /* 0,3,0 = 30점 */
aside nav ul li a.sidebar-menu-item   /* 0,4,0 = 40점 */
```

**해결책**: 확장 선택자 사용으로 특이성 증가

#### 3. `!important` 사용

**사용 이유**:
- Tailwind CSS 클래스와의 충돌 방지
- 브라우저 기본 스타일 오버라이드
- 인라인 스타일과의 충돌 방지

**사용 위치**:
- 모든 상태 규칙에 `!important` 사용
- 특히 활성화/포커스 규칙에 필수

---

## 📐 상태 조합 완전 매트릭스

### 기본 상태 (4가지)

| 상태 | 클래스/속성 | 배경색 | 텍스트 | 아이콘 |
|------|------------|--------|--------|--------|
| 기본 | 없음 | `--surface-2` | `--text-base` | `--text-base` |
| 호버 | `:hover` | `--hover-point` | 다크: `#000000`<br>라이트: `--text-on-hover` | 동일 |
| 포커스 | `:focus` | `--brand-pink` | `#ffffff` | `#ffffff` |
| 활성화 | `.active`<br>`[aria-current="page"]` | `--brand-pink` | `#ffffff` | `#ffffff` |

### 조합 상태 (8가지)

| 조합 | 선택자 | 배경색 | 텍스트/아이콘 | 우선순위 |
|------|--------|--------|--------------|---------|
| 포커스 + 호버 | `:focus:hover` | `--brand-pink` | `#ffffff` | 포커스 유지 |
| 활성화 + 호버 | `.active:hover`<br>`[aria-current="page"]:hover` | `--brand-pink` | `#ffffff` | 활성화 유지 |
| 활성화 + 포커스 | `.active:focus`<br>`[aria-current="page"]:focus` | `--brand-pink` | `#ffffff` | 활성화 유지 |
| 활성화 + 포커스 + 호버 | `.active:focus:hover`<br>`[aria-current="page"]:focus:hover` | `--brand-pink` | `#ffffff` | 활성화 유지 |
| 포커스 + active | `:focus:active` | `--brand-pink` | `#ffffff` | 포커스 유지 |
| 활성화 + active | `.active:active` | `--brand-pink` | `#ffffff` | 활성화 유지 |
| 활성화 + 포커스 + active | `.active:focus:active` | `--brand-pink` | `#ffffff` | 활성화 유지 |
| 활성화 + 포커스 + 호버 + active | `.active:focus:hover:active` | `--brand-pink` | `#ffffff` | 활성화 유지 |

---

## 🔍 CSS 규칙 상세 분석

### 1. 호버 규칙 (우선순위 낮음)

**위치**: `sidebar.css` 2번 섹션

**특징**:
- `:not()` 선택자로 활성화/포커스 제외
- 다크/라이트 모드 분리
- 확장 선택자 버전도 별도 정의

**코드**:
```css
/* 기본 선택자 */
.sidebar-menu-item:hover:not(.active):not(:focus):not(:focus-visible):not([aria-current="page"]) {
  background-color: var(--hover-point) !important;
  color: #000000 !important;
}

/* 확장 선택자 (더 높은 특이성) */
aside nav ul li a.sidebar-menu-item:hover:not(.active):not(:focus):not(:focus-visible):not([aria-current="page"]) {
  background-color: var(--hover-point) !important;
  color: var(--text-on-hover) !important;
}
```

### 2. 포커스 규칙 (우선순위 중간)

**위치**: `sidebar.css` 3번 섹션

**특징**:
- 포커스 기본
- 포커스 + 호버 (명시적)
- 포커스 + active (명시적)

**코드**:
```css
/* 포커스 기본 */
.sidebar-menu-item:focus,
.sidebar-menu-item:focus-visible {
  background-color: var(--brand-pink) !important;
  color: #ffffff !important;
}

/* 포커스 + 호버 (호버 겹침 방지) */
.sidebar-menu-item:focus:hover,
.sidebar-menu-item:focus-visible:hover {
  background-color: var(--brand-pink) !important; /* 포커스 색상 유지 */
  color: #ffffff !important;
}
```

### 3. 활성화 규칙 (우선순위 최고)

**위치**: `sidebar.css` 4번 섹션 + 핵폭탄 CSS

**특징**:
- `.active` 클래스와 `[aria-current="page"]` 속성 모두 처리
- 모든 조합 상태 명시
- 파일 맨 아래 핵폭탄 CSS로 최종 보장

**코드**:
```css
/* 활성화 기본 */
.sidebar-menu-item.active,
.sidebar-menu-item[aria-current="page"] {
  background-color: var(--brand-pink) !important;
  color: #ffffff !important;
}

/* 활성화 + 호버 (호버 겹침 방지) */
.sidebar-menu-item.active:hover,
.sidebar-menu-item[aria-current="page"]:hover {
  background-color: var(--brand-pink) !important; /* 활성화 색상 유지 */
  color: #ffffff !important;
}

/* 활성화 + 포커스 + 호버 (3중 조합) */
.sidebar-menu-item.active:focus:hover,
.sidebar-menu-item[aria-current="page"]:focus:hover {
  background-color: var(--brand-pink) !important; /* 활성화 색상 유지 */
  color: #ffffff !important;
}
```

### 4. 핵폭탄 CSS (최종 보장)

**위치**: `sidebar.css` 파일 맨 아래

**특징**:
- 파일 맨 아래 위치 (CSS 캐스케이드 최우선)
- `*` 선택자로 모든 자식 요소 강제
- 모든 상태 조합 명시
- `transition: none`으로 전환 효과 제거

**코드**:
```css
/* 🔥 활성화 호버 완전 차단 - 핵폭탄 우선순위 (최종 보장) */
.sidebar-menu-item[aria-current="page"] {
  background-color: var(--brand-pink) !important;
  color: #ffffff !important;
}

.sidebar-menu-item[aria-current="page"] * {
  background-color: transparent !important;
  color: #ffffff !important;
}

/* 호버 시에도 활성화 상태 무시 */
.sidebar-menu-item[aria-current="page"]:hover,
.sidebar-menu-item[aria-current="page"]:hover *,
.sidebar-menu-item[aria-current="page"]:focus,
.sidebar-menu-item[aria-current="page"]:focus *,
.sidebar-menu-item[aria-current="page"]:focus:hover,
.sidebar-menu-item[aria-current="page"]:focus:hover * {
  background-color: var(--brand-pink) !important;
  color: #ffffff !important;
}
```

---

## 🎨 아이콘 색상 관리

### 전역 호버 규칙

```css
/* 전역 아이콘 호버 효과 */
.lucide-icon:hover:not(:focus):not(:focus-visible):not(:focus-within):not(.combinator-header-icon) {
  color: var(--hover-point) !important;
  transition: color 200ms ease-in-out;
}
```

### 활성화 상태 아이콘 차단

```css
/* 활성화 상태 아이콘은 전역 호버 규칙 무시 */
.sidebar-menu-item.active .lucide-icon:hover,
.sidebar-menu-item[aria-current="page"] .lucide-icon:hover {
  color: #FFFFFF !important;
}
```

### 핵폭탄 아이콘 규칙

```css
/* lucide 아이콘 강제 - 모든 상태에서 흰색 */
.sidebar-menu-item[aria-current="page"] .lucide-icon,
.sidebar-menu-item[aria-current="page"]:hover .lucide-icon,
.sidebar-menu-item[aria-current="page"]:focus .lucide-icon,
.sidebar-menu-item[aria-current="page"]:focus:hover .lucide-icon {
  color: #ffffff !important;
  transition: none !important; /* 전환 효과 제거 */
}
```

---

## 🔄 Body 클래스 동기화 시스템

### 동작 원리

1. **Sidebar.svelte**: `updateBodyClass()` 함수로 body 클래스 업데이트
2. **+layout.svelte**: 이벤트 리스너로 body 클래스 동기화
3. **ui.js**: localStorage 복원 시 body 클래스 동기화
4. **CSS**: body 클래스에 반응하여 스타일 적용

### 동기화 지점

```typescript
// 1. 사이드바 토글 시
function handleSidebarToggle() {
  sidebarCollapsed = !sidebarCollapsed;
  document.body.classList.toggle('sidebar-expanded', !sidebarCollapsed);
  document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);
}

// 2. 이벤트 수신 시
const handleSidebarCollapseChange = (event: CustomEvent) => {
  sidebarCollapsed = event.detail.collapsed;
  updateBodyClass();
};

// 3. ui.js 이벤트 시
const handleUISidebarToggle = (event: CustomEvent) => {
  sidebarCollapsed = newState === 'collapsed';
  updateBodyClass();
};

// 4. 리사이즈 시
function handleResize() {
  checkScreenSize();
  updateBodyClass();
}
```

### CSS 반응

```css
/* Body 클래스에 반응 */
body.sidebar-collapsed aside {
  width: var(--sidebar-width-collapsed) !important;
}
body.sidebar-expanded aside {
  width: var(--sidebar-width-expanded) !important;
}

body.sidebar-collapsed header,
body.sidebar-collapsed .main-content-area {
  margin-left: var(--sidebar-width-collapsed) !important;
}
body.sidebar-expanded header, 
body.sidebar-expanded .main-content-area {
  margin-left: var(--sidebar-width-expanded) !important;
}
```

---

## ✅ 검증 시나리오

### 시나리오 1: 기본 호버
1. 활성화/포커스 없는 메뉴에 마우스 호버
2. **예상**: 호버 색상 (시안/보라) 적용
3. **확인**: 배경색과 아이콘 색상 변경

### 시나리오 2: 포커스 상태 호버
1. Tab 키로 메뉴 포커스
2. 포커스된 메뉴에 마우스 호버
3. **예상**: 포커스 색상 (핫핑크) 유지
4. **확인**: 호버 색상이 포커스 색상을 덮어쓰지 않음

### 시나리오 3: 활성화 상태 호버
1. 현재 페이지 메뉴 (활성화 상태)에 마우스 호버
2. **예상**: 활성화 색상 (핫핑크) 유지
3. **확인**: 호버 색상이 활성화 색상을 덮어쓰지 않음
4. **확인**: 아이콘 색상이 흰색으로 유지

### 시나리오 4: 활성화 + 포커스 상태 호버
1. 현재 페이지 메뉴에 Tab 키로 포커스
2. 포커스된 활성화 메뉴에 마우스 호버
3. **예상**: 활성화 색상 (핫핑크) 유지
4. **확인**: 호버 색상이 활성화 색상을 덮어쓰지 않음
5. **확인**: 아이콘 색상이 흰색으로 유지

---

## 🔧 문제 해결

### 문제: 활성화 메뉴 호버 시 색상 변경

**원인**: 호버 규칙이 활성화 규칙보다 우선

**해결**:
1. 호버 규칙에 `:not([aria-current="page"])` 추가
2. 활성화 + 호버 규칙 명시적 추가
3. 핵폭탄 CSS 파일 맨 아래 배치

### 문제: 포커스 상태 호버 시 색상 변경

**원인**: 포커스 + 호버 조합 규칙 누락

**해결**:
```css
/* 포커스 + 호버 명시적 추가 */
.sidebar-menu-item:focus:hover {
  background-color: var(--brand-pink) !important; /* 포커스 색상 유지 */
}
```

### 문제: 아이콘 색상이 변함

**원인**: 전역 호버 규칙이 활성화 아이콘에도 적용

**해결**:
```css
/* 활성화 상태 아이콘은 전역 호버 규칙 무시 */
.sidebar-menu-item.active .lucide-icon:hover,
.sidebar-menu-item[aria-current="page"] .lucide-icon:hover {
  color: #FFFFFF !important;
}
```

---

## 📚 참고 자료

### CSS 우선순위 계산기
- https://specificity.keegan.st/

### CSS 선택자 특이성
- https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity

### Svelte 5 Runes
- https://svelte.dev/docs/svelte/runes

---

**이 문서는 사이드바의 모든 상태 조합과 우선순위를 완벽하게 정의합니다.**
