<script lang="ts">
	import { Download, FileText, FileSpreadsheet, X, Check } from 'lucide-svelte';
	import type { SUNOProject, LyricsVersion, SUNOPromptConfig } from '$lib/types/suno';
	import { PRODUCTION_STAGES } from '$lib/constants/suno/stages';

	// Props
	interface Props {
		project: SUNOProject;
		onClose?: () => void;
	}

	let { project, onClose }: Props = $props();

	// 내보내기 상태
	let isExporting = $state(false);
	let exportSuccess = $state(false);
	let selectedFormat = $state<'txt' | 'csv' | 'json'>('txt');

	// 내보내기 옵션
	let exportOptions = $state({
		lyrics: true,
		prompts: true,
		progress: true,
		metadata: true
	});

	// 가사 버전 유형 라벨
	const lyricsTypeLabels: Record<string, string> = {
		draft: '초안',
		revision: '수정안',
		structure: '곡구조',
		suno_phonetic: '수노발음',
		album_final: '앨범등록'
	};

	// TXT 포맷 생성
	function generateTxt(): string {
		let content = '';
		
		// 메타데이터
		if (exportOptions.metadata) {
			content += `=== ${project.title} ===\n`;
			content += `설명: ${project.description || '-'}\n`;
			content += `상태: ${project.status}\n`;
			content += `진행률: ${project.progressPercent}%\n`;
			content += `생성일: ${project.createdAt}\n`;
			content += `수정일: ${project.updatedAt}\n`;
			content += `제작자: ${project.createdBy}\n\n`;
		}

		// 가사
		if (exportOptions.lyrics && project.lyricsVersions.length > 0) {
			content += `=== 가사 버전 ===\n\n`;
			project.lyricsVersions.forEach(version => {
				content += `--- v${version.versionNumber} (${lyricsTypeLabels[version.versionType]}) ---\n`;
				content += `작성자: ${version.createdBy} | 날짜: ${version.createdAt}\n`;
				if (version.changeNotes) content += `메모: ${version.changeNotes}\n`;
				content += `\n${version.content}\n\n`;
			});
		}

		// 프롬프트
		if (exportOptions.prompts && project.promptConfigs.length > 0) {
			content += `=== 프롬프트 설정 ===\n\n`;
			project.promptConfigs.forEach((config, i) => {
				content += `--- 설정 ${i + 1} ---\n`;
				content += `버전: ${config.sunoVersion} | 모드: ${config.mode}\n`;
				content += `보컬: ${config.vocalGender} | 가사: ${config.lyricsMode}\n\n`;
				content += `[Styles]\n${config.styles}\n\n`;
				content += `[Exclude]\n${config.excludeStyles}\n\n`;
				content += `Weirdness: ${config.weirdness}% | Style: ${config.styleInfluence}% | Audio: ${config.audioInfluence}%\n\n`;
			});
		}

		// 진행률
		if (exportOptions.progress) {
			content += `=== 제작 진행률 ===\n\n`;
			PRODUCTION_STAGES.forEach(stage => {
				const status = project.stages.find(s => s.stageId === stage.id);
				const mark = status?.isCompleted ? '✓' : '○';
				content += `${mark} ${stage.order}. ${stage.name}`;
				if (status?.isCompleted) {
					content += ` (${status.completedAt} by ${status.completedBy})`;
				}
				content += '\n';
			});
		}

		return content;
	}

	// CSV 포맷 생성
	function generateCsv(): string {
		let content = '';

		// 가사 CSV
		if (exportOptions.lyrics) {
			content += '버전,유형,작성자,날짜,메모,내용\n';
			project.lyricsVersions.forEach(version => {
				const escapedContent = version.content.replace(/"/g, '""').replace(/\n/g, ' ');
				content += `${version.versionNumber},"${lyricsTypeLabels[version.versionType]}",${version.createdBy},${version.createdAt},"${version.changeNotes || ''}","${escapedContent}"\n`;
			});
			content += '\n';
		}

		// 프롬프트 CSV
		if (exportOptions.prompts) {
			content += '버전,모드,보컬,Weirdness,Style,Audio,Styles,Exclude\n';
			project.promptConfigs.forEach(config => {
				const escapedStyles = config.styles.replace(/"/g, '""');
				const escapedExclude = config.excludeStyles.replace(/"/g, '""');
				content += `${config.sunoVersion},${config.mode},${config.vocalGender},${config.weirdness},${config.styleInfluence},${config.audioInfluence},"${escapedStyles}","${escapedExclude}"\n`;
			});
		}

		return content;
	}

	// JSON 포맷 생성
	function generateJson(): string {
		const data: Record<string, unknown> = {};

		if (exportOptions.metadata) {
			data.metadata = {
				title: project.title,
				description: project.description,
				status: project.status,
				progressPercent: project.progressPercent,
				createdBy: project.createdBy,
				createdAt: project.createdAt,
				updatedAt: project.updatedAt
			};
		}

		if (exportOptions.lyrics) {
			data.lyrics = project.lyricsVersions;
		}

		if (exportOptions.prompts) {
			data.prompts = project.promptConfigs;
		}

		if (exportOptions.progress) {
			data.progress = project.stages;
		}

		return JSON.stringify(data, null, 2);
	}

	// 다운로드
	async function handleExport() {
		isExporting = true;

		let content = '';
		let mimeType = '';
		let extension = '';

		switch (selectedFormat) {
			case 'txt':
				content = generateTxt();
				mimeType = 'text/plain';
				extension = 'txt';
				break;
			case 'csv':
				content = generateCsv();
				mimeType = 'text/csv';
				extension = 'csv';
				break;
			case 'json':
				content = generateJson();
				mimeType = 'application/json';
				extension = 'json';
				break;
		}

		// 파일 다운로드
		const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${project.title.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_${new Date().toISOString().split('T')[0]}.${extension}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		await new Promise(r => setTimeout(r, 500));
		isExporting = false;
		exportSuccess = true;

		setTimeout(() => {
			exportSuccess = false;
			onClose?.();
		}, 1500);
	}
</script>

<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
	<!-- 헤더 -->
	<div class="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold text-text-strong">내보내기</h3>
			<p class="text-sm text-text-muted mt-0.5">{project.title}</p>
		</div>
		{#if onClose}
			<button type="button" onclick={onClose} class="btn-icon">
				<X size={20} />
			</button>
		{/if}
	</div>

	<div class="p-6 space-y-6">
		<!-- 포맷 선택 -->
		<div>
			<span class="block text-sm font-medium text-text-strong mb-3">내보내기 형식</span>
			<div class="grid grid-cols-3 gap-3">
				<button
					type="button"
					onclick={() => selectedFormat = 'txt'}
					class="p-3 rounded-lg border text-center transition-all
						{selectedFormat === 'txt' ? 'border-brand-pink bg-brand-pink/10' : 'border-border-subtle hover:border-brand-pink'}"
				>
					<FileText size={24} class="mx-auto mb-1 {selectedFormat === 'txt' ? 'text-brand-pink' : 'text-text-muted'}" />
					<span class="text-sm {selectedFormat === 'txt' ? 'text-brand-pink' : 'text-text-base'}">TXT</span>
				</button>
				<button
					type="button"
					onclick={() => selectedFormat = 'csv'}
					class="p-3 rounded-lg border text-center transition-all
						{selectedFormat === 'csv' ? 'border-brand-pink bg-brand-pink/10' : 'border-border-subtle hover:border-brand-pink'}"
				>
					<FileSpreadsheet size={24} class="mx-auto mb-1 {selectedFormat === 'csv' ? 'text-brand-pink' : 'text-text-muted'}" />
					<span class="text-sm {selectedFormat === 'csv' ? 'text-brand-pink' : 'text-text-base'}">CSV</span>
				</button>
				<button
					type="button"
					onclick={() => selectedFormat = 'json'}
					class="p-3 rounded-lg border text-center transition-all
						{selectedFormat === 'json' ? 'border-brand-pink bg-brand-pink/10' : 'border-border-subtle hover:border-brand-pink'}"
				>
					<FileText size={24} class="mx-auto mb-1 {selectedFormat === 'json' ? 'text-brand-pink' : 'text-text-muted'}" />
					<span class="text-sm {selectedFormat === 'json' ? 'text-brand-pink' : 'text-text-base'}">JSON</span>
				</button>
			</div>
		</div>

		<!-- 내용 선택 -->
		<div>
			<span class="block text-sm font-medium text-text-strong mb-3">포함할 내용</span>
			<div class="space-y-2">
				<label class="flex items-center gap-3 cursor-pointer">
					<input type="checkbox" bind:checked={exportOptions.metadata} class="w-4 h-4 rounded" />
					<span class="text-sm text-text-base">프로젝트 정보</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input type="checkbox" bind:checked={exportOptions.lyrics} class="w-4 h-4 rounded" />
					<span class="text-sm text-text-base">가사 ({project.lyricsVersions.length}개 버전)</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input type="checkbox" bind:checked={exportOptions.prompts} class="w-4 h-4 rounded" />
					<span class="text-sm text-text-base">프롬프트 설정 ({project.promptConfigs.length}개)</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input type="checkbox" bind:checked={exportOptions.progress} class="w-4 h-4 rounded" />
					<span class="text-sm text-text-base">제작 진행률</span>
				</label>
			</div>
		</div>
	</div>

	<!-- 푸터 -->
	<div class="px-6 py-4 border-t border-border-subtle flex items-center justify-end gap-3">
		<button
			type="button"
			onclick={onClose}
			class="cancel-button px-4 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors font-medium"
		>
			취소
		</button>
		<button
			type="button"
			onclick={handleExport}
			disabled={isExporting || exportSuccess}
			class="flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg transition-colors font-medium disabled:opacity-50"
		>
			{#if exportSuccess}
				<Check size={16} />
				완료!
			{:else if isExporting}
				<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
				내보내는 중...
			{:else}
				<Download size={16} />
				내보내기
			{/if}
		</button>
	</div>
</div>
