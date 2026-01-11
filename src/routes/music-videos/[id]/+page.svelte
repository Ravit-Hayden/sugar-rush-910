<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Video, Play, Edit, Download, Share, ArrowLeft, Users, Palette, Clock, Eye, Heart } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { toast } from '$lib/stores/toast';

	const videoId = $derived($page.params.id);

	// 샘플 뮤직비디오 데이터
	const musicVideos = [
		{
			id: '1',
			title: 'Sugar Rush MV',
			track: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			status: 'published',
			duration: '3:45',
			views: 12500,
			likes: 890,
			thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
			progress: 100,
			characters: ['Sugar Girl', 'Beat Boy'],
			created_at: '2024-10-01',
			description: 'Sugar Rush의 첫 번째 뮤직비디오입니다. 달콤하고 역동적인 비주얼로 트랙의 에너지를 표현했습니다.'
		},
		{
			id: '2',
			title: 'Summer Night MV',
			track: 'Summer Night',
			album: 'Summer Night',
			status: 'published',
			duration: '3:30',
			views: 8900,
			likes: 650,
			thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=200&fit=crop',
			progress: 100,
			characters: ['Summer Girl'],
			created_at: '2024-10-05',
			description: '여름 밤의 로맨틱한 분위기를 담은 뮤직비디오입니다.'
		}
	];

	const video = $derived(musicVideos.find(v => v.id === videoId));

	function getStatusLabel(status: string) {
		switch (status) {
			case 'published': return '발매됨';
			case 'editing': return '편집 중';
			case 'generating': return '생성 중';
			case 'review': return '검토 중';
			case 'draft': return '초안';
			default: return '알 수 없음';
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'published': return 'badge-low-green';
			case 'editing': return 'badge-medium-yellow';
			case 'generating': return 'badge-info-blue';
			case 'review': return 'badge-medium-yellow';
			case 'draft': return 'badge-high-urgent';
			default: return 'text-text-muted';
		}
	}

	function handleEdit() {
		goto(`/music-videos/${videoId}/edit`);
	}

	function handlePlay() {
		toast.add('재생 기능은 곧 제공될 예정입니다.', 'info');
	}

	function handleDownload() {
		toast.add('다운로드 기능은 곧 제공될 예정입니다.', 'info');
	}

	function handleShare() {
		const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/music-videos/${videoId}`;
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard.writeText(url).then(() => {
				toast.add('공유 링크가 클립보드에 복사되었습니다.', 'success');
			}).catch(() => {
				toast.add('공유 링크 복사에 실패했습니다.', 'error');
			});
		}
	}
</script>

{#if !video}
	<PageContent>
		<EmptyState 
			title="뮤직비디오를 찾을 수 없습니다"
			description="요청하신 뮤직비디오가 존재하지 않습니다."
			actionLabel="뮤직비디오 목록으로 돌아가기"
			onAction={() => goto('/music-videos')}
		/>
	</PageContent>
{:else}
	<PageContent>
		<PageHeader 
			title={video.title}
			description="{video.track} • {video.album}"
			actions={[
				{
					icon: ArrowLeft,
					label: '목록으로',
					onclick: () => goto('/music-videos')
				},
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

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- 메인 정보 -->
			<div class="lg:col-span-2 space-y-6">
				<!-- 비디오 플레이어 영역 -->
				<div class="bg-surface-1 rounded-lg overflow-hidden border border-border-subtle">
					<div class="relative aspect-video bg-surface-2">
						{#if video.thumbnail && video.thumbnail !== '/api/placeholder/300/200'}
							<img
								src={video.thumbnail}
								alt={video.title}
								class="w-full h-full object-cover"
							/>
						{:else}
							<div class="absolute inset-0 flex items-center justify-center">
								<Video size={64} class="text-text-muted opacity-30" />
							</div>
						{/if}
						<div class="absolute inset-0 bg-black/30 flex items-center justify-center">
							<button
								onclick={handlePlay}
								class="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center hover:bg-brand-pink/90 transition-colors duration-200"
								aria-label="재생"
							>
								<Play size={24} class="text-white ml-1" />
							</button>
						</div>
					</div>
				</div>

				<!-- 설명 -->
				{#if video.description}
					<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
						<h3 class="text-lg font-semibold text-text-strong mb-4">설명</h3>
						<p class="text-text-base whitespace-pre-wrap">{video.description}</p>
					</div>
				{/if}

				<!-- 캐릭터 -->
				{#if video.characters && video.characters.length > 0}
					<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
						<h3 class="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
							<Users size={20} />
							캐릭터
						</h3>
						<div class="flex flex-wrap gap-2">
							{#each video.characters as character}
								<span class="px-3 py-1.5 bg-surface-2 rounded-lg text-sm text-text-strong border border-border-subtle">
									{character}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- 사이드바 -->
			<div class="space-y-6">
				<!-- 상태 및 통계 -->
				<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
					<h3 class="text-lg font-semibold text-text-strong mb-4">상태</h3>
					<div class="space-y-4">
						<div>
							<div class="text-sm text-text-muted mb-1">상태</div>
							<span class="badge-base {getStatusColor(video.status)}">
								{getStatusLabel(video.status)}
							</span>
						</div>
						<div>
							<div class="text-sm text-text-muted mb-1">준비도</div>
							<div class="w-full bg-surface-2 rounded-full h-2">
								<div 
									class="bg-brand-pink h-2 rounded-full transition-all duration-300" 
									style="width: {video.progress}%"
								></div>
							</div>
							<div class="text-xs text-text-muted mt-1">{video.progress}%</div>
						</div>
					</div>
				</div>

				<!-- 통계 -->
				<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
					<h3 class="text-lg font-semibold text-text-strong mb-4">통계</h3>
					<div class="space-y-4">
						<div class="flex items-center gap-3">
							<Eye size={20} class="text-text-muted" />
							<div class="flex-1">
								<div class="text-sm text-text-muted">조회수</div>
								<div class="text-text-strong">{video.views.toLocaleString()}</div>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<Heart size={20} class="text-text-muted" />
							<div class="flex-1">
								<div class="text-sm text-text-muted">좋아요</div>
								<div class="text-text-strong">{video.likes.toLocaleString()}</div>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<Clock size={20} class="text-text-muted" />
							<div class="flex-1">
								<div class="text-sm text-text-muted">재생 시간</div>
								<div class="text-text-strong">{video.duration}</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 액션 -->
				<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
					<h3 class="text-lg font-semibold text-text-strong mb-4">액션</h3>
					<div class="space-y-3">
						<button
							onclick={handleEdit}
							class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors font-medium"
							type="button"
						>
							<Edit size={16} />
							편집
						</button>
						<button
							onclick={handleDownload}
							class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-surface-2 text-text-strong rounded-lg border border-border-subtle hover:bg-surface-1 transition-colors font-medium"
							type="button"
						>
							<Download size={16} />
							다운로드
						</button>
						<button
							onclick={handleShare}
							class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-surface-2 text-text-strong rounded-lg border border-border-subtle hover:bg-surface-1 transition-colors font-medium"
							type="button"
						>
							<Share size={16} />
							공유
						</button>
					</div>
				</div>

				<!-- 메타 정보 -->
				<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
					<h3 class="text-lg font-semibold text-text-strong mb-4">메타 정보</h3>
					<div class="space-y-3 text-sm">
						<div class="flex justify-between">
							<span class="text-text-muted">생성일</span>
							<span class="text-text-strong">{video.created_at}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-text-muted">트랙</span>
							<span class="text-text-strong">{video.track}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-text-muted">앨범</span>
							<span class="text-text-strong">{video.album}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</PageContent>
{/if}
