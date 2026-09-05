import { expect, test } from "@playwright/test";
import { openPart, previewFrame } from "../helpers/page";

test.describe("ライブエディタ", () => {
  test("HTML・CSS・JavaScript編集をPreviewへ反映し、個別Resetできる", async ({
    page,
  }) => {
    await openPart(page, "accordion");
    const editor = page.locator("#code-editor");
    await editor.fill('<p class="edited-copy">更新済み</p>');
    await expect(
      previewFrame(page, "Accordion").getByText("更新済み"),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "編集中のコードを初期コードへ戻す" })
      .click();
    await expect(editor).toHaveValue(/accordion-trigger/);

    await page.getByRole("tab", { name: "CSS" }).click();
    await editor.fill(".accordion { color: rgb(255, 0, 0); }");
    await expect(
      previewFrame(page, "Accordion").locator(".accordion"),
    ).toHaveCSS("color", "rgb(255, 0, 0)");

    await page.getByRole("tab", { name: "JavaScript" }).click();
    await editor.fill("document.body.dataset.editorTest = 'ok';");
    await expect(
      previewFrame(page, "Accordion").locator("body"),
    ).toHaveAttribute("data-editor-test", "ok");
  });

  test("壊れたJS・HTML・CSSでも本体を壊さず、JSはPreview内に表示する", async ({
    page,
  }) => {
    await openPart(page, "accordion");
    const editor = page.locator("#code-editor");
    await page.getByRole("tab", { name: "JavaScript" }).click();
    await editor.fill("const =");
    await expect(
      previewFrame(page, "Accordion").getByRole("alert"),
    ).toContainText("JavaScriptエラー");
    await expect(
      page.getByRole("textbox", { name: "Webパーツを検索" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "編集中のコードを初期コードへ戻す" })
      .click();

    await page.getByRole("tab", { name: "HTML" }).click();
    await editor.fill("<div><button><");
    await expect(page.getByRole("link", { name: /WEB PARTS/ })).toBeVisible();
    await page.getByRole("tab", { name: "CSS" }).click();
    await editor.fill(".example { color: ; }");
    await expect(page.locator(".playground-frame")).toBeVisible();
  });
});
