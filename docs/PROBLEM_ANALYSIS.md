# 호버/포커스 문제 상세 분석

## 발견된 문제점

### 1. CSS 특이성 문제

**원본 코드:**
```css
.sidebar-menu-item:hover:not(.active):not(:focus):not(:focus-visible) {
  background-color: var(--hover-point) !important;
  color: #000000 !important;  /* 하드코딩된 검은색 */
}
```

**새 코드:**
```css
.sidebar-menu-item:hover:not(.active):not(:focus):not(:focus-visible) {
    background-color: var(--hover-point);  /* !important 제거 */
    color: var(--text-on-hover);  /* 변수 사용, !important 제거 */
}
```

**문제:**
- `!important`를 제거했기 때문에 다른 CSS 규칙이 더 높은 특이성을 가질 수 있음
- 다크 모드 호버 색상이 `#000000`에서 `var(--text-on-hover)`로 변경됨 (값이 다를 수 있음)

### 2. 다크 모드 호버 색상 불일치

**원본 코드:**
- `.sidebar-menu-item:hover` → `color: #000000 !important;` (하드코딩)
- `.sidebar-menu-item:hover .lucide-icon` → `color: #000000 !important;` (하드코딩)
- `aside nav ul li a.sidebar-menu-item:hover` → `color: var(--text-on-hover) !important;` (변수)
- `aside nav ul li a.sidebar-menu-item:hover .lucide-icon` → `color: #000000 !important;` (하드코딩)

**새 코드:**
- `.sidebar-menu-item:hover` → `color: var(--text-on-hover);` (변수, !important 없음)
- `.sidebar-menu-item:hover .lucide-icon` → `color: var(--text-on-hover);` (변수, !important 없음)

**문제:**
- 원본에서는 `.sidebar-menu-item`에 `#000000`을 하드코딩했지만, 새 코드에서는 `var(--text-on-hover)`를 사용
- `var(--text-on-hover)`의 값이 `#000000`과 다를 수 있음

### 3. 포커스 상태 특이성 문제

**원본 코드:**
```css
.sidebar-menu-item:focus,
.sidebar-menu-item:focus-visible {
  background-color: var(--brand-pink) !important;
  color: #FFFFFF !important;
  outline: none !important;
  box-shadow: none !important;
}
```

**새 코드:**
```css
.sidebar-menu-item:focus,
.sidebar-menu-item:focus-visible {
    background-color: var(--brand-pink);  /* !important 제거 */
    color: #FFFFFF;  /* !important 제거 */
    outline: none;  /* !important 제거 */
    box-shadow: none;  /* !important 제거 */
}
```

**문제:**
- `!important`를 제거했기 때문에 다른 CSS 규칙이 포커스 스타일을 덮어쓸 수 있음

## 해결 방안

### 방안 1: 원본 코드의 정확한 값 사용 + 최소한의 !important

원본 코드의 정확한 값을 사용하되, `!important`는 최소한으로 유지:

```css
/* 다크 모드 호버 - 원본과 동일 */
.sidebar-menu-item:hover:not(.active):not(:focus):not(:focus-visible) {
    background-color: var(--hover-point) !important;
    color: #000000 !important;  /* 원본과 동일 */
}

.sidebar-menu-item:hover:not(.active):not(:focus):not(:focus-visible) .lucide-icon {
    color: #000000 !important;  /* 원본과 동일 */
}

/* 포커스 - 원본과 동일 */
.sidebar-menu-item:focus,
.sidebar-menu-item:focus-visible {
    background-color: var(--brand-pink) !important;
    color: #FFFFFF !important;
    outline: none !important;
    box-shadow: none !important;
}
```

### 방안 2: CSS 특이성 높이기 (선택자 구체화)

`!important` 없이 CSS 특이성을 높여서 해결:

```css
/* 더 구체적인 선택자 사용 */
aside nav ul li a.sidebar-menu-item:hover:not(.active):not(:focus):not(:focus-visible) {
    background-color: var(--hover-point);
    color: #000000;  /* 원본과 동일 */
}
```

하지만 이 방법은 원본 코드의 `.sidebar-menu-item` 선택자와 다름.

### 방안 3: 하이브리드 접근 (권장)

원본 코드의 정확한 값을 사용하되, `!important`는 필요한 곳에만 최소한으로 사용:

1. **호버 상태**: `!important` 유지 (다른 규칙과 충돌 방지)
2. **포커스 상태**: `!important` 유지 (접근성 중요)
3. **활성화 상태**: `!important` 유지 (최고 우선순위)

## 권장 해결책

원본 코드의 정확한 값을 사용하고, `!important`는 필요한 곳에만 최소한으로 유지하는 **하이브리드 접근법**을 권장합니다.
