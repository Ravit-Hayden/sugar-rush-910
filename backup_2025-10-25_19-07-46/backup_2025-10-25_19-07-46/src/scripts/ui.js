// src/scripts/ui.js
(function () {
  const THEME_KEY = 'sr_theme';
  const SIDEBAR_KEY = 'sr_sidebar'; // 'collapsed' | 'expanded'
  const DEVTOOLS_KEY = 'sr_devtools'; // 개발자도구 상태 추적

  // 1) 테마 토글
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // 2) 개발자도구 감지 및 레이아웃 보호
  function detectDevTools() {
    let devtools = { open: false, orientation: null };
    
    // 방법 1: 윈도우 크기 변화 감지
    const threshold = 160;
    const widthThreshold = window.innerWidth;
    const heightThreshold = window.innerHeight;
    
    // 방법 2: 콘솔 오버라이드 감지
    let devtoolsOpen = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function() {
        devtoolsOpen = true;
        return 'devtools-detector';
      }
    });
    
    // 방법 3: 개발자도구 열림 감지
    const checkDevTools = () => {
      const before = window.innerWidth;
      const beforeHeight = window.innerHeight;
      
      // 개발자도구가 열렸는지 확인
      setTimeout(() => {
        const after = window.innerWidth;
        const afterHeight = window.innerHeight;
        
        if (Math.abs(after - before) > threshold) {
          devtools.open = true;
          devtools.orientation = after < before ? 'vertical' : 'horizontal';
          protectLayout(devtools);
        } else if (Math.abs(afterHeight - beforeHeight) > threshold) {
          devtools.open = true;
          devtools.orientation = 'horizontal';
          protectLayout(devtools);
        } else {
          devtools.open = false;
          devtools.orientation = null;
          protectLayout(devtools);
        }
      }, 100);
    };
    
    // 윈도우 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkDevTools);
    
    // 초기 체크
    checkDevTools();
    
    return devtools;
  }
  
  function protectLayout(devtools) {
    const body = document.body;
    const html = document.documentElement;
    
    if (devtools.open) {
      // 개발자도구가 열렸을 때 레이아웃 보호
      body.classList.add('devtools-open');
      html.classList.add('devtools-open');
      
      // 개발자도구 방향에 따른 보호
      if (devtools.orientation === 'vertical') {
        body.classList.add('devtools-vertical');
        html.classList.add('devtools-vertical');
        body.classList.remove('devtools-horizontal');
        html.classList.remove('devtools-horizontal');
      } else if (devtools.orientation === 'horizontal') {
        body.classList.add('devtools-horizontal');
        html.classList.add('devtools-horizontal');
        body.classList.remove('devtools-vertical');
        html.classList.remove('devtools-vertical');
      }
      
      // 레이아웃 보호 스타일 적용
      applyDevToolsProtection();
    } else {
      // 개발자도구가 닫혔을 때 정상 상태로 복원
      body.classList.remove('devtools-open', 'devtools-vertical', 'devtools-horizontal');
      html.classList.remove('devtools-open', 'devtools-vertical', 'devtools-horizontal');
      
      // 보호 스타일 제거
      removeDevToolsProtection();
    }
  }
  
  function applyDevToolsProtection() {
    // 동적으로 CSS 스타일 추가
    if (!document.getElementById('devtools-protection-styles')) {
      const style = document.createElement('style');
      style.id = 'devtools-protection-styles';
      style.textContent = `
        /* 개발자도구 레이아웃 보호 */
        .devtools-open {
          overflow-x: hidden !important;
          max-width: 100vw !important;
        }
        
        .devtools-open .main-content-area {
          max-width: calc(100vw - 240px) !important;
          overflow-x: hidden !important;
        }
        
        .devtools-open.sidebar-collapsed .main-content-area {
          max-width: calc(100vw - 72px) !important;
        }
        
        .devtools-open.sidebar-expanded .main-content-area {
          max-width: calc(100vw - 250px) !important;
        }
        
        /* 개발자도구가 세로로 열렸을 때 */
        .devtools-vertical .main-content-area {
          max-width: calc(100vw - 400px) !important;
        }
        
        .devtools-vertical.sidebar-collapsed .main-content-area {
          max-width: calc(100vw - 472px) !important;
        }
        
        .devtools-vertical.sidebar-expanded .main-content-area {
          max-width: calc(100vw - 650px) !important;
        }
        
        /* 개발자도구가 가로로 열렸을 때 */
        .devtools-horizontal .main-content-area {
          max-height: calc(100vh - 300px) !important;
          overflow-y: auto !important;
        }
        
        /* 반응형 보호 */
        @media (max-width: 768px) {
          .devtools-open .main-content-area {
            max-width: calc(100vw - 72px) !important;
          }
          
          .devtools-vertical .main-content-area {
            max-width: calc(100vw - 200px) !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  function removeDevToolsProtection() {
    const style = document.getElementById('devtools-protection-styles');
    if (style) {
      style.remove();
    }
  }

  // 3) 사이드바 토글
  function applySidebar(state) {
    const main = document.querySelector('.main-content-area');
    const aside = document.querySelector('aside');
    const texts = document.querySelectorAll('.sidebar-text-animation');

    if (!main || !aside) return;

    // Svelte 컴포넌트의 상태와 동기화하기 위해 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { 
      detail: { state: state } 
    }));

    // 메인 컨텐츠 영역 클래스 업데이트
    if (state === 'expanded') {
      main.classList.remove('sidebar-collapsed');
      main.classList.add('sidebar-expanded');
      texts.forEach(el => { el.classList.remove('collapsed'); el.classList.add('expanded'); });
    } else {
      main.classList.remove('sidebar-expanded');
      main.classList.add('sidebar-collapsed');
      texts.forEach(el => { el.classList.remove('expanded'); el.classList.add('collapsed'); });
    }
    localStorage.setItem(SIDEBAR_KEY, state);
  }
  function toggleSidebar() {
    const current = localStorage.getItem(SIDEBAR_KEY) || 'collapsed';
    applySidebar(current === 'collapsed' ? 'expanded' : 'collapsed');
  }

  // 4) 초기 상태 복원
  document.addEventListener('DOMContentLoaded', () => {
    // 사이드바 상태 복원
    applySidebar(localStorage.getItem(SIDEBAR_KEY) || 'collapsed');

    // 개발자도구 감지 시작
    detectDevTools();

    // 토글 버튼 바인딩 (아이콘/버튼에 data-action 달기만 하면 끝)
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
    document.querySelectorAll('[data-action="toggle-sidebar"]').forEach(btn => {
      btn.addEventListener('click', toggleSidebar);
    });
  });
})();
