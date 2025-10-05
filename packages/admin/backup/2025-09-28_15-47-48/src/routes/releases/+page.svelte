<script lang="ts">
	import { Rocket, Calendar, Clock, CheckCircle, AlertCircle, Play } from 'lucide-svelte';

	let releases = [
		{
			id: '1',
			title: 'Sugar Rush Vol.1',
			status: 'scheduled',
			releaseDate: '2024-12-31',
			platforms: ['Spotify', 'Apple Music', 'YouTube Music'],
			progress: 90
		},
		{
			id: '2',
			title: 'Summer Night',
			status: 'live',
			releaseDate: '2024-10-15',
			platforms: ['Spotify', 'Apple Music'],
			progress: 100
		},
		{
			id: '3',
			title: 'Demo Collection',
			status: 'draft',
			releaseDate: '2024-11-20',
			platforms: ['SoundCloud'],
			progress: 60
		}
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'live': return 'text-green-500 bg-green-500/10';
			case 'scheduled': return 'text-blue-500 bg-blue-500/10';
			case 'draft': return 'text-yellow-500 bg-yellow-500/10';
			default: return 'text-gray-500 bg-gray-500/10';
		}
	}

	function getStatusLabel(status: string) {
		switch (status) {
			case 'live': return '발매됨';
			case 'scheduled': return '예정됨';
			case 'draft': return '초안';
			default: return '알 수 없음';
		}
	}
</script>

<div class="pt-0 pb-6">
	<div class="max-w-7xl mx-auto">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-text-strong mb-2">발매 관리</h1>
			<p class="text-text-muted">음악 발매를 계획하고 관리하세요.</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each releases as release (release.id)}
				<div class="bg-surface-2 rounded-lg p-6 hover:bg-surface-1 transition-colors">
					<div class="flex items-start justify-between mb-4">
						<h3 class="text-lg font-semibold text-text-strong">{release.title}</h3>
						<span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(release.status)}">
							{getStatusLabel(release.status)}
						</span>
					</div>

					<div class="space-y-3">
						<div class="flex items-center gap-2 text-sm text-text-muted">
							<Calendar size={16} />
							<span>{release.releaseDate}</span>
						</div>

						<div>
							<div class="flex items-center justify-between text-sm mb-1">
								<span class="text-text-muted">준비도</span>
								<span class="text-text-strong">{release.progress}%</span>
							</div>
							<div class="w-full bg-surface-1 rounded-full h-2">
								<div 
									class="bg-brand-pink h-2 rounded-full transition-all duration-300" 
									style="width: {release.progress}%"
								></div>
							</div>
						</div>

						<div class="text-sm text-text-muted">
							<div class="font-medium mb-1">플랫폼:</div>
							<div class="flex flex-wrap gap-1">
								{#each release.platforms as platform}
									<span class="px-2 py-1 bg-surface-1 rounded text-xs">{platform}</span>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
