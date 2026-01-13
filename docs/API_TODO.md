# API 수정 작업 목록

> **마지막 수정**: 2026-01-12
> **참고**: 이 문서는 API 작업 시 확인해야 할 사항들을 기록합니다.

---

## 1. 검색 API (`/api/search`)

### 현재 상태
- **파일**: `src/routes/api/search/+server.ts`
- **상태**: 목(Mock) 데이터 사용 중
- **임시 수정**: `recommendReason` 필드 추가됨

### 확인 필요 사항

#### 응답 구조
```typescript
{
  ok: boolean;
  data: {
    exact: Array<{
      id: string;
      title: string;
      type: string;
      href: string;
    }>;
    similar: Array<{
      id: string;
      title: string;
      type: string;
      href: string;
      recommendReason?: string;  // ⚠️ 임시 추가됨
    }>;
  }
}
```

#### 추천 이유 로직 (현재 목 데이터)
- 정확한 결과가 있을 때: `"검색결과"과(와) 같은 {타입} 항목`
- 정확한 결과가 없을 때: `자주 조회되는 항목`

#### 실제 DB 연동 시 결정 필요
1. `recommendReason` 필드를 DB에서 생성할지, 프론트엔드에서 처리할지
2. 추천 알고리즘 설계 (같은 타입, 최근 조회, 인기 항목 등)
3. 검색 쿼리 최적화 (LIKE vs Full-text search)

### 관련 프론트엔드 파일
- `src/lib/components/Header.svelte` - 검색 입력 및 API 호출
- `src/lib/components/SearchResultsMain.svelte` - 검색 결과 표시, `recommendReason` 사용

---

## 2. 기타 API 확인 사항

*(추후 추가)*

---

## 체크리스트

- [ ] `/api/search` - 실제 DB 연동
- [ ] `/api/search` - `recommendReason` 필드 처리 방식 결정
- [ ] `/api/search` - 검색 성능 최적화
- [ ] 프론트엔드와 API 응답 구조 일치 확인

---

## 참고 파일

| 파일 | 설명 |
|------|------|
| `src/routes/api/search/+server.ts` | 검색 API 엔드포인트 |
| `src/lib/components/Header.svelte` | 검색 입력 UI |
| `src/lib/components/SearchResultsMain.svelte` | 검색 결과 UI |
