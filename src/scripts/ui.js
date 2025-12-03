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

  function initFilterDropdowns() {
    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', function(e){
      const dd = e.target.closest('.filter-dropdown');
      document.querySelectorAll('.filter-dropdown').forEach(el=>{
        if(el!==dd){ el.dataset.open='false'; el.querySelector('button')?.setAttribute('aria-expanded','false') }
      });
      // 버튼 클릭은 Svelte 컴포넌트에서 처리하므로 여기서는 드롭다운 토글만 처리
      if(!dd) return;
      const btn = dd.querySelector('button');
      // 버튼 자체를 클릭한 경우는 Svelte의 on:click이 처리하므로 여기서는 처리하지 않음
      // 옵션 클릭도 Svelte의 on:click이 처리하므로 여기서는 처리하지 않음
    });
    // Escape 키로 드롭다운 닫기
    document.addEventListener('keydown', function(e){
      const openDD = document.querySelector('.filter-dropdown[data-open="true"]');
      if(!openDD) return;
      if(e.key==='Escape'){
        openDD.dataset.open='false';
        openDD.querySelector('button')?.setAttribute('aria-expanded','false');
        openDD.querySelector('button')?.focus();
      }
    });
    // Svelte 컴포넌트가 이벤트를 처리하므로 여기서는 옵션 클릭 리스너를 추가하지 않음
    // SearchFilterBar.svelte의 on:click 핸들러가 모든 클릭 이벤트를 처리함
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilterDropdowns);
  } else {
    initFilterDropdowns();
  }
})();
