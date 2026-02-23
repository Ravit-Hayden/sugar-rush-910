# SUNO 새 프로젝트 페이지 보완점

`/suno/projects/new` 페이지 검토 결과 정리.

---

## 1. 접근성 (A11y)

| 항목 | 현재 | 보완 제안 |
|------|------|-----------|
| 아코디언 버튼 | `aria-expanded` / `aria-controls` 없음 | 각 버튼에 `aria-expanded={openSections.has('basic')}` 등 추가. 펼침 영역에 `id` 부여 후 `aria-controls="section-basic"` 연결 |
| 드롭다운 | `role="option"`, `aria-selected` 있음. 트리거에 `aria-haspopup="listbox"` 없음 | 트리거 버튼에 `aria-haspopup="listbox"` 및 `aria-expanded={createdByOpen}` 등 추가. 리스트에 `role="listbox"` 명시 |
| 포커스 순서 | 폼 필드 순서는 논리적 | 아코디언이 접혀 있을 때 내부 필드로 포커스 가지 않도록 스크린 리더에서만 내용 숨김 시 `aria-hidden` 고려 (선택) |

---

## 2. 유효성·검증

| 항목 | 현재 | 보완 제안 |
|------|------|-----------|
| 제목 | `isValid = title.trim().length > 0`, submit 버튼 비활성화 | 유지. 필요 시 "제목을 입력하세요" 인라인 메시지 추가 |
| Styles / Exclude Styles | `{length}/{MAX_PROMPT_LENGTH}` 표시만 있음. 1000자 초과 입력 가능 | `maxlength={MAX_PROMPT_LENGTH}` 또는 submit 시 검증 후 에러 메시지 표시 |
| 커버 이미지 | 1GB 제한, 이미지 타입만 허용. 에러 시 `errorMessage`에만 표시 | 파일 선택 직후 토스트/인라인 메시지로 "1GB 이하 이미지 파일만 가능합니다" 등 안내 |

---

## 3. UX·동작

| 항목 | 현재 | 보완 제안 |
|------|------|-----------|
| 폼 이탈 | 취소/목록 링크 클릭 시 확인 없음 | 입력 여부 감지 후 "저장하지 않고 나가시겠습니까?" 확인 다이얼로그 (beforeunload 또는 SvelteKit 네비게이션 가드) |
| 제출 후 | `handleSubmit`에서 500ms 지연 후 `/suno/projects`로 이동. 실제 API 없음 | 실제 생성 API 연동 후 성공 시 목록으로 이동, 실패 시 `errorMessage`에 서버 메시지 표시 |
| 아코디언 초기 상태 | `openSections`: basic, generation, prompt만 열림 | 사용자 선호에 따라 "처음엔 기본 정보만 열기" 등 옵션 고려 (선택) |
| 오디오 소스 placeholder | `placeholder="{audioSourceType} 이름 또는 링크"` | `audioSourceType`이 있을 때만 표시되므로 괜찮음. "이름 또는 링크 입력" 등으로 문구 단순화 가능 |

---

## 4. 모드별 UI (Simple vs Custom)

| 항목 | 현재 | 보완 제안 |
|------|------|-----------|
| Custom | 가사 textarea 노출 | 유지 |
| Simple | 프롬프트 섹션에 가사 필드 없음. Styles/Exclude만 있음 | Simple 모드 설명 툴팁/헬프 텍스트 추가 시 일관성 향상 |

---

## 5. 반응형·레이아웃

| 항목 | 현재 | 보완 제안 |
|------|------|-----------|
| 그리드 | `xl` 이상에서만 2+1 컬럼, 이하에서는 1열 | 미리보기·제작 단계가 아래로 내려갈 때 `sticky top-20` 의미 감소. 모바일에서 미리보기 접기 옵션 또는 상단 고정 해제 검토 |
| 버튼 영역 | `flex justify-end gap-3` | 모바일에서 "취소" / "프로젝트 생성" 세로 배치 또는 풀폭 고려 (현재도 사용 가능) |

---

## 6. 일관성·스타일

| 항목 | 현재 | 보완 제안 |
|------|------|-----------|
| 에러 표시 | 상단 단일 `errorMessage` 블록 | 필드별 인라인 에러(제목 필수, Styles 길이 초과 등)가 필요해지면 동일 스타일로 통일 |
| 미리보기·제작 단계 | 아코디언이 아님. `text-brand-pink` 적용됨 | 접는 영역이 아니므로 `accordion-section-header` 미적용 유지 (현재 올바름) |

---

## 7. 기타

| 항목 | 현재 | 보완 제안 |
|------|------|-----------|
| 커버 이미지 형식 | `accept="image/png,image/jpeg,image/webp,image/gif"` | GIF 허용 여부가 서비스 정책과 맞는지 확인 |
| 제작 단계 | 18단계 목록 읽기 전용. 생성 시 "첫 3단계 자동 포함" 주석만 있음 | 실제 저장 시 단계 데이터 연동 여부 확인 및 필요 시 API 스펙 반영 |
| 템플릿 파라미터 | `template`, `styles`, `exclude`, `vocal` URL에서 초기값 사용 | 정상 동작. 잘못된 `template` 이름에 대한 fallback 또는 안내 메시지 여부만 정책에서 결정 |

---

## 우선 적용 권장 순서

1. **Styles/Exclude** — `maxlength` 또는 submit 시 길이 검증 (데이터 무결성)
2. **아코디언** — `aria-expanded` / `aria-controls` (접근성)
3. **handleSubmit** — 실제 API 연동 및 에러 처리
4. **폼 이탈** — 입력 후 취소/이동 시 확인 (선택)
5. **드롭다운** — `aria-haspopup` / `aria-expanded` (접근성)

이 문서는 `src/routes/suno/projects/new/+page.svelte` 기준으로 작성되었습니다.
