<script lang="ts">
	import { Settings, User, Bell, Shield, Palette, Database, Music, Plus, X, Upload, Image as ImageIcon, Link as LinkIcon, Edit2, Trash2 } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import type { Artist } from '../api/artists/+server';
	import { invalidateArtistsCache } from '$lib/constants/artists';

	let activeTab = $state('general');
	let settings = $state({
		notifications: {
			email: true,
			push: false,
			sms: false
		},
		privacy: {
			profile: 'public',
			activity: 'friends'
		},
		appearance: {
			theme: 'dark',
			language: 'ko'
		}
	});

	// 아티스트 관리
	let artists: Artist[] = $state([]);
	let loading = $state(false);
	let showAddForm = $state(false);
	let editingArtistId: string | null = $state(null);
	let newArtistName = $state('');
	let newArtistDescription = $state('');
	let newArtistPhotoUrl = $state('');
	let newArtistWebsite = $state('');
	let newArtistEmail = $state('');
	let newArtistInstagram = $state('');
	let newArtistTwitter = $state('');
	let newArtistYoutube = $state('');
	let newArtistGenre = $state('');
	let newArtistDebutDate = $state('');
	let newArtistAgency = $state('');
	let newArtistCountry = $state('');
	
	// 이미지 업로드 관련
	let imageFile: File | null = $state(null);
	let previewUrl: string | null = $state(null);
	let isDragging = $state(false);
	let imageInputMethod: 'file' | 'url' = $state('file');
	let fileInput: HTMLInputElement;
	
	// 입력 필드 참조
	let artistNameInput: HTMLInputElement;

	// 이미지 확대 보기
	let enlargedImageUrl: string | null = $state(null);

	// 아티스트 목록 로드
	async function loadArtists() {
		loading = true;
		try {
			const response = await fetch('/api/artists');
			const result = await response.json();
			if (result.ok) {
				artists = result.data;
			}
		} catch (error) {
			console.error('Failed to load artists:', error);
		} finally {
			loading = false;
		}
	}

	// 이미지 파일 처리
	function processFile(file: File) {
		if (file && file.type.startsWith('image/')) {
			imageFile = file;
			if (previewUrl && previewUrl.startsWith('blob:')) {
				URL.revokeObjectURL(previewUrl);
			}
			previewUrl = URL.createObjectURL(file);
			// 파일을 URL로 변환 (실제로는 서버에 업로드해야 하지만, 여기서는 임시로 blob URL 사용)
			newArtistPhotoUrl = previewUrl;
		}
	}

	// 이미지 선택 핸들러
	function handleImageSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			processFile(file);
		}
	}

	// 이미지 업로드 영역 클릭
	function handleImageAreaClick() {
		fileInput?.click();
	}

	// 드래그 앤 드롭 핸들러
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = false;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			const file = files[0];
			processFile(file);
		}
	}

	// 이미지 URL 변경 시 미리보기 업데이트
	$effect(() => {
		if (newArtistPhotoUrl && !newArtistPhotoUrl.startsWith('blob:')) {
			// URL인 경우 미리보기 설정
			if (previewUrl && previewUrl.startsWith('blob:')) {
				URL.revokeObjectURL(previewUrl);
			}
			previewUrl = newArtistPhotoUrl;
		}
	});

	// 새 아티스트 추가
	async function addArtist() {
		if (!newArtistName.trim()) return;

		try {
			const response = await fetch('/api/artists', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: newArtistName.trim(),
					description: newArtistDescription.trim() || undefined,
					photo_url: newArtistPhotoUrl.trim() || undefined,
					website: newArtistWebsite.trim() || undefined,
					email: newArtistEmail.trim() || undefined,
					instagram: newArtistInstagram.trim() || undefined,
					twitter: newArtistTwitter.trim() || undefined,
					youtube: newArtistYoutube.trim() || undefined,
					genre: newArtistGenre.trim() || undefined,
					debut_date: newArtistDebutDate.trim() || undefined,
					agency: newArtistAgency.trim() || undefined,
					country: newArtistCountry.trim() || undefined
				})
			});

			const result = await response.json();
			if (result.ok) {
				invalidateArtistsCache();
				await loadArtists();
				resetForm();
			} else {
				alert(result.error?.message || '아티스트 추가에 실패했습니다.');
			}
		} catch (error) {
			console.error('Failed to add artist:', error);
			alert('아티스트 추가 중 오류가 발생했습니다.');
		}
	}

	// 아티스트 편집 시작
	function startEdit(artist: Artist) {
		editingArtistId = artist.id;
		newArtistName = artist.name;
		newArtistDescription = artist.description || '';
		newArtistPhotoUrl = artist.photo_url || '';
		newArtistWebsite = artist.website || '';
		newArtistEmail = artist.email || '';
		newArtistInstagram = artist.instagram || '';
		newArtistTwitter = artist.twitter || '';
		newArtistYoutube = artist.youtube || '';
		newArtistGenre = artist.genre || '';
		newArtistDebutDate = artist.debut_date || '';
		newArtistAgency = artist.agency || '';
		newArtistCountry = artist.country || '';
		imageFile = null;
		if (previewUrl && previewUrl.startsWith('blob:')) {
			URL.revokeObjectURL(previewUrl);
		}
		previewUrl = artist.photo_url || null;
		imageInputMethod = 'url';
		showAddForm = false;
	}

	// 아티스트 수정
	async function updateArtist() {
		if (!editingArtistId || !newArtistName.trim()) return;

		try {
			const response = await fetch(`/api/artists?id=${editingArtistId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: newArtistName.trim(),
					description: newArtistDescription.trim() || undefined,
					photo_url: newArtistPhotoUrl.trim() || undefined,
					website: newArtistWebsite.trim() || undefined,
					email: newArtistEmail.trim() || undefined,
					instagram: newArtistInstagram.trim() || undefined,
					twitter: newArtistTwitter.trim() || undefined,
					youtube: newArtistYoutube.trim() || undefined,
					genre: newArtistGenre.trim() || undefined,
					debut_date: newArtistDebutDate.trim() || undefined,
					agency: newArtistAgency.trim() || undefined,
					country: newArtistCountry.trim() || undefined
				})
			});

			const result = await response.json();
			if (result.ok) {
				invalidateArtistsCache();
				await loadArtists();
				resetForm();
			} else {
				alert(result.error?.message || '아티스트 수정에 실패했습니다.');
			}
		} catch (error) {
			console.error('Failed to update artist:', error);
			alert('아티스트 수정 중 오류가 발생했습니다.');
		}
	}

	// 아티스트 삭제
	async function deleteArtist(artistId: string, artistName: string) {
		if (!confirm(`"${artistName}" 아티스트를 정말 삭제하시겠습니까?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/artists?id=${artistId}`, {
				method: 'DELETE'
			});

			const result = await response.json();
			if (result.ok) {
				invalidateArtistsCache();
				await loadArtists();
			} else {
				alert(result.error?.message || '아티스트 삭제에 실패했습니다.');
			}
		} catch (error) {
			console.error('Failed to delete artist:', error);
			alert('아티스트 삭제 중 오류가 발생했습니다.');
		}
	}

	// 폼 초기화 함수
	function resetForm() {
		editingArtistId = null;
		newArtistName = '';
		newArtistDescription = '';
		newArtistPhotoUrl = '';
		newArtistWebsite = '';
		newArtistEmail = '';
		newArtistInstagram = '';
		newArtistTwitter = '';
		newArtistYoutube = '';
		newArtistGenre = '';
		newArtistDebutDate = '';
		newArtistAgency = '';
		newArtistCountry = '';
		imageFile = null;
		if (previewUrl && previewUrl.startsWith('blob:')) {
			URL.revokeObjectURL(previewUrl);
		}
		previewUrl = null;
		showAddForm = false;
		imageInputMethod = 'file';
	}


	// 데이터 탭 활성화 시 아티스트 로드
	$effect(() => {
		if (activeTab === 'data' && artists.length === 0 && !loading) {
			loadArtists();
		}
	});

	const tabs = [
		{ id: 'general', label: '일반', icon: Settings },
		{ id: 'notifications', label: '알림', icon: Bell },
		{ id: 'privacy', label: '개인정보', icon: Shield },
		{ id: 'appearance', label: '외관', icon: Palette },
		{ id: 'data', label: '데이터', icon: Database }
	];
</script>

<PageContent>
	<PageHeader 
		title="설정" 
		description="계정 및 애플리케이션 설정을 관리하세요."
	/>

	<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
		<!-- 설정 탭 -->
		<div class="lg:col-span-1">
			<div class="bg-surface-1 rounded-lg p-4 border border-border-subtle">
				<nav class="space-y-2">
					{#each tabs as tab}
						{@const IconComponent = tab.icon}
						<button
							onclick={() => activeTab = tab.id}
							class="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors duration-200 {activeTab === tab.id ? 'bg-brand-pink text-white' : 'text-text-muted hover:bg-surface-2 hover:text-text-strong'}"
							type="button"
						>
							<IconComponent 
								size={16} 
								class={tab.id === 'data' ? 'text-brand-pink' : ''}
							/>
							<span class="text-sm font-medium">{tab.label}</span>
						</button>
					{/each}
				</nav>
			</div>
		</div>

		<!-- 설정 내용 -->
		<div class="lg:col-span-3">
			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				{#if activeTab === 'general'}
					<div>
						<h3 class="text-lg font-semibold text-text-strong mb-6 flex items-center gap-2">
							<User size={20} class="text-brand-pink" />
							일반 설정
						</h3>
						<div class="space-y-6">
							<div>
								<label for="username" class="block text-sm font-medium text-text-strong mb-2">사용자 이름</label>
								<input 
									id="username"
									type="text" 
									value="Sugar Rush Admin" 
									class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200"
								/>
							</div>
							<div>
								<label for="email" class="block text-sm font-medium text-text-strong mb-2">이메일</label>
								<input 
									id="email"
									type="email" 
									value="admin@sugarrush.com" 
									class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200"
								/>
							</div>
							<div>
								<label for="role" class="block text-sm font-medium text-text-strong mb-2">역할</label>
								<select id="role" class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200">
									<option>관리자</option>
									<option>편집자</option>
									<option>뷰어</option>
								</select>
							</div>
						</div>
					</div>
				{:else if activeTab === 'notifications'}
					<div>
						<h3 class="text-lg font-semibold text-text-strong mb-6 flex items-center gap-2">
							<Bell size={20} class="text-brand-pink" />
							알림 설정
						</h3>
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<div>
									<div class="text-sm font-medium text-text-strong">이메일 알림</div>
									<div class="text-xs text-text-muted">중요한 업데이트를 이메일로 받습니다</div>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input type="checkbox" bind:checked={settings.notifications.email} class="sr-only peer">
									<div class="w-11 h-6 bg-surface-2 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-pink/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
								</label>
							</div>
							<div class="flex items-center justify-between">
								<div>
									<div class="text-sm font-medium text-text-strong">푸시 알림</div>
									<div class="text-xs text-text-muted">브라우저 푸시 알림을 받습니다</div>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input type="checkbox" bind:checked={settings.notifications.push} class="sr-only peer">
									<div class="w-11 h-6 bg-surface-2 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-pink/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
								</label>
							</div>
							<div class="flex items-center justify-between">
								<div>
									<div class="text-sm font-medium text-text-strong">SMS 알림</div>
									<div class="text-xs text-text-muted">긴급한 알림을 SMS로 받습니다</div>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input type="checkbox" bind:checked={settings.notifications.sms} class="sr-only peer">
									<div class="w-11 h-6 bg-surface-2 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-pink/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
								</label>
							</div>
						</div>
					</div>
				{:else if activeTab === 'privacy'}
					<div>
						<h3 class="text-lg font-semibold text-text-strong mb-6 flex items-center gap-2">
							<Shield size={20} class="text-brand-pink" />
							개인정보 설정
						</h3>
						<div class="space-y-6">
							<div>
								<label for="profile-privacy" class="block text-sm font-medium text-text-strong mb-2">프로필 공개 설정</label>
								<select id="profile-privacy" bind:value={settings.privacy.profile} class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200">
									<option value="public">공개</option>
									<option value="friends">친구만</option>
									<option value="private">비공개</option>
								</select>
							</div>
							<div>
								<label for="activity-privacy" class="block text-sm font-medium text-text-strong mb-2">활동 공개 설정</label>
								<select id="activity-privacy" bind:value={settings.privacy.activity} class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200">
									<option value="public">공개</option>
									<option value="friends">친구만</option>
									<option value="private">비공개</option>
								</select>
							</div>
						</div>
					</div>
				{:else if activeTab === 'appearance'}
					<div>
						<h3 class="text-lg font-semibold text-text-strong mb-6 flex items-center gap-2">
							<Palette size={20} class="text-brand-pink" />
							외관 설정
						</h3>
						<div class="space-y-6">
							<div>
								<label for="theme" class="block text-sm font-medium text-text-strong mb-2">테마</label>
								<select id="theme" bind:value={settings.appearance.theme} class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200">
									<option value="dark">다크 모드</option>
									<option value="light">라이트 모드</option>
									<option value="auto">자동</option>
								</select>
							</div>
							<div>
								<label for="language" class="block text-sm font-medium text-text-strong mb-2">언어</label>
								<select id="language" bind:value={settings.appearance.language} class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all duration-200">
									<option value="ko">한국어</option>
									<option value="en">English</option>
									<option value="ja">日本語</option>
								</select>
							</div>
						</div>
					</div>
				{:else if activeTab === 'data'}
					<div>
						<h3 class="text-lg font-semibold text-text-strong mb-6 flex items-center gap-2">
							<Database size={20} class="text-brand-pink" />
							데이터 관리
						</h3>
						<div class="space-y-6">
							<!-- 아티스트 관리 -->
							<div class="bg-surface-2 rounded-lg p-4 border border-border-subtle data-management-card">
								<div class="flex items-center justify-between mb-4">
									<div class="flex items-center gap-2">
										<Music size={16} class="text-brand-pink" />
										<h4 class="text-sm font-medium text-text-strong">아티스트 관리</h4>
									</div>
									{#if !showAddForm && !editingArtistId}
										<button
											onclick={() => showAddForm = true}
											class="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-brand-pink text-white rounded-md hover:bg-brand-pink/90 transition-colors duration-200 font-medium focus:outline-none focus:ring-0"
											type="button"
										>
											<Plus size={14} />
											추가
										</button>
									{/if}
								</div>

								{#if showAddForm || editingArtistId}
									<div class="mb-4 p-4 bg-surface-1 rounded-md border border-border-subtle">
										<div class="space-y-4">
											<!-- 기본 정보 -->
											<div class="space-y-3">
												<h5 class="text-xs font-semibold text-text-strong uppercase tracking-wide">기본 정보</h5>
												
												<div>
													<label for="artist-name" class="block text-xs font-medium text-text-strong mb-1.5">아티스트 이름 <span class="text-brand-pink">*</span></label>
													<div class="relative">
														<input
															id="artist-name"
															type="text"
															bind:this={artistNameInput}
															bind:value={newArtistName}
															placeholder="예: Sugar Rush"
															class="input-base w-full px-3 py-1.5 text-sm {newArtistName.trim() ? 'pr-8' : 'pr-3'}"
															onkeydown={(e) => {
																if (e.key === 'Escape') resetForm();
															}}
														/>
														{#if newArtistName.trim()}
															<button
																type="button"
																onclick={() => {
																	newArtistName = '';
																	artistNameInput?.focus();
																}}
																class="btn-icon absolute inset-y-0 right-2 flex items-center pointer-events-auto"
																aria-label="입력 내용 지우기"
															>
																<X size={16} class="lucide-icon text-text-muted" />
															</button>
														{/if}
													</div>
												</div>

												<div>
													<label for="artist-description" class="block text-xs font-medium text-text-strong mb-1.5">아티스트 소개</label>
													<div class="relative">
														<textarea
															id="artist-description"
															bind:value={newArtistDescription}
															placeholder="아티스트에 대한 상세한 소개를 입력하세요..."
															rows="4"
															class="w-full px-3 {newArtistDescription.trim() ? 'pr-8' : 'pr-3'} py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none transition-colors duration-200 resize-none"
															onkeydown={(e) => {
																if (e.key === 'Escape') resetForm();
															}}
														></textarea>
														{#if newArtistDescription.trim()}
															<button
																type="button"
																onclick={() => newArtistDescription = ''}
																class="btn-icon absolute top-2 right-2 flex items-center pointer-events-auto"
																aria-label="입력 내용 지우기"
															>
																<X size={16} class="lucide-icon text-text-muted" />
															</button>
														{/if}
													</div>
												</div>
											</div>

											<!-- 이미지 업로드 -->
											<div class="space-y-3">
												<h5 class="text-xs font-semibold text-text-strong uppercase tracking-wide">프로필 사진</h5>
												
												<!-- 이미지 입력 방법 선택 -->
												<div class="flex gap-2 mb-2">
													<button
														type="button"
														onclick={() => imageInputMethod = 'file'}
														class="flex-1 px-3 py-1.5 text-xs rounded-md transition-colors duration-200 font-medium {imageInputMethod === 'file' ? 'bg-brand-pink text-white' : 'bg-surface-2 text-text-base hover:text-hover-cyan'}"
													>
														파일 선택
													</button>
													<button
														type="button"
														onclick={() => imageInputMethod = 'url'}
														class="flex-1 px-3 py-1.5 text-xs rounded-md transition-colors duration-200 font-medium {imageInputMethod === 'url' ? 'bg-brand-pink text-white' : 'bg-surface-2 text-text-base hover:text-hover-cyan'}"
													>
														URL 입력
													</button>
												</div>

												{#if imageInputMethod === 'file'}
													<!-- 드래그 앤 드롭 영역 -->
													<div
														class="relative border-2 border-dashed rounded-md p-4 transition-colors duration-200 {isDragging ? 'border-brand-pink bg-brand-pink/5' : 'border-border-subtle'}"
														ondragover={handleDragOver}
														ondragleave={handleDragLeave}
														ondrop={handleDrop}
														onclick={handleImageAreaClick}
														role="button"
														tabindex="0"
														onkeydown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																e.preventDefault();
																handleImageAreaClick();
															}
														}}
													>
														<input
															bind:this={fileInput}
															type="file"
															accept="image/*"
															class="hidden"
															onchange={handleImageSelect}
														/>
														{#if previewUrl}
															<div class="relative">
																<img src={previewUrl} alt="미리보기" class="w-full h-48 object-contain bg-surface-2 rounded-md" />
																<button
																	type="button"
																	onclick={(e) => {
																		e.stopPropagation();
																		imageFile = null;
																		if (previewUrl && previewUrl.startsWith('blob:')) {
																			URL.revokeObjectURL(previewUrl);
																		}
																		previewUrl = null;
																		newArtistPhotoUrl = '';
																		if (fileInput) fileInput.value = '';
																	}}
																	class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
																	aria-label="이미지 제거"
																>
																	<X size={14} />
																</button>
															</div>
														{:else}
															<div class="text-center">
																<Upload size={32} class="mx-auto mb-2 text-text-muted" />
																<p class="text-xs text-text-strong mb-1">파일을 드래그하거나 클릭하여 업로드</p>
																<p class="text-xs text-text-muted">JPG, PNG, GIF (최대 10MB)</p>
															</div>
														{/if}
													</div>
												{:else}
													<!-- URL 입력 -->
													<div>
														<div class="relative">
															<input
																id="artist-photo-url"
																type="url"
																bind:value={newArtistPhotoUrl}
																placeholder="https://example.com/photo.jpg"
																class="w-full px-3 {newArtistPhotoUrl.trim() ? 'pr-8' : 'pr-3'} py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none transition-colors duration-200"
																onkeydown={(e) => {
																	if (e.key === 'Escape') resetForm();
																}}
															/>
															{#if newArtistPhotoUrl.trim()}
																<button
																	type="button"
																	onclick={() => {
																		newArtistPhotoUrl = '';
																		previewUrl = null;
																	}}
																	class="btn-icon absolute inset-y-0 right-2 flex items-center pointer-events-auto"
																	aria-label="입력 내용 지우기"
																>
																	<X size={16} class="lucide-icon text-text-muted" />
																</button>
															{/if}
														</div>
														{#if newArtistPhotoUrl}
															<div class="mt-2 relative">
																<img src={newArtistPhotoUrl} alt="미리보기" class="w-full h-48 object-contain bg-surface-2 rounded-md" onerror={(e) => {
																	(e.target as HTMLImageElement).style.display = 'none';
																}} />
																<button
																	type="button"
																	onclick={() => {
																		newArtistPhotoUrl = '';
																		previewUrl = null;
																	}}
																	class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
																	aria-label="이미지 제거"
																>
																	<X size={14} />
																</button>
															</div>
														{/if}
													</div>
												{/if}
											</div>

											<!-- 연락처 정보 -->
											<div class="space-y-3">
												<h5 class="text-xs font-semibold text-text-strong uppercase tracking-wide">연락처 정보</h5>
												
												<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
													<div>
														<label for="artist-website" class="block text-xs font-medium text-text-strong mb-1.5">웹사이트</label>
														<div class="relative">
															<input
																id="artist-website"
																type="url"
																bind:value={newArtistWebsite}
																placeholder="https://example.com"
																class="w-full px-3 {newArtistWebsite.trim() ? 'pr-8' : 'pr-3'} py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none transition-colors duration-200"
																onkeydown={(e) => {
																	if (e.key === 'Escape') resetForm();
																}}
															/>
															{#if newArtistWebsite.trim()}
																<button
																	type="button"
																	onclick={() => newArtistWebsite = ''}
																	class="btn-icon absolute inset-y-0 right-2 flex items-center pointer-events-auto"
																	aria-label="입력 내용 지우기"
																>
																	<X size={16} class="lucide-icon text-text-muted" />
																</button>
															{/if}
														</div>
													</div>
													<div>
														<label for="artist-email" class="block text-xs font-medium text-text-strong mb-1.5">이메일</label>
														<div class="relative">
															<input
																id="artist-email"
																type="email"
																bind:value={newArtistEmail}
																placeholder="artist@example.com"
																class="w-full px-3 {newArtistEmail.trim() ? 'pr-8' : 'pr-3'} py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none transition-colors duration-200"
																onkeydown={(e) => {
																	if (e.key === 'Escape') resetForm();
																}}
															/>
															{#if newArtistEmail.trim()}
																<button
																	type="button"
																	onclick={() => newArtistEmail = ''}
																	class="btn-icon absolute inset-y-0 right-2 flex items-center pointer-events-auto"
																	aria-label="입력 내용 지우기"
																>
																	<X size={16} class="lucide-icon text-text-muted" />
																</button>
															{/if}
														</div>
													</div>
												</div>
											</div>

											<!-- 소셜 미디어 -->
											<div class="space-y-3">
												<h5 class="text-xs font-semibold text-text-strong uppercase tracking-wide">소셜 미디어</h5>
												
												<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
													<div>
														<label for="artist-instagram" class="block text-xs font-medium text-text-strong mb-1.5">Instagram</label>
														<div class="relative">
															<input
																id="artist-instagram"
																type="url"
																bind:value={newArtistInstagram}
																placeholder="https://instagram.com/..."
																class="w-full px-3 {newArtistInstagram.trim() ? 'pr-8' : 'pr-3'} py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none transition-colors duration-200"
																onkeydown={(e) => {
																	if (e.key === 'Escape') resetForm();
																}}
															/>
															{#if newArtistInstagram.trim()}
																<button
																	type="button"
																	onclick={() => newArtistInstagram = ''}
																	class="btn-icon absolute inset-y-0 right-2 flex items-center pointer-events-auto"
																	aria-label="입력 내용 지우기"
																>
																	<X size={16} class="lucide-icon text-text-muted" />
																</button>
															{/if}
														</div>
													</div>
													<div>
														<label for="artist-twitter" class="block text-xs font-medium text-text-strong mb-1.5">Twitter</label>
														<div class="relative">
															<input
																id="artist-twitter"
																type="url"
																bind:value={newArtistTwitter}
																placeholder="https://twitter.com/..."
																class="w-full px-3 {newArtistTwitter.trim() ? 'pr-8' : 'pr-3'} py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none transition-colors duration-200"
																onkeydown={(e) => {
																	if (e.key === 'Escape') resetForm();
																}}
															/>
															{#if newArtistTwitter.trim()}
																<button
																	type="button"
																	onclick={() => newArtistTwitter = ''}
																	class="btn-icon absolute inset-y-0 right-2 flex items-center pointer-events-auto"
																	aria-label="입력 내용 지우기"
																>
																	<X size={16} class="lucide-icon text-text-muted" />
																</button>
															{/if}
														</div>
													</div>
													<div>
														<label for="artist-youtube" class="block text-xs font-medium text-text-strong mb-1.5">YouTube</label>
														<div class="relative">
															<input
																id="artist-youtube"
																type="url"
																bind:value={newArtistYoutube}
																placeholder="https://youtube.com/..."
																class="w-full px-3 {newArtistYoutube.trim() ? 'pr-8' : 'pr-3'} py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none transition-colors duration-200"
																onkeydown={(e) => {
																	if (e.key === 'Escape') resetForm();
																}}
															/>
															{#if newArtistYoutube.trim()}
																<button
																	type="button"
																	onclick={() => newArtistYoutube = ''}
																	class="btn-icon absolute inset-y-0 right-2 flex items-center pointer-events-auto"
																	aria-label="입력 내용 지우기"
																>
																	<X size={16} class="lucide-icon text-text-muted" />
																</button>
															{/if}
														</div>
													</div>
												</div>
											</div>

											<!-- 추가 정보 -->
											<div class="space-y-3">
												<h5 class="text-xs font-semibold text-text-strong uppercase tracking-wide">추가 정보</h5>
												
												<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
													<div>
														<label for="artist-genre" class="block text-xs font-medium text-text-strong mb-1.5">장르</label>
														<div class="relative">
															<input
																id="artist-genre"
																type="text"
																bind:value={newArtistGenre}
																placeholder="예: Pop, R&B, Hip-Hop"
																class="w-full px-3 {newArtistGenre.trim() ? 'pr-8' : 'pr-3'} py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none transition-colors duration-200"
																onkeydown={(e) => {
																	if (e.key === 'Escape') resetForm();
																}}
															/>
															{#if newArtistGenre.trim()}
																<button
																	type="button"
																	onclick={() => newArtistGenre = ''}
																	class="btn-icon absolute inset-y-0 right-2 flex items-center pointer-events-auto"
																	aria-label="입력 내용 지우기"
																>
																	<X size={16} class="lucide-icon text-text-muted" />
																</button>
															{/if}
														</div>
													</div>
													<div>
														<label for="artist-debut-date" class="block text-xs font-medium text-text-strong mb-1.5">데뷔일</label>
														<DatePicker
															id="artist-debut-date"
															name="artist-debut-date"
															bind:value={newArtistDebutDate}
															placeholder="YYYY. MM. DD."
														/>
													</div>
													<div>
														<label for="artist-agency" class="block text-xs font-medium text-text-strong mb-1.5">소속사</label>
														<div class="relative">
															<input
																id="artist-agency"
																type="text"
																bind:value={newArtistAgency}
																placeholder="소속사명"
																class="w-full px-3 {newArtistAgency.trim() ? 'pr-8' : 'pr-3'} py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none transition-colors duration-200"
																onkeydown={(e) => {
																	if (e.key === 'Escape') resetForm();
																}}
															/>
															{#if newArtistAgency.trim()}
																<button
																	type="button"
																	onclick={() => newArtistAgency = ''}
																	class="btn-icon absolute inset-y-0 right-2 flex items-center pointer-events-auto"
																	aria-label="입력 내용 지우기"
																>
																	<X size={16} class="lucide-icon text-text-muted" />
																</button>
															{/if}
														</div>
													</div>
													<div>
														<label for="artist-country" class="block text-xs font-medium text-text-strong mb-1.5">국가/지역</label>
														<div class="relative">
															<input
																id="artist-country"
																type="text"
																bind:value={newArtistCountry}
																placeholder="예: 대한민국, USA"
																class="w-full px-3 {newArtistCountry.trim() ? 'pr-8' : 'pr-3'} py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none transition-colors duration-200"
																onkeydown={(e) => {
																	if (e.key === 'Escape') resetForm();
																}}
															/>
															{#if newArtistCountry.trim()}
																<button
																	type="button"
																	onclick={() => newArtistCountry = ''}
																	class="btn-icon absolute inset-y-0 right-2 flex items-center pointer-events-auto"
																	aria-label="입력 내용 지우기"
																>
																	<X size={16} class="lucide-icon text-text-muted" />
																</button>
															{/if}
														</div>
													</div>
												</div>
											</div>

											<!-- 버튼 -->
											<div class="flex items-center gap-2 pt-2 border-t border-border-subtle">
												<button
													onclick={editingArtistId ? updateArtist : addArtist}
													disabled={!newArtistName.trim()}
													class="px-4 py-2 text-xs bg-brand-pink text-white rounded-md hover:bg-brand-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium focus:outline-none focus:ring-0"
													type="button"
												>
													{editingArtistId ? '수정' : '저장'}
												</button>
												<button
													onclick={resetForm}
													class="px-4 py-2 text-xs bg-surface-2 text-text-muted border border-border-subtle rounded-md hover:border-hover-cyan hover:text-hover-cyan focus:border-brand-pink focus:text-brand-pink transition-colors duration-200 font-medium focus:outline-none focus:ring-0"
													type="button"
												>
													취소
												</button>
											</div>
										</div>
									</div>
								{/if}

								{#if loading}
									<div class="text-sm text-text-muted text-center py-4">로딩 중...</div>
								{:else if artists.length === 0}
									<div class="text-sm text-text-muted text-center py-4">등록된 아티스트가 없습니다.</div>
								{:else}
									<div class="space-y-3">
										{#each artists as artist (artist.id)}
											<div class="p-3 bg-surface-1 rounded-md border border-border-subtle h-32 flex items-start artist-card">
												<div class="flex items-start gap-3 w-full">
													{#if artist.photo_url}
														<button
															type="button"
															onclick={() => enlargedImageUrl = artist.photo_url || null}
															class="w-16 h-16 rounded-md overflow-hidden bg-surface-2 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-2 focus:ring-offset-surface-1"
															aria-label="이미지 확대"
														>
															<img src={artist.photo_url} alt={artist.name} class="w-full h-full object-contain" />
														</button>
													{:else}
														<div class="w-16 h-16 rounded-md bg-surface-2 flex items-center justify-center flex-shrink-0 pointer-events-none">
															<Music size={20} class="text-text-muted" />
														</div>
													{/if}
													<div class="flex-1 min-w-0 h-full flex flex-col">
														<div class="flex items-center justify-between gap-2 mb-1">
															<div class="text-sm font-semibold text-text-strong truncate select-none pointer-events-none">{artist.name}</div>
															<div class="flex items-center gap-1.5 flex-shrink-0">
																<button
																	onclick={() => startEdit(artist)}
																	class="p-1.5 text-text-muted hover:text-hover-cyan hover:bg-surface-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-0 focus:text-brand-pink"
																	aria-label="편집"
																	type="button"
																>
																	<Edit2 size={14} />
																</button>
																<button
																	onclick={() => deleteArtist(artist.id, artist.name)}
																	class="p-1.5 text-text-muted hover:text-red-500 hover:bg-surface-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-0 focus:text-red-500"
																	aria-label="삭제"
																	type="button"
																>
																	<Trash2 size={14} />
																</button>
															</div>
														</div>
														<div class="flex-1 overflow-hidden">
															{#if artist.description}
																<div class="text-xs text-text-muted line-clamp-2 select-none pointer-events-none">{artist.description}</div>
															{/if}
															<div class="flex flex-wrap gap-x-4 gap-y-1.5 mt-1.5">
																{#if artist.genre}
																	<span class="text-xs text-text-muted select-none pointer-events-none">장르: {artist.genre}</span>
																{/if}
																{#if artist.debut_date}
																	<span class="text-xs text-text-muted select-none pointer-events-none">데뷔: {artist.debut_date}</span>
																{/if}
																{#if artist.agency}
																	<span class="text-xs text-text-muted select-none pointer-events-none">소속: {artist.agency}</span>
																{/if}
																{#if artist.country}
																	<span class="text-xs text-text-muted select-none pointer-events-none">{artist.country}</span>
																{/if}
															</div>
															<div class="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
																{#if artist.website}
																	<a href={artist.website} target="_blank" rel="noopener noreferrer" class="text-link text-xs truncate max-w-[200px]">
																		웹사이트
																	</a>
																{/if}
																{#if artist.email}
																	<a href="mailto:{artist.email}" class="text-link text-xs truncate max-w-[200px]">
																		{artist.email}
																	</a>
																{/if}
																{#if artist.instagram}
																	<a href={artist.instagram} target="_blank" rel="noopener noreferrer" class="text-link text-xs truncate max-w-[200px]">
																		Instagram
																	</a>
																{/if}
																{#if artist.twitter}
																	<a href={artist.twitter} target="_blank" rel="noopener noreferrer" class="text-link text-xs truncate max-w-[200px]">
																		Twitter
																	</a>
																{/if}
																{#if artist.youtube}
																	<a href={artist.youtube} target="_blank" rel="noopener noreferrer" class="text-link text-xs truncate max-w-[200px]">
																		YouTube
																	</a>
																{/if}
															</div>
														</div>
													</div>
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</div>

							<div class="bg-surface-2 rounded-lg p-4 border border-border-subtle data-management-card">
								<h4 class="text-sm font-medium text-text-strong mb-2">데이터 내보내기</h4>
								<p class="text-xs text-text-muted mb-3">계정 데이터를 JSON 파일로 다운로드할 수 있습니다.</p>
								<button class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium text-sm" type="button">
									데이터 내보내기
								</button>
							</div>
							<div class="bg-surface-2 rounded-lg p-4 border border-border-subtle data-management-card">
								<h4 class="text-sm font-medium text-text-strong mb-2">계정 삭제</h4>
								<p class="text-xs text-text-muted mb-3">계정과 모든 데이터를 영구적으로 삭제합니다.</p>
								<button class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium" type="button">
									계정 삭제
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</PageContent>

<!-- 이미지 확대 모달 -->
{#if enlargedImageUrl}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
		onclick={() => enlargedImageUrl = null}
		role="dialog"
		aria-modal="true"
		aria-label="이미지 확대 보기"
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				enlargedImageUrl = null;
			}
		}}
		tabindex="-1"
	>
		<div class="relative max-w-[90vw] max-h-[90vh] flex flex-col items-end" onclick={(e) => e.stopPropagation()}>
			<div class="relative">
				<button
					type="button"
					onclick={() => enlargedImageUrl = null}
					class="absolute -top-10 -right-10 w-10 h-10 flex items-center justify-center bg-black/80 hover:bg-black text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-pink z-10"
					aria-label="닫기"
				>
					<X size={20} />
				</button>
				<img
					src={enlargedImageUrl}
					alt="확대된 이미지"
					class="max-w-full max-h-[90vh] object-contain"
				/>
			</div>
		</div>
	</div>
{/if}
