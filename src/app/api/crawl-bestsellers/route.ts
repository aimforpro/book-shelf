import { NextResponse } from "next/server";
import { Builder, By, until } from "selenium-webdriver";
import { ServiceBuilder } from "selenium-webdriver/chrome";
import { supabase } from "@/ts/supabase";

export async function GET() {
  let driver;
  try {
    const chromePath = "/opt/homebrew/bin/chromedriver"; // 실제 경로로 수정
    console.log("ChromeDriver 경로:", chromePath);

    const service = new ServiceBuilder(chromePath);
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeService(service)
      .build();

    const url =
      "https://search.shopping.naver.com/book/search?bookTabType=BEST_SELLER&catId=50005542&pageIndex=1&pageSize=40&query=%EB%B2%A0%EC%8A%A4%ED%8A%B8%EC%85%80%EB%9F%AC&sort=REL";
    console.log("페이지로 이동 중:", url);
    await driver.get(url);

    await driver.wait(until.elementLocated(By.css("li[class*='bookListItem']")), 30000);
    console.log("책 목록 셀렉터 발견됨");

    const bookElements = await driver.findElements(By.css("li[class*='bookListItem']"));
    const books = [];
    for (const book of bookElements) {
      const rank = (await book.findElement(By.css("span[class*='bookListItem_num']")).getText()) || "";
      const title = (await book.findElement(By.css("div[class*='bookListItem_title'] span[class*='bookListItem_text']")).getText()) || "";
      const author = (await book.findElement(By.css("div[class*='bookListItem_define_item'] span[class*='bookListItem_define_data']")).getText()) || "";
      const publisher = (await book.findElement(By.css("div[class*='bookListItem_publish'] span[class*='bookListItem_define_data']")).getText()) || "";
      const publishDate = (await book.findElement(By.css("div[class*='bookListItem_detail_date']")).getText()).replace(/\./g, "-") || "";
      const price = (await book.findElement(By.css("span[class*='bookListItem_price'] em")).getText()).replace(/,/g, "") || "";
      const image = (await book.findElement(By.css("div[class*='bookListItem_thumbnail'] img")).getAttribute("src")) || "";

      books.push({
        rank: parseInt(rank) || 0,
        title: title.replace(rank + "위", "").trim() || "제목 없음",
        author: author || "저자 없음",
        publisher: publisher || "출판사 없음",
        publish_date: publishDate || "출판일 없음",
        price: parseInt(price) || 0,
        image_url: image || "",
      });
    }

    // 한국 시간(KST)으로 created_at 추가
    const nowKST = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    const booksWithKST = books.map(book => ({
      ...book,
      created_at: nowKST
    }));

    if (booksWithKST.length > 0) {
      // 기존 bestseller 테이블 데이터 모두 삭제
      const { error: deleteError } = await supabase.from("bestseller").delete().neq('id', 0); // id는 절대 같을 수 없으므로 모든 행 삭제
      if (deleteError) throw new Error(`Supabase 삭제 오류: ${deleteError.message}`);

      // 새로운 데이터 삽입
      const { error: insertError } = await supabase.from("bestseller").insert(booksWithKST);
      if (insertError) throw new Error(`Supabase 삽입 오류: ${insertError.message}`);
    }

    await driver.quit();
    return NextResponse.json({ message: "베스트셀러 크롤링 및 저장 성공", books: booksWithKST });
  } catch (error: unknown) {
    console.error("크롤링 오류:", error);
    if (driver) await driver.quit();
    return NextResponse.json(
      { 
        message: "크롤링 중 오류 발생", 
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다"
      },
      { status: 500 }
    );
  }
}