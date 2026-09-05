import { expect, test } from "@playwright/test";
import { corePartSlugs } from "../helpers/catalog";
import { openPart, waitForApp } from "../helpers/page";

test.describe("詳細URL・共有・お気に入り", () => {
  for (const slug of corePartSlugs) {
    test(`${slug} を直接URLと再読み込みで表示できる`, async ({ page }) => {
      await openPart(page, slug);
      await expect(page).toHaveURL(new RegExp(`#parts/${slug}$`));
      const title = await page.locator(".detail-heading h2").textContent();
      await page.reload();
      await expect(page.locator(".detail-heading h2")).toHaveText(title!);
    });
  }

  test("リンクコピーは現在の詳細URLとToastを返す", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openPart(page, "accordion");
    await page.getByRole("button", { name: "リンクをコピー" }).click();
    await expect(page.getByRole("status")).toContainText(
      "リンクをコピーしました",
    );
    await expect(
      await page.evaluate(() => navigator.clipboard.readText()),
    ).toContain("#parts/accordion");
  });

  test("詳細URLは戻る・進む操作でも同期する", async ({ page }) => {
    await openPart(page, "accordion");
    await openPart(page, "modal");
    await page.goBack();
    await expect(page.locator(".detail-heading h2")).toContainText("Accordion");
    await page.goForward();
    await expect(page.locator(".detail-heading h2")).toContainText("Modal");
  });

  test("お気に入りは再読み込み後も保持し、絞り込みと解除ができる", async ({
    page,
  }) => {
    await page.goto("/#parts");
    await waitForApp(page);
    const buttonCard = page.locator('[data-part-slug="button"]');
    await buttonCard
      .getByRole("button", { name: "Buttonをお気に入りに追加" })
      .click();
    await expect(
      buttonCard.getByRole("button", { name: "Buttonをお気に入りから外す" }),
    ).toBeVisible();
    await page.reload();
    await waitForApp(page);
    await page.getByRole("button", { name: "お気に入りのみ" }).click();
    await expect(page.locator('[data-part-slug="button"]')).toBeVisible();
    await page
      .locator('[data-part-slug="button"]')
      .getByRole("button", { name: "Buttonをお気に入りから外す" })
      .click();
  });
});
