import { expect, type FrameLocator, type Page } from "@playwright/test";

export async function waitForApp(page: Page) {
  await expect(page.locator(".parts-grid")).toHaveAttribute(
    "data-parts-total",
    "100",
  );
  await page.waitForTimeout(300);
}

export async function openPart(page: Page, slug: string) {
  await page.goto(`/#parts/${slug}`);
  await waitForApp(page);
  await expect(page.locator(".detail-heading h2")).toBeVisible();
}

export async function expectNoHorizontalPageScroll(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    )
    .toBe(true);
}

export function previewFrame(page: Page, partName: string) {
  return page.frameLocator(`iframe[title="${partName} のライブプレビュー"]`);
}

export async function waitForPreviewScript(
  frame: FrameLocator,
  selector: string,
) {
  await expect
    .poll(() =>
      frame.locator(selector).evaluate((element) => typeof element.onclick),
    )
    .toBe("function");
}
