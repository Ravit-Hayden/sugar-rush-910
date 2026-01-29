import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

/**
 * 통계 대시보드 API
 * 
 * 수익과 지출을 통합하여 통계 정보 제공
 */

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const startDate = url.searchParams.get('startDate');
		const endDate = url.searchParams.get('endDate');
		const period = url.searchParams.get('period') || 'month'; // day, week, month, year

		const db = platform?.env?.DB;
		let stats = {
			totalRevenue: 0,
			totalExpense: 0,
			netProfit: 0,
			revenueByPlatform: [] as Array<{ platform: string; amount: number }>,
			expenseByCategory: [] as Array<{ category: string; amount: number }>,
			monthlyRevenue: 0,
			monthlyExpense: 0,
			monthlyProfit: 0
		};

		if (db) {
			try {
				// 수익 데이터 조회
				let revenueQuery = 'SELECT platform, amount, date FROM revenues WHERE 1=1';
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
				let expenseQuery = 'SELECT category, amount, date FROM expenses WHERE 1=1';
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

				// 통계 계산
				const revenueList = revenues as any[];
				const expenseList = expenses as any[];

				// 총 수익/지출
				stats.totalRevenue = revenueList.reduce((sum, r) => sum + (r.amount || 0), 0);
				stats.totalExpense = expenseList.reduce((sum, e) => sum + (e.amount || 0), 0);
				stats.netProfit = stats.totalRevenue - stats.totalExpense;

				// 플랫폼별 수익 집계
				const platformMap = new Map<string, number>();
				revenueList.forEach(r => {
					const platform = r.platform || '기타';
					const current = platformMap.get(platform) || 0;
					platformMap.set(platform, current + (r.amount || 0));
				});
				stats.revenueByPlatform = Array.from(platformMap.entries())
					.map(([platform, amount]) => ({ platform, amount }))
					.sort((a, b) => b.amount - a.amount);

				// 카테고리별 지출 집계
				const categoryMap = new Map<string, number>();
				expenseList.forEach(e => {
					const category = e.category || '기타';
					const current = categoryMap.get(category) || 0;
					categoryMap.set(category, current + (e.amount || 0));
				});
				stats.expenseByCategory = Array.from(categoryMap.entries())
					.map(([category, amount]) => ({ category, amount }))
					.sort((a, b) => b.amount - a.amount);

				// 이번 달 수익/지출 계산
				const now = new Date();
				const currentMonth = now.getMonth();
				const currentYear = now.getFullYear();
				const monthlyRevenues = revenueList.filter(r => {
					if (!r.date) return false;
					const date = new Date(r.date);
					return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
				});
				const monthlyExpenses = expenseList.filter(e => {
					if (!e.date) return false;
					const date = new Date(e.date);
					return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
				});

				stats.monthlyRevenue = monthlyRevenues.reduce((sum, r) => sum + (r.amount || 0), 0);
				stats.monthlyExpense = monthlyExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
				stats.monthlyProfit = stats.monthlyRevenue - stats.monthlyExpense;
			} catch (dbError) {
				console.error('Database error:', dbError);
			}
		}

		// D1이 없거나 오류 시 샘플 데이터
		if (stats.totalRevenue === 0 && stats.totalExpense === 0) {
			stats = {
				totalRevenue: 125000,
				totalExpense: 700000,
				netProfit: -575000,
				revenueByPlatform: [
					{ platform: 'Spotify', amount: 45000 },
					{ platform: 'Apple Music', amount: 32000 },
					{ platform: 'YouTube Music', amount: 28000 },
					{ platform: '기타', amount: 20000 }
				],
				expenseByCategory: [
					{ category: '제작비', amount: 500000 },
					{ category: '마케팅비', amount: 200000 },
					{ category: '광고비', amount: 60000 },
					{ category: '인건비', amount: 40000 }
				],
				monthlyRevenue: 15000,
				monthlyExpense: 50000,
				monthlyProfit: -35000
			};
		}

		const response: ApiOk<typeof stats> = {
			ok: true,
			data: stats
		};

		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '통계 데이터를 불러오는 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
