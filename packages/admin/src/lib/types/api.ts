// Appendix A의 API 계약 타입 정의

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: { code: string; message: string; details?: any } };

// 대시보드 카드별 데이터 타입
export interface Task {
	id: string;
	title: string;
	priority: boolean;
	due?: string;
}

export interface Mention {
	id: string;
	text: string;
	from: string;
	ts: number;
}

export interface Deadline {
	id: string;
	label: string;
	d: string;
}

export interface Failure {
	id: string;
	text: string;
	retryable: boolean;
}

export interface StatusItem {
	key: string;
	value: string;
}

export interface Change {
	id: string;
	text: string;
	recent: boolean;
}

export interface Release {
	id: string;
	title: string;
	when: string;
}

export interface Action {
	label: string;
	href: string;
}

export interface Log {
	id: string;
	text: string;
	ts: number;
}

export interface KpiSeries {
	name: string;
	points: Array<{ x: number; y: number }>;
}

export interface KpiData {
	series: KpiSeries[];
}

// API 응답 타입들
export type TasksResponse = ApiOk<Task[]> | ApiErr;
export type MentionsResponse = ApiOk<Mention[]> | ApiErr;
export type DeadlinesResponse = ApiOk<Deadline[]> | ApiErr;
export type FailuresResponse = ApiOk<Failure[]> | ApiErr;
export type RetryResponse = ApiOk<{ id: string; status: 'queued' | 'ok' | 'failed' }> | ApiErr;
export type StatusResponse = ApiOk<StatusItem[]> | ApiErr;
export type ChangesResponse = ApiOk<Change[]> | ApiErr;
export type ReleasesResponse = ApiOk<Release[]> | ApiErr;
export type ActionsResponse = ApiOk<Action[]> | ApiErr;
export type LogsResponse = ApiOk<Log[]> | ApiErr;
export type KpiResponse = ApiOk<KpiData> | ApiErr;
