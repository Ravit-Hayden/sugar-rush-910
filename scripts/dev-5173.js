/**
 * 5173 포트를 사용 중인 프로세스를 종료한 뒤 vite dev만 5173에서 실행합니다.
 * Windows / Unix 모두 동작합니다.
 */
import { execSync, spawn } from 'child_process';
import net from 'net';

const PORT = 5173;

function killPort(port) {
	try {
		if (process.platform === 'win32') {
			const out = execSync(`netstat -ano`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
			const lines = out.split('\n').filter((l) => l.trim().includes(`:${port}`) && l.includes('LISTENING'));
			const pids = new Set();
			for (const line of lines) {
				const parts = line.trim().split(/\s+/);
				const pid = parts[parts.length - 1];
				if (pid && /^\d+$/.test(pid)) pids.add(pid);
			}
			for (const pid of pids) {
				try {
					execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
				} catch (_) {}
			}
		} else {
			const pids = execSync(`lsof -ti:${port}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
				.trim()
				.split(/\s+/)
				.filter(Boolean);
			for (const pid of pids) {
				try {
					process.kill(Number(pid), 'SIGTERM');
				} catch (_) {}
			}
		}
	} catch (_) {
		/* 포트 사용 중인 프로세스 없음 */
	}
}

function portInUse(port) {
	return new Promise((resolve) => {
		const s = net.createServer();
		s.once('error', () => resolve(true));
		s.once('listening', () => {
			s.close();
			resolve(false);
		});
		s.listen(port, '127.0.0.1', () => {});
	});
}

(async () => {
	if (await portInUse(PORT)) {
		killPort(PORT);
		await new Promise((r) => setTimeout(r, 1500));
	}
	const child = spawn('pnpm', ['run', 'dev'], {
		stdio: 'inherit',
		shell: true,
		cwd: process.cwd()
	});
	child.on('exit', (code) => process.exit(code ?? 0));
})();
