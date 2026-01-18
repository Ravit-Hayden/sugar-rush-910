# SUNO AI 음악 제작 관리 시스템 설계

> **작성일**: 2026-01-13  
> **버전**: 1.0  
> **상태**: 확정

---

## 1. 시스템 개요

SUNO AI로 음악을 제작하고 Music Spray를 통해 발매하는 전체 워크플로우를 관리하는 시스템

### 핵심 컨셉
- **SUNO 제작** → 완성 시 **트랙으로 변환** → **앨범 등록**
- Sugar Rush 팀 (El, Otte) 협업 지원
- 가상 보컬/보컬팀 관리

### 시스템 구조

```
[워드 라이브러리] → [프롬프트 생성] → [SUNO 생성]
        ↓                                    ↓
[가사 버전 관리] ───────────────────→ [음원 버전 관리]
                                            ↓
[진행률 추적] ← [협업/투표] ← [최종 트랙]
                                            ↓
                                    [앨범 등록] → [발매]
```

---

## 2. 핵심 모듈

### 2.1 워드/문구 라이브러리 (Word Library)

**목적**: 좋은 문구, 단어, 아이디어를 수집하고 랜덤 조합으로 창작 영감 제공

**카테고리**:
| ID | 이름 | 설명 |
|-----|------|------|
| topic | 주제 | 곡의 주제/테마 |
| mood | 분위기 | 곡의 분위기/무드 |
| action | 행동 | 동작, 움직임 |
| dessert | 디저트 | 디저트/음식 관련 |
| season | 계절 | 봄/여름/가을/겨울 |
| event | 이벤트 | 기념일, 행사 |
| emotion | 감정 | 감정 표현 |
| place | 장소 | 배경/장소 |
| time | 시간 | 시간대/시기 |
| object | 사물 | 물건/사물 |
| phrase | 문장 | 가사 문구 |
| style | 스타일 | SUNO 스타일 프롬프트 |
| exclude | 제외 | SUNO 제외 스타일 |

**기능**:
- 엑셀처럼 표 형태로 보기/편집
- 카테고리별 필터링 및 검색
- 랜덤 조합 생성기 (카테고리별 N개 선택)
- 사용 횟수 통계
- 사용된 트랙 연결 링크

---

### 2.2 제작 진행률 추적 (Production Progress)

**제작 단계** (11단계):

| 순서 | ID | 이름 | 담당 |
|------|-----|------|------|
| 1 | idea | 아이디어 기획 | 공통 |
| 2 | lyrics_draft | 가사 초안 | Otte |
| 3 | lyrics_structure | 곡구조 버전 | Otte |
| 4 | lyrics_suno | 수노발음 버전 | Otte |
| 5 | suno_generation | SUNO 생성 | 공통 |
| 6 | suno_selection | 곡 선정 | 공통 |
| 7 | audio_editing | 음원 수정 | El |
| 8 | lyrics_final | 앨범등록 가사 | Otte |
| 9 | mastering | 마스터링 | El |
| 10 | album_ready | 앨범 등록 준비 | 공통 |
| 11 | released | 발매 완료 | - |

---

### 2.3 가사 버전 관리 (Lyrics Version Control)

**버전 유형**:
| ID | 이름 | 설명 |
|-----|------|------|
| draft | 초안 | 최초 작성 가사 |
| revision | 수정안 | 일반 수정 버전 |
| structure | 곡구조 버전 | 구조 표시된 가사 |
| suno_phonetic | 수노발음 버전 | SUNO 최적화 발음 |
| album_final | 앨범등록 버전 | 최종 등록용 가사 |

**기능**:
- 버전 히스토리 타임라인
- 버전 간 비교 (diff)
- 이전 버전에서 분기 생성
- 맞춤법 검사 통합

---

### 2.4 SUNO 프롬프트 관리

**생성 유형**:
| ID | 이름 |
|-----|------|
| create | 새로 생성 |
| extend | 확장 |
| remaster | 리마스터 |
| cover | 커버 |

**설정 항목**:
- Mode: Simple / Custom
- SUNO Version: v3 / v3.5 / v4 / v5
- Styles: 최대 1000자
- Exclude Styles: 최대 1000자
- Vocal Gender: Male / Female / Duet
- Lyrics Mode: Manual / Auto
- Weirdness: 0-100%
- Style Influence: 0-100%
- Audio Influence: 0-100% (Audio/Persona/Inspo 사용 시)
- 참조 소스: Audio / Persona / Inspo (이름 + 링크)

