interface NaverBook {
  title: string;
  author: string;
  publisher: string;
  image: string;
  link: string;
  description: string;
  pubdate: string;
  discount: string;
  isbn: string; // ISBN 추가
}

interface NaverBookResponse {
  items: NaverBook[];
}

export const searchNaverBooks = async (
  query: string,
  display: number = 10,
  start: number = 1
): Promise<NaverBook[] | null> => {
  if (!query.trim()) return [];

  const url = `/api/naver-search-books?query=${encodeURIComponent(query)}&display=${display}&start=${start}`;
  console.log("Fetching URL:", url);

  try {
    const response = await fetch(url);
    console.log("Response status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NaverBookResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching Naver book data:", error);
    return null;
  }
};