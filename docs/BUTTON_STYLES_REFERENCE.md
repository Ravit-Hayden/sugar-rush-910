# 버튼 스타일 레퍼런스 (다크/라이트 모드)

`app.css`에 정의된 버튼 클래스별 **상태(기본 / 호버 / 포커스 / 포커스+호버)**와 **다크/라이트 모드 색상**을 정리한 문서입니다.

---

## 배치·크기 규칙 (디자인 규칙)

**같은 줄에 나란히 오는 버튼은 서로 같은 크기로 맞춘다.**  
예: 제외 스타일 행의 "초기화"와 "복사"처럼 한 줄에 들어가는 버튼은 가능하면 기존에 있던 버튼과 동일한 패딩·글자 크기(`px-2 py-1 sm:px-3 sm:py-1.5`, `text-xs sm:text-sm`, `rounded-md`)를 사용해 **시각적 균형**을 맞춘다.

**표시 전용 요소(배지·라벨 등 링크/버튼이 아닌 것)에는 호버·포커스·transition 등 인터랙션 스타일을 넣지 않는다.** 클릭/포커스 기능이 없으면 `cursor-default`, 필요 시 `pointer-events-none`으로 시각적 반응을 막는다.

**보더는 양쪽에 패딩 없이 무조건 이어져야 한다.** 카드/패널 내부에서 구분선(`border-t` 등)을 쓸 때는 상위 패딩을 상쇄한 뒤 내용만 다시 패딩한다. 예: 카드 `p-5`일 때 하단 구분 영역은 `-mx-5 px-5 pt-3 border-t border-border-subtle`.

---

## 공통 테마 변수

| 변수 | 다크 모드 (`:root`) | 라이트 모드 (`[data-theme="light"]`) |
|------|---------------------|--------------------------------------|
| `--brand-pink` | `#FF3DAE` | `#FF3DAE` (동일) |
| `--hover-point` | `#17E1BC` (시안) | `#8A2BE2` (퍼플) |
| `--text-on-hover` | `#000000` (검정) | `#F3EBDD` (베이지) |
| `--text-base` | `#888888` | `#8B7355` |
| `--text-muted` | `#6F6F6F` | `#5C4F3F` |
| `--border-subtle` | `#252528` | `#B8A896` |
| `--surface-1` | `#1A1A1A` | `#FFF8EF` |

**규칙:** 호버는 포커스가 없을 때만 적용되고, **포커스가 있으면 항상 brand-pink(포커스 색) 우선**입니다.

---

## 1. Primary 버튼 (메인 CTA)

**클래스:** `page-header-primary-button`  
**용도:** 페이지 헤더 메인 액션 (예: "워드 추가", "수익·지출에 반영하기")

### 다크 모드

| 상태 | 배경 | 텍스트/아이콘 | 테두리 |
|------|------|----------------|--------|
| **기본** | `#FF3DAE` (brand-pink) | `#FFFFFF` | `transparent` |
| **호버** (포커스 없을 때) | `#17E1BC` (hover-point) | `#000000` (text-on-hover) | `#17E1BC` |
| **포커스** | `#FF3DAE` (brand-pink) | `#FFFFFF` | `transparent` |
| **포커스+호버** | `#FF3DAE` (brand-pink) | `#FFFFFF` | `transparent` |

### 라이트 모드

| 상태 | 배경 | 텍스트/아이콘 | 테두리 |
|------|------|----------------|--------|
| **기본** | `#FF3DAE` (brand-pink) | `#FFFFFF` | `transparent` |
| **호버** (포커스 없을 때) | `#8A2BE2` (hover-point) | `#F3EBDD` (text-on-hover) | `#8A2BE2` |
| **포커스** | `#FF3DAE` (brand-pink) | `#FFFFFF` | `transparent` |
| **포커스+호버** | `#FF3DAE` (brand-pink) | `#FFFFFF` | `transparent` |

