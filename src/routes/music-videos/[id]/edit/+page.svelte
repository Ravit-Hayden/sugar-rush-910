<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Video, ArrowLeft, Play, Image, Users, Palette, Settings, Wand2, Upload, Save, X } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
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

	// 폼 상태
	let formData = $state({
		title: '',
		description: '',
		status: 'draft',
		characters: [] as string[]
	});

	// 앨범/트랙 목록
	let tracks = [
		{ id: '1', title: 'Sugar Rush', album: 'Sugar Rush Vol.1', duration: '3:45' },
		{ id: '2', title: 'Summer Night', album: 'Summer Night', duration: '3:30' },
		{ id: '3', title: 'Midnight Drive', album: 'Sugar Rush Vol.1', duration: '4:05' }
	];

	let characters = [
		{ id: '1', name: 'Sugar Girl', image: '/api/placeholder/100/100', style: 'cute' },
		{ id: '2', name: 'Beat Boy', image: '/api/placeholder/100/100', style: 'cool' },
		{ id: '3', name: 'Summer Girl', image: '/api/placeholder/100/100', style: 'fresh' }
	];

	let selectedTrack = $state('');
	let selectedCharacters = $state<string[]>([]);
	let isSubmitting = $state(false);

	// 비디오 데이터가 변경되면 폼 데이터 업데이트
	$effect(() => {
		if (video) {
			formData.title = video.title;
			formData.description = video.description || '';
			formData.status = video.status;
			formData.characters = [...video.characters];
			selectedTrack = tracks.find(t => t.title === video.track)?.id || '';
			selectedCharacters = video.characters.map(charName => {
				const char = characters.find(c => c.name === charName);
				return char?.id || '';
			}).filter(Boolean);
		}
		return () => {};
	});

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

	const statusOptions = [
		{ value: 'draft', label: '초안' },
		{ value: 'generating', label: '생성 중' },
		{ value: 'editing', label: '편집 중' },
		{ value: 'review', label: '검토 중' },
		{ value: 'published', label: '발매됨' }
	];

	function handleCharacterToggle(characterId: string) {
		if (selectedCharacters.includes(characterId)) {
			selectedCharacters = selectedCharacters.filter(id => id !== characterId);
			formData.characters = formData.characters.filter(name => {
				const char = characters.find(c => c.id === characterId);
				return name !== char?.name;
			});
		} else {
			selectedCharacters = [...selectedCharacters, characterId];
			const char = characters.find(c => c.id === characterId);
			if (char) {
				formData.characters = [...formData.characters, char.name];
			}
		}
	}

	async function handleSubmit() {
		if (isSubmitting) return;

		if (!formData.title.trim()) {
			toast.add('제목을 입력해주세요.', 'error');
			return;
		}

		isSubmitting = true;

		try {
			// 실제 저장 로직 구현 예정
			await new Promise(resolve => setTimeout(resolve, 500));
			toast.add('뮤직비디오가 수정되었습니다.', 'success');
			goto(`/music-videos/${videoId}`);
		} catch (error) {
			toast.add('수정 중 오류가 발생했습니다.', 'error');
			console.error('Submit error:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		if (confirm('변경사항을 저장하지 않고 나가시겠습니까?')) {
			goto(`/music-videos/${videoId}`);
		}
	}
</script>

{#if !video}
	<PageContent>
		<div class="text-center py-12">
			<p class="text-text-muted mb-4">뮤직비디오를 찾을 수 없습니다.</p>
			<button 
				onclick={() => goto('/music-videos')}
				class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium"
			>
				뮤직비디오 목록으로 돌아가기
			</button>
		</div>
	</PageContent>
{:else}
	<PageContent>
		<PageHeader 
			title="뮤직비디오 편집"
			description={video.title}
			actions={[
				{
					icon: ArrowLeft,
					label: '뒤로가기',
					onclick: () => goto(`/music-videos/${videoId}`)
				}
			]}
		/>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="space-y-6"
		>
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- 메인 폼 -->
				<div class="lg:col-span-2 space-y-6">
					<!-- 기본 정보 -->
					<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
						<h3 class="text-lg font-semibold text-text-strong mb-4">기본 정보</h3>
						<div class="space-y-4">
							<div>
								<label for="video-title" class="block text-sm font-medium text-text-strong mb-2">
									제목 <span class="text-brand-pink">*</span>
								</label>
								<input
									id="video-title"
									type="text"
									bind:value={formData.title}
									placeholder="뮤직비디오 제목"
									class="input-base w-full px-3 py-2"
									required
								/>
							</div>

							<div>
								<label for="video-description" class="block text-sm font-medium text-text-strong mb-2">
									설명
								</label>
								<textarea
									id="video-description"
									bind:value={formData.description}
									placeholder="뮤직비디오에 대한 설명을 입력하세요..."
									rows="4"
									class="input-base w-full px-3 py-2 resize-none"
								></textarea>
							</div>

							<div>
								<label for="video-status" class="block text-sm font-medium text-text-strong mb-2">
									상태
								</label>
								<select
									id="video-status"
									bind:value={formData.status}
									class="input-base w-full px-3 py-2"
								>
									{#each statusOptions as option}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							</div>
						</div>
					</div>

					<!-- 캐릭터 선택 -->
					<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
						<h3 class="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
							<Users size={20} class="text-brand-pink" />
							캐릭터 선택
						</h3>
						<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
							{#each characters as character}
								<button
									type="button"
									onclick={() => handleCharacterToggle(character.id)}
									class="p-4 rounded-lg border transition-colors duration-200 {selectedCharacters.includes(character.id) ? 'border-brand-pink bg-brand-pink/10' : 'border-border-subtle bg-surface-2 hover:bg-surface-1'}"
								>
									<div class="w-full h-20 bg-surface-1 rounded mb-2 flex items-center justify-center">
										<img src={character.image} alt={character.name} class="w-full h-full object-cover rounded" />
									</div>
									<div class="text-sm font-medium text-text-strong">{character.name}</div>
									<div class="text-xs text-text-muted capitalize">{character.style}</div>
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- 사이드바 -->
				<div class="space-y-6">
					<!-- 미리보기 -->
					<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
						<h3 class="text-lg font-semibold text-text-strong mb-4">미리보기</h3>
						<div class="relative aspect-video bg-surface-2 rounded-lg overflow-hidden">
							{#if video.thumbnail && video.thumbnail !== '/api/placeholder/300/200'}
								<img
									src={video.thumbnail}
									alt={formData.title}
									class="w-full h-full object-cover"
								/>
							{:else}
								<div class="absolute inset-0 flex items-center justify-center">
									<Video size={48} class="text-text-muted opacity-30" />
								</div>
							{/if}
						</div>
					</div>

					<!-- 액션 버튼 -->
					<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
						<div class="space-y-3">
							<button
								type="submit"
								disabled={isSubmitting}
								class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
							>
								<Save size={16} />
								{isSubmitting ? '저장 중...' : '저장'}
							</button>
							<button
								type="button"
								onclick={handleCancel}
								disabled={isSubmitting}
								class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-surface-2 text-text-strong rounded-lg border border-border-subtle hover:bg-surface-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
							>
								<X size={16} />
								취소
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	</PageContent>
{/if}
