<script lang="ts">
	import { Plus, Search, Edit2, Trash2, X, Link } from 'lucide-svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import type { VirtualVocal } from '$lib/types/suno';

	// 검색 상태
	let searchQuery = $state('');

	// 모달 상태
	let showAddModal = $state(false);
	let newVocal = $state({
		name: '',
		description: ''
	});

	// 목업 데이터
	let vocals = $state<VirtualVocal[]>([
		{
			id: 'v1',
			name: 'Luna',
			description: '여성 메인 보컬. 청아하고 맑은 음색, 고음 처리 우수',
			linkedTracks: ['track1', 'track2', 'track3'],
			createdAt: '2025-11-01'
		},
		{
			id: 'v2',
			name: 'Ray',
			description: '남성 메인 보컬. 중저음의 깊은 음색, 감성적인 표현',
			linkedTracks: ['track4', 'track5'],
			createdAt: '2025-11-15'
		},
		{
			id: 'v3',
			name: 'Sugar Rush Collective',
			description: '팀 그룹 보컬. 다양한 보컬 조합 가능',
			linkedTracks: ['track1', 'track6', 'track7', 'track8'],
			createdAt: '2025-10-20'
		},
		{
			id: 'v4',
			name: 'Stellar',
			description: '여성 서브 보컬. 파워풀한 고음과 샤우팅 전문',
			linkedTracks: ['track9'],
			createdAt: '2026-01-05'
		},
		{
			id: 'v5',
			name: 'Echo',
			description: '유니섹스 보컬. 몽환적이고 신비로운 분위기',
			linkedTracks: [],
			createdAt: '2026-01-10'
		}
	]);

	// 필터링
	const filteredVocals = $derived.by(() => {
		if (!searchQuery) return vocals;
		const query = searchQuery.toLowerCase();
		return vocals.filter(v => 
			v.name.toLowerCase().includes(query) || 
			v.description?.toLowerCase().includes(query)
		);
	});

	// 삭제
	function deleteVocal(id: string) {
		const vocal = vocals.find(v => v.id === id);
		if (vocal && vocal.linkedTracks.length > 0) {
			if (!confirm(`'${vocal.name}'은(는) ${vocal.linkedTracks.length}개의 트랙에 연결되어 있습니다. 정말 삭제하시겠습니까?`)) {
				return;
			}
		} else if (!confirm('이 보컬을 삭제하시겠습니까?')) {
			return;
		}
		vocals = vocals.filter(v => v.id !== id);
	}

	// 추가
	function addVocal() {
		if (!newVocal.name.trim()) return;

		vocals = [...vocals, {
			id: `v_${Date.now()}`,
			name: newVocal.name.trim(),
			description: newVocal.description.trim(),
			linkedTracks: [],
			createdAt: new Date().toISOString().split('T')[0]
		}];

		newVocal = { name: '', description: '' };
		showAddModal = false;
	}
</script>

<svelte:head>
	<title>가상 보컬 관리 | SUNO 제작</title>
</svelte:head>

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">SUNO AI로 생성되는 가상 보컬과 보컬팀을 관리합니다</p>
			</div>
			<button
				type="button"
				onclick={() => showAddModal = true}
				class="flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg font-medium hover:bg-brand-pink/90 transition-colors flex-shrink-0"
			>
				<Plus size={16} />
				보컬 추가
			</button>
		</div>
	</div>

	<!-- 탭 + 콘텐츠 -->
	<SUNOTabs>
		<!-- 검색 -->
		<div class="mb-6">
			<div class="relative max-w-md">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search size={16} class="text-text-muted" />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="보컬 이름 또는 설명 검색..."
					class="w-full h-10 pl-10 pr-4 bg-surface-2 border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink"
				/>
			</div>
		</div>

		<!-- 보컬 그리드 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredVocals as vocal}
				<div class="bg-surface-2 rounded-lg border border-border-subtle p-5">
					<!-- 아바타와 이름 -->
					<div class="flex items-start gap-4 mb-4">
						<div class="w-14 h-14 rounded-full bg-gradient-to-br from-brand-pink to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
							{vocal.name.charAt(0)}
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="text-lg font-semibold text-text-strong truncate">{vocal.name}</h3>
							<p class="text-sm text-text-muted mt-1 line-clamp-2">{vocal.description || '설명 없음'}</p>
						</div>
					</div>

					<!-- 통계 -->
					<div class="flex items-center gap-4 mb-4 text-sm">
						<div class="flex items-center gap-1.5 text-text-muted">
							<Link size={14} />
							<span>{vocal.linkedTracks.length}개 트랙</span>
						</div>
						<div class="text-text-muted">
							생성: {vocal.createdAt}
						</div>
					</div>

					<!-- 액션 -->
					<div class="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
						<button type="button" class="btn-icon">
							<Edit2 size={16} />
						</button>
						<button
							type="button"
							class="btn-icon text-red-400 hover:text-red-500"
							onclick={() => deleteVocal(vocal.id)}
						>
							<Trash2 size={16} />
						</button>
					</div>
				</div>
			{/each}

			{#if filteredVocals.length === 0}
				<div class="col-span-full py-12 text-center text-text-muted">
					{searchQuery ? '검색 결과가 없습니다.' : '등록된 보컬이 없습니다.'}
				</div>
			{/if}
		</div>

		<!-- 통계 -->
		<div class="mt-6 text-sm text-text-muted">
			총 {vocals.length}개 보컬 | 표시 중 {filteredVocals.length}개
		</div>
	</SUNOTabs>
</div>

<!-- 보컬 추가 모달 -->
{#if showAddModal}
	<div
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
		onclick={() => showAddModal = false}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-md"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
				<h2 class="text-lg font-semibold text-text-strong">새 보컬 추가</h2>
				<button type="button" onclick={() => showAddModal = false} class="btn-icon">
					<X size={20} />
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); addVocal(); }} class="p-6 space-y-4">
				<!-- 이름 -->
				<div>
					<label for="vocal-name" class="block text-sm font-medium text-text-strong mb-2">보컬 이름</label>
					<input
						type="text"
						id="vocal-name"
						bind:value={newVocal.name}
						class="input-base w-full h-10 px-4"
						placeholder="예: Luna, Sugar Rush Collective"
						required
					/>
				</div>

				<!-- 설명 -->
				<div>
					<label for="vocal-desc" class="block text-sm font-medium text-text-strong mb-2">설명</label>
					<textarea
						id="vocal-desc"
						bind:value={newVocal.description}
						class="input-base w-full h-24 px-4 py-3 resize-none"
						placeholder="보컬 특성, 음색, 전문 분야 등"
					></textarea>
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
