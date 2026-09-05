import { expect, test } from "@playwright/test";
import { openPart, previewFrame, waitForPreviewScript } from "../helpers/page";

test.describe("主要Interactive Preview", () => {
  test("Buttonは状態変化とPreview Resetができる", async ({ page }) => {
    await openPart(page, "button");
    const frame = previewFrame(page, "Button");
    const button = frame.locator(".button");
    await waitForPreviewScript(frame, ".button");
    await button.evaluate((element: HTMLButtonElement) => element.click());
    await expect(button).toHaveText("送信しました ✓");
    await expect(button).toBeDisabled();
    await page
      .locator(".code-preview")
      .getByRole("button", { name: /プレビューを初期状態に戻す/ })
      .click();
    await expect(
      previewFrame(page, "Button").getByRole("button", {
        name: "お問い合わせ",
      }),
    ).toBeEnabled();
  });

  test("AccordionはARIA・クリック・キーボードで開閉する", async ({ page }) => {
    await openPart(page, "accordion");
    const frame = previewFrame(page, "Accordion");
    const trigger = frame.locator(".accordion-trigger");
    const panel = frame.locator("#accordion-panel-1");
    await waitForPreviewScript(frame, ".accordion-trigger");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toHaveAttribute("hidden", "");
    await trigger.evaluate((element: HTMLButtonElement) => element.click());
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(panel).not.toHaveAttribute("hidden", "");
    await trigger.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.press("Space");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("ModalはEscapeで閉じ、操作元へフォーカスが戻る", async ({ page }) => {
    await openPart(page, "modal");
    const frame = previewFrame(page, "Modal");
    const opener = frame.locator("#open-modal");
    await waitForPreviewScript(frame, "#open-modal");
    await opener.evaluate((element: HTMLButtonElement) => element.click());
    await expect(frame.locator("#modal")).toHaveAttribute("open", "");
    await frame.locator("#modal").press("Escape");
    await expect(frame.locator("#modal")).not.toHaveAttribute("open", "");
    await expect(opener).toBeFocused();
  });

  test("Tabs・Carousel・Dropdown・Drawerの状態が同期する", async ({ page }) => {
    await openPart(page, "tabs");
    const tabs = previewFrame(page, "Tabs");
    await waitForPreviewScript(tabs, "#tab-overview");
    await tabs
      .locator("#tab-overview")
      .evaluate((element: HTMLButtonElement) => element.click());
    await tabs.locator("#tab-overview").press("ArrowRight");
    await expect(tabs.locator("#tab-usage")).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await openPart(page, "carousel");
    const carousel = previewFrame(page, "Carousel");
    await waitForPreviewScript(carousel, ".next");
    await carousel
      .getByRole("button", { name: "次のスライド" })
      .evaluate((element: HTMLButtonElement) => element.click());
    await expect(carousel.locator(".carousel-controls span")).toHaveText(
      "2 / 3",
    );

    await openPart(page, "dropdown");
    const dropdown = previewFrame(page, "Dropdown");
    await waitForPreviewScript(dropdown, ".demo-trigger");
    await dropdown
      .getByRole("button", { name: /選択してください/ })
      .evaluate((element: HTMLButtonElement) => element.click());
    await expect(dropdown.locator("#dropdown-menu")).not.toHaveAttribute(
      "hidden",
      "",
    );
    await dropdown
      .getByRole("button", { name: /選択してください/ })
      .press("Escape");
    await expect(dropdown.locator("#dropdown-menu")).toHaveAttribute(
      "hidden",
      "",
    );

    await openPart(page, "drawer");
    const drawer = previewFrame(page, "Drawer");
    await waitForPreviewScript(drawer, ".drawer-trigger");
    const drawerTrigger = drawer.getByRole("button", {
      name: "フィルターを開く",
    });
    await drawerTrigger.evaluate((element: HTMLButtonElement) =>
      element.click(),
    );
    await expect(drawer.locator("#filter-drawer")).not.toHaveAttribute(
      "hidden",
      "",
    );
    await drawerTrigger.press("Escape");
    await expect(drawer.locator("#filter-drawer")).toHaveAttribute(
      "hidden",
      "",
    );
  });

  test("Fullscreen Menu・Bottom Sheet・Command PaletteはEscapeで閉じて操作元へ戻る", async ({
    page,
  }) => {
    const overlays = [
      {
        slug: "fullscreen-menu",
        name: "Fullscreen Menu",
        trigger: ".full-menu-trigger",
        panel: "#full-menu",
      },
      {
        slug: "bottom-sheet",
        name: "Bottom Sheet",
        trigger: ".sheet-trigger",
        panel: "#bottom-sheet-backdrop",
      },
      {
        slug: "command-palette",
        name: "Command Palette",
        trigger: ".command-trigger",
        panel: "#command-panel",
      },
    ];

    for (const overlay of overlays) {
      await openPart(page, overlay.slug);
      const frame = previewFrame(page, overlay.name);
      const trigger = frame.locator(overlay.trigger);
      await waitForPreviewScript(frame, overlay.trigger);
      await trigger.evaluate((element: HTMLButtonElement) => element.click());
      await expect(frame.locator(overlay.panel)).not.toHaveAttribute(
        "hidden",
        "",
      );
      await trigger.press("Escape");
      await expect(frame.locator(overlay.panel)).toHaveAttribute("hidden", "");
      await expect(trigger).toBeFocused();
    }
  });
});
