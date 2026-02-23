# 사이트 내 파일 업로드 한도 분석

사이트 전체에서 **파일 업로드**가 일어나는 위치와 **크기 한도**를 정리한 문서입니다.

**통일 규칙:** 모든 업로드는 **1GB** 한도이며, `$lib/constants/upload.ts`의 `MAX_FILE_SIZE_BYTES`, `getFileSizeErrorMessage()`를 사용합니다.

---

## 1. 한도 적용 위치 (공통 1GB)

| 위치 | 파일 종류 | 한도 | 비고 |
|------|-----------|------|------|
| **SUNO 보컬** (`/suno/vocals`) | 사진·데모 음원 | 1GB | `$lib/constants/upload` 사용 |
| **트랙 추가** (`/tracks/new`) | 음원 | 1GB | 동일 |
| **API: 음원 업로드** (`/api/upload/audio`) | 음원 | 1GB | 동일 |
| **SUNO AudioUpload** | 음원 | 1GB | 동일 |
| **파일 업로드** (`/upload`) | 음원 | 1GB | 동일 |
| **앨범 커버** (`/albums/new`, `/albums/[id]/edit`) | 이미지 | 1GB | 동일 |
| **설정** (프로필 이미지) | 이미지 | 1GB | 동일 |
| **수익 import** (`/revenue/import`) | 엑셀 | 1GB | 동일 (클라이언트 + API parse/parse-music-spray) |
| **TrackSlidePanel** | 음원 | 1GB | 동일 |

- **공통 상수**: `src/lib/constants/upload.ts` — `MAX_FILE_SIZE_BYTES`, `MAX_FILE_SIZE_MB`, `getFileSizeErrorMessage()`.
- 앞으로 새 업로드 기능 추가 시 위 상수를 import해 동일 조건으로 검증하면 됩니다.

---

## 2. 한도가 없는 곳 (타입/accept만 있음)

| 위치 | 파일 종류 | accept | 크기 검증 |
|------|-----------|--------|-----------|
| **파일 업로드** (`/upload`) | 음원 | `audio/*` multiple | **없음** |
| **앨범 커버** (`/albums/new`) | 이미지 | `image/*` | **없음** |
| **앨범 커버 수정** (`/albums/[id]/edit`) | 이미지 | `image/*` | **없음** |
| **설정** (프로필 이미지 등) (`/settings`) | 이미지 | `image/*` | **없음** |
| **수익/정산 import** (`/revenue/import`) | 엑셀 | `.xlsx,.xls` | **없음** (클라이언트·API 모두) |
| **TrackSlidePanel** (트랙 슬라이드 패널) | 음원 | `audio/*` | **없음** |

- **upload/+page.svelte**: `uploadFiles()`에서 `file.type.startsWith('audio/')`만 검사, `file.size` 검사 없음. 목업 업로드.
- **albums/new**, **albums/[id]/edit**: 이미지 선택 시 `file.type.startsWith('image/')`만 확인, 크기 제한 없음.
- **settings**: 이미지 파일/URL 선택, 크기 제한 없음.
- **revenue/import**: `accept=".xlsx,.xls"`, API `parse`·`parse-music-spray`에서 확장자만 검사, 파일 크기 제한 없음.
- **TrackSlidePanel**: `accept="audio/*"`, `handleAudioFileSelect` 등에서 크기 검사 없음.

---

## 3. 요약 표

| 구분 | 사진/이미지 | 음원 | 엑셀 |
|------|-------------|------|------|
| **한도** | 1GB (보컬, 앨범, 설정) | 1GB (보컬, 트랙, API, AudioUpload, 업로드, TrackSlidePanel) | 1GB (수익 import, parse API) |

모두 `$lib/constants/upload`의 **MAX_FILE_SIZE_BYTES(1GB)** 로 통일되어 있습니다.

---

## 4. 권장 사항

1. **AudioUpload.svelte 50MB**  
   - 트랙 추가·API가 100MB인 것과 맞추려면 **100MB로 통일**하는 것이 좋음.
2. **한도 없는 업로드**  
   - 앨범 커버·설정 이미지: 용도에 맞게 **예: 10MB** 등 클라이언트/서버 한도 도입 검토.
   - 파일 업로드 페이지(`/upload`): 실제 API 연동 시 **서버와 동일한 음원 한도(예: 100MB)** 적용 검토.
   - TrackSlidePanel: 트랙 추가와 동일하게 **100MB** 검증 추가 검토.
   - 수익 import 엑셀: 대용량 시 메모리/타임아웃 이슈 방지를 위해 **예: 20MB** 한도 검토.
3. **한도 값 일원화**  
   - 음원 한도를 상수/설정 파일로 두고, 클라이언트(트랙 추가, 보컬, AudioUpload, TrackSlidePanel)와 서버(`/api/upload/audio`)가 **같은 값**을 쓰도록 하면 유지보수에 유리함.

---

## 5. 코드 위치 참고

| 파일 | 라인 근처 | 내용 |
|------|-----------|------|
| `src/routes/suno/vocals/+page.svelte` | 6–7, 80–83, 101, 117 | IMAGE/AUDIO 100MB, `readFileAsDataUrl` 검증 |
| `src/routes/tracks/new/+page.svelte` | 169–174, 777 | maxSize 100MB, UI "최대 100MB" |
| `src/routes/api/upload/audio/+server.ts` | 66–81 | maxSize 100MB, `FILE_TOO_LARGE` |
| `src/lib/components/suno/AudioUpload.svelte` | 68–71 | 50MB 제한, 에러 메시지 |
| `src/routes/upload/+page.svelte` | 432–477, 626 | `uploadFiles`, type만 검사, 크기 없음 |
| `src/routes/albums/new/+page.svelte` | 637–638, 812–813 | 이미지, 크기 없음 |
| `src/routes/albums/[id]/edit/+page.svelte` | 218–219, 406–407 | 이미지, 크기 없음 |
| `src/routes/settings/+page.svelte` | 90–91, 980–981 | 이미지, 크기 없음 |
| `src/routes/revenue/import/+page.svelte` | 269–270 | .xlsx/.xls, 크기 없음 |
| `src/routes/api/statements/parse/+server.ts` | 44–58 | 확장자만 검사, 크기 없음 |
| `src/lib/components/TrackSlidePanel.svelte` | 519–520 | audio/*, 크기 없음 |

이 문서는 파일 업로드 한도 정책을 맞출 때 기준으로 사용할 수 있습니다.