---

### 2.5 음원 버전 관리

**버전 유형**:
| ID | 이름 | 설명 |
|-----|------|------|
| suno_original | SUNO 원본 | SUNO에서 생성된 원본 |
| suno_studio | 스튜디오 버전 | SUNO Studio 편집 버전 |
| editing | 수정 중 | El이 수정 중인 버전 |
| final | 최종본 | 수정 완성본 |

**기능**:
- 여러 버전 등록
- 최종 선택곡/파일 지정
- 댓글/투표 (협업)
- SUNO Workspace URL 연결

---

### 2.6 제작자 및 가상 보컬

**제작자 역할**:
| 제작자 | 역할 |
|--------|------|
| El | 음원 수정, 마스터링 |
| Otte | 가사, 아이디어 |
| 공통 | SUNO 생성, 곡 선정 |

**가상 보컬**:
- 곡마다 가상 보컬/보컬팀 이름 지정 가능
- 보컬별 트랙 목록 관리

---

### 2.7 SUNO 구독 관리

- 플랜 유형: Basic / Pro / Premier
- 결제일 기록
- 월 크레딧 / 남은 크레딧 추적

---

## 3. 페이지 구조

### 사이드바 메뉴
```
SUNO 제작
├── 제작 현황 (/suno)
├── 진행 중인 곡 (/suno/projects)
├── 워드 라이브러리 (/suno/words)
├── 프롬프트 라이브러리 (/suno/prompts)
├── 가상 보컬 관리 (/suno/vocals)
└── 구독 관리 (/suno/subscription)
```

### 주요 페이지

1. **제작 현황 대시보드** (`/suno`)
   - 전체 곡 진행률 현황
   - 최근 활동
   - 크레딧 현황

2. **진행 중인 곡 목록** (`/suno/projects`)
   - 프로젝트 카드 목록
   - 필터/정렬
   - 진행 단계별 그룹화

3. **곡 상세/편집** (`/suno/projects/[id]`)
   - 탭 구조: 가사 | 프롬프트 | 음원 | 진행률 | 기록

4. **워드 라이브러리** (`/suno/words`)
   - 테이블 뷰 (엑셀처럼)
   - 랜덤 조합 생성기

5. **프롬프트 라이브러리** (`/suno/prompts`)
   - 자주 사용하는 프롬프트 관리

---

## 4. 파일 구조

```
src/
├── routes/suno/
│   ├── +page.svelte              # 대시보드
│   ├── +layout.svelte            # SUNO 레이아웃
│   ├── projects/+page.svelte     # 프로젝트 목록
│   ├── words/+page.svelte        # 워드 라이브러리
│   ├── prompts/+page.svelte      # 프롬프트 라이브러리
│   ├── vocals/+page.svelte       # 가상 보컬 관리
│   └── subscription/+page.svelte # 구독 관리
│
├── lib/
│   ├── components/suno/
│   │   ├── ProductionProgress.svelte
│   │   ├── WordLibraryTable.svelte
│   │   ├── RandomCombinator.svelte
│   │   └── ...
│   │
│   ├── constants/suno/
│   │   ├── stages.ts
│   │   ├── categories.ts
│   │   └── prompts.ts
│   │
│   └── types/suno.ts
```

---

## 5. 구현 우선순위

| 순서 | 모듈 | 예상 작업량 |
|------|------|------------|
| 1 | 워드 라이브러리 + 랜덤 조합 | 중 |
| 2 | 제작 진행률 추적 | 중 |
| 3 | 가사 버전 관리 | 대 |
| 4 | SUNO 프롬프트 관리 | 대 |
| 5 | 음원 버전 관리 + 협업 | 대 |
| 6 | 가상 보컬/구독 관리 | 소 |

---

## 6. 추가 추천 기능

1. **AI 가사 제안**: 워드 라이브러리 기반 자동 조합 제안
2. **템플릿 프로젝트**: 자주 사용하는 설정으로 빠른 시작
3. **타임라인 뷰**: 곡별 전체 제작 과정 시각화
4. **통계 대시보드**: 월별 제작량, 장르 분포, 크레딧 사용량
5. **내보내기**: 가사/설정 Excel/PDF 내보내기
6. **단축키**: 빠른 작업을 위한 키보드 단축키
7. **알림**: 결제일 알림, 크레딧 부족 알림

---

**문서 끝**
