import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	const limit = parseInt(url.searchParams.get('limit') || '8');

	// 목 데이터 - 실제 구현에서는 데이터베이스에서 검색
	const mockData = {
		albums: [
			{ id: '1', title: 'Sugar Rush Vol.1', type: 'album', href: '/albums/1' },
			{ id: '2', title: 'Summer Night Collection', type: 'album', href: '/albums/2' },
			{ id: '3', title: 'Winter Dreams', type: 'album', href: '/albums/3' },
			{ id: '4', title: 'Spring Melody', type: 'album', href: '/albums/4' },
			{ id: '5', title: 'Autumn Leaves', type: 'album', href: '/albums/5' }
		],
		tracks: [
			{ id: '6', title: 'Sweet Dreams', type: 'track', href: '/tracks/6' },
			{ id: '7', title: 'Midnight Dance', type: 'track', href: '/tracks/7' },
			{ id: '8', title: 'Morning Light', type: 'track', href: '/tracks/8' },
			{ id: '9', title: 'Evening Star', type: 'track', href: '/tracks/9' },
			{ id: '10', title: 'Rainy Day', type: 'track', href: '/tracks/10' }
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
		// 정확한 검색
		const allItems = [...mockData.albums, ...mockData.tracks, ...mockData.tasks, ...mockData.actions];
		exact = allItems.filter(item => 
			item.title.toLowerCase().includes(query.toLowerCase())
		).slice(0, limit);

		// 유사한 항목 (정확한 검색 결과와 다른 모든 항목)
		similar = allItems.filter(item => 
			!exact.some(exactItem => exactItem.id === item.id)
		).slice(0, limit);
	} else {
		// 검색어가 없을 때는 추천 항목 표시
		const allItems = [...mockData.albums, ...mockData.tracks, ...mockData.tasks, ...mockData.actions];
		similar = allItems.slice(0, limit);
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