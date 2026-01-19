<script lang="ts">
	import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-svelte';
	import type { AudioVersion } from '$lib/types/suno';

	// Props
	interface Props {
		audio: AudioVersion;
		onVote?: (value: 'up' | 'down') => void;
		onSelect?: () => void;
	}

	let { audio, onVote, onSelect }: Props = $props();

	// 플레이어 상태
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let volume = $state(0.8);
	let isMuted = $state(false);
	let audioElement: HTMLAudioElement | null = $state(null);

	// 시간 포맷
	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	// 재생/일시정지
	function togglePlay() {
		if (!audioElement) return;
		
		if (isPlaying) {
			audioElement.pause();
		} else {
			audioElement.play();
		}
		isPlaying = !isPlaying;
	}

	// 음소거 토글
	function toggleMute() {
		if (!audioElement) return;
		isMuted = !isMuted;
		audioElement.muted = isMuted;
	}

	// 볼륨 변경
	function handleVolumeChange(e: Event) {
		const target = e.target as HTMLInputElement;
		volume = parseFloat(target.value);
		if (audioElement) {
			audioElement.volume = volume;
		}
		if (volume > 0) isMuted = false;
	}

	// 시간 변경
	function handleTimeChange(e: Event) {
		const target = e.target as HTMLInputElement;
		currentTime = parseFloat(target.value);
		if (audioElement) {
			audioElement.currentTime = currentTime;
		}
	}

	// 앞으로/뒤로 이동
	function skip(seconds: number) {
		if (!audioElement) return;
		audioElement.currentTime = Math.max(0, Math.min(duration, audioElement.currentTime + seconds));
	}

	// 오디오 이벤트
	function handleTimeUpdate() {
		if (audioElement) {
			currentTime = audioElement.currentTime;
		}
	}

	function handleLoadedMetadata() {
		if (audioElement) {
			duration = audioElement.duration;
		}
	}

	function handleEnded() {
		isPlaying = false;
		currentTime = 0;
	}

	// 진행률 퍼센트
	const progressPercent = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);

	// 투표 수
	const upVotes = $derived(audio.votes.filter(v => v.value === 'up').length);
	const downVotes = $derived(audio.votes.filter(v => v.value === 'down').length);
</script>

<div class="bg-surface-1 rounded-lg border border-border-subtle {audio.isFinalSelection ? 'ring-2 ring-brand-pink' : ''} overflow-hidden">
	<!-- 숨겨진 오디오 엘리먼트 -->
	<audio
		bind:this={audioElement}
		src={audio.fileUrl}
		ontimeupdate={handleTimeUpdate}
		onloadedmetadata={handleLoadedMetadata}
		onended={handleEnded}
		preload="metadata"
	></audio>

	<div class="p-4">
		<!-- 상단: 파일 정보 -->
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<span class="text-base font-medium text-text-strong">{audio.fileName}</span>
				{#if audio.isFinalSelection}
					<span class="px-2 py-0.5 rounded bg-brand-pink text-white text-xs font-medium">최종 선택</span>
				{/if}
			</div>
			<div class="flex items-center gap-2 text-sm text-text-muted">
				<span>{audio.createdBy}</span>
				<span>·</span>
				<span>{audio.createdAt}</span>
			</div>
		</div>

		<!-- 재생 컨트롤 -->
		<div class="flex items-center gap-4">
			<!-- 재생 버튼 -->
			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={() => skip(-10)}
					class="btn-icon"
					title="10초 뒤로"
				>
					<SkipBack size={16} />
				</button>
				<button
					type="button"
					onclick={togglePlay}
					class="w-12 h-12 rounded-full bg-brand-pink flex items-center justify-center text-white hover:bg-brand-pink/90 transition-colors"
				>
					{#if isPlaying}
						<Pause size={20} />
					{:else}
						<Play size={20} class="ml-1" />
					{/if}
				</button>
				<button
					type="button"
					onclick={() => skip(10)}
					class="btn-icon"
					title="10초 앞으로"
				>
					<SkipForward size={16} />
				</button>
			</div>

			<!-- 진행 바 -->
			<div class="flex-1">
				<div class="relative h-2 bg-bg rounded-full overflow-hidden">
					<div 
						class="absolute h-full bg-brand-pink transition-all duration-100"
						style="width: {progressPercent}%"
					></div>
					<input
						type="range"
						min="0"
						max={duration || 100}
						step="0.1"
						value={currentTime}
						oninput={handleTimeChange}
						class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					/>
				</div>
				<div class="flex items-center justify-between mt-1 text-xs text-text-muted">
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>

			<!-- 볼륨 -->
			<div class="flex items-center gap-2">
				<button type="button" onclick={toggleMute} class="btn-icon">
					{#if isMuted || volume === 0}
						<VolumeX size={16} />
					{:else}
						<Volume2 size={16} />
					{/if}
				</button>
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					value={volume}
					oninput={handleVolumeChange}
					class="w-20 h-1 bg-surface-2 rounded-full appearance-none cursor-pointer"
				/>
			</div>
		</div>

		<!-- 하단: 투표 및 액션 -->
		<div class="flex items-center justify-between mt-4 pt-4 border-t border-border-subtle">
			<div class="flex items-center gap-4">
				<!-- 투표 -->
				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={() => onVote?.('up')}
						class="flex items-center gap-1 px-2 py-1 rounded bg-surface-2 text-sm hover:bg-green-500/20 hover:text-green-400 transition-colors"
					>
						👍 <span>{upVotes}</span>
					</button>
					<button
						type="button"
						onclick={() => onVote?.('down')}
						class="flex items-center gap-1 px-2 py-1 rounded bg-surface-2 text-sm hover:bg-red-500/20 hover:text-red-400 transition-colors"
					>
						👎 <span>{downVotes}</span>
					</button>
				</div>

				<!-- SUNO 링크 -->
				{#if audio.sunoWorkspaceUrl}
					<a
						href={audio.sunoWorkspaceUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-brand-pink hover:underline"
					>
						SUNO에서 열기
					</a>
				{/if}
			</div>

			<!-- 최종 선택 버튼 -->
			{#if !audio.isFinalSelection && onSelect}
				<button
					type="button"
					onclick={onSelect}
					class="px-4 py-1.5 text-sm border border-border-subtle rounded-lg hover:border-brand-pink hover:text-brand-pink transition-colors"
				>
					최종 선택
				</button>
			{/if}
		</div>
	</div>

	<!-- 댓글 -->
	{#if audio.comments.length > 0}
		<div class="px-4 py-3 border-t border-border-subtle bg-surface-2/30">
			<div class="space-y-2">
				{#each audio.comments as comment}
					<div class="flex items-start gap-2 text-sm">
						<span class="font-medium {comment.author === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">{comment.author}:</span>
						<span class="text-text-base">{comment.content}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
