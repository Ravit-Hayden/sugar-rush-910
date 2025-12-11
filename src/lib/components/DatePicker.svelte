<script lang="ts">
  import { fade } from 'svelte/transition';
  import { Calendar, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { getHolidayName } from '$lib/utils/holidays';

  export let value = ''; // YYYY-MM-DD
  export let placeholder = 'YYYY. MM. DD.';
  export let id = '';
  export let name = '';
  
  let isOpen = false;
  let viewDate = new Date();
  let wrapperElement: HTMLDivElement | undefined;

  $: if (value && !isNaN(new Date(value).getTime())) {
     // 값이 외부에서 변경되면 viewDate 동기화 로직이 필요하다면 추가
  }

  $: displayValue = value ? value.replace(/-/g, '. ') + '.' : '';
  $: days = generateCalendar(viewDate);

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
    if (!isOpen && value) viewDate = new Date(value);
    isOpen = !isOpen;
  }

  function handleClickOutside(event: MouseEvent) {
    if (isOpen && wrapperElement && !wrapperElement.contains(event.target as Node)) isOpen = false;
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
</script>

<svelte:window on:click={handleClickOutside} on:keydown={(e) => e.key === 'Escape' && (isOpen = false)} />

<div class="relative w-full" bind:this={wrapperElement}>
  <div 
    class="relative w-full cursor-pointer" 
    on:click={toggleCalendar}
    on:keydown={handleKeydown}
    role="button"
    tabindex="0"
    aria-label="날짜 선택"
    aria-expanded={isOpen}
  >
    <input 
      type="text" {id} {name} {placeholder} value={displayValue} readonly 
      class="w-full h-10 px-4 pr-[2.625rem] bg-surface-2 border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200 cursor-pointer datepicker-input"
      tabindex="-1"
      aria-hidden="true"
    />
    <button 
      type="button" 
      class="absolute inset-y-0 right-2.5 flex items-center justify-center text-text-muted hover:text-text-strong hover:bg-transparent transition-colors duration-200" 
      tabindex="-1"
      aria-hidden="true"
    >
      <Calendar size={16} />
    </button>
  </div>

  {#if isOpen}
    <div class="absolute bottom-full right-0 mb-2 w-[18rem] bg-surface-1 border border-border-subtle rounded-xl shadow-lg p-4 z-50" transition:fade={{ duration: 100 }}>
      <div class="flex items-center justify-between mb-4 px-1">
        <button type="button" on:click|stopPropagation={() => changeMonth(-1)} class="p-1 hover:bg-surface-2 rounded-md text-text-muted"><ChevronLeft size={16} /></button>
        <span class="text-sm font-semibold text-text-strong w-28 text-center tabular-nums">
          {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
        </span>
        <button type="button" on:click|stopPropagation={() => changeMonth(1)} class="p-1 hover:bg-surface-2 rounded-md text-text-muted"><ChevronRight size={16} /></button>
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
            on:click|stopPropagation={() => selectDate(date)}
            on:keydown={(e) => handleDateKeydown(e, date)}
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

