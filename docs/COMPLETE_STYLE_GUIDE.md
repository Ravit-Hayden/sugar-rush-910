# Sugar Rush 910 - 완전한 스타일 가이드

> **⚠️ 중요: 이 문서는 프로젝트의 유일한 공식 스타일 가이드입니다.**
> 
> 모든 호버/포커스 효과, 버튼, 보더, 아이콘, 텍스트, 인풋, 캘린더, 드롭다운 스타일 규칙을 포함합니다.
> 
> **마지막 업데이트**: 2025-12-21

---

## 📋 목차

1. [기본 원칙](#기본-원칙)
2. [색상 변수](#색상-변수)
3. [CSS 선택자 패턴](#css-선택자-패턴)
4. [영역별 스타일 규칙](#영역별-스타일-규칙)
5. [세트 개념](#세트-개념)
6. [특수 케이스](#특수-케이스)
7. [검증 체크리스트](#검증-체크리스트)

---

## 기본 원칙

### 핵심 규칙

**포커스 효과가 호버 효과보다 항상 우선순위를 가집니다.**

1. **호버 효과**: 포커스가 없을 때만 적용
2. **포커스 효과**: 호버와 무관하게 항상 적용
3. **포커스+호버**: 포커스 색상 유지 (호버 효과 완전 무시)
4. **같은 기능/영역의 요소들은 세트로 동일한 효과 적용**
5. **아이콘 배경색은 항상 투명** (호버/포커스 기능만 사용되는 경우)
6. **보더 효과와 아이콘은 세트로 동작**
7. **버튼 배경에 색상이 들어간 경우 아이콘+텍스트가 같은 색상으로 적용** (세트 개념)

### 제약사항

- **이름이 중복되거나 코드가 중복되지 않아야 하되, 공통적인 형태의 부분에는 같은 코드나 이름 사용**
- **디자인과 상관없는 두꺼운 라인효과나 다른색의 효과는 사용 금지**
- **미니멀 디자인과 어울리지 않는 그림자 및 입체 효과는 사용 금지**
- **미니멀하고 세련된 최신 디자인과 우리의 기본 커스텀 디자인에 기반해서 항상 제작하고 선과 면의 컬러로만 디자인 완성하기**
- **⚠️ 모든 호버/포커스 효과는 제자리에서 색상만 변경**: `transform`, `translate`, `scale`, `rotate` 등 위치 이동이나 크기 변경 효과는 사용하지 않습니다. 색상(배경색, 텍스트색, 보더색)만 변경됩니다.

### ⚠️ 중요 예외 사항

#### 사이드바 (Sidebar)

**글로벌 디자인 시스템(Cyan/Purple)을 따르지 않고, 기존의 차분한 스타일(System Default)을 유지합니다.**

- 사이드바 내부의 모든 요소는 글로벌 호버/포커스 규칙을 적용하지 않습니다.
- 사이드바는 직접적인 명령 전까지 절대 수정 금지입니다.

#### 헤더 (Header)

**레이아웃은 유지하되, 내부 검색창(`Input`)과 버튼만 글로벌 규칙을 따릅니다.**

- 헤더의 레이아웃과 구조는 수정하지 않습니다.
- 헤더 내부의 검색창(`.search-container`)과 버튼(`.page-header-primary-button` 등)은 글로벌 호버/포커스 규칙을 적용합니다.
- 헤더의 다른 요소들은 직접적인 명령 전까지 수정 금지입니다.

---

## 색상 변수

### CSS 변수 정의

#### 기본 색상 변수 (모드별)

```css
:root {
  /* 다크 모드 기본 색상 */
  --bg: #000000;                 /* 배경색 (검정) */
  --surface-1: #1A1A1A;          /* 표면 색상 1 (어두운 회색) */
  --surface-2: #121212;          /* 표면 색상 2 (더 어두운 회색) */
  --text-base: #888888;          /* 기본 텍스트 색상 (회색) */
  --text-strong: #B6B6B6;         /* 강조 텍스트 색상 (밝은 회색) */
  --text-muted: #6F6F6F;          /* 약한 텍스트 색상 (어두운 회색) */
  --border-subtle: #252528;       /* 보더 색상 (어두운 회색) */
}

[data-theme="light"] {
  /* 라이트 모드 기본 색상 */
  --bg: #F7F3E9;                 /* 배경색 (베이지 톤) */
  --surface-1: #FFF8EF;          /* 표면 색상 1 (밝은 베이지) */
  --surface-2: #F3EBDD;          /* 표면 색상 2 (베이지) */
  --text-base: #8B7355;          /* 기본 텍스트 색상 (갈색) */
  --text-strong: #6B5B47;         /* 강조 텍스트 색상 (진한 갈색) */
  --text-muted: #5C4F3F;          /* 약한 텍스트 색상 (더 진한 갈색) */
  --border-subtle: #B8A896;       /* 보더 색상 (회색 갈색) */
}
```

#### 호버/포커스 색상 변수

```css
:root {
  --brand-pink: #FF3DAE;        /* 포커스 색상 (공통) */
  --hover-point: #17E1BC;        /* 호버 색상 (다크 모드: 시안) */
  --text-on-hover: #000000;      /* 호버 시 텍스트 (다크 모드: 검정) */
}

[data-theme="light"] {
  --hover-point: #8A2BE2;        /* 호버 색상 (라이트 모드: 보라) */
  --text-on-hover: #F3EBDD;      /* 호버 시 텍스트 (라이트 모드: 베이지) */
}
```

### 색상 요약표

#### 기본 색상 (모드별)

| 모드 | 배경색 | 표면 색상 1 | 표면 색상 2 | 기본 텍스트 | 강조 텍스트 | 약한 텍스트 | 보더 |
|------|--------|------------|------------|------------|------------|------------|------|
| **다크 모드** | `#000000` (검정) | `#1A1A1A` (어두운 회색) | `#121212` (더 어두운 회색) | `#888888` (회색) | `#B6B6B6` (밝은 회색) | `#6F6F6F` (어두운 회색) | `#252528` (어두운 회색) |
| **라이트 모드** | `#F7F3E9` (베이지 톤) | `#FFF8EF` (밝은 베이지) | `#F3EBDD` (베이지) | `#8B7355` (갈색) | `#6B5B47` (진한 갈색) | `#5C4F3F` (더 진한 갈색) | `#B8A896` (회색 갈색) |

#### 호버/포커스 색상

| 모드 | 호버 색상 | 호버 텍스트 | 포커스 색상 | 포커스 텍스트 |
|------|----------|------------|------------|-------------|
| **다크 모드** | `#17E1BC` (시안) | `#000000` (검정) | `#FF3DAE` (핫핑크) | `#FFFFFF` (흰색) |
| **라이트 모드** | `#8A2BE2` (보라) | `#F3EBDD` (베이지) | `#FF3DAE` (핫핑크) | `#FFFFFF` (흰색) |

### 변수 사용 가이드

#### 기본 색상 변수

- **배경색**: `var(--bg)` - 페이지/컨테이너 배경
- **표면 색상**: `var(--surface-1)`, `var(--surface-2)` - 카드, 패널 등 표면 요소
- **텍스트 색상**: 
  - `var(--text-base)` - 기본 텍스트
  - `var(--text-strong)` - 강조 텍스트
  - `var(--text-muted)` - 약한 텍스트 (플레이스홀더 등)
- **보더 색상**: `var(--border-subtle)` - 기본 보더

#### 호버/포커스 색상 변수

- ✅ **권장**: `var(--hover-point)`, `var(--brand-pink)`, `var(--text-on-hover)`
- **참고**: `var(--text-on-hover)`와 `var(--surface-2)`는 라이트 모드에서 동일한 값(`#F3EBDD`)을 가집니다. 둘 다 사용 가능하지만, 의미상 `var(--text-on-hover)`가 더 명확합니다.

---

## CSS 선택자 패턴

### 1. 호버 효과 패턴

**모든 호버 효과는 반드시 `:not(:focus):not(:focus-visible)` 조건을 포함해야 합니다.**

```css
/* ✅ 올바른 예 */
.element:hover:not(:focus):not(:focus-visible) {
  color: var(--hover-point);
}

/* ❌ 잘못된 예 */
.element:hover {
  color: var(--hover-point); /* 포커스 상태에서도 호버 효과가 적용됨 */
}
```

### 2. 포커스 효과 패턴

**포커스 효과는 `:focus`와 `:focus-visible` 모두 사용합니다.**

```css
.element:focus,
.element:focus-visible {
  color: var(--brand-pink) !important;
  outline: none;
}
```

### 3. 포커스+호버 패턴

**포커스 상태에서 호버해도 포커스 색상을 유지합니다.**

```css
.element:focus:hover,
.element:focus-visible:hover {
  color: var(--brand-pink) !important; /* 호버 색상이 아닌 포커스 색상 유지 */
}
```

### 4. 포커스-위딘 패턴 (컨테이너 내부 요소)

**컨테이너 내부 요소의 포커스를 감지할 때 사용합니다.**

```css
.container:focus-within .child-element {
  border-color: var(--brand-pink) !important;
}

.container:hover:not(:focus-within) .child-element {
  border-color: var(--hover-point) !important;
}
```

---

## 영역별 스타일 규칙

### 1️⃣ 버튼 (Button)

#### 1-1. 배경색이 있는 버튼 (`bg-brand-pink`)

**CSS 클래스**: `button.bg-brand-pink`, `button[class*="bg-brand-pink"]`

**다크 모드**:
- **기본**: `background-color: var(--brand-pink)`, `color: #FFFFFF`
- **호버** (포커스 없을 때): `background-color: var(--hover-point) !important`, `color: #000000 !important`
- **포커스**: `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important`
- **포커스+호버**: 포커스 색상 유지 (핫핑크 배경 + 흰색 텍스트)

**라이트 모드**:
- **기본**: `background-color: var(--brand-pink)`, `color: #FFFFFF`
- **호버** (포커스 없을 때): `background-color: var(--hover-point) !important`, `color: var(--surface-2) !important`
- **포커스**: `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important`
- **포커스+호버**: 포커스 색상 유지 (핫핑크 배경 + 흰색 텍스트)

**CSS 예시**:
```css
/* 다크 모드 호버 */
button.bg-brand-pink:hover:not(:focus):not(:focus-visible) {
  background-color: var(--hover-point) !important;
  color: #000000 !important;
}

/* 라이트 모드 호버 */
[data-theme="light"] button.bg-brand-pink:hover:not(:focus):not(:focus-visible) {
  background-color: var(--hover-point) !important;
  color: var(--surface-2) !important;
}

/* 포커스 (모든 모드) */
button.bg-brand-pink:focus,
button.bg-brand-pink:focus-visible {
  background-color: var(--brand-pink) !important;
  color: #FFFFFF !important;
  outline: none !important;
}

/* 포커스+호버 */
button.bg-brand-pink:focus:hover,
button.bg-brand-pink:focus-visible:hover {
  background-color: var(--brand-pink) !important;
  color: #FFFFFF !important;
}
```

**세트 개념**: 버튼 배경 + 아이콘 + 텍스트가 모두 같은 색상으로 변경

---

#### 1-2. 호버색 배경 버튼 (`bg-hover-cyan` / `bg-hover-point`)

**CSS 클래스**: `button.bg-hover-cyan`, `button[class*="bg-hover-cyan"]`, `button.bg-hover-point`

**⚠️ 중요**: 이 버튼은 `bg-brand-pink` 버튼과 **호버/포커스 효과는 동일**하지만, **기본 배경색만 다릅니다.**

**다크 모드**:
- **기본**: `background-color: var(--hover-point)`, `color: #000000` (시안 배경 + 검정 텍스트/아이콘)
- **호버** (포커스 없을 때): `background-color: var(--hover-point) !important`, `color: #000000 !important` (시안 배경 유지 + 검정 텍스트/아이콘)
- **포커스**: `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important` (핫핑크 배경 + 흰색 텍스트/아이콘)
- **포커스+호버**: 포커스 색상 유지 (핫핑크 배경 + 흰색 텍스트/아이콘)

**라이트 모드**:
- **기본**: `background-color: var(--hover-point)`, `color: var(--text-on-hover)` (보라 배경 + 베이지 텍스트/아이콘)
- **호버** (포커스 없을 때): `background-color: var(--hover-point) !important`, `color: var(--text-on-hover) !important` (보라 배경 유지 + 베이지 텍스트/아이콘)
- **포커스**: `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important` (핫핑크 배경 + 흰색 텍스트/아이콘)
- **포커스+호버**: 포커스 색상 유지 (핫핑크 배경 + 흰색 텍스트/아이콘)

**CSS 예시**:
```css
/* 다크 모드 기본 */
button.bg-hover-cyan {
  background-color: var(--hover-point);
  color: #000000;
}

/* 다크 모드 호버 (포커스 없을 때) */
button.bg-hover-cyan:hover:not(:focus):not(:focus-visible) {
  background-color: var(--hover-point) !important;
  color: #000000 !important;
}

/* 라이트 모드 기본 */
[data-theme="light"] button.bg-hover-cyan {
  background-color: var(--hover-point);
  color: var(--text-on-hover);
}

/* 라이트 모드 호버 (포커스 없을 때) */
[data-theme="light"] button.bg-hover-cyan:hover:not(:focus):not(:focus-visible) {
  background-color: var(--hover-point) !important;
  color: var(--text-on-hover) !important;
}

/* 포커스 (모든 모드) - bg-brand-pink 버튼과 동일 */
button.bg-hover-cyan:focus,
button.bg-hover-cyan:focus-visible {
  background-color: var(--brand-pink) !important;
  color: #FFFFFF !important;
  outline: none !important;
}

/* 포커스+호버 - bg-brand-pink 버튼과 동일 */
button.bg-hover-cyan:focus:hover,
button.bg-hover-cyan:focus-visible:hover {
  background-color: var(--brand-pink) !important;
  color: #FFFFFF !important;
}
```

**세트 개념**: 버튼 배경 + 아이콘 + 텍스트가 모두 같은 색상으로 변경

**차이점 요약**:
- **`bg-brand-pink` 버튼**: 기본 핫핑크 배경 + 흰색 텍스트/아이콘
- **`bg-hover-cyan` 버튼**: 기본 호버색 배경 + 호버색 텍스트/아이콘 (다크모드: 시안+검정, 라이트모드: 보라+베이지)
- **호버/포커스 효과**: 두 버튼 모두 동일

---

#### 1-3. 배경색 없는 버튼 (`.btn-icon`)

**CSS 클래스**: `.btn-icon`

**다크 모드**:
- **기본**: `background-color: transparent`, `color: var(--text-muted)`
- **호버** (포커스 없을 때): `color: var(--hover-point) !important`
- **포커스**: `color: var(--brand-pink) !important`, `outline: none`
- **포커스+호버**: 포커스 색상 유지 (핫핑크)

**라이트 모드**:
- **기본**: `background-color: transparent`, `color: var(--text-muted)`
- **호버** (포커스 없을 때): `color: var(--hover-point) !important`
- **포커스**: `color: var(--brand-pink) !important`, `outline: none`
- **포커스+호버**: 포커스 색상 유지 (핫핑크)

**CSS 예시**:
```css
.btn-icon {
  background-color: transparent;
  color: var(--text-muted);
}

.btn-icon:hover:not(:focus):not(:focus-visible) {
  color: var(--hover-point) !important;
}

.btn-icon:focus,
.btn-icon:focus-visible {
  color: var(--brand-pink) !important;
  outline: none;
}

.btn-icon:focus:hover,
.btn-icon:focus-visible:hover {
  color: var(--brand-pink) !important;
}

/* 내부 아이콘도 동일한 규칙 적용 */
.btn-icon:hover:not(:focus):not(:focus-visible) .lucide-icon {
  color: var(--hover-point) !important;
}

.btn-icon:focus .lucide-icon,
.btn-icon:focus-visible .lucide-icon {
  color: var(--brand-pink) !important;
}
```

**세트 개념**: 아이콘 배경은 항상 투명, 아이콘 색상만 변경

---

#### 1-4. 페이지 헤더 프라이머리 버튼 (`.page-header-primary-button`)

**CSS 클래스**: `.page-header-primary-button`

**규칙**: `bg-brand-pink` 버튼과 동일한 규칙 적용

**다크 모드**:
- **기본**: `background-color: var(--brand-pink)`, `color: #FFFFFF`
- **호버** (포커스 없을 때): `background-color: var(--hover-point) !important`, `color: var(--text-on-hover) !important` (검정)
- **포커스**: `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `background-color: var(--brand-pink)`, `color: #FFFFFF`
- **호버** (포커스 없을 때): `background-color: var(--hover-point) !important`, `color: var(--text-on-hover) !important` (베이지)
- **포커스**: `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important`
- **포커스+호버**: 포커스 색상 유지

**세트 개념**: 버튼 배경 + 아이콘 + 텍스트가 모두 같은 색상으로 변경

---

#### 1-4-1. 페이지 헤더 편집 버튼 (`.page-header-edit-button`)

**CSS 클래스**: `.page-header-edit-button`

**다크 모드**:
- **기본**: `background-color: transparent`, `border-color: var(--brand-pink)`, `color: var(--brand-pink)`
- **호버** (포커스 없을 때): `border-color: var(--hover-point) !important`, `color: var(--hover-point) !important`
- **포커스**: `background-color: var(--brand-pink) !important`, `border-color: var(--brand-pink) !important`, `color: #FFFFFF !important`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `background-color: transparent`, `border-color: var(--brand-pink)`, `color: var(--brand-pink)`
- **호버** (포커스 없을 때): `border-color: var(--hover-point) !important`, `color: var(--hover-point) !important`
- **포커스**: `background-color: var(--brand-pink) !important`, `border-color: var(--brand-pink) !important`, `color: #FFFFFF !important`
- **포커스+호버**: 포커스 색상 유지

**세트 개념**: 버튼 보더 + 아이콘 + 텍스트가 모두 같은 색상으로 변경

---

#### 1-4-2. 보더+텍스트 핑크 링크 (`border-brand-pink` + `text-brand-pink`)

**CSS 클래스**: `a.border-brand-pink.text-brand-pink`, `a[class*="border-brand-pink"][class*="text-brand-pink"]`

**⚠️ 중요**: 이 링크는 **배경색 변경 없이** 보더 + 아이콘 + 텍스트 색상만 변경됩니다.

**다크 모드**:
- **기본**: `background-color: transparent`, `border-color: var(--brand-pink)`, `color: var(--brand-pink)`
- **호버** (포커스 없을 때): `background-color: transparent !important`, `border-color: var(--hover-point) !important`, `color: var(--hover-point) !important`
- **포커스**: `background-color: transparent !important`, `border-color: var(--brand-pink) !important`, `color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `background-color: transparent`, `border-color: var(--brand-pink)`, `color: var(--brand-pink)`
- **호버** (포커스 없을 때): `background-color: transparent !important`, `border-color: var(--hover-point) !important`, `color: var(--hover-point) !important`
- **포커스**: `background-color: transparent !important`, `border-color: var(--brand-pink) !important`, `color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지

**세트 개념**: 보더 + 아이콘 + 텍스트가 모두 같은 색상으로 변경 (배경색은 항상 투명)

**적용 예시**: TasksCard의 "작업", "멘션" 링크

---

#### 1-5. 액션 버튼 (`.action-button`)

**CSS 클래스**: `.action-button`

**다크 모드**:
- **기본**: `background-color: transparent`, `border-color: var(--border-subtle)`
- **호버** (포커스 없을 때): `border-color: var(--hover-point) !important`, `color: var(--hover-point) !important`
- **포커스**: `border-color: var(--brand-pink) !important`, `color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `background-color: transparent`, `border-color: var(--border-subtle)`
- **호버** (포커스 없을 때): `border-color: var(--hover-point) !important`, `color: var(--hover-point) !important`
- **포커스**: `border-color: var(--brand-pink) !important`, `color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지

**세트 개념**: `.action-button-text`, `.action-button-icon` 클래스가 있는 경우 모두 같은 색상으로 변경

---

#### 1-6. 재시도 버튼 (`.btn-retry`)

**CSS 클래스**: `.btn-retry`

**다크 모드**:
- **기본**: `background-color: var(--brand-pink)`, `color: #FEFDF6`
- **호버** (포커스 없을 때): `background-color: var(--hover-point) !important`, `color: var(--text-on-hover) !important` (검정)

**라이트 모드**:
- **기본**: `background-color: var(--brand-pink)`, `color: #FEFDF6`
- **호버** (포커스 없을 때): `background-color: var(--hover-point) !important`, `color: var(--text-on-hover) !important` (베이지)

**⚠️ 참고**: 포커스 효과는 기본적으로 적용되지 않지만, 필요 시 추가 가능

---

#### 1-7. 취소 버튼 (`.cancel-button`)

**CSS 클래스**: `.cancel-button`

**다크 모드**:
- **기본**: `background-color: var(--surface-2)`, `color: var(--text-base)`, `border-color: var(--border-subtle)`
- **호버** (포커스 없을 때): `background-color: transparent !important`, `color: var(--hover-point) !important`, `border-color: var(--hover-point) !important`
- **포커스**: `background-color: transparent !important`, `color: var(--brand-pink) !important`, `border-color: var(--brand-pink) !important`, `outline: none`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `background-color: var(--surface-2)`, `color: var(--text-base)`, `border-color: var(--border-subtle)`
- **호버** (포커스 없을 때): `background-color: transparent !important`, `color: var(--hover-point) !important`, `border-color: var(--hover-point) !important`
- **포커스**: `background-color: transparent !important`, `color: var(--brand-pink) !important`, `border-color: var(--brand-pink) !important`, `outline: none`
- **포커스+호버**: 포커스 색상 유지

**세트 개념**: 버튼 텍스트 + 아이콘이 모두 같은 색상으로 변경

---

#### 1-8. 트랙 토글 버튼 (`.track-toggle-btn`)

**CSS 클래스**: `.track-toggle-btn`

**다크 모드**:
- **기본**: `color: inherit`
- **호버** (포커스 없을 때): `color: var(--hover-point) !important`
- **포커스**: `color: var(--brand-pink) !important`, `outline: none`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `color: inherit`
- **호버** (포커스 없을 때): `color: var(--hover-point) !important`
- **포커스**: `color: var(--brand-pink) !important`, `outline: none`
- **포커스+호버**: 포커스 색상 유지

---

#### 1-9. 검색 초기화 버튼 (`.search-clear-button`)

**CSS 클래스**: `.search-clear-button`

**다크/라이트 모드 공통**:
- **기본**: `color: var(--brand-pink)` (아이콘)
- **호버** (포커스 없을 때): `color: var(--hover-point) !important` (아이콘)
- **포커스**: `color: var(--brand-pink) !important` (아이콘)
- **포커스+호버**: 포커스 색상 유지 (핫핑크)

**CSS 예시**:
```css
.search-clear-button .lucide-icon {
  color: var(--brand-pink) !important;
}

.search-clear-button:hover:not(:focus):not(:focus-visible) .lucide-icon {
  color: var(--hover-point) !important;
}

.search-clear-button:focus .lucide-icon,
.search-clear-button:focus-visible .lucide-icon {
  color: var(--brand-pink) !important;
}
```

---

#### 1-10. 장르 초기화 버튼 (`.genre-clear-button`)

**CSS 클래스**: `.genre-clear-button`

**다크/라이트 모드 공통**:
- **기본**: `color: var(--brand-pink)`
- **호버** (포커스 없을 때): `color: var(--hover-point) !important`
- **포커스**: `color: var(--brand-pink) !important`, `outline: none`
- **포커스+호버**: 포커스 색상 유지

---

### 2️⃣ 보더 라인 (Border)

#### 2-1. 입력 필드 보더 (`.input-base`)

**CSS 클래스**: `.input-base`

**다크 모드**:
- **기본**: `border-color: var(--border-subtle)`
- **호버** (포커스 없을 때): `border-color: var(--hover-point)`
- **포커스**: `border-color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지 (핫핑크)

**라이트 모드**:
- **기본**: `border-color: var(--border-subtle)`
- **호버** (포커스 없을 때): `border-color: var(--hover-point)`
- **포커스**: `border-color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지 (핫핑크)

**CSS 예시**:
```css
.input-base {
  border-color: var(--border-subtle);
}

.input-base:hover:not(:focus):not(:focus-within) {
  border-color: var(--hover-point);
}

.input-base:focus,
.input-base:focus-within,
.input-base[aria-expanded="true"] {
  border-color: var(--brand-pink) !important;
}
```

---

#### 2-2. 검색창 보더 + 아이콘 (세트)

**CSS 클래스**: `.search-container`

**세트 개념**: 보더와 아이콘이 동시에 같은 색상으로 변경

**다크 모드**:
- **호버** (포커스 없을 때): 보더 `#17E1BC` + 아이콘 `#17E1BC`
- **포커스**: 보더 `#FF3DAE` + 아이콘 `#FF3DAE`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **호버** (포커스 없을 때): 보더 `#8A2BE2` + 아이콘 `#8A2BE2`
- **포커스**: 보더 `#FF3DAE` + 아이콘 `#FF3DAE`
- **포커스+호버**: 포커스 색상 유지

**CSS 예시**:
```css
/* 호버 (포커스 없을 때) */
.search-container:hover:not(:focus-within) input {
  border-color: var(--hover-point) !important;
}
.search-container:hover:not(:focus-within) .lucide-icon {
  color: var(--hover-point) !important;
}

/* 포커스 */
.search-container:focus-within input {
  border-color: var(--brand-pink) !important;
}
.search-container:focus-within .lucide-icon {
  color: var(--brand-pink) !important;
}

/* 포커스+호버 */
.search-container:focus-within:hover input {
  border-color: var(--brand-pink) !important;
}
.search-container:focus-within:hover .lucide-icon {
  color: var(--brand-pink) !important;
}
```

---

#### 2-3. DatePicker 보더 + 아이콘 (세트)

**CSS 클래스**: `.datepicker-container`

**세트 개념**: 보더와 아이콘이 동시에 같은 색상으로 변경

**규칙**: 검색창과 동일한 패턴 적용

---

#### 2-4. 필터/정렬/상태 드롭다운 보더 + 아이콘 (세트)

**CSS 클래스**: `.filter-dropdown`, `.sort-dropdown`, `.status-dropdown`

**세트 개념**: 보더와 아이콘이 동시에 같은 색상으로 변경

**다크 모드**:
- **기본**: `border-color: var(--border-subtle)`, 아이콘 `color: var(--text-base)`
- **호버** (포커스 없을 때): `border-color: var(--hover-point) !important`, 아이콘 `color: var(--hover-point) !important`
- **포커스** (`:focus-within` 또는 `[data-open="true"]`): `border-color: var(--brand-pink) !important`, 아이콘 `color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `border-color: var(--border-subtle)`, 아이콘 `color: var(--text-base)`
- **호버** (포커스 없을 때): `border-color: var(--hover-point) !important`, 아이콘 `color: var(--hover-point) !important`
- **포커스** (`:focus-within` 또는 `[data-open="true"]`): `border-color: var(--brand-pink) !important`, 아이콘 `color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지

**⚠️ 중요**: 
- 드롭다운이 열려있을 때 (`[data-open="true"]`)도 포커스 색상 유지
- 버튼 텍스트 색상은 기본 색상 유지 (변경되지 않음)

**CSS 예시**:
```css
/* 호버 (포커스 없을 때) */
.filter-dropdown:hover:not(:focus-within) button {
  border-color: var(--hover-point) !important;
}
.filter-dropdown:hover:not(:focus-within) button svg {
  color: var(--hover-point) !important;
}

/* 포커스 */
.filter-dropdown:focus-within button,
.filter-dropdown[data-open="true"] button {
  border-color: var(--brand-pink) !important;
}
.filter-dropdown:focus-within button svg,
.filter-dropdown[data-open="true"] button svg {
  color: var(--brand-pink) !important;
}
```

---

### 3️⃣ 아이콘 (Icon)

#### 3-1. 일반 아이콘 (`.lucide-icon`)

**CSS 클래스**: `.lucide-icon`

**다크 모드**:
- **기본**: `color: inherit`
- **호버** (포커스 없을 때): `color: var(--hover-point) !important`
- **포커스**: `color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `color: inherit`
- **호버** (포커스 없을 때): `color: var(--hover-point) !important`
- **포커스**: `color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지

**중요**: 아이콘 배경색은 항상 투명

---

#### 3-2. 캘린더 네비게이션 아이콘 (`.calendar-nav-btn`)

**CSS 클래스**: `.calendar-nav-btn`

**규칙**: 일반 아이콘과 동일한 패턴 적용

**중요**: 배경색은 항상 투명

---

#### 3-3. 캘린더 아이콘 버튼 (`.calendar-icon-btn`)

**CSS 클래스**: `.calendar-icon-btn`

**규칙**: 일반 아이콘과 동일한 패턴 적용

**중요**: 배경색은 항상 투명

---

### 4️⃣ 텍스트 (Text)

#### 4-1. 링크 텍스트 (`.text-link`)

**CSS 클래스**: `.text-link`

**다크 모드**:
- **기본**: `color: var(--text-base)`
- **호버** (포커스 없을 때): `color: var(--hover-point)`, `text-decoration: underline`
- **포커스**: `color: var(--brand-pink)`, `text-decoration: underline`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `color: var(--text-base)`
- **호버** (포커스 없을 때): `color: var(--hover-point)`, `text-decoration: underline`
- **포커스**: `color: var(--brand-pink)`, `text-decoration: underline`
- **포커스+호버**: 포커스 색상 유지

---

#### 4-2. 트랙 아이템 텍스트 (`.track-item`)

**CSS 클래스**: `.track-item`

**다크 모드**:
- **기본**: `color: var(--text-base)`
- **호버** (포커스 없을 때): `color: var(--hover-point) !important`
- **포커스**: `color: var(--brand-pink) !important`, `outline: none`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `color: var(--text-base)`
- **호버** (포커스 없을 때): `color: var(--hover-point) !important`
- **포커스**: `color: var(--brand-pink) !important`, `outline: none`
- **포커스+호버**: 포커스 색상 유지

**세트 개념**: `.track-number`, `.track-title`, `.track-duration` 모두 같은 색상으로 변경

---

#### 4-3. 검색어 하이라이트 (`.text-search-highlight`)

**CSS 클래스**: `.text-search-highlight`

**다크 모드**:
- **색상**: `color: var(--search-highlight-dark)` (`#FFD700` - 골드)

**라이트 모드**:
- **색상**: `color: var(--search-highlight-light)` (`#FF7A00` - 오렌지, 또는 `#00B82E` - 진한 형광 그린)

**⚠️ 참고**: 검색어 하이라이트는 호버/포커스 효과가 없으며, 검색 결과에서 일치하는 텍스트를 강조하는 용도입니다.

**CSS 예시**:
```css
.text-search-highlight {
  color: var(--search-highlight-dark);
}

[data-theme="light"] .text-search-highlight {
  color: var(--search-highlight-light);
}
```

---

### 5️⃣ 인풋 (Input)

#### 5-1. 기본 입력 필드 (`.input-base`)

**CSS 클래스**: `.input-base`

**규칙**: [보더 라인 - 입력 필드 보더](#2-1-입력-필드-보더-input-base) 참조

---

#### 5-2. 숫자 입력 필드 (`.number-input-custom`)

**CSS 클래스**: `input[type="number"].number-input-custom`

**⚠️ 중요**: 숫자 입력 필드의 스피너 버튼(증가/감소 버튼) 아이콘에 호버/포커스 효과가 적용됩니다.

**다크/라이트 모드 공통**:
- **기본**: 스피너 버튼 아이콘 `color: inherit`
- **호버** (포커스 없을 때): 스피너 버튼 아이콘 `color: var(--hover-point) !important`
- **포커스**: 스피너 버튼 아이콘 `color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지

**CSS 예시**:
```css
input[type="number"].number-input-custom + div button:hover .lucide-icon {
  color: var(--hover-point) !important;
}

input[type="number"].number-input-custom + div button:focus .lucide-icon,
input[type="number"].number-input-custom + div button:focus-visible .lucide-icon {
  color: var(--brand-pink) !important;
}
```

**⚠️ 참고**: 
- 스피너 버튼 자체는 숨겨지고, 커스텀 아이콘 버튼으로 대체됩니다.
- `-webkit-appearance: none`으로 기본 스피너 제거

---

#### 5-3. 체크박스 (`input[type="checkbox"]`)

**CSS 선택자**: `input[type="checkbox"]`

**다크/라이트 모드 공통**:
- **기본**: 기본 체크박스 스타일
- **선택됨** (`:checked`): 체크마크 `color: var(--brand-pink)`
- **호버** (포커스 없을 때): 라이트 모드에서만 호버 효과 (다크 모드는 기본 스타일 유지)

**CSS 예시**:
```css
input[type="checkbox"]:checked::after {
  content: "✓";
  color: var(--brand-pink);
  font-size: 10px;
  font-weight: bold;
}

[data-theme="light"] input[type="checkbox"]:hover:not(:focus):not(:focus-visible) {
  /* 라이트 모드 호버 효과 */
}
```

**⚠️ 참고**: 체크박스는 커스텀 체크마크(✓)를 사용하며, 선택 시 핫핑크 색상으로 표시됩니다.

---

#### 5-4. 플레이스홀더 스타일

**CSS 선택자**: `input::placeholder`, `input::-webkit-input-placeholder`, `input::-moz-placeholder`, `input:-ms-input-placeholder`

**다크/라이트 모드 공통**:
- **색상**: `color: var(--text-muted) !important`
- **투명도**: `opacity: 1 !important`

**⚠️ 참고**: 모든 브라우저 호환성을 위해 여러 벤더 프리픽스를 사용합니다.

---

#### 5-5. 폼 검증 에러 상태 (`[aria-invalid="true"]`)

**CSS 선택자**: `input[aria-invalid="true"]`, `select[aria-invalid="true"]`, `textarea[aria-invalid="true"]`

**다크/라이트 모드 공통**:
- **기본**: `border-color: var(--danger-fg) !important` (빨간색)
- **포커스**: `border-color: var(--danger-fg) !important`, `box-shadow: 0 0 0 1px var(--danger-fg)`

**⚠️ 중요**: 에러 상태는 호버/포커스 규칙과 별개로 동작하며, 항상 빨간색 보더를 유지합니다.

---

### 6️⃣ 캘린더 (Calendar)

#### 6-1. 캘린더 날짜 버튼

**CSS 클래스**: `.custom-calendar button`

**다크/라이트 모드 공통**:
- **기본**: `background-color: transparent`
- **호버** (선택되지 않은 날짜만): `background-color: var(--surface-2) !important`
- **포커스**: `outline: none` (기본 포커스 링 제거)
- **선택됨** (`[class*="bg-brand-pink"]`): `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important` (호버 무시)

**⚠️ 중요**: 
- 선택된 날짜는 호버 효과 무시
- 캘린더 내부 아이콘도 호버 효과 적용

**CSS 예시**:
```css
.custom-calendar button:hover:not([class*="bg-brand-pink"]) {
  background-color: var(--surface-2) !important;
}

.custom-calendar button[class*="bg-brand-pink"] {
  background-color: var(--brand-pink) !important;
  color: #FFFFFF !important;
}

.custom-calendar .lucide-icon:hover {
  color: var(--hover-point) !important;
}
```

---

#### 6-2. 캘린더 네비게이션 버튼 (`.calendar-nav-btn`)

**CSS 클래스**: `.calendar-nav-btn`

**규칙**: [아이콘 - 캘린더 네비게이션 아이콘](#3-2-캘린더-네비게이션-아이콘-calendar-nav-btn) 참조

---

#### 6-3. 캘린더 아이콘 버튼 (`.calendar-icon-btn`)

**CSS 클래스**: `.calendar-icon-btn`

**규칙**: [아이콘 - 캘린더 아이콘 버튼](#3-3-캘린더-아이콘-버튼-calendar-icon-btn) 참조

---

### 7️⃣ 드롭다운 필터 (Dropdown Filter)

#### 7-1. 필터 드롭다운 옵션 (`[role="option"]`)

**CSS 선택자**: `.filter-dropdown [role="option"]`

**다크 모드**:
- **기본**: `background-color: transparent`, `color: var(--text-base)`
- **선택됨** (`[aria-selected="true"]`): `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important` (호버 무시)
- **호버** (선택/포커스 없을 때): `background-color: var(--hover-point) !important`, `color: #000000 !important`
- **포커스**: `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `background-color: transparent`, `color: var(--text-base)`
- **선택됨** (`[aria-selected="true"]`): `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important` (호버 무시)
- **호버** (선택/포커스 없을 때): `background-color: var(--hover-point) !important`, `color: var(--text-on-hover) !important`
- **포커스**: `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important`
- **포커스+호버**: 포커스 색상 유지

**✅ 정상**: 라이트 모드 호버 시 텍스트 색상이 `var(--text-on-hover)` (`#F3EBDD`) 사용 중

**CSS 예시**:
```css
/* 다크 모드 호버 */
.filter-dropdown [role="option"]:hover:not([aria-selected="true"]):not(:focus):not(:focus-visible) {
  background-color: var(--hover-point) !important;
  color: #000000 !important;
}

/* 라이트 모드 호버 */
[data-theme="light"] .filter-dropdown [role="option"]:hover:not([aria-selected="true"]):not(:focus):not(:focus-visible) {
  background-color: var(--hover-point) !important;
  color: var(--text-on-hover) !important;
}

/* 포커스 (모든 모드) */
.filter-dropdown [role="option"]:focus:not([aria-selected="true"]),
.filter-dropdown [role="option"]:focus-visible:not([aria-selected="true"]) {
  background-color: var(--brand-pink) !important;
  color: #FFFFFF !important;
  outline: none;
}
```

---

#### 7-2. 정렬 드롭다운 옵션 (`[role="option"]`)

**CSS 선택자**: `.sort-dropdown [role="option"]`

**규칙**: 필터 드롭다운 옵션과 동일한 패턴 적용

**✅ 정상**: 라이트 모드 호버 시 텍스트 색상이 `var(--text-on-hover)` (`#F3EBDD`) 사용 중

---

#### 7-3. 상태 드롭다운 옵션 (`[role="option"]`)

**CSS 선택자**: `.status-dropdown [role="option"]`

**규칙**: 필터 드롭다운 옵션과 동일한 패턴 적용

**✅ 정상**: 라이트 모드 호버 시 텍스트 색상이 `var(--surface-2)` 사용 중

---

#### 7-4. 장르 드롭다운 아이템 (`.genre-dropdown-item`)

**CSS 클래스**: `.genre-dropdown-item`

**다크/라이트 모드 공통**:
- **기본**: `background-color: transparent`, `color: var(--text-base)`
- **호버** (포커스 없을 때): `background-color: var(--hover-point) !important`, `color: var(--text-on-hover) !important`

**⚠️ 참고**: 포커스 효과는 기본적으로 적용되지 않지만, 필요 시 추가 가능

---

### 8️⃣ 복합 컴포넌트 (Composite Components)

#### 8-1. 태그/칩 (`.tag-chip`)

**CSS 클래스**: `.tag-chip`

**다크 모드**:
- **기본**: `border-color: var(--border-subtle)`, `color: var(--text-base)`, `background-color: var(--surface-2)`
- **호버** (선택되지 않은 것만): `border-color: var(--hover-point)`, `color: var(--hover-point)`
- **선택됨** (`.selected` 또는 `data-selected="true"`): `background-color: var(--brand-pink) !important`, `border-color: var(--brand-pink) !important`, `color: white !important` (호버 무시)

**라이트 모드**:
- **기본**: `border-color: var(--border-subtle)`, `color: var(--text-base)`, `background-color: var(--surface-2)`
- **호버** (선택되지 않은 것만): `border-color: var(--hover-point)`, `color: var(--hover-point)`
- **선택됨**: 동일 (다크 모드와 동일)

**CSS 예시**:
```css
.tag-chip:hover:not(.selected) {
  border-color: var(--hover-point);
  color: var(--hover-point);
}

.tag-chip.selected,
.tag-chip[data-selected="true"] {
  background-color: var(--brand-pink) !important;
  border-color: var(--brand-pink) !important;
  color: white !important;
}
```

---

#### 8-2. 카드 (`.card-base`, `.card-interactive`)

**CSS 클래스**: `.card-base`, `.card-interactive`

**⚠️ 중요 규칙**:
- **인터랙티브 카드만 호버 효과 적용**: `.card-interactive` 클래스가 있는 카드만 호버 효과가 적용됩니다.
- **폼 컨테이너는 호버/포커스 효과 없음**: 내부에 입력 필드, 버튼 등이 있는 큰 카드 컨테이너(예: 폼 컨테이너)는 호버/포커스 효과가 없습니다. 내부 요소들이 이미 인터랙티브하므로 카드 자체는 클릭 가능한 요소가 아닙니다.
- **여러 카드가 나열된 경우**: 카드가 여러 개 나열되어 구분이 필요한 경우에만 `.card-interactive` 클래스를 추가하여 호버 효과를 적용합니다.

**다크 모드**:
- **기본**: `border-color: var(--border-subtle)`, `background-color: var(--surface-1)`
- **호버** (`.card-interactive`만): `border-color: var(--hover-point)`

**라이트 모드**:
- **기본**: `border-color: var(--border-subtle)`, `background-color: var(--surface-1)`
- **호버** (`.card-interactive`만): `border-color: var(--hover-point)`

**⚠️ 참고**: 카드는 포커스 불가능한 요소입니다. `transform` 등 위치 이동 속성은 사용하지 않습니다.

**CSS 예시**:
```css
.card-base.card-interactive:hover {
  border-color: var(--hover-point);
}
```

---

#### 8-3. 재생 버튼 (`.play-button`)

**CSS 클래스**: `.play-button`, `.play-button-icon`

**⚠️ 중요**: 재생 버튼은 앨범 카드와 세트로 동작합니다. 카드 호버 시에도 버튼이 반응합니다.

**다크 모드**:
- **기본**: `background-color: transparent` (또는 기본 배경), `color: white` (아이콘)
- **호버** (포커스 없을 때): `background-color: var(--hover-point) !important`, `color: var(--text-on-hover) !important` (검정 아이콘)
- **포커스**: `background-color: var(--brand-pink) !important`, `color: white !important` (아이콘)
- **포커스+호버**: 포커스 색상 유지 (핫핑크 배경 + 흰색 아이콘)

**라이트 모드**:
- **기본**: `background-color: transparent` (또는 기본 배경), `color: white` (아이콘)
- **호버** (포커스 없을 때): `background-color: var(--hover-point) !important`, `color: var(--text-on-hover) !important` (베이지 아이콘)
- **포커스**: `background-color: var(--brand-pink) !important`, `color: white !important` (아이콘)
- **포커스+호버**: 포커스 색상 유지 (핫핑크 배경 + 흰색 아이콘)

**세트 개념**: 
- 앨범 카드 호버 시 재생 버튼도 함께 호버 효과 적용
- 재생 버튼 포커스 시 앨범 카드 보더가 핫핑크로 변경

**CSS 예시**:
```css
/* 카드 호버 시 재생 버튼도 호버 */
.album-card:hover .play-button:not(:focus):not(:focus-visible) {
  background-color: var(--hover-point) !important;
}

/* 재생 버튼 포커스 시 카드 보더 변경 */
.album-card:has(.play-button:focus) {
  border-color: var(--brand-pink) !important;
}
```

---

#### 8-4. 앨범 카드 (`.album-card`)

**CSS 클래스**: `.album-card`

**⚠️ 중요**: 앨범 카드는 재생 버튼과 세트로 동작합니다.

**다크 모드**:
- **기본**: `border-color: var(--border-subtle)`
- **호버** (재생 버튼 포커스 없을 때만): `border-color: var(--hover-point) !important`
- **포커스**: 재생 버튼 포커스 시 `border-color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지 (핫핑크 보더)

**라이트 모드**:
- **기본**: `border-color: var(--border-subtle)`
- **호버** (재생 버튼 포커스 없을 때만): `border-color: var(--hover-point) !important`
- **포커스**: 재생 버튼 포커스 시 `border-color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지 (핫핑크 보더)

**세트 개념**: 재생 버튼과 연동되어 동작

**CSS 예시**:
```css
/* 재생 버튼 포커스 시 카드 보더 변경 */
.album-card:has(.play-button:focus),
.album-card:has(.play-button:focus-visible) {
  border-color: var(--brand-pink) !important;
}

/* 카드 호버 (재생 버튼 포커스가 아닐 때만) */
.album-card:hover:not(:has(.play-button:focus)):not(:has(.play-button:focus-visible)) {
  border-color: var(--hover-point) !important;
}
```

---

#### 8-5. 더보기 메뉴 (`.more-menu-dropdown`)

**CSS 클래스**: `.more-menu-dropdown`, `.more-menu-dropdown .group`

**다크 모드**:
- **기본**: `background-color: transparent`, `color: inherit`
- **호버** (포커스 없을 때): `color: var(--hover-point) !important` (텍스트 + 아이콘)
- **포커스**: `color: var(--brand-pink) !important` (텍스트 + 아이콘)
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `background-color: transparent`, `color: inherit`
- **호버** (포커스 없을 때): `color: var(--hover-point) !important` (텍스트 + 아이콘)
- **포커스**: `color: var(--brand-pink) !important` (텍스트 + 아이콘)
- **포커스+호버**: 포커스 색상 유지

**세트 개념**: 텍스트와 아이콘이 모두 같은 색상으로 변경

**CSS 예시**:
```css
.more-menu-dropdown .group:hover:not(:focus):not(:focus-visible) {
  color: var(--hover-point) !important;
}

.more-menu-dropdown .group:hover:not(:focus):not(:focus-visible) svg,
.more-menu-dropdown .group:hover:not(:focus):not(:focus-visible) .lucide-icon {
  color: var(--hover-point) !important;
}

.more-menu-dropdown .group:focus,
.more-menu-dropdown .group:focus-visible {
  color: var(--brand-pink) !important;
}
```

---

#### 8-6. Toast 닫기 버튼 (`.toast-dismiss-button`)

**CSS 클래스**: `.toast-dismiss-button`

**다크 모드**:
- **기본**: `border-color: var(--border-subtle)`, `background-color: transparent`, `color: inherit`
- **호버** (포커스 없을 때): `border-color: var(--hover-point) !important`, `background-color: var(--surface-1) !important`, `color: var(--hover-point) !important`
- **포커스**: `border-color: var(--brand-pink) !important`, `background-color: var(--surface-2) !important`, `color: var(--brand-pink) !important`, `outline: none`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `border-color: var(--border-subtle)`, `background-color: transparent`, `color: inherit`
- **호버** (포커스 없을 때): `border-color: var(--hover-point) !important`, `background-color: var(--surface-1) !important`, `color: var(--hover-point) !important`
- **포커스**: `border-color: var(--brand-pink) !important`, `background-color: var(--surface-2) !important`, `color: var(--brand-pink) !important`, `outline: none`
- **포커스+호버**: 포커스 색상 유지

---

#### 8-7. 캐릭터 이미지 버튼 (`.character-image-button`)

**CSS 클래스**: `.character-image-button`

**다크 모드**:
- **기본**: `border-color: var(--border-subtle)`
- **호버** (비활성화되지 않은 경우): `border-color: var(--hover-point) !important`
- **포커스**: `border-color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지

**라이트 모드**:
- **기본**: `border-color: var(--border-subtle)`
- **호버** (비활성화되지 않은 경우): `border-color: var(--hover-point) !important`
- **포커스**: `border-color: var(--brand-pink) !important`
- **포커스+호버**: 포커스 색상 유지

**CSS 예시**:
```css
.character-image-button:hover:not(:disabled) {
  border-color: var(--hover-point) !important;
}

.character-image-button:focus,
.character-image-button:focus-visible {
  border-color: var(--brand-pink) !important;
}
```

---

### 9️⃣ 특수 영역 (Special Areas)

#### 9-0. 커스텀 스크롤바 (`.custom-list-scrollbar`)

**CSS 클래스**: `.custom-list-scrollbar`

**⚠️ 중요**: 커스텀 스크롤바는 호버/포커스 규칙과 별개로 동작하는 UI 요소입니다.

**다크 모드**:
- **기본**: `background-color: color-mix(in srgb, var(--hover-point) 30%, transparent)` (썸/막대)
- **호버**: `background-color: var(--hover-point) !important` (썸/막대)
- **트랙**: `background: transparent` (투명)

**라이트 모드**:
- **기본**: `background-color: color-mix(in srgb, var(--hover-point) 30%, transparent)` (썸/막대)
- **호버**: `background-color: var(--hover-point) !important` (썸/막대)
- **트랙**: `background: transparent` (투명)

**Firefox 지원**:
- `scrollbar-width: thin`
- `scrollbar-color: color-mix(in srgb, var(--hover-point) 30%, transparent) transparent`

**CSS 예시**:
```css
.custom-list-scrollbar::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}

.custom-list-scrollbar::-webkit-scrollbar-track {
  background: transparent !important;
}

.custom-list-scrollbar::-webkit-scrollbar-thumb {
  background-color: color-mix(in srgb, var(--hover-point) 30%, transparent) !important;
  border-radius: 4px !important;
}

.custom-list-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--hover-point) !important;
}
```

**⚠️ 참고**: 
- 스크롤바는 호버 시에만 색상이 진해집니다.
- 포커스 효과는 없습니다.
- 화살표 버튼과 코너는 완전히 제거됩니다.

---

#### 9-0-1. 필터 드롭다운 스크롤바 (`.filter-dropdown-scroll`)

**CSS 클래스**: `.filter-dropdown-scroll`

**다크 모드**:
- **트랙**: `background: var(--bg)`
- **썸/막대 기본**: `background: var(--surface-2)`
- **썸/막대 호버**: `background: var(--text-muted)`

**라이트 모드**:
- **트랙**: `background: var(--bg)`
- **썸/막대 기본**: `background: var(--text-muted)`
- **썸/막대 호버**: `background: var(--text-base)`

**Firefox 지원**:
- `scrollbar-width: thin`
- 다크 모드: `scrollbar-color: var(--surface-2) var(--bg)`
- 라이트 모드: `scrollbar-color: var(--text-muted) var(--bg)`

---

#### 9-0-2. 상태 드롭다운 스크롤바 (`.status-dropdown ul`)

**CSS 선택자**: `.status-dropdown ul`

**다크/라이트 모드 공통**:
- **트랙**: `background: transparent`
- **썸/막대 기본**: `background: var(--border-subtle)`
- **썸/막대 호버**: `background: var(--text-muted)`

**Firefox 지원**:
- `scrollbar-width: thin`
- `scrollbar-color: var(--border-subtle) transparent`

**⚠️ 참고**: 상태 드롭다운은 작은 크기(6px)의 스크롤바를 사용합니다.

---

#### 9-1. 업로드 영역 (`.upload-zone`)

**CSS 클래스**: `.upload-zone`

**기능**:
- **클릭 업로드**: 영역을 클릭하면 파일 선택 다이얼로그가 열림
- **드래그 앤 드롭**: 이미지 파일을 영역으로 끌어다 놓으면 업로드됨
- **키보드 접근성**: `tabindex="0"`으로 키보드 포커스 가능, Enter/Space로 파일 선택 다이얼로그 열기

**다크 모드**:
- **기본**: `border-color: var(--border-subtle)`, `border-style: dashed`
- **호버** (포커스 없을 때): `border-color: var(--hover-point)`, `background-color: color-mix(in srgb, var(--hover-point) 5%, transparent)`, **아이콘 색상**: `var(--hover-point)` (세트 개념)
- **드래그 중** (`data-dragging="true"`, 포커스 없을 때): 호버와 동일한 효과
- **포커스**: `border-color: var(--brand-pink) !important`, `background-color: color-mix(in srgb, var(--brand-pink) 5%, transparent) !important`, **아이콘 색상**: `var(--brand-pink) !important` (세트 개념), `outline: none`
- **포커스+호버**: 포커스 색상 유지 (보더, 배경, 아이콘 모두 핫핑크)

**라이트 모드**:
- **기본**: `border-color: var(--border-subtle)`, `border-style: dashed`
- **호버** (포커스 없을 때): `border-color: var(--hover-point)`, `background-color: color-mix(in srgb, var(--hover-point) 5%, transparent)`, **아이콘 색상**: `var(--hover-point)` (세트 개념)
- **드래그 중** (`data-dragging="true"`, 포커스 없을 때): 호버와 동일한 효과
- **포커스**: `border-color: var(--brand-pink) !important`, `background-color: color-mix(in srgb, var(--brand-pink) 5%, transparent) !important`, **아이콘 색상**: `var(--brand-pink) !important` (세트 개념), `outline: none`
- **포커스+호버**: 포커스 색상 유지 (보더, 배경, 아이콘 모두 핫핑크)

**CSS 예시**:
```css
.upload-zone:hover:not(:focus):not(:focus-visible),
.upload-zone[data-dragging="true"]:not(:focus):not(:focus-visible) {
  border-color: var(--hover-point);
  background-color: color-mix(in srgb, var(--hover-point) 5%, transparent);
}

/* 호버 시 아이콘 색상 변경 (세트 개념) */
.upload-zone:hover:not(:focus):not(:focus-visible) .lucide-icon,
.upload-zone[data-dragging="true"]:not(:focus):not(:focus-visible) .lucide-icon {
  color: var(--hover-point) !important;
}

.upload-zone:focus,
.upload-zone:focus-visible {
  border-color: var(--brand-pink) !important;
  background-color: color-mix(in srgb, var(--brand-pink) 5%, transparent) !important;
  outline: none !important;
}

/* 포커스 시 아이콘 색상 변경 (세트 개념) */
.upload-zone:focus .lucide-icon,
.upload-zone:focus-visible .lucide-icon {
  color: var(--brand-pink) !important;
}

.upload-zone:focus:hover,
.upload-zone:focus-visible:hover {
  border-color: var(--brand-pink) !important;
  background-color: color-mix(in srgb, var(--brand-pink) 5%, transparent) !important;
}

/* 포커스+호버 시 아이콘 색상 유지 (세트 개념) */
.upload-zone:focus:hover .lucide-icon,
.upload-zone:focus-visible:hover .lucide-icon {
  color: var(--brand-pink) !important;
}
```

**⚠️ 세트 개념**: 업로드 영역의 보더, 배경, 아이콘이 함께 색상이 변경됩니다. 호버 시에는 호버색(Cyan/Purple), 포커스 시에는 핫핑크로 통일됩니다.

**⚠️ 참고**: 
- 드래그 앤 드롭 기능은 JavaScript로 구현되며, `data-dragging="true"` 속성으로 드래그 중 상태를 표시합니다.
- 포커스 효과는 키보드 접근성을 위해 필수입니다.

---

#### 9-2. 데이터 테이블 (`.data-table`)

**CSS 클래스**: `.data-table`

**다크 모드**:
- **행 호버**: `background-color: color-mix(in srgb, var(--surface-2) 100%, white 5%)`
- **숫자 셀 호버** (`td[data-type="number"]`): `font-weight: 700`, `color: var(--hover-point)`

**라이트 모드**:
- **행 호버**: `background-color: color-mix(in srgb, var(--surface-1) 100%, black 3%)`
- **숫자 셀 호버** (`td[data-type="number"]`): `font-weight: 700`, `color: var(--hover-point)`

**⚠️ 참고**: 테이블 행은 포커스 불가능한 요소입니다. 숫자 셀만 호버 효과가 있습니다.

**CSS 예시**:
```css
.data-table tbody tr:hover {
  background-color: color-mix(in srgb, var(--surface-2) 100%, white 5%);
}

.data-table td[data-type="number"]:hover {
  font-weight: 700;
  color: var(--hover-point);
}
```

---

#### 9-3. 드래그 가능한 아이템 (`.draggable-item`)

**CSS 클래스**: `.draggable-item`

**다크/라이트 모드 공통**:
- **기본**: `cursor: grab`
- **활성화** (`.draggable-item:active`): `cursor: grabbing`, `border-color: var(--brand-pink)`, `box-shadow: ...`
- **드래그 중** (`data-dragging="true"`): `border-color: var(--brand-pink)`, `box-shadow: ...`
- **드롭 타겟** (`data-drop-target="true"`): `background-color: color-mix(in srgb, var(--hover-point) 10%, transparent)`

**⚠️ 참고**: 드래그 관련 상태는 호버/포커스 규칙과 별개로 동작합니다.

---

#### 9-4. 고급 검색 패널 (`.advanced-search-panel`)

**CSS 클래스**: `.advanced-search-panel`

##### 고급 검색 버튼

**다크/라이트 모드 공통**:
- **기본**: `border-color: var(--border-subtle)`
- **호버** (포커스 없을 때): `border-color: var(--hover-point) !important`, 아이콘 `color: var(--hover-point) !important`
- **포커스**: `border-color: var(--brand-pink) !important`, 아이콘 `color: var(--hover-point) !important` (⚠️ 특수: 포커스 시에도 호버색 아이콘)
- **포커스+호버**: 포커스 색상 유지

##### 고급 검색 장르 태그

**다크 모드**:
- **기본** (`aria-pressed="false"`): `border-color: var(--border-subtle)`, `background-color: var(--surface-2)`
- **호버** (포커스 없을 때, 선택 안 된 항목만): `border-color: var(--hover-point) !important`, `background-color: var(--surface-3) !important`
- **포커스** (`aria-pressed="false"`): `border-color: var(--brand-pink) !important`, `background-color: var(--surface-2) !important`, `color: var(--brand-pink) !important`
- **선택됨** (`aria-pressed="true"`): `border-color: var(--brand-pink) !important`, `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important` (호버 무시)

**라이트 모드**:
- **기본** (`aria-pressed="false"`): `border-color: var(--border-subtle)`, `background-color: var(--surface-2)`
- **호버** (포커스 없을 때, 선택 안 된 항목만): `border-color: var(--hover-point) !important`
- **포커스** (`aria-pressed="false"`): `border-color: var(--brand-pink) !important`, `background-color: var(--surface-2) !important`, `color: var(--brand-pink) !important`
- **선택됨** (`aria-pressed="true"`): `border-color: var(--brand-pink) !important`, `background-color: var(--brand-pink) !important`, `color: #FFFFFF !important` (호버 무시)

**CSS 예시**:
```css
/* 선택 안 된 항목 호버 */
.advanced-search-panel button[aria-pressed="false"]:hover:not(:focus):not(:focus-visible) {
  border-color: var(--hover-point) !important;
}

/* 선택 안 된 항목 포커스 */
.advanced-search-panel button[aria-pressed="false"]:focus,
.advanced-search-panel button[aria-pressed="false"]:focus-visible {
  border-color: var(--brand-pink) !important;
  background-color: var(--surface-2) !important;
  color: var(--brand-pink) !important;
}

/* 선택된 항목 (호버 무시) */
.advanced-search-panel button[aria-pressed="true"] {
  border-color: var(--brand-pink) !important;
  background-color: var(--brand-pink) !important;
  color: #FFFFFF !important;
}
```

---

## 세트 개념

### 정의

**같은 기능/영역의 요소들이 하나의 세트로 동작하여 동일한 효과가 적용되는 개념**

### 세트 유형

#### 1. 보더 + 아이콘 세트

**예시**: 검색창 보더 + 돋보기 아이콘

**규칙**: 보더 색상이 변경되면 아이콘 색상도 동시에 같은 색상으로 변경

**적용 영역**:
- 검색창 (`.search-container`)
- DatePicker (`.datepicker-container`)
- 필터 드롭다운 (`.filter-dropdown`)
- 정렬 드롭다운 (`.sort-dropdown`)
- 상태 드롭다운 (`.status-dropdown`)

---

#### 2. 버튼 배경 + 아이콘 + 텍스트 세트

**예시**: `+` 아이콘 + "앨범 추가" 텍스트

**규칙**: 버튼 배경에 색상이 들어간 경우 아이콘과 텍스트가 같은 색상으로 적용

**적용 영역**:
- `bg-brand-pink` 버튼 (기본 핫핑크 배경)
- `bg-hover-cyan` / `bg-hover-point` 버튼 (기본 호버색 배경)
- 페이지 헤더 프라이머리 버튼 (`.page-header-primary-button`)

**`bg-brand-pink` 버튼 상태별 색상**:
- **기본**: 핫핑크 배경 + 흰색 아이콘/텍스트
- **호버 (다크모드)**: 시안 배경 + 검정 아이콘/텍스트
- **호버 (라이트모드)**: 보라 배경 + 베이지 아이콘/텍스트
- **포커스 (모든 모드)**: 핫핑크 배경 + 흰색 아이콘/텍스트

**`bg-hover-cyan` 버튼 상태별 색상**:
- **기본 (다크모드)**: 시안 배경 + 검정 아이콘/텍스트
- **기본 (라이트모드)**: 보라 배경 + 베이지 아이콘/텍스트
- **호버 (다크모드)**: 시안 배경 + 검정 아이콘/텍스트 (기본과 동일)
- **호버 (라이트모드)**: 보라 배경 + 베이지 아이콘/텍스트 (기본과 동일)
- **포커스 (모든 모드)**: 핫핑크 배경 + 흰색 아이콘/텍스트

---

#### 3. 액션 버튼 세트

**예시**: `.action-button-text` + `.action-button-icon`

**규칙**: 텍스트와 아이콘이 같은 색상으로 변경

---

#### 4. 트랙 아이템 세트

**예시**: `.track-number` + `.track-title` + `.track-duration`

**규칙**: 모든 요소가 같은 색상으로 변경

---

#### 5. 재생 버튼 + 앨범 카드 세트

**예시**: `.play-button` + `.album-card`

**규칙**: 
- 앨범 카드 호버 시 재생 버튼도 함께 호버 효과 적용
- 재생 버튼 포커스 시 앨범 카드 보더가 핫핑크로 변경

---

#### 6. 더보기 메뉴 세트

**예시**: `.more-menu-dropdown .group` (텍스트 + 아이콘)

**규칙**: 텍스트와 아이콘이 모두 같은 색상으로 변경

---

#### 7. 취소 버튼 세트

**예시**: `.cancel-button` (텍스트 + 아이콘)

**규칙**: 텍스트와 아이콘이 모두 같은 색상으로 변경

---

## 특수 케이스

### 1. 선택된 상태 (Selected State)

**선택된 요소는 호버/포커스 효과를 무시하고 항상 선택 색상을 유지합니다.**

**적용 대상**:
- `.selected`, `data-selected="true"` (태그/칩)
- `[aria-selected="true"]` (드롭다운 옵션)
- `[class*="bg-brand-pink"]` (캘린더 선택된 날짜)
- `[aria-pressed="true"]` (고급 검색 장르 태그)

**CSS 예시**:
```css
.tag-chip.selected {
  background-color: var(--brand-pink) !important;
  color: white !important;
}

.tag-chip.selected:hover {
  background-color: var(--brand-pink) !important; /* 호버해도 선택 색상 유지 */
  color: white !important;
}
```

---

### 2. 활성화 상태 (Active State)

**활성화된 요소는 호버/포커스 효과를 무시하고 항상 활성화 색상을 유지합니다.**

**적용 대상**:
- `.active` (사이드바 메뉴)

**CSS 예시**:
```css
.sidebar-menu-item.active {
  background-color: var(--brand-pink) !important;
  color: #FFFFFF !important;
}

.sidebar-menu-item.active:hover {
  background-color: var(--brand-pink) !important; /* 호버해도 활성화 색상 유지 */
  color: #FFFFFF !important;
}
```

---

### 3. 포커스 링 (Focus Ring)

**포커스 링이 보일 때 호버 효과가 완전히 차단됩니다.**

**CSS 예시**:
```css
.element:focus:hover,
.element:focus-visible:hover {
  /* 호버 효과 완전 무시, 포커스 색상만 유지 */
  color: var(--brand-pink) !important;
}
```

---

### 4. aria-expanded 상태

**팝업이 열린 상태 (`aria-expanded="true"`)에서도 포커스 색상을 유지합니다.**

**CSS 예시**:
```css
.input-base[aria-expanded="true"] {
  border-color: var(--brand-pink) !important;
}
```

---

### 5. 텍스트 선택 (::selection)

**사용자가 텍스트를 선택할 때의 스타일입니다.**

**다크 모드**:
- **배경**: `background-color: color-mix(in srgb, var(--brand-pink) 30%, transparent)`
- **텍스트**: `color: white`

**라이트 모드**:
- **배경**: `background-color: color-mix(in srgb, var(--brand-pink) 30%, transparent)`
- **텍스트**: `color: black`

**CSS 예시**:
```css
::selection {
  background-color: color-mix(in srgb, var(--brand-pink) 30%, transparent);
  color: white;
}

[data-theme="light"] ::selection {
  background-color: color-mix(in srgb, var(--brand-pink) 30%, transparent);
  color: black;
}
```

---

### 6. 배지 (`.badge-base`)

**CSS 클래스**: `.badge-base`

**⚠️ 중요**: 배지는 호버 효과가 없는 정적 요소입니다.

**다크 모드**:
- **기본**: 배지 색상은 각 배지 타입별로 정의된 색상 변수 사용

**라이트 모드**:
- **기본**: 배지 색상은 각 배지 타입별로 정의된 색상 변수 사용

**배지 타입별 색상 변수**:
- `.badge-high-urgent`: `var(--badge-high-urgent)`
- `.badge-high-red`: `var(--badge-high-red)`
- `.badge-medium-yellow`: `var(--badge-medium-yellow)`
- `.badge-medium-lemon`: `var(--badge-medium-lemon)`
- `.badge-medium-gold`: `var(--badge-medium-gold)`
- `.badge-low-mint`: `var(--badge-low-mint)`
- `.badge-low-green`: `var(--badge-low-green)`
- `.badge-info-cyan`: `var(--badge-info-cyan)`
- `.badge-info-blue`: `var(--badge-info-blue)`
- `.badge-special-purple`: `var(--badge-special-purple)`
- `.badge-special-violet`: `var(--badge-special-violet)`
- `.badge-cute-pink`: `var(--badge-cute-pink)`

**⚠️ 참고**: 배지 색상은 모드별로 다르게 정의되어 있으며, 호버/포커스 효과는 없습니다.

---

## 검증 체크리스트

모든 호버/포커스 효과가 올바르게 적용되었는지 확인:

### 기본 규칙 검증

- [ ] 모든 호버 효과에 `:not(:focus):not(:focus-visible)` 조건이 있는가?
- [ ] 포커스 효과가 호버 효과보다 우선순위를 가지는가?
- [ ] 포커스 상태에서 호버해도 포커스 색상이 유지되는가?
- [ ] 활성화/선택된 상태에서 호버/포커스 효과가 무시되는가?
- [ ] 다크 모드와 라이트 모드 모두 올바른 색상이 적용되는가?

### 세트 개념 검증

- [ ] 보더와 아이콘이 세트로 동작하는가? (검색창, DatePicker, 드롭다운)
- [ ] 버튼 배경에 색상이 들어간 경우 아이콘+텍스트가 같은 색상으로 적용되는가?
- [ ] 같은 기능/영역의 요소들이 모두 동일한 효과가 적용되는가?

### 아이콘 검증

- [ ] 호버/포커스 기능만 사용되는 아이콘의 배경색이 항상 투명한가?
- [ ] 아이콘 색상이 올바르게 변경되는가?

### 색상 검증

- [ ] 다크 모드 호버: 시안 (`#17E1BC`) + 검정 (`#000000`)
- [ ] 라이트 모드 호버: 보라 (`#8A2BE2`) + 베이지 (`#F3EBDD`)
- [ ] 포커스 (모든 모드): 핫핑크 (`#FF3DAE`) + 흰색 (`#FFFFFF`)

### 제약사항 검증

- [ ] 사이드바가 글로벌 디자인 시스템을 따르지 않고 기존 스타일을 유지하는가?
- [ ] 헤더의 레이아웃은 유지되고 내부 검색창과 버튼만 글로벌 규칙을 따르는가?
- [ ] 중복 코드가 없는가? (공통 부분은 같은 코드/이름 사용)
- [ ] 두꺼운 라인효과나 다른색의 효과가 사용되지 않았는가?

---

## 📝 수정 필요 사항

### ✅ 수정 완료

**`var(--text-on-hover)` 변수가 라이트 모드에서 올바른 값(`#F3EBDD`)으로 수정되었습니다.**

이제 `var(--text-on-hover)`를 사용하는 모든 부분이 올바르게 작동합니다.

**수정된 위치**: `src/app.css` 94줄
- **이전**: `--text-on-hover: #FFFFFF;` (잘못된 값)
- **수정**: `--text-on-hover: #F3EBDD;` (올바른 값)

---

## 📚 참고 문서

이 문서는 다음 문서들의 내용을 통합한 완전한 스타일 가이드입니다:

- ~~`HOVER_FOCUS_EFFECTS_GUIDE.md`~~ (통합됨)
- ~~`STYLE_GUIDE.md`~~ (통합됨)
- ~~`BUTTON_STYLE_ANALYSIS.md`~~ (통합됨)

**이제 이 문서 하나만 참조하시면 됩니다.**

---

**마지막 업데이트**: 2025-12-21

**최종 업데이트**: 누락된 17개 컴포넌트 추가 완료
- 태그/칩, 카드, 재생 버튼, 앨범 카드, 트랙 토글 버튼, 더보기 메뉴, Toast 닫기 버튼
- 업로드 영역, 취소 버튼, 캐릭터 이미지 버튼, 데이터 테이블, 드래그 가능한 아이템
- 검색 초기화 버튼, 장르 초기화 버튼, 장르 드롭다운 아이템, 재시도 버튼, 고급 검색 패널
- 사이드바/헤더 예외 사항 명시

