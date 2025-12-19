<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { Music, Play, Edit, MoreVertical, Download, FileAudio, UserPlus, Link, Trash2, Disc3 } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import { getStatusColor, getStatusLabel } from '$lib/utils/status';
	import { toast } from '$lib/stores/toast';
	
	let { data }: { data: PageData } = $props();

	// 앨범 샘플 데이터 (앨범 커버 표시용)
	const albums = [
		{ id: '1', title: 'Sugar Rush Vol.1', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
		{ id: '2', title: 'Summer Night', cover: '/api/placeholder/300/300' }
	];

	// 샘플 데이터 (실제로는 API에서 가져올 데이터)
	// 앨범 상세 페이지의 트랙 리스트와 일치하도록 구성
	const tracks = [
		// 앨범 1: Sugar Rush Vol.1
		{ id: '1', title: 'Sugar Rush', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '3:45', status: 'published', plays: 1250, likes: 89, fileSize: '8.2MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
		{ id: '2', title: 'Sweet Dreams', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '4:12', status: 'published', plays: 890, likes: 45, fileSize: '9.1MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
		{ id: '3', title: 'Candy Land', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '3:58', status: 'published', plays: 678, likes: 34, fileSize: '8.9MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
		{ id: '4', title: 'Honey Moon', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '4:30', status: 'published', plays: 567, likes: 28, fileSize: '9.5MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
		{ id: '5', title: 'Sugar High', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '3:20', status: 'published', plays: 456, likes: 22, fileSize: '7.8MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
		{ id: '6', title: 'Sweet Escape', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '4:05', status: 'published', plays: 345, likes: 18, fileSize: '8.5MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
		{ id: '7', title: 'Candy Shop', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '3:50', status: 'published', plays: 234, likes: 15, fileSize: '8.3MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
		{ id: '8', title: 'Sugar Coated', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '4:15', status: 'published', plays: 123, likes: 12, fileSize: '9.2MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
		{ id: '9', title: 'Sweet Surprise', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '3:35', status: 'published', plays: 112, likes: 10, fileSize: '7.9MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
		{ id: '10', title: 'Candy Floss', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '4:00', status: 'published', plays: 98, likes: 8, fileSize: '8.7MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
		{ id: '11', title: 'Sugar Spice', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '3:42', status: 'published', plays: 87, likes: 7, fileSize: '8.1MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
		{ id: '12', title: 'Sweet Victory', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '4:18', status: 'published', plays: 76, likes: 6, fileSize: '9.8MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
		// 앨범 2: Summer Night
		{ id: '13', title: 'Summer Night', artist: 'Sugar Rush', album: 'Summer Night', albumId: '2', genre: 'Pop', duration: '3:45', status: 'draft', plays: 0, likes: 0, fileSize: '7.8MB', created_at: '2024-09-20', release_date_kr: '', release_date_global: '' }
	];

	let trackId = $derived(data.trackId || $page.params.id || '');
	let track = $derived(tracks.find(t => t.id === trackId));
	let album = $derived(track ? albums.find(a => a.id === track.albumId) : null);
	let imageError = $state(false);
	let moreMenuOpen = $state(false);

	// 외부 클릭 시 더보기 메뉴 닫기
	$effect(() => {
		if (!moreMenuOpen) return;

		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (!target.closest('.more-menu-dropdown')) {
				moreMenuOpen = false;
			}
		}

		const timeoutId = setTimeout(() => {
			document.addEventListener('click', handleClickOutside, true);
		}, 0);

		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	// Escape 키로 메뉴 닫기
	$effect(() => {
		if (!moreMenuOpen) return;

		function handleEscape(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				moreMenuOpen = false;
			}
		}

		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	});

	function handlePlay() {
		// 실제 재생 로직 구현 예정
	}

	function handleEdit() {
		goto(`/tracks/${trackId}/edit`);
	}

	function handleDelete() {
		if (confirm(`정말 "${track?.title || '트랙'}" 트랙을 삭제하시겠습니까?`)) {
			// 실제 삭제 로직 구현 예정
			toast.add(`${track?.title || '트랙'}이(가) 삭제되었습니다.`, 'success');
			goto('/tracks');
		}
	}

	function handleDownloadAudio() {
		// 실제 다운로드 로직 구현 예정
		toast.add(`${track?.title || '트랙'} 오디오 다운로드를 시작합니다.`, 'success');
		moreMenuOpen = false;
	}

	function handleDownloadStems() {
		// 실제 스템 다운로드 로직 구현 예정
		toast.add(`${track?.title || '트랙'} 스템 다운로드를 시작합니다.`, 'success');
		moreMenuOpen = false;
	}

	function handleAssignMember() {
		// 실제 멤버 배정 로직 구현 예정
		toast.add(`${track?.title || '트랙'} 멤버 배정 기능은 곧 제공될 예정입니다.`, 'warning');
		moreMenuOpen = false;
	}

	function handleCopyShareLink() {
		// 공유 링크 복사 로직
		const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/tracks/${trackId}`;
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard.writeText(url).then(() => {
				toast.add('공유 링크가 클립보드에 복사되었습니다.', 'success');
			}).catch(() => {
				toast.add('공유 링크 복사에 실패했습니다.', 'error');
			});
		} else {
			toast.add('클립보드 기능을 사용할 수 없습니다.', 'error');
		}
		moreMenuOpen = false;
	}

	function handleAlbumClick() {
		if (track?.albumId) {
			goto(`/albums/${track.albumId}`);
		}
	}
</script>

{#if !track}
	<PageContent>
		<PageHeader 
			title="트랙을 찾을 수 없습니다" 
			description="요청하신 트랙이 존재하지 않습니다."
		/>
		<div class="text-center py-12">
			<p class="text-text-muted mb-4">트랙 ID: {trackId}</p>
			<button 
				onclick={() => goto('/tracks')}
				class="inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium"
			>
				트랙 목록으로 돌아가기
			</button>
		</div>
	</PageContent>
{:else}
	<PageContent>
		<PageHeader 
			title={track.title}
			description="{track.artist} • {track.album}"
			actions={[
				{
					icon: Play,
					label: '재생',
					onclick: handlePlay
				},
				{
					icon: Edit,
					label: '편집',
					onclick: handleEdit
				}
			]}
		/>

		<!-- 트랙 정보 카드 -->
		<div class="flex flex-col md:flex-row bg-surface-1 rounded-lg border border-border-subtle overflow-hidden mb-6 md:h-64">
				<!-- 앨범 커버 -->
				{#if album}
				<div class="relative w-full md:w-64 md:h-full flex-shrink-0 md:min-w-[16rem] bg-surface-2/0 flex items-center justify-center border-b md:border-b-0 md:border-r border-border-subtle overflow-hidden">

					<div class="w-full pt-[100%] relative md:pt-0 md:h-full">
						{#if !imageError && album.cover && album.cover !== '/api/placeholder/300/300'}
							<img
								class="absolute inset-0 w-full h-full object-cover"
								src={album.cover}
								alt="{album.title} 앨범 커버"
								onerror={() => imageError = true}
							/>
						{:else}
							<div class="absolute inset-0 w-full h-full bg-surface-2 flex items-center justify-center text-text-muted">
								<span class="text-xs">No Image</span>
							</div>
						{/if}
					</div>

					</div>
				{/if}

				<!-- 트랙 정보 -->
			<div class="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-surface-1">

				<div class="flex-1 p-4 flex flex-col min-h-0 justify-between">
					
					<div class="flex items-start justify-between mb-2">
						<div class="flex-1 min-w-0 pr-2">
							<div class="flex items-center gap-2 mb-1">
								<h2 class="text-xl font-bold text-text-strong leading-tight truncate">{track.title}</h2>
								<span class="badge-base {getStatusColor(track.status)} flex-shrink-0 text-xs px-1.5 py-0.5">
									{getStatusLabel(track.status)}
								</span>
							</div>
							<p class="text-base text-text-muted leading-snug truncate">{track.artist}</p>
							<button
								onclick={handleAlbumClick}
								class="text-xs text-hover-cyan hover:underline transition-colors duration-200 mt-1 flex items-center truncate"
							>
								<Disc3 size={12} class="inline mr-1 flex-shrink-0" />
								{track.album}
							</button>
						</div>
						
						<div class="relative more-menu-dropdown -ml-1 flex items-start">
							<button
								onclick={() => moreMenuOpen = !moreMenuOpen}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										moreMenuOpen = !moreMenuOpen;
									}
								}}
								class="w-7 h-7 inline-flex items-center justify-center rounded-md hover:bg-transparent focus-visible:bg-transparent hover:text-text-strong focus-visible:text-text-strong transition-colors duration-200 action-button"
								aria-label="더보기"
								aria-expanded={moreMenuOpen}
								aria-haspopup="menu"
								title="더보기"
								tabindex="0"
							>
								<MoreVertical size={14} class="action-button-icon" />
							</button>
							
							{#if moreMenuOpen}
								<div 
									role="menu"
									class="absolute right-0 top-full mt-1 w-48 bg-surface-1 border border-border-subtle rounded-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200"
								>
									<div class="py-1">
										<!-- 섹션 1: 에셋 -->
										<button
											role="menuitem"
											onclick={() => { handleDownloadAudio(); moreMenuOpen = false; }}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleDownloadAudio();
													moreMenuOpen = false;
												}
											}}
											class="btn-ghost group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base text-left"
											aria-label="오디오 다운로드"
										>
											<Download size={16} class="text-text-muted" />
											오디오 다운로드
										</button>
										<button
											role="menuitem"
											onclick={() => { handleDownloadStems(); moreMenuOpen = false; }}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleDownloadStems();
													moreMenuOpen = false;
												}
											}}
											class="btn-ghost group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base text-left"
											aria-label="스템 다운로드"
										>
											<FileAudio size={16} class="text-text-muted" />
											스템(Stems) 다운로드
										</button>
										<div class="border-t border-border-subtle my-1" role="separator"></div>
										<!-- 섹션 2: 협업 -->
										<button
											role="menuitem"
											onclick={() => { handleAssignMember(); moreMenuOpen = false; }}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleAssignMember();
													moreMenuOpen = false;
												}
											}}
											class="btn-ghost group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base text-left"
											aria-label="멤버 배정"
										>
											<UserPlus size={16} class="text-text-muted" />
											멤버 배정
										</button>
										<button
											role="menuitem"
											onclick={() => { handleCopyShareLink(); moreMenuOpen = false; }}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleCopyShareLink();
													moreMenuOpen = false;
												}
											}}
											class="btn-ghost group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base text-left"
											aria-label="공유 링크 복사"
										>
											<Link size={16} class="text-text-muted" />
											공유 링크 복사
										</button>
										<div class="border-t border-border-subtle my-1" role="separator"></div>
										<!-- 섹션 3: 삭제 -->
										<button
											role="menuitem"
											onclick={() => { handleDelete(); moreMenuOpen = false; }}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleDelete();
													moreMenuOpen = false;
												}
											}}
											class="btn-ghost group w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-fg text-left"
											aria-label="삭제"
										>
											<Trash2 size={16} class="text-danger-fg group-hover:text-danger-fg/80" />
											삭제
										</button>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
						<div>
							<div class="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">재생 시간</div>
							<div class="text-base font-semibold text-text-strong">{track.duration}</div>
						</div>
						<div>
							<div class="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">재생 수</div>
							<div class="text-base font-semibold text-hover-cyan">{track.plays.toLocaleString()}</div>
						</div>
						<div>
							<div class="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">좋아요</div>
							<div class="text-base font-semibold text-hover-cyan">{track.likes}</div>
						</div>
						<div>
							<div class="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">파일 크기</div>
							<div class="text-base font-semibold text-text-strong">{track.fileSize}</div>
						</div>
					</div>
							</div>

				<div class="px-4 py-3 border-t border-border-subtle bg-surface-1/50 text-xs text-text-muted mt-auto">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
						<div class="flex items-start gap-3">
							<span class="text-text-muted/60 w-16 flex-shrink-0 mt-0.5">장르</span>
							<span>{track.genre || '미정'}</span>
							</div>
						<div class="flex items-start gap-3">
							<span class="text-text-muted/60 w-16 flex-shrink-0 mt-0.5">작업 생성</span>
							<span>{track.created_at}</span>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-text-muted/60 w-16 flex-shrink-0 mt-0.5">국내 발매</span>
							<span>{track.release_date_kr || '미정'}</span>
							</div>
						<div class="flex items-start gap-3">
							<span class="text-text-muted/60 w-16 flex-shrink-0 mt-0.5">해외 발매</span>
							<span>{track.release_date_global || '미정'}</span>
						</div>
					</div>
				</div>

			</div>
		</div>
	</PageContent>
{/if}

