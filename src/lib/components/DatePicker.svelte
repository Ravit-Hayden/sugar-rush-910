<script lang="ts">
  import { fade } from 'svelte/transition';
  import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-svelte';
  import { getHolidayName } from '$lib/utils/holidays';

  // [중요] 외부에서 들어오는 모든 속성(id, name, required, disabled 등)을 받음
  let {
    value = $bindable(''),
    placeholder = 'YYYY. MM. DD.',
    id = undefined,
    name = undefined,
    class: className = '',
    align = 'right', // 캘린더 정렬: 'left' | 'right'
    ...restProps
  } = $props();
  
  let isOpen = $state(false);
  let viewDate = $state(new Date());
  let wrapperElement: HTMLDivElement | undefined;
  let inputValue = $state(''); // 직접 입력값
  let instanceId = $state(Math.random().toString(36).substring(7)); // 고유 인스턴스 ID
  let yearMonthPickerOpen = $state(false); // 년도/월 선택 드롭다운 열림 상태

  // 요일 이름 반환 함수
  function getDayName(date: Date): string {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  }

  // value prop이 변경되면 inputValue도 업데이트 (요일 포함)
  $effect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dayName = getDayName(date);
        inputValue = `${year}. ${month}. ${day}. ${dayName}`;
      } else {
      inputValue = value.replace(/-/g, '. ') + '.';
      }
    } else {
      inputValue = '';
    }
    return () => {};
  });

  // value가 변경되면 viewDate 동기화
  $effect(() => {
    if (value && !isNaN(new Date(value).getTime())) {
      viewDate = new Date(value);
    }
    return () => {};
  });

  // 다른 DatePicker가 열릴 때 이 인스턴스 닫기
  $effect(() => {
    if (typeof window === 'undefined') return () => {};

    function handleCloseAll(event: CustomEvent) {
      if (event.detail?.except !== instanceId && isOpen) {
        isOpen = false;
      }
    }

    window.addEventListener('datepicker:close-all', handleCloseAll as EventListener);
    return () => {
      window.removeEventListener('datepicker:close-all', handleCloseAll as EventListener);
    };
  });

  const days = $derived(generateCalendar(viewDate));

  // [수정 1] 항상 6주(42일) 고정으로 생성하여 높이 흔들림 방지
  function generateCalendar(date: Date): Date[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // 일요일 시작

    const result: Date[] = [];
    let current = new Date(startDate);
    
    // 6주 * 7일 = 42일 고정 루프
    for (let i = 0; i < 42; i++) {
      result.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return result;
  }

  function getDateClasses(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dayOfWeek = date.getDay();

    // [수정] 연도까지 비교하여 정확한 '이번 달' 여부 판단
    const isCurrentMonth = month === viewDate.getMonth() && year === viewDate.getFullYear();
    
    // 날짜 비교용 문자열 (yyyy-mm-dd)
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // [수정] 로컬 시간 기준으로 '오늘' 여부 판단 (UTC 문제 해결)
    const now = new Date();
    const isToday = day === now.getDate() && 
                    month === now.getMonth() && 
                    year === now.getFullYear();
    
    const isSelected = value === dateString;
    const isHoliday = !!getHolidayName(date);

    let classes = "w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors duration-200 cursor-pointer relative ";

    // 1순위: 비활성 날짜 (이번 달이 아니면 무조건 흐리게)
    if (!isCurrentMonth) {
      return classes + "text-text-muted/30 opacity-40 hover:bg-transparent cursor-default";
    }

    // 2순위: 선택된 날짜 (가장 강한 강조, 포커스 우선 - 호버 효과 없음)
    if (isSelected) {
      return classes + "bg-brand-pink text-white font-medium";
    }
    
    // 3순위: 오늘 날짜 (초록색 텍스트 + 볼드 + 연한 배경)
    if (isToday) {
      return classes + "text-[#24a86b] dark:text-[#4be39b] font-bold bg-[#24a86b]/10 dark:bg-[#4be39b]/20 hover:text-hover-point";
    }
    
    // 4순위: 공휴일 (일요일 색상과 동일)
    if (isHoliday) {
      return classes + "text-[#ff4b7d] font-medium hover:text-hover-point";
    }
    
    // 5순위: 일요일
    if (dayOfWeek === 0) {
      return classes + "text-[#ff4b7d] hover:text-hover-point";
    }
    
    // 6순위: 토요일
    if (dayOfWeek === 6) {
      return classes + "text-[#2f64c8] dark:text-[#6fb6ff] hover:text-hover-point";
    }
    
    // 7순위: 평일
    return classes + "text-text-base hover:text-hover-point";
  }

  function selectDate(date: Date) {
    // 이번 달이 아닌 날짜 클릭 시 해당 월로 이동
    if (date.getMonth() !== viewDate.getMonth()) {
      changeMonth(date.getMonth() > viewDate.getMonth() ? 1 : -1);
      return; 
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    value = `${year}-${month}-${day}`;
    isOpen = false;
  }

  function changeMonth(offset: number) {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
  }

  function changeYear(year: number) {
    viewDate = new Date(year, viewDate.getMonth(), 1);
    yearMonthPickerOpen = false;
  }

  function changeYearMonth(month: number) {
    viewDate = new Date(viewDate.getFullYear(), month, 1);
    yearMonthPickerOpen = false;
  }

  function toggleYearMonthPicker() {
    yearMonthPickerOpen = !yearMonthPickerOpen;
  }

  // 년도/월 선택 드롭다운이 열릴 때 현재 년도와 월로 스크롤
  $effect(() => {
    if (yearMonthPickerOpen) {
      // 다음 틱에서 DOM이 렌더링된 후 스크롤
      setTimeout(() => {
        const yearContainer = wrapperElement?.querySelector('.year-month-picker .max-h-48:first-of-type') as HTMLElement;
        const monthContainer = wrapperElement?.querySelector('.year-month-picker .max-h-48:last-of-type') as HTMLElement;
        
        // 현재 년도로 스크롤
        if (yearContainer) {
          const currentYearButton = yearContainer.querySelector(`button[aria-selected="true"]`) as HTMLElement;
          if (currentYearButton) {
            currentYearButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        
        // 현재 월로 스크롤
        if (monthContainer) {
          const currentMonthButton = monthContainer.querySelector(`button[aria-selected="true"]`) as HTMLElement;
          if (currentMonthButton) {
            currentMonthButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 0);
    }
    return () => {};
  });

  // 년도 리스트 생성 (현재 년도 기준 ±10년)
  const availableYears = $derived.by(() => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  });

  // 월 리스트 (1~12월)
  const availableMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  function toggleCalendar() {
    if (!isOpen) {
      // 다른 DatePicker가 열려있으면 모두 닫기
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('datepicker:close-all', { detail: { except: instanceId } }));
      }
      if (value) viewDate = new Date(value);
      isOpen = true;
      // 캘린더가 열릴 때 아이콘에 포커스 주기
      setTimeout(() => {
        const iconSpan = wrapperElement?.querySelector('span[role="button"][aria-label="캘린더 열기"]') as HTMLElement;
        iconSpan?.focus();
      }, 0);
    } else {
      isOpen = false;
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (isOpen && wrapperElement) {
      const target = event.target as Node;
      
      // 1. wrapperElement 밖 클릭 → 캘린더 전체 닫기
      if (!wrapperElement.contains(target)) {
        yearMonthPickerOpen = false;
        isOpen = false;
        return;
      }
      
      // 2. wrapperElement 안 클릭 처리
        const calendarDropdown = wrapperElement.querySelector('.calendar-dropdown');
      const yearMonthPicker = wrapperElement.querySelector('.year-month-picker');
      
      // 년도/월 드롭다운이 열려있을 때만 추가 처리
      if (yearMonthPickerOpen && yearMonthPicker) {
        // 년도/월 드롭다운 안 클릭 → 아무것도 안 함 (이미 stopPropagation으로 처리됨)
        if (yearMonthPicker.contains(target)) {
          return;
        }
        
        // 캘린더 드롭다운 안이지만 년도/월 드롭다운 밖 클릭 → 드롭다운만 닫기
        if (calendarDropdown && calendarDropdown.contains(target)) {
          yearMonthPickerOpen = false;
          return;
        }
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleCalendar();
    }
  }

  function handleDateKeydown(event: KeyboardEvent, date: Date) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectDate(date);
    }
  }

  // 직접 입력 처리: YYYY. MM. DD. 형식을 YYYY-MM-DD로 변환 (요일 정보 제거)
  function parseInputDate(input: string): string {
    if (!input || !input.trim()) return '';
    
    // 요일 정보 제거: (일), (월), (화), (수), (목), (금), (토) 제거
    let cleanedInput = input.trim().replace(/\s*\([일월화수목금토]\)\s*$/, '');
    
    // YYYY. MM. DD. 또는 YYYY MM DD 형식 파싱
    const patterns = [
      /^(\d{4})\.?\s*(\d{1,2})\.?\s*(\d{1,2})\.?$/,  // YYYY. MM. DD. 또는 YYYY MM DD
      /^(\d{4})(\d{2})(\d{2})$/,  // YYYYMMDD (공백/점 제거 후)
    ];
    
    for (const pattern of patterns) {
      const match = cleanedInput.match(pattern);
      if (match) {
        const [, year, month, day] = match;
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        
        // 기본 유효성 검사
        if (yearNum < 1900 || yearNum > 2100) continue;
        if (monthNum < 1 || monthNum > 12) continue;
        if (dayNum < 1 || dayNum > 31) continue;
        
        // 실제 유효한 날짜인지 확인
        const date = new Date(yearNum, monthNum - 1, dayNum);
        if (
          date.getFullYear() === yearNum &&
          date.getMonth() === monthNum - 1 &&
          date.getDate() === dayNum
        ) {
          return `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        }
      }
    }
    
    return '';
  }

  function handleInputChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    inputValue = target.value;
    
    // 입력값을 파싱하여 value 업데이트
    const parsed = parseInputDate(target.value);
    if (parsed) {
      value = parsed;
      viewDate = new Date(parsed);
    } else if (!target.value.trim()) {
      value = '';
    }
  }

  function handleInputBlur() {
    // 포커스가 벗어날 때 유효한 날짜로 포맷팅 (요일 포함)
    if (inputValue.trim() && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dayName = getDayName(date);
        inputValue = `${year}. ${month}. ${day}. ${dayName}`;
      } else {
      inputValue = value.replace(/-/g, '. ') + '.';
      }
    } else if (!value) {
      inputValue = '';
    }
  }

  function handleClear() {
    inputValue = '';
    value = '';
    isOpen = false; // 캘린더도 함께 닫기
    // 입력 필드로 포커스 이동
    if (typeof window !== 'undefined') {
      const input = wrapperElement?.querySelector('.datepicker-input') as HTMLInputElement;
      input?.focus();
    }
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={(e) => e.key === 'Escape' && (isOpen = false)} />

<div class="relative w-full {className}" bind:this={wrapperElement}>
    <input 
      type="text" 
      {id} 
      {name} 
      {placeholder} 
      bind:value={inputValue}
      oninput={handleInputChange}
      onblur={handleInputBlur}
      onfocus={() => {
        if (inputValue && value) {
          viewDate = new Date(value);
        }
    }}
    onkeydown={handleKeydown}
    class="input-base w-full h-10 px-4 {inputValue.trim() ? 'pr-[4.5rem]' : 'pr-[2.625rem]'} text-base placeholder:text-text-muted cursor-text box-border datepicker-input"
    role="combobox"
    aria-haspopup="dialog"
    aria-autocomplete="none"
    {...Object.fromEntries(Object.entries(restProps).filter(([key]) => key !== 'tabindex' && key !== 'list'))}
    />
    
    <!-- 클리어 버튼 (입력값이 있을 때만 표시) -->
    {#if inputValue.trim()}
      <button
        type="button"
        onclick={(e) => {
          e.stopPropagation();
          handleClear();
        }}
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClear();
          }
        }}
                  class="btn-icon absolute inset-y-0 right-[2.625rem] flex items-center pointer-events-auto"
        aria-label="입력 내용 지우기"
      >
                  <X size={16} class="lucide-icon text-text-muted" />
      </button>
    {/if}
    
    <!-- 캘린더 버튼 -->
    <button 
      type="button" 
      class="btn-icon absolute inset-y-0 right-2.5 flex items-center pointer-events-none" 
      aria-label="캘린더 열기"
      aria-expanded={isOpen}
      tabindex="-1"
    >
      <span 
        class="flex h-4 w-4 items-center justify-center pointer-events-auto cursor-pointer"
      onclick={(e) => {
        e.stopPropagation();
        toggleCalendar();
      }}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCalendar();
        }
      }}
        role="button"
        tabindex="0"
      aria-label="캘린더 열기"
    >
                  <Calendar size={16} class="lucide-icon text-text-muted" />
      </span>
    </button>

  {#if isOpen}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -- 캘린더 컨테이너: 클릭 전파·년월 피커 닫기용, role="application" 사용 -->
    <div class="calendar-dropdown absolute bottom-full {align === 'left' ? 'left-0' : 'right-0'} mb-2 w-[18rem] border border-border-subtle rounded-xl p-4 z-50" style="background-color: var(--calendar-bg);" transition:fade={{ duration: 100 }} role="application" aria-label="날짜 선택 캘린더" onclick={(e) => {
      // 년도/월 드롭다운이 열려있을 때, 드롭다운 밖의 캘린더 영역 클릭 시 드롭다운만 닫기
      if (yearMonthPickerOpen) {
        const target = e.target as Node;
        const yearMonthPicker = (e.currentTarget as HTMLElement).querySelector('.year-month-picker');
        if (yearMonthPicker && !yearMonthPicker.contains(target)) {
          yearMonthPickerOpen = false;
        }
      }
      e.stopPropagation();
    }} onkeydown={(e) => {
      e.stopPropagation();
      if (e.key === 'Escape' && yearMonthPickerOpen) yearMonthPickerOpen = false;
    }}>
      <div class="flex items-center justify-between mb-4 px-1 relative">
        <button type="button" onclick={(e) => { e.stopPropagation(); changeMonth(-1); }} class="p-1 hover:bg-surface-2 rounded-md text-text-muted"><ChevronLeft size={16} /></button>
        <button 
          type="button" 
          onclick={(e) => { 
            e.stopPropagation(); 
            toggleYearMonthPicker(); 
          }}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleYearMonthPicker();
            }
          }}
          class="text-sm font-semibold text-text-strong w-28 text-center tabular-nums px-2 py-1 rounded-md hover:text-hover-point focus:text-brand-pink focus:outline-none transition-colors duration-200"
          aria-label="년도와 월 선택"
          aria-expanded={yearMonthPickerOpen}
        >
          {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
        </button>
        <button type="button" onclick={(e) => { e.stopPropagation(); changeMonth(1); }} class="p-1 hover:bg-surface-2 rounded-md text-text-muted"><ChevronRight size={16} /></button>
        
        <!-- 년도/월 선택 드롭다운 -->
        {#if yearMonthPickerOpen}
          <div class="year-month-picker absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 border border-border-subtle rounded-xl p-3 z-[60]" style="background-color: var(--calendar-picker-bg);" role="group" aria-label="년도·월 선택">
            <div class="grid grid-cols-2 gap-3">
              <!-- 년도 선택 -->
              <div>
                <div class="text-xs font-medium text-text-muted mb-2 px-2">년도</div>
                <div class="max-h-48 overflow-y-auto custom-list-scrollbar">
                  {#each availableYears as year}
                    <button
                      type="button"
                      onclick={(e) => {
                        e.stopPropagation();
                        changeYear(year);
                      }}
                      onkeydown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          changeYear(year);
                        }
                      }}
                      class="w-full px-2 py-1.5 text-sm text-text-base hover:text-hover-point focus:text-brand-pink focus:outline-none rounded-md transition-colors duration-200 text-left {viewDate.getFullYear() === year ? 'text-brand-pink font-semibold' : ''}"
                    >
                      {year}
                    </button>
                  {/each}
                </div>
              </div>
              
              <!-- 월 선택 -->
              <div>
                <div class="text-xs font-medium text-text-muted mb-2 px-2">월</div>
                <div class="max-h-48 overflow-y-auto custom-list-scrollbar">
                  {#each availableMonths as month}
                    <button
                      type="button"
                      onclick={(e) => {
                        e.stopPropagation();
                        changeYearMonth(month - 1);
                      }}
                      onkeydown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          changeYearMonth(month - 1);
                        }
                      }}
                      class="w-full px-2 py-1.5 text-sm text-text-base hover:text-hover-point focus:text-brand-pink focus:outline-none rounded-md transition-colors duration-200 text-left {(viewDate.getMonth() + 1) === month ? 'text-brand-pink font-semibold' : ''}"
                    >
                      {month}월
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
      <div class="grid grid-cols-7 mb-2 text-center">
        <span class="text-xs font-medium text-[#ff4b7d]">일</span>
        <span class="text-xs font-medium text-text-muted">월</span>
        <span class="text-xs font-medium text-text-muted">화</span>
        <span class="text-xs font-medium text-text-muted">수</span>
        <span class="text-xs font-medium text-text-muted">목</span>
        <span class="text-xs font-medium text-text-muted">금</span>
        <span class="text-xs font-medium text-[#2f64c8] dark:text-[#6fb6ff]">토</span>
      </div>
      <div class="grid grid-cols-7 gap-y-1 justify-items-center">
        {#each days as date}
          <button
            type="button"
            class={getDateClasses(date)}
            onclick={(e) => { e.stopPropagation(); selectDate(date); }}
            onkeydown={(e) => handleDateKeydown(e, date)}
            tabindex="0"
            title={getHolidayName(date) || ''}
            aria-label={`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 선택`}
          >
            {date.getDate()}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

