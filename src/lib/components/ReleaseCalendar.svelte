<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	interface Props {
		selected?: string | null; // ISO YYYY-MM-DD
	}

	let { selected = $bindable(null) }: Props = $props();

	const emit = createEventDispatcher<{
		select: { date: string }; // ISO YYYY-MM-DD
	}>();

	// 현재 표시할 월 (오늘 날짜의 월로 초기화)
	function getInitialMonth(): Date {
		const today = new Date();
		return new Date(today.getFullYear(), today.getMonth(), 1);
	}
	let displayMonth = $state<Date>(getInitialMonth());

	// 공휴일 데이터 (Map<YYYY-MM-DD, { name: string }>)
	let holidays = $state(new Map<string, { name: string }>());

	// 한국 공휴일 데이터 직접 구현
	function getKoreanHolidays(year: number): Array<{ dateStr: string; name: string }> {
		const holidaysList: Array<{ dateStr: string; name: string }> = [];
		
		// 고정 공휴일
		holidaysList.push({ dateStr: `${year}-01-01`, name: '신정' });
		holidaysList.push({ dateStr: `${year}-03-01`, name: '삼일절' });
		holidaysList.push({ dateStr: `${year}-05-05`, name: '어린이날' });
		holidaysList.push({ dateStr: `${year}-06-06`, name: '현충일' });
		holidaysList.push({ dateStr: `${year}-08-15`, name: '광복절' });
		holidaysList.push({ dateStr: `${year}-10-03`, name: '개천절' });
		holidaysList.push({ dateStr: `${year}-10-09`, name: '한글날' });
		holidaysList.push({ dateStr: `${year}-12-25`, name: '크리스마스' });
		
		// 식목일 (2025년부터)
		if (year >= 2025) {
			holidaysList.push({ dateStr: `${year}-04-05`, name: '식목일' });
		}
		
		// 설날 (음력) - 2024-2026년 근사값
		if (year === 2024) {
			holidaysList.push({ dateStr: '2024-02-10', name: '설날' });
			holidaysList.push({ dateStr: '2024-02-11', name: '설날' });
			holidaysList.push({ dateStr: '2024-02-12', name: '설날' });
		} else if (year === 2025) {
			holidaysList.push({ dateStr: '2025-01-29', name: '설날' });
			holidaysList.push({ dateStr: '2025-01-30', name: '설날' });
			holidaysList.push({ dateStr: '2025-01-31', name: '설날' });
		} else if (year === 2026) {
			holidaysList.push({ dateStr: '2026-02-17', name: '설날' });
			holidaysList.push({ dateStr: '2026-02-18', name: '설날' });
			holidaysList.push({ dateStr: '2026-02-19', name: '설날' });
		}
		
		// 추석 (음력) - 2024-2026년 근사값
		if (year === 2024) {
			holidaysList.push({ dateStr: '2024-09-16', name: '추석' });
			holidaysList.push({ dateStr: '2024-09-17', name: '추석' });
			holidaysList.push({ dateStr: '2024-09-18', name: '추석' });
		} else if (year === 2025) {
			holidaysList.push({ dateStr: '2025-10-05', name: '추석' });
			holidaysList.push({ dateStr: '2025-10-06', name: '추석' });
			holidaysList.push({ dateStr: '2025-10-07', name: '추석' });
		} else if (year === 2026) {
			holidaysList.push({ dateStr: '2026-09-24', name: '추석' });
			holidaysList.push({ dateStr: '2026-09-25', name: '추석' });
			holidaysList.push({ dateStr: '2026-09-26', name: '추석' });
		}
		
		// 부처님오신날 (음력) - 2024-2026년 근사값
		if (year === 2024) {
			holidaysList.push({ dateStr: '2024-05-15', name: '부처님오신날' });
		} else if (year === 2025) {
			holidaysList.push({ dateStr: '2025-05-05', name: '부처님오신날' });
		} else if (year === 2026) {
			holidaysList.push({ dateStr: '2026-05-24', name: '부처님오신날' });
		}
		
		return holidaysList;
	}

	// 공휴일 데이터 로드
	function loadHolidays(year: number) {
		// 이미 로드된 연도인지 확인
		const yearKey = `${year}-01-01`;
		if (holidays.has(yearKey)) return; // 이미 로드됨

		const yearHolidays = getKoreanHolidays(year);
		yearHolidays.forEach((holiday) => {
			holidays.set(holiday.dateStr, { name: holiday.name });
		});
	}

	// 초기 로드 및 월 변경 시 공휴일 로드
	$effect(() => {
		const year = displayMonth.getFullYear();
		// 현재 연도 ±1년 로드
		for (let y = year - 1; y <= year + 1; y++) {
			loadHolidays(y);
		}
	});

	// Date를 ISO 문자열로 변환 (YYYY-MM-DD)
	function formatISO(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// ISO 문자열을 Date로 변환
	function parseISO(iso: string): Date | null {
		if (!iso) return null;
		const date = new Date(iso);
		return isNaN(date.getTime()) ? null : date;
	}

	// 캘린더 날짜 배열 생성 (항상 6행 = 42일로 고정)
	function getCalendarDays(year: number, month: number): Array<{ date: Date; isCurrentMonth: boolean }> {
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];
		
		// 이전 달의 날짜
		const prevMonth = month === 0 ? 11 : month - 1;
		const prevYear = month === 0 ? year - 1 : year;
		const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
		for (let i = startingDayOfWeek - 1; i >= 0; i--) {
			days.push({ date: new Date(prevYear, prevMonth, prevMonthLastDay - i), isCurrentMonth: false });
		}
		
		// 이번 달의 날짜
		for (let day = 1; day <= daysInMonth; day++) {
			days.push({ date: new Date(year, month, day), isCurrentMonth: true });
		}
		
		// 다음 달의 날짜 (항상 42개가 되도록)
		const totalDays = days.length;
		const remainingDays = 42 - totalDays;
		const nextMonth = month === 11 ? 0 : month + 1;
		const nextYear = month === 11 ? year + 1 : year;
		for (let i = 1; i <= remainingDays; i++) {
			days.push({ date: new Date(nextYear, nextMonth, i), isCurrentMonth: false });
		}
		
		return days;
	}

	// 날짜가 같은지 확인
	function isSameDate(date1: Date | null, date2: Date | null): boolean {
		if (!date1 || !date2) return false;
		return date1.getFullYear() === date2.getFullYear() &&
		       date1.getMonth() === date2.getMonth() &&
		       date1.getDate() === date2.getDate();
	}

	// 오늘 날짜인지 확인 (ISO 문자열 비교)
	function isToday(iso: string): boolean {
		if (!iso) return false;
		const today = new Date();
		const todayIso = formatISO(today);
		return iso === todayIso;
	}

	// 날짜 선택
	function selectDate(date: Date) {
		if (!date) return;
		const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		selected = iso;
		emit('select', { date: iso });
	}
	
	// 날짜 버튼 클릭 핸들러
	function handleDateClick(date: Date, isCurrentMonth: boolean) {
		if (isCurrentMonth) {
			selectDate(date);
		}
	}

	// 월 변경
	function changeMonth(delta: number) {
		displayMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + delta, 1);
	}

	// 선택된 날짜
	const selectedDate = $derived(selected ? parseISO(selected) : null);

	// 선택된 날짜가 변경되면 표시 월도 업데이트
	$effect(() => {
		if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
			displayMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
		}
	});
