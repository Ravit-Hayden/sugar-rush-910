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

    if (!main || !aside) return;

    // body 클래스 동기화 (v3)
    document.body.classList.toggle('sidebar-expanded', state === 'expanded');
    document.body.classList.toggle('sidebar-collapsed', state === 'collapsed');

    // Svelte 컴포넌트의 상태와 동기화하기 위해 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { 
      detail: { state: state } 
    }));

    // 메인 컨텐츠 영역 클래스 업데이트 (기존 호환성 유지)
    if (state === 'expanded') {
      main.classList.remove('sidebar-collapsed');
      main.classList.add('sidebar-expanded');
    } else {
      main.classList.remove('sidebar-expanded');
      main.classList.add('sidebar-collapsed');
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
    // 외부 클릭 시 드롭다운 닫기 (필터 및 정렬 드롭다운 모두 처리)
    document.addEventListener('click', function(e){
      const filterDD = e.target.closest('.filter-dropdown');
      const sortDD = e.target.closest('.sort-dropdown');
      
      // 필터 드롭다운 처리
      document.querySelectorAll('.filter-dropdown').forEach(el=>{
        if(el!==filterDD){ el.dataset.open='false'; el.querySelector('button')?.setAttribute('aria-expanded','false') }
      });
      
      // 정렬 드롭다운 처리
      document.querySelectorAll('.sort-dropdown').forEach(el=>{
        if(el!==sortDD){ el.dataset.open='false'; el.querySelector('button')?.setAttribute('aria-expanded','false') }
      });
      
      // 버튼 클릭은 Svelte 컴포넌트에서 처리하므로 여기서는 드롭다운 토글만 처리
      if(!filterDD && !sortDD) return;
    });
    
    // Escape 키로 드롭다운 닫기 (필터 및 정렬 드롭다운 모두 처리)
    document.addEventListener('keydown', function(e){
      const openFilterDD = document.querySelector('.filter-dropdown[data-open="true"]');
      const openSortDD = document.querySelector('.sort-dropdown[data-open="true"]');
      
      if(e.key==='Escape'){
        if(openFilterDD){
          openFilterDD.dataset.open='false';
          openFilterDD.querySelector('button')?.setAttribute('aria-expanded','false');
          openFilterDD.querySelector('button')?.focus();
        }
        if(openSortDD){
          openSortDD.dataset.open='false';
          openSortDD.querySelector('button')?.setAttribute('aria-expanded','false');
          openSortDD.querySelector('button')?.focus();
        }
      }
    });
    // Svelte 컴포넌트가 이벤트를 처리하므로 여기서는 옵션 클릭 리스너를 추가하지 않음
    // SearchFilterBar.svelte와 앨범 페이지의 onclick 핸들러가 모든 클릭 이벤트를 처리함
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilterDropdowns);
  } else {
    initFilterDropdowns();
  }
})();
