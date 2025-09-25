import type { RequestHandler } from './$types';
import type { ReleasesResponse } from '$lib/types/api';

// 목 데이터
const mockReleases = [
	{ id: '1', title: 'Sugar Rush Vol.2', when: '14:00' },
	{ id: '2', title: 'Single: Summer Vibes', when: '16:00' },
	{ id: '3', title: 'Remix Album', when: '18:00' },
	{ id: '4', title: 'OST Collection', when: '20:00' },
	{ id: '5', title: 'Live Session', when: '22:00' }
];

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		if (limit < 0 || isNaN(limit)) {
			const error: ReleasesResponse = {
				ok: false,
				error: {
					code: 'BAD_INPUT',
					message: 'limit must be a positive number'
				}
			};
			return new Response(JSON.stringify(error), { 
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		const data = mockReleases.slice(0, limit);
		const response: ReleasesResponse = { ok: true, data };
		
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const errorResponse: ReleasesResponse = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'Internal server error',
				details: error
			}
		};
		return new Response(JSON.stringify(errorResponse), { 
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
