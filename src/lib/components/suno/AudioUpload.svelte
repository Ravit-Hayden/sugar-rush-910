<script lang="ts">
	import { Upload, X, AlertCircle } from 'lucide-svelte';
	import type { AudioVersionType } from '$lib/types/suno';
	import { MAX_FILE_SIZE_BYTES, getFileSizeErrorMessage } from '$lib/constants/upload';

	// Props
	interface Props {
		onUpload?: (file: File, metadata: { versionType: AudioVersionType; sunoUrl?: string }) => void;
		onClose?: () => void;
	}

	let { onUpload, onClose }: Props = $props();

	// 상태
	let isDragging = $state(false);
	let selectedFile = $state<File | null>(null);
	let versionType = $state<AudioVersionType>('suno_original');
	let sunoUrl = $state('');
	let isUploading = $state(false);
	let uploadProgress = $state(0);
	let error = $state('');

	// 버전 유형 옵션
	const versionTypes: { value: AudioVersionType; label: string }[] = [
		{ value: 'suno_original', label: 'SUNO 원본' },
		{ value: 'suno_studio', label: 'SUNO Studio 버전' },
		{ value: 'editing', label: '수정 중' },
		{ value: 'final', label: '최종본' }
	];

	// 드래그 이벤트
	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		
		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			validateAndSetFile(files[0]);
		}
	}

	// 파일 선택
	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			validateAndSetFile(input.files[0]);
		}
	}

	// 파일 검증
	function validateAndSetFile(file: File) {
		error = '';
		
		// 오디오 파일만 허용
		if (!file.type.startsWith('audio/')) {
			error = '오디오 파일만 업로드 가능합니다.';
			return;
		}

		// 공통 한도 1GB
		if (file.size > MAX_FILE_SIZE_BYTES) {
			error = getFileSizeErrorMessage();
			return;
		}

		selectedFile = file;
	}

	// 파일 제거
	function removeFile() {
		selectedFile = null;
		error = '';
	}

	// 업로드
	async function handleUpload() {
		if (!selectedFile) return;

		isUploading = true;
		uploadProgress = 0;

		// 업로드 시뮬레이션
		for (let i = 0; i <= 100; i += 10) {
			await new Promise(r => setTimeout(r, 100));
			uploadProgress = i;
		}

		if (onUpload) {
			onUpload(selectedFile, {
				versionType,
				sunoUrl: sunoUrl || undefined
			});
		}

		isUploading = false;
		selectedFile = null;
		sunoUrl = '';
		onClose?.();
	}

	// 파일 크기 포맷
	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}
</script>

<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
	<!-- 헤더 -->
	<div class="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
		<h3 class="text-sm font-semibold text-text-strong">음원 업로드</h3>
		{#if onClose}
			<button type="button" onclick={onClose} class="template-close-btn w-7 h-7 flex items-center justify-end rounded-md text-text-muted transition-colors border border-transparent pl-1.5 pr-0" aria-label="닫기">
				<X size={16} />
			</button>
		{/if}
	</div>

	<div class="p-4 space-y-4">
		<!-- 드래그 앤 드롭 영역 -->
		{#if !selectedFile}
			<div
				role="button"
				tabindex="0"
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
				class="relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
					{isDragging ? 'border-brand-pink bg-brand-pink/5' : 'border-border-subtle hover:border-brand-pink'}"
			>
				<input
					type="file"
					accept="audio/*"
					onchange={handleFileSelect}
					class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
				/>
				<div class="flex flex-col items-center gap-3">
					<div>
						<p class="text-sm font-medium text-text-base">파일을 드래그하거나 클릭하여 선택</p>
						<p class="text-xs text-text-muted mt-1">MP3, WAV, FLAC (최대 50MB)</p>
					</div>
				</div>
			</div>
		{:else}
			<!-- 선택된 파일 -->
			<div class="flex items-center gap-4 p-4 bg-surface-2 rounded-lg">
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-text-strong truncate">{selectedFile.name}</p>
					<p class="text-xs text-text-muted">{formatFileSize(selectedFile.size)}</p>
				</div>
				<button type="button" onclick={removeFile} class="btn-icon">
					<X size={16} />
				</button>
			</div>
		{/if}

		<!-- 에러 메시지 -->
		{#if error}
			<div class="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
				<AlertCircle size={16} />
				{error}
			</div>
		{/if}

		<!-- 메타데이터 -->
		{#if selectedFile}
			<div class="space-y-3">
				<!-- 버전 유형 -->
				<div>
					<label for="version-type" class="block text-sm font-medium text-text-strong mb-2">버전 유형</label>
					<select id="version-type" bind:value={versionType} class="input-base w-full h-10 px-4">
						{#each versionTypes as type}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				</div>

				<!-- SUNO URL -->
				<div>
					<label for="suno-url" class="block text-sm font-medium text-text-strong mb-2">SUNO Workspace URL (선택)</label>
					<input
						id="suno-url"
						type="url"
						bind:value={sunoUrl}
						placeholder="https://suno.com/workspace/..."
						class="input-base w-full h-10 px-4"
					/>
				</div>
			</div>

			<!-- 업로드 진행률 -->
			{#if isUploading}
				<div>
					<div class="flex items-center justify-between text-sm mb-1">
						<span class="text-text-muted">업로드 중...</span>
						<span class="text-brand-pink">{uploadProgress}%</span>
					</div>
					<div class="h-2 bg-bg rounded-full overflow-hidden">
						<div 
							class="h-full bg-brand-pink transition-all duration-200"
							style="width: {uploadProgress}%"
						></div>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<!-- 푸터 -->
	{#if selectedFile}
		<div class="px-4 py-3 border-t border-border-subtle flex items-center justify-end gap-3">
			<button
				type="button"
				onclick={onClose}
				class="cancel-button px-4 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors font-medium"
			>
				취소
			</button>
			<button
				type="button"
				onclick={handleUpload}
				disabled={isUploading}
				class="flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg transition-colors font-medium disabled:opacity-50"
			>
				{#if isUploading}
					<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
				{:else}
					<Upload size={16} />
				{/if}
				업로드
			</button>
		</div>
	{/if}
</div>
