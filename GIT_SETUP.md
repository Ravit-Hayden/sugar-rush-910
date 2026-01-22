# Git 설정 및 푸시 가이드

**영문 경로 사용 - 한글 경로 문제 없음**

---

## 🔧 Git 초기화

### 방법 1: PowerShell (권장)

```powershell
# 1. 폴더로 이동
cd "C:\Development\left sidebar"

# 2. Git 초기화
git init

# 3. 파일 추가
git add -A

# 4. 커밋
git commit -m "feat: 좌측 사이드바 완벽판 v3 최종 - 포커스 위 호버 겹침 방지 완료"
```

### 방법 2: Git Bash

```bash
# Git Bash에서 실행
cd "/c/Development/left sidebar"
git init
git add -A
git commit -m "feat: 좌측 사이드바 완벽판 v3 최종"
```

---

## 📤 원격 저장소 푸시

### 1. 원격 저장소 추가

```bash
# GitHub 예시
git remote add origin https://github.com/username/sidebar-perfect.git

# 또는 GitLab
git remote add origin https://gitlab.com/username/sidebar-perfect.git
```

### 2. 브랜치 설정 및 푸시

```bash
# 메인 브랜치로 설정
git branch -M main

# 푸시
git push -u origin main
```

### 3. 인증 (필요 시)

```bash
# Personal Access Token 사용
git push -u origin main
# Username: your-username
# Password: your-personal-access-token
```

---

## 📋 커밋 메시지 예시

```bash
git commit -m "feat: 좌측 사이드바 완벽판 v3 최종

- Body 클래스 기반 동기화 시스템
- 포커스 위 호버 겹침 완전 방지
- 활성화 상태 호버 차단 (핵폭탄 CSS)
- 모든 상태 조합 명시적 정의
- CSS 우선순위 체계 완벽 정리
- 아이콘 색상 강제 적용
- 반응형 768px 기준 유지
- localStorage 동기화
- ui.js 통합"
```

---

## ✅ 검증

```bash
# 커밋 확인
git log --oneline

# 파일 상태 확인
git status

# 원격 저장소 확인
git remote -v
```

---

**이 가이드로 Git 저장소를 설정하고 푸시할 수 있습니다.**
