# Sugar Rush 910 스타일 가이드

> **⚠️ 중요: 이 문서는 프로젝트의 기본 스타일 가이드입니다. 항상 이 규칙을 따르며, 수정되지 않습니다.**

---

## 📋 기본 원칙

**핵심 규칙: 포커스 효과가 호버 효과보다 항상 우선순위를 가집니다.**

1. **호버 효과**: `:hover:not(:focus):not(:focus-visible)` 조건 필수
2. **포커스 효과**: `:focus`, `:focus-visible` 사용
3. **포커스+호버**: `:focus:hover`, `:focus-visible:hover` - 포커스 색상 유지

---

## 🎨 색상 변수 (헥사코드)

### 다크 모드 (기본)
- **브랜드 핑크**: `#FF3DAE` (`var(--brand-pink)`)
- **호버 시안**: `#17E1BC` (`var(--hover-cyan)`)
- **흰색**: `#FFFFFF`
- **검은색**: `#000000`

### 라이트 모드
- **브랜드 핑크**: `#FF3DAE` (`var(--brand-pink)`) - 동일
- **호버 보라색**: `#8A2BE2` (`var(--hover-cyan)`) - 다크 모드와 다름
- **흰색**: `#FFFFFF`
- **검은색**: `#000000`

---

## 📝 요소별 호버/포커스 규칙

### 1. 일반 링크 (`<a>`)

#### 다크 모드
- **호버** (포커스 없을 때): 텍스트 색상 → `#17E1BC`
- **포커스**: 텍스트 색상 → `#FF3DAE`
- **포커스+호버**: 텍스트 색상 → `#FF3DAE` (포커스 색상 유지)

#### 라이트 모드
- **호버** (포커스 없을 때): 텍스트 색상 → `#8A2BE2`
- **포커스**: 텍스트 색상 → `#FF3DAE`
- **포커스+호버**: 텍스트 색상 → `#FF3DAE` (포커스 색상 유지)

**CSS 규칙:**
```css
/* 다크 모드 */
a:hover:not(:focus):not(:focus-visible) {
  color: #17E1BC !important;
}
a:focus, a:focus-visible {
  color: #FF3DAE !important;
}
a:focus:hover, a:focus-visible:hover {
  color: #FF3DAE !important;
}

/* 라이트 모드 */
[data-theme="light"] a:hover:not(:focus):not(:focus-visible) {
  color: #8A2BE2 !important;
}
```

---

### 2. 일반 버튼 (배경 없는 텍스트 버튼)

#### 다크 모드
- **호버** (포커스 없을 때): 텍스트 색상 → `#17E1BC`
- **포커스**: 텍스트 색상 → `#FF3DAE`
- **포커스+호버**: 텍스트 색상 → `#FF3DAE` (포커스 색상 유지)

#### 라이트 모드
- **호버** (포커스 없을 때): 텍스트 색상 → `#8A2BE2`
- **포커스**: 텍스트 색상 → `#FF3DAE`
- **포커스+호버**: 텍스트 색상 → `#FF3DAE` (포커스 색상 유지)

**CSS 규칙:**
```css
/* 다크 모드 */
button:not([class*="bg-"]):hover:not(:focus):not(:focus-visible) {
  color: #17E1BC !important;
}
button:not([class*="bg-"]):focus,
button:not([class*="bg-"]):focus-visible {
  color: #FF3DAE !important;
}
button:not([class*="bg-"]):focus:hover,
button:not([class*="bg-"]):focus-visible:hover {
  color: #FF3DAE !important;
}

/* 라이트 모드 */
[data-theme="light"] button:not([class*="bg-"]):hover:not(:focus):not(:focus-visible) {
  color: #8A2BE2 !important;
}
```

---

### 3. 아이콘 (`.lucide-icon`)

