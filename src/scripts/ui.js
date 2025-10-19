// src/scripts/ui.js
(function () {
  const THEME_KEY = 'sr_theme';
  const SIDEBAR_KEY = 'sr_sidebar'; // 'collapsed' | 'expanded'

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

  // 2) 사이드바 토글
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

  // 3) 초기 상태 복원
  document.addEventListener('DOMContentLoaded', () => {
    // 사이드바 상태 복원
    applySidebar(localStorage.getItem(SIDEBAR_KEY) || 'collapsed');

    // 토글 버튼 바인딩 (아이콘/버튼에 data-action 달기만 하면 끝)
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
    document.querySelectorAll('[data-action="toggle-sidebar"]').forEach(btn => {
      btn.addEventListener('click', toggleSidebar);
    });
  });
})();
