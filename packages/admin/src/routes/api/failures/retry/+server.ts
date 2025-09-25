import type { RequestHandler } from './$types';
import type { RetryResponse } from '$lib/types/api';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		
		if (!body.id) {
			const error: RetryResponse = {
				ok: false,
				error: {
					code: 'BAD_INPUT',
					message: 'id required'
				}
			};
			return new Response(JSON.stringify(error), { 
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		// 목 데이터에서 해당 ID가 존재하는지 확인
		const mockFailures = [
			{ id: '1', text: '앨범 업로드 실패', retryable: true },
			{ id: '2', text: '메타데이터 동기화 오류', retryable: true },
			{ id: '3', text: 'CDN 캐시 갱신 실패', retryable: false },
			{ id: '4', text: '이메일 알림 전송 실패', retryable: true },
			{ id: '5', text: '데이터베이스 연결 오류', retryable: true }
		];

		const failure = mockFailures.find(f => f.id === body.id);
		if (!failure) {
			const error: RetryResponse = {
				ok: false,
				error: {
					code: 'NOT_FOUND',
					message: 'Failure not found'
				}
			};
			return new Response(JSON.stringify(error), { 
				status: 404,
				headers: { 'content-type': 'application/json' }
			});
		}

		if (!failure.retryable) {
			const error: RetryResponse = {
				ok: false,
				error: {
					code: 'NOT_RETRYABLE',
					message: 'This failure cannot be retried'
				}
			};
			return new Response(JSON.stringify(error), { 
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		// 재시도 성공 시뮬레이션 (80% 성공률)
		const success = Math.random() > 0.2;
		const status = success ? 'ok' : 'failed';
		
		const response: RetryResponse = { 
			ok: true, 
			data: { id: body.id, status: status as 'queued' | 'ok' | 'failed' }
		};
		
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const errorResponse: RetryResponse = {
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