#### 다크 모드
- **호버** (포커스 없을 때): 아이콘 색상 → `#17E1BC`
- **포커스**: 아이콘 색상 → `#FF3DAE`
- **포커스+호버**: 아이콘 색상 → `#FF3DAE` (포커스 색상 유지)

#### 라이트 모드
- **호버** (포커스 없을 때): 아이콘 색상 → `#8A2BE2`
- **포커스**: 아이콘 색상 → `#FF3DAE`
- **포커스+호버**: 아이콘 색상 → `#FF3DAE` (포커스 색상 유지)

**CSS 규칙:**
```css
/* 다크 모드 */
.lucide-icon:hover:not(:focus):not(:focus-visible) {
  color: #17E1BC !important;
}
.lucide-icon:focus, .lucide-icon:focus-visible {
  color: #FF3DAE !important;
}
.lucide-icon:focus:hover, .lucide-icon:focus-visible:hover {
  color: #FF3DAE !important;
}

/* 라이트 모드 */
[data-theme="light"] .lucide-icon:hover:not(:focus):not(:focus-visible) {
  color: #8A2BE2 !important;
}
```

---

### 4. Input 필드 (`<input>`)

#### 다크 모드
- **호버** (포커스 없을 때): 테두리 색상 → `#17E1BC`
- **포커스**: 테두리 색상 → `#FF3DAE`
- **포커스+호버**: 테두리 색상 → `#FF3DAE` (포커스 색상 유지)

#### 라이트 모드
- **호버** (포커스 없을 때): 테두리 색상 → `#8A2BE2`
- **포커스**: 테두리 색상 → `#FF3DAE`
- **포커스+호버**: 테두리 색상 → `#FF3DAE` (포커스 색상 유지)

**CSS 규칙:**
```css
/* 다크 모드 */
input:hover:not(:focus):not(:focus-visible) {
  border-color: #17E1BC !important;
}
input:focus, input:focus-visible {
  border-color: #FF3DAE !important;
}
input:focus:hover, input:focus-visible:hover {
  border-color: #FF3DAE !important;
}

/* 라이트 모드 */
[data-theme="light"] input:hover:not(:focus):not(:focus-visible) {
  border-color: #8A2BE2 !important;
}
```

---

### 5. 사이드바 메뉴 아이템 (`.sidebar-menu-item`)

#### 다크 모드
- **호버** (active/포커스 없을 때): 배경 → `#17E1BC`, 텍스트/아이콘 → `#000000`
- **포커스**: 배경 → `#FF3DAE`, 텍스트/아이콘 → `#FFFFFF`
- **포커스+호버**: 배경 → `#FF3DAE`, 텍스트/아이콘 → `#FFFFFF` (포커스 색상 유지)
- **활성화 (active)**: 배경 → `#FF3DAE`, 텍스트/아이콘 → `#FFFFFF` (호버/포커스 무시)

#### 라이트 모드
- **호버** (active/포커스 없을 때): 배경 → `#8A2BE2`, 텍스트/아이콘 → `var(--surface-2)`
- **포커스**: 배경 → `#FF3DAE`, 텍스트/아이콘 → `#FFFFFF`
- **포커스+호버**: 배경 → `#FF3DAE`, 텍스트/아이콘 → `#FFFFFF` (포커스 색상 유지)
- **활성화 (active)**: 배경 → `#FF3DAE`, 텍스트/아이콘 → `#FFFFFF` (호버/포커스 무시)

**CSS 규칙:**
```css
/* 다크 모드 */
.sidebar-menu-item:hover:not(.active):not(:focus):not(:focus-visible) {
  background-color: #17E1BC !important;
  color: #000000 !important;
}
.sidebar-menu-item:focus, .sidebar-menu-item:focus-visible {
  background-color: #FF3DAE !important;
  color: #FFFFFF !important;
}
.sidebar-menu-item:focus:hover, .sidebar-menu-item:focus-visible:hover {
  background-color: #FF3DAE !important;
  color: #FFFFFF !important;
}
.sidebar-menu-item.active {
  background-color: #FF3DAE !important;
  color: #FFFFFF !important;
}
.sidebar-menu-item.active:hover {
  background-color: #FF3DAE !important;
  color: #FFFFFF !important;
}

/* 라이트 모드 */
[data-theme="light"] .sidebar-menu-item:hover:not(.active):not(:focus):not(:focus-visible) {
  background-color: #8A2BE2 !important;
  color: var(--surface-2) !important;
}
```