**요약:** 기본/포커스는 항상 핑크+흰색. 호버만 다크=시안+검정, 라이트=퍼플+베이지.

---

## 2. Outline 버튼 (보조 액션)

**클래스:** `btn-outline-hover` (+ 마크업에서 `border border-border-subtle`, `text-text-base` 등)  
**용도:** 취소, 랜덤 조합, 필터/보조 버튼. **배경은 모든 상태에서 투명.**

### 다크 모드

| 상태 | 배경 | 텍스트/아이콘 | 테두리 |
|------|------|----------------|--------|
| **기본** | `transparent` | 마크업 (예: `--text-base` #888) | 마크업 (예: `--border-subtle` #252528) |
| **호버** (포커스 없을 때) | `transparent` | `#17E1BC` (hover-point) | `#17E1BC` |
| **포커스** | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |
| **포커스+호버** | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |

### 라이트 모드

| 상태 | 배경 | 텍스트/아이콘 | 테두리 |
|------|------|----------------|--------|
| **기본** | `transparent` | 마크업 (예: `--text-base` #8B7355) | 마크업 (예: `--border-subtle` #B8A896) |
| **호버** (포커스 없을 때) | `transparent` | `#8A2BE2` (hover-point) | `#8A2BE2` |
| **포커스** | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |
| **포커스+호버** | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |

**요약:** 배경은 항상 투명. 호버 시 보더/텍스트/아이콘만 다크=시안, 라이트=퍼플. 포커스 시 항상 핑크.

---

## 2-2. 핑크 아웃라인 버튼 (새 타입)

**클래스:** `btn-outline-pink` 또는 `border-brand-pink text-brand-pink`  
**용도:** 멘션, 작업, 랜덤 조합 등 강조 보조 액션. **기본이 브랜드 핑크 테두리/텍스트, 배경은 모든 상태에서 투명.**

### 다크 모드

| 상태 | 배경 | 텍스트/아이콘 | 테두리 |
|------|------|----------------|--------|
| **기본** | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |
| **호버** (포커스 없을 때) | `transparent` | `#17E1BC` (hover-point) | `#17E1BC` |
| **포커스** | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |
| **포커스+호버** | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |

### 라이트 모드

| 상태 | 배경 | 텍스트/아이콘 | 테두리 |
|------|------|----------------|--------|
| **기본** | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |
| **호버** (포커스 없을 때) | `transparent` | `#8A2BE2` (hover-point) | `#8A2BE2` |
| **포커스** | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |
| **포커스+호버** | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |

**요약:** 기존 Outline(neutral)과 동일하게 배경은 항상 투명. 기본이 핑크 테두리/텍스트, 호버 시 다크=시안/라이트=퍼플, 포커스 시 핑크.

---

## 3. 아이콘 버튼

**클래스:** `btn-icon`  
**용도:** 닫기(X), 수정/삭제 아이콘, 설정 톱니 등. **배경은 항상 투명.**

### 다크 모드

| 상태 | 배경 | 텍스트/아이콘 (및 내부 `.lucide-icon`) |
|------|------|----------------------------------------|
| **기본** | `transparent` | `#6F6F6F` (text-muted) |
| **호버** (포커스 없을 때) | `transparent` | `#17E1BC` (hover-point) |
| **포커스** | `transparent` | `#FF3DAE` (brand-pink) |
| **포커스+호버** | `transparent` | `#FF3DAE` (brand-pink) |

### 라이트 모드

| 상태 | 배경 | 텍스트/아이콘 (및 내부 `.lucide-icon`) |
|------|------|----------------------------------------|
| **기본** | `transparent` | `#5C4F3F` (text-muted) |
| **호버** (포커스 없을 때) | `transparent` | `#8A2BE2` (hover-point) |
| **포커스** | `transparent` | `#FF3DAE` (brand-pink) |
| **포커스+호버** | `transparent` | `#FF3DAE` (brand-pink) |

**요약:** 라이트 모드에서도 `.btn-icon` 배경은 명시적으로 `transparent` 유지. 색만 테마 변수로 바뀜.

---

## 4. 편집 버튼 (테두리만 → 포커스 시 채움)

**클래스:** `page-header-edit-button`  
**용도:** 헤더 보조 액션 (예: "편집"). **기본은 CSS에서 정의하지 않음** → 마크업에서 `border`, `color` 지정.

### 다크 모드

| 상태 | 배경 | 텍스트/아이콘 | 테두리 |
|------|------|----------------|--------|
| **기본** | 마크업 (보통 `transparent`) | 마크업 (예: text-text-base) | 마크업 (예: border-subtle) |
| **호버** (포커스 없을 때) | 변경 없음 | `#17E1BC` (hover-point) | `#17E1BC` |
| **포커스** | `#FF3DAE` (brand-pink) | `#FFFFFF` | `#FF3DAE` |
| **포커스+호버** | `#FF3DAE` (brand-pink) | `#FFFFFF` | `#FF3DAE` |

### 라이트 모드

| 상태 | 배경 | 텍스트/아이콘 | 테두리 |
|------|------|----------------|--------|
| **기본** | 마크업 | 마크업 | 마크업 |
| **호버** (포커스 없을 때) | 변경 없음 | `#8A2BE2` (hover-point) | `#8A2BE2` |
| **포커스** | `#FF3DAE` (brand-pink) | `#FFFFFF` | `#FF3DAE` |
| **포커스+호버** | `#FF3DAE` (brand-pink) | `#FFFFFF` | `#FF3DAE` |

**요약:** 호버는 테두리+텍스트/아이콘만 hover-point로. 포커스 시 채움(brand-pink + 흰색).

---

## 5. Retry 버튼 (재시도)

**클래스:** `btn-retry`  
**용도:** FailuresCard 등 재시도용 작은 캡슐 버튼. **테마별 오버라이드 없음** → 변수만 다크/라이트로 바뀜.

### 다크 모드

| 상태 | 배경 | 텍스트 |
|------|------|--------|
| **기본** | `#FF3DAE` (brand-pink) | `#FEFDF6` (고정) |
| **호버** | `#17E1BC` (hover-point) | `#000000` (text-on-hover) |

### 라이트 모드

| 상태 | 배경 | 텍스트 |
|------|------|--------|
| **기본** | `#FF3DAE` (brand-pink) | `#FEFDF6` (고정) |
| **호버** | `#8A2BE2` (hover-point) | `#F3EBDD` (text-on-hover) |

**요약:** 기본은 항상 핑크+크림색. 호버 시 다크=시안+검정, 라이트=퍼플+베이지.

---

## 6. 활성 Outline 버튼 (border + text brand-pink)

**클래스:** `border-brand-pink text-brand-pink` (필요 시 `bg-brand-pink/10` 등)  
**용도:** 이미 선택된 필터/토글처럼 “활성” 상태의 아웃라인 버튼. **배경은 모든 상태에서 투명** (bg-brand-pink/10이 있어도 hover/focus 시 배경 규칙으로 투명 유지).

### 다크 모드

| 상태 | 배경 | 텍스트/아이콘 | 테두리 |
|------|------|----------------|--------|
| **기본** (border+text pink) | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |
| **호버** (bg-brand-pink 없을 때) | `transparent` | `#17E1BC` (hover-point) | `#17E1BC` |
| **호버** (bg-brand-pink/10 있을 때) | `transparent` | `#FF3DAE` 유지 | `#FF3DAE` 유지 |
| **포커스** | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |
| **포커스+호버** | `transparent` | `#FF3DAE` | `#FF3DAE` |

### 라이트 모드

| 상태 | 배경 | 텍스트/아이콘 | 테두리 |
|------|------|----------------|--------|
| **기본** | `transparent` | `#FF3DAE` | `#FF3DAE` |
| **호버** (bg 없을 때) | `transparent` | `#8A2BE2` (hover-point) | `#8A2BE2` |
| **호버** (bg-brand-pink/10 있을 때) | `transparent` | `#FF3DAE` 유지 | `#FF3DAE` 유지 |
| **포커스** | `transparent` | `#FF3DAE` | `#FF3DAE` |
| **포커스+호버** | `transparent` | `#FF3DAE` | `#FF3DAE` |

**요약:** 활성 아웃라인은 기본이 핑크. 호버 시 hover-point로만 바뀌고, bg-brand-pink/10이 있으면 호버에서 색 유지. 포커스는 항상 핑크.

---

## 7. 텍스트 링크 (버튼 아님, 참고)

**클래스:** `text-link`  
**용도:** 밑줄 텍스트 링크. 버튼과 동일한 호버/포커스 규칙(호버=hover-point, 포커스=brand-pink).

### 다크 모드

| 상태 | 색 |
|------|-----|
| **기본** | `#888888` (text-base) |
| **호버** | `#17E1BC` (hover-point), 밑줄 |
| **포커스** | `#FF3DAE` (brand-pink), 밑줄 |

### 라이트 모드

| 상태 | 색 |
|------|-----|
| **기본** | `#8B7355` (text-base) |
| **호버** | `#8A2BE2` (hover-point), 밑줄 |
| **포커스** | `#FF3DAE` (brand-pink), 밑줄 |

---

## 8. 보더+텍스트 핑크 링크 (a 태그)

**선택자:** `a.border-brand-pink.text-brand-pink` (또는 `[class*="border-brand-pink"][class*="text-brand-pink"]`)  
**용도:** TasksCard 등 보더만 있는 핑크 링크. **배경 항상 투명.**

### 다크 모드

| 상태 | 배경 | 텍스트/아이콘 | 테두리 |
|------|------|----------------|--------|
| **기본** | 마크업 | `#FF3DAE` | `#FF3DAE` |
| **호버** | `transparent` | `#17E1BC` (hover-point) | `#17E1BC` |
| **포커스** | `transparent` | `#FF3DAE` (brand-pink) | `#FF3DAE` |
| **포커스+호버** | `transparent` | `#FF3DAE` | `#FF3DAE` |

### 라이트 모드

동일(테마 변수만 라이트 값으로 적용 → 호버 시 `--hover-point` = `#8A2BE2`).

---

## 요약 표 (한눈에 보기)

| 버튼/요소 | 기본 (다크/라이트) | 호버 (다크/라이트) | 포커스 (공통) |
|------------|---------------------|---------------------|----------------|
| **Primary** | 배경 핑크, 흰색 텍스트 | 다크: 시안+검정 / 라이트: 퍼플+베이지 | 핑크+흰색 |
| **Outline** | 투명, 보더/텍스트 마크업 | 보더/텍스트: 다크 시안 / 라이트 퍼플 | 보더/텍스트 핑크 |
| **Icon** | 투명, muted 텍스트 | 텍스트: 다크 시안 / 라이트 퍼플 | 텍스트 핑크 |
| **Edit** | 마크업(테두리 등) | 테두리/텍스트: hover-point | 채움 핑크+흰색 |
| **Retry** | 핑크+크림 | 다크: 시안+검정 / 라이트: 퍼플+베이지 | (호버만 정의) |
| **활성 Outline** | 핑크 보더+텍스트 | hover-point (bg 없을 때) / 유지 (bg 있을 때) | 핑크 유지 |
| **text-link** | text-base | hover-point + 밑줄 | brand-pink + 밑줄 |

이 문서는 `src/app.css`의 현재 정의를 기준으로 작성되었습니다. 클래스명이나 변수 값을 바꾸면 이 레퍼런스도 함께 수정하는 것을 권장합니다.
