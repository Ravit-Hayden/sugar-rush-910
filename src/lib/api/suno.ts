/**
 * SUNO API 레이어
 * 
 * 개발 환경에서는 목업 데이터를 반환하고,
 * 프로덕션 환경에서는 실제 API를 호출합니다.
 * 
 * 사용 방법:
 * - 페이지에서 이 함수들을 import하여 사용
 * - 실제 API 연동 시 이 파일의 함수 내용만 수정하면 됨
 * - 컴포넌트 코드는 변경 불필요
 */

import type { SUNOProject, SUNOSubscription, WordEntry, RecentActivity } from '$lib/types/suno';
import { mockProjects, mockSubscription, mockWords, mockRecentActivities } from '$lib/mocks/suno';

// 개발 모드 여부 (나중에 환경 변수로 전환 가능)
const USE_MOCK = true;

// API 응답 지연 시뮬레이션 (개발용)
const MOCK_DELAY = 0; // ms, 0이면 즉시 반환

/**
 * 지연 시뮬레이션 헬퍼
 */
async function delay(ms: number): Promise<void> {
	if (ms > 0) {
		await new Promise(resolve => setTimeout(resolve, ms));
	}
}

/**
 * 프로젝트 목록 조회
 */
export async function getProjects(): Promise<SUNOProject[]> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		return [...mockProjects];
	}
	
	// TODO: 실제 API 연동
	const response = await fetch('/api/suno/projects');
	return response.json();
}

/**
 * 단일 프로젝트 조회
 */
export async function getProject(id: string): Promise<SUNOProject | null> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		return mockProjects.find(p => p.id === id) ?? null;
	}
	
	// TODO: 실제 API 연동
	const response = await fetch(`/api/suno/projects/${id}`);
	if (!response.ok) return null;
	return response.json();
}

/**
 * 구독 정보 조회
 */
export async function getSubscription(): Promise<SUNOSubscription> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		return { ...mockSubscription };
	}
	
	// TODO: 실제 API 연동
	const response = await fetch('/api/suno/subscription');
	return response.json();
}

/**
 * 워드 목록 조회
 */
export async function getWords(): Promise<WordEntry[]> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		return [...mockWords];
	}
	
	// TODO: 실제 API 연동
	const response = await fetch('/api/suno/words');
	return response.json();
}

/**
 * 최근 활동 조회
 */
export async function getRecentActivities(limit: number = 5): Promise<RecentActivity[]> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		return mockRecentActivities.slice(0, limit);
	}
	
	// TODO: 실제 API 연동
	const response = await fetch(`/api/suno/activities?limit=${limit}`);
	return response.json();
}

/**
 * 프로젝트 통계 계산
 */
export function calculateProjectStats(projects: SUNOProject[]) {
	const inProgress = projects.filter(p => p.status === 'in_progress').length;
	const completed = projects.filter(p => p.status === 'completed').length;
	const totalProgress = projects.reduce((sum, p) => sum + p.progressPercent, 0);
	const avgProgress = projects.length > 0 ? Math.round(totalProgress / projects.length) : 0;

	return { inProgress, completed, avgProgress, totalProjects: projects.length };
}

/**
 * 크레딧 사용률 계산
 */
export function calculateCreditUsage(subscription: SUNOSubscription): number {
	return Math.round(
		((subscription.monthlyCredits - subscription.remainingCredits) / subscription.monthlyCredits) * 100
	);
}

/**
 * 다음 결제일까지 남은 일수 계산
 */
export function calculateDaysUntilBilling(billingDate: number): number {
	const today = new Date();
	const currentDay = today.getDate();
	if (currentDay < billingDate) {
		return billingDate - currentDay;
	}
	const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, billingDate);
	const diff = Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
	return diff;
}

/**
 * 프로젝트 휴지통으로 이동
 */
export async function trashProject(id: string): Promise<{ success: boolean; message?: string }> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		const project = mockProjects.find(p => p.id === id);
		if (project) {
			project.status = 'trashed';
			return { success: true };
		}
		return { success: false, message: '프로젝트를 찾을 수 없습니다.' };
	}
	
	// TODO: 실제 API 연동
	const response = await fetch(`/api/suno/projects/${id}/trash`, { method: 'POST' });
	return response.json();
}

