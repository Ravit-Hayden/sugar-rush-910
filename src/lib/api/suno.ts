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