---

### 6. 취소 버튼 (`.cancel-button`)

#### 다크/라이트 모드 공통
- **기본 상태**: 배경 → `var(--surface-2)`, 텍스트 → `var(--text-base)`, 테두리 → `var(--border-subtle)`
- **호버** (포커스 없을 때): 배경 → 투명, 텍스트 → `#17E1BC`, 테두리 → `#17E1BC`
- **포커스**: 배경 → 투명, 텍스트 → `#FF3DAE`, 테두리 → `#FF3DAE`
- **포커스+호버**: 배경 → 투명, 텍스트 → `#FF3DAE`, 테두리 → `#FF3DAE` (포커스 색상 유지)

**CSS 규칙:**
```css
.cancel-button {
  background-color: var(--surface-2) !important;
  color: var(--text-base) !important;
  border-color: var(--border-subtle) !important;
}
.cancel-button:hover:not(:focus):not(:focus-visible) {
  background-color: transparent !important;
  color: #17E1BC !important;
  border-color: #17E1BC !important;
}
.cancel-button:focus, .cancel-button:focus-visible {
  background-color: transparent !important;
  color: #FF3DAE !important;
  border-color: #FF3DAE !important;
}
.cancel-button:focus:hover, .cancel-button:focus-visible:hover {
  background-color: transparent !important;
  color: #FF3DAE !important;
  border-color: #FF3DAE !important;
}
```

---

### 7. 저장 버튼 (핫핑크 배경 버튼)

#### 다크/라이트 모드 공통
- **기본 상태**: 배경 → `#FF3DAE`, 텍스트 → `#FFFFFF`
- **호버** (포커스 없을 때): 배경 → `#FF3DAE` (90% 투명도), 텍스트 → `#FFFFFF`
- **포커스**: 배경 → `#FF3DAE` (90% 투명도), 텍스트 → `#FFFFFF`
- **포커스+호버**: 배경 → `#FF3DAE` (90% 투명도), 텍스트 → `#FFFFFF` (포커스 색상 유지)

**CSS 규칙:**
```css
button.bg-brand-pink {
  background-color: #FF3DAE !important;
  color: #FFFFFF !important;
}
button.bg-brand-pink:hover:not(:focus):not(:focus-visible) {
  background-color: #FF3DAE90 !important; /* 90% 투명도 */
}
button.bg-brand-pink:focus, button.bg-brand-pink:focus-visible {
  background-color: #FF3DAE90 !important;
}
button.bg-brand-pink:focus:hover, button.bg-brand-pink:focus-visible:hover {
  background-color: #FF3DAE90 !important;
}
```

---

### 8. 편집 버튼 (PageHeader)

#### 다크/라이트 모드 공통
- **기본 상태**: 배경 → 투명, 텍스트 → `#FF3DAE`, 테두리 → `#FF3DAE`
- **호버**: 배경 → `#FF3DAE` (90% 투명도), 텍스트 → `#FFFFFF`
- **포커스**: 배경 → `#FF3DAE` (90% 투명도), 텍스트 → `#FFFFFF`
- **포커스+호버**: 배경 → `#FF3DAE` (90% 투명도), 텍스트 → `#FFFFFF` (포커스 색상 유지)

