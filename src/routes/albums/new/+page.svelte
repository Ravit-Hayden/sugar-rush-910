<script lang="ts">
	import { goto } from '$app/navigation';
	import { Asterisk, ChevronUp, ChevronDown, ChevronDown as ChevronDownIcon, X, Image, Upload, Plus, GripVertical, Minus } from 'lucide-svelte';
	import { useClickOutside, useEscapeKey } from '$lib/utils/clickOutside';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { GENRES } from '$lib/constants/genres';
	import ArtistSelect from '$lib/components/ArtistSelect.svelte';
	import { toast } from '$lib/stores/toast';

	// 현재 날짜 정보
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const today = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식

	// 폼 상태 (ISO 형식으로 저장)
	let formData = $state({
		title: '',
		artist: '',
		summary: '', // 앨범 요약 (1줄)
		description: '', // 앨범 소개글
		status: 'draft',
		genres: [] as string[],
		tracks: [] as Array<{ 
			id: string; 
			title: string; 
			is_title: boolean;
			duration?: string; // "MM:SS" 형식 (이미 등록된 트랙에서 가져옴)
		}>,
		application_date: '', // 발매 신청일 (ISO YYYY-MM-DD)
		approval_date: '', // 발매 승인일 (ISO YYYY-MM-DD)
		release_date_kr: today, // ISO YYYY-MM-DD (오늘 날짜)
		release_date_global: today // ISO YYYY-MM-DD (오늘 날짜)
	});

	// 발매일에서 연도 자동 계산
	const releaseYear = $derived.by(() => {
		// 국내 발매일이 있으면 해당 연도 사용
		if (formData.release_date_kr) {
			const date = new Date(formData.release_date_kr);
			if (!isNaN(date.getTime())) {
				return date.getFullYear();
			}
		}
		// 국내 발매일이 없고 해외 발매일이 있으면 해외 발매일의 연도 사용
		if (formData.release_date_global) {
			const date = new Date(formData.release_date_global);
			if (!isNaN(date.getTime())) {
				return date.getFullYear();
			}
		}
		// 둘 다 없으면 현재 연도 사용
		return currentYear;
	});

	// 이미지 업로드 상태
	let imageFile = $state<File | null>(null);
	let previewUrl = $state<string>('');
	let fileInput: HTMLInputElement;
	let isDragging = $state(false);

	// 입력 필드 참조
	let titleInput: HTMLInputElement;

	// 제출 상태
	let isSubmitting = $state(false);

	// 상태 드롭다운 열림 상태
	let statusDropdownOpen = $state(false);
	let genreDropdownOpen = $state(false);

	// 선택 가능한 장르 목록 (선택된 장르 제외)
	const availableGenres = $derived(GENRES.filter(genre => !formData.genres.includes(genre)));

	// 장르 추가
	function addGenre(genre: string) {
		if (!formData.genres.includes(genre)) {
			formData.genres = [...formData.genres, genre];
		}
		genreDropdownOpen = false;
	}

	// 장르 제거
	function removeGenre(genre: string) {
		formData.genres = formData.genres.filter(g => g !== genre);
	}

	function toggleGenreDropdown() {
		genreDropdownOpen = !genreDropdownOpen;
	}

	// 트랙 관리
	let trackDropdownOpen = $state<Record<string, boolean>>({});
	let trackInputValues = $state<Record<string, string>>({});
	let trackFocusedIndex = $state<Record<string, number>>({});
	let trackNames = $state<string[]>([]);
	let trackListElements = $state<Record<string, HTMLUListElement>>({});

	// 트랙 목록 로드
	$effect(() => {
		(async () => {
			try {
				const response = await fetch('/api/tracks?limit=100');
				const data = await response.json();
				if (data.ok) {
					trackNames = data.data;
				}
			} catch (error) {
				console.error('Failed to load tracks:', error);
			}
		})();
		return () => {};
	});

	// 각 트랙의 필터링된 목록
	function getFilteredTrackNames(trackId: string) {
		const query = (trackInputValues[trackId] || '').trim().toLowerCase();
		if (!query) return trackNames;
		return trackNames.filter(name => name.toLowerCase().includes(query));
	}

	function addTrack() {
		const newTrack = {
			id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			title: '',
			is_title: false
		};
		formData.tracks = [...formData.tracks, newTrack];
		trackInputValues[newTrack.id] = '';
		trackDropdownOpen[newTrack.id] = false;
		trackFocusedIndex[newTrack.id] = -1;
	}


	// 앨범 duration 자동 계산 (이미 등록된 트랙의 duration만 합산)
	const albumDuration = $derived.by(() => {
		const totalSeconds = formData.tracks
			.map(track => {
				// 이미 등록된 트랙에서 duration이 있는 경우만 합산
				if (!track.duration) return 0;
				const [min, sec] = track.duration.split(':').map(Number);
				return min * 60 + sec;
			})
			.reduce((sum, sec) => sum + sec, 0);
		
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	});

	function removeTrack(trackId: string) {
		formData.tracks = formData.tracks.filter(t => t.id !== trackId);
		delete trackInputValues[trackId];
		delete trackDropdownOpen[trackId];
		delete trackFocusedIndex[trackId];
		delete trackListElements[trackId];
	}

	function toggleTitleTrack(trackId: string) {
		formData.tracks = formData.tracks.map(track => {
			if (track.id === trackId) {
				return { ...track, is_title: !track.is_title };
			}
			return track;
		});
	}

	function updateTrackTitle(trackId: string, title: string) {
		formData.tracks = formData.tracks.map(track =>
			track.id === trackId ? { ...track, title } : track
		);
		trackInputValues[trackId] = title;
	}

	async function handleTrackSelect(trackId: string, trackTitle: string) {
		updateTrackTitle(trackId, trackTitle);
		trackDropdownOpen[trackId] = false;
		trackFocusedIndex[trackId] = -1;
		
		// 등록된 트랙을 선택한 경우, 해당 트랙의 duration 정보 가져오기
		try {
			const response = await fetch(`/api/tracks?title=${encodeURIComponent(trackTitle)}`);
			const data = await response.json();
			if (data.ok && data.data && data.data.length > 0) {
				const selectedTrack = data.data[0];
				// 트랙의 duration 업데이트 (duration이 없으면 undefined로 설정)
				formData.tracks = formData.tracks.map(track => {
					if (track.id === trackId) {
						return { ...track, duration: selectedTrack.duration || undefined };
					}
					return track;
				});
			} else {
				// 등록된 트랙이 아닌 경우 duration 제거
				formData.tracks = formData.tracks.map(track => {
					if (track.id === trackId) {
						return { ...track, duration: undefined };
					}
					return track;
				});
			}
		} catch (error) {
			console.error('트랙 정보 조회 오류:', error);
		}
	}

	function handleTrackInputChange(trackId: string, value: string) {
		trackInputValues[trackId] = value;
		updateTrackTitle(trackId, value);
		trackFocusedIndex[trackId] = -1;
		
		// 값이 변경되면 드롭다운 열기 (사용자가 직접 수정 중일 때)
		// setTimeout을 사용하여 useClickOutside보다 먼저 실행되도록 함
		setTimeout(() => {
			trackDropdownOpen[trackId] = true;
		}, 0);
		
		// 수동 입력 시 duration 제거 (등록된 트랙이 아니므로)
		if (!value.trim()) {
			formData.tracks = formData.tracks.map(track => {
				if (track.id === trackId) {
					return { ...track, duration: undefined };
				}
				return track;
			});
		}
	}


	function handleTrackInputFocus(trackId: string) {
		// setTimeout을 사용하여 useClickOutside보다 먼저 실행되도록 함
		setTimeout(() => {
			trackDropdownOpen[trackId] = true;
		}, 0);
		trackFocusedIndex[trackId] = -1;
	}

	// 검색어 하이라이트 함수
	function highlightSearchTerm(text: string, query: string): Array<{ text: string; isMatch: boolean }> {
		if (!query || query.trim() === '') {
			return [{ text, isMatch: false }];
		}
		
		const lowerText = text.toLowerCase();
		const lowerQuery = query.toLowerCase();
		const parts: Array<{ text: string; isMatch: boolean }> = [];
		let lastIndex = 0;
		
		let index = lowerText.indexOf(lowerQuery, lastIndex);
		while (index !== -1) {
			// 매치 전 텍스트
			if (index > lastIndex) {
				parts.push({ text: text.substring(lastIndex, index), isMatch: false });
			}
			// 매치된 텍스트
			parts.push({ text: text.substring(index, index + query.length), isMatch: true });
			lastIndex = index + query.length;
			index = lowerText.indexOf(lowerQuery, lastIndex);
		}
		
		// 남은 텍스트
		if (lastIndex < text.length) {
			parts.push({ text: text.substring(lastIndex), isMatch: false });
		}
		
		return parts.length > 0 ? parts : [{ text, isMatch: false }];
	}

	function handleTrackInputKeydown(trackId: string, e: KeyboardEvent) {
		const filtered = getFilteredTrackNames(trackId);
		if (!trackDropdownOpen[trackId] || filtered.length === 0) {
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				e.preventDefault();
				trackDropdownOpen[trackId] = true;
				trackFocusedIndex[trackId] = e.key === 'ArrowDown' ? 0 : filtered.length - 1;
			}
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				trackFocusedIndex[trackId] = (trackFocusedIndex[trackId] || -1) < filtered.length - 1 
					? (trackFocusedIndex[trackId] || -1) + 1 
					: 0;
				if (trackListElements[trackId] && trackFocusedIndex[trackId] >= 0) {
					const item = trackListElements[trackId].children[trackFocusedIndex[trackId]] as HTMLElement;
					item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
				}
				break;
			case 'ArrowUp':
				e.preventDefault();
				trackFocusedIndex[trackId] = (trackFocusedIndex[trackId] || -1) > 0 
					? (trackFocusedIndex[trackId] || -1) - 1 
					: filtered.length - 1;
				if (trackListElements[trackId] && trackFocusedIndex[trackId] >= 0) {
					const item = trackListElements[trackId].children[trackFocusedIndex[trackId]] as HTMLElement;
					item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
				}
				break;
			case 'Enter':
				e.preventDefault();
				if ((trackFocusedIndex[trackId] || -1) >= 0 && (trackFocusedIndex[trackId] || -1) < filtered.length) {
					handleTrackSelect(trackId, filtered[trackFocusedIndex[trackId] || -1]);
				} else if (filtered.length === 1) {
					handleTrackSelect(trackId, filtered[0]);
				}
				break;
			case 'Escape':
				e.preventDefault();
				trackDropdownOpen[trackId] = false;
				trackFocusedIndex[trackId] = -1;
				break;
		}
	}

	// 트랙 드래그 앤 드롭
	let draggedTrackId = $state<string | null>(null);
	let dragOverIndex = $state<number | null>(null);

	function handleTrackDragStart(trackId: string, e: DragEvent) {
		draggedTrackId = trackId;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', trackId);
		}
	}

	function handleTrackDragOver(index: number, e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		dragOverIndex = index;
	}

	function handleTrackDragLeave() {
		dragOverIndex = null;
	}

	function handleTrackDrop(index: number, e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		
		if (draggedTrackId === null) return;
		
		const draggedIndex = formData.tracks.findIndex(t => t.id === draggedTrackId);
		if (draggedIndex === -1 || draggedIndex === index) {
			draggedTrackId = null;
			dragOverIndex = null;
			return;
		}

		const newTracks = [...formData.tracks];
		const [draggedTrack] = newTracks.splice(draggedIndex, 1);
		newTracks.splice(index, 0, draggedTrack);
		formData.tracks = newTracks;

		draggedTrackId = null;
		dragOverIndex = null;
	}

	function handleTrackDragEnd() {
		draggedTrackId = null;
		dragOverIndex = null;
	}

	// 외부 클릭 감지 (각 트랙별)
	$effect(() => {
		const cleanups: Array<() => void> = [];
		formData.tracks.forEach(track => {
			const cleanup = useClickOutside(`.track-select-${track.id}`, () => {
				trackDropdownOpen[track.id] = false;
				trackFocusedIndex[track.id] = -1;
			}, trackDropdownOpen[track.id]);
			if (cleanup) {
				cleanups.push(cleanup);
			}
		});
		return () => {
			cleanups.forEach(cleanup => cleanup());
		};
	});

	// Escape 키 감지 (각 트랙별)
	$effect(() => {
		const cleanups: Array<() => void> = [];
		formData.tracks.forEach(track => {
			const cleanup = useEscapeKey(() => {
				trackDropdownOpen[track.id] = false;
				trackFocusedIndex[track.id] = -1;
			}, trackDropdownOpen[track.id]);
			if (cleanup) {
				cleanups.push(cleanup);
			}
		});
		return () => {
			cleanups.forEach(cleanup => cleanup());
		};
	});

	const statusOptions = [
		{ value: 'draft', label: '초안' },
		{ value: 'editing', label: '편집 중' },
		{ value: 'revision_requested', label: '수정 요청' },
		{ value: 'pending_review', label: '검토 대기' },
		{ value: 'under_review', label: '검토 중' },
		{ value: 'editing_complete', label: '편집 완료' },
		{ value: 'approved', label: '승인됨' },
		{ value: 'scheduled', label: '예정됨' },
		{ value: 'published', label: '발매됨' },
		{ value: 'paused', label: '일시정지' },
		{ value: 'archived', label: '보관됨' },
		{ value: 'deleted', label: '삭제됨' }
	];

	const statusLabel = $derived(statusOptions.find(o => o.value === formData.status)?.label || '선택하세요');


	// 실제 저장 로직 (별도 함수로 분리)
	async function performSave() {
		if (isSubmitting) return;

		isSubmitting = true;

		try {
			// 폼 데이터 준비
			const albumData = {
				title: formData.title.trim(),
				artist: formData.artist.trim(),
				summary: formData.summary.trim() || null,
				description: formData.description.trim() || null,
				genres: formData.genres,
				status: formData.status,
				year: releaseYear, // 발매일에서 자동 계산된 연도
				application_date: formData.application_date || null,
				approval_date: formData.approval_date || null,
				release_date_kr: formData.release_date_kr || null,
				release_date_global: formData.release_date_global || null,
				cover_url: null, // 이미지 업로드는 향후 구현
				duration: albumDuration || null, // 앨범 총 재생 시간
				tracks: formData.tracks.map((track, index) => ({
					id: track.id,
					title: track.title,
					is_title: track.is_title,
					duration: track.duration || null,
					track_number: index + 1,
					// audioFile은 FormData로 별도 업로드 필요 (향후 구현)
				}))
			};

			// API 호출
			const response = await fetch('/api/albums', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(albumData)
			});

			const result = await response.json();

			if (!response.ok || !result.ok) {
				const errorMessage = result.error?.message || '앨범 추가에 실패했습니다.';
				throw new Error(errorMessage);
			}

			// 성공 알림
			toast.add('앨범이 성공적으로 추가되었습니다.', 'success', 3000);

			// 목록 페이지로 이동
			setTimeout(() => {
				goto('/albums');
			}, 1000);
		} catch (error) {
			console.error('앨범 추가 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '앨범 추가 중 오류가 발생했습니다.';
			toast.add(errorMessage, 'error', 5000);
		} finally {
			isSubmitting = false;
		}
	}

	async function handleSubmit() {
		if (isSubmitting) return;

		// 기본 검증
		if (!formData.title.trim()) {
			toast.add('앨범 제목을 입력해주세요.', 'error', 3000);
			return;
		}

		if (!formData.artist.trim()) {
			toast.add('아티스트를 선택하거나 입력해주세요.', 'error', 3000);
			return;
		}

		if (!formData.status) {
			toast.add('상태를 선택해주세요.', 'error', 3000);
			return;
		}

		// 트랙 제목 중복 검증
		if (formData.tracks.length > 0) {
			// 모든 트랙의 최종 제목 수집 (입력 중인 값 우선)
			const trackTitles = formData.tracks
				.map((track, index) => {
					const finalTitle = (trackInputValues[track.id] || track.title || '').trim();
					return { title: finalTitle, index: index + 1, id: track.id };
				})
				.filter(item => item.title); // 빈 제목 제외

			// 제목별로 그룹화하여 중복 확인
			const titleGroups = new Map<string, number[]>();
			trackTitles.forEach(item => {
				const existing = titleGroups.get(item.title) || [];
				existing.push(item.index);
				titleGroups.set(item.title, existing);
			});

			// 중복된 제목 찾기
			const duplicates: Array<{ title: string; indices: number[] }> = [];
			titleGroups.forEach((indices, title) => {
				if (indices.length > 1) {
					duplicates.push({ title, indices });
				}
			});

			// 중복이 있으면 경고 메시지 표시하고 저장 중단
			if (duplicates.length > 0) {
				const duplicateInfo = duplicates
					.map(dup => `Track ${dup.indices.join(', ')}`)
					.join(', ');
				
				// 경고 Toast 표시 (계속 저장 버튼 포함)
				toast.add(
					`중복된 트랙 제목이 있습니다. (${duplicateInfo}) 의도하신 것이 맞나요?`,
					'warning',
					0, // 자동으로 사라지지 않음
					{
						label: '계속 저장',
						callback: () => {
							performSave();
						}
					}
				);
				return; // 저장 중단
			}
		}

		// 중복이 없으면 바로 저장
		performSave();
	}

	function handleCancel(event: MouseEvent) {
		const button = event.currentTarget as HTMLButtonElement;
		if (confirm('작성 중인 내용을 저장하지 않고 나가시겠습니까?')) {
			goto('/albums');
		} else {
			// confirm에서 취소를 선택한 경우 포커스 해제
			button.blur();
		}
	}

	function toggleStatusDropdown() {
		statusDropdownOpen = !statusDropdownOpen;
	}

	function selectStatusOption(value: string) {
		formData.status = value;
		statusDropdownOpen = false;
	}

	// 파일 처리 공통 함수
	function processFile(file: File) {
		if (file && file.type.startsWith('image/')) {
			imageFile = file;
			// 기존 미리보기 URL 해제
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
			previewUrl = URL.createObjectURL(file);
		}
	}

	// 이미지 삭제 함수
	function handleImageRemove(event: MouseEvent) {
		event.stopPropagation(); // 업로드 영역 클릭 이벤트 방지
		// 미리보기 URL 해제
		if (previewUrl && previewUrl.startsWith('blob:')) {
			URL.revokeObjectURL(previewUrl);
		}
		// 상태 초기화
		imageFile = null;
		previewUrl = '';
		// 파일 입력 초기화
		if (fileInput) {
			fileInput.value = '';
		}
	}

	// 이미지 선택 핸들러
	function handleImageSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			processFile(file);
		}
	}

	// 이미지 업로드 영역 클릭 핸들러
	function handleImageAreaClick(event: MouseEvent) {
		const uploadZone = event.currentTarget as HTMLElement;
		// 업로드 영역에 포커스 주기
		uploadZone.focus();
		fileInput?.click();
	}

	// 파일 입력 포커스 해제 핸들러 (다이얼로그 취소 시 포커스 해제)
	function handleFileInputBlur() {
		// 파일이 선택되지 않았으면 업로드 영역의 포커스도 해제
		if (!fileInput?.files || fileInput.files.length === 0) {
			// 업로드 영역 요소 찾아서 포커스 해제
			setTimeout(() => {
				const uploadZone = document.querySelector('.upload-zone[aria-label="앨범 커버 업로드"]') as HTMLElement;
				if (uploadZone && document.activeElement === uploadZone) {
					uploadZone.blur();
				}
			}, 100);
		}
	}

	// 파일 입력 클릭 핸들러 (다이얼로그가 열렸는지 감지)
	function handleFileInputClick() {
		// 다이얼로그가 열린 후 닫힐 때를 감지하기 위해 window focus 이벤트 사용
		const handleWindowFocus = () => {
			// 파일이 선택되지 않았으면 업로드 영역 포커스 해제
			setTimeout(() => {
				if (!fileInput?.files || fileInput.files.length === 0) {
					const uploadZone = document.querySelector('.upload-zone[aria-label="앨범 커버 업로드"]') as HTMLElement;
					if (uploadZone && document.activeElement === uploadZone) {
						uploadZone.blur();
					}
				}
				window.removeEventListener('focus', handleWindowFocus);
			}, 100);
		};
		window.addEventListener('focus', handleWindowFocus);
	}

	// 드래그 앤 드롭 핸들러
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = false;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			const file = files[0];
			processFile(file);
		}
	}

	// 외부 클릭 및 Escape 키 처리
	$effect(() => {
		function handleClickOutside(e: MouseEvent) {
			const target = e.target as HTMLElement;
			if (!target.closest('.status-dropdown')) {
				statusDropdownOpen = false;
			}
			if (!target.closest('.genre-dropdown')) {
				genreDropdownOpen = false;
			}
		}

		function handleEscape(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				if (statusDropdownOpen) statusDropdownOpen = false;
				if (genreDropdownOpen) genreDropdownOpen = false;
			}
		}

		if (statusDropdownOpen || genreDropdownOpen) {
			document.addEventListener('click', handleClickOutside);
			document.addEventListener('keydown', handleEscape);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleEscape);
		};
	});

	// 컴포넌트 언마운트 시 미리보기 URL 정리
	$effect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	});
