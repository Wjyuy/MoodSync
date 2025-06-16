
interface MusicExceptEmotionDTO {
  musicNumber: number;
  musicName: string;
  musicAuthor: string;
}

interface ActingExceptEmotionDTO {
  actingNumber: number;
  actingName: string;
}

interface BookExceptEmotionDTO {
  bookNumber: number;
  bookName: string;
  bookAuthor: string;
}

interface UserRecord {
  id: number;
  happy: number;
  sad: number;
  stress: number;
  calm: number;
  excited: number;
  tired: number;
  music_ids: string;
  action_ids: string;
  book_ids: string;
  created_at: string;

  recommendedMusics?: MusicExceptEmotionDTO[];
  recommendedActions?: ActingExceptEmotionDTO[];
  recommendedBooks?: BookExceptEmotionDTO[];
  youtubeSearchResults?: YoutubeVideo[];
}

interface YoutubeVideo {
  title: string;
  channel: string;
  thumbnail: string;
  videoUrl: string;
}

async function getUserRecord(): Promise<UserRecord | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8485';

  try {
    const res = await fetch(`${API_BASE_URL}/test/record`);
    if (!res.ok) return null;
    console.log(res);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getLatestRecords(): Promise<UserRecord[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8485';
  console.log("Fetching from:", API_BASE_URL);
  try {
    const response = await fetch(`${API_BASE_URL}/test/record/latest`);

    if (!response.ok) {
      console.error('데이터 요청 실패:', response.statusText);
      console.log(`response.text():`, await response.text()); // 에러 메시지 출력
      response.text()
      return [];
    }

    const records: UserRecord[] = await response.json();
    return records;
  } catch (error) {
    console.error('API 호출 중 오류:', error);
    return [];
  }
}

export default async function RecordDetailPage() {
  const recommend = await getUserRecord();
  const records = await getLatestRecords();

  return (
    <div>
      <h1>User Record Detail By Id</h1>
      {recommend ? (
        <div>
          <p>행복: {recommend.happy}</p>
          <p>슬픔: {recommend.sad}</p>
          <p>스트레스: {recommend.stress}</p>
          <p>평온함: {recommend.calm}</p>
          <p>신남: {recommend.excited}</p>
          <p>피곤함: {recommend.tired}</p>
          <p>음악 추천</p>
          <ul>
            {recommend.recommendedMusics?.map((music) => {
              console.log('Searching for:', music.musicName);

              const video = recommend.youtubeSearchResults?.find((video) => {
                return video.title.toLowerCase().includes(music.musicName.toLowerCase()) ||
                  (video.channel && video.channel.toLowerCase().includes(music.musicName.toLowerCase()));
              });

              console.log(`Found video for ${music.musicName}:`, video);

              return (
                <li key={music.musicNumber}>
                  🎵 {music.musicName} - {music.musicAuthor}

                  {video ? (
                    <div style={{ marginTop: '10px' }}>
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                      >
                        {video.thumbnail && (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            style={{ width: '120px', height: '90px', marginRight: '10px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <strong style={{ display: 'block' }}>{video.title}</strong>
                          <span style={{ fontSize: '0.9em', color: '#555' }}>채널: {video.channel}</span>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <p>유튜브 검색 결과가 없습니다.</p>
                  )}
                </li>
              );
            })}
          </ul>
          
          <p>행동 추천:</p>
          <ul>
            {recommend.recommendedActions?.map((action) => (
              <li key={action.actingNumber}>🧘 {action.actingName}</li>
            ))}
          </ul>
          <p>도서 추천:</p>
          <ul>
            {recommend.recommendedBooks?.map((book) => (
              <li key={book.bookNumber}>
                📖 {book.bookName} - {book.bookAuthor}
              </li>
            ))}
          </ul>

          <p>생성일: {recommend.created_at}</p>
        </div>
      ) : (
        <p>데이터를 찾을 수 없습니다.</p>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <h2>최근 감정 기록 7개</h2>
      {records.length === 0 ? (
        <p>최근 데이터가 없습니다.</p>
      ) : (
        <ul>
          {records.map((r) => (
            <li key={r.id}>
              <strong>ID: {r.id}</strong> | 생성일: {r.created_at}
              <br />
              행복: {r.happy}, 슬픔: {r.sad}, 스트레스: {r.stress}, 
              평온함: {r.calm}, 신남: {r.excited}, 피곤함: {r.tired}
              <br />
              음악: {r.music_ids}
              행동: {r.action_ids} 
              도서: {r.book_ids}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}