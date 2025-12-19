# 새 앨범 만들기 페이지 레이아웃 스펙

**파일 위치:** `src/routes/albums/new/+page.svelte`  
**작성일:** 2025-01-27  
**목적:** 레이아웃과 스타일링의 정확한 재현을 위한 상세 스펙

---

## 📐 전체 레이아웃 구조

### 컨테이너 구조
```svelte
<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
  <form>
    <!-- 좌우 배치 컨테이너 -->
    <div class="flex flex-col lg:flex-row gap-10 p-6">
      <!-- [좌측] 이미지 업로드 영역 -->
      <div class="w-full lg:w-80 flex-shrink-0">...</div>
      
      <!-- [우측] 입력 필드 영역 -->
      <div class="flex-1 space-y-4">...</div>
    </div>
    
    <!-- 발매일 정보 섹션 -->
    <div class="border-t border-border-subtle">
      <div class="p-6 space-y-4">...</div>
    </div>
    
    <!-- 액션 버튼 -->
    <div class="border-t border-border-subtle p-6">...</div>
  </form>
</div>
```

---

## 🎯 입력 필드 상세 스펙

### 공통 규칙
- **모든 입력 필드 높이:** `h-10` (40px)
- **모든 입력 필드 배경:** `bg-surface-2`
- **모든 입력 필드 테두리:** `border border-border-subtle rounded-lg`
- **모든 입력 필드 텍스트:** `text-base text-text-base`
- **모든 입력 필드 플레이스홀더:** `placeholder:text-text-muted`
- **모든 입력 필드 호버:** `hover:border-[var(--hover-cyan)]`
- **모든 입력 필드 포커스:** `focus:outline-none focus:border-brand-pink focus:ring-0`
- **모든 입력 필드 트랜지션:** `transition-colors duration-200`

---

## 1️⃣ 앨범 제목 (Title) 입력 필드

### 위치
- **파일:** `src/routes/albums/new/+page.svelte`
- **라인:** 340-362

### 구조
```svelte
<div class="relative">
  <input
    type="text"
    class="w-full h-10 px-4 {formData.title.trim() ? 'pr-10' : 'pr-4'} bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base placeholder:text-text-muted hover:border-[var(--hover-cyan)] focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
  />
  {#if formData.title.trim()}
    <button class="btn-icon absolute inset-y-0 right-2.5 flex items-center pointer-events-auto">
      <X size={16} class="lucide-icon text-text-muted" />
    </button>
  {/if}
</div>
```

### 정확한 스펙
- **높이:** `h-10` (40px)
- **좌측 패딩:** `px-4` (16px)
- **우측 패딩 (값 없을 때):** `pr-4` (16px)
- **우측 패딩 (값 있을 때):** `pr-10` (40px) - X 버튼 공간 확보
- **X 버튼 위치:** `right-2.5` (10px from right)
- **X 버튼 크기:** `size={16}` (16px)
- **X 버튼 클래스:** `btn-icon` (디자인 시스템 클래스)

### 중요 사항
- X 버튼은 **값이 있을 때만** 표시됨
- X 버튼이 없을 때는 우측 패딩이 `pr-4`로 줄어듦
- X 버튼 위치는 `right-2.5`로 **오른쪽 끝에 붙음** (드롭다운 아이콘 없음)

---

## 2️⃣ 아티스트 (Artist) 선택 필드

### 위치
- **파일:** `src/lib/components/ArtistSelect.svelte`
- **사용:** `src/routes/albums/new/+page.svelte` 라인 370-376

### 구조
```svelte
<div class="relative artist-select-dropdown w-full">
  <div class="relative">
    <!-- 왼쪽 아이콘 (User) -->
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
      <User size={16} class="lucide-icon text-text-muted" />
    </div>
    
    <!-- 입력 필드 -->
    <input
      class="w-full h-10 pl-10 {inputValue.trim() ? 'pr-[2.625rem]' : 'pr-[2.625rem]'} bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base placeholder:text-text-muted hover:border-[var(--hover-cyan)] focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
    />
    
    <!-- X 버튼 (값이 있을 때) -->
    {#if inputValue.trim()}
      <button class="btn-icon absolute inset-y-0 right-[2.625rem] flex items-center pointer-events-auto">
        <X size={16} class="lucide-icon text-text-muted" />
      </button>
    {/if}
    
    <!-- 드롭다운 버튼 (항상 표시) -->
    <button class="btn-icon absolute inset-y-0 right-2.5 flex items-center pointer-events-auto">
      <ChevronDown size={16} class="lucide-icon text-text-muted" />
    </button>
  </div>
</div>
```