/**
 * 프로젝트 일괄 휴지통 이동
 */
export async function trashProjects(ids: string[]): Promise<{ success: boolean; trashedCount: number; message?: string }> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		let trashedCount = 0;
		ids.forEach(id => {
			const project = mockProjects.find(p => p.id === id);
			if (project) {
				project.status = 'trashed';
				trashedCount++;
			}
		});
		return { success: true, trashedCount };
	}
	
	// TODO: 실제 API 연동
	const response = await fetch('/api/suno/projects/batch-trash', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids })
	});
	return response.json();
}

/**
 * 휴지통에서 복원
 */
export async function restoreProject(id: string): Promise<{ success: boolean; message?: string }> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		const project = mockProjects.find(p => p.id === id);
		if (project && project.status === 'trashed') {
			project.status = 'in_progress';
			return { success: true };
		}
		return { success: false, message: '프로젝트를 찾을 수 없습니다.' };
	}
	
	// TODO: 실제 API 연동
	const response = await fetch(`/api/suno/projects/${id}/restore`, { method: 'POST' });
	return response.json();
}

/**
 * 프로젝트 영구 삭제 (휴지통에서만 가능)
 */
export async function deleteProject(id: string): Promise<{ success: boolean; message?: string }> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		const index = mockProjects.findIndex(p => p.id === id && p.status === 'trashed');
		if (index !== -1) {
			mockProjects.splice(index, 1);
			return { success: true };
		}
		return { success: false, message: '휴지통에서만 영구 삭제할 수 있습니다.' };
	}
	
	// TODO: 실제 API 연동
	const response = await fetch(`/api/suno/projects/${id}`, { method: 'DELETE' });
	return response.json();
}

/**
 * 프로젝트 일괄 영구 삭제 (휴지통에서만 가능)
 */
export async function deleteProjects(ids: string[]): Promise<{ success: boolean; deletedCount: number; message?: string }> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		let deletedCount = 0;
		ids.forEach(id => {
			const index = mockProjects.findIndex(p => p.id === id && p.status === 'trashed');
			if (index !== -1) {
				mockProjects.splice(index, 1);
				deletedCount++;
			}
		});
		return { success: true, deletedCount };
	}
	
	// TODO: 실제 API 연동
	const response = await fetch('/api/suno/projects/batch-delete', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids })
	});
	return response.json();
}

/**
 * 프로젝트 보관
 */
export async function archiveProject(id: string): Promise<{ success: boolean; message?: string }> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		const project = mockProjects.find(p => p.id === id);
		if (project) {
			project.status = 'archived';
			return { success: true };
		}
		return { success: false, message: '프로젝트를 찾을 수 없습니다.' };
	}
	
	// TODO: 실제 API 연동
	const response = await fetch(`/api/suno/projects/${id}/archive`, { method: 'POST' });
	return response.json();
}

/**
 * 프로젝트 일괄 보관
 */
export async function archiveProjects(ids: string[]): Promise<{ success: boolean; archivedCount: number; message?: string }> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		let archivedCount = 0;
		ids.forEach(id => {
			const project = mockProjects.find(p => p.id === id);
			if (project) {
				project.status = 'archived';
				archivedCount++;
			}
		});
		return { success: true, archivedCount };
	}
	
	// TODO: 실제 API 연동
	const response = await fetch('/api/suno/projects/batch-archive', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids })
	});
	return response.json();
}

/**
 * 즐겨찾기 토글
 */
export async function toggleFavorite(id: string): Promise<{ success: boolean; isFavorite: boolean }> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		// 목업에서는 성공으로 처리 (실제 상태는 로컬에서 관리)
		return { success: true, isFavorite: true };
	}
	
	// TODO: 실제 API 연동
	const response = await fetch(`/api/suno/projects/${id}/favorite`, { method: 'POST' });
	return response.json();
}

/**
 * 즐겨찾기 목록 조회
 */
export async function getFavorites(): Promise<string[]> {
	if (USE_MOCK) {
		await delay(MOCK_DELAY);
		// 초기 즐겨찾기 목록 (로컬 스토리지에서 관리 가능)
		return ['proj1', 'proj4'];
	}
	
	// TODO: 실제 API 연동
	const response = await fetch('/api/suno/favorites');
	return response.json();
}
