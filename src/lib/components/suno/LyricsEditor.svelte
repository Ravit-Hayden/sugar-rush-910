<script lang="ts">
	import { Check, AlertCircle, Sparkles, Copy, Save, RotateCcw, GitCompare, X, Languages, ExternalLink, SpellCheck } from 'lucide-svelte';
	import type { LyricsVersion, LyricsVersionType, WordEntry } from '$lib/types/suno';

	// 외부 링크 (API 없음, 새 탭에서 열기)
	const GOOGLE_TRANSLATE_BASE = 'https://translate.google.com/?sl=auto&tl=en&op=translate&text=';
	const DEEPL_TRANSLATOR = 'https://www.deepl.com/translator';
	const SPELL_CHECK_URL = 'https://nara-speller.co.kr/speller'; // 부산대 맞춤법(바른한글)

	function openGoogleTranslate(text: string) {
		if (!text.trim()) return;
		window.open(GOOGLE_TRANSLATE_BASE + encodeURIComponent(text.trim()), '_blank', 'noopener,noreferrer');
	}
	function openDeepL() {
		window.open(DEEPL_TRANSLATOR, '_blank', 'noopener,noreferrer');
	}
	function openSpellCheck() {
		window.open(SPELL_CHECK_URL, '_blank', 'noopener,noreferrer');
	}

	// Props
	interface Props {
		version?: LyricsVersion;
		words?: WordEntry[];
		onSave?: (content: string, notes: string) => void;
		readonly?: boolean;
	}

	let { version, words = [], onSave, readonly = false }: Props = $props();

	// 편집 상태
	let content = $state(version?.content || '');
	let changeNotes = $state('');
	let isEditing = $state(false);

	// 맞춤법 검사 상태
	let spellCheckResults = $state<{word: string; suggestions: string[]; index: number}[]>([]);
	let isCheckingSpell = $state(false);
	let showSpellPanel = $state(false);

	// AI 제안 상태
	let showAiSuggestions = $state(false);
	let aiSuggestions = $state<string[]>([]);
	let isGeneratingAi = $state(false);

	// Diff 비교 상태
	let showDiff = $state(false);
	let compareVersion = $state<LyricsVersion | null>(null);

	// 한글 맞춤법 검사 (목업 - 실제로는 API 연동 필요)
	const commonMisspellings: Record<string, string> = {
		'됬': '됐',
		'햇': '했',
		'왜냐면': '왜냐하면',
		'어의없다': '어이없다',
		'웬지': '왠지',
		'몇일': '며칠',
		'금새': '금세',
		'어떻게': '어떻게', // 정상
		'않돼': '안 돼',
		'되요': '돼요',
		'할께': '할게',
		'할꺼야': '할 거야'
	};

	async function checkSpelling() {
		isCheckingSpell = true;
		showSpellPanel = true;
		spellCheckResults = [];

		// 목업 맞춤법 검사
		await new Promise(r => setTimeout(r, 500));

		const results: typeof spellCheckResults = [];
		const words = content.split(/\s+/);
		
		words.forEach((word, index) => {
			const cleanWord = word.replace(/[^\uAC00-\uD7A3]/g, '');
			if (commonMisspellings[cleanWord]) {
				results.push({
					word: cleanWord,
					suggestions: [commonMisspellings[cleanWord]],
					index
				});
			}
		});

		spellCheckResults = results;
		isCheckingSpell = false;
	}

	function applySpellFix(original: string, replacement: string) {
		content = content.replace(new RegExp(original, 'g'), replacement);
		spellCheckResults = spellCheckResults.filter(r => r.word !== original);
	}

	// AI 가사 제안 생성
	async function generateAiSuggestions() {
		isGeneratingAi = true;
		showAiSuggestions = true;
		aiSuggestions = [];

		await new Promise(r => setTimeout(r, 800));

		// 워드 라이브러리에서 랜덤 조합
		const topics = words.filter(w => w.category === 'topic');
		const moods = words.filter(w => w.category === 'mood');
		const emotions = words.filter(w => w.category === 'emotion');
		const phrases = words.filter(w => w.category === 'phrase');

		const suggestions: string[] = [];

		for (let i = 0; i < 3; i++) {
			const parts: string[] = [];
			if (topics.length) parts.push(topics[Math.floor(Math.random() * topics.length)].content);
			if (moods.length) parts.push(moods[Math.floor(Math.random() * moods.length)].content);
			if (emotions.length) parts.push(emotions[Math.floor(Math.random() * emotions.length)].content);
			if (phrases.length) parts.push(phrases[Math.floor(Math.random() * phrases.length)].content);
			
			if (parts.length > 0) {
				suggestions.push(parts.join(' / '));
			}
		}

		// 기본 제안 추가
		if (suggestions.length === 0) {
			suggestions.push(
				'달콤한 꿈 / 설레는 마음 / 너와 함께',
				'여름밤 / 별빛 아래 / 영원히',
				'새벽 3시 / 고백 / 사랑해'
			);
		}

		aiSuggestions = suggestions;
		isGeneratingAi = false;
	}

	function insertSuggestion(text: string) {
		content += (content ? '\n\n' : '') + text;
		showAiSuggestions = false;
	}

	// 저장
	function handleSave() {
		if (onSave) {
			onSave(content, changeNotes);
			changeNotes = '';
			isEditing = false;
		}
	}

	// 복사
	async function copyContent() {
		await navigator.clipboard.writeText(content);
	}

	// 되돌리기
	function revertContent() {
		content = version?.content || '';
	}

	// 글자 수
	const charCount = $derived(content.length);
	const lineCount = $derived(content.split('\n').length);
