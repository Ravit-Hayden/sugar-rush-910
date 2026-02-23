<script lang="ts">
	import { goto } from '$app/navigation';
	import { Rocket, Calendar, Clock, CheckCircle, AlertCircle, Play, Edit, Trash2, Plus, X } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import MoreMenuDropdown, { type MenuItem } from '$lib/components/MoreMenuDropdown.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { toast } from '$lib/stores/toast';
	import { useClickOutside, useEscapeKey } from '$lib/utils/clickOutside';

	// 현재 날짜 정보
	const currentDate = new Date();
	const today = currentDate.toISOString().split('T')[0];

	// 발매 데이터 타입
	interface Release {
		id: string;
		title: string;
		status: 'live' | 'scheduled' | 'draft';
		releaseDate: string;
		platforms: string[];
		progress: number;
		description?: string;
		albumId?: string;
		trackIds?: string[];
		verificationStatus?: {
			audio: boolean;
			metadata: boolean;
			artwork: boolean;
			legal: boolean;
		};
		createdAt?: string;
		updatedAt?: string;
	}

	let searchQuery = $state('');
	let selectedFilter = $state('all');
	let releases = $state<Release[]>([
		{
			id: '1',
			title: 'Sugar Rush Vol.1',
			status: 'scheduled',
			releaseDate: '2024-12-31',
			platforms: ['Spotify', 'Apple Music', 'YouTube Music'],
			progress: 90,
			description: '첫 번째 정규 앨범',
			verificationStatus: {
				audio: true,
				metadata: true,
				artwork: true,
				legal: false
			}
		},
		{
			id: '2',
			title: 'Summer Night',
			status: 'live',
			releaseDate: '2024-10-15',
			platforms: ['Spotify', 'Apple Music'],
			progress: 100,
			description: '여름 시즌 싱글',
			verificationStatus: {
				audio: true,
				metadata: true,
				artwork: true,
				legal: true
			}
		},
		{
			id: '3',
			title: 'Demo Collection',
			status: 'draft',
			releaseDate: '2024-11-20',
			platforms: ['SoundCloud'],
			progress: 60,
			description: '데모 트랙 모음',
			verificationStatus: {
				audio: true,
				metadata: false,
				artwork: false,
				legal: false
			}
		}
	]);

	// 모달 상태
	let showCreateModal = $state(false);
	let showEditModal = $state(false);
	let editingRelease = $state<Release | null>(null);
	let moreMenuOpenId = $state<string | null>(null);

	// 플랫폼 옵션
	const platformOptions = [
		'Spotify',
		'Apple Music',
		'YouTube Music',
		'SoundCloud',
		'Bandcamp',
		'Amazon Music',
		'Deezer',
		'Tidal'
	];

	// 폼 데이터
	let formData = $state({
		title: '',
		description: '',
		status: 'draft' as 'live' | 'scheduled' | 'draft',
		releaseDate: today,
		platforms: [] as string[],
		albumId: '',
		trackIds: [] as string[]
	});

	// 검증 상태
	let validationErrors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	// 상태 색상 및 라벨
	function getStatusColor(status: string) {
		switch (status) {
			case 'live': return 'badge-low-green';
			case 'scheduled': return 'badge-info-blue';
			case 'draft': return 'badge-medium-yellow';
			default: return 'text-text-muted';
		}
	}

	function getStatusLabel(status: string) {
		switch (status) {
			case 'live': return '발매됨';
			case 'scheduled': return '예정됨';
			case 'draft': return '초안';
			default: return '알 수 없음';
		}
	}

	// 검증 함수
	function validateForm(): boolean {
		validationErrors = {};

		if (!formData.title.trim()) {
			validationErrors.title = '발매 제목을 입력해주세요.';
		}

		if (!formData.releaseDate) {
			validationErrors.releaseDate = '발매일을 선택해주세요.';
		}

		if (formData.platforms.length === 0) {
			validationErrors.platforms = '최소 하나의 플랫폼을 선택해주세요.';
		}

		return Object.keys(validationErrors).length === 0;
	}

	// 폼 초기화
	function resetForm() {
		formData = {
			title: '',
			description: '',
			status: 'draft',
			releaseDate: today,
			platforms: [],
			albumId: '',
			trackIds: []
		};
		validationErrors = {};
		isSubmitting = false;
	}

	// 발매 생성
	function handleCreateRelease() {
		resetForm();
		showCreateModal = true;
	}

	// 발매 수정
	function handleEditRelease(release: Release) {
		editingRelease = release;
		formData = {
			title: release.title,
			description: release.description || '',
			status: release.status,
			releaseDate: release.releaseDate,
			platforms: [...release.platforms],
			albumId: release.albumId || '',
			trackIds: release.trackIds || []
		};
		validationErrors = {};
		showEditModal = true;
		moreMenuOpenId = null;
	}

	// 발매 삭제
	function handleDeleteRelease(release: Release) {
		if (confirm(`"${release.title}" 발매를 삭제하시겠습니까?`)) {
			releases = releases.filter(r => r.id !== release.id);
			toast.add('발매가 삭제되었습니다.', 'success');
		}
		moreMenuOpenId = null;
	}

	// 폼 제출
	async function handleSubmit() {
		if (isSubmitting) return;

		if (!validateForm()) {
			toast.add('입력 정보를 확인해주세요.', 'error');
			return;
		}

		isSubmitting = true;

		try {
			if (editingRelease) {
				// 수정
				const index = releases.findIndex(r => r.id === editingRelease!.id);
				if (index !== -1) {
					releases[index] = {
						...releases[index],
						...formData,
						updatedAt: new Date().toISOString()
					};
					toast.add('발매가 수정되었습니다.', 'success');
				}
			} else {
				// 생성
				const newRelease: Release = {
					id: `release_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					...formData,
					progress: 0,
					verificationStatus: {
						audio: false,
						metadata: false,
						artwork: false,
						legal: false
					},
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				};
				releases = [newRelease, ...releases];
				toast.add('발매가 생성되었습니다.', 'success');
			}

			// 모달 닫기
			showCreateModal = false;
			showEditModal = false;
			editingRelease = null;
			resetForm();
		} catch (error) {
			toast.add('오류가 발생했습니다.', 'error');
			console.error('Submit error:', error);
		} finally {
			isSubmitting = false;
		}
	}

	// 플랫폼 토글
	function togglePlatform(platform: string) {
		if (formData.platforms.includes(platform)) {
			formData.platforms = formData.platforms.filter(p => p !== platform);
		} else {
			formData.platforms = [...formData.platforms, platform];
		}
	}

	// 검증 상태 계산
	function getVerificationProgress(release: Release): number {
		if (!release.verificationStatus) return 0;
		const checks = Object.values(release.verificationStatus);
		const completed = checks.filter(Boolean).length;
		return Math.round((completed / checks.length) * 100);
	}

	// 메뉴 아이템
	function getMenuItems(release: Release): MenuItem[] {
		return [
			{
				label: '수정',
				icon: Edit,
				onClick: () => handleEditRelease(release)
			},
			{
				label: '삭제',
				icon: Trash2,
				onClick: () => handleDeleteRelease(release),
				danger: true
			}
		];
	}

	// 메뉴 토글 핸들러
	function handleMenuToggle(id: string) {
		moreMenuOpenId = moreMenuOpenId === id ? null : id;
	}

	function handleMenuClose() {
		moreMenuOpenId = null;
	}

	// 필터링
	const statusOptions = [
		{ value: 'all', label: '모든 상태' },
		{ value: 'live', label: '발매됨' },
		{ value: 'scheduled', label: '예정됨' },
		{ value: 'draft', label: '초안' }
	];

	const filteredReleases = $derived.by(() => {
		return releases.filter(release => {
			const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesFilter = selectedFilter === 'all' || release.status === selectedFilter;
			return matchesSearch && matchesFilter;
		});
	});

	// 모달 외부 클릭 처리 (셀렉터로 대상 지정, 모달 열림 시에만 활성화)
	$effect(() => {
		const open = showCreateModal;
		return useClickOutside('[data-create-modal]', () => {
			if (!isSubmitting) {
				showCreateModal = false;
				resetForm();
			}
		}, open);
	});
	$effect(() => {
		const open = showEditModal;
		return useClickOutside('[data-edit-modal]', () => {
			if (!isSubmitting) {
				showEditModal = false;
				editingRelease = null;
				resetForm();
			}
		}, open);
	});
	useEscapeKey(() => {
		if (showCreateModal && !isSubmitting) {
			showCreateModal = false;
			resetForm();
		}
		if (showEditModal && !isSubmitting) {
			showEditModal = false;
			editingRelease = null;
			resetForm();
		}
	});
</script>

<PageContent>
	<PageHeader 
		title="발매 관리" 
		description="음악 발매를 계획하고 관리하세요."
		actions={[
			{
				icon: Rocket,
				label: '새 발매 생성',
				onclick: handleCreateRelease
			}
		]}
	/>

	<!-- 검색 및 필터 -->
	<SearchFilterBar
		bind:searchQuery
		bind:selectedFilter
		searchPlaceholder="발매 제목 검색..."
		showFilter={true}
		filterOptions={statusOptions}
	/>

	<!-- 발매 목록 -->
	{#if filteredReleases.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredReleases as release (release.id)}
			<div class="bg-surface-1 rounded-lg p-6 hover:bg-surface-2 transition-colors duration-200 border border-border-subtle relative">
				<!-- 메뉴 버튼 -->
				<div class="absolute top-4 right-4">
					<MoreMenuDropdown
						itemId={release.id}
						openId={moreMenuOpenId}
						items={getMenuItems(release)}
						onToggle={handleMenuToggle}
						onClose={handleMenuClose}
					/>
				</div>

				<div class="flex items-start justify-between mb-4 pr-8">
					<h3 class="text-lg font-semibold text-text-strong">{release.title}</h3>
					<span class="badge-base {getStatusColor(release.status)}">
						{getStatusLabel(release.status)}
					</span>
				</div>

				{#if release.description}
					<p class="text-sm text-text-muted mb-3">{release.description}</p>
				{/if}

				<div class="space-y-3">
					<div class="flex items-center gap-2 text-sm text-text-muted">
						<Calendar size={16} />
						<span>{release.releaseDate}</span>
					</div>

					<!-- 준비도 -->
					<div>
						<div class="flex items-center justify-between text-sm mb-1">
							<span class="text-text-muted">준비도</span>
							<span class="text-text-strong">{release.progress}%</span>
						</div>
						<div class="w-full bg-surface-2 rounded-full h-2">
							<div 
								class="bg-brand-pink h-2 rounded-full transition-all duration-300" 
								style="width: {release.progress}%"
							></div>
						</div>
					</div>

					<!-- 검증 상태 -->
					{#if release.verificationStatus}
						<div>
							<div class="flex items-center justify-between text-sm mb-1">
								<span class="text-text-muted">검증 진행도</span>
								<span class="text-text-strong">{getVerificationProgress(release)}%</span>
							</div>
							<div class="w-full bg-surface-2 rounded-full h-1.5">
								<div 
									class="bg-green-500 h-1.5 rounded-full transition-all duration-300" 
									style="width: {getVerificationProgress(release)}%"
								></div>
							</div>
							<div class="grid grid-cols-2 gap-1 mt-2">
								<div class="flex items-center gap-1.5 text-xs">
									{#if release.verificationStatus.audio}
										<CheckCircle size={12} class="text-green-500" />
									{:else}
										<AlertCircle size={12} class="text-yellow-500" />
									{/if}
									<span class="text-text-muted">오디오</span>
								</div>
								<div class="flex items-center gap-1.5 text-xs">
									{#if release.verificationStatus.metadata}
										<CheckCircle size={12} class="text-green-500" />
									{:else}
										<AlertCircle size={12} class="text-yellow-500" />
									{/if}
									<span class="text-text-muted">메타데이터</span>
								</div>
								<div class="flex items-center gap-1.5 text-xs">
									{#if release.verificationStatus.artwork}
										<CheckCircle size={12} class="text-green-500" />
									{:else}
										<AlertCircle size={12} class="text-yellow-500" />
									{/if}
									<span class="text-text-muted">아트워크</span>
								</div>
								<div class="flex items-center gap-1.5 text-xs">
									{#if release.verificationStatus.legal}
										<CheckCircle size={12} class="text-green-500" />
									{:else}
										<AlertCircle size={12} class="text-yellow-500" />
									{/if}
									<span class="text-text-muted">법적 검토</span>
								</div>
							</div>
						</div>
					{/if}

					<!-- 플랫폼 -->
					<div class="text-sm text-text-muted">
						<div class="font-medium mb-1">플랫폼:</div>
						<div class="flex flex-wrap gap-1">
							{#each release.platforms as platform}
								<span class="px-2 py-1 bg-surface-2 rounded text-xs border border-border-subtle">{platform}</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
			{/each}
		</div>
	{:else}
		<EmptyState
			title="발매를 찾을 수 없습니다"
			description={searchQuery ? '검색 조건에 맞는 발매가 없습니다.' : '아직 발매가 없습니다.'}
			actionLabel="첫 번째 발매 생성"
			onAction={handleCreateRelease}
		/>
	{/if}

	<!-- 생성 모달 -->
	{#if showCreateModal}
		<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="create-modal-title">
			<div 
				data-create-modal
				class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-2xl max-h-[90vh] overflow-y-auto"
			>
				<div class="p-6 border-b border-border-subtle">
					<div class="flex items-center justify-between">
						<h2 id="create-modal-title" class="text-xl font-semibold text-text-strong">새 발매 생성</h2>
						<button
							onclick={() => {
								showCreateModal = false;
								resetForm();
							}}
							class="template-close-btn w-8 h-8 flex items-center justify-end rounded-md text-text-muted transition-colors border border-transparent pl-2 pr-0"
							type="button"
							aria-label="닫기"
						>
							<X size={20} />
						</button>
					</div>
				</div>

				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
					class="p-6 space-y-6"
				>
					<!-- 제목 -->
					<div>
						<label for="release-title" class="block text-sm font-medium text-text-strong mb-2">
							발매 제목 <span class="text-brand-pink">*</span>
						</label>
						<input
							id="release-title"
							type="text"
							bind:value={formData.title}
							placeholder="예: Sugar Rush Vol.1"
							class="input-base w-full px-3 py-2 {validationErrors.title ? 'border-red-500' : ''}"
							required
						/>
						{#if validationErrors.title}
							<p class="text-xs text-red-500 mt-1">{validationErrors.title}</p>
						{/if}
					</div>

					<!-- 설명 -->
					<div>
						<label for="release-description" class="block text-sm font-medium text-text-strong mb-2">
							설명
						</label>
						<textarea
							id="release-description"
							bind:value={formData.description}
							placeholder="발매에 대한 설명을 입력하세요..."
							rows="3"
							class="input-base w-full px-3 py-2 resize-none"
						></textarea>
					</div>

					<!-- 발매일 -->
					<div>
						<label for="release-date" class="block text-sm font-medium text-text-strong mb-2">
							발매일 <span class="text-brand-pink">*</span>
						</label>
						<DatePicker
							id="release-date"
							bind:value={formData.releaseDate}
							placeholder="발매일 선택"
						/>
						{#if validationErrors.releaseDate}
							<p class="text-xs text-red-500 mt-1">{validationErrors.releaseDate}</p>
						{/if}
					</div>

					<!-- 상태 -->
					<div>
						<label for="release-status" class="block text-sm font-medium text-text-strong mb-2">
							상태
						</label>
						<select
							id="release-status"
							bind:value={formData.status}
							class="input-base w-full px-3 py-2"
						>
							<option value="draft">초안</option>
							<option value="scheduled">예정됨</option>
							<option value="live">발매됨</option>
						</select>
					</div>

					<!-- 플랫폼 -->
					<div>
						<span class="block text-sm font-medium text-text-strong mb-2">
							플랫폼 <span class="text-brand-pink">*</span>
						</span>
						<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
							{#each platformOptions as platform}
								<label class="flex items-center gap-2 p-2 rounded border border-border-subtle cursor-pointer hover:bg-surface-2 transition-colors {formData.platforms.includes(platform) ? 'bg-brand-pink/10 border-brand-pink' : ''}">
									<input
										type="checkbox"
										checked={formData.platforms.includes(platform)}
										onchange={() => togglePlatform(platform)}
										class="rounded"
									/>
									<span class="text-sm text-text-strong">{platform}</span>
								</label>
							{/each}
						</div>
						{#if validationErrors.platforms}
							<p class="text-xs text-red-500 mt-1">{validationErrors.platforms}</p>
						{/if}
					</div>

					<!-- 버튼 -->
					<div class="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
						<button
							type="button"
							onclick={() => {
								showCreateModal = false;
								resetForm();
							}}
							class="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-strong transition-colors"
							disabled={isSubmitting}
						>
							취소
						</button>
						<button
							type="submit"
							class="px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isSubmitting}
						>
							{isSubmitting ? '생성 중...' : '생성'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- 수정 모달 -->
	{#if showEditModal && editingRelease}
		<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
			<div 
				data-edit-modal
				class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-2xl max-h-[90vh] overflow-y-auto"
			>
				<div class="p-6 border-b border-border-subtle">
					<div class="flex items-center justify-between">
						<h2 id="edit-modal-title" class="text-xl font-semibold text-text-strong">발매 수정</h2>
						<button
							onclick={() => {
								showEditModal = false;
								editingRelease = null;
								resetForm();
							}}
							class="template-close-btn w-8 h-8 flex items-center justify-end rounded-md text-text-muted transition-colors border border-transparent pl-2 pr-0"
							type="button"
							aria-label="닫기"
						>
							<X size={20} />
						</button>
					</div>
				</div>

				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
					class="p-6 space-y-6"
				>
					<!-- 제목 -->
					<div>
						<label for="edit-release-title" class="block text-sm font-medium text-text-strong mb-2">
							발매 제목 <span class="text-brand-pink">*</span>
						</label>
						<input
							id="edit-release-title"
							type="text"
							bind:value={formData.title}
							placeholder="예: Sugar Rush Vol.1"
							class="input-base w-full px-3 py-2 {validationErrors.title ? 'border-red-500' : ''}"
							required
						/>
						{#if validationErrors.title}
							<p class="text-xs text-red-500 mt-1">{validationErrors.title}</p>
						{/if}
					</div>

					<!-- 설명 -->
					<div>
						<label for="edit-release-description" class="block text-sm font-medium text-text-strong mb-2">
							설명
						</label>
						<textarea
							id="edit-release-description"
							bind:value={formData.description}
							placeholder="발매에 대한 설명을 입력하세요..."
							rows="3"
							class="input-base w-full px-3 py-2 resize-none"
						></textarea>
					</div>

					<!-- 발매일 -->
					<div>
						<label for="edit-release-date" class="block text-sm font-medium text-text-strong mb-2">
							발매일 <span class="text-brand-pink">*</span>
						</label>
						<DatePicker
							id="edit-release-date"
							bind:value={formData.releaseDate}
							placeholder="발매일 선택"
						/>
						{#if validationErrors.releaseDate}
							<p class="text-xs text-red-500 mt-1">{validationErrors.releaseDate}</p>
						{/if}
					</div>

					<!-- 상태 -->
					<div>
						<label for="edit-release-status" class="block text-sm font-medium text-text-strong mb-2">
							상태
						</label>
						<select
							id="edit-release-status"
							bind:value={formData.status}
							class="input-base w-full px-3 py-2"
						>
							<option value="draft">초안</option>
							<option value="scheduled">예정됨</option>
							<option value="live">발매됨</option>
						</select>
					</div>

					<!-- 플랫폼 -->
					<div>
						<span class="block text-sm font-medium text-text-strong mb-2">
							플랫폼 <span class="text-brand-pink">*</span>
						</span>
						<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
							{#each platformOptions as platform}
								<label class="flex items-center gap-2 p-2 rounded border border-border-subtle cursor-pointer hover:bg-surface-2 transition-colors {formData.platforms.includes(platform) ? 'bg-brand-pink/10 border-brand-pink' : ''}">
									<input
										type="checkbox"
										checked={formData.platforms.includes(platform)}
										onchange={() => togglePlatform(platform)}
										class="rounded"
									/>
									<span class="text-sm text-text-strong">{platform}</span>
								</label>
							{/each}
						</div>
						{#if validationErrors.platforms}
							<p class="text-xs text-red-500 mt-1">{validationErrors.platforms}</p>
						{/if}
					</div>

					<!-- 버튼 -->
					<div class="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
						<button
							type="button"
							onclick={() => {
								showEditModal = false;
								editingRelease = null;
								resetForm();
							}}
							class="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-strong transition-colors"
							disabled={isSubmitting}
						>
							취소
						</button>
						<button
							type="submit"
							class="px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isSubmitting}
						>
							{isSubmitting ? '수정 중...' : '수정'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</PageContent>
