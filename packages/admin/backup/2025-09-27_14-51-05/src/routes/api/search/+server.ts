import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// API 응답 타입 정의
type ApiOk<T> = {
	ok: true;
	data: T;
};

type ApiErr = {
	ok: false;
	error: string;
	code?: string;
};

// 검색 결과 타입
type SearchResult = {
	id: string;
	title: string;
	type: string;
	href: string;
};

// GET 요청 핸들러
export const GET: RequestHandler = async ({ url, platform }) => {
	try {
		const query = url.searchParams.get('q') || '';
		const limit = parseInt(url.searchParams.get('limit') || '8');

		// 빈 쿼리 처리
		if (!query.trim()) {
			const response: ApiOk<{ 
				exact: SearchResult[];
				similar: SearchResult[];
			}> = {
				ok: true,
				data: {
					exact: [],
					similar: []
				}
			};
			return json(response);
		}

		// D1 데이터베이스에서 검색 (실제 구현 시)
		let results: SearchResult[] = [];
		
		if (platform?.env?.DB) {
			try {
				// 실제 검색 쿼리 (현재는 테이블이 없어서 에러 발생)
				const stmt = platform.env.DB.prepare(`
					SELECT id, title, type, href 
					FROM search_items 
					WHERE title LIKE ? 
					LIMIT ?
				`);
				const dbResults = await stmt.bind(`%${query}%`, limit).all();
				results = dbResults.results as SearchResult[];
			} catch (dbError) {
				console.log('Database search error:', dbError);
				// 데이터베이스 오류 시 빈 결과 반환
			}
		}

		// 정확한 검색 결과가 없을 때 유사항목 추천
		const suggestions: SearchResult[] = [
			{ id: '1', title: '새 앨범 만들기', type: 'action', href: '/albums/new' },
			{ id: '2', title: '트랙 업로드', type: 'action', href: '/tracks/upload' },
			{ id: '3', title: '오늘 발매 일정', type: 'release', href: '/releases/today' },
			{ id: '4', title: '수익 현황', type: 'revenue', href: '/revenue' },
			{ id: '5', title: '피드백 관리', type: 'feedback', href: '/feedback' },
			{ id: '6', title: '시스템 설정', type: 'settings', href: '/settings' },
			{ id: '7', title: '앨범 관리', type: 'album', href: '/albums' },
			{ id: '8', title: '트랙 관리', type: 'track', href: '/tracks' },
			{ id: '9', title: '할 일 목록', type: 'task', href: '/tasks' },
			{ id: '10', title: '협업 관리', type: 'collaboration', href: '/collaborations' },
			{ id: '11', title: '캘린더', type: 'calendar', href: '/calendar' },
			{ id: '12', title: '알림 설정', type: 'notifications', href: '/notifications' },
			{ id: '13', title: '보안 설정', type: 'security', href: '/security' }
		];

		// 쿼리와 관련된 추천 항목 필터링
		const filteredSuggestions = suggestions.filter(item => 
			item.title.toLowerCase().includes(query.toLowerCase()) ||
			item.type.toLowerCase().includes(query.toLowerCase())
		);

		// 최종 추천 항목 (필터링된 항목이 없으면 기본 추천)
		const finalSuggestions = filteredSuggestions.length > 0 
			? filteredSuggestions 
			: suggestions.slice(0, 4);

		const response: ApiOk<{ 
			exact: SearchResult[];
			similar: SearchResult[];
		}> = {
			ok: true,
			data: {
				exact: results.slice(0, Math.floor(limit / 2)), // 정확한 결과는 절반
				similar: finalSuggestions.slice(0, Math.floor(limit / 2)) // 유사항목은 절반
			}
		};

		return json(response);

	} catch (error) {
		console.error('Search API error:', error);
		
		const errorResponse: ApiErr = {
			ok: false,
			error: '검색 중 오류가 발생했습니다.',
			code: 'SEARCH_ERROR'
		};

		return json(errorResponse, { status: 500 });
	}
};