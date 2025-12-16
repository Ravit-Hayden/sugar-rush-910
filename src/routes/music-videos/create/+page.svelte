<script lang="ts">
	import { Video, ArrowLeft, Play, Image, Users, Palette, Settings, Wand2, Upload } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	let selectedTrack = '';
	let selectedCharacters: string[] = [];
	let selectedAssets: string[] = [];
	let aiPrompt = '';
	let aiSettings = {
		model: 'runway-gen3',
		resolution: '1080p',
		aspect_ratio: '16:9',
		style_preset: 'cinematic',
		duration: '30'
	};

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

	let assets = [
		{ id: '1', name: 'Neon City Background', type: 'background', image: '/api/placeholder/150/100' },
		{ id: '2', name: 'Music Notes Animation', type: 'animation', image: '/api/placeholder/150/100' },
		{ id: '3', name: 'Particle Effects', type: 'effect', image: '/api/placeholder/150/100' }
	];

	let isGenerating = false;
	let generationProgress = 0;

	function handleBack() {
		window.history.back();
	}

	function handleCharacterToggle(characterId: string) {
		if (selectedCharacters.includes(characterId)) {
			selectedCharacters = selectedCharacters.filter(id => id !== characterId);
		} else {
			selectedCharacters = [...selectedCharacters, characterId];
		}
	}

	function handleAssetToggle(assetId: string) {
		if (selectedAssets.includes(assetId)) {
			selectedAssets = selectedAssets.filter(id => id !== assetId);
		} else {
			selectedAssets = [...selectedAssets, assetId];
		}
	}

	function handleGenerate() {
		if (!selectedTrack || !aiPrompt.trim()) {
			alert('트랙과 AI 프롬프트를 입력해주세요.');
			return;
		}

		isGenerating = true;
		generationProgress = 0;

		// 시뮬레이션: 생성 진행률 업데이트
		const interval = setInterval(() => {
			generationProgress += Math.random() * 10;
			if (generationProgress >= 100) {
				generationProgress = 100;
				isGenerating = false;
				clearInterval(interval);
				alert('뮤직비디오 생성이 완료되었습니다!');
			}
		}, 1000);
	}

	function handleUploadCharacter() {
		// 캐릭터 업로드 로직
	}

	function handleUploadAsset() {
		// 에셋 업로드 로직
	}
</script>

