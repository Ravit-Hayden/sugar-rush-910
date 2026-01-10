<script lang="ts">
	import { Upload, FileText, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import { toast } from '$lib/stores/toast';

	// 업로드 상태 타입
	type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

	// 업로드 항목 인터페이스
	interface UploadItem {
		id: string;
		file: File;
		status: UploadStatus;
		progress: number;
		error?: string;
		uploadedAt?: Date;
		fileId?: string;
		fileName?: string;
		fileUrl?: string;
	}

	let dragOver = false;
	let uploadItems = $state<UploadItem[]>([]);
	let uploadHistory = $state<UploadItem[]>([]);
	let isUploading = $derived(uploadItems.some(item => item.status === 'uploading'));

	// 파일 크기 포맷팅
	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
	}

	// 드래그 앤 드롭 핸들러
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
			handleFiles(Array.from(files));
		}
	}

	// 파일 선택 핸들러
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		if (files && files.length > 0) {
			handleFiles(Array.from(files));
		}
		// 같은 파일을 다시 선택할 수 있도록 input 초기화
		target.value = '';
	}

	// 파일 처리 (검증 및 업로드 시작)
	function handleFiles(files: File[]) {
		const validFiles: File[] = [];
		
		for (const file of files) {
			// 파일 타입 검증
			if (!file.type.startsWith('audio/')) {
				toast.add(`${file.name}: 오디오 파일만 업로드 가능합니다.`, 'error');
				continue;
			}

			// 파일 크기 검증 (100MB 제한)
			const maxSize = 100 * 1024 * 1024; // 100MB
			if (file.size > maxSize) {
				toast.add(`${file.name}: 파일 크기는 100MB를 초과할 수 없습니다.`, 'error');
				continue;
			}

			validFiles.push(file);
		}

		if (validFiles.length === 0) {
			return;
		}

		// 업로드 항목 추가
		const newItems: UploadItem[] = validFiles.map(file => ({
			id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			file,
			status: 'idle' as UploadStatus,
			progress: 0
		}));

		uploadItems = [...uploadItems, ...newItems];

		// 각 파일 업로드 시작
		newItems.forEach(item => {
			uploadFile(item);
		});
	}

	// 파일 업로드 함수
	async function uploadFile(item: UploadItem) {
		item.status = 'uploading';
		item.progress = 0;

		try {
			const formData = new FormData();
			formData.append('audioFile', item.file);

			// XMLHttpRequest를 사용하여 진행률 추적
			const xhr = new XMLHttpRequest();

			// 진행률 업데이트
			xhr.upload.addEventListener('progress', (e) => {
				if (e.lengthComputable) {
					item.progress = Math.round((e.loaded / e.total) * 100);
				}
			});

			// 업로드 완료
			xhr.addEventListener('load', () => {
				if (xhr.status === 200) {
					try {
						const response = JSON.parse(xhr.responseText);
						if (response.ok) {
							item.status = 'success';
							item.progress = 100;
							item.uploadedAt = new Date();
							item.fileId = response.data.fileId;
							item.fileName = response.data.fileName;
							item.fileUrl = response.data.fileUrl;

							// 히스토리에 추가
							uploadHistory = [item, ...uploadHistory.slice(0, 9)]; // 최근 10개만 유지

							toast.add(`${item.file.name} 업로드 완료`, 'success');
						} else {
							throw new Error(response.error?.message || '업로드 실패');
						}
					} catch (error) {
						item.status = 'error';
						item.error = error instanceof Error ? error.message : '알 수 없는 오류';
						toast.add(`${item.file.name} 업로드 실패: ${item.error}`, 'error');
					}
				} else {
					throw new Error(`HTTP ${xhr.status}`);
				}
			});

			// 에러 처리
			xhr.addEventListener('error', () => {
				item.status = 'error';
				item.error = '네트워크 오류가 발생했습니다.';
				toast.add(`${item.file.name} 업로드 실패: ${item.error}`, 'error');
			});

			// 업로드 중단
			xhr.addEventListener('abort', () => {
				item.status = 'error';
				item.error = '업로드가 중단되었습니다.';
			});

			// 업로드 시작
			xhr.open('POST', '/api/upload/audio');
			xhr.send(formData);

		} catch (error) {
			item.status = 'error';
			item.error = error instanceof Error ? error.message : '알 수 없는 오류';
			toast.add(`${item.file.name} 업로드 실패: ${item.error}`, 'error');
		}
	}

	// 업로드 항목 제거
	function removeUploadItem(id: string) {
		uploadItems = uploadItems.filter(item => item.id !== id);
	}

	// 모든 업로드 항목 제거
	function clearAllUploads() {
		uploadItems = [];
	}

	// 통계 계산
	const stats = $derived.by(() => {
		const total = uploadHistory.length;
		const success = uploadHistory.filter(item => item.status === 'success').length;
		const error = uploadHistory.filter(item => item.status === 'error').length;
		const totalSize = uploadHistory
			.filter(item => item.status === 'success')
			.reduce((sum, item) => sum + item.file.size, 0);

		// 이번 주 업로드 수
		const now = new Date();
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const thisWeek = uploadHistory.filter(item => 
			item.uploadedAt && item.uploadedAt >= weekAgo
		).length;

		// 이번 달 업로드 수
		const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
		const thisMonth = uploadHistory.filter(item => 
			item.uploadedAt && item.uploadedAt >= monthAgo
		).length;

		return {
			total,
			success,
			error,
			totalSize,
			thisWeek,
			thisMonth
		};
	});
