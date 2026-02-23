<script lang="ts">
	import { goto } from '$app/navigation';
	import { Asterisk, X } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { toast } from '$lib/stores/toast';

	// 현재 날짜 정보
	const currentDate = new Date();
	const today = currentDate.toISOString().split('T')[0];

	// 폼 상태
	let formData = $state({
		platform: '',
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
	let platformInput: HTMLInputElement;
	let amountInput: HTMLInputElement;

	// 플랫폼 목록
	const platforms = [
		'Spotify',
		'Apple Music',
		'YouTube Music',
		'Melon',
		'Genie',
		'Bugs',
		'FLO',
		'VIBE',
		'기타'
	];

	// 검증 함수
	function validateForm(): boolean {
		validationErrors = {};

		if (!formData.platform.trim()) {
			validationErrors.platform = '플랫폼을 선택하거나 입력해주세요.';
		}

		if (!formData.amount || formData.amount <= 0) {
			validationErrors.amount = '수익 금액을 입력해주세요.';
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
			const revenueData = {
				platform: formData.platform.trim(),
				amount: formData.amount,
				date: formData.date.trim(),
				track_id: formData.track_id.trim() || null,
				album_id: formData.album_id.trim() || null,
				description: formData.description.trim() || null
			};

			// API 호출
			const response = await fetch('/api/revenue', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(revenueData)
			});

			const result = await response.json() as { ok?: boolean; error?: { message?: string }; data?: unknown };

			if (!response.ok || !result.ok) {
				const errorMessage = result.error?.message || '수익 추가에 실패했습니다.';
				throw new Error(errorMessage);
			}

			// 성공 알림
			toast.add('수익이 성공적으로 추가되었습니다.', 'success', 3000);

			// 목록 페이지로 이동
			setTimeout(() => {
				goto('/revenue');
			}, 1000);
		} catch (error) {
			console.error('수익 추가 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '수익 추가 중 오류가 발생했습니다.';
			toast.add(errorMessage, 'error', 5000);
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		if (confirm('작성 중인 내용을 저장하지 않고 나가시겠습니까?')) {
			goto('/revenue');
		}
	}
</script>

<svelte:head>
	<title>수익 추가</title>
</svelte:head>

<PageContent>
	<PageHeader 
		title="수익 추가"
		description="새로운 수익을 추가합니다"
	/>

	<!-- 추가 폼 -->
	<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
			<!-- 기본 정보 -->
			<div class="p-6 space-y-4">
				<h3 class="text-lg font-semibold text-text-strong">기본 정보</h3>
				
				<!-- 플랫폼 -->
				<div class="w-full">
					<label for="platform" class="block text-sm font-medium text-text-strong mb-2">
						플랫폼 <Asterisk size={12} class="inline text-brand-pink ml-0" />
					</label>
					<div class="relative">
						<input
							type="text"
							id="platform"
							name="platform"
							bind:this={platformInput}
							bind:value={formData.platform}
							list="platforms"
							required
							aria-invalid={validationErrors.platform ? 'true' : 'false'}
							aria-describedby={validationErrors.platform ? 'platform-error' : undefined}
							class="input-base w-full h-10 px-4 {formData.platform.trim() ? 'pr-10' : 'pr-4'} text-base placeholder:text-text-muted {validationErrors.platform ? 'border-danger-fg' : ''}"
							placeholder="플랫폼을 선택하거나 입력하세요"
						/>
						<datalist id="platforms">
							{#each platforms as platform}
								<option value={platform}></option>
							{/each}
						</datalist>
						{#if formData.platform.trim()}
							<button
								type="button"
								class="btn-icon absolute right-3 top-1/2 -translate-y-1/2"
								onclick={() => {
									formData.platform = '';
									platformInput?.focus();
								}}
								aria-label="입력 내용 지우기"
							>
								<X size={16} />
							</button>
						{/if}
					</div>
					{#if validationErrors.platform}
						<p id="platform-error" class="mt-1.5 text-sm text-danger-fg" role="alert">
							{validationErrors.platform}
						</p>
					{/if}
				</div>

				<!-- 수익 금액 -->
				<div class="w-full">
					<label for="amount" class="block text-sm font-medium text-text-strong mb-2">
						수익 금액 <Asterisk size={12} class="inline text-brand-pink ml-0" />
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
							placeholder="수익 금액을 입력하세요"
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
						placeholder="수익에 대한 설명을 입력하세요 (선택사항)"
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
						추가
					</button>
				</div>
			</div>
		</form>
	</div>
</PageContent>
