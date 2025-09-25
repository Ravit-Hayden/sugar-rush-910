<script lang="ts">
	import { 
		LayoutGrid, Disc3, Music, FolderOpen, Heart, 
		Rocket, DollarSign, Calendar, MessageSquare, 
		Shield, Settings 
	} from 'lucide-svelte';

	const menuItems = [
		{ icon: LayoutGrid, label: '대시보드', href: '/' },
		{ icon: Disc3, label: '앨범 관리', href: '/albums' },
		{ icon: Music, label: '트랙 관리', href: '/tracks' },
		{ icon: FolderOpen, label: '업로드·검증 센터', href: '/upload' },
		{ icon: Heart, label: '제작·협업 보드', href: '/collaboration' },
		{ icon: Rocket, label: '발매 관리', href: '/releases' },
		{ icon: DollarSign, label: '수익 관리', href: '/revenue' },
		{ icon: Calendar, label: '일정·캘린더', href: '/calendar' },
		{ icon: MessageSquare, label: '피드백·알림 센터', href: '/feedback' },
		{ icon: Shield, label: '보안·운영 관리', href: '/security' },
		{ icon: Settings, label: '설정', href: '/settings' }
	];
</script>

<aside class="w-[240px] top-14 fixed left-0 h-[calc(100vh-56px)] bg-surface-2 border-r border-border-subtle z-40 overflow-y-auto">
	<nav class="p-4">
		<ul class="space-y-2">
			{#each menuItems as item}
				<li>
					<a
						href={item.href}
						class="flex items-center gap-3 px-3 py-2 rounded-md text-text-base hover:bg-surface-1 hover:text-text-strong transition-colors duration-200"
					>
						<svelte:component this={item.icon} size={16} />
						<span class="text-sm">{item.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>