**CSS 규칙:**
```css
/* 편집 버튼 - PageHeader에서 label="편집"인 버튼 */
button[편집] {
  background-color: transparent;
  border: 1px solid #FF3DAE;
  color: #FF3DAE;
}
button[편집]:hover {
  background-color: #FF3DAE90;
  color: #FFFFFF;
}
button[편집]:focus, button[편집]:focus-visible {
  background-color: #FF3DAE90;
  color: #FFFFFF;
}
button[편집]:focus:hover, button[편집]:focus-visible:hover {
  background-color: #FF3DAE90;
  color: #FFFFFF;
}
```

---

### 9. 더보기 메뉴 드롭다운 (`.more-menu-dropdown .group`)

#### 다크 모드
- **호버** (포커스 없을 때): 텍스트/아이콘 색상 → `#17E1BC`
- **포커스**: 텍스트/아이콘 색상 → `#FF3DAE`
- **포커스+호버**: 텍스트/아이콘 색상 → `#FF3DAE` (포커스 색상 유지)

#### 라이트 모드
- **호버** (포커스 없을 때): 텍스트/아이콘 색상 → `#8A2BE2`
- **포커스**: 텍스트/아이콘 색상 → `#FF3DAE`
- **포커스+호버**: 텍스트/아이콘 색상 → `#FF3DAE` (포커스 색상 유지)

**CSS 규칙:**
```css
/* 다크 모드 */
.more-menu-dropdown .group:hover:not(:focus):not(:focus-visible) {
  color: #17E1BC !important;
}
.more-menu-dropdown .group:focus, .more-menu-dropdown .group:focus-visible {
  color: #FF3DAE !important;
}
.more-menu-dropdown .group:focus:hover, .more-menu-dropdown .group:focus-visible:hover {
  color: #FF3DAE !important;
}

/* 라이트 모드 */
[data-theme="light"] .more-menu-dropdown .group:hover:not(:focus):not(:focus-visible) {
  color: #8A2BE2 !important;
}
```

---

### 10. 검색창 (`.search-container`)

#### 다크 모드
- **호버** (포커스 없을 때): 테두리 → `#17E1BC`, 아이콘 → `#17E1BC`
- **포커스**: 테두리 → `#FF3DAE`, 아이콘 → `#FF3DAE`
- **포커스+호버**: 테두리 → `#FF3DAE`, 아이콘 → `#FF3DAE` (포커스 색상 유지)

#### 라이트 모드
- **호버** (포커스 없을 때): 테두리 → `#8A2BE2`, 아이콘 → `#8A2BE2`
- **포커스**: 테두리 → `#FF3DAE`, 아이콘 → `#FF3DAE`
- **포커스+호버**: 테두리 → `#FF3DAE`, 아이콘 → `#FF3DAE` (포커스 색상 유지)

**CSS 규칙:**
```css
/* 다크 모드 */
.search-container:hover:not(:focus-within) .lucide-icon {
  color: #17E1BC !important;
}
.search-container:hover:not(:focus-within) input {
  border-color: #17E1BC !important;
}
.search-container input:focus, .search-container:focus-within input {
  border-color: #FF3DAE !important;
}
.search-container:focus-within:hover input {
  border-color: #FF3DAE !important;
}

/* 라이트 모드 */
[data-theme="light"] .search-container:hover:not(:focus-within) .lucide-icon {
  color: #8A2BE2 !important;
}
[data-theme="light"] .search-container input:focus {
  border-color: #FF3DAE !important;
}
```

---

### 11. 필터 드롭다운 (`.filter-dropdown`)

#### 다크 모드
- **호버** (포커스 없을 때): 테두리 → `#17E1BC`, 아이콘 → `#17E1BC`
- **포커스**: 테두리 → `#FF3DAE`, 아이콘 → `#FF3DAE`
- **포커스+호버**: 테두리 → `#FF3DAE`, 아이콘 → `#FF3DAE` (포커스 색상 유지)

#### 라이트 모드
- **호버** (포커스 없을 때): 테두리 → `#8A2BE2`, 아이콘 → `#8A2BE2`
- **포커스**: 테두리 → `#FF3DAE`, 아이콘 → `#FF3DAE`
- **포커스+호버**: 테두리 → `#FF3DAE`, 아이콘 → `#FF3DAE` (포커스 색상 유지)