### 정확한 스펙
- **높이:** `h-10` (40px)
- **좌측 패딩:** `pl-10` (40px) - User 아이콘 공간
- **우측 패딩:** `pr-[2.625rem]` (42px) - 항상 고정 (X 버튼 + 드롭다운 아이콘 공간)
- **User 아이콘 위치:** `left-0 pl-3` (왼쪽에서 12px)
- **User 아이콘 크기:** `size={16}` (16px)
- **X 버튼 위치:** `right-[2.625rem]` (42px from right) - 드롭다운 아이콘 왼쪽
- **X 버튼 크기:** `size={16}` (16px)
- **드롭다운 아이콘 위치:** `right-2.5` (10px from right) - 오른쪽 끝
- **드롭다운 아이콘 크기:** `size={16}` (16px)

### 중요 사항
- X 버튼과 드롭다운 아이콘이 **동시에 존재**할 수 있음
- X 버튼은 값이 있을 때만 표시
- 드롭다운 아이콘은 항상 표시
- 우측 패딩은 항상 `pr-[2.625rem]`로 고정 (아이콘 2개 공간 확보)

---

## 3️⃣ 장르 (Genres) 선택 필드

### 위치
- **파일:** `src/routes/albums/new/+page.svelte`
- **라인:** 385-452

### 구조
```svelte
<div class="relative w-full genre-dropdown">
  <div
    class="w-full min-h-10 px-4 pr-[2.625rem] py-2 bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base transition-colors duration-200 flex flex-wrap gap-2 items-center cursor-pointer hover:border-[var(--hover-cyan)] hover:text-[var(--hover-cyan)] focus-within:border-brand-pink focus-within:text-brand-pink focus-within:outline-none focus-within:ring-0"
  >
    <!-- 태그 칩들 -->
    {#each formData.genres as genre}
      <span class="tag-chip">
        {genre}
        <button class="btn-icon ml-1 focus:outline-none">
          <X size={12} />
        </button>
      </span>
    {/each}
  </div>
  
  <!-- 드롭다운 아이콘 -->
  <div class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
    <ChevronDownIcon size={16} class="lucide-icon text-text-muted" />
  </div>
</div>
```

### 정확한 스펙
- **최소 높이:** `min-h-10` (40px) - 태그가 많으면 자동 확장
- **좌측 패딩:** `px-4` (16px)
- **우측 패딩:** `pr-[2.625rem]` (42px) - 드롭다운 아이콘 공간
- **상하 패딩:** `py-2` (8px) - 태그와의 간격
- **드롭다운 아이콘 위치:** `right-2.5` (10px from right)
- **드롭다운 아이콘 크기:** `size={16}` (16px)
- **태그 내부 X 버튼 크기:** `size={12}` (12px) - 작은 크기

### 중요 사항
- `min-h-10` 사용으로 태그가 많아도 높이 자동 확장
- 드롭다운 아이콘은 `pointer-events-none`으로 클릭 불가 (컨테이너 클릭으로 동작)
- 태그 내부 X 버튼은 `size={12}`로 작게 표시

---

## 4️⃣ 상태 (Status) 선택 필드

### 위치
- **파일:** `src/routes/albums/new/+page.svelte`
- **라인:** 460-507

### 구조
```svelte
<div class="relative w-full status-dropdown">
  <button
    type="button"
    class="w-full h-10 px-4 pr-[2.625rem] bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base text-left hover:border-[var(--hover-cyan)] focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
  >
    <span class="block truncate">{statusLabel}</span>
  </button>
  
  <!-- 드롭다운 아이콘 -->
  <div class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
    <ChevronDownIcon size={16} class="lucide-icon text-text-muted" />
  </div>
</div>
```

### 정확한 스펙
- **높이:** `h-10` (40px)
- **좌측 패딩:** `px-4` (16px)
- **우측 패딩:** `pr-[2.625rem]` (42px) - 드롭다운 아이콘 공간
- **드롭다운 아이콘 위치:** `right-2.5` (10px from right)
- **드롭다운 아이콘 크기:** `size={16}` (16px)
- **텍스트 정렬:** `text-left` (왼쪽 정렬)

