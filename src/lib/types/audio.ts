// 음원 관리 센터 타입 정의

// 폴더 타입
export interface AudioFolder {
	id: string;
	name: string;
	parentId: string | null; // null이면 루트
	color?: string;
	fileCount: number;
	createdAt: string;
	updatedAt: string;
}

// 오디오 파일 타입
export interface AudioFile {
	id: string;
	fileName: string;
	originalName: string;
	folderId: string | null; // null이면 루트
	fileUrl: string;
	fileSize: number; // bytes
	duration: number; // seconds
	format: string; // mp3, wav, flac 등
	sampleRate?: number; // 44100, 48000 등
	bitrate?: number; // kbps
	channels?: number; // 1=mono, 2=stereo
	tags: string[];
	description?: string;
	linkedTrackId?: string; // 트랙과 연결된 경우
	uploadedBy: 'El' | 'Otte';
	uploadedAt: string;
	updatedAt: string;
	isStarred: boolean;
	isArchived: boolean;
}

// 업로드 상태
export type UploadStatus = 'pending' | 'uploading' | 'processing' | 'success' | 'error';

// 업로드 항목
export interface UploadItem {
	id: string;
	file: File;
	status: UploadStatus;
	progress: number;
	error?: string;
	audioFile?: AudioFile; // 업로드 완료 후 생성된 AudioFile
}

// 정렬 옵션
export type AudioSortField = 'name' | 'size' | 'duration' | 'uploadedAt' | 'updatedAt';
export type AudioSortOrder = 'asc' | 'desc';

export interface AudioSortOption {
	field: AudioSortField;
	order: AudioSortOrder;
}

// 필터 옵션
export interface AudioFilterOption {
	search: string;
	folderId: string | null; // null = 모든 폴더
	tags: string[];
	format: string | null;
	uploadedBy: 'El' | 'Otte' | null;
	isStarred: boolean | null;
	isArchived: boolean | null;
	dateRange: {
		start: string | null;
		end: string | null;
	};
}

// 뷰 모드
export type AudioViewMode = 'list' | 'grid';

// 선택 상태
export interface AudioSelection {
	selectedIds: Set<string>;
	lastSelectedId: string | null;
}

// 컨텍스트 메뉴 항목
export interface AudioContextMenuItem {
	id: string;
	label: string;
	icon?: any;
	action: () => void;
	separator?: boolean;
	danger?: boolean;
	disabled?: boolean;
}

// 폴더 색상 프리셋 (32가지 + 커스텀)
export const FOLDER_COLORS = [
	// Row 1: 그레이 ~ 핑크
	{ id: 'default', name: '기본', value: '#6b7280' },
	{ id: 'slate', name: '슬레이트', value: '#64748b' },
	{ id: 'zinc', name: '징크', value: '#71717a' },
	{ id: 'stone', name: '스톤', value: '#78716c' },
	{ id: 'pink', name: '핑크', value: '#ec4899' },
	{ id: 'hotpink', name: '핫핑크', value: '#ff1493' },
	{ id: 'rose', name: '로즈', value: '#fb7185' },
	{ id: 'fuchsia', name: '푸시아', value: '#d946ef' },
	// Row 2: 레드 ~ 옐로우
	{ id: 'red', name: '레드', value: '#ef4444' },
	{ id: 'crimson', name: '크림슨', value: '#dc143c' },
	{ id: 'coral', name: '코랄', value: '#ff7f50' },
	{ id: 'orange', name: '오렌지', value: '#f97316' },
	{ id: 'amber', name: '앰버', value: '#f59e0b' },
	{ id: 'yellow', name: '옐로우', value: '#eab308' },
	{ id: 'gold', name: '골드', value: '#ffd700' },
	{ id: 'lime', name: '라임', value: '#84cc16' },
	// Row 3: 그린 계열
	{ id: 'green', name: '그린', value: '#22c55e' },
	{ id: 'emerald', name: '에메랄드', value: '#10b981' },
	{ id: 'teal', name: '틸', value: '#14b8a6' },
	{ id: 'cyan', name: '시안', value: '#06b6d4' },
	{ id: 'mint', name: '민트', value: '#2dd4bf' },
	{ id: 'aqua', name: '아쿠아', value: '#22d3ee' },
	{ id: 'turquoise', name: '터콰이즈', value: '#40e0d0' },
	{ id: 'sky', name: '스카이', value: '#0ea5e9' },
	// Row 4: 블루 ~ 퍼플
	{ id: 'blue', name: '블루', value: '#3b82f6' },
	{ id: 'indigo', name: '인디고', value: '#6366f1' },
	{ id: 'violet', name: '바이올렛', value: '#8b5cf6' },
	{ id: 'purple', name: '퍼플', value: '#a855f7' },
	{ id: 'plum', name: '플럼', value: '#9333ea' },
	{ id: 'orchid', name: '오키드', value: '#da70d6' },
	{ id: 'lavender', name: '라벤더', value: '#c084fc' },
	{ id: 'mauve', name: '모브', value: '#c4b5fd' }
] as const;

// 오디오 포맷 옵션
export const AUDIO_FORMATS = [
	{ id: 'mp3', name: 'MP3', mimeType: 'audio/mpeg' },
	{ id: 'wav', name: 'WAV', mimeType: 'audio/wav' },
	{ id: 'flac', name: 'FLAC', mimeType: 'audio/flac' },
	{ id: 'aac', name: 'AAC', mimeType: 'audio/aac' },
	{ id: 'ogg', name: 'OGG', mimeType: 'audio/ogg' },
	{ id: 'm4a', name: 'M4A', mimeType: 'audio/mp4' }
] as const;

// 유틸리티 함수들
export function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function getFormatFromMimeType(mimeType: string): string {
	const format = AUDIO_FORMATS.find(f => f.mimeType === mimeType);
	return format?.id || mimeType.split('/')[1] || 'unknown';
}

export function getFormatColor(format: string): string {
	const colors: Record<string, string> = {
		mp3: 'text-blue-400',
		wav: 'text-green-400',
		flac: 'text-purple-400',
		aac: 'text-orange-400',
		ogg: 'text-yellow-400',
		m4a: 'text-pink-400'
	};
	return colors[format.toLowerCase()] || 'text-text-muted';
}
