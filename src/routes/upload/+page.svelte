<script lang="ts">
	import { 
		Upload, FolderPlus, Search, Star, Trash2, 
		Play, Pause, ChevronDown, Folder, FileAudio,
		Edit2, Link, X, Check, Music, Clock, HardDrive, 
		Loader2, Plus, FolderOpen, Download,
		ChevronRight, ArrowUpDown, Archive, RotateCcw,
		CheckSquare, Square, Tag, Copy, Pipette
	} from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import { toast } from '$lib/stores/toast';
	import type { AudioFile, AudioFolder, UploadItem } from '$lib/types/audio';
	import { formatDuration, formatFileSize, getFormatColor, FOLDER_COLORS } from '$lib/types/audio';

	// === 상태 ===
	let searchQuery = $state('');
	let selectedFolderId = $state<string | null>(null);
	let showOnlyFavorites = $state(false);
	let showOnlyUnfiled = $state(false);
	let showArchived = $state(false);
	let selectedTag = $state<string | null>(null);
	let sortBy = $state<'date' | 'name' | 'size' | 'duration'>('date');
	let sortAsc = $state(false);
	
	// 다중 선택
	let selectMode = $state(false);
	let selectedIds = $state<Set<string>>(new Set());
	
	// 드롭다운
	let showFolderDropdown = $state(false);
	let showSortDropdown = $state(false);
	let showTagDropdown = $state(false);
	let showQuickDropdown = $state(false);
	
	// 업로드
	let dragOver = $state(false);
	let uploadItems = $state<UploadItem[]>([]);
	let showUploadProgress = $state(false);
	
	// 모달
	let showFolderModal = $state(false);
	let showFileModal = $state(false);
	let showMoveModal = $state(false);
	let showBulkMoveModal = $state(false);
	let editingFolderId = $state<string | null>(null);
	let selectedFile = $state<AudioFile | null>(null);
	let moveTargetFile = $state<AudioFile | null>(null);
	
	// 폴더 편집
	let folderName = $state('');
	let folderColor = $state('default');
	let customColor = $state('#ec4899');
	let extractedColors = $state<string[]>([]);
	let extractingColors = $state(false);
	
	// 파일 편집
	let editName = $state('');
	let editDescription = $state('');
	let editTags = $state<string[]>([]);
	let newTag = $state('');
	
	// 오디오
	let playingId = $state<string | null>(null);
	let audioElement = $state<HTMLAudioElement | null>(null);

	// === 데이터 ===
	let folders = $state<AudioFolder[]>([
		{ id: 'folder1', name: '작업중', parentId: null, color: 'pink', fileCount: 2, createdAt: '2026-01-10', updatedAt: '2026-01-12' },
		{ id: 'folder2', name: '완성곡', parentId: null, color: 'green', fileCount: 2, createdAt: '2026-01-05', updatedAt: '2026-01-11' },
		{ id: 'folder3', name: '샘플', parentId: null, color: 'blue', fileCount: 8, createdAt: '2026-01-01', updatedAt: '2026-01-10' },
		{ id: 'folder4', name: '보관함', parentId: null, color: 'default', fileCount: 3, createdAt: '2025-12-20', updatedAt: '2026-01-05' }
	]);

	let files = $state<AudioFile[]>([
		{ id: 'file1', fileName: 'sugar_rush_final.mp3', originalName: 'sugar_rush_final.mp3', folderId: 'folder2', fileUrl: '', fileSize: 8500000, duration: 215, format: 'mp3', tags: ['발매곡'], linkedTrackId: 'track1', uploadedBy: 'El', uploadedAt: '2026-01-10', updatedAt: '2026-01-12', isStarred: true, isArchived: false },
		{ id: 'file2', fileName: 'midnight_dream.wav', originalName: 'midnight_dream.wav', folderId: 'folder1', fileUrl: '', fileSize: 42000000, duration: 198, format: 'wav', tags: ['데모'], uploadedBy: 'Otte', uploadedAt: '2026-01-11', updatedAt: '2026-01-11', isStarred: false, isArchived: false },
		{ id: 'file3', fileName: 'summer_vibes.mp3', originalName: 'summer_vibes.mp3', folderId: 'folder1', fileUrl: '', fileSize: 7200000, duration: 180, format: 'mp3', tags: ['데모'], uploadedBy: 'El', uploadedAt: '2026-01-09', updatedAt: '2026-01-09', isStarred: true, isArchived: false },
		{ id: 'file4', fileName: 'beat_loop.wav', originalName: 'beat_loop.wav', folderId: 'folder3', fileUrl: '', fileSize: 5400000, duration: 32, format: 'wav', tags: ['샘플', '루프'], uploadedBy: 'El', uploadedAt: '2026-01-08', updatedAt: '2026-01-08', isStarred: false, isArchived: false },
		{ id: 'file5', fileName: 'vocal_harmony.flac', originalName: 'vocal_harmony.flac', folderId: 'folder3', fileUrl: '', fileSize: 28000000, duration: 45, format: 'flac', tags: ['샘플', '보컬'], uploadedBy: 'Otte', uploadedAt: '2026-01-07', updatedAt: '2026-01-07', isStarred: false, isArchived: false },
		{ id: 'file6', fileName: 'neon_lights.mp3', originalName: 'neon_lights.mp3', folderId: 'folder2', fileUrl: '', fileSize: 7800000, duration: 195, format: 'mp3', tags: ['발매곡'], linkedTrackId: 'track2', uploadedBy: 'El', uploadedAt: '2026-01-06', updatedAt: '2026-01-06', isStarred: true, isArchived: false },
		{ id: 'file7', fileName: 'piano_sketch.m4a', originalName: 'piano_sketch.m4a', folderId: null, fileUrl: '', fileSize: 3200000, duration: 120, format: 'm4a', tags: ['스케치'], uploadedBy: 'Otte', uploadedAt: '2026-01-05', updatedAt: '2026-01-05', isStarred: false, isArchived: false },
		{ id: 'file8', fileName: 'old_draft.mp3', originalName: 'old_draft.mp3', folderId: null, fileUrl: '', fileSize: 4100000, duration: 90, format: 'mp3', tags: ['데모'], uploadedBy: 'El', uploadedAt: '2025-12-15', updatedAt: '2025-12-15', isStarred: false, isArchived: true }
	]);

	// === 파생 ===
	const currentFolder = $derived(folders.find(f => f.id === selectedFolderId));
	
	// 모든 태그 수집
	const allTags = $derived.by(() => {
		const tagSet = new Set<string>();
		files.forEach(f => f.tags.forEach(t => tagSet.add(t)));
		return Array.from(tagSet).sort();
	});
	
	const filteredFiles = $derived.by(() => {
		let result = showArchived 
			? files.filter(f => f.isArchived)
			: files.filter(f => !f.isArchived);
		
		// 검색
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			result = result.filter(f => 
				f.fileName.toLowerCase().includes(q) ||
				f.tags.some(t => t.toLowerCase().includes(q))
			);
		}
		
		// 폴더 필터
		if (selectedFolderId) {
			result = result.filter(f => f.folderId === selectedFolderId);
		}
		
		// 미분류 필터
		if (showOnlyUnfiled) {
			result = result.filter(f => f.folderId === null);
		}
		
		// 즐겨찾기 필터
		if (showOnlyFavorites) {
			result = result.filter(f => f.isStarred);
		}
		
		// 태그 필터
		if (selectedTag) {
			const tag = selectedTag;
			result = result.filter(f => f.tags.includes(tag));
		}
		
		// 정렬
		result.sort((a, b) => {
			let cmp = 0;
			switch (sortBy) {
				case 'name': cmp = a.fileName.localeCompare(b.fileName); break;
				case 'size': cmp = a.fileSize - b.fileSize; break;
				case 'duration': cmp = a.duration - b.duration; break;
				default: cmp = a.uploadedAt.localeCompare(b.uploadedAt);
			}
			return sortAsc ? cmp : -cmp;
		});
		
		return result;
	});

	const stats = $derived({
		totalFiles: files.filter(f => !f.isArchived).length,
		totalSize: files.filter(f => !f.isArchived).reduce((s, f) => s + f.fileSize, 0),
		favoriteCount: files.filter(f => f.isStarred && !f.isArchived).length,
		archivedCount: files.filter(f => f.isArchived).length,
		unfiledCount: files.filter(f => f.folderId === null && !f.isArchived).length
	});

	// 사용된 색상 (프리셋 ID 또는 커스텀 HEX)
	const usedColors = $derived(new Set(folders.map(f => f.color)));
	
	// 사용되지 않은 색상만 필터링
	const availableColors = $derived(
		FOLDER_COLORS.filter(c => !usedColors.has(c.id) || c.id === (editingFolderId ? folders.find(f => f.id === editingFolderId)?.color : null))
	);
	
	// 폴더 정렬 옵션
	let folderSortBy = $state<'name' | 'created' | 'updated'>('name');
	let folderSortAsc = $state(true);
	
	// 정렬된 폴더 목록
	const sortedFolders = $derived.by(() => {
		return [...folders].sort((a, b) => {
			let cmp = 0;
			switch (folderSortBy) {
				case 'name': cmp = a.name.localeCompare(b.name); break;
				case 'created': cmp = a.createdAt.localeCompare(b.createdAt); break;
				case 'updated': cmp = a.updatedAt.localeCompare(b.updatedAt); break;
				default: cmp = a.name.localeCompare(b.name);
			}
			return folderSortAsc ? cmp : -cmp;
		});
	});

	const sortLabels: Record<string, string> = { date: '날짜', name: '이름', size: '크기', duration: '길이' };
	const folderSortLabels: Record<string, string> = { name: '이름순', created: '생성순', updated: '수정순' };
	
	// 최근 업로드 (3일 이내)
	const recentFiles = $derived.by(() => {
		const threeDaysAgo = new Date();
		threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
		const dateStr = threeDaysAgo.toISOString().split('T')[0];
		return files.filter(f => !f.isArchived && f.uploadedAt >= dateStr).length;
	});

	// === 폴더 ===
	function openFolderModal(id: string | null = null) {
		editingFolderId = id;
		if (id) {
			const f = folders.find(x => x.id === id);
			folderName = f?.name || '';
			const c = f?.color || 'default';
			if (c.startsWith('#')) {
				folderColor = 'custom';
				customColor = c;
			} else {
				folderColor = c;
			}
		} else {
			folderName = '';
			// 사용 가능한 색상 중 첫 번째를 기본값으로 설정
			const available = FOLDER_COLORS.filter(c => !usedColors.has(c.id));
			folderColor = available.length > 0 ? available[0].id : 'default';
			customColor = '#ec4899';
		}
		extractedColors = [];
		showFolderModal = true;
	}

	function saveFolder() {
		if (!folderName.trim()) return;
		const color = folderColor === 'custom' ? customColor : folderColor;
		
		if (editingFolderId) {
			folders = folders.map(f => f.id === editingFolderId ? { ...f, name: folderName.trim(), color } : f);
			toast.add('폴더가 수정되었습니다', 'success');
		} else {
			folders = [...folders, {
				id: `folder_${Date.now()}`,
				name: folderName.trim(),
				parentId: null,
				color,
				fileCount: 0,
				createdAt: new Date().toISOString().split('T')[0],
				updatedAt: new Date().toISOString().split('T')[0]
			}];
			toast.add('폴더가 생성되었습니다', 'success');
		}
		showFolderModal = false;
	}

	function deleteFolder(id: string) {
		if (!confirm('폴더를 삭제하시겠습니까?\n폴더 내 파일은 미분류로 이동합니다.')) return;
		files = files.map(f => f.folderId === id ? { ...f, folderId: null } : f);
		folders = folders.filter(f => f.id !== id);
		if (selectedFolderId === id) selectedFolderId = null;
		toast.add('폴더가 삭제되었습니다', 'success');
	}

	function getFolderColor(c: string): string {
		if (c.startsWith('#')) return c;
		return FOLDER_COLORS.find(x => x.id === c)?.value || '#6b7280';
	}

	function getFileCount(folderId: string | null): number {
		if (folderId === null) return files.filter(f => f.folderId === null && !f.isArchived).length;
		return files.filter(f => f.folderId === folderId && !f.isArchived).length;
	}

	// === 파일 ===
	function openFileModal(file: AudioFile) {
		selectedFile = file;
		editName = file.fileName;
		editDescription = file.description || '';
		editTags = [...file.tags];
		showFileModal = true;
	}

	function saveFile() {
		if (!selectedFile || !editName.trim()) return;
		files = files.map(f => f.id === selectedFile!.id ? {
			...f,
			fileName: editName.trim(),
			description: editDescription.trim(),
			tags: editTags,
			updatedAt: new Date().toISOString().split('T')[0]
		} : f);
		toast.add('저장되었습니다', 'success');
		showFileModal = false;
	}

	function toggleFavorite(id: string, e?: Event) {
		e?.stopPropagation();
		files = files.map(f => f.id === id ? { ...f, isStarred: !f.isStarred } : f);
	}

	function archiveFile(id: string) {
		files = files.map(f => f.id === id ? { ...f, isArchived: true } : f);
		toast.add('보관함으로 이동했습니다', 'success');
		showFileModal = false;
	}

	function restoreFile(id: string) {
		files = files.map(f => f.id === id ? { ...f, isArchived: false } : f);
		toast.add('복원되었습니다', 'success');
		showFileModal = false;
	}

	function deleteFile(id: string) {
		if (!confirm('파일을 완전히 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return;
		files = files.filter(f => f.id !== id);
		toast.add('삭제되었습니다', 'success');
		showFileModal = false;
	}

	function duplicateFile(file: AudioFile) {
		const newFile: AudioFile = {
			...file,
			id: `file_${Date.now()}`,
			fileName: `${file.fileName.replace(/\.[^.]+$/, '')}_복사.${file.format}`,
			uploadedAt: new Date().toISOString().split('T')[0],
			updatedAt: new Date().toISOString().split('T')[0],
			isStarred: false,
			linkedTrackId: undefined
		};
		files = [newFile, ...files];
		toast.add('파일이 복제되었습니다', 'success');
	}

	function downloadFile(file: AudioFile) {
		if (file.fileUrl) {
			const a = document.createElement('a');
			a.href = file.fileUrl;
			a.download = file.fileName;
			a.click();
		}
		toast.add('다운로드를 시작합니다', 'success');
	}

	function openMoveModal(file: AudioFile, e?: Event) {
		e?.stopPropagation();
		moveTargetFile = file;
		showMoveModal = true;
	}

	function moveFile(folderId: string | null) {
		if (!moveTargetFile) return;
		files = files.map(f => f.id === moveTargetFile!.id ? { ...f, folderId } : f);
		toast.add('이동되었습니다', 'success');
		showMoveModal = false;
		moveTargetFile = null;
	}

	function registerAsTrack(file: AudioFile, e?: Event) {
		e?.stopPropagation();
		toast.add(`"${file.fileName}"을 트랙으로 등록합니다`, 'success');
	}

	// === 다중 선택 ===
	function toggleSelect(id: string, e: Event) {
		e.stopPropagation();
		const newSet = new Set(selectedIds);
		if (newSet.has(id)) newSet.delete(id);
		else newSet.add(id);
		selectedIds = newSet;
	}

	function selectAll() {
		if (selectedIds.size === filteredFiles.length) {
			selectedIds = new Set();
				} else {
			selectedIds = new Set(filteredFiles.map(f => f.id));
		}
	}

	function clearSelection() {
		selectedIds = new Set();
		selectMode = false;
	}

	function bulkFavorite() {
		files = files.map(f => selectedIds.has(f.id) ? { ...f, isStarred: true } : f);
		toast.add(`${selectedIds.size}개 파일을 즐겨찾기에 추가했습니다`, 'success');
		clearSelection();
	}

	function bulkArchive() {
		if (!confirm(`${selectedIds.size}개 파일을 보관함으로 이동하시겠습니까?`)) return;
		files = files.map(f => selectedIds.has(f.id) ? { ...f, isArchived: true } : f);
		toast.add(`${selectedIds.size}개 파일을 보관함으로 이동했습니다`, 'success');
		clearSelection();
	}

	function bulkRestore() {
		files = files.map(f => selectedIds.has(f.id) ? { ...f, isArchived: false } : f);
		toast.add(`${selectedIds.size}개 파일을 복원했습니다`, 'success');
		clearSelection();
	}

	function bulkDelete() {
		if (!confirm(`${selectedIds.size}개 파일을 완전히 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;
		files = files.filter(f => !selectedIds.has(f.id));
		toast.add(`${selectedIds.size}개 파일을 삭제했습니다`, 'success');
		clearSelection();
	}

	function openBulkMoveModal() {
		showBulkMoveModal = true;
	}

	function bulkMove(folderId: string | null) {
		files = files.map(f => selectedIds.has(f.id) ? { ...f, folderId } : f);
		toast.add(`${selectedIds.size}개 파일을 이동했습니다`, 'success');
		showBulkMoveModal = false;
		clearSelection();
	}

	// === 재생 ===
	function togglePlay(file: AudioFile, e: Event) {
		e.stopPropagation();
		if (playingId === file.id) {
			audioElement?.pause();
			playingId = null;
		} else {
			if (audioElement) audioElement.pause();
			audioElement = new Audio(file.fileUrl || '');
			audioElement.play().catch(() => {});
			audioElement.onended = () => { playingId = null; };
			playingId = file.id;
		}
	}

	// === 업로드 ===
	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const droppedFiles = e.dataTransfer?.files;
		if (droppedFiles) uploadFiles(Array.from(droppedFiles));
	}

	function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) uploadFiles(Array.from(input.files));
		input.value = '';
	}

	function uploadFiles(fileList: File[]) {
		for (const file of fileList) {
			if (!file.type.startsWith('audio/')) {
				toast.add(`${file.name}: 오디오 파일만 가능`, 'error');
				continue;
			}
			
			const item: UploadItem = {
				id: `up_${Date.now()}_${Math.random()}`,
				file,
				status: 'uploading',
				progress: 0
			};
			uploadItems = [...uploadItems, item];
			showUploadProgress = true;
			
			let p = 0;
			const iv = setInterval(() => {
				p += Math.random() * 20;
				if (p >= 100) {
					clearInterval(iv);
					item.status = 'success';
					item.progress = 100;
					
					files = [{
						id: `file_${Date.now()}`,
						fileName: file.name,
						originalName: file.name,
						folderId: selectedFolderId,
						fileUrl: URL.createObjectURL(file),
						fileSize: file.size,
						duration: Math.floor(Math.random() * 240) + 60,
						format: file.name.split('.').pop() || 'mp3',
						tags: [],
						uploadedBy: 'El',
						uploadedAt: new Date().toISOString().split('T')[0],
						updatedAt: new Date().toISOString().split('T')[0],
						isStarred: false,
						isArchived: false
					}, ...files];
					
					toast.add(`${file.name} 업로드 완료`, 'success');
				}
				item.progress = Math.min(p, 100);
			}, 150);
		}
	}

	// === 이미지 색상 추출 ===
	let colorDropOver = $state(false);
	
	// 두 색상 간의 거리 계산 (유사도 판단용)
	function colorDistance(hex1: string, hex2: string): number {
		const parse = (h: string) => [
			parseInt(h.slice(1, 3), 16),
			parseInt(h.slice(3, 5), 16),
			parseInt(h.slice(5, 7), 16)
		];
		const [r1, g1, b1] = parse(hex1);
		const [r2, g2, b2] = parse(hex2);
		return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
	}

	async function extractColors(file: File) {
		if (!file.type.startsWith('image/')) return;
		extractingColors = true;
		
		try {
			const img = new window.Image();
			const url = URL.createObjectURL(file);
			
			await new Promise<void>((resolve, reject) => {
				img.onload = () => resolve();
				img.onerror = () => reject();
				img.src = url;
			});

			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// 고해상도로 분석
			canvas.width = canvas.height = 200;
			ctx.drawImage(img, 0, 0, 200, 200);

			const data = ctx.getImageData(0, 0, 200, 200).data;
			const colorMap = new Map<string, number>();
			
			for (let i = 0; i < data.length; i += 4) {
				const [r, g, b, a] = [data[i], data[i+1], data[i+2], data[i+3]];
				if (a < 128) continue;
				const brightness = (r + g + b) / 3;
				if (brightness < 15 || brightness > 245) continue;
				
				// 양자화 (더 정밀하게)
				const quantize = (v: number) => Math.round(v / 16) * 16;
				const hex = `#${[r,g,b].map(x => Math.min(255, quantize(x)).toString(16).padStart(2,'0')).join('')}`;
				colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
			}

			// 이미 사용 중인 커스텀 색상 수집
			const usedHexColors = new Set<string>();
			folders.forEach(f => {
				if (f.color?.startsWith('#')) {
					usedHexColors.add(f.color.toLowerCase());
				}
			});
			if (editingFolderId) {
				const editingFolder = folders.find(f => f.id === editingFolderId);
				if (editingFolder?.color?.startsWith('#')) {
					usedHexColors.delete(editingFolder.color.toLowerCase());
				}
			}

			// 빈도순 정렬
			const sortedColors = Array.from(colorMap.entries())
				.sort((a, b) => b[1] - a[1])
				.map(([c]) => c)
				.filter(c => !usedHexColors.has(c.toLowerCase()));

			// 시각적으로 다양한 색상만 선택 (최소 거리 40 이상)
			const diverseColors: string[] = [];
			const MIN_DISTANCE = 40;
			
			for (const color of sortedColors) {
				if (diverseColors.length >= 24) break;
				const isTooSimilar = diverseColors.some(c => colorDistance(color, c) < MIN_DISTANCE);
				if (!isTooSimilar) {
					diverseColors.push(color);
				}
			}

			extractedColors = diverseColors;

			if (extractedColors.length) {
				customColor = extractedColors[0];
				folderColor = 'custom';
			}
		} finally {
			extractingColors = false;
		}
	}

	function handleColorImageDrop(e: DragEvent) {
		e.preventDefault();
		colorDropOver = false;
		const file = e.dataTransfer?.files?.[0];
		if (file?.type.startsWith('image/')) {
			extractColors(file);
		}
	}

	// === 필터 리셋 ===
	function resetFilters() {
		selectedFolderId = null;
		searchQuery = '';
		showOnlyFavorites = false;
		showOnlyUnfiled = false;
		showArchived = false;
		selectedTag = null;
	}

	// === 빠른 접근 ===
	function showRecent() {
		resetFilters();
		sortBy = 'date';
		sortAsc = false;
	}

	// === 드롭다운 닫기 ===
	function closeDropdowns() {
		showFolderDropdown = false;
		showSortDropdown = false;
		showTagDropdown = false;
		showQuickDropdown = false;
	}
</script>

<svelte:head>
	<title>음원 관리 | Sugar Rush</title>
</svelte:head>

<svelte:window onclick={closeDropdowns} />

<PageContent padding="pt-0 pb-20">
	<PageHeader 
		title="음원 관리" 
		description="음원 파일을 폴더별로 정리합니다"
		actions={[
			{ icon: FolderPlus, label: '폴더', onclick: () => openFolderModal() },
			{ icon: Upload, label: '업로드', onclick: () => document.getElementById('main-upload')?.click() }
		]}
	/>

	<input id="main-upload" type="file" accept="audio/*" multiple class="hidden" onchange={handleFileInput} />

	<!-- 필터 바 -->
	<div class="bg-surface-1 rounded-lg border border-border-subtle p-4 mb-6">
		<div class="flex flex-col lg:flex-row gap-4">
			<!-- 검색 -->
			<div class="relative flex-1">
				<Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="파일명, 태그로 검색..."
					class="w-full h-10 pl-10 pr-10 bg-surface-2 border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink"
				/>
				{#if searchQuery}
					<button type="button" onclick={() => searchQuery = ''} class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-base">
						<X size={16} />
					</button>
				{/if}
			</div>

			<!-- 필터 그룹 -->
			<div class="flex flex-wrap gap-2">
				<!-- 빠른 접근 -->
				<div class="relative">
					<button
						type="button"
						onclick={(e) => { e.stopPropagation(); showQuickDropdown = !showQuickDropdown; closeDropdowns(); showQuickDropdown = !showQuickDropdown; }}
						class="h-10 px-3 bg-surface-2 border border-border-subtle rounded-lg text-sm flex items-center gap-2 hover:border-hover-point transition-colors"
					>
						<Clock size={14} class="text-text-muted" />
						<span class="hidden sm:inline">빠른 접근</span>
						<ChevronDown size={14} class="text-text-muted" />
					</button>
					
					{#if showQuickDropdown}
						<div class="absolute top-12 left-0 w-48 bg-surface-1 border border-border-subtle rounded-lg shadow-lg z-50">
							<div class="p-1">
								<button
									type="button"
									onclick={() => { showRecent(); showQuickDropdown = false; }}
									class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-surface-2 transition-colors"
								>
									<Clock size={14} class="text-text-muted" />
									<span class="flex-1 text-sm">최근 업로드</span>
									{#if recentFiles > 0}
										<span class="text-xs text-brand-pink">{recentFiles}</span>
									{/if}
								</button>
								<button
									type="button"
									onclick={() => { resetFilters(); showOnlyFavorites = true; showQuickDropdown = false; }}
									class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-surface-2 transition-colors"
								>
									<Star size={14} class="text-yellow-500" />
									<span class="flex-1 text-sm">즐겨찾기</span>
									<span class="text-xs text-text-muted">{stats.favoriteCount}</span>
								</button>
								<button
									type="button"
									onclick={() => { resetFilters(); showOnlyUnfiled = true; showQuickDropdown = false; }}
									class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-surface-2 transition-colors"
								>
									<FileAudio size={14} class="text-text-muted" />
									<span class="flex-1 text-sm">미분류</span>
									<span class="text-xs text-text-muted">{stats.unfiledCount}</span>
								</button>
								<div class="my-1 border-t border-border-subtle"></div>
								<button
									type="button"
									onclick={() => { resetFilters(); showArchived = true; showQuickDropdown = false; }}
									class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-surface-2 transition-colors"
								>
									<Archive size={14} class="text-text-muted" />
									<span class="flex-1 text-sm">보관함</span>
									<span class="text-xs text-text-muted">{stats.archivedCount}</span>
								</button>
							</div>
						</div>
					{/if}
				</div>

				<!-- 폴더 필터 -->
				<div class="relative">
					<button
						type="button"
						onclick={(e) => { e.stopPropagation(); closeDropdowns(); showFolderDropdown = !showFolderDropdown; }}
						class="h-10 px-3 bg-surface-2 border border-border-subtle rounded-lg text-sm flex items-center gap-2 hover:border-hover-point transition-colors {selectedFolderId ? 'border-brand-pink/50' : ''}"
					>
						{#if selectedFolderId}
							{@const folder = folders.find(f => f.id === selectedFolderId)}
							<Folder size={14} style="color: {getFolderColor(folder?.color || 'default')}" />
							<span class="truncate max-w-[80px] hidden sm:inline">{folder?.name}</span>
						{:else}
							<Folder size={14} class="text-text-muted" />
							<span class="hidden sm:inline">폴더</span>
						{/if}
						<ChevronDown size={14} class="text-text-muted" />
					</button>
					
					{#if showFolderDropdown}
						<div class="absolute top-12 left-0 w-64 bg-surface-1 border border-border-subtle rounded-lg shadow-lg z-50 overflow-hidden">
							<!-- 고정: 새 폴더 만들기 -->
							<div class="p-2 border-b border-border-subtle">
								<button
									type="button"
									onclick={() => { openFolderModal(); showFolderDropdown = false; }}
									class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-brand-pink hover:bg-brand-pink/5 transition-colors"
								>
									<Plus size={16} />
									<span class="text-sm font-medium">새 폴더 만들기</span>
								</button>
							</div>
							
							<!-- 고정: 전체 파일, 미분류 -->
							<div class="p-2 border-b border-border-subtle">
								<button
									type="button"
									onclick={() => { selectedFolderId = null; showOnlyUnfiled = false; showFolderDropdown = false; }}
									class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors {selectedFolderId === null && !showOnlyUnfiled ? 'bg-brand-pink/10 text-brand-pink' : 'hover:bg-surface-2'}"
								>
									<FileAudio size={16} />
									<span class="flex-1 text-sm">전체 파일</span>
									<span class="text-xs text-text-muted">{stats.totalFiles}</span>
									{#if selectedFolderId === null && !showOnlyUnfiled}
										<Check size={14} />
									{/if}
								</button>
								
								<button
									type="button"
									onclick={() => { selectedFolderId = null; showOnlyUnfiled = true; showFolderDropdown = false; }}
									class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors {showOnlyUnfiled ? 'bg-brand-pink/10 text-brand-pink' : 'hover:bg-surface-2'}"
								>
									<FileAudio size={16} class="text-text-muted" />
									<span class="flex-1 text-sm">미분류</span>
									<span class="text-xs text-text-muted">{stats.unfiledCount}</span>
									{#if showOnlyUnfiled}
										<Check size={14} />
									{/if}
								</button>
							</div>
							
							<!-- 폴더 정렬 옵션 -->
							{#if folders.length > 0}
								<div class="px-3 py-2 border-b border-border-subtle flex items-center gap-2 text-xs text-text-muted">
									{#each Object.entries(folderSortLabels) as [key, label]}
										<button
											type="button"
											onclick={(e) => { e.stopPropagation(); folderSortBy = key as 'name' | 'created' | 'updated'; }}
											class="px-2 py-1 rounded transition-colors {folderSortBy === key ? 'bg-brand-pink/10 text-brand-pink' : 'hover:bg-surface-2'}"
										>
											{label}
										</button>
									{/each}
									<button
										type="button"
										onclick={(e) => { e.stopPropagation(); folderSortAsc = !folderSortAsc; }}
										class="ml-auto p-1 rounded transition-colors hover:bg-surface-2"
										aria-label={folderSortAsc ? '내림차순으로 변경' : '오름차순으로 변경'}
										title={folderSortAsc ? '오름차순' : '내림차순'}
									>
										<ArrowUpDown size={14} class="transition-transform {folderSortAsc ? '' : 'rotate-180'}" />
									</button>
								</div>
							{/if}
							
							<!-- 스크롤 가능한 폴더 목록 -->
							<div class="p-2 max-h-48 overflow-y-auto custom-list-scrollbar">
								{#each sortedFolders as folder}
									<div class="group relative">
										<button
											type="button"
											onclick={() => { selectedFolderId = folder.id; showOnlyUnfiled = false; showFolderDropdown = false; }}
											class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors {selectedFolderId === folder.id ? 'bg-brand-pink/10 text-brand-pink' : 'hover:bg-surface-2'}"
										>
											<Folder size={16} style="color: {selectedFolderId === folder.id ? 'currentColor' : getFolderColor(folder.color || 'default')}" />
											<span class="flex-1 text-sm truncate">{folder.name}</span>
											<span class="text-xs text-text-muted">{getFileCount(folder.id)}</span>
											{#if selectedFolderId === folder.id}
												<Check size={14} />
											{/if}
										</button>
										<div class="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
											<button type="button" onclick={(e) => { e.stopPropagation(); openFolderModal(folder.id); showFolderDropdown = false; }} class="p-1 rounded hover:bg-surface-1" aria-label="편집">
												<Edit2 size={12} class="text-text-muted" />
											</button>
											<button type="button" onclick={(e) => { e.stopPropagation(); deleteFolder(folder.id); showFolderDropdown = false; }} class="p-1 rounded hover:bg-surface-1" aria-label="삭제">
												<Trash2 size={12} class="text-text-muted hover:text-red-400" />
											</button>
										</div>
									</div>
								{/each}
								{#if folders.length === 0}
									<p class="text-sm text-text-muted text-center py-4">폴더가 없습니다</p>
								{/if}
							</div>
						</div>
					{/if}
				</div>

				<!-- 태그 필터 -->
				{#if allTags.length > 0}
					<div class="relative">
						<button
							type="button"
							onclick={(e) => { e.stopPropagation(); closeDropdowns(); showTagDropdown = !showTagDropdown; }}
							class="h-10 px-3 bg-surface-2 border border-border-subtle rounded-lg text-sm flex items-center gap-2 hover:border-hover-point transition-colors {selectedTag ? 'border-brand-pink/50' : ''}"
						>
							<Tag size={14} class={selectedTag ? 'text-brand-pink' : 'text-text-muted'} />
							<span class="hidden sm:inline">{selectedTag || '태그'}</span>
							<ChevronDown size={14} class="text-text-muted" />
						</button>
						
						{#if showTagDropdown}
							<div class="absolute top-12 left-0 w-48 bg-surface-1 border border-border-subtle rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto custom-list-scrollbar">
								<div class="p-1">
									<button
										type="button"
										onclick={() => { selectedTag = null; showTagDropdown = false; }}
										class="w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors {selectedTag === null ? 'bg-brand-pink/10 text-brand-pink' : 'hover:bg-surface-2'}"
									>
										<span class="text-sm">전체</span>
										{#if selectedTag === null}
											<Check size={14} class="ml-auto" />
										{/if}
									</button>
									<div class="my-1 border-t border-border-subtle"></div>
									{#each allTags as tag}
										<button
											type="button"
											onclick={() => { selectedTag = tag; showTagDropdown = false; }}
											class="w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors {selectedTag === tag ? 'bg-brand-pink/10 text-brand-pink' : 'hover:bg-surface-2'}"
										>
											<span class="text-sm">{tag}</span>
											{#if selectedTag === tag}
												<Check size={14} class="ml-auto" />
											{/if}
										</button>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/if}

				<!-- 즐겨찾기 필터 -->
				<button
					type="button"
					onclick={() => showOnlyFavorites = !showOnlyFavorites}
					class="h-10 px-3 rounded-lg border text-sm flex items-center gap-2 transition-colors {showOnlyFavorites ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : 'bg-surface-2 border-border-subtle hover:border-hover-point text-text-base'}"
					aria-label="즐겨찾기 필터"
				>
					<Star size={14} class={showOnlyFavorites ? 'fill-current' : ''} />
					<span class="hidden sm:inline">{stats.favoriteCount}</span>
				</button>

				<!-- 정렬 -->
				<div class="relative">
					<button
						type="button"
						onclick={(e) => { e.stopPropagation(); closeDropdowns(); showSortDropdown = !showSortDropdown; }}
						class="h-10 px-3 bg-surface-2 border border-border-subtle rounded-lg text-sm flex items-center gap-2 hover:border-hover-point transition-colors"
					>
						<ArrowUpDown size={14} class="text-text-muted" />
						<span class="hidden sm:inline">{sortLabels[sortBy]}</span>
						<span class="text-xs text-text-muted">{sortAsc ? '↑' : '↓'}</span>
					</button>
					
					{#if showSortDropdown}
						<div class="absolute top-12 right-0 w-40 bg-surface-1 border border-border-subtle rounded-lg shadow-lg z-50">
							<div class="p-1">
								{#each Object.entries(sortLabels) as [key, label]}
									<button
										type="button"
										onclick={() => { 
											if (sortBy === key) sortAsc = !sortAsc;
											else { sortBy = key as 'date' | 'name' | 'size' | 'duration'; sortAsc = false; }
											showSortDropdown = false; 
										}}
										class="w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors {sortBy === key ? 'bg-brand-pink/10 text-brand-pink' : 'hover:bg-surface-2'}"
									>
										<span>{label}</span>
										{#if sortBy === key}
											<span class="text-xs">{sortAsc ? '오름차순' : '내림차순'}</span>
										{/if}
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<!-- 선택 모드 -->
				<button
					type="button"
					onclick={() => { selectMode = !selectMode; if (!selectMode) selectedIds = new Set(); }}
					class="h-10 px-3 rounded-lg border text-sm flex items-center gap-2 transition-colors {selectMode ? 'bg-brand-pink/10 border-brand-pink/50 text-brand-pink' : 'bg-surface-2 border-border-subtle hover:border-hover-point text-text-base'}"
				>
					<CheckSquare size={14} />
					<span class="hidden sm:inline">선택</span>
				</button>
			</div>
		</div>

		<!-- 활성 필터 표시 + 통계 -->
		<div class="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border-subtle text-sm">
			<div class="flex items-center gap-2 text-text-muted">
				<FileAudio size={14} />
				<span>{filteredFiles.length}개</span>
			</div>
			<div class="flex items-center gap-2 text-text-muted">
				<HardDrive size={14} />
				<span>{formatFileSize(stats.totalSize)}</span>
			</div>
			
			{#if showArchived || showOnlyFavorites || showOnlyUnfiled || selectedFolderId || selectedTag}
				<div class="flex-1"></div>
				<button type="button" onclick={resetFilters} class="text-brand-pink hover:underline text-sm">
					필터 초기화
				</button>
			{/if}
		</div>
	</div>

	<!-- 선택 모드 툴바 -->
	{#if selectMode && selectedIds.size > 0}
		<div class="bg-brand-pink/10 border border-brand-pink/30 rounded-lg p-3 mb-6 flex flex-wrap items-center gap-3">
			<span class="text-sm font-medium text-brand-pink">{selectedIds.size}개 선택됨</span>
			<div class="flex-1"></div>
			<div class="flex flex-wrap gap-2">
				{#if showArchived}
					<button type="button" onclick={bulkRestore} class="px-3 py-1.5 bg-surface-1 border border-border-subtle rounded-lg text-sm hover:bg-surface-2 flex items-center gap-1.5 transition-colors">
						<RotateCcw size={14} /> 복원
					</button>
					<button type="button" onclick={bulkDelete} class="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/20 flex items-center gap-1.5 transition-colors">
						<Trash2 size={14} /> 삭제
					</button>
				{:else}
					<button type="button" onclick={bulkFavorite} class="px-3 py-1.5 bg-surface-1 border border-border-subtle rounded-lg text-sm hover:bg-surface-2 flex items-center gap-1.5 transition-colors">
						<Star size={14} /> 즐겨찾기
					</button>
					<button type="button" onclick={openBulkMoveModal} class="px-3 py-1.5 bg-surface-1 border border-border-subtle rounded-lg text-sm hover:bg-surface-2 flex items-center gap-1.5 transition-colors">
						<FolderOpen size={14} /> 이동
					</button>
					<button type="button" onclick={bulkArchive} class="px-3 py-1.5 bg-surface-1 border border-border-subtle rounded-lg text-sm hover:bg-surface-2 flex items-center gap-1.5 transition-colors">
						<Archive size={14} /> 보관
					</button>
				{/if}
			</div>
			<button type="button" onclick={clearSelection} class="p-1.5 text-text-muted hover:text-text-base">
				<X size={16} />
			</button>
		</div>
	{/if}

	<!-- 업로드 드롭존 -->
	{#if !showArchived}
		<div
			class="mb-6 border-2 border-dashed rounded-lg p-6 text-center transition-all {dragOver ? 'border-brand-pink bg-brand-pink/5' : 'border-border-subtle'}"
			role="region"
			aria-label="파일 업로드 영역"
			ondragover={(e) => { e.preventDefault(); dragOver = true; }}
			ondragleave={() => dragOver = false}
			ondrop={handleDrop}
		>
			<Upload size={24} class="mx-auto mb-2 text-text-muted" />
			<p class="text-sm text-text-muted">
				파일을 드래그하거나 
				<button type="button" onclick={() => document.getElementById('main-upload')?.click()} class="text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors">찾아보기</button>
			</p>
		</div>
	{/if}

	<!-- 업로드 진행 -->
	{#if showUploadProgress && uploadItems.length > 0}
		<div class="mb-6 bg-surface-1 rounded-lg border border-border-subtle p-4">
			<div class="flex items-center justify-between mb-3">
				<span class="text-sm font-medium text-text-strong">업로드 진행</span>
				<button type="button" onclick={() => { uploadItems = []; showUploadProgress = false; }} class="text-text-muted hover:text-text-base">
					<X size={16} />
				</button>
	</div>
			<div class="space-y-2 max-h-32 overflow-y-auto custom-list-scrollbar">
				{#each uploadItems.slice(-5) as item}
					<div class="flex items-center gap-3">
						<FileAudio size={14} class="text-text-muted flex-shrink-0" />
						<div class="flex-1 min-w-0">
							<p class="text-sm truncate">{item.file.name}</p>
							<div class="h-1.5 bg-surface-2 rounded-full mt-1">
								<div class="h-full bg-brand-pink rounded-full transition-all" style="width: {item.progress}%"></div>
							</div>
						</div>
						<span class="text-xs text-text-muted w-10 text-right">{Math.round(item.progress)}%</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- 현재 위치 표시 -->
	{#if selectedFolderId || searchQuery || showOnlyFavorites || showOnlyUnfiled || showArchived || selectedTag}
		<div class="flex items-center gap-2 mb-4 text-sm">
			<button type="button" onclick={resetFilters} class="text-text-muted hover:text-text-base">
				전체
			</button>
			<ChevronRight size={14} class="text-text-muted" />
			{#if showArchived}
				<span class="flex items-center gap-1.5 text-text-strong font-medium">
					<Archive size={14} />
					보관함
				</span>
			{:else if showOnlyFavorites}
				<span class="flex items-center gap-1.5 text-text-strong font-medium">
					<Star size={14} class="text-yellow-500" />
					즐겨찾기
				</span>
			{:else if showOnlyUnfiled}
				<span class="text-text-strong font-medium">미분류</span>
			{:else if searchQuery}
				<span class="text-text-strong font-medium">검색: {searchQuery}</span>
			{:else if selectedTag}
				<span class="flex items-center gap-1.5 text-text-strong font-medium">
					<Tag size={14} />
					{selectedTag}
				</span>
			{:else if currentFolder}
				<span class="flex items-center gap-1.5 text-text-strong font-medium">
					<Folder size={14} style="color: {getFolderColor(currentFolder.color || 'default')}" />
					{currentFolder.name}
				</span>
			{/if}
			<span class="text-text-muted">({filteredFiles.length})</span>
		</div>
	{/if}

	<!-- 파일 목록 -->
	{#if filteredFiles.length > 0}
		<!-- 전체 선택 -->
		{#if selectMode}
			<div class="flex items-center gap-3 mb-3">
				<button type="button" onclick={selectAll} class="flex items-center gap-2 text-sm text-text-muted hover:text-text-base">
					{#if selectedIds.size === filteredFiles.length}
						<CheckSquare size={16} class="text-brand-pink" />
						<span>전체 해제</span>
					{:else}
						<Square size={16} />
						<span>전체 선택</span>
					{/if}
				</button>
			</div>
		{/if}

		<!-- 데스크톱: 테이블 -->
		<div class="hidden md:block bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
			<table class="w-full">
				<thead class="bg-bg text-xs text-text-muted border-b border-border-subtle">
					<tr>
						{#if selectMode}
							<th class="px-4 py-3 w-10"></th>
						{/if}
						<th class="px-4 py-3 text-left font-medium w-12"></th>
						<th class="px-4 py-3 text-left font-medium">파일명</th>
						<th class="px-4 py-3 text-left font-medium w-20">포맷</th>
						<th class="px-4 py-3 text-right font-medium w-20">길이</th>
						<th class="px-4 py-3 text-right font-medium w-24">크기</th>
						<th class="px-4 py-3 text-center font-medium w-32">액션</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border-subtle">
					{#each filteredFiles as file}
						<tr class="hover:bg-surface-2/50 transition-colors cursor-pointer" onclick={() => !selectMode && openFileModal(file)}>
							{#if selectMode}
								<td class="px-4 py-3">
									<button type="button" onclick={(e) => toggleSelect(file.id, e)} class="p-1">
										{#if selectedIds.has(file.id)}
											<CheckSquare size={18} class="text-brand-pink" />
										{:else}
											<Square size={18} class="text-text-muted" />
										{/if}
									</button>
								</td>
							{/if}
							<td class="px-4 py-3">
					<button
						type="button"
									onclick={(e) => togglePlay(file, e)}
									class="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center hover:bg-brand-pink hover:text-white transition-colors"
								>
									{#if playingId === file.id}
										<Pause size={14} />
									{:else}
										<Play size={14} class="ml-0.5" />
									{/if}
					</button>
							</td>
							<td class="px-4 py-3">
								<div class="flex items-center gap-2">
									<span class="font-medium text-text-strong truncate max-w-[280px]">{file.fileName}</span>
									{#if file.isStarred}
										<Star size={12} class="text-yellow-500 fill-current flex-shrink-0" />
									{/if}
									{#if file.linkedTrackId}
										<Link size={12} class="text-brand-pink flex-shrink-0" />
				{/if}
			</div>
								{#if file.tags.length > 0}
									<div class="flex gap-1 mt-1">
										{#each file.tags.slice(0, 2) as tag}
											<span class="text-xs px-1.5 py-0.5 rounded bg-bg text-text-muted">{tag}</span>
										{/each}
										{#if file.tags.length > 2}
											<span class="text-xs text-text-muted">+{file.tags.length - 2}</span>
										{/if}
									</div>
								{/if}
							</td>
							<td class="px-4 py-3">
								<span class="text-xs font-medium uppercase {getFormatColor(file.format)}">{file.format}</span>
							</td>
							<td class="px-4 py-3 text-right text-sm text-text-muted">{formatDuration(file.duration)}</td>
							<td class="px-4 py-3 text-right text-sm text-text-muted">{formatFileSize(file.fileSize)}</td>
							<td class="px-4 py-3">
								<div class="flex items-center justify-center gap-1">
									{#if showArchived}
										<button type="button" onclick={(e) => { e.stopPropagation(); restoreFile(file.id); }} class="p-2 rounded-lg hover:bg-surface-2 transition-colors" aria-label="복원">
											<RotateCcw size={14} class="text-text-muted" />
										</button>
									{:else}
										<button type="button" onclick={(e) => toggleFavorite(file.id, e)} class="p-2 rounded-lg hover:bg-surface-2 transition-colors" aria-label="즐겨찾기">
											<Star size={14} class={file.isStarred ? 'text-yellow-500 fill-current' : 'text-text-muted'} />
										</button>
										<button type="button" onclick={(e) => openMoveModal(file, e)} class="p-2 rounded-lg hover:bg-surface-2 transition-colors" aria-label="폴더 이동">
											<FolderOpen size={14} class="text-text-muted" />
										</button>
									{/if}
									<button type="button" onclick={(e) => { e.stopPropagation(); downloadFile(file); }} class="p-2 rounded-lg hover:bg-surface-2 transition-colors" aria-label="다운로드">
										<Download size={14} class="text-text-muted" />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- 모바일: 카드 -->
		<div class="md:hidden space-y-3">
			{#each filteredFiles as file}
				<div
					class="bg-surface-1 rounded-lg border border-border-subtle p-4 active:bg-surface-2 transition-colors {selectMode ? '' : 'cursor-pointer'}"
					onclick={() => !selectMode && openFileModal(file)}
					role="button"
					tabindex="0"
					onkeydown={(e) => { if (e.key === 'Enter' && !selectMode) openFileModal(file); }}
				>
					<div class="flex items-start gap-3">
						{#if selectMode}
							<button type="button" onclick={(e) => toggleSelect(file.id, e)} class="mt-1">
								{#if selectedIds.has(file.id)}
									<CheckSquare size={20} class="text-brand-pink" />
								{:else}
									<Square size={20} class="text-text-muted" />
								{/if}
							</button>
						{:else}
							<button
								type="button"
								onclick={(e) => togglePlay(file, e)}
								class="w-11 h-11 rounded-full bg-surface-2 flex items-center justify-center hover:bg-brand-pink hover:text-white transition-colors flex-shrink-0"
							>
								{#if playingId === file.id}
									<Pause size={16} />
								{:else}
									<Play size={16} class="ml-0.5" />
								{/if}
							</button>
								{/if}
								<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<span class="font-medium text-text-strong truncate">{file.fileName}</span>
								{#if file.isStarred}
									<Star size={12} class="text-yellow-500 fill-current flex-shrink-0" />
								{/if}
								</div>
							<div class="flex items-center gap-3 text-xs text-text-muted">
								<span class="uppercase font-medium {getFormatColor(file.format)}">{file.format}</span>
								<span>{formatDuration(file.duration)}</span>
								<span>{formatFileSize(file.fileSize)}</span>
							</div>
						</div>
						{#if !selectMode}
							<button type="button" onclick={(e) => toggleFavorite(file.id, e)} class="p-2 -mr-2" aria-label="즐겨찾기">
								<Star size={18} class={file.isStarred ? 'text-yellow-500 fill-current' : 'text-text-muted'} />
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="text-center py-16 bg-surface-1 rounded-lg border border-border-subtle">
			{#if showArchived}
				<Archive size={48} class="mx-auto mb-4 text-text-muted opacity-30" />
				<p class="text-text-muted">보관함이 비어있습니다</p>
			{:else}
				<FileAudio size={48} class="mx-auto mb-4 text-text-muted opacity-30" />
				<p class="text-text-muted mb-2">
					{#if searchQuery}
						검색 결과가 없습니다
					{:else if showOnlyFavorites}
						즐겨찾기한 파일이 없습니다
					{:else if showOnlyUnfiled}
						미분류 파일이 없습니다
					{:else if selectedTag}
						이 태그의 파일이 없습니다
					{:else if currentFolder}
						이 폴더에 파일이 없습니다
					{:else}
						아직 파일이 없습니다
					{/if}
				</p>
							<button
								type="button"
					onclick={() => document.getElementById('main-upload')?.click()}
					class="mt-4 px-5 py-2.5 bg-brand-pink text-white text-sm font-medium rounded-lg hover:bg-brand-pink/90 transition-colors inline-flex items-center gap-2"
							>
					<Upload size={16} /> 파일 업로드
							</button>
			{/if}
						</div>
	{/if}
</PageContent>

<!-- 폴더 이동 모달 (단일) -->
{#if showMoveModal && moveTargetFile}
	<div 
		class="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={() => { showMoveModal = false; moveTargetFile = null; }}
		onkeydown={(e) => { if (e.key === 'Escape') { showMoveModal = false; moveTargetFile = null; }}}
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div 
			class="bg-surface-1 rounded-t-xl sm:rounded-lg border border-border-subtle w-full sm:w-96 max-h-[70vh] overflow-hidden"
			role="document"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
				<div>
					<h2 class="text-base font-semibold text-text-strong">폴더 이동</h2>
					<p class="text-xs text-text-muted mt-0.5 truncate max-w-[280px]">{moveTargetFile.fileName}</p>
							</div>
				<button type="button" onclick={() => { showMoveModal = false; moveTargetFile = null; }} class="text-text-muted hover:text-text-base">
					<X size={18} />
				</button>
			</div>
			<!-- 고정: 미분류 -->
			<div class="p-2 border-b border-border-subtle">
				<button
					type="button"
					onclick={() => moveFile(null)}
					class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors {moveTargetFile.folderId === null ? 'bg-brand-pink/10 text-brand-pink' : 'hover:bg-surface-2'}"
				>
					<FileAudio size={18} />
					<span class="flex-1 text-sm font-medium">미분류</span>
					<span class="text-xs text-text-muted">{getFileCount(null)}</span>
					{#if moveTargetFile.folderId === null}
						<Check size={16} />
						{/if}
				</button>
					</div>
			<!-- 스크롤 가능한 폴더 목록 -->
			<div class="p-2 max-h-60 overflow-y-auto custom-list-scrollbar">
				{#each sortedFolders as folder}
					<button
						type="button"
						onclick={() => moveFile(folder.id)}
						class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors {moveTargetFile.folderId === folder.id ? 'bg-brand-pink/10 text-brand-pink' : 'hover:bg-surface-2'}"
					>
						<Folder size={18} style="color: {moveTargetFile.folderId === folder.id ? 'currentColor' : getFolderColor(folder.color || 'default')}" />
						<span class="flex-1 text-sm font-medium truncate">{folder.name}</span>
						<span class="text-xs text-text-muted">{getFileCount(folder.id)}</span>
						{#if moveTargetFile.folderId === folder.id}
							<Check size={16} />
						{/if}
					</button>
				{/each}
			</div>
			</div>
		</div>
	{/if}

<!-- 폴더 이동 모달 (일괄) -->
{#if showBulkMoveModal}
	<div 
		class="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={() => showBulkMoveModal = false}
		onkeydown={(e) => { if (e.key === 'Escape') showBulkMoveModal = false; }}
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div 
			class="bg-surface-1 rounded-t-xl sm:rounded-lg border border-border-subtle w-full sm:w-96 max-h-[70vh] overflow-hidden"
			role="document"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
				<div>
					<h2 class="text-base font-semibold text-text-strong">폴더 이동</h2>
					<p class="text-xs text-text-muted mt-0.5">{selectedIds.size}개 파일 선택됨</p>
			</div>
				<button type="button" onclick={() => showBulkMoveModal = false} class="text-text-muted hover:text-text-base">
					<X size={18} />
				</button>
			</div>
			<!-- 고정: 미분류 -->
			<div class="p-2 border-b border-border-subtle">
				<button
					type="button"
					onclick={() => bulkMove(null)}
					class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-surface-2 transition-colors"
				>
					<FileAudio size={18} />
					<span class="flex-1 text-sm font-medium">미분류</span>
					<span class="text-xs text-text-muted">{getFileCount(null)}</span>
				</button>
			</div>
			<!-- 스크롤 가능한 폴더 목록 -->
			<div class="p-2 max-h-60 overflow-y-auto custom-list-scrollbar">
				{#each sortedFolders as folder}
					<button
						type="button"
						onclick={() => bulkMove(folder.id)}
						class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-surface-2 transition-colors"
					>
						<Folder size={18} style="color: {getFolderColor(folder.color || 'default')}" />
						<span class="flex-1 text-sm font-medium truncate">{folder.name}</span>
						<span class="text-xs text-text-muted">{getFileCount(folder.id)}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
							{/if}

<!-- 폴더 생성/편집 모달 -->
{#if showFolderModal}
	<div 
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={() => showFolderModal = false}
		onkeydown={(e) => { if (e.key === 'Escape') showFolderModal = false; }}
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-sm overflow-hidden" role="document" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
				<h2 class="text-base font-semibold text-text-strong">{editingFolderId ? '폴더 편집' : '새 폴더'}</h2>
				<button type="button" onclick={() => showFolderModal = false} class="text-text-muted hover:text-text-base">
					<X size={18} />
				</button>
						</div>
			
			<div class="px-5 py-4">
				<label for="folder-name" class="block text-sm font-medium text-text-base mb-2">폴더 이름</label>
				<input id="folder-name" type="text" bind:value={folderName} placeholder="폴더 이름 입력" class="w-full h-10 px-4 bg-surface-2 border border-border-subtle rounded-lg focus:outline-none focus:border-brand-pink" />
			</div>

			<div class="mx-5 mb-4 flex items-center gap-3 p-3 bg-bg rounded-lg">
				<Folder size={22} style="color: {folderColor === 'custom' ? customColor : getFolderColor(folderColor)}" />
				<span class="text-sm font-medium">{folderName || '폴더 이름'}</span>
			</div>

			<div class="border-t border-border-subtle">
				<div class="px-5 py-4">
					<span class="block text-sm font-medium text-text-base mb-3">폴더 색상 <span class="text-text-muted font-normal">({availableColors.length}개 사용 가능)</span></span>
					<div class="grid grid-cols-8 gap-1.5">
						{#each availableColors.slice(0, 16) as c}
							<button
								type="button"
								onclick={() => folderColor = c.id}
								class="relative w-7 h-7 rounded-md transition-all {folderColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-1 scale-110' : 'hover:scale-105'}"
								style="background-color: {c.value}"
								title={c.name}
								aria-label={c.name}
							></button>
					{/each}
						{#if availableColors.length === 0}
							<p class="col-span-8 text-xs text-text-muted py-2">모든 기본 색상이 사용 중입니다.</p>
				{/if}
					</div>
			</div>
		</div>

			<div class="border-t border-border-subtle">
				<div class="px-5 py-4 flex items-center gap-3">
					<input type="color" bind:value={customColor} oninput={() => folderColor = 'custom'} class="w-9 h-9 rounded cursor-pointer border-0" aria-label="커스텀 색상" />
					<input type="text" bind:value={customColor} oninput={() => folderColor = 'custom'} placeholder="#ffffff" class="flex-1 h-9 px-3 bg-surface-2 border border-border-subtle rounded text-sm font-mono focus:outline-none focus:border-brand-pink" />
			</div>
				</div>

			<div class="border-t border-border-subtle">
				<div 
					class="px-5 py-4"
					role="region"
					aria-label="이미지 색상 추출"
					ondragover={(e) => { e.preventDefault(); colorDropOver = true; }}
					ondragleave={() => colorDropOver = false}
					ondrop={handleColorImageDrop}
				>
					<div class="flex items-center gap-2 p-3 rounded-lg border-2 border-dashed transition-all {colorDropOver ? 'border-brand-pink bg-brand-pink/5' : 'border-border-subtle'}">
						<Pipette size={16} class="text-text-muted flex-shrink-0" />
						<span class="text-sm text-text-muted flex-1">
							이미지를 드래그하거나
							<button type="button" onclick={() => document.getElementById('color-image-input')?.click()} class="text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors">찾아보기</button>
							<input id="color-image-input" type="file" accept="image/*" class="hidden" onchange={(e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) extractColors(f); }} />
						</span>
						{#if extractingColors}
							<Loader2 size={16} class="animate-spin text-text-muted" />
						{/if}
				</div>

					{#if extractedColors.length > 0}
						<div class="mt-4">
							<span class="block text-xs text-text-muted mb-2">추출된 색상 ({extractedColors.length}개)</span>
							<div class="grid grid-cols-8 gap-1.5">
								{#each extractedColors as c}
									<button
										type="button"
										onclick={() => { customColor = c; folderColor = 'custom'; }}
										class="w-full aspect-square rounded-md transition-all {customColor === c && folderColor === 'custom' ? 'ring-2 ring-white ring-offset-1 ring-offset-surface-1 scale-105' : 'hover:scale-105'}"
										style="background-color: {c}"
										aria-label="색상 {c}"
										title={c}
									></button>
								{/each}
				</div>
						</div>
					{/if}
			</div>
		</div>

			<div class="flex justify-end gap-3 px-5 py-4 border-t border-border-subtle">
				<button type="button" onclick={() => showFolderModal = false} class="px-4 py-2 text-sm text-text-muted hover:text-text-base transition-colors">취소</button>
				<button type="button" onclick={saveFolder} class="px-4 py-2 bg-brand-pink text-white text-sm font-medium rounded-lg hover:bg-brand-pink/90 transition-colors">저장</button>
			</div>
				</div>
				</div>
{/if}

<!-- 파일 상세 모달 -->
{#if showFileModal && selectedFile}
	<div
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={() => showFileModal = false}
		onkeydown={(e) => { if (e.key === 'Escape') showFileModal = false; }}
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-md max-h-[85vh] overflow-y-auto custom-list-scrollbar" role="document" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between px-5 py-4 border-b border-border-subtle sticky top-0 bg-surface-1 z-10">
				<h2 class="text-base font-semibold text-text-strong">파일 정보</h2>
				<button type="button" onclick={() => showFileModal = false} class="text-text-muted hover:text-text-base">
					<X size={18} />
				</button>
				</div>
			<div class="p-5 space-y-5">
				<div>
					<label for="file-name" class="block text-sm font-medium text-text-base mb-2">파일명</label>
					<input id="file-name" type="text" bind:value={editName} class="w-full h-10 px-4 bg-surface-2 border border-border-subtle rounded-lg focus:outline-none focus:border-brand-pink" />
			</div>

				<div class="grid grid-cols-3 gap-3 text-center">
					<div class="p-3 bg-bg rounded-lg">
						<p class="text-lg font-bold {getFormatColor(selectedFile.format)} uppercase">{selectedFile.format}</p>
						<p class="text-xs text-text-muted">포맷</p>
		</div>
					<div class="p-3 bg-bg rounded-lg">
						<p class="text-lg font-bold text-text-strong">{formatDuration(selectedFile.duration)}</p>
						<p class="text-xs text-text-muted">길이</p>
	</div>
					<div class="p-3 bg-bg rounded-lg">
						<p class="text-lg font-bold text-text-strong">{formatFileSize(selectedFile.fileSize)}</p>
						<p class="text-xs text-text-muted">크기</p>
					</div>
				</div>

				<div>
					<label for="file-desc" class="block text-sm font-medium text-text-base mb-2">메모</label>
					<textarea id="file-desc" bind:value={editDescription} rows="2" placeholder="메모 입력" class="w-full px-4 py-3 bg-surface-2 border border-border-subtle rounded-lg focus:outline-none focus:border-brand-pink resize-none"></textarea>
				</div>

				<div>
					<span class="block text-sm font-medium text-text-base mb-2">태그</span>
					<div class="flex flex-wrap gap-2 mb-2">
						{#each editTags as tag}
							<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-pink/10 text-brand-pink text-xs rounded-full">
								{tag}
								<button type="button" onclick={() => editTags = editTags.filter(t => t !== tag)} aria-label="태그 삭제"><X size={12} /></button>
							</span>
						{/each}
					</div>
					<div class="flex gap-2">
						<input type="text" bind:value={newTag} placeholder="태그 추가" class="flex-1 h-9 px-3 bg-surface-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-brand-pink" onkeydown={(e) => { if (e.key === 'Enter' && newTag.trim()) { editTags = [...editTags, newTag.trim()]; newTag = ''; }}} />
						<button type="button" onclick={() => { if (newTag.trim()) { editTags = [...editTags, newTag.trim()]; newTag = ''; }}} class="px-3 h-9 bg-surface-2 border border-border-subtle rounded-lg text-sm hover:bg-bg transition-colors">추가</button>
					</div>
				</div>

				<div>
					<span class="block text-sm font-medium text-text-base mb-2">폴더</span>
					<button
						type="button"
						onclick={() => { showFileModal = false; setTimeout(() => openMoveModal(selectedFile!), 100); }}
						class="w-full flex items-center gap-3 px-4 py-3 bg-surface-2 border border-border-subtle rounded-lg text-left hover:bg-bg transition-colors"
					>
						{#if selectedFile.folderId}
							{@const folder = folders.find(f => f.id === selectedFile!.folderId)}
							<Folder size={18} style="color: {getFolderColor(folder?.color || 'default')}" />
							<span class="flex-1 text-sm">{folder?.name}</span>
						{:else}
							<FileAudio size={18} class="text-text-muted" />
							<span class="flex-1 text-sm text-text-muted">미분류</span>
						{/if}
						<ChevronRight size={16} class="text-text-muted" />
					</button>
				</div>

				<div class="grid grid-cols-2 gap-2 pt-2">
					<button type="button" onclick={() => { toggleFavorite(selectedFile!.id); selectedFile = { ...selectedFile!, isStarred: !selectedFile!.isStarred }; }} class="px-3 py-2.5 bg-surface-2 border border-border-subtle rounded-lg text-sm hover:bg-bg flex items-center justify-center gap-2 transition-colors">
						<Star size={14} class={selectedFile.isStarred ? 'text-yellow-500 fill-current' : ''} />
						{selectedFile.isStarred ? '즐겨찾기 해제' : '즐겨찾기'}
					</button>
					<button type="button" onclick={() => downloadFile(selectedFile!)} class="px-3 py-2.5 bg-surface-2 border border-border-subtle rounded-lg text-sm hover:bg-bg flex items-center justify-center gap-2 transition-colors">
						<Download size={14} /> 다운로드
					</button>
					<button type="button" onclick={() => duplicateFile(selectedFile!)} class="px-3 py-2.5 bg-surface-2 border border-border-subtle rounded-lg text-sm hover:bg-bg flex items-center justify-center gap-2 transition-colors">
						<Copy size={14} /> 복제
					</button>
					<button type="button" onclick={() => registerAsTrack(selectedFile!)} class="px-3 py-2.5 bg-surface-2 border border-border-subtle rounded-lg text-sm hover:bg-bg flex items-center justify-center gap-2 transition-colors">
						<Music size={14} /> 트랙 등록
					</button>
				</div>
				
				{#if selectedFile.isArchived}
					<div class="grid grid-cols-2 gap-2">
						<button type="button" onclick={() => restoreFile(selectedFile!.id)} class="px-3 py-2.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm hover:bg-green-500/20 flex items-center justify-center gap-2 transition-colors">
							<RotateCcw size={14} /> 복원
						</button>
						<button type="button" onclick={() => deleteFile(selectedFile!.id)} class="px-3 py-2.5 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/10 flex items-center justify-center gap-2 transition-colors">
							<Trash2 size={14} /> 완전 삭제
						</button>
					</div>
				{:else}
					<button type="button" onclick={() => archiveFile(selectedFile!.id)} class="w-full px-3 py-2.5 border border-border-subtle text-text-muted rounded-lg text-sm hover:bg-surface-2 flex items-center justify-center gap-2 transition-colors">
						<Archive size={14} /> 보관함으로 이동
					</button>
				{/if}

				<div class="text-xs text-text-muted pt-2 border-t border-border-subtle">
					<p>업로드: {selectedFile.uploadedBy} · {selectedFile.uploadedAt}</p>
					{#if selectedFile.updatedAt !== selectedFile.uploadedAt}
						<p>수정: {selectedFile.updatedAt}</p>
					{/if}
				</div>
			</div>
			<div class="flex justify-end gap-3 px-5 py-4 border-t border-border-subtle sticky bottom-0 bg-surface-1">
				<button type="button" onclick={() => showFileModal = false} class="px-4 py-2 text-sm text-text-muted hover:text-text-base transition-colors">닫기</button>
				<button type="button" onclick={saveFile} class="px-4 py-2 bg-brand-pink text-white text-sm font-medium rounded-lg hover:bg-brand-pink/90 transition-colors">저장</button>
			</div>
		</div>
	</div>
{/if}
