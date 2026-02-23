<script lang="ts">
	import { Plus, Search, Edit2, Trash2, X, Link, Mic, SearchX, ChevronDown, ArrowUpDown, ImagePlus, Music, Play, Pause } from 'lucide-svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import type { VirtualVocal } from '$lib/types/suno';
	import { MAX_FILE_SIZE_BYTES, FILE_UPLOAD_BUTTON_LABEL } from '$lib/constants/upload';

	// 검색 상태
	let searchQuery = $state('');
	
	// 정렬 상태
	type SortOption = 'name_asc' | 'name_desc' | 'tracks_desc' | 'tracks_asc' | 'created_desc' | 'created_asc';
	let sortBy = $state<SortOption>('tracks_desc');
	let sortDropdownOpen = $state(false);
	
	const sortLabels: Record<SortOption, string> = {
		name_asc: '이름순 (A-Z)',
		name_desc: '이름순 (Z-A)',
		tracks_desc: '연결 트랙 많은순',
		tracks_asc: '연결 트랙 적은순',
		created_desc: '최근 생성순',
		created_asc: '오래된 생성순'
	};

	// 모달: null = 추가, 값 있음 = 수정
	let editingVocal = $state<VirtualVocal | null>(null);
	type VocalForm = {
		name: string;
		description: string;
		imageUrlInput: string;
		imageFileDataUrl: string;
		demoAudioUrlInput: string;
		demoAudioFileDataUrl: string;
	};
	let vocalForm = $state<VocalForm>({
		name: '',
		description: '',
		imageUrlInput: '',
		imageFileDataUrl: '',
		demoAudioUrlInput: '',
		demoAudioFileDataUrl: ''
	});

	function openAddModal() {
		editingVocal = null;
		vocalForm = {
			name: '',
			description: '',
			imageUrlInput: '',
			imageFileDataUrl: '',
			demoAudioUrlInput: '',
			demoAudioFileDataUrl: ''
		};
		showVocalModal = true;
	}

	function openEditModal(vocal: VirtualVocal) {
		editingVocal = vocal;
		const imageUrl = vocal.imageUrl ?? '';
		const demoUrl = vocal.demoAudioUrl ?? '';
		vocalForm = {
			name: vocal.name,
			description: vocal.description ?? '',
			imageUrlInput: imageUrl.startsWith('http') ? imageUrl : '',
			imageFileDataUrl: imageUrl.startsWith('data:') ? imageUrl : '',
			demoAudioUrlInput: demoUrl.startsWith('http') ? demoUrl : '',
			demoAudioFileDataUrl: demoUrl.startsWith('data:') ? demoUrl : ''
		};
		showVocalModal = true;
	}

	let showVocalModal = $state(false);

	function closeVocalModal() {
		editingVocal = null;
		showVocalModal = false;
	}

	function readFileAsDataUrl(file: File, maxSize: number): Promise<string> {
		return new Promise((resolve, reject) => {
			if (file.size > maxSize) {
				reject(new Error(`파일 크기는 1GB 이하여야 합니다.`));
				return;
			}
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(reader.error);
			reader.readAsDataURL(file);
		});
	}

	function onImageFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			alert('이미지 파일만 선택해 주세요.');
			return;
		}
		readFileAsDataUrl(file, MAX_FILE_SIZE_BYTES)
			.then((dataUrl) => {
				vocalForm = { ...vocalForm, imageFileDataUrl: dataUrl, imageUrlInput: '' };
			})
			.catch((err) => alert(err.message));
		input.value = '';
	}

	function onAudioFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if (!file.type.startsWith('audio/')) {
			alert('음원 파일만 선택해 주세요.');
			return;
		}
		readFileAsDataUrl(file, MAX_FILE_SIZE_BYTES)
			.then((dataUrl) => {
				vocalForm = { ...vocalForm, demoAudioFileDataUrl: dataUrl, demoAudioUrlInput: '' };
			})
			.catch((err) => alert(err.message));
		input.value = '';
	}

	function clearImageFile() {
		vocalForm = { ...vocalForm, imageFileDataUrl: '' };
	}

	function clearAudioFile() {
		vocalForm = { ...vocalForm, demoAudioFileDataUrl: '' };
	}

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

	// 필터링 및 정렬
	const filteredVocals = $derived.by(() => {
		let result = vocals;
		
		// 검색 필터링
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(v => 
				v.name.toLowerCase().includes(query) || 
				v.description?.toLowerCase().includes(query)
			);
		}
		
		// 정렬
		result = [...result].sort((a, b) => {
			switch (sortBy) {
				case 'name_asc':
					return a.name.localeCompare(b.name);
				case 'name_desc':
					return b.name.localeCompare(a.name);
				case 'tracks_desc':
					return b.linkedTracks.length - a.linkedTracks.length;
				case 'tracks_asc':
					return a.linkedTracks.length - b.linkedTracks.length;
				case 'created_desc':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				case 'created_asc':
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				default:
					return 0;
			}
		});
		
		return result;
	});
	
	// 외부 클릭 처리
	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.sort-dropdown')) {
			sortDropdownOpen = false;
		}
	}

	$effect(() => {
		if (sortDropdownOpen) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
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

	// 저장 (추가 또는 수정)
	function saveVocal() {
		if (!vocalForm.name.trim()) return;

		const imageUrl = vocalForm.imageUrlInput.trim() || vocalForm.imageFileDataUrl || undefined;
		const demoAudioUrl = vocalForm.demoAudioUrlInput.trim() || vocalForm.demoAudioFileDataUrl || undefined;

		if (editingVocal) {
			vocals = vocals.map((v) =>
				v.id === editingVocal!.id
					? {
							...v,
							name: vocalForm.name.trim(),
							description: vocalForm.description.trim() || undefined,
							imageUrl,
							demoAudioUrl
						}
					: v
			);
			closeVocalModal();
		} else {
			vocals = [...vocals, {
				id: `v_${Date.now()}`,
				name: vocalForm.name.trim(),
				description: vocalForm.description.trim() || undefined,
				imageUrl,
				demoAudioUrl,
				linkedTracks: [],
				createdAt: new Date().toISOString().split('T')[0]
			}];
			closeVocalModal();
		}
	}

	// 카드용 커스텀 오디오 플레이어 상태
	const audioNodes = new Map<string, HTMLAudioElement>();
	let audioTimes = $state<Record<string, { current: number; duration: number }>>({});
	let activeAudioId = $state<string | null>(null);
	let audioErrorIds = $state<Set<string>>(new Set());
	let expandedDescriptionIds = $state<Set<string>>(new Set());
	let expandableDescriptionIds = $state<Set<string>>(new Set());

	function formatAudioTime(seconds: number) {
		if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
		const total = Math.floor(seconds);
		const minutes = Math.floor(total / 60);
		const remain = total % 60;
		return `${minutes}:${String(remain).padStart(2, '0')}`;
	}

	function getAudioState(id: string) {
		return audioTimes[id] ?? { current: 0, duration: 0 };
	}

	function syncAudioState(id: string, node: HTMLAudioElement) {
		audioTimes = {
			...audioTimes,
			[id]: {
				current: Number.isFinite(node.currentTime) ? node.currentTime : 0,
				duration: Number.isFinite(node.duration) ? node.duration : 0
			}
		};
	}

	function setAudioErrorState(id: string, hasError: boolean) {
		const next = new Set(audioErrorIds);
		if (hasError) next.add(id);
		else next.delete(id);
		audioErrorIds = next;
	}

	function audioRef(node: HTMLAudioElement, id: string) {
		audioNodes.set(id, node);
		syncAudioState(id, node);

		const onPlay = () => {
			if (activeAudioId && activeAudioId !== id) {
				const prev = audioNodes.get(activeAudioId);
				prev?.pause();
			}
			activeAudioId = id;
			syncAudioState(id, node);
		};
		const onPause = () => {
			if (activeAudioId === id) activeAudioId = null;
			syncAudioState(id, node);
		};
		const onEnded = () => {
			activeAudioId = null;
			syncAudioState(id, node);
		};
		const onTimeUpdate = () => syncAudioState(id, node);
		const onLoadedMetadata = () => {
			setAudioErrorState(id, false);
			syncAudioState(id, node);
		};
		const onError = () => {
			setAudioErrorState(id, true);
			if (activeAudioId === id) activeAudioId = null;
		};

		node.addEventListener('play', onPlay);
		node.addEventListener('pause', onPause);
		node.addEventListener('ended', onEnded);
		node.addEventListener('timeupdate', onTimeUpdate);
		node.addEventListener('loadedmetadata', onLoadedMetadata);
		node.addEventListener('error', onError);

		return {
			destroy() {
				node.removeEventListener('play', onPlay);
				node.removeEventListener('pause', onPause);
				node.removeEventListener('ended', onEnded);
				node.removeEventListener('timeupdate', onTimeUpdate);
				node.removeEventListener('loadedmetadata', onLoadedMetadata);
				node.removeEventListener('error', onError);
				audioNodes.delete(id);
				setAudioErrorState(id, false);
				if (activeAudioId === id) activeAudioId = null;
			}
		};
	}

	function toggleAudio(id: string) {
		const node = audioNodes.get(id);
		if (!node) return;
		if (audioErrorIds.has(id)) return;
		if (node.paused) {
			node.play().catch(() => {});
		} else {
			node.pause();
		}
	}

	function seekAudio(id: string, event: Event) {
		const node = audioNodes.get(id);
		if (!node) return;
		const target = event.currentTarget as HTMLInputElement;
		node.currentTime = Number(target.value);
		syncAudioState(id, node);
	}

	function toggleDescription(id: string) {
		if (!expandableDescriptionIds.has(id)) return;
		const next = new Set(expandedDescriptionIds);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		expandedDescriptionIds = next;
	}

	function hasDescription(description?: string) {
		return Boolean((description ?? '').trim());
	}

	function isDescriptionExpandable(id: string) {
		return expandableDescriptionIds.has(id);
	}

	function setDescriptionExpandable(id: string, expandable: boolean) {
		const next = new Set(expandableDescriptionIds);
		if (expandable) next.add(id);
		else next.delete(id);
		expandableDescriptionIds = next;
	}

	function updateDescriptionExpandable(id: string, node: HTMLElement) {
		// 확장 상태여도 "접힌 상태(line-clamp-1)" 기준으로 실제 오버플로우를 측정
		const isExpanded = expandedDescriptionIds.has(id);
		if (isExpanded) {
			node.classList.add('line-clamp-1');
		}

		const expandable = node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1;
		setDescriptionExpandable(id, expandable);

		if (isExpanded) {
			node.classList.remove('line-clamp-1');
		}
	}

	function descriptionRef(node: HTMLElement, id: string) {
		const update = () => updateDescriptionExpandable(id, node);
		const raf = requestAnimationFrame(update);
		const observer = new ResizeObserver(update);
		observer.observe(node);

		return {
			destroy() {
				cancelAnimationFrame(raf);
				observer.disconnect();
			}
		};
	}

	$effect(() => {
		const visibleIds = new Set(filteredVocals.map((v) => v.id));
		const nextExpanded = new Set([...expandedDescriptionIds].filter((id) => visibleIds.has(id)));
		if (nextExpanded.size !== expandedDescriptionIds.size) {
			expandedDescriptionIds = nextExpanded;
		}
		const nextExpandable = new Set([...expandableDescriptionIds].filter((id) => visibleIds.has(id)));
		if (nextExpandable.size !== expandableDescriptionIds.size) {
			expandableDescriptionIds = nextExpandable;
		}
		return () => {};
	});

	$effect(() => {
		// 현재 화면 폭에서 더 이상 접을 내용이 없으면 자동으로 확장 상태 해제
		const nextExpanded = new Set([...expandedDescriptionIds].filter((id) => expandableDescriptionIds.has(id)));
		if (nextExpanded.size !== expandedDescriptionIds.size) {
			expandedDescriptionIds = nextExpanded;
		}
		return () => {};
	});
</script>

<svelte:head>
	<title>가상 보컬 관리 | SUNO 제작</title>
</svelte:head>

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">SUNO AI로 생성되는 가상 보컬과 보컬팀을 관리합니다</p>
			</div>
		<button
			type="button"
			onclick={() => openAddModal()}
			class="page-header-action-button inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg transition-colors duration-200 font-medium page-header-primary-button bg-brand-pink text-[var(--surface-2)] hover:[&>svg]:!text-[var(--surface-2)] focus:bg-brand-pink focus:text-white focus:[&>svg]:!text-white focus-visible:bg-brand-pink focus-visible:text-white focus-visible:[&>svg]:!text-white focus:outline-none focus:ring-0 flex-shrink-0"
		>
			<Plus size={16} />
			보컬 추가
		</button>
		</div>
	</div>

	<!-- 탭 + 콘텐츠 -->
	<SUNOTabs>
		<!-- 필터 영역 -->
		<div class="mb-6 space-y-3">
			<!-- 검색 (윗줄) -->
			<div class="relative group">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search size={16} class="lucide-icon lucide-search filter-search-icon" />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="보컬 이름 또는 설명 검색..."
					class="filter-search-input w-full pl-10 {searchQuery.trim() ? 'pr-10' : 'pr-4'} py-1.5 bg-surface-2 border border-border-subtle border-[1px] rounded-md text-text-base placeholder:text-text-base placeholder:opacity-100 focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
					aria-label="보컬 검색"
					id="vocal-search"
					autocomplete="off"
				/>
				{#if searchQuery.trim()}
					<button
						type="button"
						onclick={() => {
							searchQuery = '';
							const input = document.getElementById('vocal-search') as HTMLInputElement;
							input?.focus();
						}}
						class="search-clear-button absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent"
						aria-label="검색 초기화"
					>
						<X size={16} class="lucide-icon" />
					</button>
				{/if}
			</div>

			<!-- 정렬 (아랫줄) -->
			<div class="grid grid-cols-1 gap-3">
				<div class="relative sort-dropdown">
					<button
						type="button"
						onclick={() => sortDropdownOpen = !sortDropdownOpen}
						aria-haspopup="listbox"
						aria-expanded={sortDropdownOpen}
						class="status-filter-btn flex items-center pl-10 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink"
					>
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<ArrowUpDown size={16} class="lucide-icon filter-control-icon transition-colors duration-200" />
						</div>
						<span class="flex-1 text-left truncate">
							{sortLabels[sortBy]}
						</span>
						<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
						</div>
					</button>
					{#if sortDropdownOpen}
						<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10 overflow-hidden">
							{#each Object.entries(sortLabels) as [value, label]}
								<li
									role="option"
									aria-selected={sortBy === value}
									tabindex="0"
									onclick={() => { sortBy = value as SortOption; sortDropdownOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { sortBy = value as SortOption; sortDropdownOpen = false; } }}
									class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {sortBy === value ? 'bg-brand-pink text-white' : 'text-text-base'}"
								>
									{label}
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>

		<!-- 보컬 그리드 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredVocals as vocal}
				<div class="vocal-card bg-surface-2 rounded-lg border border-border-subtle p-4 transition-colors flex flex-col min-h-[150px]">
					<!-- 상단: 아바타/이름 + 생성일(우측 상단) -->
					<div class="flex items-start justify-between gap-3 mb-2">
						<div class="flex items-start gap-4 min-w-0 flex-1">
							{#if vocal.imageUrl}
								<img
									src={vocal.imageUrl}
									alt=""
									class="w-[72px] h-[72px] rounded-lg object-cover border border-border-subtle flex-shrink-0 bg-surface-2 cursor-default pointer-events-none select-none"
								/>
							{:else}
								<div class="w-[72px] h-[72px] rounded-lg vocal-avatar-fallback flex items-center justify-center text-2xl font-semibold flex-shrink-0 cursor-default pointer-events-none select-none">
									{vocal.name.charAt(0)}
								</div>
							{/if}
							<div class="flex-1 min-w-0">
								<h3 class="text-lg font-semibold text-text-strong truncate">{vocal.name}</h3>
								<p
									id={"vocal-description-" + vocal.id}
									use:descriptionRef={vocal.id}
									class="text-sm text-text-muted mt-1 {expandedDescriptionIds.has(vocal.id) ? '' : 'line-clamp-1'}"
								>
									{vocal.description || '설명 없음'}
								</p>
								{#if hasDescription(vocal.description)}
									<button
										type="button"
										class="text-sm font-semibold px-0 py-1 rounded transition-colors text-left {isDescriptionExpandable(vocal.id) ? 'more-link text-brand-pink' : 'text-text-muted opacity-60 pointer-events-none'}"
										onclick={() => toggleDescription(vocal.id)}
										aria-label={expandedDescriptionIds.has(vocal.id) ? '보컬 설명 접기' : '보컬 설명 더보기'}
										aria-expanded={expandedDescriptionIds.has(vocal.id)}
										aria-controls={"vocal-description-" + vocal.id}
										disabled={!isDescriptionExpandable(vocal.id)}
									>
										{expandedDescriptionIds.has(vocal.id) ? '접기' : '더보기'}
									</button>
								{/if}
							</div>
						</div>
						<div class="text-xs text-text-muted flex-shrink-0 pt-0.5 text-right">
							<div>생성: {vocal.createdAt}</div>
							<div class="mt-1 inline-flex items-center justify-end gap-1.5 text-text-muted">
								<Link size={13} />
								<span>{vocal.linkedTracks.length}개 트랙</span>
							</div>
						</div>
					</div>

					<!-- 데모 음원 (없어도 같은 자리/모양 유지) -->
					{#if vocal.demoAudioUrl}
						<div class="py-2">
							<audio src={vocal.demoAudioUrl} preload="metadata" class="sr-only" use:audioRef={vocal.id}></audio>
							<div class="w-full h-10 flex items-center gap-1.5 modal-audio-shell card-audio-shell">
								<button
									type="button"
									class="w-7 h-7 text-text-base inline-flex items-center justify-center transition-colors modal-audio-play-btn"
									onclick={() => toggleAudio(vocal.id)}
									aria-label={activeAudioId === vocal.id ? '일시정지' : '재생'}
								>
									{#if activeAudioId === vocal.id}
										<Pause size={14} />
									{:else}
										<Play size={14} />
									{/if}
								</button>
								<span class="text-xs tabular-nums w-[2.25rem]">
									{formatAudioTime(getAudioState(vocal.id).current)}
								</span>
								<input
									type="range"
									min="0"
									max={Math.max(getAudioState(vocal.id).duration, 0)}
									step="0.1"
									value={Math.min(getAudioState(vocal.id).current, getAudioState(vocal.id).duration || 0)}
									oninput={(e) => seekAudio(vocal.id, e)}
									class="flex-1 h-1.5 modal-audio-range"
									style="--range-progress: {getAudioState(vocal.id).duration > 0 ? (getAudioState(vocal.id).current / getAudioState(vocal.id).duration) * 100 : 0}%;"
									aria-label="재생 위치"
								/>
								<span class="text-xs tabular-nums w-[2.25rem] text-right">
									{formatAudioTime(getAudioState(vocal.id).duration)}
								</span>
							</div>
							{#if audioErrorIds.has(vocal.id)}
								<p class="mt-1 text-xs text-text-muted">오디오를 재생할 수 없습니다</p>
							{/if}
						</div>
					{:else}
						<div class="mt-2 mb-2">
							<div class="w-full h-10 px-2.5 rounded-md border border-border-subtle flex items-center gap-2 text-xs vocal-audio-empty">
								<Music size={14} />
								<span>데모 음원 없음</span>
							</div>
						</div>
					{/if}

					<!-- 액션 (보더는 카드 양쪽 끝까지 이어지도록 -mx-5 px-5) -->
					<div class="-mx-4 px-4 pt-2 flex items-center justify-end gap-2">
						<button type="button" class="btn-icon" aria-label="수정" onclick={() => openEditModal(vocal)}>
							<Edit2 size={16} />
						</button>
						<button
							type="button"
							class="btn-icon text-red-400 hover:text-red-500"
							onclick={() => deleteVocal(vocal.id)}
							aria-label="삭제"
						>
							<Trash2 size={16} />
						</button>
					</div>
				</div>
			{/each}

			{#if filteredVocals.length === 0}
				<div class="col-span-full py-16 text-center">
					{#if searchQuery}
						<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-2 mb-4">
							<SearchX size={28} class="text-text-muted" />
						</div>
						<p class="text-text-base font-medium mb-2">검색 결과가 없습니다</p>
						<p class="text-text-muted text-sm mb-4">다른 검색어를 시도해보세요</p>
						<button
							type="button"
							onclick={() => searchQuery = ''}
							class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-pink border border-brand-pink rounded-lg hover:bg-brand-pink hover:text-white transition-colors"
						>
							<X size={14} />
							검색 초기화
						</button>
					{:else}
						<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-2 mb-4">
							<Mic size={28} class="text-text-muted" />
						</div>
						<p class="text-text-base font-medium mb-2">등록된 보컬이 없습니다</p>
						<p class="text-text-muted text-sm mb-4">가상 보컬을 추가해보세요</p>
						<button
							type="button"
							onclick={() => openAddModal()}
							class="page-header-action-button inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg transition-colors duration-200 font-medium page-header-primary-button bg-brand-pink text-[var(--surface-2)] hover:[&>svg]:!text-[var(--surface-2)] focus:bg-brand-pink focus:text-white focus:[&>svg]:!text-white focus-visible:bg-brand-pink focus-visible:text-white focus-visible:[&>svg]:!text-white focus:outline-none focus:ring-0"
						>
							<Plus size={16} />
							보컬 추가하기
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<!-- 통계 -->
		<div class="mt-6">
			<div class="flex flex-wrap items-center gap-4 text-sm">
				<span class="text-text-muted">
					총 <span class="font-medium text-text-base">{vocals.length}</span>개 보컬
				</span>
				<span class="text-border-subtle">|</span>
				<span class="text-text-muted">
					표시 중 <span class="font-medium text-text-base">{filteredVocals.length}</span>개
				</span>
			</div>
		</div>
	</SUNOTabs>
</div>

<!-- 보컬 추가/수정 모달 -->
{#if showVocalModal}
	<div
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
		onclick={() => closeVocalModal()}
		onkeydown={(e) => { if (e.key === 'Escape') closeVocalModal(); }}
		role="dialog"
		aria-modal="true"
		aria-labelledby="vocal-modal-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
		<div
			class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
				<h2 id="vocal-modal-title" class="text-lg font-semibold text-text-strong">
					{editingVocal ? '보컬 수정' : '새 보컬 추가'}
				</h2>
				<button
					type="button"
					onclick={() => closeVocalModal()}
					class="template-close-btn w-8 h-8 flex items-center justify-end rounded-md text-text-muted transition-colors border border-transparent pl-2 pr-0"
					aria-label="닫기"
				>
					<X size={20} />
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); saveVocal(); }} class="flex flex-1 min-h-0 flex-col">
				<div class="p-6 space-y-4 overflow-y-auto custom-list-scrollbar modal-scroll-body flex-1 min-h-0">
					<!-- 이름 -->
					<div>
						<label for="vocal-name" class="block text-sm font-medium text-text-strong mb-2">보컬 이름</label>
						<input
							type="text"
							id="vocal-name"
							bind:value={vocalForm.name}
							class="input-base"
							placeholder="예: Luna, Sugar Rush Collective"
							required
						/>
					</div>

					<!-- 설명 -->
					<div>
						<label for="vocal-desc" class="block text-sm font-medium text-text-strong mb-2">설명</label>
						<textarea
							id="vocal-desc"
							bind:value={vocalForm.description}
							class="input-base h-24 min-h-24 resize-none overflow-y-auto custom-list-scrollbar"
							placeholder="보컬 특성, 음색, 전문 분야 등"
							spellcheck="true"
							lang="ko"
						></textarea>
					</div>

					<!-- 사진 (URL 또는 파일) -->
					<div>
						<div class="block text-sm font-medium text-text-strong mb-2">
							사진 <span class="text-text-muted font-normal">(선택)</span>
						</div>
						{#if vocalForm.imageFileDataUrl}
							<div class="flex items-center gap-2 py-2">
								<img src={vocalForm.imageFileDataUrl} alt="" class="w-12 h-12 rounded-lg object-cover border border-border-subtle" />
								<span class="text-sm text-text-muted">파일 선택됨</span>
								<button type="button" onclick={() => clearImageFile()} class="text-xs text-brand-pink hover:underline">제거</button>
							</div>
						{:else}
							<div class="flex items-center gap-2">
								<input
									type="url"
									id="vocal-image-url"
									bind:value={vocalForm.imageUrlInput}
									class="input-base flex-1 min-w-0 h-10"
									placeholder="https:// 이미지 주소"
								/>
								<label class="btn-outline-hover audio-upload-trigger">
									<input type="file" accept="image/*" class="sr-only" onchange={onImageFileChange} />
									{FILE_UPLOAD_BUTTON_LABEL}
								</label>
							</div>
						{/if}
					</div>

					<!-- 데모 음원 (URL 또는 파일) -->
					<div>
						<div class="block text-sm font-medium text-text-strong mb-2">
							데모 음원 <span class="text-text-muted font-normal">(선택)</span>
						</div>
						{#if vocalForm.demoAudioFileDataUrl}
							<div class="py-2 space-y-2">
								<audio src={vocalForm.demoAudioFileDataUrl} preload="metadata" class="sr-only" use:audioRef={'modal-audio-preview'}></audio>
								<div class="w-full h-10 flex items-center gap-1.5 modal-audio-shell">
									<button
										type="button"
										class="w-7 h-7 text-text-base inline-flex items-center justify-center transition-colors modal-audio-play-btn"
										onclick={() => toggleAudio('modal-audio-preview')}
										aria-label={activeAudioId === 'modal-audio-preview' ? '일시정지' : '재생'}
									>
										{#if activeAudioId === 'modal-audio-preview'}
											<Pause size={14} />
										{:else}
											<Play size={14} />
										{/if}
									</button>
									<span class="text-xs tabular-nums w-[2.25rem]">
										{formatAudioTime(getAudioState('modal-audio-preview').current)}
									</span>
									<input
										type="range"
										min="0"
										max={Math.max(getAudioState('modal-audio-preview').duration, 0)}
										step="0.1"
										value={Math.min(getAudioState('modal-audio-preview').current, getAudioState('modal-audio-preview').duration || 0)}
										oninput={(e) => seekAudio('modal-audio-preview', e)}
										class="flex-1 h-1.5 modal-audio-range"
										style="--range-progress: {getAudioState('modal-audio-preview').duration > 0 ? (getAudioState('modal-audio-preview').current / getAudioState('modal-audio-preview').duration) * 100 : 0}%;"
										aria-label="재생 위치"
									/>
									<span class="text-xs tabular-nums w-[2.25rem] text-right">
										{formatAudioTime(getAudioState('modal-audio-preview').duration)}
									</span>
								</div>
								{#if audioErrorIds.has('modal-audio-preview')}
									<p class="text-xs text-text-muted">오디오를 재생할 수 없습니다</p>
								{/if}
								<div class="flex justify-end">
									<button type="button" onclick={() => clearAudioFile()} class="text-xs text-brand-pink hover:underline shrink-0">제거</button>
								</div>
							</div>
						{:else}
							<div class="flex items-center gap-2">
								<input
									type="url"
									id="vocal-audio-url"
									bind:value={vocalForm.demoAudioUrlInput}
									class="input-base flex-1 min-w-0 h-10"
									placeholder="https:// 음원 주소"
								/>
								<label class="btn-outline-hover audio-upload-trigger">
									<input type="file" accept="audio/*" class="sr-only" onchange={onAudioFileChange} />
									{FILE_UPLOAD_BUTTON_LABEL}
								</label>
							</div>
						{/if}
					</div>
				</div>

				<!-- 버튼: 보더 양쪽 이어지게 -->
				<div class="px-6 py-4 border-t border-border-subtle flex justify-end gap-3 flex-shrink-0">
					<button
						type="button"
						onclick={() => closeVocalModal()}
						class="btn-outline-hover px-6 py-2 text-text-base rounded-md border border-border-subtle transition-colors font-medium text-sm"
					>
						취소
					</button>
					<button
						type="submit"
						class="page-header-primary-button inline-flex items-center justify-center gap-2 px-6 py-2 bg-brand-pink text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-0"
					>
						{editingVocal ? '저장' : '추가'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
