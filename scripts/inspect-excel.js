/**
 * 엑셀 파일 내부 구조 확인 스크립트
 * 사용: node scripts/inspect-excel.js [경로]
 * 경로 생략 시 static 폴더 내 첫 .xlsx 사용
 */
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const xlsx = await import('xlsx');

const root = resolve(process.cwd());
let absPath = process.argv[2] ? resolve(root, process.argv[2]) : null;
if (!absPath) {
	const staticDir = join(root, 'static');
	const files = readdirSync(staticDir).filter((f) => f.endsWith('.xlsx'));
	if (files.length) absPath = join(staticDir, files[0]);
}
if (!absPath) {
	console.error('사용법: node scripts/inspect-excel.js [경로/파일.xlsx]');
	process.exit(1);
}

let buffer;
try {
	buffer = readFileSync(absPath);
} catch (e) {
	console.error('파일을 읽을 수 없습니다:', e.message);
	process.exit(1);
}
console.log('파일:', absPath);

const workbook = xlsx.read(buffer, { type: 'buffer', cellDates: true });
console.log('=== 시트 목록 ===');
console.log(workbook.SheetNames);
console.log('');

for (const name of workbook.SheetNames) {
	const sheet = workbook.Sheets[name];
	const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
	console.log(`\n=== 시트: "${name}" (총 ${rows.length}행) ===`);
	if (rows.length > 0) {
		// 헤더 찾기: "서비스" 또는 "플랫폼" 포함 행
		for (let i = 0; i < Math.min(30, rows.length); i++) {
			const row = rows[i];
			const joined = Array.isArray(row) ? row.join(' ') : String(row);
			if (/서비스|플랫폼|정산금액|실지급액|곡명/.test(joined)) {
				console.log(`>>> 헤더 후보 ${i + 1}행:`, row);
			}
		}
		console.log('\n16~25행:');
		for (let i = 15; i < Math.min(25, rows.length); i++) {
			console.log(`  ${i + 1}행:`, rows[i]);
		}
	}
}
