import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

/**
 * 음원 파일 업로드 API
 * 
 * 현재는 기본 구조만 구현되어 있으며, 실제 스토리지 연동은 향후 추가 예정입니다.
 * Cloudflare R2 또는 다른 스토리지 서비스와 연동할 수 있도록 설계되었습니다.
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		// Content-Type 확인
		const contentType = request.headers.get('content-type');
		if (!contentType || !contentType.includes('multipart/form-data')) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'INVALID_CONTENT_TYPE',
					message: 'multipart/form-data 형식이 필요합니다.',
					details: 'Content-Type must be multipart/form-data'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		// FormData 파싱
		const formData = await request.formData();
		const audioFile = formData.get('audioFile') as File | null;
		const trackId = formData.get('trackId') as string | null;

		// 파일 검증
		if (!audioFile) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'MISSING_FILE',
					message: '음원 파일을 업로드해주세요.',
					details: 'audioFile is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		// 파일 타입 검증
		if (!audioFile.type.startsWith('audio/')) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'INVALID_FILE_TYPE',
					message: '오디오 파일만 업로드 가능합니다.',
					details: `Expected audio/*, got ${audioFile.type}`
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		// 파일 크기 검증 (100MB 제한)
		const maxSize = 100 * 1024 * 1024; // 100MB
		if (audioFile.size > maxSize) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'FILE_TOO_LARGE',
					message: '파일 크기는 100MB를 초과할 수 없습니다.',
					details: `File size: ${audioFile.size}, Max: ${maxSize}`
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		// TODO: 실제 스토리지 연동 (Cloudflare R2 또는 다른 스토리지)
		// 현재는 파일 정보만 반환 (실제 업로드는 향후 구현)
		
		// 파일 정보 생성
		const fileId = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const fileExtension = audioFile.name.split('.').pop() || 'mp3';
		const fileName = `${fileId}.${fileExtension}`;
		
		// TODO: 실제 스토리지에 업로드
		// 예시: await uploadToR2(audioFile, fileName);
		
		// 임시 URL 반환 (실제 스토리지 연동 후 실제 URL로 변경)
		const fileUrl = `/uploads/audio/${fileName}`;
		
		// 데이터베이스에 파일 정보 저장 (선택사항)
		const db = platform?.env?.DB;
		if (db && trackId) {
			try {
				// tracks 테이블에 audio_file_url 업데이트
				// 스키마에 audio_file_url 컬럼이 있다고 가정
				await db
					.prepare('UPDATE tracks SET audio_file_url = ? WHERE id = ?')
					.bind(fileUrl, trackId)
					.run();
			} catch (dbError) {
				console.error('Database error:', dbError);
				// DB 오류는 무시 (파일 업로드는 성공)
			}
		}

		const response: ApiOk<{
			fileId: string;
			fileName: string;
			fileUrl: string;
			fileSize: number;
			fileType: string;
		}> = {
			ok: true,
			data: {
				fileId,
				fileName,
				fileUrl,
				fileSize: audioFile.size,
				fileType: audioFile.type
			}
		};

		return new Response(JSON.stringify(response), {
			status: 200,
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		console.error('Audio upload error:', error);
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '음원 파일 업로드 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