**CSS 규칙:**
```css
/* 다크 모드 */
.filter-dropdown:hover:not(:focus-within) button {
  border-color: #17E1BC !important;
}
.filter-dropdown:hover:not(:focus-within) .lucide-filter {
  color: #17E1BC !important;
}
.filter-dropdown:focus-within button {
  border-color: #FF3DAE !important;
}
.filter-dropdown:focus-within .lucide-filter {
  color: #FF3DAE !important;
}
.filter-dropdown:focus-within:hover button {
  border-color: #FF3DAE !important;
}

/* 라이트 모드 */
[data-theme="light"] .filter-dropdown:hover:not(:focus-within) .lucide-filter {
  color: #8A2BE2 !important;
}
[data-theme="light"] .filter-dropdown:focus-within .lucide-filter {
  color: #FF3DAE !important;
}
```

---

### 12. 상태 드롭다운 옵션 (`.status-dropdown [role="option"]`)

#### 다크 모드
- **선택됨 (aria-selected="true")**: 배경 → `#FF3DAE`, 텍스트 → `#FFFFFF` (호버/포커스 무시)
- **호버** (선택/포커스 없을 때): 배경 → `#17E1BC`, 텍스트 → `#000000`
- **포커스**: 배경 → `#FF3DAE`, 텍스트 → `#FFFFFF`
- **포커스+호버**: 배경 → `#FF3DAE`, 텍스트 → `#FFFFFF` (포커스 색상 유지)

#### 라이트 모드
- **선택됨 (aria-selected="true")**: 배경 → `#FF3DAE`, 텍스트 → `#FFFFFF` (호버/포커스 무시)
- **호버** (선택/포커스 없을 때): 배경 → `#8A2BE2`, 텍스트 → `var(--surface-2)`
- **포커스**: 배경 → `#FF3DAE`, 텍스트 → `#FFFFFF`
- **포커스+호버**: 배경 → `#FF3DAE`, 텍스트 → `#FFFFFF` (포커스 색상 유지)

**CSS 규칙:**
```css
/* 다크 모드 */
.status-dropdown [role="option"][aria-selected="true"] {
  background-color: #FF3DAE !important;
  color: #FFFFFF !important;
}
.status-dropdown [role="option"]:hover:not([aria-selected="true"]):not(:focus-visible) {
  background-color: #17E1BC !important;
  color: #000000 !important;
}
.status-dropdown [role="option"]:focus-visible:not([aria-selected="true"]) {
  background-color: #FF3DAE !important;
  color: #FFFFFF !important;
}
.status-dropdown [role="option"]:focus-visible:not([aria-selected="true"]):hover {
  background-color: #FF3DAE !important;
  color: #FFFFFF !important;
}

/* 라이트 모드 */
[data-theme="light"] .status-dropdown [role="option"]:hover:not([aria-selected="true"]) {
  background-color: #8A2BE2 !important;
  color: var(--surface-2) !important;
}
[data-theme="light"] .status-dropdown [role="option"]:focus-visible:not([aria-selected="true"]) {
  background-color: #FF3DAE !important;
  color: #FFFFFF !important;
}
```

---

### 13. 액션 버튼 (`.action-button`)

#### 다크 모드
- **호버** (포커스 없을 때): 테두리 → `#17E1BC`, 배경 → `var(--surface-3)`, 텍스트/아이콘 → `#17E1BC`
- **포커스**: 테두리 → `#FF3DAE`, 배경 → `var(--surface-2)`, 텍스트/아이콘 → `#FF3DAE`
- **포커스+호버**: 테두리 → `#FF3DAE`, 배경 → `var(--surface-2)`, 텍스트/아이콘 → `#FF3DAE` (포커스 색상 유지)