</script>

<svelte:head>
	<title>앨범 추가</title>
</svelte:head>

<PageContent>
	<PageHeader 
		title="앨범 추가"
		description="새로운 앨범을 추가합니다"
	/>

			<!-- 추가 폼 -->
	<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
			<!-- 좌우 배치 컨테이너 -->
			<div class="flex flex-col lg:flex-row gap-10 p-6">
				<!-- [좌측] 이미지 업로드 영역 -->
				<div class="group relative w-full lg:w-80 flex-shrink-0">
					<div
						onclick={handleImageAreaClick}
						ondragover={handleDragOver}
						ondragleave={handleDragLeave}
						ondrop={handleDrop}
						class="upload-zone relative w-full aspect-square bg-surface-1 rounded-xl border-2 cursor-pointer flex items-center justify-center overflow-visible {isDragging ? 'border-brand-pink bg-surface-2/50' : ''}"
						data-dragging={isDragging}
						role="button"
						tabindex="0"
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleImageAreaClick();
							}
						}}
						aria-label="앨범 커버 업로드"
					>
						<input
							type="file"
							accept="image/*"
							class="hidden"
							bind:this={fileInput}
							onchange={handleImageSelect}
							onclick={handleFileInputClick}
							onblur={handleFileInputBlur}
						/>
						{#if previewUrl}
							<div class="relative w-full h-full overflow-hidden rounded-xl">
							<img
								src={previewUrl}
								alt="앨범 커버 미리보기"
								class="w-full h-full object-cover rounded-xl"
							/>
							</div>
							<button
								type="button"
								onclick={handleImageRemove}
								class="btn-icon absolute bottom-0 right-0 bg-surface-1 border-t border-l border-border-subtle rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:opacity-100 flex items-center justify-center"
								style="transform: translateY(calc(100% + 4px));"
								aria-label="이미지 삭제"
							>
								<X size={18} class="lucide-icon text-text-strong" style="stroke-width: 2.5;" />
							</button>
						{:else}
							<div class="flex flex-col items-center justify-center gap-2 text-text-muted">
								<Image size={48} class="lucide-icon" />
								<span class="text-sm font-medium">클릭 또는 드래그하여 업로드</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- [우측] 입력 필드 영역 -->
				<div class="flex-1 space-y-4">
			<!-- 기본 정보 -->
			<div class="space-y-4">
				<h3 class="text-lg font-semibold text-text-strong">기본 정보</h3>
				
				<!-- 앨범 제목 -->
				<div class="w-full">
					<div class="flex items-center justify-between mb-2">
						<label for="title" class="block text-sm font-medium text-text-strong">
						앨범 제목 <Asterisk size={12} class="inline text-brand-pink ml-0" />
					</label>
					</div>
					<div class="relative">
						<input
							type="text"
							id="title"
							name="title"
							bind:this={titleInput}
							bind:value={formData.title}
							required
							class="input-base w-full h-10 px-4 {formData.title.trim() ? 'pr-10' : 'pr-4'} text-base placeholder:text-text-muted"
							placeholder="앨범 제목을 입력하세요"
						/>
						{#if formData.title.trim()}
							<button
								type="button"
								onclick={() => {
									formData.title = '';
									titleInput?.focus();
								}}
								class="btn-icon absolute inset-y-0 right-2.5 flex items-center pointer-events-auto"
								aria-label="입력 내용 지우기"
							>
								<span class="flex h-4 w-4 items-center justify-center">
									<X size={16} class="lucide-icon text-text-muted" />
								</span>
							</button>
						{/if}
					</div>
				</div>

				<!-- 아티스트 -->
				<div class="w-full">
					<label for="artist" class="block text-sm font-medium text-text-strong mb-2">
						아티스트 <Asterisk size={12} class="inline text-brand-pink ml-0" />
					</label>
					<ArtistSelect
						value={formData.artist}
						onChange={(value) => formData.artist = value}
						required
						placeholder="아티스트를 선택하거나 입력하세요"
						allowCustom={true}
					/>
				</div>

				<!-- 앨범 요약 (1줄) -->
				<div class="w-full">
					<label for="summary" class="block text-sm font-medium text-text-strong mb-2">
						앨범 요약
					</label>
					<div class="relative">
						<input
							type="text"
							id="summary"
							name="summary"
							bind:value={formData.summary}
							spellcheck="true"
							class="input-base w-full h-10 px-4 {formData.summary.trim() ? 'pr-10' : 'pr-4'} text-base placeholder:text-text-muted"
							placeholder="앨범을 한 줄로 요약해주세요"
						/>
						{#if formData.summary.trim()}
							<button
								type="button"
								onclick={() => formData.summary = ''}
								class="btn-icon absolute inset-y-0 right-2.5 flex items-center pointer-events-auto"
								aria-label="입력 내용 지우기"
							>
								<span class="flex h-4 w-4 items-center justify-center">
									<X size={16} class="lucide-icon text-text-muted" />
								</span>
							</button>
						{/if}
					</div>
				</div>

				<!-- 앨범 소개글 -->
				<div class="w-full">
					<label for="description" class="block text-sm font-medium text-text-strong mb-2">
						앨범 소개글
					</label>
					<div class="relative">
						<textarea
							id="description"
							name="description"
							bind:value={formData.description}
							spellcheck="true"
							rows="6"
							class="input-base w-full px-4 py-3 text-base placeholder:text-text-muted resize-y min-h-[120px]"
							placeholder="앨범에 대한 상세한 소개글을 작성해주세요"
						></textarea>
					</div>
				</div>

				<!-- 장르 -->
				<div class="w-full">
					<label for="genres" class="block text-sm font-medium text-text-strong mb-2">
						장르
					</label>
					<div class="relative w-full genre-dropdown">
						<div
							id="genres"
							onclick={toggleGenreDropdown}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									toggleGenreDropdown();
								}
							}}
							class="w-full min-h-10 px-4 pr-[2.625rem] py-0 bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base transition-colors duration-200 flex flex-wrap gap-2 items-center cursor-pointer focus-within:outline-none focus-within:ring-0"
							role="button"
							aria-haspopup="listbox"
							aria-expanded={genreDropdownOpen}
							tabindex="0"
						>
							{#if formData.genres.length === 0}
								<span class="text-text-muted">장르를 선택하세요</span>
							{:else}
								{#each formData.genres as genre}
									<span class="tag-chip">
										{genre}
										<button
											type="button"
											onclick={(e) => {
												e.stopPropagation();
												removeGenre(genre);
											}}
											class="btn-icon ml-1 focus:outline-none"
											aria-label="{genre} 제거"
										>
											<X size={12} />
										</button>
									</span>
								{/each}
							{/if}
						</div>
						<div class="pointer-events-none absolute top-3 right-2.5 flex items-center">
							<span class="flex h-4 w-4 items-center justify-center">
							<ChevronDownIcon size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
							</span>
						</div>
						{#if genreDropdownOpen}
							<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border border-border-subtle rounded-[6px] z-10 max-h-60 custom-list-scrollbar">
								{#if availableGenres.length === 0}
									<li class="px-4 py-2 text-base text-text-muted text-center">모든 장르가 선택되었습니다</li>
								{:else}
									{#each availableGenres as genre}
										<li
											role="option"
											aria-selected="false"
											tabindex="0"
											onclick={() => addGenre(genre)}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													addGenre(genre);
												}
											}}
											class="px-4 py-2 text-base text-text-base bg-transparent transition-colors duration-200 cursor-pointer genre-dropdown-item focus:!bg-brand-pink focus:!text-white focus:outline-none"
										>
											{genre}
										</li>
									{/each}
								{/if}
							</ul>
						{/if}
					</div>
				</div>

				<!-- 트랙 -->
				<div class="w-full">
					<div class="flex items-center justify-between mb-2">
						<div class="block text-sm font-medium text-text-strong">
							트랙
						</div>
						<div class="text-sm text-text-muted">
							<span class="inline-block text-right w-8">{formData.tracks.length}</span>곡 • <span class="inline-block w-10 text-right">{albumDuration}</span>
						</div>
					</div>
					<div class="space-y-2">
						{#each formData.tracks as track, index}
							<div 
								role="button"
								tabindex="0"
								class="relative track-select-{track.id} {trackDropdownOpen[track.id] ? 'z-20' : 'z-0 hover:z-10'} {dragOverIndex === index ? 'opacity-50' : ''} {draggedTrackId === track.id ? 'opacity-30' : ''}"
								draggable="true"
								ondragstart={(e) => handleTrackDragStart(track.id, e)}
								ondragover={(e) => handleTrackDragOver(index, e)}
								ondragleave={handleTrackDragLeave}
								ondrop={(e) => handleTrackDrop(index, e)}
								ondragend={handleTrackDragEnd}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
									}
								}}
							>
								<!-- 트랙 입력 필드 -->
								<div class="relative h-10 flex items-center overflow-visible">
									<input
										type="text"
										value={trackInputValues[track.id] || track.title}
										oninput={(e) => handleTrackInputChange(track.id, e.currentTarget.value)}
										onfocus={() => handleTrackInputFocus(track.id)}
										onkeydown={(e) => handleTrackInputKeydown(track.id, e)}
										placeholder="트랙 제목을 입력하세요"
										class="input-base w-full h-10 px-4 pl-[6.75rem] pr-[5.5rem] text-base placeholder:text-text-muted relative z-0"
									/>
									<!-- 드래그 핸들 (왼쪽, 좌측 라인과 가깝게) -->
									<button
										type="button"
										class="btn-icon absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-auto cursor-grab active:cursor-grabbing z-10"
										aria-label="드래그하여 순서 변경"
										tabindex="-1"
									>
										<GripVertical size={16} class="lucide-icon text-text-muted" />
									</button>
									<!-- 타이틀 선택 버튼 (드래그 핸들 오른쪽, 패딩 없이) -->
									<button
										type="button"
										onclick={(e) => {
											e.stopPropagation();
											toggleTitleTrack(track.id);
										}}
										class="absolute left-[2.125rem] top-1/2 -translate-y-1/2 flex items-center pointer-events-auto bg-transparent z-10 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-1"
										aria-label={track.is_title ? '타이틀 곡 해제' : '타이틀 곡 선택'}
									>
										<span class="track-title-button-text transition-colors duration-200 {track.is_title ? 'text-brand-pink font-bold' : 'text-[color-mix(in_srgb,var(--text-base),var(--bg)_60%)] font-medium'}">
											TITLE
										</span>
									</button>
									<!-- 트랙 번호 (TITLE 버튼 옆, 좌우 여백 동일) -->
									<div class="absolute left-[5.125rem] top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
										<span class="text-sm font-medium ml-2 mr-2 text-brand-pink">{index + 1}</span>
									</div>
									<!-- 트랙 재생 시간 (X 버튼 왼쪽, 같은 갭) - 등록된 트랙 선택 시에만 표시 -->
									{#if (trackInputValues[track.id] || track.title).trim()}
										<div class="absolute right-[5.25rem] top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
											<span class="text-xs text-text-muted tabular-nums">
												{(() => {
													// MM:SS 형식으로 포맷팅 (두 자리 분)
													if (!track.duration) return '00:00';
													const parts = track.duration.split(':');
													if (parts.length === 2) {
														const min = String(parseInt(parts[0])).padStart(2, '0');
														const sec = String(parseInt(parts[1])).padStart(2, '0');
														return `${min}:${sec}`;
													}
													return track.duration;
												})()}
											</span>
										</div>
									{/if}
									<!-- 삭제/지우기 버튼 (인풋에 내용이 있으면 X, 없으면 Minus) -->
									{#if (trackInputValues[track.id] || track.title).trim()}
										<!-- 인풋 내용 지우기 (X 버튼) -->
										<button
											type="button"
											onclick={(e) => {
												e.stopPropagation();
												handleTrackInputChange(track.id, '');
											}}
											class="btn-icon absolute right-[2.625rem] top-1/2 -translate-y-1/2 flex items-center pointer-events-auto z-10"
											aria-label="입력 내용 지우기"
										>
											<span class="flex h-4 w-4 items-center justify-center">
												<X size={16} class="lucide-icon text-text-muted" />
											</span>
										</button>
									{:else}
										<!-- 트랙 삭제 (Minus 버튼) -->
										<button
											type="button"
											onclick={(e) => {
												e.stopPropagation();
												removeTrack(track.id);
											}}
											class="btn-icon absolute right-[2.625rem] top-1/2 -translate-y-1/2 flex items-center pointer-events-auto z-10"
											aria-label="트랙 삭제"
										>
											<span class="flex h-4 w-4 items-center justify-center">
												<Minus size={16} class="lucide-icon text-text-muted" />
											</span>
										</button>
									{/if}
									<!-- 드롭다운 버튼 -->
									<button
										type="button"
										onclick={() => trackDropdownOpen[track.id] = !trackDropdownOpen[track.id]}
										class="btn-icon absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-auto z-10"
										aria-label="트랙 목록 열기"
										aria-expanded={trackDropdownOpen[track.id]}
									>
										<span class="flex h-4 w-4 items-center justify-center">
											<ChevronDownIcon size={16} class="lucide-icon text-text-muted {trackDropdownOpen[track.id] ? 'rotate-180' : ''}" />
										</span>
									</button>
									<!-- 드롭다운 목록 (격리된 컨테이너) -->
									{#if trackDropdownOpen[track.id]}
										<div class="absolute left-0 top-full w-full z-[100] pointer-events-none">
											<ul 
												bind:this={trackListElements[track.id]}
												role="listbox" 
												class="filter-dropdown w-full mt-1.5 bg-surface-1 border border-border-subtle rounded-[6px] max-h-60 custom-list-scrollbar pointer-events-auto"
											>
											{#if getFilteredTrackNames(track.id).length === 0}
												<li class="px-4 py-2 text-base text-text-muted text-center">
													{(trackInputValues[track.id] || track.title).trim() 
														? `"${trackInputValues[track.id] || track.title}"와 일치하는 트랙이 없습니다`
														: '등록된 트랙이 없습니다'}
												</li>
											{:else}
												{#each getFilteredTrackNames(track.id) as trackName, i}
													<li
														role="option"
														aria-selected={(trackInputValues[track.id] || track.title) === trackName}
														tabindex={(trackFocusedIndex[track.id] || -1) === i ? 0 : -1}
														class="px-4 py-2 text-base text-text-base hover:bg-surface-2 cursor-pointer {(trackFocusedIndex[track.id] || -1) === i ? 'bg-surface-2' : ''} {(trackInputValues[track.id] || track.title) === trackName ? 'bg-brand-pink text-white' : ''}"
														onclick={() => handleTrackSelect(track.id, trackName)}
														onkeydown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																e.preventDefault();
																handleTrackSelect(track.id, trackName);
															}
														}}
														onmouseenter={() => trackFocusedIndex[track.id] = i}
													>
														{#if (trackInputValues[track.id] || track.title).trim()}
															{#each highlightSearchTerm(trackName, (trackInputValues[track.id] || track.title).trim()) as part}
																{#if part.isMatch}
																	<span class="text-search-highlight font-medium">{part.text}</span>
																{:else}
																	{part.text}
																{/if}
															{/each}
														{:else}
															{trackName}
														{/if}
													</li>
												{/each}
											{/if}
											</ul>
										</div>
									{/if}
								</div>
							</div>
						{/each}
						<button
							type="button"
							onclick={(e) => {
								addTrack();
								(e.currentTarget as HTMLButtonElement).blur();
							}}
							class="w-full h-10 px-4 bg-hover-point rounded-lg focus:outline-none focus:ring-0 transition-colors duration-200 flex items-center justify-center gap-2"
						>
							<Plus size={16} class="lucide-icon" />
							<span class="text-sm font-medium">트랙 추가</span>
						</button>
					</div>
				</div>

				<!-- 상태 -->
				<div class="w-full">
					<label for="status" class="block text-sm font-medium text-text-strong mb-2">
						상태 <Asterisk size={12} class="inline text-brand-pink ml-0" />
					</label>
					<div class="relative w-full status-dropdown" data-open={statusDropdownOpen}>
						<input type="hidden" name="status" value={formData.status} />
						<button
							type="button"
							id="status"
							name="status"
							class="w-full h-10 px-4 pr-[2.625rem] bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base text-left focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
							onclick={toggleStatusDropdown}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									toggleStatusDropdown();
								}
							}}
							aria-haspopup="listbox"
							aria-expanded={statusDropdownOpen}
							tabindex="0"
						>
							<span class="block truncate">{statusLabel}</span>
						</button>
						<!-- 오른쪽 아이콘 래퍼: 통일된 패턴 -->
						<div class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
							<span class="flex h-4 w-4 items-center justify-center">
								<ChevronDownIcon size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
							</span>
						</div>
						{#if statusDropdownOpen}
							<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle max-h-60 overflow-y-auto">
								{#each statusOptions as option}
									<li
										role="option"
										aria-selected={formData.status === option.value}
										tabindex="0"
										onclick={() => selectStatusOption(option.value)}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												selectStatusOption(option.value);
											}
										}}
										class="px-4 py-2 text-base text-text-base hover:bg-surface-2 cursor-pointer {formData.status === option.value ? 'bg-brand-pink text-white' : ''}"
									>
										{option.label}
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>
			</div>

				</div>
			</div>

			<!-- 일정 및 심사 정보 -->
			<div class="border-t border-border-subtle">
				<div class="p-6 space-y-4">
					<h3 class="text-lg font-semibold text-text-strong">일정 및 심사 정보</h3>
					
					<!-- 발매 신청일 -->
					<div class="w-full">
						<label for="application_date" class="block text-sm font-medium text-text-strong mb-2">발매 신청일</label>
						<DatePicker 
							id="application_date" 
							name="application_date" 
							bind:value={formData.application_date} 
						/>
					</div>

					<!-- 발매 승인일 -->
					<div class="w-full">
						<label for="approval_date" class="block text-sm font-medium text-text-strong mb-2">발매 승인일</label>
						<DatePicker 
							id="approval_date" 
							name="approval_date" 
							bind:value={formData.approval_date} 
						/>
					</div>
					
					<!-- 국내 발매일 -->
					<div class="w-full">
						<label for="release_date_kr" class="block text-sm font-medium text-text-strong mb-2">국내 발매일</label>
						<DatePicker 
							id="release_date_kr" 
							name="release_date_kr" 
							bind:value={formData.release_date_kr} 
						/>
					</div>

					<!-- 해외 발매일 -->
					<div class="w-full">
						<label for="release_date_global" class="block text-sm font-medium text-text-strong mb-2">해외 발매일</label>
						<DatePicker 
							id="release_date_global" 
							name="release_date_global" 
							bind:value={formData.release_date_global} 
						/>
					</div>
				</div>
			</div>

			<!-- 액션 버튼 -->
			<div class="border-t border-border-subtle p-6">
				<div class="flex items-center justify-end gap-3">
				<button
					type="button"
					onclick={handleCancel}
					class="cancel-button px-6 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors duration-200 font-medium"
				>
					취소
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="px-6 py-2 bg-brand-pink text-white rounded-lg focus:outline-none focus:ring-0 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
					aria-busy={isSubmitting}
				>
					추가
				</button>
				</div>
			</div>
		</form>
	</div>
</PageContent>
