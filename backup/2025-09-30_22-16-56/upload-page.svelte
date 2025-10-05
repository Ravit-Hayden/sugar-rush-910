<script lang="ts">
	import { onMount } from 'svelte';
	import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-svelte';

	let dragOver = false;
	let uploadProgress = 0;
	let uploadStatus = 'idle'; // idle, uploading, success, error

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		
		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			handleFileUpload(files[0]);
		}
	}

	function handleFileUpload(file: File) {
		uploadStatus = 'uploading';
		uploadProgress = 0;
		
		// 시뮬레이션된 업로드 진행률
		const interval = setInterval(() => {
			uploadProgress += Math.random() * 20;
			if (uploadProgress >= 100) {
				uploadProgress = 100;
				uploadStatus = 'success';
				clearInterval(interval);
			}
		}, 200);
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			handleFileUpload(file);
		}
	}
</script>

	<div class="max-w-7xl mx-auto">
		<!-- 헤더 -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-text-strong mb-2">업로드·검증 센터</h1>
			<p class="text-text-muted">음악 파일을 업로드하고 자동으로 검증합니다.</p>
		</div>

		<!-- 업로드 영역 -->
		<div class="mb-8">
			<div 
				class="border-2 border-dashed border-border-subtle rounded-lg p-12 text-center transition-colors {dragOver ? 'border-brand-pink bg-brand-pink/5' : 'hover:border-hover-cyan'}"
				role="button"
				tabindex="0"
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
				onkeydown={(e) => e.key === 'Enter' && document.getElementById('file-upload')?.click()}
			>
				<Upload size={48} class="text-text-muted mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-text-strong mb-2">파일을 드래그하여 업로드</h3>
				<p class="text-text-muted mb-4">또는</p>
				<label for="file-upload" class="inline-flex items-center gap-2 px-6 py-3 bg-brand-pink text-white rounded-md cursor-pointer hover:bg-brand-pink/90 transition-colors">
					<Upload size={16} />
					파일 선택
				</label>
				<input 
					id="file-upload" 
					type="file" 
					accept="audio/*" 
					class="hidden" 
					onchange={handleFileSelect}
				/>
			</div>
		</div>

		<!-- 업로드 진행률 -->
		{#if uploadStatus === 'uploading'}
			<div class="mb-8">
				<div class="bg-surface-2 rounded-lg p-6">
					<div class="flex items-center gap-3 mb-4">
						<Upload size={20} class="text-brand-pink" />
						<span class="font-medium text-text-strong">업로드 중...</span>
					</div>
					<div class="w-full bg-surface-1 rounded-full h-2">
						<div 
							class="bg-brand-pink h-2 rounded-full transition-all duration-300" 
							style="width: {uploadProgress}%"
						></div>
					</div>
					<div class="text-sm text-text-muted mt-2">{Math.round(uploadProgress)}% 완료</div>
				</div>
			</div>
		{/if}

		<!-- 업로드 완료 -->
		{#if uploadStatus === 'success'}
			<div class="mb-8">
				<div class="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
					<div class="flex items-center gap-3 mb-2">
						<CheckCircle size={20} class="text-green-500" />
						<span class="font-medium text-green-500">업로드 완료</span>
					</div>
					<p class="text-text-muted">파일이 성공적으로 업로드되었습니다.</p>
				</div>
			</div>
		{/if}

		<!-- 최근 업로드 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div class="bg-surface-2 rounded-lg p-6">
				<div class="flex items-center gap-3 mb-4">
					<FileText size={20} class="text-brand-pink" />
					<h3 class="font-semibold text-text-strong">최근 업로드</h3>
				</div>
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-sm text-text-muted">Sugar Rush Vol.1</span>
						<CheckCircle size={16} class="text-green-500" />
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-text-muted">Summer Night</span>
						<CheckCircle size={16} class="text-green-500" />
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-text-muted">Demo Track</span>
						<AlertCircle size={16} class="text-yellow-500" />
					</div>
				</div>
			</div>

			<div class="bg-surface-2 rounded-lg p-6">
				<div class="flex items-center gap-3 mb-4">
					<CheckCircle size={20} class="text-green-500" />
					<h3 class="font-semibold text-text-strong">검증 상태</h3>
				</div>
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-sm text-text-muted">성공</span>
						<span class="text-sm font-medium text-green-500">12</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-text-muted">경고</span>
						<span class="text-sm font-medium text-yellow-500">2</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-text-muted">오류</span>
						<span class="text-sm font-medium text-red-500">0</span>
					</div>
				</div>
			</div>

			<div class="bg-surface-2 rounded-lg p-6">
				<div class="flex items-center gap-3 mb-4">
					<Upload size={20} class="text-brand-pink" />
					<h3 class="font-semibold text-text-strong">업로드 통계</h3>
				</div>
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-sm text-text-muted">이번 주</span>
						<span class="text-sm font-medium text-text-strong">8개</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-text-muted">이번 달</span>
						<span class="text-sm font-medium text-text-strong">24개</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-text-muted">총 용량</span>
						<span class="text-sm font-medium text-text-strong">2.4GB</span>
					</div>
				</div>
			</div>
		</div>
	</div>
