import { supabase } from "@/ts/supabase";

// Supabase 클라이언트 초기화 및 책 데이터 조회
async function getBookData() {
 

  try {
    // books 테이블에서 첫 번째 레코드 조회
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .limit(1);

    if (error) {
      console.error('테이블 조회 오류:', error);
      if (error.message.includes('does not exist')) {
        throw new Error('books 테이블이 존재하지 않습니다. 테이블을 먼저 생성해주세요.');
      }
      throw new Error(`Supabase 쿼리 오류: ${JSON.stringify(error)}`);
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Supabase 연결 오류:', error);
    throw error;
  }
}

export default async function BookDataPage() {
  try {
    const bookData = await getBookData();
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
          <h1 className="text-2xl font-bold mb-4">Supabase 연결 테스트</h1>
          <div className="space-y-4">
            <p className="text-green-600 font-semibold">✅ 데이터베이스 연결 성공!</p>
            
            {bookData ? (
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">조회된 책 정보</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">제목:</span> {bookData.title}</p>
                  <p><span className="font-medium">저자:</span> {bookData.author || '미상'}</p>
                  <p><span className="font-medium">ISBN:</span> {bookData.isbn || '미상'}</p>
                  <p><span className="font-medium">출판사:</span> {bookData.publisher || '미상'}</p>
                  <p><span className="font-medium">출판일:</span> {bookData.publication_date || '미상'}</p>
                  {bookData.description && (
                    <p><span className="font-medium">설명:</span> {bookData.description}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-yellow-600">⚠️ books 테이블에 데이터가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-800 p-6 rounded-lg max-w-lg">
          <h1 className="text-xl font-bold mb-2">연결 오류</h1>
          <p className="mb-4">{error instanceof Error ? error.message : "알 수 없는 오류"}</p>
          <div className="text-sm bg-white p-4 rounded">
            <p className="font-semibold mb-2">디버그 정보:</p>
            <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10)}...</p>
          </div>
        </div>
      </div>
    );
  }
}