/**
 * SUNO AI 음악 제작 관리 시스템 타입 정의
 * @see docs/SUNO_PRODUCTION_SYSTEM.md
 */

// ============================================
// 워드/문구 라이브러리
// ============================================

/** 워드 카테고리 */
export type WordCategory =
	| 'topic'      // 주제
	| 'mood'       // 분위기
	| 'action'     // 행동
	| 'dessert'    // 디저트
	| 'season'     // 계절
	| 'event'      // 이벤트
	| 'emotion'    // 감정
	| 'place'      // 장소
	| 'time'       // 시간
	| 'object'     // 사물
	| 'phrase'     // 문장
	| 'style'      // 스타일 프롬프트
	| 'exclude';   // 제외 스타일

/** 워드 항목 */
export interface WordEntry {
	id: string;
	content: string;           // 단어 또는 문구
	category: WordCategory;    // 카테고리
	tags: string[];            // 태그
	usageCount: number;        // 사용 횟수
	linkedTracks: string[];    // 사용된 트랙 ID 목록
	createdAt: string;         // ISO 날짜 문자열
	createdBy: Producer;
}

// ============================================
// 제작 진행률 추적
// ============================================

/** 제작 단계 ID */
export type ProductionStageId =
	| 'idea'              // 아이디어 기획
	| 'lyrics_draft'      // 가사 초안
	| 'lyrics_structure'  // 곡구조 버전
	| 'lyrics_suno'       // 수노발음 버전
	| 'suno_generation'   // SUNO 생성
	| 'suno_selection'    // 곡 선정
	| 'audio_editing'     // 음원 수정 (El)
	| 'lyrics_final'      // 앨범등록 가사
	| 'mastering'         // 마스터링
	| 'album_ready'       // 앨범 등록 준비
	| 'released';         // 발매 완료

/** 제작 단계 정의 */
export interface ProductionStageDefinition {
	id: ProductionStageId;
	name: string;
	order: number;
	assignedTo: Producer | 'Both';
}

/** 프로젝트별 제작 단계 상태 */
export interface ProductionStageStatus {
	stageId: ProductionStageId;
	isCompleted: boolean;
	completedAt?: string;        // ISO 날짜 문자열
	completedBy?: Producer;
	notes?: string;
}

// ============================================
// 가사 버전 관리
// ============================================

/** 가사 버전 유형 */
export type LyricsVersionType =
	| 'draft'          // 초안
	| 'revision'       // 수정안
	| 'structure'      // 곡구조 버전
	| 'suno_phonetic'  // 수노발음 버전
	| 'album_final';   // 앨범실제등록 버전

/** 가사 버전 */
export interface LyricsVersion {
	id: string;
	projectId: string;
	versionType: LyricsVersionType;
	content: string;           // 가사 내용
	versionNumber: number;     // 버전 번호 (1, 2, 3...)
	createdAt: string;         // ISO 날짜 문자열
	createdBy: Producer;
	changeNotes?: string;      // 수정 내용 메모
	parentVersionId?: string;  // 이전 버전 참조
}

// ============================================
// SUNO 프롬프트 관리
// ============================================

/** SUNO 모드 */
export type SUNOMode = 'Simple' | 'Custom';

/** SUNO 버전 */
export type SUNOVersion = 'v3' | 'v3.5' | 'v4' | 'v5';

/** 생성 유형 */
export type GenerationType = 'create' | 'extend' | 'remaster' | 'cover';

/** 보컬 성별 */
export type VocalGender = 'Male' | 'Female' | 'Duet';

/** 가사 모드 */
export type LyricsMode = 'Manual' | 'Auto';

/** 오디오 소스 유형 */
export type AudioSourceType = 'Audio' | 'Persona' | 'Inspo';

/** 오디오 소스 참조 */
export interface AudioSource {
	type: AudioSourceType;
	name: string;
	link?: string;
}

/** SUNO 프롬프트 설정 */
export interface SUNOPromptConfig {
	id: string;
	projectId: string;

	// 기본 설정
	mode: SUNOMode;
	sunoVersion: SUNOVersion;
	generationType: GenerationType;

