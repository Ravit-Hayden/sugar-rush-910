# 좌측 사이드바 완벽판 - 복구 가이드

**빠른 복구를 위한 단계별 가이드**

---

## 🚀 5분 복구 가이드

### 1단계: 파일 복사 (2분)

```powershell
# Windows PowerShell
Copy-Item "C:\Development\left sidebar\Sidebar.svelte" "src\lib\components\"
Copy-Item "C:\Development\left sidebar\+layout.svelte" "src\routes\"
Copy-Item "C:\Development\left sidebar\Header.svelte" "src\lib\components\"
Copy-Item "C:\Development\left sidebar\ui.js" "src\scripts\"
```

### 2단계: CSS 추가 (1분)

1. `src/app.css` 파일 열기
2. 파일 맨 아래에 `sidebar.css` 내용 붙여넣기
3. 저장

### 3단계: 검증 (2분)

1. 브라우저 캐시 삭제: **Ctrl + Shift + R**
2. 개발자 도구: **F12** → **Network 탭** → **Disable cache 체크**
3. 테스트:
   - 사이드바 토글 동작 확인
   - 활성화 메뉴 호버 시 색상 유지 확인

---

## 📋 파일 매핑

| 원본 파일 | 대상 위치 |
|---------|---------|
| `Sidebar.svelte` | `src/lib/components/Sidebar.svelte` |
| `+layout.svelte` | `src/routes/+layout.svelte` |
| `Header.svelte` | `src/lib/components/Header.svelte` |
| `ui.js` | `src/scripts/ui.js` |
| `sidebar.css` | `src/app.css` (맨 아래 추가) |

---

## ⚠️ 주의사항

### CSS 중복 확인

**기존 CSS 확인**:
```powershell
# 사이드바 관련 CSS 검색
Select-String -Path "src\app.css" -Pattern "\.sidebar-menu-item|\.sidebar-text|body\.sidebar"
```

**중복 제거**:
- 기존 사이드바 관련 CSS 섹션 삭제
- `sidebar.css` 내용만 유지

### 인라인 스타일 제거

**확인할 위치**:
- `Sidebar.svelte`: `<aside style="width: ...">` 제거 확인
- `Header.svelte`: `<header style="margin-left: ...">` 제거 확인

---

## 🔍 문제 해결

### 문제: 사이드바가 움직이지 않음

**원인**: Body 클래스 동기화 실패

**해결**:
1. 브라우저 콘솔에서 확인:
   ```javascript
   document.body.classList.contains('sidebar-expanded')
   document.body.classList.contains('sidebar-collapsed')
   ```
2. `updateBodyClass()` 함수 호출 확인
3. 이벤트 리스너 등록 확인

### 문제: 호버 색상이 여전히 변함

**원인**: CSS 순서 문제 또는 캐시

**해결**:
1. 브라우저 캐시 완전 삭제
2. CSS 파일 맨 아래에 핵폭탄 CSS 위치 확인
3. 개발자 도구에서 적용된 CSS 확인

---

## 📞 지원

문제가 발생하면:
1. 브라우저 콘솔 오류 확인
2. 개발자 도구에서 적용된 CSS 확인
3. `README.md`와 `IMPLEMENTATION_DETAILS.md` 참고

---

**이 가이드로 언제든지 완벽하게 복구할 수 있습니다.**
