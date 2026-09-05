import { expect, test } from "@playwright/test";
import { expectNoHorizontalPageScroll, openPart } from "../helpers/page";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-375", width: 375, height: 667 },
  { name: "mobile-320", width: 320, height: 568 },
];

for (const viewport of viewports) {
  test(`${viewport.name}で横スクロールせず、主要領域を表示する`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await openPart(page, "accordion");
    await expectNoHorizontalPageScroll(page);
    await expect(page.locator(".interactive-panel")).toBeVisible();
    await expect(page.locator("#code-editor")).toBeVisible();
  });
}

for (const viewport of viewports.filter(({ width }) => width <= 390)) {
  test(`${viewport.name}のコードEditorは横幅を使い、コードだけ横スクロールできる`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await openPart(page, "accordion");
    const sizes = await page.locator("#code-editor").evaluate((editor) => ({
      clientWidth: editor.clientWidth,
      scrollWidth: editor.scrollWidth,
      wrap: editor.getAttribute("wrap"),
    }));
    expect(sizes.clientWidth).toBeGreaterThanOrEqual(250);
    expect(sizes.wrap).toBe("off");
    await expectNoHorizontalPageScroll(page);
  });
}

test("アイコンボタンとコードタブはアクセス可能な名前とキーボード操作を持つ", async ({
  page,
}) => {
  await openPart(page, "accordion");
  await expect(
    page.getByRole("button", {
      name: /Accordion のプレビューを初期状態に戻す/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "リンクをコピー" }),
  ).toBeVisible();
  const htmlTab = page.getByRole("tab", { name: "HTML" });
  await htmlTab.focus();
  await htmlTab.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "CSS" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("reduced motion時はアニメーションを短縮する", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const duration = await page
    .locator(".name-finder button")
    .first()
    .evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(parseFloat(duration)).toBeLessThanOrEqual(0.01);
});
