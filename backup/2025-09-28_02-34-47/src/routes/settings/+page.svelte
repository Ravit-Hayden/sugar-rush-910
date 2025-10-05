<script lang="ts">
	import { Settings, User, Bell, Shield, Palette, Database } from 'lucide-svelte';

	let activeTab = 'general';
	let settings = {
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
	};

	const tabs = [
		{ id: 'general', label: '일반', icon: Settings },
		{ id: 'notifications', label: '알림', icon: Bell },
		{ id: 'privacy', label: '개인정보', icon: Shield },
		{ id: 'appearance', label: '외관', icon: Palette },
		{ id: 'data', label: '데이터', icon: Database }
	];
</script>

<div class="pt-0 pb-6">
	<div class="max-w-7xl mx-auto">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-text-strong mb-2">설정</h1>
			<p class="text-text-muted">계정 및 애플리케이션 설정을 관리하세요.</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
			<!-- 설정 탭 -->
			<div class="lg:col-span-1">
				<div class="bg-surface-2 rounded-lg p-4">
					<nav class="space-y-2">
						{#each tabs as tab}
							{@const IconComponent = tab.icon}
							<button
								onclick={() => activeTab = tab.id}
								class="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors {activeTab === tab.id ? 'bg-brand-pink text-white' : 'text-text-muted hover:bg-surface-1 hover:text-text-strong'}"
							>
								<IconComponent size={16} />
								<span class="text-sm font-medium">{tab.label}</span>
							</button>
						{/each}
					</nav>
				</div>
			</div>

			<!-- 설정 내용 -->
			<div class="lg:col-span-3">
				<div class="bg-surface-2 rounded-lg p-6">
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
										class="w-full px-3 py-2 bg-surface-1 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent"
									/>
								</div>
								<div>
									<label for="email" class="block text-sm font-medium text-text-strong mb-2">이메일</label>
									<input 
										id="email"
										type="email" 
										value="admin@sugarrush.com" 
										class="w-full px-3 py-2 bg-surface-1 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent"
									/>
								</div>
								<div>
									<label for="role" class="block text-sm font-medium text-text-strong mb-2">역할</label>
									<select id="role" class="w-full px-3 py-2 bg-surface-1 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent">
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
										<div class="w-11 h-6 bg-surface-1 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-pink/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
									</label>
								</div>
								<div class="flex items-center justify-between">
									<div>
										<div class="text-sm font-medium text-text-strong">푸시 알림</div>
										<div class="text-xs text-text-muted">브라우저 푸시 알림을 받습니다</div>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input type="checkbox" bind:checked={settings.notifications.push} class="sr-only peer">
										<div class="w-11 h-6 bg-surface-1 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-pink/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
									</label>
								</div>
								<div class="flex items-center justify-between">
									<div>
										<div class="text-sm font-medium text-text-strong">SMS 알림</div>
										<div class="text-xs text-text-muted">긴급한 알림을 SMS로 받습니다</div>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input type="checkbox" bind:checked={settings.notifications.sms} class="sr-only peer">
										<div class="w-11 h-6 bg-surface-1 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-pink/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
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
									<select id="profile-privacy" bind:value={settings.privacy.profile} class="w-full px-3 py-2 bg-surface-1 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent">
										<option value="public">공개</option>
										<option value="friends">친구만</option>
										<option value="private">비공개</option>
									</select>
								</div>
								<div>
									<label for="activity-privacy" class="block text-sm font-medium text-text-strong mb-2">활동 공개 설정</label>
									<select id="activity-privacy" bind:value={settings.privacy.activity} class="w-full px-3 py-2 bg-surface-1 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent">
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
									<select id="theme" bind:value={settings.appearance.theme} class="w-full px-3 py-2 bg-surface-1 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent">
										<option value="dark">다크 모드</option>
										<option value="light">라이트 모드</option>
										<option value="auto">자동</option>
									</select>
								</div>
								<div>
									<label for="language" class="block text-sm font-medium text-text-strong mb-2">언어</label>
									<select id="language" bind:value={settings.appearance.language} class="w-full px-3 py-2 bg-surface-1 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent">
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
								<div class="bg-surface-1 rounded-lg p-4">
									<h4 class="text-sm font-medium text-text-strong mb-2">데이터 내보내기</h4>
									<p class="text-xs text-text-muted mb-3">계정 데이터를 JSON 파일로 다운로드할 수 있습니다.</p>
									<button class="px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-brand-pink/90 transition-colors text-sm">
										데이터 내보내기
									</button>
								</div>
								<div class="bg-surface-1 rounded-lg p-4">
									<h4 class="text-sm font-medium text-text-strong mb-2">계정 삭제</h4>
									<p class="text-xs text-text-muted mb-3">계정과 모든 데이터를 영구적으로 삭제합니다.</p>
									<button class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm">
										계정 삭제
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
