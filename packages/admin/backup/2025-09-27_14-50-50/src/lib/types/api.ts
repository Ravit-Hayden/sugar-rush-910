// API 응답 타입 정의
export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: { code: string; message: string; details?: unknown } };

// 카드별 데이터 타입
export interface Task {
	id: string;
	title: string;
	priority: boolean;
	due?: string;
	completed?: boolean;
	overdue?: boolean;
}

export interface Deadline {
	id: string;
	label: string;
	days: number;
	week?: boolean;
	urgent?: boolean;
	scheduled?: boolean;
}

export interface Failure {
	id: string;
	text: string;
	retryable: boolean;
	status: 'failed' | 'retrying' | 'blocked';
}

export interface StatusItem {
	key: string;
	value: string;
}

export interface Change {
	id: string;
	text: string;
	recent: boolean;
	today?: boolean;
	thisWeek?: boolean;
	thisMonth?: boolean;
	time: string;
}

export interface Feedback {
	id: string;
	text: string;
	from: string;
	time: string;
}

export interface Release {
	id: string;
	title: string;
	when: string;
}

export interface Action {
	label: string;
	href: string;
	icon?: unknown;
}

export interface Log {
	id: string;
	text: string;
	time: string;
}

export interface KpiData {
	name: string;
	points: Array<{ x: number; y: number }>;
}
