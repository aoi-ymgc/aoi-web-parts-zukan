import { expect, test } from "@playwright/test";
import { naturalLanguageQueries } from "../helpers/catalog";
import { waitForApp } from "../helpers/page";

test.describe("自然語検索とフィルター", () => {
  test("初心者表現から目的のパーツを上位表示する", async ({ page }) => {
    const search = page.getByRole("textbox", { name: "Webパーツを検索" });
    for (const [query, expected] of naturalLanguageQueries) {
      await page.goto("/#parts");
      await waitForApp(page);
      await search.fill(query);
      await expect(
        page.getByRole("button", { name: "検索キーワードをクリア" }),
      ).toBeVisible();
      await expect(page.locator(".parts-grid h3").first()).toContainText(
        expected,
      );
    }
  });

  test("検索クリアとEscapeは検索語だけを解除する", async ({ page }) => {
    await page.goto("/#parts");
    await waitForApp(page);
    const search = page.getByRole("textbox", { name: "Webパーツを検索" });
    await page
      .getByRole("button", { name: "フォーム・入力", exact: true })
      .click();
    await search.fill("ボタ");
    await expect(
      page.getByRole("button", { name: "検索キーワードをクリア" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "検索キーワードをクリア" }).click();
    await expect(search).toHaveValue("");
    await expect(
      page.getByRole("button", { name: "フォーム・入力", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");

    await search.fill("ボタ");
    await search.press("Escape");
    await expect(search).toBeFocused();
    await expect(search).toHaveValue("");
  });

  test("複数条件の表示・個別解除・全解除が正しい", async ({ page }) => {
    await page.goto("/#parts");
    await waitForApp(page);
    const search = page.getByRole("textbox", { name: "Webパーツを検索" });
    await search.fill("フォーム");
    await page
      .getByRole("button", { name: "フォーム・入力", exact: true })
      .click();
    await page.getByRole("button", { name: "初級", exact: true }).click();
    await page.getByRole("button", { name: "不要", exact: true }).click();
    const filters = page.locator(".active-filters");
    await expect(filters).toContainText("検索：");
    await expect(filters).toContainText("カテゴリ：フォーム・入力");
    await expect(filters).toContainText("難易度：初級");
    await expect(filters).toContainText("JavaScript：不要");

    await page.getByRole("button", { name: /難易度：初級 を解除/ }).click();
    await expect(filters).not.toContainText("難易度：初級");
    await expect(search).toHaveValue("フォーム");
    await page
      .getByRole("button", { name: "すべてクリア", exact: true })
      .click();
    await expect(search).toHaveValue("");
    await expect(page.locator(".result-count")).toContainText("100件中 100件");
  });

  test("0件時に空状態と復帰手段を表示する", async ({ page }) => {
    await page.goto("/#parts");
    await waitForApp(page);
    await page
      .getByRole("textbox", { name: "Webパーツを検索" })
      .fill("abcdefxyz");
    await expect(page.locator(".empty-result")).toContainText(
      "見つかりませんでした",
    );
    await expect(
      page.getByRole("button", { name: "検索キーワードをクリア" }),
    ).toBeVisible();
  });
});
