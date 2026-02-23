<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Asterisk, X } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { toast } from '$lib/stores/toast';

	// 현재 날짜 정보
	const currentDate = new Date();
	const today = currentDate.toISOString().split('T')[0];

	// URL 파라미터에서 ID 가져오기
	const expenseId = $derived($page.params.id);

	// 지출 데이터
	let expense = $state<any>(null);
	let loading = $state(true);

	// 폼 상태
	let formData = $state({
		category: '',
		amount: 0,
		date: today,
		track_id: '',
		album_id: '',
		description: ''
	});

	// 제출 상태
	let isSubmitting = $state(false);

	// 검증 상태
	let validationErrors = $state<Record<string, string>>({});

	// 입력 필드 참조
	let categoryInput: HTMLInputElement;
	let amountInput: HTMLInputElement;

	// 카테고리 목록
	const categories = [
		'제작비',
		'마케팅비',
		'라이센스비',
		'스튜디오 대여비',
		'음악가/프로듀서 비용',
		'앨범 아트워크 제작비',
		'배포 플랫폼 수수료',
		'법률/계약 비용',
		'기타'
	];

	// 지출 데이터 로드
	$effect(() => {
		(async () => {
			if (!expenseId) {
				toast.add('지출 ID가 없습니다.', 'error', 3000);
				goto('/expenses');
				return;
			}

			try {
				loading = true;
				const response = await fetch(`/api/expenses?limit=1000`);
				const data = await response.json() as Record<string, any>;
				
				if (data.ok && data.data) {
					const found = data.data.find((e: any) => e.id === expenseId);
					if (found) {
						expense = found;
						formData = {
							category: found.category || '',
							amount: found.amount || 0,
							date: found.date || today,
							track_id: found.track_id || '',
							album_id: found.album_id || '',
							description: found.description || ''
						};
					} else {
						toast.add('지출 데이터를 찾을 수 없습니다.', 'error', 3000);
						goto('/expenses');
					}
				} else {
					toast.add('지출 데이터를 불러오는데 실패했습니다.', 'error', 3000);
					goto('/expenses');
				}
			} catch (error) {
				console.error('지출 로드 오류:', error);
				toast.add('지출 데이터를 불러오는 중 오류가 발생했습니다.', 'error', 5000);
				goto('/expenses');
			} finally {
				loading = false;
			}
		})();
		return () => {};
	});

	// 검증 함수
	function validateForm(): boolean {
		validationErrors = {};

		if (!formData.category.trim()) {
			validationErrors.category = '카테고리를 선택하거나 입력해주세요.';
		}

		if (!formData.amount || formData.amount <= 0) {
			validationErrors.amount = '지출 금액을 입력해주세요.';
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
			const expenseData = {
				id: expenseId,
				category: formData.category.trim(),
				amount: formData.amount,
				date: formData.date.trim(),
				track_id: formData.track_id.trim() || null,
				album_id: formData.album_id.trim() || null,
				description: formData.description.trim() || null
			};

			// TODO: API PUT 구현 후 활성화
			// const response = await fetch('/api/expenses', {
			// 	method: 'PUT',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify(expenseData)
			// });

			// const result = await response.json();

			// if (!response.ok || !result.ok) {
			// 	const errorMessage = result.error?.message || '지출 수정에 실패했습니다.';
			// 	throw new Error(errorMessage);
			// }

			// 임시: 성공 메시지만 표시
			toast.add('지출이 성공적으로 수정되었습니다. (API 구현 대기 중)', 'success', 3000);

			// 목록 페이지로 이동
			setTimeout(() => {
				goto('/expenses');
			}, 1000);
		} catch (error) {
			console.error('지출 수정 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '지출 수정 중 오류가 발생했습니다.';
			toast.add(errorMessage, 'error', 5000);
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		if (confirm('작성 중인 내용을 저장하지 않고 나가시겠습니까?')) {
			goto('/expenses');
		}
	}
</script>

<svelte:head>
	<title>지출 수정</title>
</svelte:head>

<PageContent>
	<PageHeader 
		title="지출 수정"
		description="지출 정보를 수정합니다"
	/>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<p class="text-text-muted">로딩 중...</p>
		</div>
	{:else if !expense}
		<div class="flex items-center justify-center py-12">
			<p class="text-text-muted">지출 데이터를 찾을 수 없습니다.</p>
		</div>
	{:else}
		<!-- 수정 폼 -->
		<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
				<!-- 기본 정보 -->
				<div class="p-6 space-y-4">
					<h3 class="text-lg font-semibold text-text-strong">기본 정보</h3>
					
					<!-- 카테고리 -->
					<div class="w-full">
						<label for="category" class="block text-sm font-medium text-text-strong mb-2">
							카테고리 <Asterisk size={12} class="inline text-brand-pink ml-0" />
						</label>
						<div class="relative">
							<input
								type="text"
								id="category"
								name="category"
								bind:this={categoryInput}
								bind:value={formData.category}
								list="categories"
								required
								aria-invalid={validationErrors.category ? 'true' : 'false'}
								aria-describedby={validationErrors.category ? 'category-error' : undefined}
								class="input-base w-full h-10 px-4 {formData.category.trim() ? 'pr-10' : 'pr-4'} text-base placeholder:text-text-muted {validationErrors.category ? 'border-danger-fg' : ''}"
								placeholder="카테고리를 선택하거나 입력하세요"
							/>
							<datalist id="categories">
								{#each categories as category}
									<option value={category}></option>
								{/each}
							</datalist>
							{#if formData.category.trim()}
								<button
									type="button"
									class="btn-icon absolute right-3 top-1/2 -translate-y-1/2"
									onclick={() => {
										formData.category = '';
										categoryInput?.focus();
									}}
									aria-label="입력 내용 지우기"
								>
									<X size={16} />
								</button>
							{/if}
						</div>
						{#if validationErrors.category}
							<p id="category-error" class="mt-1.5 text-sm text-danger-fg" role="alert">
								{validationErrors.category}
							</p>
						{/if}
					</div>

					<!-- 지출 금액 -->
					<div class="w-full">
						<label for="amount" class="block text-sm font-medium text-text-strong mb-2">
							지출 금액 <Asterisk size={12} class="inline text-brand-pink ml-0" />
						</label>
						<div class="relative">
							<input
								type="number"
								id="amount"
								name="amount"
								bind:this={amountInput}
								bind:value={formData.amount}
								min="0"
								step="0.01"
								required
								aria-invalid={validationErrors.amount ? 'true' : 'false'}
								aria-describedby={validationErrors.amount ? 'amount-error' : undefined}
								class="input-base w-full h-10 px-4 text-base placeholder:text-text-muted {validationErrors.amount ? 'border-danger-fg' : ''}"
								placeholder="지출 금액을 입력하세요"
							/>
						</div>
						{#if validationErrors.amount}
							<p id="amount-error" class="mt-1.5 text-sm text-danger-fg" role="alert">
								{validationErrors.amount}
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
							placeholder="지출에 대한 설명을 입력하세요 (선택사항)"
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
