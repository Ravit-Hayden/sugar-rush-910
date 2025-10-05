import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { id } = await request.json();
		
		// 목 데이터 - 실제 구현에서는 데이터베이스에서 재시도 처리
		console.log(`Retrying failure with id: ${id}`);
		
		// 시뮬레이션된 재시도 처리
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// 성공률 80%로 시뮬레이션
		const success = Math.random() > 0.2;
		
		if (success) {
			return new Response(JSON.stringify({
				ok: true,
				message: '재시도 성공'
			}), {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		} else {
			return new Response(JSON.stringify({
				ok: false,
				message: '재시도 실패'
			}), {
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	} catch (error) {
		console.error('Retry API error:', error);
		return new Response(JSON.stringify({
			ok: false,
			message: '서버 오류'
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};