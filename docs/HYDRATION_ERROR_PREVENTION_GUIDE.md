# 🛡️ Hydration 오류 재발 방지 가이드

## 📋 개요

이 문서는 Svelte 5 + SvelteKit 환경에서 발생했던 Hydration 오류(`next_sibling_getter`, `reading 'call'`)의 원인과 해결 방법을 정리하고, 동일한 문제가 재발하지 않도록 하는 가이드를 제공합니다.

**테스트 환경**:
- Svelte: 5.39.6
- SvelteKit: 2.43.4
- Vite: 7.1.7

---

## 🚨 트러블슈팅: 에러 메시지로 문제 찾기

다음 에러 메시지를 만났다면 이 가이드를 확인하세요:

### Firefox 오류
```
TypeError: next_sibling_getter is undefined
Failed to hydrate: TypeError: next_sibling_getter is undefined
in <unknown> in <unknown> in +layout.svelte in root.svelte
at get_next_sibling
```

**원인**: `src/app.html`에서 `display: contents` 사용  
**해결**: `display: contents` 제거하고 일반 `<div>` 사용

### Chrome 오류
```
TypeError: Cannot read properties of undefined (reading 'call')
Failed to hydrate: TypeError: Cannot read properties of undefined (reading 'call')
in <unknown> in <unknown> in +layout.svelte in root.svelte
at get_next_sibling
```

**원인**: `$effect`에서 cleanup 함수 미반환 또는 `async` 함수 직접 사용  
**해결**: 모든 `$effect`에서 cleanup 함수 반환 확인

### 일반적인 Hydration 오류
```
Failed to hydrate
Hydration failed because the initial UI does not match what was rendered on the server
```

**원인**: SSR과 클라이언트 렌더링 결과 불일치  
**해결**: 이 가이드의 모든 항목 확인

---

## 🚨 금지 사항 (절대 하지 말 것)

### 1. `src/app.html`에서 `display: contents` 사용 금지

#### ❌ 잘못된 코드
```html
<body>
  <div style="display: contents">%sveltekit.body%</div>
</body>
```

#### ✅ 올바른 코드
```html
<body>
  <div>%sveltekit.body%</div>
</body>
```

#### 이유
- Firefox가 `display: contents`를 렌더 트리에서 투명하게 처리
- SvelteKit의 Hydration 과정에서 DOM 노드 순서 추적 실패
- `next_sibling_getter` 오류 발생

#### 체크 방법
```bash
# 프로젝트 루트에서 실행
grep -r "display:\s*contents" src/app.html
# 결과가 나오면 안 됨
```

#### 대안 방법
`display: contents`를 사용하려던 이유가 레이아웃 구성이라면 다음 대안을 사용하세요:

1. **불필요한 래퍼 제거**: `display: contents`를 사용하려던 이유가 불필요한 래퍼를 제거하기 위한 것이라면, 아예 래퍼를 제거하세요.
   ```html
   <!-- ❌ 불필요한 래퍼 -->
   <div style="display: contents">
     <div>내용</div>
   </div>
   
   <!-- ✅ 래퍼 제거 -->
   <div>내용</div>
   ```

2. **CSS Grid/Flexbox 재설계**: 레이아웃 구조를 재설계하여 `display: contents` 없이도 원하는 레이아웃을 구현하세요.
   ```css
   /* display: contents 대신 */
   .container {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
   }
   ```

3. **CSS 변수 활용**: 스타일을 상위 요소에서 관리하고 CSS 변수로 전달하세요.
   ```html
   <div style="--custom-color: red;">
     <div style="color: var(--custom-color);">내용</div>
   </div>
   ```

---

### 2. `$effect`에 `async` 함수 직접 사용 금지

#### ❌ 잘못된 코드 (앱이 죽음)
```typescript
$effect(async () => {
  const data = await fetchData();
  // ...
});
```

#### ✅ 올바른 코드
```typescript
$effect(() => {
  const run = async () => {
    const data = await fetchData();
    // ...
  };
  run();
  return () => {}; // cleanup 함수 필수
});
```

#### 이유
- `async` 함수는 항상 `Promise` 객체를 반환
- Svelte 5의 `$effect`는 cleanup 함수를 기대
- `Promise`를 함수처럼 호출하려다 `reading 'call'` 오류 발생

---

### 3. `$effect`에서 cleanup 함수 미반환 금지

#### ❌ 잘못된 코드
```typescript
$effect(() => {
  document.addEventListener('click', handleClick);
  // cleanup 함수 없음 → 오류 발생
});
```

