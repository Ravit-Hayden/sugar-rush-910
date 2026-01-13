import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	const limit = parseInt(url.searchParams.get('limit') || '8');

	// 목 데이터 - 실제 구현에서는 데이터베이스에서 검색
	// coverImage: 앨범/트랙 커버 이미지 URL (없으면 아이콘 표시)
	const mockData = {
		albums: [
			{ id: '1', title: 'Sugar Rush Vol.1', type: 'album', href: '/albums/1', coverImage: 'https://picsum.photos/seed/album1/200' },
			{ id: '2', title: 'Summer Night Collection', type: 'album', href: '/albums/2', coverImage: 'https://picsum.photos/seed/album2/200' },
			{ id: '3', title: 'Winter Dreams', type: 'album', href: '/albums/3', coverImage: 'https://picsum.photos/seed/album3/200' },
			{ id: '4', title: 'Spring Melody', type: 'album', href: '/albums/4' }, // 이미지 없음 - 아이콘 표시
			{ id: '5', title: 'Autumn Leaves', type: 'album', href: '/albums/5', coverImage: 'https://picsum.photos/seed/album5/200' }
		],
		tracks: [
			{ id: '6', title: 'Sweet Dreams', type: 'track', href: '/tracks/6', coverImage: 'https://picsum.photos/seed/track6/200' },
			{ id: '7', title: 'Midnight Dance', type: 'track', href: '/tracks/7', coverImage: 'https://picsum.photos/seed/track7/200' },
			{ id: '8', title: 'Morning Light', type: 'track', href: '/tracks/8' }, // 이미지 없음
			{ id: '9', title: 'Evening Star', type: 'track', href: '/tracks/9', coverImage: 'https://picsum.photos/seed/track9/200' },
			{ id: '10', title: 'Rainy Day', type: 'track', href: '/tracks/10' } // 이미지 없음
		],
		tasks: [
			{ id: '11', title: '앨범 커버 디자인 검토', type: 'task', href: '/tasks/11' },
			{ id: '12', title: '트랙 마스터링 완료', type: 'task', href: '/tasks/12' },
			{ id: '13', title: '가사 번역 작업', type: 'task', href: '/tasks/13' },
			{ id: '14', title: '음악 프로듀싱', type: 'task', href: '/tasks/14' },
			{ id: '15', title: '앨범 발매 준비', type: 'task', href: '/tasks/15' }
		],
		actions: [
			{ id: '16', title: '새 앨범 생성', type: 'action', href: '/albums/new' },
			{ id: '17', title: '발매 관리', type: 'release', href: '/releases' },
			{ id: '18', title: '수익 분석', type: 'revenue', href: '/revenue' },
			{ id: '19', title: '피드백 확인', type: 'feedback', href: '/feedback' },
			{ id: '20', title: '시스템 설정', type: 'settings', href: '/settings' }
		]
	};

	let exact: any[] = [];
	let similar: any[] = [];

	if (query.trim()) {
		const allItems = [...mockData.albums, ...mockData.tracks, ...mockData.tasks, ...mockData.actions];
		
		// 정확한 검색 - 검색어가 제목에 포함된 경우
		exact = allItems.filter(item => 
			item.title.toLowerCase().includes(query.toLowerCase())
		).slice(0, limit);

		// 추천 항목 - 검색어와 같은 타입의 항목 또는 관련 항목
		// 추천 이유를 함께 제공
		const exactIds = new Set(exact.map(item => item.id));
		
		if (exact.length > 0) {
			// 정확한 결과가 있으면 같은 타입의 다른 항목 추천
			const exactTypes = new Set(exact.map(item => item.type));
			similar = allItems
				.filter(item => !exactIds.has(item.id) && exactTypes.has(item.type))
				.slice(0, 4)
				.map(item => ({
					...item,
					recommendReason: `"${exact[0]?.title || query}"과(와) 같은 ${getTypeLabel(item.type)} 항목`
				}));
		} else {
			// 정확한 결과가 없으면 최근 항목 또는 인기 항목 추천
			similar = allItems
				.slice(0, 4)
				.map(item => ({
					...item,
					recommendReason: '자주 조회되는 항목'
				}));
		}
	} else {
		// 검색어가 없을 때는 빈 결과
		exact = [];
		similar = [];
	}

	return new Response(JSON.stringify({
		ok: true,
		data: { exact, similar }
	}), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

// 타입별 한글 라벨 (추천 이유 생성용)
function getTypeLabel(type: string): string {
	switch (type) {
		case 'album': return '앨범';
		case 'track': return '트랙';
		case 'task': return '할 일';
		case 'action': return '액션';
		case 'release': return '발매';
		case 'revenue': return '수익';
		case 'feedback': return '피드백';
		case 'settings': return '설정';
		default: return '기타';
	}
}
