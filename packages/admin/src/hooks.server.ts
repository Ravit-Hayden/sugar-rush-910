import type { Handle } from '@sveltejs/kit';
import type { ApiErr } from '$lib/types/api';

// 사용자 타입 정의
export interface User {
	id: string;
	email: string;
	role: 'owner' | 'editor' | 'viewer';
	name?: string;
}

// 인증 상태를 위한 타입
export interface AuthState {
	user: User | null;
	authenticated: boolean;
}

// Cloudflare Access 또는 세션 쿠키를 통한 인증 검증
async function verifyAuth(request: Request): Promise<User | null> {
	try {
		// Cloudflare Access 토큰 검증 (우선순위)
		const cfAccessToken = request.headers.get('CF-Access-Token');
		if (cfAccessToken) {
			// 실제 구현에서는 Cloudflare Access API로 토큰 검증
			// 여기서는 목 데이터 반환
			return {
				id: 'el-user',
				email: 'el@sugar-rush.team',
				role: 'owner',
				name: 'El'
			};
		}

		// 세션 쿠키 검증 (대안)
		const sessionCookie = request.headers.get('cookie');
		if (sessionCookie) {
			// 실제 구현에서는 세션 쿠키 검증 로직
			// 여기서는 목 데이터 반환
			return {
				id: 'ot-user',
				email: 'otte@sugar-rush.team',
				role: 'editor',
				name: 'Otte'
			};
		}

		return null;
	} catch (error) {
		console.error('Auth verification failed:', error);
		return null;
	}
}

// RBAC 권한 검증
export function hasPermission(user: User | null, requiredRole: 'owner' | 'editor' | 'viewer'): boolean {
	if (!user) return false;

	const roleHierarchy = {
		owner: 3,
		editor: 2,
		viewer: 1
	};

	return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

// API 에러 응답 생성
function createAuthError(message: string): Response {
	const response: ApiErr = {
		ok: false,
		error: {
			code: 'NOT_AUTHORIZED',
			message
		}
	};

	return new Response(JSON.stringify(response), {
		status: 401,
		headers: { 'content-type': 'application/json' }
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	// 인증 검증
	const user = await verifyAuth(event.request);
	
	// 사용자 정보를 event.locals에 저장
	event.locals.user = user;
	event.locals.authenticated = !!user;

	// API 라우트에 대한 권한 검증
	if (event.url.pathname.startsWith('/api/')) {
		// 재시도 API는 editor+ 권한 필요
		if (event.url.pathname.includes('/failures/retry') && event.request.method === 'POST') {
			if (!hasPermission(user, 'editor')) {
				return createAuthError('재시도 기능은 편집자 이상의 권한이 필요합니다.');
			}
		}

		// 편집 관련 API는 editor+ 권한 필요
		if (event.url.pathname.match(/\/api\/(tasks|changes|releases)\/.*/) && 
			['POST', 'PUT', 'DELETE'].includes(event.request.method)) {
			if (!hasPermission(user, 'editor')) {
				return createAuthError('편집 기능은 편집자 이상의 권한이 필요합니다.');
			}
		}

		// 관리자 기능은 owner 권한 필요
		if (event.url.pathname.match(/\/api\/(users|settings|security)\/.*/) && 
			['POST', 'PUT', 'DELETE'].includes(event.request.method)) {
			if (!hasPermission(user, 'owner')) {
				return createAuthError('관리자 기능은 소유자 권한이 필요합니다.');
			}
		}
	}

	// 감사 로그 기록 (변경 작업에 대해서만)
	if (user && event.url.pathname.startsWith('/api/') && 
		['POST', 'PUT', 'DELETE'].includes(event.request.method)) {
		
		// 실제 구현에서는 audit_log 테이블에 기록
		console.log(`Audit: ${user.email} (${user.role}) performed ${event.request.method} on ${event.url.pathname}`);
	}

	return resolve(event);
};




