#### 라이트 모드
- **호버** (포커스 없을 때): 테두리 → `#8A2BE2`, 배경 → `var(--surface-3)`, 텍스트/아이콘 → `#8A2BE2`
- **포커스**: 테두리 → `#FF3DAE`, 배경 → `var(--surface-2)`, 텍스트/아이콘 → `#FF3DAE`
- **포커스+호버**: 테두리 → `#FF3DAE`, 배경 → `var(--surface-2)`, 텍스트/아이콘 → `#FF3DAE` (포커스 색상 유지)

**CSS 규칙:**
```css
/* 다크 모드 */
.action-button:hover:not(:focus):not(:focus-visible) {
  border-color: #17E1BC !important;
  background-color: var(--surface-3) !important;
}
.action-button:hover:not(:focus):not(:focus-visible) .action-button-text,
.action-button:hover:not(:focus):not(:focus-visible) .action-button-icon {
  color: #17E1BC !important;
}
.action-button:focus, .action-button:focus-visible {
  border-color: #FF3DAE !important;
  background-color: var(--surface-2) !important;
}
.action-button:focus .action-button-text,
.action-button:focus .action-button-icon {
  color: #FF3DAE !important;
}
.action-button:focus:hover .action-button-text,
.action-button:focus:hover .action-button-icon {
  color: #FF3DAE !important;
}

/* 라이트 모드 */
[data-theme="light"] .action-button:hover:not(:focus):not(:focus-visible) .action-button-text,
[data-theme="light"] .action-button:hover:not(:focus):not(:focus-visible) .action-button-icon {
  color: #8A2BE2 !important;
}
```

---

### 14. 리스트 항목 (할일 카드 등)

#### 다크 모드
- **호버** (포커스 없을 때): 배경 → `var(--surface-2)`, 테두리 → `#17E1BC`, 텍스트 → `#17E1BC`, 체크박스 테두리 → `#17E1BC`
- **포커스**: 배경 → `var(--surface-2)`, 테두리 → `#FF3DAE`, 텍스트 → `#FF3DAE`, 체크박스 테두리 → `#FF3DAE`
- **포커스+호버**: 배경 → `var(--surface-2)`, 테두리 → `#FF3DAE`, 텍스트 → `#FF3DAE`, 체크박스 테두리 → `#FF3DAE` (포커스 색상 유지)

#### 라이트 모드
- **호버** (포커스 없을 때): 배경 → `var(--surface-2)`, 테두리 → `#8A2BE2`, 텍스트 → `#8A2BE2`, 체크박스 테두리 → `#8A2BE2`
- **포커스**: 배경 → `var(--surface-2)`, 테두리 → `#FF3DAE`, 텍스트 → `#FF3DAE`, 체크박스 테두리 → `#FF3DAE`
- **포커스+호버**: 배경 → `var(--surface-2)`, 테두리 → `#FF3DAE`, 텍스트 → `#FF3DAE`, 체크박스 테두리 → `#FF3DAE` (포커스 색상 유지)

**CSS 규칙:**
```css
/* 다크 모드 */
a[href*="/tasks/"]:hover:not(:focus):not(:focus-visible) {
  background-color: var(--surface-2) !important;
  border-color: #17E1BC !important;
}
a[href*="/tasks/"]:focus, a[href*="/tasks/"]:focus-visible {
  border-color: #FF3DAE !important;
  color: #FF3DAE !important;
}
a[href*="/tasks/"]:focus:hover {
  border-color: #FF3DAE !important;
  color: #FF3DAE !important;
}

/* 라이트 모드 */
[data-theme="light"] a[href*="/tasks/"]:hover:not(:focus):not(:focus-visible) {
  border-color: #8A2BE2 !important;
}
[data-theme="light"] a[href*="/tasks/"]:focus {
  border-color: #FF3DAE !important;
  color: #FF3DAE !important;
}
```

---

### 15. 앨범 카드 재생 버튼 (`.play-button`)

