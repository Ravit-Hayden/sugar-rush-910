import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

/**
 * 리포트 생성 API
 * 
 * 기본 기능:
 * - 리포트 데이터 생성 (POST)
 * - 리포트 다운로드 (GET)
 */

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const type = url.searchParams.get('type') || 'financial'; // financial, revenue, expense
		const format = url.searchParams.get('format') || 'json'; // json, csv
		const startDate = url.searchParams.get('startDate');
		const endDate = url.searchParams.get('endDate');

		const db = platform?.env?.DB;
		let reportData: any = {};

		if (db) {
			try {
				// 수익 데이터 조회
				let revenueQuery = 'SELECT * FROM revenues WHERE 1=1';
				const revenueParams: any[] = [];

				if (startDate) {
					revenueQuery += ' AND date >= ?';
					revenueParams.push(startDate);
				}
				if (endDate) {
					revenueQuery += ' AND date <= ?';
					revenueParams.push(endDate);
				}

				const { results: revenues } = await db.prepare(revenueQuery).bind(...revenueParams).all();

				// 지출 데이터 조회
				let expenseQuery = 'SELECT * FROM expenses WHERE 1=1';
				const expenseParams: any[] = [];

				if (startDate) {
					expenseQuery += ' AND date >= ?';
					expenseParams.push(startDate);
				}
				if (endDate) {
					expenseQuery += ' AND date <= ?';
					expenseParams.push(endDate);
				}

				const { results: expenses } = await db.prepare(expenseQuery).bind(...expenseParams).all();

				const revenueList = revenues as any[];
				const expenseList = expenses as any[];

				// 리포트 데이터 구성
				if (type === 'financial' || type === 'revenue') {
					reportData.revenues = revenueList;
				}
				if (type === 'financial' || type === 'expense') {
					reportData.expenses = expenseList;
				}

				// 통계 계산
				if (type === 'financial') {
					const totalRevenue = revenueList.reduce((sum, r) => sum + (r.amount || 0), 0);
					const totalExpense = expenseList.reduce((sum, e) => sum + (e.amount || 0), 0);
					reportData.summary = {
						totalRevenue,
						totalExpense,
						netProfit: totalRevenue - totalExpense
					};
				}
			} catch (dbError) {
				console.error('Database error:', dbError);
			}
		}

		// D1이 없거나 오류 시 샘플 데이터
		if (Object.keys(reportData).length === 0) {
			reportData = {
				revenues: [
					{
						id: 'rev_1',
						platform: 'Spotify',
						amount: 45000,
						date: new Date().toISOString().split('T')[0],
						description: '월간 스트리밍 수익'
					}
				],
				expenses: [
					{
						id: 'exp_1',
						category: '제작비',
						amount: 500000,
						date: new Date().toISOString().split('T')[0],
						description: '녹음 및 믹싱 비용'
					}
				],
				summary: {
					totalRevenue: 125000,
					totalExpense: 700000,
					netProfit: -575000
				}
			};
		}

		// CSV 형식으로 변환
		if (format === 'csv') {
			let csvContent = '';

			if (type === 'financial' || type === 'revenue') {
				csvContent += '수익 리포트\n';
				csvContent += '플랫폼,금액,날짜,설명\n';
				(reportData.revenues || []).forEach((r: any) => {
					csvContent += `${r.platform || ''},${r.amount || 0},${r.date || ''},${(r.description || '').replace(/,/g, ';')}\n`;
				});
				csvContent += '\n';
			}

			if (type === 'financial' || type === 'expense') {
				csvContent += '지출 리포트\n';
				csvContent += '카테고리,금액,날짜,설명\n';
				(reportData.expenses || []).forEach((e: any) => {
					csvContent += `${e.category || ''},${e.amount || 0},${e.date || ''},${(e.description || '').replace(/,/g, ';')}\n`;
				});
				csvContent += '\n';
			}

			if (type === 'financial' && reportData.summary) {
				csvContent += '요약\n';
				csvContent += `총 수익,${reportData.summary.totalRevenue}\n`;
				csvContent += `총 지출,${reportData.summary.totalExpense}\n`;
				csvContent += `순이익,${reportData.summary.netProfit}\n`;
			}

			return new Response(csvContent, {
				headers: {
					'content-type': 'text/csv; charset=utf-8',
					'content-disposition': `attachment; filename="report_${type}_${new Date().toISOString().split('T')[0]}.csv"`
				}
			});
		}

		// JSON 형식
		const response: ApiOk<typeof reportData> = {
			ok: true,
			data: reportData
		};

		return new Response(JSON.stringify(response, null, 2), {
			headers: {
				'content-type': 'application/json',
				'content-disposition': `attachment; filename="report_${type}_${new Date().toISOString().split('T')[0]}.json"`
			}
		});
	} catch (error) {
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '리포트 생성 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