</script>

<PageContent>
	<PageHeader 
		title="업로드·검증 센터" 
		description="음악 파일을 업로드하고 자동으로 검증합니다."
	/>

	<!-- 업로드 영역 -->
	<div class="mb-8">
		<div 
			class="upload-zone border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 {dragOver ? 'border-brand-pink bg-brand-pink/5' : 'border-border-subtle'}"
			data-dragging={dragOver}
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
			<label for="file-upload" class="inline-flex items-center gap-2 px-6 py-3 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium cursor-pointer">
				<Upload size={16} />
				파일 선택
			</label>
			<input 
				id="file-upload" 
				type="file" 
				accept="audio/*" 
				multiple
				class="hidden" 
				onchange={handleFileSelect}
			/>
			<p class="text-xs text-text-muted mt-4">최대 100MB, 오디오 파일만 업로드 가능</p>
		</div>
	</div>

	<!-- 진행 중인 업로드 목록 -->
	{#if uploadItems.length > 0}
		<div class="mb-8">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold text-text-strong">업로드 중 ({uploadItems.length})</h3>
				{#if uploadItems.length > 0}
					<button
						onclick={clearAllUploads}
						class="text-sm text-text-muted hover:text-text-strong transition-colors"
						type="button"
					>
						모두 제거
					</button>
				{/if}
			</div>
			<div class="space-y-3">
				{#each uploadItems as item (item.id)}
					<div class="bg-surface-1 rounded-lg p-4 border border-border-subtle">
						<div class="flex items-center justify-between mb-2">
							<div class="flex items-center gap-3 flex-1 min-w-0">
								{#if item.status === 'uploading'}
									<Loader2 size={20} class="text-brand-pink animate-spin flex-shrink-0" />
								{:else if item.status === 'success'}
									<CheckCircle size={20} class="text-green-500 flex-shrink-0" />
								{:else if item.status === 'error'}
									<AlertCircle size={20} class="text-red-500 flex-shrink-0" />
								{/if}
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium text-text-strong truncate">{item.file.name}</p>
									<p class="text-xs text-text-muted">{formatFileSize(item.file.size)}</p>
								</div>
							</div>
							<button
								onclick={() => removeUploadItem(item.id)}
								class="p-1 hover:bg-surface-2 rounded transition-colors flex-shrink-0"
								type="button"
								aria-label="제거"
							>
								<X size={16} class="text-text-muted" />
							</button>
						</div>
						{#if item.status === 'uploading'}
							<div class="w-full bg-surface-2 rounded-full h-2 mt-2">
								<div 
									class="bg-brand-pink h-2 rounded-full transition-all duration-300" 
									style="width: {item.progress}%"
								></div>
							</div>
							<div class="text-xs text-text-muted mt-1">{item.progress}% 완료</div>
						{:else if item.status === 'error'}
							<div class="text-xs text-red-500 mt-1">{item.error}</div>
						{:else if item.status === 'success'}
							<div class="text-xs text-green-500 mt-1">업로드 완료</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- 통계 카드들 -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
		<div class="card-base bg-surface-1 rounded-lg p-6 border border-border-subtle">
			<div class="flex items-center gap-3 mb-4">
				<FileText size={20} class="text-brand-pink" />
				<h3 class="font-semibold text-text-strong">최근 업로드</h3>
			</div>
			<div class="space-y-3">
				{#if uploadHistory.length === 0}
					<p class="text-sm text-text-muted">업로드한 파일이 없습니다.</p>
				{:else}
					{#each uploadHistory.slice(0, 3) as item (item.id)}
						<div class="flex items-center justify-between">
							<span class="text-sm text-text-muted truncate flex-1 min-w-0 mr-2">{item.file.name}</span>
							{#if item.status === 'success'}
								<CheckCircle size={16} class="text-green-500 flex-shrink-0" />
							{:else if item.status === 'error'}
								<AlertCircle size={16} class="text-red-500 flex-shrink-0" />
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<div class="card-base bg-surface-1 rounded-lg p-6 border border-border-subtle">
			<div class="flex items-center gap-3 mb-4">
				<CheckCircle size={20} class="text-green-500" />
				<h3 class="font-semibold text-text-strong">검증 상태</h3>
			</div>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-sm text-text-muted">성공</span>
					<span class="text-sm font-medium text-green-500">{stats.success}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-text-muted">오류</span>
					<span class="text-sm font-medium text-red-500">{stats.error}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-text-muted">전체</span>
					<span class="text-sm font-medium text-text-strong">{stats.total}</span>
				</div>
			</div>
		</div>

		<div class="card-base bg-surface-1 rounded-lg p-6 border border-border-subtle">
			<div class="flex items-center gap-3 mb-4">
				<Upload size={20} class="text-brand-pink" />
				<h3 class="font-semibold text-text-strong">업로드 통계</h3>
			</div>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-sm text-text-muted">이번 주</span>
					<span class="text-sm font-medium text-text-strong">{stats.thisWeek}개</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-text-muted">이번 달</span>
					<span class="text-sm font-medium text-text-strong">{stats.thisMonth}개</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-text-muted">총 용량</span>
					<span class="text-sm font-medium text-text-strong">{formatFileSize(stats.totalSize)}</span>
				</div>
			</div>
		</div>
	</div>
</PageContent>
