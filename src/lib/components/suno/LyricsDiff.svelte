<script lang="ts">
	import { X } from 'lucide-svelte';
	import type { LyricsVersion, LyricsVersionType } from '$lib/types/suno';

	// Props
	interface Props {
		versionA: LyricsVersion;
		versionB: LyricsVersion;
		onClose?: () => void;
	}

	let { versionA, versionB, onClose }: Props = $props();

	// 버전 유형 라벨
	const typeLabels: Record<LyricsVersionType, string> = {
		draft: '초안',
		revision: '수정안',
		structure: '곡구조',
		suno_phonetic: '수노발음',
		album_final: '앨범등록'
	};

	// 간단한 라인별 diff 계산
	interface DiffLine {
		type: 'same' | 'added' | 'removed' | 'changed';
		lineA?: string;
		lineB?: string;
	}

	const diffLines = $derived.by(() => {
		const linesA = versionA.content.split('\n');
		const linesB = versionB.content.split('\n');
		const maxLen = Math.max(linesA.length, linesB.length);
		const result: DiffLine[] = [];

		for (let i = 0; i < maxLen; i++) {
			const a = linesA[i];
			const b = linesB[i];

			if (a === undefined && b !== undefined) {
				result.push({ type: 'added', lineB: b });
			} else if (a !== undefined && b === undefined) {
				result.push({ type: 'removed', lineA: a });
			} else if (a === b) {
				result.push({ type: 'same', lineA: a, lineB: b });
			} else {
				result.push({ type: 'changed', lineA: a, lineB: b });
			}
		}

		return result;
	});

	// 통계
	const stats = $derived.by(() => {
		let added = 0, removed = 0, changed = 0, same = 0;
		diffLines.forEach(line => {
			if (line.type === 'added') added++;
			else if (line.type === 'removed') removed++;
			else if (line.type === 'changed') changed++;
			else same++;
		});
		return { added, removed, changed, same };
	});
</script>

<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
	<!-- 헤더 -->
	<div class="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
		<div class="flex items-center gap-4">
			<h3 class="text-sm font-semibold text-text-strong">버전 비교</h3>
			<div class="flex items-center gap-2 text-xs">
				<span class="px-2 py-0.5 rounded bg-red-500/20 text-red-400">-{stats.removed}</span>
				<span class="px-2 py-0.5 rounded bg-green-500/20 text-green-400">+{stats.added}</span>
				<span class="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">~{stats.changed}</span>
			</div>
		</div>
		{#if onClose}
			<button type="button" onclick={onClose} class="btn-icon">
				<X size={16} />
			</button>
		{/if}
	</div>

	<!-- 버전 정보 -->
	<div class="grid grid-cols-2 border-b border-border-subtle">
		<div class="px-4 py-2 bg-red-500/5 border-r border-border-subtle">
			<span class="text-sm font-medium text-text-strong">
				v{versionA.versionNumber} - {typeLabels[versionA.versionType]}
			</span>
			<span class="text-xs text-text-muted ml-2">{versionA.createdAt}</span>
		</div>
		<div class="px-4 py-2 bg-green-500/5">
			<span class="text-sm font-medium text-text-strong">
				v{versionB.versionNumber} - {typeLabels[versionB.versionType]}
			</span>
			<span class="text-xs text-text-muted ml-2">{versionB.createdAt}</span>
		</div>
	</div>

	<!-- Diff 내용 -->
	<div class="max-h-96 overflow-y-auto custom-list-scrollbar">
		<table class="w-full text-sm font-mono">
			<tbody>
				{#each diffLines as line, i}
					<tr class="
						{line.type === 'added' ? 'bg-green-500/10' : ''}
						{line.type === 'removed' ? 'bg-red-500/10' : ''}
						{line.type === 'changed' ? 'bg-yellow-500/10' : ''}
					">
						<!-- 라인 번호 -->
						<td class="w-10 px-2 py-1 text-right text-text-muted border-r border-border-subtle">
							{line.type !== 'added' ? i + 1 : ''}
						</td>
						<!-- 왼쪽 (이전) -->
						<td class="w-1/2 px-3 py-1 border-r border-border-subtle {line.type === 'removed' || line.type === 'changed' ? 'text-red-400' : 'text-text-base'}">
							{#if line.type === 'removed'}
								<span class="mr-1 text-red-500">-</span>
							{/if}
							{line.lineA || ''}
						</td>
						<!-- 라인 번호 -->
						<td class="w-10 px-2 py-1 text-right text-text-muted border-r border-border-subtle">
							{line.type !== 'removed' ? i + 1 : ''}
						</td>
						<!-- 오른쪽 (새로운) -->
						<td class="w-1/2 px-3 py-1 {line.type === 'added' || line.type === 'changed' ? 'text-green-400' : 'text-text-base'}">
							{#if line.type === 'added'}
								<span class="mr-1 text-green-500">+</span>
							{/if}
							{line.lineB || ''}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- 범례 -->
	<div class="px-4 py-2 border-t border-border-subtle bg-surface-2/50 flex items-center gap-4 text-xs text-text-muted">
		<span class="flex items-center gap-1">
			<span class="w-3 h-3 rounded bg-red-500/20"></span> 삭제됨
		</span>
		<span class="flex items-center gap-1">
			<span class="w-3 h-3 rounded bg-green-500/20"></span> 추가됨
		</span>
		<span class="flex items-center gap-1">
			<span class="w-3 h-3 rounded bg-yellow-500/20"></span> 변경됨
		</span>
	</div>
</div>