### 중요 사항
- 버튼 타입이므로 X 버튼 없음
- 드롭다운 아이콘만 존재
- 우측 패딩은 `pr-[2.625rem]`로 고정

---

## 5️⃣ 날짜 선택 (DatePicker) 필드

### 위치
- **파일:** `src/lib/components/DatePicker.svelte`
- **사용:** `src/routes/albums/new/+page.svelte` 라인 522, 528

### 구조
```svelte
<div class="relative w-full">
  <input
    type="text"
    class="w-full h-10 px-4 {inputValue.trim() ? 'pr-[4.5rem]' : 'pr-[2.625rem]'} bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base placeholder:text-text-muted hover:border-[var(--hover-cyan)] focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200 cursor-pointer box-border datepicker-input"
  />
  
  <!-- X 버튼 (값이 있을 때) -->
  {#if inputValue.trim()}
    <button class="btn-icon absolute inset-y-0 right-[2.625rem] flex items-center pointer-events-auto">
      <X size={16} class="lucide-icon text-text-muted" />
    </button>
  {/if}
  
  <!-- 캘린더 아이콘 (항상 표시) -->
  <button class="btn-icon absolute inset-y-0 right-2.5 flex items-center pointer-events-auto">
    <Calendar size={16} class="lucide-icon text-text-muted" />
  </button>
</div>
```

### 정확한 스펙
- **높이:** `h-10` (40px)
- **좌측 패딩:** `px-4` (16px)
- **우측 패딩 (값 없을 때):** `pr-[2.625rem]` (42px) - 캘린더 아이콘만
- **우측 패딩 (값 있을 때):** `pr-[4.5rem]` (72px) - X 버튼 + 캘린더 아이콘
- **X 버튼 위치:** `right-[2.625rem]` (42px from right) - 캘린더 아이콘 왼쪽
- **X 버튼 크기:** `size={16}` (16px)
- **캘린더 아이콘 위치:** `right-2.5` (10px from right) - 오른쪽 끝
- **캘린더 아이콘 크기:** `size={16}` (16px)

### 중요 사항
- X 버튼과 캘린더 아이콘이 **동시에 존재**할 수 있음
- X 버튼은 값이 있을 때만 표시
- 캘린더 아이콘은 항상 표시
- 우측 패딩은 값 유무에 따라 동적으로 변경:
  - 값 없음: `pr-[2.625rem]` (캘린더 아이콘만)
  - 값 있음: `pr-[4.5rem]` (X 버튼 + 캘린더 아이콘)

---

## 📊 입력 필드 비교표

| 필드 | 높이 | 좌측 패딩 | 우측 패딩 (값 없음) | 우측 패딩 (값 있음) | 아이콘 위치 |
|------|------|-----------|---------------------|---------------------|-------------|
| **앨범 제목** | `h-10` | `px-4` | `pr-4` | `pr-10` | X: `right-2.5` |
| **아티스트** | `h-10` | `pl-10` | `pr-[2.625rem]` | `pr-[2.625rem]` | User: `left-0 pl-3`<br>X: `right-[2.625rem]`<br>▼: `right-2.5` |
| **장르** | `min-h-10` | `px-4` | `pr-[2.625rem]` | `pr-[2.625rem]` | ▼: `right-2.5` |
| **상태** | `h-10` | `px-4` | `pr-[2.625rem]` | `pr-[2.625rem]` | ▼: `right-2.5` |
| **날짜 선택** | `h-10` | `px-4` | `pr-[2.625rem]` | `pr-[4.5rem]` | X: `right-[2.625rem]`<br>📅: `right-2.5` |

---

## 🎨 아이콘 위치 규칙

### 오른쪽 끝 아이콘 (`right-2.5`)
- **앨범 제목:** X 버튼 (값 있을 때만)
- **아티스트:** 드롭다운 아이콘 (항상)
- **장르:** 드롭다운 아이콘 (항상)
- **상태:** 드롭다운 아이콘 (항상)
- **날짜 선택:** 캘린더 아이콘 (항상)

### 오른쪽 두 번째 아이콘 (`right-[2.625rem]`)
- **아티스트:** X 버튼 (값 있을 때만)
- **날짜 선택:** X 버튼 (값 있을 때만)

### 왼쪽 아이콘 (`left-0 pl-3`)
- **아티스트:** User 아이콘 (항상)

---

## ⚠️ 중요 주의사항

