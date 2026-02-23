<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Asterisk } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { toast } from '$lib/stores/toast';

	// 현재 날짜 정보
	const currentDate = new Date();
	const today = currentDate.toISOString().split('T')[0];

	// URL 파라미터에서 ID 가져오기
	const eventId = $derived($page.params.id);

	// 이벤트 데이터
	let event = $state<any>(null);
	let loading = $state(true);

	// 폼 상태
	let formData = $state({
		title: '',
		date: today,
		time: '',
		type: 'other',
		status: 'upcoming',
		description: ''
	});

	// 제출 상태
	let isSubmitting = $state(false);

	// 검증 상태
	let validationErrors = $state<Record<string, string>>({});

	// 이벤트 타입 옵션
	const eventTypes = [
		{ value: 'release', label: '발매' },
		{ value: 'session', label: '세션' },
		{ value: 'meeting', label: '미팅' },
		{ value: 'other', label: '기타' }
	];

	// 이벤트 상태 옵션
	const eventStatuses = [
		{ value: 'upcoming', label: '예정' },
		{ value: 'in-progress', label: '진행 중' },
		{ value: 'completed', label: '완료' },
		{ value: 'cancelled', label: '취소됨' }
	];

	// 이벤트 데이터 로드
	$effect(() => {
		(async () => {
			if (!eventId) {
				toast.add('이벤트 ID가 없습니다.', 'error', 3000);
				goto('/calendar');
				return;
			}

			try {
				loading = true;
				const response = await fetch(`/api/calendar?limit=1000`);
				const data = await response.json() as Record<string, any>;
				
				if (data.ok && data.data) {
					const found = data.data.find((e: any) => e.id === eventId);
					if (found) {
						event = found;
						formData = {
							title: found.title || '',
							date: found.date || today,
							time: found.time || '',
							type: found.type || 'other',
							status: found.status || 'upcoming',
							description: found.description || ''
						};
					} else {
						toast.add('이벤트 데이터를 찾을 수 없습니다.', 'error', 3000);
						goto('/calendar');
					}
				} else {
					toast.add('이벤트 데이터를 불러오는데 실패했습니다.', 'error', 3000);
					goto('/calendar');
				}
			} catch (error) {
				console.error('이벤트 로드 오류:', error);
				toast.add('이벤트 데이터를 불러오는 중 오류가 발생했습니다.', 'error', 5000);
				goto('/calendar');
			} finally {
				loading = false;
			}
		})();
		return () => {};
	});

	// 검증 함수
	function validateForm(): boolean {
		validationErrors = {};

		if (!formData.title.trim()) {
			validationErrors.title = '이벤트 제목을 입력해주세요.';
		}

		if (!formData.date || !formData.date.trim()) {
			validationErrors.date = '날짜를 선택해주세요.';
		}

		return Object.keys(validationErrors).length === 0;
	}

	async function handleSubmit() {
		if (isSubmitting) return;

		// 최종 검증
		if (!validateForm()) {
			toast.add('필수 항목을 모두 입력해주세요.', 'error', 3000);
			// 첫 번째 에러 필드로 포커스 이동
			const firstErrorField = Object.keys(validationErrors)[0];
			if (firstErrorField) {
				setTimeout(() => {
					const field = document.getElementById(firstErrorField);
					field?.focus();
					field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}, 100);
			}
			return;
		}

		isSubmitting = true;

		try {
			// 폼 데이터 준비
			const eventData = {
				id: eventId,
				title: formData.title.trim(),
				date: formData.date.trim(),
				time: formData.time.trim() || null,
				type: formData.type,
				status: formData.status,
				description: formData.description.trim() || null
			};

			// TODO: API PUT 구현 후 활성화
			// const response = await fetch('/api/calendar', {
			// 	method: 'PUT',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify(eventData)
			// });

			// const result = await response.json();

			// if (!response.ok || !result.ok) {
			// 	const errorMessage = result.error?.message || '이벤트 수정에 실패했습니다.';
			// 	throw new Error(errorMessage);
			// }

			// 임시: 성공 메시지만 표시
			toast.add('일정이 성공적으로 수정되었습니다. (API 구현 대기 중)', 'success', 3000);

			// 목록 페이지로 이동
			setTimeout(() => {
				goto('/calendar');
			}, 1000);
		} catch (error) {
			console.error('이벤트 수정 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '이벤트 수정 중 오류가 발생했습니다.';
			toast.add(errorMessage, 'error', 5000);
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		if (confirm('작성 중인 내용을 저장하지 않고 나가시겠습니까?')) {
			goto('/calendar');
		}
	}
</script>

<svelte:head>
	<title>일정 수정</title>
</svelte:head>

<PageContent>
	<PageHeader 
		title="일정 수정"
		description="일정 정보를 수정합니다"
	/>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<p class="text-text-muted">로딩 중...</p>
		</div>
	{:else if !event}
		<div class="flex items-center justify-center py-12">
			<p class="text-text-muted">이벤트 데이터를 찾을 수 없습니다.</p>
		</div>
	{:else}
		<!-- 수정 폼 -->
		<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
				<!-- 기본 정보 -->
				<div class="p-6 space-y-4">
					<h3 class="text-lg font-semibold text-text-strong">기본 정보</h3>
					
					<!-- 제목 -->
					<div class="w-full">
						<label for="title" class="block text-sm font-medium text-text-strong mb-2">
							제목 <Asterisk size={12} class="inline text-brand-pink ml-0" />
						</label>
						<input
							type="text"
							id="title"
							name="title"
							bind:value={formData.title}
							required
							aria-invalid={validationErrors.title ? 'true' : 'false'}
							aria-describedby={validationErrors.title ? 'title-error' : undefined}
							class="input-base w-full h-10 px-4 text-base placeholder:text-text-muted {validationErrors.title ? 'border-danger-fg' : ''}"
							placeholder="일정 제목을 입력하세요"
						/>
						{#if validationErrors.title}
							<p id="title-error" class="mt-1.5 text-sm text-danger-fg" role="alert">
								{validationErrors.title}
							</p>
						{/if}
					</div>

					<!-- 날짜 -->
					<div class="w-full">
						<label for="date" class="block text-sm font-medium text-text-strong mb-2">
							날짜 <Asterisk size={12} class="inline text-brand-pink ml-0" />
						</label>
						<DatePicker id="date" name="date" bind:value={formData.date} />
						{#if validationErrors.date}
							<p id="date-error" class="mt-1.5 text-sm text-danger-fg" role="alert">
								{validationErrors.date}
							</p>
						{/if}
					</div>

					<!-- 시간 -->
					<div class="w-full">
						<label for="time" class="block text-sm font-medium text-text-strong mb-2">
							시간
						</label>
						<input
							type="time"
							id="time"
							name="time"
							bind:value={formData.time}
							class="input-base w-full h-10 px-4 text-base placeholder:text-text-muted"
						/>
					</div>

					<!-- 타입 -->
					<div class="w-full">
						<label for="type" class="block text-sm font-medium text-text-strong mb-2">
							유형
						</label>
						<select
							id="type"
							name="type"
							bind:value={formData.type}
							class="input-base w-full h-10 px-4 text-base"
						>
							{#each eventTypes as type}
								<option value={type.value}>{type.label}</option>
							{/each}
						</select>
					</div>

					<!-- 상태 -->
					<div class="w-full">
						<label for="status" class="block text-sm font-medium text-text-strong mb-2">
							상태
						</label>
						<select
							id="status"
							name="status"
							bind:value={formData.status}
							class="input-base w-full h-10 px-4 text-base"
						>
							{#each eventStatuses as status}
								<option value={status.value}>{status.label}</option>
							{/each}
						</select>
					</div>

					<!-- 설명 -->
					<div class="w-full">
						<label for="description" class="block text-sm font-medium text-text-strong mb-2">
							설명
						</label>
						<textarea
							id="description"
							name="description"
							bind:value={formData.description}
							rows="3"
							class="input-base w-full px-4 py-2 text-base placeholder:text-text-muted resize-none"
							placeholder="일정에 대한 설명을 입력하세요 (선택사항)"
						></textarea>
					</div>
				</div>

				<!-- 액션 버튼 -->
				<div class="border-t border-border-subtle p-6">
					<div class="flex items-center justify-end gap-3">
						<button
							type="button"
							onclick={handleCancel}
							class="cancel-button px-6 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors duration-200 font-medium"
						>
							취소
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							class="px-6 py-2 bg-brand-pink text-white rounded-lg focus:outline-none focus:ring-0 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							aria-busy={isSubmitting}
						>
							수정
						</button>
					</div>
				</div>
			</form>
		</div>
	{/if}
</PageContent>
