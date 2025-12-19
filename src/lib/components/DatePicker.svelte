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
    ...restProps
  } = $props();
  
  let isOpen = $state(false);
  let viewDate = $state(new Date());
  let wrapperElement: HTMLDivElement | undefined;
  let inputValue = $state(''); // 직접 입력값
  let instanceId = $state(Math.random().toString(36).substring(7)); // 고유 인스턴스 ID

  // value prop이 변경되면 inputValue도 업데이트
  $effect(() => {
    if (value) {
      inputValue = value.replace(/-/g, '. ') + '.';
    } else {
      inputValue = '';
    }
  });

  // value가 변경되면 viewDate 동기화
  $effect(() => {
    if (value && !isNaN(new Date(value).getTime())) {
      viewDate = new Date(value);
    }
  });

  // 다른 DatePicker가 열릴 때 이 인스턴스 닫기
  $effect(() => {
    if (typeof window === 'undefined') return;

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

    // 2순위: 선택된 날짜 (가장 강한 강조)
    if (isSelected) {
      return classes + "bg-brand-pink text-white font-medium hover:bg-brand-pink/90";
    }
    
    // 3순위: 오늘 날짜 (초록색 텍스트 + 볼드 + 연한 배경)
    if (isToday) {
      return classes + "text-[#24a86b] dark:text-[#4be39b] font-bold bg-[#24a86b]/10 dark:bg-[#4be39b]/20 hover:bg-[#24a86b]/20";
    }
    
    // 4순위: 공휴일 (일요일 색상과 동일)
    if (isHoliday) {
      return classes + "text-[#ff4b7d] font-medium hover:bg-surface-2";
    }
    
    // 5순위: 일요일
    if (dayOfWeek === 0) {
      return classes + "text-[#ff4b7d] hover:bg-surface-2";
    }
    
    // 6순위: 토요일
    if (dayOfWeek === 6) {
      return classes + "text-[#2f64c8] dark:text-[#6fb6ff] hover:bg-surface-2";
    }
    
    // 7순위: 평일
    return classes + "text-text-base hover:bg-surface-2";
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

  function toggleCalendar() {
    if (!isOpen) {
      // 다른 DatePicker가 열려있으면 모두 닫기
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('datepicker:close-all', { detail: { except: instanceId } }));
      }
      if (value) viewDate = new Date(value);
      isOpen = true;
    } else {
      isOpen = false;
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (isOpen && wrapperElement) {
      const target = event.target as Node;
      // 캘린더 컨테이너 내부 클릭이 아니고, 캘린더 드롭다운 내부도 아닌 경우에만 닫기
      if (!wrapperElement.contains(target)) {
        // 캘린더 드롭다운이 열려있고 그 내부를 클릭한 경우는 제외
        const calendarDropdown = wrapperElement.querySelector('.calendar-dropdown');
        if (!calendarDropdown || !calendarDropdown.contains(target)) {
          isOpen = false;
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

  // 직접 입력 처리: YYYY. MM. DD. 형식을 YYYY-MM-DD로 변환
  function parseInputDate(input: string): string {
    if (!input || !input.trim()) return '';
    
    // YYYY. MM. DD. 또는 YYYY MM DD 형식 파싱
    const patterns = [
      /^(\d{4})\.?\s*(\d{1,2})\.?\s*(\d{1,2})\.?$/,  // YYYY. MM. DD. 또는 YYYY MM DD
      /^(\d{4})(\d{2})(\d{2})$/,  // YYYYMMDD (공백/점 제거 후)
    ];
    
    for (const pattern of patterns) {
      const match = input.trim().match(pattern);
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
    // 포커스가 벗어날 때 유효한 날짜로 포맷팅
    if (inputValue.trim() && value) {
      inputValue = value.replace(/-/g, '. ') + '.';
    } else if (!value) {
      inputValue = '';
    }
  }

  function handleClear() {
    inputValue = '';
    value = '';
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
    onclick={(e) => {
      e.stopPropagation();
      toggleCalendar();
    }}
    onkeydown={handleKeydown}
    class="w-full h-10 px-4 {inputValue.trim() ? 'pr-[4.5rem]' : 'pr-[2.625rem]'} bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base placeholder:text-text-muted hover:border-[var(--hover-cyan)] focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200 cursor-pointer box-border datepicker-input"
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
                class="btn-icon absolute inset-y-0 right-2.5 flex items-center pointer-events-auto" 
                aria-label="캘린더 열기"
                aria-expanded={isOpen}
              >
                <span class="flex h-4 w-4 items-center justify-center">
                  <Calendar size={16} class="lucide-icon text-text-muted" />
                </span>
              </button>

  {#if isOpen}
    <div class="calendar-dropdown absolute bottom-full right-0 mb-2 w-[18rem] bg-surface-1 border border-border-subtle rounded-xl p-4 z-50" transition:fade={{ duration: 100 }} onclick={(e) => e.stopPropagation()}>
      <div class="flex items-center justify-between mb-4 px-1">
        <button type="button" onclick={(e) => { e.stopPropagation(); changeMonth(-1); }} class="p-1 hover:bg-surface-2 rounded-md text-text-muted"><ChevronLeft size={16} /></button>
        <span class="text-sm font-semibold text-text-strong w-28 text-center tabular-nums">
          {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
        </span>
        <button type="button" onclick={(e) => { e.stopPropagation(); changeMonth(1); }} class="p-1 hover:bg-surface-2 rounded-md text-text-muted"><ChevronRight size={16} /></button>
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