#### ✅ 올바른 코드
```typescript
$effect(() => {
  document.addEventListener('click', handleClick);
  return () => {
    document.removeEventListener('click', handleClick);
  };
});
```

---

### 4. Early return 시 cleanup 함수 반환 필수

#### ❌ 잘못된 코드
```typescript
$effect(() => {
  if (!browser) return; // cleanup 함수 없음 → 오류 발생
  
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});
```

#### ✅ 올바른 코드
```typescript
$effect(() => {
  if (!browser) return () => {}; // 빈 cleanup 함수 반환
  
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});
```

---

### 5. `forEach` 내부에서 `return` 사용 금지

#### ❌ 잘못된 코드
```typescript
$effect(() => {
  items.forEach(item => {
    return useClickOutside(`.item-${item.id}`, () => {
      // ...
    });
  });
  // forEach 내부의 return은 $effect의 cleanup을 반환하지 않음
});
```

#### ✅ 올바른 코드
```typescript
$effect(() => {
  const cleanups: Array<() => void> = [];
  items.forEach(item => {
    const cleanup = useClickOutside(`.item-${item.id}`, () => {
      // ...
    });
    if (cleanup) {
      cleanups.push(cleanup);
    }
  });
  return () => {
    cleanups.forEach(cleanup => cleanup());
  };
});
```

---

## 🔄 `$effect` vs `onMount` 선택 가이드

Svelte 5에서는 `$effect`와 `onMount`를 상황에 맞게 선택해야 합니다.

### `onMount`를 사용해야 하는 경우

**특징**: Hydration 완료 후 **한 번만** 실행되어야 하는 로직

#### 사용 예시
```typescript
import { onMount } from 'svelte';

// ✅ DOM 요소에 직접 접근
onMount(() => {
  const element = document.getElementById('my-element');
  if (element) {
    // DOM 조작
  }
});

// ✅ 외부 라이브러리 초기화 (한 번만 실행)
onMount(() => {
  const chart = new Chart(canvas, config);
  return () => {
    chart.destroy(); // cleanup
  };
});

// ✅ 브라우저 전용 API 사용
onMount(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }
});

// ✅ localStorage에서 데이터 로드 (초기화 시 한 번만)
onMount(() => {
  const saved = localStorage.getItem('key');
  if (saved) {
    // 상태 복원
  }
});
```

**언제 사용**:
- DOM 요소의 크기 측정
- 외부 라이브러리 연동 (Chart.js, D3.js, Map API 등)
- Hydration 완료 후 한 번만 실행되어야 하는 초기화 로직
- 브라우저 전용 API 사용 (예: `window`, `document`, `navigator`)

### `$effect`를 사용해야 하는 경우

**특징**: 반응형 상태 변화에 따라 **자동으로 재실행**되어야 하는 로직

#### 사용 예시
```typescript
// ✅ 반응형 상태 변화 감지
$effect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => {
    document.body.style.overflow = '';
  };
});

// ✅ 의존성 추적이 필요한 경우
$effect(() => {
  searchQuery; // 감시
  selectedGenre; // 감시
  // 필터 변경 시 자동 실행
  currentPage = 1;
  return () => {};
});

// ✅ cleanup이 필요한 작업
$effect(() => {
  const handleClick = () => { /* ... */ };
  document.addEventListener('click', handleClick);
  return () => {
    document.removeEventListener('click', handleClick);
  };
});
```

**언제 사용**:
- 반응형 상태 변화에 따라 실행되어야 할 때
- cleanup이 필요한 작업 (이벤트 리스너, 타이머 등)
- 의존성 추적이 필요한 경우
- 상태 변화에 따라 UI를 업데이트해야 할 때

### 선택 가이드 요약

| 상황 | 사용할 API | 이유 |
|------|-----------|------|
| DOM 요소 접근 | `onMount` | Hydration 완료 후 한 번만 실행 |
| 외부 라이브러리 초기화 | `onMount` | 한 번만 초기화 필요 |
| 반응형 상태 감지 | `$effect` | 상태 변화 시 자동 재실행 |
| 이벤트 리스너 (상태 의존) | `$effect` | 상태에 따라 동적으로 등록/해제 |
| 이벤트 리스너 (고정) | `onMount` | 한 번만 등록 |
| localStorage 로드 | `onMount` | 초기화 시 한 번만 |
| 상태 변화에 따른 부수 효과 | `$effect` | 반응형으로 실행 |

---

## ✅ 안전한 패턴

