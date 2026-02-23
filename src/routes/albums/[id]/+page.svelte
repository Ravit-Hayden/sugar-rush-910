<script lang="ts">
	import { page } from '$app/stores';
	import { goto, beforeNavigate } from '$app/navigation';
	import type { PageData } from './$types';
	import { Disc3, Play, Edit, MoreVertical, Download, Share2, Trash2, Music } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { getStatusColor, getStatusLabel } from '$lib/utils/status';
	import { fade } from 'svelte/transition';
	import { mockAlbums } from '$lib/mocks/albums';

	let { data }: { data: PageData } = $props();

	const albums = mockAlbums;

	// 페이지 데이터에서 앨범 ID 가져오기
	let albumId = $derived(data.albumId || $page.params.id || '');
	let album = $derived(albums.find(a => a.id === albumId));
	let imageError = $state(false);
	let moreMenuOpen = $state(false);
	let selectedTrackId = $state<string | null>(null);
	let isGenreOpen = $state(false);

	// 외부 클릭 시 더보기 메뉴 닫기
	$effect(() => {
		if (!moreMenuOpen) return () => {};

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
		if (!moreMenuOpen) return () => {};

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

	// 외부 클릭 시 장르 말풍선 닫기
	$effect(() => {
		if (!isGenreOpen) return () => {};

		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (!target.closest('.genre-popover-container')) {
				isGenreOpen = false;
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

	// Escape 키로 장르 말풍선 닫기
	$effect(() => {
		if (!isGenreOpen) return () => {};

		function handleEscape(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				isGenreOpen = false;
			}
		}

		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	});

	function handlePlayAlbum() {
		// 실제 재생 로직 구현 예정
	}

	function handleEdit() {
		goto(`/albums/${albumId}/edit`);
	}

	function handleDelete() {
		if (confirm(`정말 "${album?.title}" 앨범을 삭제하시겠습니까?`)) {
			// 실제 삭제 로직 구현 예정
			goto('/albums');
		}
	}

	function handleDownload() {
		// 실제 다운로드 로직 구현 예정
	}

	function handleShare() {
		// 실제 공유 로직 구현 예정
	}

	function handleTrackClick(trackId: string, trackTitle: string) {
		goto(`/tracks/${trackId}`);
	}

	function handlePlayTrack(trackId: string, trackTitle: string) {
		// 실제 재생 로직 구현 예정
	}
</script>

{#if !album}
	<PageContent>
		<EmptyState 
			title="앨범을 찾을 수 없습니다" 
			description="요청하신 앨범이 존재하지 않습니다."
			actionLabel="앨범 목록으로 돌아가기"
			onAction={() => goto('/albums')}
		/>
	</PageContent>
{:else}
	<PageContent>
		<PageHeader 
			title={album.title}
			description="{album.artist} • {(() => {
				// 국내 발매일이 있으면 해당 연도 사용
				if (album.release_date_kr) {
					const date = new Date(album.release_date_kr);
					if (!isNaN(date.getTime())) {
						return date.getFullYear();
					}
				}
				// 국내 발매일이 없고 해외 발매일이 있으면 해외 발매일의 연도 사용
				if (album.release_date_global) {
					const date = new Date(album.release_date_global);
					if (!isNaN(date.getTime())) {
						return date.getFullYear();
					}
				}
				// 둘 다 없으면 앨범의 year 필드 사용 (하위 호환성)
				return album.year || new Date().getFullYear();
			})()}"
			actions={[
				{
					icon: Play,
					label: '재생',
					onclick: handlePlayAlbum
				},
				{
					icon: Edit,
					label: '편집',
					onclick: handleEdit
				}
			]}
		/>

		<!-- 앨범 정보 카드 -->
		<div class="flex flex-col md:flex-row bg-surface-1 rounded-lg border border-border-subtle overflow-hidden mb-6 md:h-64">

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

			<div class="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-surface-1">

				<div class="flex-1 p-4 flex flex-col min-h-0 justify-between">
					
					<div class="flex items-start justify-between mb-2">
						<div class="flex-1 min-w-0 pr-2">
							<div class="flex items-center gap-2 mb-1">
								<h2 class="text-xl font-bold text-text-strong leading-tight truncate">{album.title}</h2>
								<span class="badge-base {getStatusColor(album.status)} flex-shrink-0 text-xs px-1.5 py-0.5">
									{getStatusLabel(album.status)}
								</span>
							</div>
							<p class="text-base text-text-muted leading-snug truncate">{album.artist}</p>
							<p class="text-xs text-text-muted leading-snug">{(() => {
								// 국내 발매일이 있으면 해당 연도 사용
								if (album.release_date_kr) {
									const date = new Date(album.release_date_kr);
									if (!isNaN(date.getTime())) {
										return date.getFullYear();
									}
								}
								// 국내 발매일이 없고 해외 발매일이 있으면 해외 발매일의 연도 사용
								if (album.release_date_global) {
									const date = new Date(album.release_date_global);
									if (!isNaN(date.getTime())) {
										return date.getFullYear();
									}
								}
								// 둘 다 없으면 앨범의 year 필드 사용 (하위 호환성)
								return album.year || new Date().getFullYear();
							})()}</p>
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
								class="btn-icon w-7 h-7 inline-flex items-center justify-center rounded-md action-button"
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
										<button
											role="menuitem"
											onclick={() => { handleDownload(); moreMenuOpen = false; }}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleDownload();
													moreMenuOpen = false;
												}
											}}
											class="btn-ghost group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base text-left"
											aria-label="다운로드"
										>
											<Download size={16} class="text-text-muted" />
											다운로드
										</button>
										<button
											role="menuitem"
											onclick={() => { handleShare(); moreMenuOpen = false; }}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleShare();
													moreMenuOpen = false;
												}
											}}
											class="btn-ghost group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base text-left"
											aria-label="공유"
										>
											<Share2 size={16} class="text-text-muted" />
											공유
										</button>
										<div class="border-t border-border-subtle my-1" role="separator"></div>
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
											<Trash2 size={16} class="text-danger-fg" />
											삭제
										</button>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
						<div>
							<div class="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">트랙 수</div>
							<div class="text-base font-semibold text-text-strong">{album.tracks}곡</div>
						</div>
						<div>
							<div class="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">재생 시간</div>
							<div class="text-base font-semibold text-text-strong">{album.duration}</div>
						</div>
						<div>
							<div class="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">재생 수</div>
							<div class="text-base font-semibold text-hover-cyan">{album.plays.toLocaleString()}</div>
						</div>
						<div>
							<div class="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">좋아요</div>
							<div class="text-base font-semibold text-hover-cyan">{album.likes}</div>
						</div>
					</div>
				</div>

				<div class="px-4 py-3 border-t border-border-subtle bg-surface-1/50 text-xs text-text-muted mt-auto">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
						<div class="flex items-start gap-3">
							<span class="text-text-muted/60 w-16 flex-shrink-0 mt-0.5">장르</span>
							<div class="flex-1 flex flex-wrap gap-x-2 gap-y-1.5 items-center">
								{#if album.genres && album.genres.length > 0}
									{@const visibleCount = album.genres.length > 3 ? 2 : album.genres.length}
									{#each album.genres.slice(0, visibleCount) as genre, i}
										<span class="text-text-base">
											{genre}{i < visibleCount - 1 ? ',' : ''}
										</span>
									{/each}
									{#if album.genres.length > 3}
										<div class="relative inline-flex items-center genre-popover-container">
											<button 
												type="button"
												class="text-xs text-text-muted hover:text-brand-pink transition-colors duration-200 cursor-pointer underline decoration-dotted underline-offset-4" 
												onclick={(e) => {
													e.stopPropagation();
													isGenreOpen = !isGenreOpen;
												}}
												onkeydown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														isGenreOpen = !isGenreOpen;
													}
												}}
												aria-label="나머지 장르 보기"
												aria-expanded={isGenreOpen}
											>
												외 {album.genres.length - 2}개
											</button>

											{#if isGenreOpen}
												<div 
													class="absolute left-0 bottom-full mb-2 w-48 p-3 bg-surface-2 border border-border-subtle rounded-lg z-50 flex flex-wrap gap-1.5"
													role="tooltip"
													aria-live="polite"
													transition:fade={{ duration: 100 }}
												>
													{#each album.genres.slice(2) as hiddenGenre}
														<span class="tag-chip">
															{hiddenGenre}
														</span>
													{/each}
						</div>
											{/if}
							</div>
									{/if}
								{:else}
									<span class="text-text-muted">미정</span>
								{/if}
							</div>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-text-muted/60 w-16 flex-shrink-0 mt-0.5">작업 생성</span>
							<span>{album.created_at}</span>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-text-muted/60 w-16 flex-shrink-0 mt-0.5">국내 발매</span>
							<span>{album.release_date_kr || '미정'}</span>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-text-muted/60 w-16 flex-shrink-0 mt-0.5">해외 발매</span>
							<span>{album.release_date_global || '미정'}</span>
						</div>
					</div>
				</div>

			</div>
		</div>

		<!-- 트랙 목록 -->
		<div class="bg-surface-1 rounded-lg border border-border-subtle">
			<div class="p-6">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-xs text-text-muted uppercase tracking-wider font-medium">트랙 목록</h3>
					<span class="text-xs text-text-muted">{album.trackList.length}곡</span>
				</div>

				{#if album.trackList && album.trackList.length > 0}
					<div class="space-y-1">
						{#each album.trackList as track, index}
							<div
								onclick={() => handleTrackClick(track.id, track.title)}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleTrackClick(track.id, track.title);
									}
								}}
								role="button"
								tabindex="0"
								class="track-item w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-surface-2 transition-colors duration-200 text-left group/track cursor-pointer"
								aria-label="{track.title} 트랙 재생"
							>
								<div class="flex items-center gap-3 flex-1 min-w-0">
									<div class="relative w-6 flex justify-center flex-shrink-0">
										<span class="text-xs text-text-muted group-hover/track:opacity-0 transition-opacity">
										{index + 1}
									</span>
									<button
										onclick={(e) => {
											e.stopPropagation();
											handlePlayTrack(track.id, track.title);
										}}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												e.stopPropagation();
												handlePlayTrack(track.id, track.title);
											}
										}}
											class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/track:opacity-100 transition-opacity w-7 h-7 rounded-full bg-surface-2 hover:bg-brand-pink hover:text-white focus:opacity-100 focus-visible:opacity-100"
										aria-label="{track.title} 재생"
										tabindex="0"
									>
											<Play size={12} class="ml-0.5" />
									</button>
									</div>
									<span class="text-sm font-medium text-text-strong group-hover/track:text-hover-cyan transition-colors track-title truncate flex-1">
										{track.title}
									</span>
								</div>
								<span class="text-xs text-text-muted tabular-nums flex-shrink-0 ml-4">
									{track.duration}
								</span>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8 text-text-muted">
						<Music size={48} class="mx-auto mb-4 opacity-30" />
						<p>트랙이 없습니다</p>
					</div>
				{/if}
			</div>
		</div>
	</PageContent>
{/if}

