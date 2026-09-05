export const EXPECTED_PART_COUNT = 100;

export const corePartSlugs = [
  "button",
  "accordion",
  "modal",
  "tabs",
  "dropdown",
  "carousel",
  "drawer",
  "tooltip",
  "toggle",
  "breadcrumb",
] as const;

export const naturalLanguageQueries = [
  ["押すと開く", "Accordion"],
  ["質問を押すと答えが出る", "Accordion"],
  ["画像が横に動く", "Carousel"],
  ["写真がスライドする", "Carousel"],
  ["画面の上に出てくる", "Modal"],
  ["右下にずっとあるボタン", "Floating"],
  ["マウスを乗せると説明", "Tooltip"],
  ["クリックすると選択肢", "Dropdown"],
  ["入力候補が下に出る", "Combobox"],
  ["読み込み中に灰色", "Skeleton"],
  ["左右に動かして数字を変える", "Range Slider"],
] as const;