### 1. 비동기 작업 처리
```typescript
$effect(() => {
  let cancelled = false;
  
  (async () => {
    const data = await fetchData();
    if (!cancelled) {
      // 상태 업데이트
    }
  })();
  
  return () => {
    cancelled = true;
  };
});
```

### 2. 이벤트 리스너 등록
```typescript
$effect(() => {
  const handleClick = (e: MouseEvent) => {
    // 처리 로직
  };
  
  document.addEventListener('click', handleClick);
  
  return () => {
    document.removeEventListener('click', handleClick);
  };
});
```

### 3. 조건부 실행
```typescript
$effect(() => {
  if (!isOpen) return () => {}; // 빈 cleanup 반환
  
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      isOpen = false;
    }
  };
  
  document.addEventListener('keydown', handleEscape);
  
  return () => {
    document.removeEventListener('keydown', handleEscape);
  };
});
```

### 4. 여러 cleanup 함수 관리
```typescript
$effect(() => {
  const cleanups: Array<() => void> = [];
  
  // 여러 리스너 등록
  const cleanup1 = useClickOutside('.dropdown', () => {});
  const cleanup2 = useEscapeKey(() => {});
  
  if (cleanup1) cleanups.push(cleanup1);
  if (cleanup2) cleanups.push(cleanup2);
  
  return () => {
    cleanups.forEach(cleanup => cleanup());
  };
});
```

---

## 🔍 코드 리뷰 체크리스트

새로운 `$effect`를 작성하거나 코드 리뷰 시 다음을 확인하세요:

- [ ] `src/app.html`에 `display: contents`가 없는가?
- [ ] `$effect`에 `async`를 직접 사용하지 않았는가?
- [ ] 모든 `$effect`가 cleanup 함수를 반환하는가?
- [ ] Early return 시 `return () => {};`를 반환하는가?
- [ ] `forEach` 내부에서 cleanup을 수집하고 있는가?
- [ ] 이벤트 리스너를 등록했다면 제거하는 cleanup이 있는가?
- [ ] `setTimeout`/`setInterval`을 사용했다면 `clearTimeout`/`clearInterval`이 있는가?

---

## 🛠️ 자동 검사 스크립트

### 1. `display: contents` 검사
```bash
# Windows PowerShell
Select-String -Path "src/app.html" -Pattern "display:\s*contents"

# 결과가 나오면 오류
```

### 2. `$effect` async 사용 검사
```bash
# Windows PowerShell
Select-String -Path "src" -Pattern "\$effect\s*\(async" -Recurse

# 결과가 나오면 오류
```

### 3. Cleanup 함수 누락 검사
```bash
# Windows PowerShell
# 이 스크립트는 수동으로 각 $effect를 확인해야 함
# grep으로 찾은 후 수동 검토 필요
Select-String -Path "src" -Pattern "\$effect\s*\(" -Recurse
```

---

## 📚 참고 자료

### Svelte 5 공식 문서
- [Svelte 5 Runes: $effect](https://svelte.dev/docs/svelte/$effect)
- [SvelteKit: app.html](https://kit.svelte.dev/docs/configuration#files)

### 관련 이슈
- Hydration 오류: `next_sibling_getter` (Firefox)
- Hydration 오류: `reading 'call'` (Chrome)
- 해결 커밋: `bf2dc3e Fix: Hydration 오류 해결`

---

## 🎯 핵심 원칙

1. **`src/app.html`은 최소한으로 유지**: `<body>` 바로 아래에는 스타일 없는 순수한 `<div>`만 사용
2. **모든 `$effect`는 cleanup 함수를 반환**: 빈 함수라도 `return () => {};` 필수
3. **비동기 작업은 내부 함수로 격리**: `$effect` 자체는 동기적으로 실행
4. **Early return 시에도 cleanup 반환**: 모든 코드 경로에서 cleanup 함수 보장

---

## ⚠️ 주의사항

- 이 가이드는 Svelte 5 + SvelteKit 환경을 기준으로 작성되었습니다
- 다른 프레임워크나 버전에서는 동작이 다를 수 있습니다
- 새로운 패턴을 사용하기 전에 공식 문서를 확인하세요

---

---

## 📝 변경 이력

- **v1.1.0** (2026-01-08): `onMount` vs `$effect` 가이드 추가, `display: contents` 대안 제시, 에러 메시지 트러블슈팅 섹션 추가
- **v1.0.0** (2026-01-08): 초기 버전 작성

---

**마지막 업데이트**: 2026-01-08  
**작성자**: AI Assistant  
**버전**: 1.1.0  
**테스트 환경**: Svelte 5.39.6, SvelteKit 2.43.4, Vite 7.1.7