</script>

<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
	<!-- 툴바 -->
	<div class="px-4 py-3 border-b border-border-subtle flex items-center justify-between gap-4 flex-wrap">
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={checkSpelling}
				disabled={isCheckingSpell || readonly}
				class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-surface-2 text-text-base hover:bg-surface-2/80 disabled:opacity-50 transition-colors"
			>
				{#if isCheckingSpell}
					<div class="w-4 h-4 border-2 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
				{:else}
					<Check size={14} />
				{/if}
				맞춤법 검사
			</button>
			<a
				href={SPELL_CHECK_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border-subtle text-text-base hover:bg-surface-2/50 transition-colors no-underline"
				title="부산대 맞춤법(바른한글) 열기"
			>
				<SpellCheck size={14} />
				바른한글
			</a>
			<button
				type="button"
				onclick={generateAiSuggestions}
				disabled={isGeneratingAi || readonly}
				class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-surface-2 text-text-base hover:bg-surface-2/80 disabled:opacity-50 transition-colors"
			>
				{#if isGeneratingAi}
					<div class="w-4 h-4 border-2 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
				{:else}
					<Sparkles size={14} />
				{/if}
				AI 제안
			</button>
			{#if !readonly}
				<button
					type="button"
					onclick={() => openGoogleTranslate(content)}
					class="btn-outline-hover flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border-subtle text-text-base transition-colors"
					title="작성한 글을 넣어 Google 번역 열기"
				>
					<Languages size={14} />
					Google 번역
				</button>
				<a
					href={DEEPL_TRANSLATOR}
					target="_blank"
					rel="noopener noreferrer"
					class="btn-outline-hover flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border-subtle text-text-base transition-colors no-underline"
					title="DeepL 번역기 열기"
				>
					<ExternalLink size={14} />
					DeepL
				</a>
			{/if}
		</div>
		<p class="w-full text-xs text-text-muted px-0 mt-1 order-last basis-full text-right">결과는 새 탭에서 복사한 뒤 여기 붙여넣어 주세요.</p>
		<div class="flex items-center gap-2">
			<button type="button" onclick={copyContent} class="btn-icon" title="복사">
				<Copy size={16} />
			</button>
			{#if !readonly}
				<button type="button" onclick={revertContent} class="btn-icon" title="되돌리기">
					<RotateCcw size={16} />
				</button>
			{/if}
		</div>
	</div>

	<!-- 맞춤법 검사 결과 패널 -->
	{#if showSpellPanel}
		<div class="px-4 py-3 bg-surface-2/50 border-b border-border-subtle">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium text-text-strong">맞춤법 검사 결과</span>
				<button type="button" onclick={() => showSpellPanel = false} class="btn-icon">
					<X size={14} />
				</button>
			</div>
			{#if spellCheckResults.length === 0}
				<div class="flex items-center gap-2 text-sm text-green-500">
					<Check size={14} />
					맞춤법 오류가 없습니다.
				</div>
			{:else}
				<div class="space-y-2">
					{#each spellCheckResults as result}
						<div class="flex items-center gap-3 text-sm">
							<span class="text-red-400 line-through">{result.word}</span>
							<span class="text-text-muted">→</span>
							{#each result.suggestions as suggestion}
								<button
									type="button"
									onclick={() => applySpellFix(result.word, suggestion)}
									class="px-2 py-0.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
								>
									{suggestion}
								</button>
							{/each}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- AI 제안 패널 -->
	{#if showAiSuggestions}
		<div class="px-4 py-3 bg-brand-pink/5 border-b border-border-subtle">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium text-text-strong">AI 가사 제안</span>
				<button type="button" onclick={() => showAiSuggestions = false} class="btn-icon">
					<X size={14} />
				</button>
			</div>
			{#if aiSuggestions.length === 0}
				<div class="text-sm text-text-muted">워드 라이브러리에서 조합을 생성 중...</div>
			{:else}
				<div class="space-y-2">
					{#each aiSuggestions as suggestion, i}
						<button
							type="button"
							onclick={() => insertSuggestion(suggestion)}
							class="w-full text-left px-3 py-2 rounded-lg bg-surface-1 text-sm text-text-base hover:bg-surface-2 transition-colors"
						>
							<span class="text-brand-pink mr-2">#{i + 1}</span>
							{suggestion}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- 에디터 -->
	<div class="p-4">
		<textarea
			bind:value={content}
			disabled={readonly}
			class="w-full h-64 bg-transparent text-text-base text-sm font-mono leading-relaxed resize-none focus:outline-none placeholder:text-text-muted"
			placeholder="가사를 입력하세요..."
			spellcheck="true"
			lang="ko"
		></textarea>
	</div>

	<!-- 푸터 -->
	<div class="px-4 py-3 border-t border-border-subtle flex items-center justify-between">
		<div class="text-xs text-text-muted">
			{charCount}자 · {lineCount}줄
		</div>
		{#if !readonly && onSave}
			<div class="flex items-center gap-3">
				<input
					type="text"
					bind:value={changeNotes}
					placeholder="변경 내용 메모"
					class="input-base h-8 px-3 text-sm w-48"
				/>
				<button
					type="button"
					onclick={handleSave}
					class="flex items-center gap-1.5 px-4 py-1.5 bg-brand-pink text-white text-sm rounded-lg hover:bg-brand-pink/90 transition-colors"
				>
					<Save size={14} />
					저장
				</button>
			</div>
		{/if}
	</div>
</div>