	// 프롬프트
	styles: string;            // 최대 1000자
	excludeStyles: string;     // 최대 1000자

	// 보컬 설정
	vocalGender: VocalGender;
	lyricsMode: LyricsMode;

	// 고급 옵션
	weirdness: number;         // 0-100
	styleInfluence: number;    // 0-100
	audioInfluence: number;    // 0-100

	// 참조 소스
	audioSource?: AudioSource;

	// 메타
	createdAt: string;
	createdBy: Producer;
}

/** 프롬프트 템플릿 */
export interface PromptTemplate {
	id: string;
	name: string;
	category: 'style' | 'exclude' | 'full';
	content: string;
	usageCount: number;
	createdAt: string;
	createdBy: Producer;
}

// ============================================
// 음원 버전 관리
// ============================================

/** 음원 버전 유형 */
export type AudioVersionType =
	| 'suno_original'    // SUNO 원본
	| 'suno_studio'      // 수노 스튜디오 버전
	| 'editing'          // 수정 중 버전
	| 'final';           // 수정 완성본

/** 댓글 */
export interface Comment {
	id: string;
	content: string;
	author: Producer;
	timestamp: string;
}

/** 투표 */
export interface Vote {
	voter: Producer;
	value: 'up' | 'down';
	timestamp: string;
}

/** 음원 버전 */
export interface AudioVersion {
	id: string;
	projectId: string;
	versionType: AudioVersionType;

	// 파일 정보
	fileName: string;
	fileUrl: string;
	duration: string;          // "MM:SS"

	// SUNO 정보
	sunoWorkspaceUrl?: string;
	sunoPromptConfigId?: string;

	// 선택 상태
	isFinalSelection: boolean;

	// 협업
	comments: Comment[];
	votes: Vote[];

	// 메타
	createdAt: string;
	createdBy: Producer;
}

// ============================================
// 제작자 및 가상 보컬
// ============================================

/** 제작자 */
export type Producer = 'El' | 'Otte';

/** 가상 보컬 */
export interface VirtualVocal {
	id: string;
	name: string;           // 가상 보컬/팀 이름
	description?: string;
	linkedTracks: string[];
	createdAt: string;
}

// ============================================
// SUNO 구독 관리
// ============================================

/** 구독 플랜 */
export type SubscriptionPlan = 'Basic' | 'Pro' | 'Premier';

/** SUNO 구독 정보 */
export interface SUNOSubscription {
	planType: SubscriptionPlan;
	billingDate: number;       // 매월 결제일 (1-31)
	monthlyCredits: number;    // 월 크레딧
	remainingCredits: number;  // 남은 크레딧
	lastUpdated: string;
}

// ============================================
// SUNO 프로젝트 (곡)
// ============================================

/** 프로젝트 상태 */
export type ProjectStatus =
	| 'idea'        // 아이디어 단계
	| 'in_progress' // 제작 중
	| 'completed'   // 완료
	| 'archived';   // 보관

/** SUNO 프로젝트 (곡) */
export interface SUNOProject {
	id: string;
	title: string;
	description?: string;

	// 진행 상태
	status: ProjectStatus;
	stages: ProductionStageStatus[];
	progressPercent: number;     // 0-100

	// 참여자
	virtualVocalId?: string;     // 가상 보컬 ID
	createdBy: Producer;

	// 버전들
	lyricsVersions: LyricsVersion[];
	promptConfigs: SUNOPromptConfig[];
	audioVersions: AudioVersion[];

	// 사용된 워드
	usedWordIds: string[];

	// 연결된 트랙 (완성 후)
	linkedTrackId?: string;

	// 메타
	createdAt: string;
	updatedAt: string;
}

// ============================================
// 랜덤 조합 생성기
// ============================================

/** 랜덤 조합 설정 */
export interface RandomCombinationConfig {
	categories: {
		category: WordCategory;
		count: number;           // 선택할 개수
	}[];
}

/** 랜덤 조합 결과 */
export interface RandomCombinationResult {
	words: WordEntry[];
	combinedText: string;
	generatedAt: string;
}
