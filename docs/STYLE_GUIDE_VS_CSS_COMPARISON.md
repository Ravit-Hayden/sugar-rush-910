# 스타일 가이드 vs CSS 구현 비교 분석

> **생성일**: 2025-12-29
> 
> `docs/COMPLETE_STYLE_GUIDE.md`의 모든 항목별 호버/포커스 규칙이 `src/app.css`에 정확히 구현되어 있는지 상세 비교 분석

---

## ✅ 완벽히 일치하는 항목

### 1️⃣ 버튼 (Button)

#### 1-1. `bg-brand-pink` 버튼
- ✅ **다크 모드 호버**: `color: #000000` - 일치
- ✅ **라이트 모드 호버**: `color: var(--surface-2)` - 일치
- ✅ **포커스**: `background-color: var(--brand-pink)`, `color: #FFFFFF` - 일치
- ✅ **포커스+호버**: 포커스 색상 유지 - 일치

#### 1-2. `bg-hover-cyan` / `bg-hover-point` 버튼
- ✅ **다크 모드 기본**: `background-color: var(--hover-point)`, `color: #000000` - 일치
- ✅ **라이트 모드 기본**: `background-color: var(--hover-point)`, `color: var(--text-on-hover)` - 일치
- ✅ **호버**: 배경색 유지, 텍스트 색상 유지 - 일치
- ✅ **포커스**: `background-color: var(--brand-pink)`, `color: #FFFFFF` - 일치

#### 1-3. `.btn-icon`
- ✅ **기본**: `background-color: transparent`, `color: var(--text-muted)` - 일치
- ✅ **호버**: `color: var(--hover-point)` - 일치
- ✅ **포커스**: `color: var(--brand-pink)` - 일치
- ✅ **내부 아이콘 세트**: `.lucide-icon` 색상 동시 변경 - 일치

#### 1-4. `.page-header-primary-button`
- ✅ **호버**: `background-color: var(--hover-point)`, `color: var(--text-on-hover)` - 일치
- ✅ **포커스**: `background-color: var(--brand-pink)`, `color: #FFFFFF` - 일치

#### 1-4-1. `.page-header-edit-button`
- ✅ **기본**: `background-color: transparent`, `border-color: var(--brand-pink)`, `color: var(--brand-pink)` - 일치
- ✅ **호버**: `border-color: var(--hover-point)`, `color: var(--hover-point)` - 일치
- ✅ **포커스**: `background-color: var(--brand-pink)`, `border-color: var(--brand-pink)`, `color: #FFFFFF` - 일치

#### 1-4-2. `border-brand-pink.text-brand-pink` 링크
- ✅ **기본**: `background-color: transparent`, `border-color: var(--brand-pink)`, `color: var(--brand-pink)` - 일치
- ✅ **호버**: `background-color: transparent`, `border-color: var(--hover-point)`, `color: var(--hover-point)` - 일치
- ✅ **포커스**: `background-color: transparent`, `border-color: var(--brand-pink)`, `color: var(--brand-pink)` - 일치

#### 1-6. `.btn-retry`
- ✅ **기본**: `background-color: var(--brand-pink)`, `color: #FEFDF6` - 일치
- ✅ **호버**: `background-color: var(--hover-point)`, `color: var(--text-on-hover)` - 일치

#### 1-7. `.cancel-button`
- ✅ **기본**: `background-color: var(--surface-2)`, `color: var(--text-base)`, `border-color: var(--border-subtle)` - 일치
- ✅ **호버**: `background-color: transparent`, `color: var(--hover-point)`, `border-color: var(--hover-point)` - 일치
- ✅ **포커스**: `background-color: transparent`, `color: var(--brand-pink)`, `border-color: var(--brand-pink)` - 일치

#### 1-8. `.track-toggle-btn`
- ✅ **호버**: `color: var(--hover-point)` - 일치
- ✅ **포커스**: `color: var(--brand-pink)` - 일치

