# 대시보드 카드 연결용 목업 페이지

대시보드 카드의 "더보기"·액션 버튼에서 연결되는 페이지들을 목업으로 생성한 기록입니다.  
실제 API·데이터 연결 시 해당 경로에 그대로 연동하면 바로 사용 가능합니다.

---

## 생성 일자

- **생성**: 2026-01-28
- **목적**: 대시보드 1차 완성 후, 카드별 연결 페이지 부재로 인한 404 방지 및 연동 준비

---

## 생성된 경로 목록

| 카드 | 경로 | 용도 |
|------|------|------|
| KpiCard | `/kpi` | KPI 요약 (이번주 수익·발매·예상 수익) |
| TasksCard | `/tasks` | 태스크 목록 |
| TasksCard | `/tasks/new` | 새 태스크 작성 |
| TasksCard | `/tasks/[id]` | 태스크 상세 |
| TasksCard | `/tasks/[id]/edit` | 태스크 편집 |
| TasksCard | `/mentions` | 멘션 목록 |
| CountdownCard | `/calendar` | 일정 목록 (기존) |
| CountdownCard | `/calendar/new` | 일정 추가 (기존) |
| CountdownCard | `/calendar/[id]` | 일정 상세(보기) |
| FailuresCard | `/failures` | 장애·오류 목록 |
| FailuresCard | `/failures/[id]` | 장애 상세 |
| FailuresCard | `/runbook` | 안내 가이드(Runbook) |
| StatusCard | `/status` | 시스템 상태 목록 |
| StatusCard | `/status/[key]` | 상태 상세 |
| ChangesCard | `/changes` | 변경 이력 목록 |
| ChangesCard | `/changes/[id]` | 변경 상세 |
| FeedbackCard | `/feedback` | 피드백 목록 (기존) |
| FeedbackCard | `/feedback/[id]` | 피드백 상세 |
| ReleasesCard | `/releases` | 발매 목록 (기존) |
| ReleasesCard | `/releases/[id]` | 발매 상세 |
| ActionsCard | `/actions` | 액션(수익/지출/일정 등 바로가기) |
| LogsCard | `/logs` | 시스템 로그 목록 |
| LogsCard | `/logs/[id]` | 로그 상세 |
| FinancialStatsCard | `/revenue` | 수익 관리 (기존) |
| KpiCard | `/kpi` | KPI 상세 |

---

## 구현 방식

- **공통**: `PageHeader` + `PageContent`, 기존 디자인 시스템 유지
- **데이터**: 각 페이지 내 `$state` 목업 데이터 사용
- **연동 시**: `fetch('/api/...')` 또는 `+page.server.ts` load로 교체

---

## 연동 시 작업

1. 목록 페이지: `GET /api/{resource}` 응답을 `$state`에 반영
2. 상세 페이지: `GET /api/{resource}/:id` 응답 표시
3. 생성/편집: 폼 제출 시 `POST`/`PUT` 후 `goto`로 목록 또는 상세로 이동

이 문서는 목업 페이지 생성 범위와 연동 가이드용으로 유지합니다.
