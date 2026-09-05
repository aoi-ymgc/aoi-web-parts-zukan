import { expect, test } from "@playwright/test";
import { openPart, waitForApp } from "../helpers/page";

test("通常操作でConsole Error・HTTP失敗・未公開Portfolio導線を残さない", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const failedResponses: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      failedResponses.push(`${response.status()} ${response.url()}`);
  });

  await page.goto("/#parts/accordion");
  await waitForApp(page);
  await page.getByRole("button", { name: "リンクをコピー" }).click();
  await expect(page.locator(".detail-heading h2")).toContainText("Accordion");
  await expect(page.getByRole("link", { name: /Portfolio/i })).toHaveCount(0);
  expect(consoleErrors).toEqual([]);
  expect(failedResponses).toEqual([]);
});

test("関連パーツは空ではなく、詳細表示へ移動できる", async ({ page }) => {
  await openPart(page, "accordion");
  const related = page.locator(".related-parts button");
  await expect(related).toHaveCount(3);
  await related.first().click();
  await expect(page).toHaveURL(/#parts\//);
  await expect(page.locator(".detail-heading h2")).toBeVisible();
});

test("サイトタイトルとヘッダー・フッターの図鑑リンクはトップページを指す", async ({
  page,
}) => {
  await openPart(page, "accordion");
  await expect(page).toHaveTitle(
    "Accordion（アコーディオン）とは？｜Webパーツ図鑑",
  );

  await page.getByRole("link", { name: /WEB PARTS/ }).click();
  await expect(page).toHaveURL(/#top$/);
  await expect(page).toHaveTitle("Webパーツ図鑑｜見て、触って、名前を知る");

  await openPart(page, "modal");
  await expect(page).toHaveTitle("Modal（モーダル）とは？｜Webパーツ図鑑");
  await page
    .locator(".site-footer")
    .getByRole("link", { name: "Webパーツ図鑑" })
    .click();
  await expect(page).toHaveURL(/#top$/);
  await expect(page).toHaveTitle("Webパーツ図鑑｜見て、触って、名前を知る");
});

test("代表的な詳細ページではパーツ名に応じてタイトルを切り替える", async ({
  page,
}) => {
  for (const [slug, title] of [
    ["modal", "Modal（モーダル）とは？｜Webパーツ図鑑"],
    ["carousel", "Carousel（カルーセル）とは？｜Webパーツ図鑑"],
    ["breadcrumb", "Breadcrumb（パンくずリスト）とは？｜Webパーツ図鑑"],
  ]) {
    await openPart(page, slug);
    await expect(page).toHaveTitle(title);
  }
});