#### 1-9. `.search-clear-button`
- ✅ **기본**: `color: var(--brand-pink)` (아이콘) - 일치
- ✅ **호버**: `color: var(--hover-point)` (아이콘) - 일치
- ✅ **포커스**: `color: var(--brand-pink)` (아이콘) - 일치

#### 1-10. `.genre-clear-button`
- ✅ **기본**: `color: var(--brand-pink)` - 일치
- ✅ **호버**: `color: var(--hover-point)` - 일치
- ✅ **포커스**: `color: var(--brand-pink)` - 일치

### 2️⃣ 보더 라인 (Border)

#### 2-1. `.input-base`
- ✅ **기본**: `border-color: var(--border-subtle)` - 일치
- ✅ **호버**: `border-color: var(--hover-point)` - 일치
- ✅ **포커스**: `border-color: var(--brand-pink)` - 일치

#### 2-2. `.search-container`
- ✅ **호버**: 보더 + 아이콘 세트 `var(--hover-point)` - 일치
- ✅ **포커스**: 보더 + 아이콘 세트 `var(--brand-pink)` - 일치

#### 2-3. `.datepicker-container`
- ✅ **규칙**: 검색창과 동일한 패턴 - 일치

#### 2-4. `.filter-dropdown`, `.sort-dropdown`, `.status-dropdown`
- ✅ **호버**: 보더 + 아이콘 세트 `var(--hover-point)` - 일치
- ✅ **포커스**: 보더 + 아이콘 세트 `var(--brand-pink)` - 일치
- ✅ **버튼 텍스트 색상**: 기본 색상 유지 - 일치

### 3️⃣ 아이콘 (Icon)

#### 3-1. `.lucide-icon`
- ✅ **호버**: `color: var(--hover-point)` - 일치
- ✅ **포커스**: `color: var(--brand-pink)` - 일치
- ✅ **배경색**: 항상 투명 - 일치

### 4️⃣ 텍스트 (Text)

#### 4-1. `.text-link`
- ✅ **기본**: `color: var(--text-base)` - 일치
- ✅ **호버**: `color: var(--hover-point)`, `text-decoration: underline` - 일치
- ✅ **포커스**: `color: var(--brand-pink)`, `text-decoration: underline` - 일치

### 5️⃣ 인풋 (Input)

#### 5-1. `.input-base`
- ✅ 모든 규칙 일치 (보더 섹션 참조)

### 6️⃣ 캘린더 (Calendar)

#### 6-1. 캘린더 날짜 버튼
- ✅ **호버**: `background-color: var(--surface-2)` (선택되지 않은 날짜만) - 일치
- ✅ **선택됨**: `background-color: var(--brand-pink)`, `color: #FFFFFF` (호버 무시) - 일치

### 8️⃣ 복합 컴포넌트 (Composite Components)

#### 8-1. `.tag-chip`
- ✅ **기본**: `background-color: var(--surface-2)`, `border-color: var(--border-subtle)`, `color: var(--text-base)` - 일치
- ✅ **호버**: `border-color: var(--hover-point)`, `color: var(--hover-point)` (선택되지 않은 것만) - 일치
- ✅ **선택됨**: `background-color: var(--brand-pink)`, `border-color: var(--brand-pink)`, `color: white` - 일치

#### 8-2. `.card-base`, `.card-interactive`
- ✅ **기본**: `border-color: var(--border-subtle)`, `background-color: var(--surface-1)` - 일치
- ✅ **호버**: `border-color: var(--hover-point)` (`.card-interactive`만) - 일치

#### 8-3. `.play-button`
- ✅ **호버**: `background-color: var(--hover-point)`, `color: var(--text-on-hover)` (아이콘) - 일치
- ✅ **포커스**: `background-color: var(--brand-pink)`, `color: white` (아이콘) - 일치
- ✅ **세트 개념**: 앨범 카드 호버 시 재생 버튼도 호버 - 일치