#### 다크/라이트 모드 공통
- **호버** (포커스 없을 때): 배경 → `#FF3DAE`, 아이콘 → `#FFFFFF`
- **포커스**: 배경 → `#FF3DAE`, 아이콘 → `#FFFFFF`
- **포커스+호버**: 배경 → `#FF3DAE`, 아이콘 → `#FFFFFF` (포커스 색상 유지)

**CSS 규칙:**
```css
.album-card:hover .play-button:not(:focus):not(:focus-visible) {
  background-color: #FF3DAE !important;
  color: #FFFFFF !important;
}
.play-button:focus, .play-button:focus-visible {
  background-color: #FF3DAE !important;
  color: #FFFFFF !important;
}
.play-button:focus:hover, .play-button:focus-visible:hover {
  background-color: #FF3DAE !important;
  color: #FFFFFF !important;
}
```

---

## 🔑 핵심 규칙 요약

### 1. 호버 효과 조건
모든 호버 효과는 반드시 `:not(:focus):not(:focus-visible)` 조건을 포함해야 합니다.

```css
/* ✅ 올바른 예 */
.element:hover:not(:focus):not(:focus-visible) {
  color: #17E1BC;
}

/* ❌ 잘못된 예 */
.element:hover {
  color: #17E1BC; /* 포커스 상태에서도 호버 효과가 적용됨 */
}
```

### 2. 포커스 효과 우선순위
포커스 효과는 호버 효과보다 항상 우선순위를 가집니다.

```css
/* 포커스 효과 */
.element:focus, .element:focus-visible {
  color: #FF3DAE;
}

/* 포커스+호버 시에도 포커스 색상 유지 */
.element:focus:hover, .element:focus-visible:hover {
  color: #FF3DAE; /* 호버 색상이 아닌 포커스 색상 유지 */
}
```

### 3. 색상 체계
- **호버 색상 (다크 모드)**: `#17E1BC` (시안)
- **호버 색상 (라이트 모드)**: `#8A2BE2` (보라색)
- **포커스 색상 (공통)**: `#FF3DAE` (핫핑크)
- **활성화 색상 (공통)**: `#FF3DAE` (핫핑크) + `#FFFFFF` (흰색 텍스트)

---

## 📌 특수 케이스

### 활성화 상태 (`.active`)
활성화된 요소는 호버/포커스 효과를 무시하고 항상 활성화 색상을 유지합니다.

```css
.element.active {
  background-color: #FF3DAE;
  color: #FFFFFF;
}
.element.active:hover,
.element.active:focus,
.element.active:focus-visible {
  background-color: #FF3DAE; /* 호버/포커스해도 활성화 색상 유지 */
  color: #FFFFFF;
}
```

### 선택된 상태 (`[aria-selected="true"]`)
선택된 드롭다운 옵션은 호버/포커스 효과를 무시하고 항상 선택 색상을 유지합니다.

```css
[role="option"][aria-selected="true"] {
  background-color: #FF3DAE;
  color: #FFFFFF;
}
[role="option"][aria-selected="true"]:hover {
  background-color: #FF3DAE; /* 호버해도 선택 색상 유지 */
  color: #FFFFFF;
}
```

---

## ✅ 검증 체크리스트

모든 호버/포커스 효과가 올바르게 적용되었는지 확인:

- [ ] 모든 호버 효과에 `:not(:focus):not(:focus-visible)` 조건이 있는가?
- [ ] 포커스 효과가 호버 효과보다 우선순위를 가지는가?
- [ ] 포커스 상태에서 호버해도 포커스 색상이 유지되는가?
- [ ] 활성화/선택된 상태에서 호버/포커스 효과가 무시되는가?
- [ ] 다크 모드와 라이트 모드 모두 올바른 색상이 적용되는가?

---

**이 문서는 프로젝트의 기본 스타일 가이드입니다. 모든 개발 작업 시 이 규칙을 준수해야 합니다.**

**마지막 업데이트**: 2025-12-07