### 1. 우측 패딩 계산
- **아이콘 1개:** `pr-[2.625rem]` (42px) 또는 `pr-10` (40px)
- **아이콘 2개:** `pr-[4.5rem]` (72px)
- **아이콘 없음:** `pr-4` (16px)

### 2. 아이콘 간격
- X 버튼과 드롭다운/캘린더 아이콘 사이 간격: **32px** (`2.625rem - 2.5 = 42px - 10px`)
- 아이콘 크기: **16px**
- 아이콘 컨테이너: **24px** (아이콘 16px + 양쪽 여백 4px씩)

### 3. 동적 패딩 변경
- **앨범 제목:** 값 유무에 따라 `pr-4` ↔ `pr-10` 변경
- **날짜 선택:** 값 유무에 따라 `pr-[2.625rem]` ↔ `pr-[4.5rem]` 변경
- **아티스트:** 항상 `pr-[2.625rem]` 고정 (아이콘 2개 공간 확보)

### 4. 높이 통일
- 모든 입력 필드는 `h-10` (40px)로 통일
- **예외:** 장르 필드는 `min-h-10` (태그가 많으면 자동 확장)

### 5. 클래스 적용 순서
- 기본 스타일 → 조건부 패딩 → 아이콘 버튼 순서로 적용
- `btn-icon` 클래스는 디자인 시스템 클래스 (호버/포커스 스타일 자동 적용)

---

## 🔧 수정 시 체크리스트

### 앨범 제목 필드 수정 시
- [ ] 높이 `h-10` 유지
- [ ] 값 없을 때 `pr-4`, 값 있을 때 `pr-10` 확인
- [ ] X 버튼 위치 `right-2.5` 확인
- [ ] X 버튼은 값 있을 때만 표시

### 아티스트 필드 수정 시
- [ ] 높이 `h-10` 유지
- [ ] 좌측 패딩 `pl-10` (User 아이콘 공간)
- [ ] 우측 패딩 항상 `pr-[2.625rem]` 고정
- [ ] User 아이콘 `left-0 pl-3`
- [ ] X 버튼 `right-[2.625rem]` (값 있을 때만)
- [ ] 드롭다운 아이콘 `right-2.5` (항상)

### 장르 필드 수정 시
- [ ] 최소 높이 `min-h-10` (자동 확장 가능)
- [ ] 우측 패딩 `pr-[2.625rem]` 고정
- [ ] 드롭다운 아이콘 `right-2.5` (항상)
- [ ] 태그 내부 X 버튼 `size={12}` (작은 크기)

### 상태 필드 수정 시
- [ ] 높이 `h-10` 유지
- [ ] 우측 패딩 `pr-[2.625rem]` 고정
- [ ] 드롭다운 아이콘 `right-2.5` (항상)
- [ ] 텍스트 정렬 `text-left`

### 날짜 선택 필드 수정 시
- [ ] 높이 `h-10` 유지
- [ ] 값 없을 때 `pr-[2.625rem]`, 값 있을 때 `pr-[4.5rem]` 확인
- [ ] X 버튼 `right-[2.625rem]` (값 있을 때만)
- [ ] 캘린더 아이콘 `right-2.5` (항상)

---

## 📝 참고 파일

1. **새 앨범 만들기 페이지:** `src/routes/albums/new/+page.svelte`
2. **아티스트 선택 컴포넌트:** `src/lib/components/ArtistSelect.svelte`
3. **날짜 선택 컴포넌트:** `src/lib/components/DatePicker.svelte`
4. **디자인 시스템 CSS:** `src/app.css` (`.btn-icon`, `.tag-chip` 등)

---

## ✅ 검증 방법

### 시각적 검증
1. 모든 입력 필드의 높이가 동일한지 확인
2. 아이콘들이 정확한 위치에 있는지 확인
3. 값 입력/삭제 시 패딩이 올바르게 변경되는지 확인
4. 반응형 레이아웃에서도 정렬이 유지되는지 확인

### 코드 검증
1. 모든 입력 필드에 `h-10` 클래스 적용 확인
2. 우측 패딩 값이 스펙과 일치하는지 확인
3. 아이콘 위치 값이 스펙과 일치하는지 확인
4. 조건부 패딩 로직이 올바른지 확인

---

**이 문서는 새 앨범 만들기 페이지의 레이아웃과 스타일링을 정확히 재현하기 위한 참조 문서입니다. 수정 시 반드시 이 스펙을 따르세요.**