#### 8-4. `.album-card`
- ✅ **호버**: `border-color: var(--hover-point)` (재생 버튼 포커스 없을 때만) - 일치
- ✅ **포커스**: `border-color: var(--brand-pink)` (재생 버튼 포커스 시) - 일치

#### 8-5. `.more-menu-dropdown`
- ✅ **호버**: `color: var(--hover-point)` (텍스트 + 아이콘 세트) - 일치
- ✅ **포커스**: `color: var(--brand-pink)` (텍스트 + 아이콘 세트) - 일치

#### 8-6. `.toast-dismiss-button`
- ✅ **기본**: `border-color: var(--border-subtle)`, `background-color: transparent` - 일치
- ✅ **호버**: `border-color: var(--hover-point)`, `background-color: var(--surface-1)`, `color: var(--hover-point)` - 일치
- ✅ **포커스**: `border-color: var(--brand-pink)`, `background-color: var(--surface-2)`, `color: var(--brand-pink)` - 일치

#### 8-7. `.character-image-button`
- ✅ **기본**: `border-color: var(--border-subtle)` - 일치
- ✅ **호버**: `border-color: var(--hover-point)` - 일치
- ✅ **포커스**: `border-color: var(--brand-pink)` - 일치

---

## ❌ 불일치 항목

### 1️⃣ 버튼 (Button)

#### 1-5. `.action-button`
**가이드 규칙**:
- **기본**: `background-color: transparent`, `border-color: var(--border-subtle)`
- **호버**: `border-color: var(--hover-point)`, `color: var(--hover-point)`
- **포커스**: `border-color: var(--brand-pink)`, `color: var(--brand-pink)`, `background-color: transparent`

**실제 CSS** (라인 2081-2098):
```css
.action-button:hover:not(:focus):not(:focus-visible) {
  border-color: var(--hover-point) !important;
  background-color: var(--surface-3) !important;  /* ❌ 가이드: transparent */
  ...
}
```

**불일치 내용**:
- ❌ **호버 시 배경색**: 가이드는 `transparent`인데 CSS는 `var(--surface-3)`

**수정 필요**: 호버 시 `background-color: transparent !important`로 변경

---

### 7️⃣ 드롭다운 필터 (Dropdown Filter)

#### 7-1. `.filter-dropdown [role="option"]` - 다크 모드 호버
**가이드 규칙**:
- **다크 모드 호버**: `background-color: var(--hover-point) !important`, `color: #000000 !important`

**실제 CSS** (라인 2454):
```css
.filter-dropdown [role="option"]:hover:not([aria-selected="true"]):not(:focus-visible):not(:focus) { 
  background-color: var(--hover-point) !important; 
  color: var(--text-on-hover) !important  /* ❌ 가이드: #000000 */
}
```

**불일치 내용**:
- ❌ **다크 모드 호버 텍스트 색상**: 가이드는 `#000000`인데 CSS는 `var(--text-on-hover)`

**참고**: `var(--text-on-hover)`는 다크 모드에서 `#000000`과 동일한 값이지만, 가이드에서는 명시적으로 `#000000`을 사용하도록 되어 있음.

**수정 필요**: 다크 모드 호버 시 `color: #000000 !important`로 변경

---

## 📊 요약

### 전체 통계
- **총 확인 항목**: 약 30개
- **완벽 일치**: 28개 (93%)
- **불일치**: 2개 (7%)

### 불일치 항목 상세
1. **`.action-button` 호버 배경색**: `var(--surface-3)` → `transparent`로 수정 필요
2. **`.filter-dropdown [role="option"]` 다크 모드 호버 텍스트 색상**: `var(--text-on-hover)` → `#000000`로 수정 필요

### 참고 사항
- 대부분의 항목이 가이드와 완벽히 일치함
- 불일치 항목은 기능적으로는 문제없지만, 가이드 문서와의 일관성을 위해 수정 권장
- `var(--text-on-hover)`는 다크 모드에서 `#000000`과 동일한 값이지만, 가이드에서는 명시적 값을 사용하도록 규정되어 있음

