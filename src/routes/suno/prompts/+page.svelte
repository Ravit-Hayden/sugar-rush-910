<script lang="ts">
	import { Plus, Search, Copy, Check, Trash2, Edit2, ChevronDown, X } from 'lucide-svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import type { PromptTemplate } from '$lib/types/suno';

	// 필터 상태
	let searchQuery = $state('');
	let categoryFilter = $state<'all' | 'style' | 'exclude' | 'full'>('all');
	let categoryDropdownOpen = $state(false);
	let copiedId = $state<string | null>(null);

	// 모달 상태
	let showAddModal = $state(false);
	let newPrompt = $state({
		name: '',
		category: 'style' as 'style' | 'exclude' | 'full',
		content: ''
	});

	// 목업 데이터
	let prompts = $state<PromptTemplate[]>([
		{
			id: 'p1',
			name: '드리미 신스팝',
			category: 'style',
			content: 'dreamy synth-pop, ethereal vocals, soft ballad, polished but emotive, with precise phrasing and dynamic control',
			usageCount: 15,
			createdAt: '2026-01-05',
			createdBy: 'El'
		},
		{
			id: 'p2',
			name: 'K-POP 업템포',
			category: 'style',
			content: 'upbeat K-pop, catchy hooks, energetic dance-pop, powerful beats, polished production',
			usageCount: 12,
			createdAt: '2026-01-03',
			createdBy: 'Otte'
		},
		{
			id: 'p3',
			name: '멜로우 어쿠스틱',
			category: 'style',
			content: 'mellow acoustic, warm vocals, gentle guitar, intimate atmosphere, singer-songwriter style',
			usageCount: 8,
			createdAt: '2026-01-02',
			createdBy: 'El'
		},
		{
			id: 'p4',
			name: 'R&B 소울',
			category: 'style',
			content: 'R&B soul, smooth grooves, emotional vocals, modern production, late night vibes',
			usageCount: 6,
			createdAt: '2026-01-01',
			createdBy: 'El'
		},
		{
			id: 'p5',
			name: '제외 - 헤비메탈',
			category: 'exclude',
			content: 'heavy metal, screaming, aggressive, harsh, distorted, noisy',
			usageCount: 20,
			createdAt: '2025-12-28',
			createdBy: 'El'
		},
		{
			id: 'p6',
			name: '제외 - 아마추어',
			category: 'exclude',
			content: 'off-key, amateur, monotone, robotic, low quality',
			usageCount: 18,
			createdAt: '2025-12-28',
			createdBy: 'Otte'
		},
		{
			id: 'p7',
			name: '여름밤 발라드 풀셋',
			category: 'full',
			content: 'Style: dreamy synth-pop, ethereal vocals, soft ballad, korean, emotional, midnight vibes\nExclude: heavy metal, screaming, aggressive, harsh',
			usageCount: 5,
			createdAt: '2026-01-10',
			createdBy: 'El'
		}
	]);

	// 카테고리 라벨
	const categoryLabels = {
		all: '전체',
		style: '스타일',
		exclude: '제외',
		full: '풀 프롬프트'
	};

	// 카테고리 색상
	function getCategoryColor(category: string): string {
		switch (category) {
			case 'style': return 'bg-brand-pink/20 text-brand-pink';
			case 'exclude': return 'bg-red-500/20 text-red-400';
			case 'full': return 'bg-blue-500/20 text-blue-400';
			default: return 'bg-surface-2 text-text-muted';
		}
	}

	// 필터링
	const filteredPrompts = $derived.by(() => {
		return prompts.filter(prompt => {
			if (searchQuery && !prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!prompt.content.toLowerCase().includes(searchQuery.toLowerCase())) {
				return false;
			}
			if (categoryFilter !== 'all' && prompt.category !== categoryFilter) {
				return false;
			}
			return true;
		});
	});

	// 카테고리별 카운트
	const categoryCounts = $derived.by(() => {
		const counts: Record<string, number> = { all: prompts.length };
		prompts.forEach(p => {
			counts[p.category] = (counts[p.category] || 0) + 1;
		});
		return counts;
	});

	// 복사
	async function copyPrompt(id: string, content: string) {
		await navigator.clipboard.writeText(content);
		copiedId = id;
		setTimeout(() => copiedId = null, 2000);
	}

	// 삭제
	function deletePrompt(id: string) {
		if (confirm('이 프롬프트를 삭제하시겠습니까?')) {
			prompts = prompts.filter(p => p.id !== id);
		}
	}

	// 추가
	function addPrompt() {
		if (!newPrompt.name.trim() || !newPrompt.content.trim()) return;

		prompts = [...prompts, {
			id: `p_${Date.now()}`,
			name: newPrompt.name.trim(),
			category: newPrompt.category,
			content: newPrompt.content.trim(),
			usageCount: 0,
			createdAt: new Date().toISOString().split('T')[0],
			createdBy: 'El'
		}];

		newPrompt = { name: '', category: 'style', content: '' };
		showAddModal = false;
	}

	// 외부 클릭 처리
	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.category-dropdown')) {
			categoryDropdownOpen = false;
		}
	}

	$effect(() => {
		if (categoryDropdownOpen) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<svelte:head>
	<title>프롬프트 라이브러리 | SUNO 제작</title>
</svelte:head>

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">자주 사용하는 SUNO 프롬프트를 저장하고 관리합니다</p>
			</div>
			<button
				type="button"
				onclick={() => showAddModal = true}
				class="flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg font-medium hover:bg-brand-pink/90 transition-colors flex-shrink-0"
			>
				<Plus size={16} />
				프롬프트 추가
			</button>
		</div>
	</div>

	<!-- 탭 + 콘텐츠 -->
	<SUNOTabs>
		<!-- 필터 영역 -->
		<div class="mb-6 flex flex-col sm:flex-row gap-4">
			<!-- 검색 -->
			<div class="relative flex-1">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search size={16} class="text-text-muted" />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="프롬프트 검색..."
					class="w-full h-10 pl-10 pr-4 bg-surface-2 border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink"
				/>
			</div>

			<!-- 카테고리 필터 -->
			<div class="relative category-dropdown">
				<button
					type="button"
					onclick={() => categoryDropdownOpen = !categoryDropdownOpen}
					class="w-full sm:w-40 h-10 px-4 pr-10 bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base text-left focus:outline-none focus:border-brand-pink transition-colors"
				>
					<span class="block truncate">
						{categoryLabels[categoryFilter]} ({categoryCounts[categoryFilter] || 0})
					</span>
				</button>
				<div class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
					<ChevronDown size={16} class="text-text-muted" />
				</div>
				{#if categoryDropdownOpen}
					<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10">
						{#each Object.entries(categoryLabels) as [value, label]}
							<li
								role="option"
								aria-selected={categoryFilter === value}
								tabindex="0"
								onclick={() => { categoryFilter = value as typeof categoryFilter; categoryDropdownOpen = false; }}
								class="px-4 py-2 text-base text-text-base hover:bg-surface-1 cursor-pointer {categoryFilter === value ? 'bg-brand-pink text-white' : ''}"
							>
								{label} ({categoryCounts[value] || 0})
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>

		<!-- 프롬프트 그리드 -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each filteredPrompts as prompt}
				<div class="bg-surface-2 rounded-lg border border-border-subtle p-4">
					<!-- 헤더 -->
					<div class="flex items-start justify-between gap-3 mb-3">
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<h3 class="text-base font-medium text-text-strong truncate">{prompt.name}</h3>
								<span class="flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium {getCategoryColor(prompt.category)}">
									{categoryLabels[prompt.category]}
								</span>
							</div>
							<p class="text-xs text-text-muted mt-1">
								사용 {prompt.usageCount}회 · {prompt.createdBy} · {prompt.createdAt}
							</p>
						</div>
					</div>

					<!-- 내용 -->
					<div class="bg-bg rounded-lg p-3 mb-3">
						<p class="text-sm text-text-base whitespace-pre-wrap line-clamp-3">{prompt.content}</p>
					</div>

					<!-- 액션 -->
					<div class="flex items-center justify-end gap-2">
						<button
							type="button"
							class="btn-icon"
							onclick={() => copyPrompt(prompt.id, prompt.content)}
						>
							{#if copiedId === prompt.id}
								<Check size={16} class="text-green-500" />
							{:else}
								<Copy size={16} />
							{/if}
						</button>
						<button type="button" class="btn-icon">
							<Edit2 size={16} />
						</button>
						<button
							type="button"
							class="btn-icon text-red-400 hover:text-red-500"
							onclick={() => deletePrompt(prompt.id)}
						>
							<Trash2 size={16} />
						</button>
					</div>
				</div>
			{/each}

			{#if filteredPrompts.length === 0}
				<div class="col-span-full py-12 text-center text-text-muted">
					{searchQuery || categoryFilter !== 'all'
						? '검색 결과가 없습니다.'
						: '저장된 프롬프트가 없습니다.'}
				</div>
			{/if}
		</div>

		<!-- 통계 -->
		<div class="mt-6 text-sm text-text-muted">
			총 {prompts.length}개 프롬프트 | 표시 중 {filteredPrompts.length}개
		</div>
	</SUNOTabs>
</div>

<!-- 프롬프트 추가 모달 -->
{#if showAddModal}
	<div
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
		onclick={() => showAddModal = false}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-lg"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
				<h2 class="text-lg font-semibold text-text-strong">새 프롬프트 추가</h2>
				<button type="button" onclick={() => showAddModal = false} class="btn-icon">
					<X size={20} />
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); addPrompt(); }} class="p-6 space-y-4">
				<!-- 이름 -->
				<div>
					<label for="prompt-name" class="block text-sm font-medium text-text-strong mb-2">이름</label>
					<input
						type="text"
						id="prompt-name"
						bind:value={newPrompt.name}
						class="input-base w-full h-10 px-4"
						placeholder="프롬프트 이름"
						required
					/>
				</div>

				<!-- 카테고리 -->
				<div>
					<label for="prompt-category" class="block text-sm font-medium text-text-strong mb-2">카테고리</label>
					<select
						id="prompt-category"
						bind:value={newPrompt.category}
						class="input-base w-full h-10 px-4"
					>
						<option value="style">스타일</option>
						<option value="exclude">제외</option>
						<option value="full">풀 프롬프트</option>
					</select>
				</div>

				<!-- 내용 -->
				<div>
					<label for="prompt-content" class="block text-sm font-medium text-text-strong mb-2">내용</label>
					<textarea
						id="prompt-content"
						bind:value={newPrompt.content}
						class="input-base w-full h-32 px-4 py-3 resize-none"
						placeholder="프롬프트 내용을 입력하세요"
						required
					></textarea>
					<p class="text-xs text-text-muted mt-1">{newPrompt.content.length}/1000</p>
				</div>

				<!-- 버튼 -->
				<div class="flex justify-end gap-3 pt-4">
					<button
						type="button"
						onclick={() => showAddModal = false}
						class="cancel-button px-6 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors font-medium"
					>
						취소
					</button>
					<button
						type="submit"
						class="px-6 py-2 bg-brand-pink text-white rounded-lg transition-colors font-medium"
					>
						추가
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
