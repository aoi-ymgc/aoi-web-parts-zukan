import { expect, test } from "@playwright/test";
import { EXPECTED_PART_COUNT } from "../helpers/catalog";
import { openPart } from "../helpers/page";

test("100件のデータと一覧カードを表示する", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".parts-grid")).toHaveAttribute(
    "data-parts-total",
    "100",
  );
  await expect(page.locator("[data-part-slug]")).toHaveCount(
    EXPECTED_PART_COUNT,
  );
  await expect(page.locator(".result-count")).toContainText("100件中 100件");
});

test("100パーツすべてを個別URLから詳細表示できる", async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto("/");
  const parts = await page.locator("[data-part-slug]").evaluateAll((cards) =>
    cards.map((card) => ({
      slug: card.getAttribute("data-part-slug"),
      name: card.querySelector("h3")?.textContent,
    })),
  );

  expect(parts).toHaveLength(EXPECTED_PART_COUNT);
  for (const part of parts) {
    expect(part.slug).toBeTruthy();
    expect(part.name).toBeTruthy();
    await openPart(page, part.slug!);
    await expect(page.locator(".detail-heading h2")).toContainText(part.name!);
    await expect(page.locator(".interactive-panel iframe")).toBeVisible();
    await expect(
      page.getByRole("tablist", { name: "コードの種類" }),
    ).toBeVisible();
  }
});