</script>

<div class="w-[280px] bg-surface-1 border border-border-subtle rounded-lg shadow-xl z-50 custom-calendar">
	<div class="p-3">
		<!-- 월 네비게이션 -->
		<div class="flex items-center justify-between mb-3">
			<button
				type="button"
				onclick={() => changeMonth(-1)}
				class="p-1 rounded-sm hover:bg-transparent transition-colors duration-200 calendar-nav-btn"
				aria-label="이전 달"
			>
				<ChevronLeft size={16} class="lucide-icon text-text-muted" />
			</button>
			<span class="text-sm font-medium text-text-strong">
				{displayMonth.getFullYear()}년 {displayMonth.getMonth() + 1}월
			</span>
			<button
				type="button"
				onclick={() => changeMonth(1)}
				class="p-1 rounded-sm hover:bg-transparent transition-colors duration-200 calendar-nav-btn"
				aria-label="다음 달"
			>
				<ChevronRight size={16} class="lucide-icon text-text-muted" />
			</button>
		</div>
		<!-- 요일 헤더 -->
		<div class="grid grid-cols-7 gap-1 mb-2">
			{#each ['일', '월', '화', '수', '목', '금', '토'] as day, index}
				<div class="text-xs text-center font-medium py-1 {index === 0 ? 'text-[#ff4b7d]' : index === 6 ? 'text-[#2f64c8] dark:text-[#6fb6ff]' : 'text-text-muted'}">
					{day}
				</div>
			{/each}
		</div>
		<!-- 날짜 그리드 -->
		<div class="grid grid-cols-7 gap-1">
			{#each getCalendarDays(displayMonth.getFullYear(), displayMonth.getMonth()) as dayInfo}
				{@const date = dayInfo.date}
				{@const isCurrentMonth = dayInfo.isCurrentMonth}
				{@const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`}
				{@const day = date.getDay()}
				{@const holiday = holidays.get(iso)}
				{@const today = new Date()}
				{@const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`}
				{@const isToday = iso === todayIso}
				{@const isSelected = selected === iso}
				
				{@const classes = (() => {
					let classes = "";
					if (isSelected) {
						classes = "bg-brand-pink text-white";
					} else if (isToday) {
						classes = "text-[#24a86b] dark:text-[#4be39b] font-medium";
					} else if (holiday) {
						classes = "text-[#ff2f6a] font-medium";
					} else if (day === 0) {
						classes = "text-[#ff4b7d]";
					} else if (day === 6) {
						classes = "text-[#2f64c8] dark:text-[#6fb6ff]";
					} else if (!isCurrentMonth) {
						classes = "text-text-muted/60 dark:text-text-muted/70";
					} else {
						classes = "text-text-base";
					}
					return classes;
				})()}
				
				<button
					type="button"
					onclick={() => handleDateClick(date, isCurrentMonth)}
					class="w-8 h-8 text-sm rounded-sm transition-colors duration-200 {isCurrentMonth ? (classes + ' hover:bg-surface-2') : (classes + ' cursor-not-allowed')}"
					title={holiday ? holiday.name : ""}
				>
					{date.getDate()}
				</button>
			{/each}
		</div>
	</div>
</div>