<PageContent>
	<PageHeader 
		title="뮤직비디오 생성" 
		description="AI로 새로운 뮤직비디오를 생성하세요."
		actions={[
			{
				icon: ArrowLeft,
				label: '뒤로가기',
				onclick: handleBack
			}
		]}
	/>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- 왼쪽: 설정 패널 -->
		<div class="lg:col-span-1 space-y-6">
			<!-- 트랙 선택 -->
			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<h3 class="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
					<Play size={20} class="text-brand-pink" />
					트랙 선택
				</h3>
				<select 
					bind:value={selectedTrack}
					class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200"
				>
					<option value="">트랙을 선택하세요</option>
					{#each tracks as track}
						<option value={track.id}>{track.title} - {track.album}</option>
					{/each}
				</select>
			</div>

			<!-- AI 설정 -->
			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<h3 class="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
					<Wand2 size={20} class="text-brand-pink" />
					AI 설정
				</h3>
				<div class="space-y-4">
					<div>
						<label for="ai-model" class="block text-sm font-medium text-text-strong mb-2">모델</label>
						<select 
							id="ai-model"
							bind:value={aiSettings.model}
							class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200"
						>
							<option value="runway-gen3">Runway Gen-3</option>
							<option value="pika-labs">Pika Labs</option>
							<option value="stable-video">Stable Video</option>
						</select>
					</div>
					<div>
						<label for="ai-resolution" class="block text-sm font-medium text-text-strong mb-2">해상도</label>
						<select 
							id="ai-resolution"
							bind:value={aiSettings.resolution}
							class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200"
						>
							<option value="720p">720p</option>
							<option value="1080p">1080p</option>
							<option value="4K">4K</option>
						</select>
					</div>
					<div>
						<label for="ai-aspect-ratio" class="block text-sm font-medium text-text-strong mb-2">화면 비율</label>
						<select 
							id="ai-aspect-ratio"
							bind:value={aiSettings.aspect_ratio}
							class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200"
						>
							<option value="16:9">16:9 (가로)</option>
							<option value="9:16">9:16 (세로)</option>
							<option value="1:1">1:1 (정사각형)</option>
						</select>
					</div>
					<div>
						<label for="ai-style-preset" class="block text-sm font-medium text-text-strong mb-2">스타일 프리셋</label>
						<select 
							id="ai-style-preset"
							bind:value={aiSettings.style_preset}
							class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200"
						>
							<option value="cinematic">시네마틱</option>
							<option value="anime">애니메이션</option>
							<option value="realistic">리얼리스틱</option>
							<option value="abstract">추상적</option>
						</select>
					</div>
				</div>
			</div>

			<!-- 생성 버튼 -->
			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<button 
					onclick={handleGenerate}
					disabled={isGenerating || !selectedTrack || !aiPrompt.trim()}
					class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 disabled:bg-surface-2 disabled:text-text-muted disabled:cursor-not-allowed transition-colors duration-200 font-medium"
				>
					{#if isGenerating}
						<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						생성 중... ({Math.round(generationProgress)}%)
					{:else}
						<Wand2 size={16} />
						뮤직비디오 생성
					{/if}
				</button>
				
				{#if isGenerating}
					<div class="mt-4">
						<div class="w-full bg-surface-2 rounded-full h-2">
							<div 
								class="bg-brand-pink h-2 rounded-full transition-all duration-300" 
								style="width: {generationProgress}%"
							></div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- 오른쪽: 프롬프트 및 에셋 선택 -->
		<div class="lg:col-span-2 space-y-6">
			<!-- AI 프롬프트 -->
			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<h3 class="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
					<Wand2 size={20} class="text-brand-pink" />
					AI 프롬프트
				</h3>
				<textarea 
					bind:value={aiPrompt}
					placeholder="뮤직비디오의 장면을 자세히 설명해주세요. 예: 달콤한 음악에 맞춰 핑크색 네온사인이 반짝이는 도시에서 춤추는 캐릭터들..."
					class="w-full h-32 px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200 resize-none"
				></textarea>
				<div class="mt-2 text-xs text-text-muted">
					프롬프트가 구체적일수록 더 정확한 결과를 얻을 수 있습니다.
				</div>
			</div>

			<!-- 캐릭터 선택 -->
			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-text-strong flex items-center gap-2">
						<Users size={20} class="text-brand-pink" />
						캐릭터 선택
					</h3>
					<button 
						onclick={handleUploadCharacter}
						class="inline-flex items-center gap-2 px-3 py-1 bg-surface-2 text-text-strong rounded-md hover:bg-surface-1 transition-colors duration-200 text-sm"
					>
						<Upload size={14} />
						업로드
					</button>
				</div>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
					{#each characters as character}
						<button 
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

			<!-- 에셋 선택 -->
			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-text-strong flex items-center gap-2">
						<Image size={20} class="text-brand-pink" />
						에셋 선택
					</h3>
					<button 
						onclick={handleUploadAsset}
						class="inline-flex items-center gap-2 px-3 py-1 bg-surface-2 text-text-strong rounded-md hover:bg-surface-1 transition-colors duration-200 text-sm"
					>
						<Upload size={14} />
						업로드
					</button>
				</div>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					{#each assets as asset}
						<button 
							onclick={() => handleAssetToggle(asset.id)}
							class="p-3 rounded-lg border transition-colors duration-200 {selectedAssets.includes(asset.id) ? 'border-brand-pink bg-brand-pink/10' : 'border-border-subtle bg-surface-2 hover:bg-surface-1'}"
						>
							<div class="w-full h-16 bg-surface-1 rounded mb-2 flex items-center justify-center">
								<img src={asset.image} alt={asset.name} class="w-full h-full object-cover rounded" />
							</div>
							<div class="text-xs font-medium text-text-strong line-clamp-1">{asset.name}</div>
							<div class="text-xs text-text-muted capitalize">{asset.type}</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- 선택된 항목 요약 -->
			{#if selectedCharacters.length > 0 || selectedAssets.length > 0}
				<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
					<h3 class="text-lg font-semibold text-text-strong mb-4">선택된 항목</h3>
					<div class="space-y-3">
						{#if selectedCharacters.length > 0}
							<div>
								<div class="text-sm font-medium text-text-strong mb-2">캐릭터</div>
								<div class="flex flex-wrap gap-2">
									{#each selectedCharacters as charId}
										{@const character = characters.find(c => c.id === charId)}
										<span class="px-3 py-1 bg-brand-pink/20 text-brand-pink rounded-full text-sm">
											{character?.name}
										</span>
									{/each}
								</div>
							</div>
						{/if}
						{#if selectedAssets.length > 0}
							<div>
								<div class="text-sm font-medium text-text-strong mb-2">에셋</div>
								<div class="flex flex-wrap gap-2">
									{#each selectedAssets as assetId}
										{@const asset = assets.find(a => a.id === assetId)}
										<span class="px-3 py-1 bg-hover-cyan/20 text-hover-cyan rounded-full text-sm">
											{asset?.name}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</PageContent>
