<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ArrowLeft, Music, Save, X } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { SUNO_VERSIONS, VOCAL_GENDERS } from '$lib/constants/suno/prompts';
	import type { VocalGender, SUNOVersion } from '$lib/types/suno';

	// URL 파라미터에서 템플릿 정보 가져오기
	const templateName = $page.url.searchParams.get('template') || '';
	const defaultStyles = $page.url.searchParams.get('styles') || '';
	const defaultExclude = $page.url.searchParams.get('exclude') || '';
	const defaultVocal = ($page.url.searchParams.get('vocal') as VocalGender) || 'Female';

	// 폼 상태
	let title = $state('');
	let description = $state('');
	let styles = $state(defaultStyles);
	let excludeStyles = $state(defaultExclude);
	let vocalGender = $state<VocalGender>(defaultVocal);
	let sunoVersion = $state<SUNOVersion>('v4');

	// 저장 중 상태
	let isSaving = $state(false);

	// 폼 유효성
	const isValid = $derived(title.trim().length > 0);

	// 프로젝트 생성
	async function handleSubmit() {
		if (!isValid || isSaving) return;

		isSaving = true;

		// TODO: 실제 API 호출
		// 임시로 딜레이 후 프로젝트 목록으로 이동
		await new Promise(resolve => setTimeout(resolve, 500));

		// 생성된 프로젝트 ID로 이동 (임시로 목록으로)
		goto('/suno/projects');
	}

	// 취소
	function handleCancel() {
		goto('/suno');
	}
</script>

<svelte:head>
	<title>새 프로젝트 | SUNO 제작</title>
</svelte:head>

<div class="px-6 lg:px-10 py-6 pb-20 sm:pb-6">
	<!-- 헤더 -->
	<div class="mb-6">
		<a href="/suno" class="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-hover-point transition-colors mb-3">
			<ArrowLeft size={14} />
			SUNO 홈
		</a>
		<div class="flex items-start justify-between gap-4">
			<div>
				<h1 class="text-2xl font-bold text-text-strong">새 프로젝트</h1>
				{#if templateName}
					<p class="text-text-muted mt-1">템플릿: {templateName}</p>
				{:else}
					<p class="text-text-muted mt-1">빈 프로젝트로 시작</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- 폼 -->
	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6 max-w-2xl">
		<!-- 기본 정보 -->
		<div class="bg-surface-1 rounded-lg border border-border-subtle p-6">
			<h2 class="text-lg font-semibold text-text-strong mb-4">기본 정보</h2>
			
			<div class="space-y-4">
				<!-- 제목 -->
				<div>
					<label for="title" class="block text-sm font-medium text-text-strong mb-2">
						프로젝트 제목 <span class="text-brand-pink">*</span>
					</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						placeholder="예: 달콤한 밤의 노래"
						class="input-base w-full px-4 py-3"
						required
					/>
				</div>

				<!-- 설명 -->
				<div>
					<label for="description" class="block text-sm font-medium text-text-strong mb-2">
						설명 (선택)
					</label>
					<input
						id="description"
						type="text"
						bind:value={description}
						placeholder="예: 여름밤 감성 발라드"
						class="input-base w-full px-4 py-3"
					/>
				</div>
			</div>
		</div>

		<!-- SUNO 설정 -->
		<div class="bg-surface-1 rounded-lg border border-border-subtle p-6">
			<h2 class="text-lg font-semibold text-text-strong mb-4">SUNO 기본 설정</h2>
			
			<div class="space-y-4">
				<!-- SUNO 버전 -->
				<div>
					<label for="sunoVersion" class="block text-sm font-medium text-text-strong mb-2">
						SUNO 버전
					</label>
					<select
						id="sunoVersion"
						bind:value={sunoVersion}
						class="input-base w-full px-4 py-3"
					>
						{#each SUNO_VERSIONS as version}
							<option value={version.value}>{version.label}</option>
						{/each}
					</select>
				</div>

				<!-- 보컬 성별 -->
				<div>
					<label for="vocalGender" class="block text-sm font-medium text-text-strong mb-2">
						보컬 성별
					</label>
					<select
						id="vocalGender"
						bind:value={vocalGender}
						class="input-base w-full px-4 py-3"
					>
						{#each VOCAL_GENDERS as gender}
							<option value={gender.value}>{gender.label}</option>
						{/each}
					</select>
				</div>

				<!-- 스타일 -->
				<div>
					<label for="styles" class="block text-sm font-medium text-text-strong mb-2">
						Styles
					</label>
					<textarea
						id="styles"
						bind:value={styles}
						placeholder="예: dreamy synth-pop, ethereal vocals, soft ballad"
						class="input-base w-full h-24 px-4 py-3 resize-none"
					></textarea>
					<p class="text-xs text-text-muted mt-1">{styles.length}/1000</p>
				</div>

				<!-- 제외 스타일 -->
				<div>
					<label for="excludeStyles" class="block text-sm font-medium text-text-strong mb-2">
						Exclude Styles
					</label>
					<textarea
						id="excludeStyles"
						bind:value={excludeStyles}
						placeholder="예: heavy metal, screaming, aggressive"
						class="input-base w-full h-20 px-4 py-3 resize-none"
					></textarea>
					<p class="text-xs text-text-muted mt-1">{excludeStyles.length}/1000</p>
				</div>
			</div>
		</div>

		<!-- 버튼 -->
		<div class="flex items-center justify-end gap-3">
			<button
				type="button"
				onclick={handleCancel}
				class="px-6 py-3 text-sm font-medium text-text-muted hover:text-text-base border border-border-subtle rounded-lg hover:border-hover-point transition-colors"
			>
				취소
			</button>
			<button
				type="submit"
				disabled={!isValid || isSaving}
				class="px-6 py-3 text-sm font-medium text-white bg-brand-pink rounded-lg hover:bg-brand-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
			>
				{#if isSaving}
					<span class="animate-spin">⏳</span>
					생성 중...
				{:else}
					<Save size={16} />
					프로젝트 생성
				{/if}
			</button>
		</div>
	</form>
</div>
