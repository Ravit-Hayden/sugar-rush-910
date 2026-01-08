/**
 * 샘플 아티스트 데이터를 데이터베이스에 추가하는 스크립트
 * 
 * 사용법:
 * 1. 개발 서버가 실행 중이어야 합니다 (localhost:5173)
 * 2. 터미널에서 실행: node scripts/seed-artists.js
 */

const sampleArtists = [
	{
		name: 'Sugar Rush',
		description: 'Sugar Rush 910 프로젝트의 메인 아티스트. 팝과 일렉트로닉을 결합한 독특한 사운드로 많은 사랑을 받고 있습니다. 감성적인 멜로디와 강렬한 비트의 조화로 독보적인 음악 세계를 구축하고 있습니다.',
		photo_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
		website: 'https://sugarrush.com',
		email: 'contact@sugarrush.com',
		instagram: 'https://instagram.com/sugarrush',
		twitter: 'https://twitter.com/sugarrush',
		youtube: 'https://youtube.com/@sugarrush',
		genre: 'Pop, Electronic',
		debut_date: '2020-01-15',
		agency: 'Sugar Rush Entertainment',
		country: '대한민국'
	},
	{
		name: 'Various',
		description: '다양한 아티스트들의 협업 프로젝트를 위한 공통 아티스트입니다. 여러 아티스트가 함께 작업한 트랙이나 컴필레이션 앨범에 사용됩니다.',
		photo_url: null,
		website: null,
		email: null,
		instagram: null,
		twitter: null,
		youtube: null,
		genre: null,
		debut_date: null,
		agency: null,
		country: null
	}
];

async function seedArtists() {
	const baseUrl = 'http://localhost:5173';
	
	console.log('샘플 아티스트 데이터 추가 중...\n');
	
	for (const artist of sampleArtists) {
		try {
			const response = await fetch(`${baseUrl}/api/artists`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(artist)
			});
			
			const result = await response.json();
			
			if (result.ok) {
				console.log(`✅ ${artist.name} 추가 완료`);
			} else {
				if (result.error?.code === 'DUPLICATE_ERROR') {
					console.log(`⚠️  ${artist.name} 이미 존재함 (건너뜀)`);
				} else {
					console.error(`❌ ${artist.name} 추가 실패:`, result.error?.message);
				}
			}
		} catch (error) {
			console.error(`❌ ${artist.name} 추가 중 오류:`, error.message);
		}
	}
	
	console.log('\n완료!');
}

// 스크립트 실행
seedArtists().catch(console.error);







