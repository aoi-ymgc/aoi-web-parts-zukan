"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Part = {
  name: string;
  slug: string;
  category: string;
  description: string;
  level: string;
  reason: string;
  icon: string;
};

// 公開前のため外部Portfolioへの導線だけを一時停止しています。
const SHOW_PORTFOLIO_LINK = false;
const FAVORITES_STORAGE_KEY = "web-parts-zukan:favorites";

const baseParts: Part[] = [
  {
    name: "Button",
    slug: "button",
    category: "操作",
    description: "行動を明確に伝える、もっとも基本的なパーツ。",
    level: "初級",
    reason: "状態ごとの見た目を用意します。",
    icon: "↗",
  },
  {
    name: "Header",
    slug: "header",
    category: "ナビゲーション",
    description: "ロゴと主要な操作をまとめる、サイトの入口となるパーツ。",
    level: "初級",
    reason: "小さな画面でもメニューを開けるようにします。",
    icon: "▰",
  },
  {
    name: "Navigation",
    slug: "navigation",
    category: "ナビゲーション",
    description: "ページやコンテンツへ迷わず移動するための案内です。",
    level: "初級",
    reason: "現在地とリンク先を分かりやすく示します。",
    icon: "→",
  },
  {
    name: "Accordion",
    slug: "accordion",
    category: "表示切替",
    description: "情報を折りたたみ、必要なときだけ見せます。",
    level: "中級",
    reason: "開閉状態とキーボード操作を考えます。",
    icon: "⌄",
  },
  {
    name: "Modal",
    slug: "modal",
    category: "表示切替",
    description: "画面に重ねて、確認や入力を促します。",
    level: "中級",
    reason: "フォーカス移動に配慮します。",
    icon: "□",
  },
  {
    name: "Card",
    slug: "card",
    category: "コンテンツ",
    description: "関連する情報をひとまとまりにして見せます。",
    level: "初級",
    reason: "情報の優先順位を整えます。",
    icon: "▤",
  },
  {
    name: "Tabs",
    slug: "tabs",
    category: "表示切替",
    description: "同じ階層の内容を切り替えて比較できます。",
    level: "中級",
    reason: "選択状態と内容を同期します。",
    icon: "▱",
  },
  {
    name: "Carousel",
    slug: "carousel",
    category: "ナビゲーション",
    description: "複数のコンテンツを横方向に見せるスライドです。",
    level: "中級",
    reason: "現在位置を分かりやすくします。",
    icon: "→",
  },
  {
    name: "Dropdown",
    slug: "dropdown",
    category: "表示切替",
    description: "選択肢をコンパクトにまとめて表示します。",
    level: "中級",
    reason: "開閉と選択状態を管理します。",
    icon: "⌄",
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    category: "補足",
    description: "短い補足を、必要なときだけ表示します。",
    level: "初級",
    reason: "ホバーとフォーカスを両立します。",
    icon: "?",
  },
  {
    name: "Toast",
    slug: "toast",
    category: "フィードバック",
    description: "操作結果を一時的に知らせるメッセージです。",
    level: "中級",
    reason: "表示時間と消し方を考えます。",
    icon: "!",
  },
  {
    name: "Drawer",
    slug: "drawer",
    category: "表示切替",
    description: "画面の横から補助パネルを表示します。",
    level: "中級",
    reason: "開閉時の画面操作に配慮します。",
    icon: "☰",
  },
  {
    name: "Toggle",
    slug: "toggle",
    category: "操作",
    description: "ON / OFFをひとつのスイッチで切り替えます。",
    level: "初級",
    reason: "状態を色だけに頼らず伝えます。",
    icon: "◐",
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    category: "フォーム",
    description: "複数の項目から選ぶときに使います。",
    level: "初級",
    reason: "選択状態を明確にします。",
    icon: "☑",
  },
  {
    name: "Radio Button",
    slug: "radio",
    category: "フォーム",
    description: "候補の中からひとつだけ選びます。",
    level: "初級",
    reason: "初期選択の扱いを決めます。",
    icon: "◉",
  },
  {
    name: "Select",
    slug: "select",
    category: "フォーム",
    description: "決まった候補からひとつを選択できます。",
    level: "初級",
    reason: "選択肢は短く整理します。",
    icon: "⌄",
  },
  {
    name: "Search",
    slug: "search",
    category: "操作",
    description: "入力した言葉に合う情報を絞り込みます。",
    level: "中級",
    reason: "結果なしの状態も用意します。",
    icon: "⌕",
  },
  {
    name: "Pagination",
    slug: "pagination",
    category: "ナビゲーション",
    description: "長い一覧をページごとに分けて移動します。",
    level: "初級",
    reason: "現在のページを分かりやすくします。",
    icon: "1",
  },
  {
    name: "Hamburger Menu",
    slug: "hamburger",
    category: "ナビゲーション",
    description: "小さな画面でメニューを開閉します。",
    level: "中級",
    reason: "開いていることを明示します。",
    icon: "☰",
  },
  {
    name: "Mega Menu",
    slug: "mega-menu",
    category: "ナビゲーション",
    description: "多くの項目をグループで見せる大きなメニュー。",
    level: "上級",
    reason: "情報設計とキーボード操作が要点です。",
    icon: "▦",
  },
  {
    name: "Lightbox",
    slug: "lightbox",
    category: "表示切替",
    description: "画像を画面上で大きく表示します。",
    level: "中級",
    reason: "閉じる手段を複数用意します。",
    icon: "□",
  },
  {
    name: "Form Validation",
    slug: "validation",
    category: "フォーム",
    description: "入力内容に応じてエラーや成功を伝えます。",
    level: "中級",
    reason: "何を直すか具体的に示します。",
    icon: "✓",
  },
  {
    name: "Progress Bar",
    slug: "progress",
    category: "フィードバック",
    description: "処理や入力の進み具合を視覚化します。",
    level: "初級",
    reason: "現在値を数値でも伝えます。",
    icon: "▰",
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    category: "フィードバック",
    description: "読み込み中のレイアウトを予告表示します。",
    level: "初級",
    reason: "待ち時間の不安を減らします。",
    icon: "▤",
  },
  {
    name: "Stepper",
    slug: "stepper",
    category: "ナビゲーション",
    description: "複数ステップの現在地を示します。",
    level: "中級",
    reason: "戻る操作と進行状態を扱います。",
    icon: "①",
  },
  {
    name: "File Upload",
    slug: "file-upload",
    category: "フォーム",
    description: "ファイルを選択・アップロードします。",
    level: "中級",
    reason: "形式や容量のエラーを示します。",
    icon: "↑",
  },
  {
    name: "Date Picker",
    slug: "date-picker",
    category: "フォーム",
    description: "日付をカレンダーから選択します。",
    level: "中級",
    reason: "日付形式と範囲に注意します。",
    icon: "□",
  },
  {
    name: "Password Input",
    slug: "password",
    category: "フォーム",
    description: "文字を隠してパスワードを入力します。",
    level: "初級",
    reason: "表示・非表示を切り替えられます。",
    icon: "●",
  },
  {
    name: "Floating Button",
    slug: "floating",
    category: "操作",
    description: "画面上で目立つ固定アクションボタンです。",
    level: "初級",
    reason: "内容を隠さない配置が大切です。",
    icon: "+",
  },
  {
    name: "Popover",
    slug: "popover",
    category: "表示切替",
    description: "ボタンの近くに補助情報を表示します。",
    level: "中級",
    reason: "表示位置と閉じ方を決めます。",
    icon: "i",
  },
  {
    name: "Slider",
    slug: "slider",
    category: "フォーム",
    description: "スライドで値や表示内容を切り替えます。",
    level: "初級",
    reason: "現在値を併記します。",
    icon: "↔",
  },
  {
    name: "Rating",
    slug: "rating",
    category: "フォーム",
    description: "星などで満足度や評価を入力します。",
    level: "初級",
    reason: "選択済みの数を伝えます。",
    icon: "★",
  },
  {
    name: "Range Slider",
    slug: "range-slider",
    category: "フォーム",
    description: "数値の範囲をドラッグして指定します。",
    level: "中級",
    reason: "最小・最大値を見せます。",
    icon: "↔",
  },
  {
    name: "Breadcrumb",
    slug: "breadcrumb",
    category: "ナビゲーション",
    description: "今いるページまでの階層を短く示します。",
    level: "初級",
    reason: "現在地を最後に分かりやすく示します。",
    icon: "›",
  },
  {
    name: "Chip",
    slug: "chip",
    category: "コンテンツ",
    description: "条件や選択内容を小さなラベルで見せます。",
    level: "初級",
    reason: "削除や選択状態を明確にします。",
    icon: "●",
  },
  {
    name: "Alert",
    slug: "alert",
    category: "フィードバック",
    description: "大切な注意や結果を目立たせて伝えます。",
    level: "初級",
    reason: "色だけに頼らず内容も明示します。",
    icon: "!",
  },
  {
    name: "Avatar",
    slug: "avatar",
    category: "コンテンツ",
    description: "ユーザーや投稿者をひと目で識別します。",
    level: "初級",
    reason: "画像がない場合の表示も用意します。",
    icon: "◉",
  },
  {
    name: "Badge",
    slug: "badge",
    category: "コンテンツ",
    description: "件数や新着などの小さな状態を伝えます。",
    level: "初級",
    reason: "短い言葉と十分なコントラストを使います。",
    icon: "●",
  },
  {
    name: "Timeline",
    slug: "timeline",
    category: "コンテンツ",
    description: "出来事や手順を時系列で分かりやすく並べます。",
    level: "中級",
    reason: "順番と現在位置を区別します。",
    icon: "│",
  },
  {
    name: "Table",
    slug: "table",
    category: "コンテンツ",
    description: "複数の項目を行と列で比較しやすくします。",
    level: "中級",
    reason: "見出しとデータの対応を保ちます。",
    icon: "▦",
  },
  {
    name: "Empty State",
    slug: "empty-state",
    category: "フィードバック",
    description: "まだ内容がない状態で、次の行動を案内します。",
    level: "初級",
    reason: "理由と次にできることを伝えます。",
    icon: "○",
  },
  {
    name: "Cookie Banner",
    slug: "cookie-banner",
    category: "表示切替",
    description: "Cookie利用について選択を促す案内です。",
    level: "中級",
    reason: "拒否する選択肢も同じように示します。",
    icon: "□",
  },
  {
    name: "Quantity Stepper",
    slug: "quantity-stepper",
    category: "フォーム",
    description: "数量をプラス・マイナスで調整します。",
    level: "初級",
    reason: "最小値と現在値を分かりやすくします。",
    icon: "±",
  },
];
const extraParts: Part[] = [
  {
    name: "Hero",
    slug: "hero",
    category: "コンテンツ",
    description: "ページの目的や主な行動を最初に伝える大きな導入です。",
    level: "初級",
    reason: "主役となる言葉と行動を一つに絞ります。",
    icon: "◆",
  },
  {
    name: "Section Heading",
    slug: "section-heading",
    category: "コンテンツ",
    description: "長いページを読みやすく区切る見出しです。",
    level: "初級",
    reason: "見出しの階層を正しく保ちます。",
    icon: "H",
  },
  {
    name: "Feature List",
    slug: "feature-list",
    category: "コンテンツ",
    description: "特徴やメリットを短く分かりやすく並べます。",
    level: "初級",
    reason: "一項目につき一つの価値を伝えます。",
    icon: "✓",
  },
  {
    name: "Pricing Table",
    slug: "pricing-table",
    category: "コンテンツ",
    description: "料金プランを比較して選びやすくする表です。",
    level: "中級",
    reason: "価格以外の違いも見比べられるようにします。",
    icon: "¥",
  },
  {
    name: "Testimonial",
    slug: "testimonial",
    category: "コンテンツ",
    description: "利用者の声やレビューを紹介するパーツです。",
    level: "初級",
    reason: "引用元と内容を混同しないようにします。",
    icon: "“",
  },
  {
    name: "Article List",
    slug: "article-list",
    category: "コンテンツ",
    description: "記事・お知らせなどを時系列で一覧表示します。",
    level: "初級",
    reason: "新しさと内容をひと目で伝えます。",
    icon: "☷",
  },
  {
    name: "Footer",
    slug: "footer",
    category: "コンテンツ",
    description: "サイト末尾に補助リンクや案内をまとめます。",
    level: "初級",
    reason: "主要な導線を重複なく整理します。",
    icon: "▂",
  },
  {
    name: "Logo Cloud",
    slug: "logo-cloud",
    category: "コンテンツ",
    description: "導入企業や連携先のロゴを並べて紹介します。",
    level: "初級",
    reason: "ロゴの大きさと余白を揃えます。",
    icon: "◇",
  },
  {
    name: "Bottom Navigation",
    slug: "bottom-navigation",
    category: "ナビゲーション",
    description: "スマホ画面の下部で主要画面へすばやく移動します。",
    level: "中級",
    reason: "項目数を絞り、現在地を明示します。",
    icon: "▾",
  },
  {
    name: "Sidebar Navigation",
    slug: "sidebar-navigation",
    category: "ナビゲーション",
    description: "横長画面で使いやすい、左側のメニューです。",
    level: "中級",
    reason: "階層と現在地を分かりやすくします。",
    icon: "▐",
  },
  {
    name: "Context Menu",
    slug: "context-menu",
    category: "ナビゲーション",
    description: "三点ボタンなどから補助操作を開くメニューです。",
    level: "中級",
    reason: "開閉と選択後の処理を明確にします。",
    icon: "⋮",
  },
  {
    name: "Segmented Control",
    slug: "segmented-control",
    category: "ナビゲーション",
    description: "少数の選択肢を横並びで素早く切り替えます。",
    level: "初級",
    reason: "選択中の状態を色以外でも示します。",
    icon: "◫",
  },
  {
    name: "Command Palette",
    slug: "command-palette",
    category: "ナビゲーション",
    description: "キーボードで機能やページをすばやく探す操作盤です。",
    level: "上級",
    reason: "検索・選択・ショートカットを同期します。",
    icon: "⌘",
  },
  {
    name: "Table of Contents",
    slug: "table-of-contents",
    category: "ナビゲーション",
    description: "ページ内の見出しへ移動できる目次です。",
    level: "中級",
    reason: "現在読んでいる位置も示せるようにします。",
    icon: "☰",
  },
  {
    name: "Skip Link",
    slug: "skip-link",
    category: "ナビゲーション",
    description: "キーボード利用者が本文へ移動するための近道です。",
    level: "上級",
    reason: "フォーカス時だけ見えるようにします。",
    icon: "↪",
  },
  {
    name: "Text Input",
    slug: "text-input",
    category: "フォーム・入力",
    description: "名前や短い文章を一行で入力する基本の欄です。",
    level: "初級",
    reason: "ラベルと入力目的を対応させます。",
    icon: "I",
  },
  {
    name: "Textarea",
    slug: "textarea",
    category: "フォーム・入力",
    description: "感想や問い合わせなど長い文章を入力します。",
    level: "初級",
    reason: "必要な文字数や補足を近くに示します。",
    icon: "¶",
  },
  {
    name: "Combobox",
    slug: "combobox",
    category: "フォーム・入力",
    description: "入力しながら候補を絞って一つ選びます。",
    level: "中級",
    reason: "候補の開閉と選択状態を同期します。",
    icon: "⌕",
  },
  {
    name: "Multi Select",
    slug: "multi-select",
    category: "フォーム・入力",
    description: "複数の条件や項目をまとめて選択します。",
    level: "中級",
    reason: "選んだ内容を確認・解除できるようにします。",
    icon: "☑",
  },
  {
    name: "Tag Input",
    slug: "tag-input",
    category: "フォーム・入力",
    description: "キーワードを入力してタグとして追加します。",
    level: "中級",
    reason: "追加と削除の操作を分かりやすくします。",
    icon: "#",
  },
  {
    name: "OTP Input",
    slug: "otp-input",
    category: "フォーム・入力",
    description: "認証用の数字コードを一桁ずつ入力します。",
    level: "中級",
    reason: "貼り付けや移動にも対応させます。",
    icon: "123",
  },
  {
    name: "Phone Input",
    slug: "phone-input",
    category: "フォーム・入力",
    description: "国番号を含む電話番号を入力する欄です。",
    level: "中級",
    reason: "入力例と形式エラーを示します。",
    icon: "☎",
  },
  {
    name: "Address Form",
    slug: "address-form",
    category: "フォーム・入力",
    description: "配送先などの住所をまとめて入力します。",
    level: "中級",
    reason: "必須項目と自動入力の扱いを考えます。",
    icon: "⌂",
  },
  {
    name: "Date Range Picker",
    slug: "date-range-picker",
    category: "フォーム・入力",
    description: "開始日と終了日をまとめて指定します。",
    level: "中級",
    reason: "期間の前後関係を検証します。",
    icon: "□",
  },
  {
    name: "Time Picker",
    slug: "time-picker",
    category: "フォーム・入力",
    description: "予約などに使う時刻を選択します。",
    level: "初級",
    reason: "タイムゾーンと形式を明確にします。",
    icon: "◷",
  },
  {
    name: "Color Picker",
    slug: "color-picker",
    category: "フォーム・入力",
    description: "色を視覚的に選び、値として扱います。",
    level: "初級",
    reason: "選択した色の値も伝えます。",
    icon: "●",
  },
  {
    name: "Confirmation Dialog",
    slug: "confirmation-dialog",
    category: "表示・オーバーレイ",
    description: "削除などの重要な操作前に確認を求めます。",
    level: "中級",
    reason: "取り消しと実行を区別します。",
    icon: "?",
  },
  {
    name: "Bottom Sheet",
    slug: "bottom-sheet",
    category: "表示・オーバーレイ",
    description: "スマホで下から補助操作を表示します。",
    level: "中級",
    reason: "閉じ方を複数用意します。",
    icon: "▴",
  },
  {
    name: "Fullscreen Menu",
    slug: "fullscreen-menu",
    category: "表示・オーバーレイ",
    description: "画面全体にメニューを大きく開きます。",
    level: "中級",
    reason: "開いた状態でも閉じ方を目立たせます。",
    icon: "□",
  },
  {
    name: "Image Comparison",
    slug: "image-comparison",
    category: "表示・オーバーレイ",
    description: "ビフォー・アフターの画像を比較します。",
    level: "中級",
    reason: "比較する意味が伝わるラベルを付けます。",
    icon: "◐",
  },
  {
    name: "Video Player",
    slug: "video-player",
    category: "表示・オーバーレイ",
    description: "動画の再生・停止を操作するプレーヤーです。",
    level: "中級",
    reason: "再生状態と音の扱いを明示します。",
    icon: "▶",
  },
  {
    name: "Code Block",
    slug: "code-block",
    category: "表示・オーバーレイ",
    description: "コードを読みやすく表示してコピーできます。",
    level: "初級",
    reason: "コピー完了を分かりやすく知らせます。",
    icon: "</>",
  },
  {
    name: "Read More",
    slug: "read-more",
    category: "表示・オーバーレイ",
    description: "長い文章を省略し、必要なとき全文を開きます。",
    level: "初級",
    reason: "開閉前後の状態を伝えます。",
    icon: "…",
  },
  {
    name: "Spinner",
    slug: "spinner",
    category: "フィードバック・状態",
    description: "処理中であることを短く伝える回転表示です。",
    level: "初級",
    reason: "待つ理由や時間も補足します。",
    icon: "◌",
  },
  {
    name: "Inline Message",
    slug: "inline-message",
    category: "フィードバック・状態",
    description: "入力欄の近くで注意や補足を伝えます。",
    level: "初級",
    reason: "対象となる入力と結び付けます。",
    icon: "i",
  },
  {
    name: "Snackbar",
    slug: "snackbar",
    category: "フィードバック・状態",
    description: "画面下部で、取り消し付きの通知を出します。",
    level: "中級",
    reason: "操作できる時間を考えます。",
    icon: "!",
  },
  {
    name: "Loading Button",
    slug: "loading-button",
    category: "フィードバック・状態",
    description: "送信中など、処理中のボタン状態を示します。",
    level: "初級",
    reason: "二重送信を防ぎます。",
    icon: "◌",
  },
  {
    name: "Success State",
    slug: "success-state",
    category: "フィードバック・状態",
    description: "完了後に次の行動を案内する成功画面です。",
    level: "初級",
    reason: "完了内容と次の選択肢を示します。",
    icon: "✓",
  },
  {
    name: "Error State",
    slug: "error-state",
    category: "フィードバック・状態",
    description: "失敗したときに原因と復帰方法を案内します。",
    level: "初級",
    reason: "再試行できる手段を用意します。",
    icon: "!",
  },
  {
    name: "Notification Center",
    slug: "notification-center",
    category: "フィードバック・状態",
    description: "未読を含む通知をまとめて確認します。",
    level: "上級",
    reason: "既読・未読と一覧の状態を同期します。",
    icon: "♢",
  },
  {
    name: "Sortable Table",
    slug: "sortable-table",
    category: "データ・一覧",
    description: "列見出しを押して表の順番を並べ替えます。",
    level: "中級",
    reason: "並び順と基準を明示します。",
    icon: "↕",
  },
  {
    name: "Filterable Table",
    slug: "filterable-table",
    category: "データ・一覧",
    description: "条件で表の内容を絞り込めます。",
    level: "中級",
    reason: "該当件数と条件を見せます。",
    icon: "⌕",
  },
  {
    name: "Selectable Table",
    slug: "selectable-table",
    category: "データ・一覧",
    description: "一覧の行を選んでまとめて操作します。",
    level: "中級",
    reason: "選択件数と解除方法を示します。",
    icon: "☑",
  },
  {
    name: "Calendar View",
    slug: "calendar-view",
    category: "データ・一覧",
    description: "予定や予約を月ごとのカレンダーで見せます。",
    level: "中級",
    reason: "日付と予定の対応を保ちます。",
    icon: "▦",
  },
  {
    name: "Kanban Board",
    slug: "kanban-board",
    category: "データ・一覧",
    description: "タスクを状態ごとの列に分けて管理します。",
    level: "上級",
    reason: "移動後の順番と状態を保存します。",
    icon: "▥",
  },
  {
    name: "Activity Feed",
    slug: "activity-feed",
    category: "データ・一覧",
    description: "最近の更新や操作履歴を時系列で表示します。",
    level: "初級",
    reason: "時刻と行動を読み取りやすくします。",
    icon: "↻",
  },
  {
    name: "Metric Card",
    slug: "metric-card",
    category: "データ・一覧",
    description: "売上やアクセス数などの重要な数値を見せます。",
    level: "初級",
    reason: "数値の意味と変化を併記します。",
    icon: "↑",
  },
  {
    name: "Sticky Header",
    slug: "sticky-header",
    category: "追従・行動誘導",
    description: "スクロールしても上部に残るヘッダーです。",
    level: "中級",
    reason: "本文を隠しすぎない高さにします。",
    icon: "⇡",
  },
  {
    name: "Sticky Sidebar",
    slug: "sticky-sidebar",
    category: "追従・行動誘導",
    description: "目次などを横に固定して読み進めやすくします。",
    level: "中級",
    reason: "小画面では通常表示へ切り替えます。",
    icon: "▐",
  },
  {
    name: "Back to Top",
    slug: "back-to-top",
    category: "追従・行動誘導",
    description: "長いページの先頭へ戻るための固定ボタンです。",
    level: "初級",
    reason: "表示する位置と戻る先を明確にします。",
    icon: "↑",
  },
  {
    name: "Scroll Progress",
    slug: "scroll-progress",
    category: "追従・行動誘導",
    description: "ページをどこまで読んだかを細いバーで示します。",
    level: "初級",
    reason: "進行率を過度に目立たせません。",
    icon: "▰",
  },
  {
    name: "Chat Widget",
    slug: "chat-widget",
    category: "追従・行動誘導",
    description: "右下から問い合わせや会話を始める入口です。",
    level: "中級",
    reason: "閉じる操作と応答時間を示します。",
    icon: "◌",
  },
  {
    name: "Sticky CTA Bar",
    slug: "sticky-cta-bar",
    category: "追従・行動誘導",
    description: "申込みなどの主な行動を下部に固定します。",
    level: "中級",
    reason: "内容を隠さず、閉じる手段を考えます。",
    icon: "↗",
  },
  {
    name: "Sortable List",
    slug: "sortable-list",
    category: "上級インタラクション",
    description: "項目をドラッグして表示順を入れ替えます。",
    level: "上級",
    reason: "キーボードでも順番を変えられるようにします。",
    icon: "↕",
  },
  {
    name: "Resizable Split Pane",
    slug: "resizable-split-pane",
    category: "上級インタラクション",
    description: "左右の領域の幅をドラッグで調整します。",
    level: "上級",
    reason: "最小幅とキーボード操作を用意します。",
    icon: "↔",
  },
  {
    name: "Virtualized List",
    slug: "virtualized-list",
    category: "上級インタラクション",
    description: "大量の一覧を軽く表示するためのリストです。",
    level: "上級",
    reason: "表示範囲とスクロール位置を同期します。",
    icon: "≡",
  },
  {
    name: "Tree View",
    slug: "tree-view",
    category: "上級インタラクション",
    description: "フォルダのような階層データを開閉して見せます。",
    level: "上級",
    reason: "展開状態とキーボード操作を整えます。",
    icon: "└",
  },
];
const parts: Part[] = [...baseParts, ...extraParts];
const categoryOverrides: Record<string, string> = {
  button: "追従・行動誘導",
  header: "ナビゲーション",
  navigation: "ナビゲーション",
  accordion: "表示・オーバーレイ",
  modal: "表示・オーバーレイ",
  card: "コンテンツ",
  tabs: "表示・オーバーレイ",
  carousel: "ナビゲーション",
  dropdown: "表示・オーバーレイ",
  tooltip: "フィードバック・状態",
  toast: "フィードバック・状態",
  drawer: "表示・オーバーレイ",
  toggle: "追従・行動誘導",
  checkbox: "フォーム・入力",
  radio: "フォーム・入力",
  select: "フォーム・入力",
  search: "フォーム・入力",
  pagination: "ナビゲーション",
  hamburger: "ナビゲーション",
  "mega-menu": "ナビゲーション",
  lightbox: "表示・オーバーレイ",
  validation: "フォーム・入力",
  progress: "フィードバック・状態",
  skeleton: "フィードバック・状態",
  stepper: "ナビゲーション",
  "file-upload": "フォーム・入力",
  "date-picker": "フォーム・入力",
  password: "フォーム・入力",
  floating: "追従・行動誘導",
  popover: "表示・オーバーレイ",
  slider: "フォーム・入力",
  rating: "フォーム・入力",
  "range-slider": "フォーム・入力",
  breadcrumb: "ナビゲーション",
  chip: "コンテンツ",
  alert: "フィードバック・状態",
  avatar: "コンテンツ",
  badge: "コンテンツ",
  timeline: "データ・一覧",
  table: "データ・一覧",
  "empty-state": "フィードバック・状態",
  "cookie-banner": "表示・オーバーレイ",
  "quantity-stepper": "フォーム・入力",
};
const categoryOf = (part: Part) =>
  categoryOverrides[part.slug] ?? part.category;
const categories = [
  "すべて",
  "コンテンツ",
  "ナビゲーション",
  "フォーム・入力",
  "表示・オーバーレイ",
  "フィードバック・状態",
  "データ・一覧",
  "追従・行動誘導",
  "上級インタラクション",
];
const searchAliases: Record<string, string[]> = {
  button: [
    "ボタン",
    "押す",
    "クリック",
    "送信",
    "申込",
    "CTA",
    "リンク",
    "アクション",
  ],
  header: ["ヘッダー", "サイトヘッダー", "ロゴ", "メニュー", "サイトの入口"],
  navigation: [
    "ナビゲーション",
    "ナビ",
    "メニュー",
    "リンク",
    "ページ移動",
    "案内",
  ],
  accordion: [
    "アコーディオン",
    "開閉",
    "開く",
    "閉じる",
    "折りたたみ",
    "FAQ",
    "質問",
  ],
  modal: ["モーダル", "ポップアップ", "確認画面", "ダイアログ", "重ねる"],
  card: ["カード", "記事", "商品", "プロフィール", "一覧"],
  tabs: ["タブ", "切り替え", "切替"],
  carousel: ["カルーセル", "スライダー", "スライド", "横スクロール"],
  dropdown: ["ドロップダウン", "プルダウン", "メニュー", "選択肢"],
  tooltip: ["ツールチップ", "補足", "説明", "ホバー"],
  toast: ["トースト", "通知", "完了", "保存しました"],
  drawer: ["ドロワー", "サイドバー", "横から", "フィルター"],
  toggle: ["トグル", "スイッチ", "ON", "OFF"],
  checkbox: ["チェックボックス", "チェック", "複数選択", "同意"],
  radio: ["ラジオボタン", "ラジオ", "一つ選択", "単一選択"],
  select: ["セレクト", "選択", "選ぶ", "選択肢"],
  search: ["検索", "さがす", "探す", "キーワード"],
  pagination: ["ページネーション", "ページ送り", "ページ番号", "次のページ"],
  hamburger: [
    "ハンバーガー",
    "ハンバーガーメニュー",
    "スマホメニュー",
    "ヘッダー",
  ],
  "mega-menu": ["メガメニュー", "大きいメニュー", "ナビゲーション"],
  lightbox: ["ライトボックス", "画像拡大", "拡大表示"],
  validation: ["バリデーション", "入力チェック", "エラー", "フォーム"],
  progress: ["プログレスバー", "進捗", "進行状況"],
  skeleton: ["スケルトン", "ローディング", "読み込み中"],
  stepper: ["ステッパー", "ステップ", "手順"],
  "file-upload": ["ファイルアップロード", "アップロード", "ファイル選択"],
  "date-picker": ["デートピッカー", "日付", "カレンダー"],
  password: ["パスワード", "表示切替", "目のアイコン"],
  floating: ["フローティングボタン", "固定ボタン", "丸いボタン"],
  popover: ["ポップオーバー", "吹き出し", "補足表示"],
  slider: ["スライダー", "つまみ", "値を選ぶ"],
  rating: ["レーティング", "評価", "星", "スター"],
  "range-slider": ["レンジスライダー", "範囲", "最小", "最大"],
  breadcrumb: ["パンくず", "パンくずリスト", "階層", "現在地"],
  chip: ["チップ", "タグ", "ラベル", "絞り込み"],
  alert: ["アラート", "注意", "警告", "お知らせ"],
  avatar: ["アバター", "ユーザー", "プロフィール画像"],
  badge: ["バッジ", "新着", "件数", "通知"],
  timeline: ["タイムライン", "時系列", "履歴", "予定"],
  table: ["テーブル", "表", "一覧表", "比較"],
  "empty-state": [
    "空の状態",
    "データなし",
    "検索結果なし",
    "エンプティステート",
  ],
  "cookie-banner": ["クッキー", "Cookie", "同意", "バナー"],
  "quantity-stepper": ["数量", "個数", "ステッパー", "プラスマイナス"],
};
Object.assign(searchAliases, {
  hero: [
    "ヒーロー",
    "トップ",
    "最初の大きい画像",
    "メイン画像",
    "ファーストビュー",
  ],
  "section-heading": ["見出し", "区切り", "タイトル", "セクションタイトル"],
  "feature-list": ["特徴", "できること", "メリット", "機能一覧"],
  "pricing-table": ["料金", "値段", "プラン比較", "価格表"],
  testimonial: ["口コミ", "レビュー", "お客様の声", "利用者の声"],
  "article-list": ["記事一覧", "ブログ一覧", "お知らせ一覧", "新着記事"],
  footer: ["下", "フッター", "サイトの下", "会社情報"],
  "logo-cloud": ["ロゴ一覧", "導入企業", "取引先", "ロゴを並べる"],
  "bottom-navigation": ["下のメニュー", "スマホ下部", "タブバー", "下部ナビ"],
  "sidebar-navigation": ["横メニュー", "左メニュー", "サイドバー", "横のナビ"],
  "context-menu": [
    "右クリック",
    "三点メニュー",
    "その他メニュー",
    "もっと見るメニュー",
  ],
  "segmented-control": ["切替ボタン", "タブみたい", "二択", "セグメント"],
  "command-palette": ["コマンド", "すぐ探す", "ショートカット", "cmdk"],
  "table-of-contents": ["目次", "ページ内リンク", "見出し一覧", "もくじ"],
  "skip-link": ["本文へ", "読み飛ばす", "キーボード操作", "スキップリンク"],
  "text-input": ["一行入力", "名前入力", "文字入れる", "テキスト入力"],
  textarea: ["長文", "感想", "メッセージ", "問い合わせ内容"],
  combobox: [
    "候補から検索",
    "入力して選ぶ",
    "予測変換",
    "入力候補",
    "オートコンプリート",
  ],
  "multi-select": ["複数選択", "いくつも選ぶ", "複数の条件", "複数セレクト"],
  "tag-input": ["タグ入力", "キーワード追加", "ラベル追加", "ハッシュタグ"],
  "otp-input": ["認証コード", "数字6桁", "ワンタイム", "確認コード"],
  "phone-input": ["電話番号", "国番号", "連絡先", "電話を入れる"],
  "address-form": ["住所", "郵便番号", "配送先", "届け先"],
  "date-range-picker": [
    "期間",
    "開始日と終了日",
    "いつからいつまで",
    "日付範囲",
  ],
  "time-picker": ["時間", "時刻", "予約時間", "何時"],
  "color-picker": ["色選択", "カラー", "色を決める", "カラーピッカー"],
  "confirmation-dialog": ["本当に削除", "確認画面", "決定前", "削除確認"],
  "bottom-sheet": ["下から出る", "スマホ下部", "選択肢", "ボトムシート"],
  "fullscreen-menu": [
    "全画面メニュー",
    "メニューを大きく",
    "スマホメニュー",
    "フルスクリーン",
  ],
  "image-comparison": [
    "画像比較",
    "before after",
    "ビフォーアフター",
    "比較スライダー",
  ],
  "video-player": ["動画", "再生", "停止", "ムービー"],
  "code-block": ["コード表示", "コピーしたい", "プログラム", "ソースコード"],
  "read-more": ["もっと見る", "文章を省略", "全文表示", "続きを読む"],
  spinner: ["くるくる", "読み込み", "待つ", "ローディング"],
  "inline-message": [
    "入力の下のエラー",
    "注意文",
    "その場で案内",
    "インラインメッセージ",
  ],
  snackbar: ["下のお知らせ", "取り消し", "undo", "スナックバー"],
  "loading-button": ["送信中", "ボタンがくるくる", "処理中ボタン", "二重送信"],
  "success-state": ["完了画面", "できました", "成功", "終わった"],
  "error-state": ["失敗画面", "エラー画面", "うまくいかない", "再試行"],
  "notification-center": ["通知一覧", "ベル", "未読", "お知らせ一覧"],
  "sortable-table": ["並び替え", "表を並べ替え", "昇順降順", "ソート"],
  "filterable-table": ["表を絞る", "一覧をしぼる", "条件検索", "フィルター"],
  "selectable-table": ["表で選択", "まとめて選ぶ", "一括操作", "行を選ぶ"],
  "calendar-view": ["カレンダー", "予定表", "月表示", "スケジュール"],
  "kanban-board": ["カンバン", "タスク管理", "付箋を動かす", "進捗管理"],
  "activity-feed": ["履歴", "更新一覧", "最近の動き", "アクティビティ"],
  "metric-card": ["数字を見せる", "売上", "アクセス数", "KPI"],
  "sticky-header": [
    "上に固定",
    "ヘッダー固定",
    "スクロールしても残す",
    "追従ヘッダー",
  ],
  "sticky-sidebar": ["横に固定", "目次を固定", "サイド固定", "追従サイドバー"],
  "back-to-top": ["上に戻る", "ページ上部", "トップへ", "先頭へ戻る"],
  "scroll-progress": ["読み進み", "ページ進行", "スクロール量", "読了率"],
  "chat-widget": ["チャット", "問い合わせ", "右下の吹き出し", "チャットボット"],
  "sticky-cta-bar": ["固定ボタン", "下に固定", "申し込むボタン", "追従CTA"],
  "sortable-list": [
    "並べ替える",
    "ドラッグ",
    "順番変更",
    "ドラッグアンドドロップ",
  ],
  "resizable-split-pane": [
    "幅を変える",
    "左右を分ける",
    "画面分割",
    "リサイズ",
  ],
  "virtualized-list": ["大量一覧", "たくさん表示", "重いリスト", "仮想リスト"],
  "tree-view": ["階層", "フォルダ", "ツリー", "ツリービュー"],
  hamburger: [
    ...searchAliases.hamburger,
    "三本線",
    "さんほんせん",
    "サンホンセン",
    "hambuger",
    "hamburger menu",
  ],
});
Object.assign(searchAliases, {
  accordion: [
    ...searchAliases.accordion,
    "押すと開く",
    "クリックすると開く",
    "質問を押すと答えが出る",
    "質問 押す 答え",
    "答え",
    "隠れている内容",
  ],
  modal: [
    ...searchAliases.modal,
    "画面の上に出る",
    "画面の上に出てくる",
    "背景が暗くなる",
    "別ウィンドウ",
    "クリックすると出る",
  ],
  carousel: [
    ...searchAliases.carousel,
    "画像が横に動く",
    "バナーが動く",
    "次の画像",
    "写真が横に動く",
    "写真がスライドする",
  ],
  dropdown: [
    ...searchAliases.dropdown,
    "クリックすると選択肢が出る",
    "選択肢が出る",
    "押すと選べる",
  ],
  tooltip: [
    ...searchAliases.tooltip,
    "マウスを乗せると説明が出る",
    "マウスを乗せると説明",
    "ホバーで説明",
    "カーソルを乗せる",
  ],
  floating: [
    ...searchAliases.floating,
    "右下にずっとあるボタン",
    "右下に固定",
    "右下の丸いボタン",
  ],
  tabs: [...searchAliases.tabs, "押すと中身が切り替わる", "内容を切り替える"],
  combobox: [
    ...searchAliases.combobox,
    "検索候補が下に出てくる",
    "入力候補が下に出る",
  ],
  skeleton: [
    ...searchAliases.skeleton,
    "読み込み中に灰色の形が出る",
    "灰色の形",
  ],
  "range-slider": [
    ...searchAliases["range-slider"],
    "左右に動かして数値を変える",
    "左右に動かして数字を変える",
    "つまみを動かす",
  ],
});
const fuzzySearchIntents: Array<{ phrases: string[]; slugs: string[] }> = [
  {
    phrases: [
      "押す",
      "押したい",
      "押せば",
      "タップしたい",
      "クリックしたい",
      "実行したい",
      "次へ進みたい",
      "問い合わせたい",
    ],
    slugs: ["button", "floating", "pagination", "quantity-stepper"],
  },
  {
    phrases: [
      "押したら出る",
      "開いたり閉じたり",
      "開きたい",
      "開けたい",
      "開く",
      "閉じたい",
      "閉じる",
      "出したい",
      "出す",
    ],
    slugs: [
      "accordion",
      "modal",
      "dropdown",
      "drawer",
      "hamburger",
      "mega-menu",
      "lightbox",
      "popover",
      "header",
    ],
  },
  { phrases: ["横から出る"], slugs: ["drawer"] },
  { phrases: ["画面の真ん中に出る"], slugs: ["modal"] },
  {
    phrases: ["ポップアップ"],
    slugs: ["modal", "popover", "tooltip", "toast"],
  },
  {
    phrases: ["メニューを見たい", "スマホのメニュー", "三本線"],
    slugs: ["hamburger", "header"],
  },
  {
    phrases: [
      "写真を大きく",
      "画像を大きく",
      "写真を拡大",
      "写真を見たい",
      "画像を見たい",
      "拡大したい",
    ],
    slugs: ["lightbox"],
  },
  {
    phrases: [
      "選びたい",
      "選ぶ",
      "選択したい",
      "どれにする",
      "チェックしたい",
      "評価したい",
      "星をつけたい",
      "星をつける",
      "プルダウン",
      "オンオフ",
    ],
    slugs: [
      "dropdown",
      "select",
      "checkbox",
      "radio",
      "toggle",
      "rating",
      "chip",
    ],
  },
  {
    phrases: [
      "文字を入力",
      "文字入力",
      "入力したい",
      "入力するところ",
      "書きたい",
      "フォームを作りたい",
      "メールを入れたい",
      "パスワードを入れたい",
      "日付を選びたい",
      "日を選ぶ",
    ],
    slugs: [
      "search",
      "validation",
      "password",
      "date-picker",
      "file-upload",
      "select",
      "checkbox",
      "radio",
      "slider",
      "range-slider",
      "quantity-stepper",
    ],
  },
  {
    phrases: [
      "探したい",
      "さがしたい",
      "見つけたい",
      "調べたい",
      "検索したい",
      "キーワードで探す",
    ],
    slugs: ["search"],
  },
  {
    phrases: [
      "進み具合",
      "どこまで進んだ",
      "今何番目",
      "読み込み中",
      "くるくる待つ",
      "待っている",
      "処理中",
      "手順を見せたい",
    ],
    slugs: ["progress", "skeleton", "stepper", "pagination"],
  },
  {
    phrases: [
      "保存できた",
      "保存した",
      "お知らせしたい",
      "通知したい",
      "注意を出したい",
      "エラーを見せたい",
      "間違いを教えて",
      "成功を伝えたい",
    ],
    slugs: ["toast", "alert", "badge", "validation"],
  },
  {
    phrases: [
      "消したい",
      "削除したい",
      "外したい",
      "取り消したい",
      "元に戻したい",
      "やり直したい",
    ],
    slugs: ["chip", "alert", "cookie-banner", "card"],
  },
  {
    phrases: [
      "並べたい",
      "商品を並べる",
      "比較したい",
      "一覧にしたい",
      "履歴を見せたい",
      "予定を見せたい",
      "今どこにいる",
      "今どこのページ",
      "順番を見せたい",
      "ページをめくる",
      "次へ前へ",
    ],
    slugs: [
      "card",
      "table",
      "timeline",
      "breadcrumb",
      "pagination",
      "stepper",
      "carousel",
      "navigation",
    ],
  },
  {
    phrases: ["ファイルを送りたい", "画像を選びたい", "アップロードしたい"],
    slugs: ["file-upload"],
  },
  {
    phrases: [
      "切り替えたい",
      "表示を変えたい",
      "横に動かしたい",
      "写真を何枚も見せる",
      "ページを変えたい",
      "値を変えたい",
      "数字を増やす",
    ],
    slugs: [
      "tabs",
      "carousel",
      "slider",
      "range-slider",
      "pagination",
      "quantity-stepper",
    ],
  },
  {
    phrases: [
      "人を表示したい",
      "人の丸い画像",
      "プロフィールを見せたい",
      "アイコンを付けたい",
      "新着を付けたい",
      "新着の丸い数字",
      "件数を見せたい",
    ],
    slugs: ["avatar", "badge"],
  },
  {
    phrases: ["条件を選んで絞る"],
    slugs: ["chip", "dropdown", "drawer", "search"],
  },
  { phrases: ["まだ何もない"], slugs: ["empty-state"] },
  { phrases: ["クッキーの許可"], slugs: ["cookie-banner"] },
  { phrases: ["よくある質問"], slugs: ["accordion"] },
  {
    phrases: [
      "上に固定",
      "スクロールしても残す",
      "追従させたい",
      "ずっと表示したい",
    ],
    slugs: [
      "sticky-header",
      "sticky-sidebar",
      "sticky-cta-bar",
      "floating",
      "back-to-top",
      "chat-widget",
    ],
  },
  {
    phrases: ["右下に固定", "右下のボタン", "ページの上に戻る"],
    slugs: ["floating", "chat-widget", "back-to-top"],
  },
  {
    phrases: ["期間を選びたい", "いつからいつまで", "開始日と終了日"],
    slugs: ["date-range-picker"],
  },
  {
    phrases: ["候補を出したい", "入力候補", "打つと候補"],
    slugs: ["combobox", "search", "tag-input"],
  },
  {
    phrases: [
      "表を並べ替えたい",
      "昇順にしたい",
      "表を絞りたい",
      "一覧を絞りたい",
    ],
    slugs: ["sortable-table", "filterable-table", "selectable-table"],
  },
  {
    phrases: [
      "ドラッグで並べ替え",
      "順番を変えたい",
      "左右の幅を変えたい",
      "たくさんのデータ",
    ],
    slugs: [
      "sortable-list",
      "resizable-split-pane",
      "virtualized-list",
      "tree-view",
    ],
  },
  {
    phrases: [
      "料金を見せたい",
      "プランを比べたい",
      "口コミを載せたい",
      "記事を並べたい",
    ],
    slugs: ["pricing-table", "testimonial", "article-list", "feature-list"],
  },
];
const matchesPartSearch = (
  part: Part,
  terms: string[],
  normalizedQuery: string,
) => {
  const searchable = normalize(
    [
      part.name,
      part.slug,
      categoryOf(part),
      part.description,
      part.reason,
      ...(searchAliases[part.slug] ?? []),
    ].join(" "),
  );
  if (
    ["何これ", "なにこれ", "名前がわからない", "よくわからない"].some(
      (phrase) => normalizedQuery.includes(normalize(phrase)),
    )
  )
    return true;
  if (terms.every((term) => searchable.includes(term))) return true;
  return fuzzySearchIntents.some(
    (intent) =>
      intent.slugs.includes(part.slug) &&
      intent.phrases.some((phrase) =>
        normalizedQuery.includes(normalize(phrase)),
      ),
  );
};
const scorePartSearch = (
  part: Part,
  terms: string[],
  normalizedQuery: string,
) => {
  if (!normalizedQuery) return 0;
  const name = normalize(part.name);
  const slug = normalize(part.slug);
  const aliases = (searchAliases[part.slug] ?? []).map(normalize);
  let score = 0;
  if (name === normalizedQuery || slug === normalizedQuery) score += 1000;
  if (aliases.includes(normalizedQuery)) score += 800;
  if (name.includes(normalizedQuery) || slug.includes(normalizedQuery))
    score += 500;
  if (aliases.some((alias) => alias.includes(normalizedQuery))) score += 400;
  if (
    terms.every((term) =>
      normalize(
        [
          part.name,
          part.slug,
          categoryOf(part),
          ...(searchAliases[part.slug] ?? []),
        ].join(" "),
      ).includes(term),
    )
  )
    score += 100;
  if (
    fuzzySearchIntents.some(
      (intent) =>
        intent.slugs.includes(part.slug) &&
        intent.phrases.some((phrase) =>
          normalizedQuery.includes(normalize(phrase)),
        ),
    )
  )
    score += 300;
  return score;
};
const codeSamples: Record<string, string> = {
  header: `<header class="component-header"><strong>WEB</strong><button class="header-menu" type="button" aria-expanded="false" aria-controls="header-navigation">☰ メニュー</button></header><nav class="inline-menu" id="header-navigation" hidden><a href="#">デザイン</a><a href="#">パーツ一覧</a></nav>\n<style>\n.component-header { align-items: center; border-bottom: 1px solid #d5dce7; color: #223555; display: flex; justify-content: space-between; padding-bottom: 10px; width: 100%; }\n.component-header strong { font-size: 18px; letter-spacing: .08em; }\n.header-menu { background: #fff; border: 1px solid #223555; border-radius: 4px; color: #223555; padding: 6px 9px; }\n</style>\n<script>\nconst headerMenu = document.querySelector('.header-menu'); const headerNav = document.querySelector('.inline-menu');\nheaderMenu.onclick = () => { const open = headerMenu.getAttribute('aria-expanded') === 'true'; headerMenu.setAttribute('aria-expanded', String(!open)); headerNav.hidden = open; };\n</script>`,
  navigation: `<nav class="navigation-demo" aria-label="メインナビゲーション"><button aria-current="page">ホーム</button><button>パーツ</button><button>使い方</button></nav><p class="navigation-result">ホームを表示中</p>\n<style>\n.navigation-demo { border-bottom: 1px solid #d5dce7; display: flex; gap: 4px; width: 100%; }\n.navigation-demo button { background: transparent; border: 0; border-bottom: 2px solid transparent; color: #667085; padding: 8px 7px; }\n.navigation-demo button[aria-current="page"] { border-color: #f07a25; color: #223555; font-weight: 700; }\n.navigation-result { color: #667085; margin: 9px 0 0; }\n</style>\n<script>\nconst navigationLinks = [...document.querySelectorAll('.navigation-demo button')]; const navigationResult = document.querySelector('.navigation-result');\nnavigationLinks.forEach((link) => link.onclick = () => { navigationLinks.forEach((item) => item.removeAttribute('aria-current')); link.setAttribute('aria-current', 'page'); navigationResult.textContent = link.textContent + 'を表示中'; });\n</script>`,
  button: `<button class="button" type="button">お問い合わせ</button>\n<script>\nconst button = document.querySelector('.button');\nbutton.onclick = () => { button.textContent = '送信しました ✓'; button.disabled = true; };\n</script>`,
  accordion: `<div class="accordion">\n  <button class="accordion-trigger" aria-expanded="false" aria-controls="accordion-panel-1">料金について <span aria-hidden="true">+</span></button>\n  <p class="accordion-panel" id="accordion-panel-1" hidden>基本プランは月額0円から利用できます。</p>\n</div>\n\n<style>\n.accordion { border: 1px solid #d5dce7; max-width: 500px; }\n.accordion-trigger { align-items: center; background: #fff; border: 0; color: #223555; display: flex; font-weight: 700; justify-content: space-between; padding: 13px 15px; text-align: left; width: 100%; }\n.accordion-trigger span { color: #f07a25; font-size: 20px; }\n.accordion-panel { border-top: 1px solid #d5dce7; color: #667085; margin: 0; padding: 12px 15px; }\n</style>\n\n<script>\nconst trigger = document.querySelector('.accordion-trigger');\nconst panel = document.querySelector('.accordion-panel');\ntrigger.onclick = () => {\n  const open = trigger.getAttribute('aria-expanded') === 'true';\n  trigger.setAttribute('aria-expanded', String(!open));\n  trigger.querySelector('span').textContent = open ? '+' : '−';\n  panel.hidden = open;\n};\n</script>`,
  modal: `<button class="outline-button" id="open-modal" type="button" aria-haspopup="dialog" aria-controls="modal">確認画面を開く</button>\n<dialog id="modal" aria-labelledby="modal-title"><h2 id="modal-title">保存しますか？</h2><p>内容を保存してもよろしいですか？</p><button class="button" type="button">保存する</button><button class="text-button modal-close" type="button" aria-label="モーダルを閉じる">閉じる</button></dialog>\n<script>\nconst modal = document.querySelector('#modal');\nconst openModal = document.querySelector('#open-modal');\nopenModal.onclick = () => modal.showModal();\nmodal.querySelectorAll('button').forEach((button) => button.onclick = () => modal.close());\nmodal.addEventListener('close', () => openModal.focus());\n</script>`,
  card: `<article class="card">\n  <div class="card-image">UI</div><div><small>Web design</small><strong>読みやすいカード</strong>\n  <button class="text-button favorite-button" type="button">☆ お気に入り</button></div>\n</article>\n<script>\nconst favorite = document.querySelector('.favorite-button');\nfavorite.onclick = () => { favorite.textContent = favorite.textContent.includes('☆') ? '★ 保存済み' : '☆ お気に入り'; };\n</script>`,
  tabs: `<div class="tabs">\n  <div role="tablist" aria-label="コンテンツ">\n    <button role="tab" id="tab-overview" aria-selected="true" aria-controls="tab-panel" tabindex="0">概要</button>\n    <button role="tab" id="tab-usage" aria-selected="false" aria-controls="tab-panel" tabindex="-1">使い方</button>\n    <button role="tab" id="tab-notes" aria-selected="false" aria-controls="tab-panel" tabindex="-1">注意点</button>\n  </div>\n  <p id="tab-panel" role="tabpanel" aria-labelledby="tab-overview">同じ種類の内容を、ひとつの場所で切り替えます。</p>\n</div>\n\n<style>\n.tabs [role="tablist"] { border-bottom: 1px solid #d5dce7; display: flex; }\n.tabs [role="tab"] { background: transparent; border: 0; border-bottom: 2px solid transparent; color: #667085; flex: 1; padding: 8px 0; }\n.tabs [role="tab"][aria-selected="true"] { border-color: #f07a25; color: #223555; font-weight: 700; }\n.tabs p { color: #667085; margin: 10px 0 0; }\n</style>\n\n<script>\nconst tabs = [...document.querySelectorAll('[role="tab"]')];\nconst panel = document.querySelector('[role="tabpanel"]');\nconst messages = ['同じ種類の内容を、ひとつの場所で切り替えます。', 'タブ名は短く、内容が想像できる言葉にします。', 'タブを増やしすぎないように注意します。'];\nconst selectTab = (tab) => { const index = tabs.indexOf(tab); tabs.forEach((item) => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; }); panel.setAttribute('aria-labelledby', tab.id); panel.textContent = messages[index]; };\ntabs.forEach((tab) => { tab.onclick = () => selectTab(tab); tab.onkeydown = (event) => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (tabs.indexOf(tab) + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length; tabs[index].focus(); selectTab(tabs[index]); }; });\n</script>`,
  carousel: `<div class="carousel" role="region" aria-label="おすすめ記事のカルーセル"><div class="carousel-stage" aria-live="polite"><span>01</span><strong>記事カード</strong></div><div class="carousel-controls"><button class="previous" type="button" aria-label="前のスライド">←</button><span>1 / 3</span><button class="next" type="button" aria-label="次のスライド">→</button></div></div>\n<script>\nconst slides = ['記事カード', '商品カード', 'プロフィール']; let index = 0;\nconst update = () => { document.querySelector('.carousel-stage span').textContent = String(index + 1).padStart(2, '0'); document.querySelector('.carousel-stage strong').textContent = slides[index]; document.querySelector('.carousel-controls span').textContent = (index + 1) + ' / ' + slides.length; };\ndocument.querySelector('.previous').onclick = () => { index = (index + slides.length - 1) % slides.length; update(); };\ndocument.querySelector('.next').onclick = () => { index = (index + 1) % slides.length; update(); };\n</script>`,
  dropdown: `<div class="menu-demo"><button class="demo-trigger" aria-expanded="false" aria-controls="dropdown-menu">選択してください　⌄</button><ul class="demo-menu" id="dropdown-menu" role="menu" hidden><li role="none"><button role="menuitem">デザイン</button></li><li role="none"><button role="menuitem">コーディング</button></li><li role="none"><button role="menuitem">学習</button></li></ul></div>\n<script>\nconst trigger = document.querySelector('.demo-trigger'); const menu = document.querySelector('.demo-menu');\ntrigger.onclick = () => { const open = trigger.getAttribute('aria-expanded') === 'true'; trigger.setAttribute('aria-expanded', String(!open)); menu.hidden = open; };\nmenu.onclick = (event) => { if (event.target.matches('button')) { trigger.textContent = event.target.textContent + '　⌄'; trigger.setAttribute('aria-expanded', 'false'); menu.hidden = true; trigger.focus(); } };\n</script>`,
  tooltip: `<span class="tooltip-wrap" tabindex="0">？<span role="tooltip">補足説明です</span></span>`,
  toast: `<button class="button toast-trigger" type="button">保存する</button><p class="toast" role="status" hidden>✓ 保存しました</p>\n<script>\nconst toast = document.querySelector('.toast'); document.querySelector('.toast-trigger').onclick = () => { toast.hidden = false; setTimeout(() => toast.hidden = true, 1800); };\n</script>`,
  drawer: `<button class="demo-trigger drawer-trigger" aria-expanded="false" aria-controls="filter-drawer">フィルターを開く</button><aside class="drawer" id="filter-drawer" aria-label="絞り込み" hidden><b>絞り込み</b><button>デザイン</button><button>コード</button><button class="drawer-close" type="button" aria-label="ドロワーを閉じる">閉じる</button></aside>\n<script>\nconst drawerTrigger = document.querySelector('.drawer-trigger'); const drawer = document.querySelector('.drawer'); const drawerClose = document.querySelector('.drawer-close'); const setDrawer = (open) => { drawerTrigger.setAttribute('aria-expanded', String(open)); drawer.hidden = !open; if (!open) drawerTrigger.focus(); }; drawerTrigger.onclick = () => setDrawer(drawer.hidden); drawerClose.onclick = () => setDrawer(false);\n</script>`,
  toggle: `<label class="switch"><input type="checkbox" role="switch" /><span></span>通知を受け取る</label>`,
  checkbox: `<label><input class="choice-input" type="checkbox" /> メールを受け取る <b class="choice-result">未選択</b></label>\n<script>\nconst check = document.querySelector('.choice-input'); const checkResult = document.querySelector('.choice-result'); check.onchange = () => checkResult.textContent = check.checked ? '選択中' : '未選択';\n</script>`,
  radio: `<fieldset class="choice-group"><legend>お客さま区分</legend><label><input type="radio" name="kind" value="個人" /> 個人</label><label><input type="radio" name="kind" value="法人" /> 法人</label><p>選択してください</p></fieldset>\n<script>\nconst group = document.querySelector('.choice-group'); group.onchange = (event) => group.querySelector('p').textContent = event.target.value + 'を選択中';\n</script>`,
  select: `<label>色を選ぶ <select class="select-demo"><option value="">選択してください</option><option>ネイビー</option><option>オレンジ</option></select></label><p class="select-result">未選択</p>\n<script>\nconst select = document.querySelector('.select-demo'); select.onchange = () => document.querySelector('.select-result').textContent = select.value || '未選択';\n</script>`,
  search: `<label class="search-demo">⌕ <input type="search" placeholder="button と入力" /></label><p class="search-result">キーワードを入力</p>\n<script>\nconst search = document.querySelector('.search-demo input'); search.oninput = () => document.querySelector('.search-result').textContent = search.value ? '「' + search.value + '」の検索結果' : 'キーワードを入力';\n</script>`,
  pagination: `<nav class="pagination" aria-label="ページ送り"><button aria-current="page">1</button><button>2</button><button>3</button></nav>\n<script>\ndocument.querySelector('.pagination').onclick = (event) => { if (event.target.matches('button')) document.querySelectorAll('.pagination button').forEach((button) => button.setAttribute('aria-current', String(button === event.target))); };\n</script>`,
  hamburger: `<button class="demo-trigger hamburger" aria-expanded="false" aria-controls="hamburger-menu">☰ メニュー</button><nav class="inline-menu" id="hamburger-menu" hidden><a href="#">デザイン</a><a href="#">コード</a></nav>\n<script>\nconst hamburger = document.querySelector('.hamburger'); const inlineMenu = document.querySelector('.inline-menu'); hamburger.onclick = () => { const open = hamburger.getAttribute('aria-expanded') === 'true'; hamburger.setAttribute('aria-expanded', String(!open)); inlineMenu.hidden = open; };\n</script>`,
  "mega-menu": `<div class="menu-demo"><button class="demo-trigger mega-trigger" aria-expanded="false" aria-controls="mega-menu-panel">製品メニュー　⌄</button><nav class="mega-menu" id="mega-menu-panel" hidden><b>制作</b><a href="#">Webサイト</a><a href="#">バナー</a></nav></div>\n<script>\nconst megaTrigger = document.querySelector('.mega-trigger'); const megaMenu = document.querySelector('.mega-menu'); megaTrigger.onclick = () => { const open = megaTrigger.getAttribute('aria-expanded') === 'true'; megaTrigger.setAttribute('aria-expanded', String(!open)); megaMenu.hidden = open; };\n</script>`,
  lightbox: `<button class="demo-trigger lightbox-trigger" type="button" aria-haspopup="dialog" aria-controls="image-lightbox">画像を拡大</button><dialog class="lightbox" id="image-lightbox" aria-label="画像を拡大表示"><strong>IMAGE</strong><small>拡大画像のサンプルです</small><button class="lightbox-close" type="button" aria-label="ライトボックスを閉じる">閉じる</button></dialog>\n<script>\nconst lightbox = document.querySelector('.lightbox'); const lightboxTrigger = document.querySelector('.lightbox-trigger'); const closeLightbox = () => lightbox.close(); lightboxTrigger.onclick = () => lightbox.showModal(); lightbox.querySelector('.lightbox-close').onclick = closeLightbox; lightbox.addEventListener('close', () => lightboxTrigger.focus());\n</script>`,
  validation: `<label>メールアドレス <input class="email-input" type="email" placeholder="hello@example.com" /></label><p class="validation-result" aria-live="polite">メールアドレスを入力してください。</p>\n<script>\nconst email = document.querySelector('.email-input'); const validation = document.querySelector('.validation-result'); email.oninput = () => { validation.textContent = email.value ? (email.validity.valid ? '✓ 入力OKです' : 'メールアドレスを確認してください。') : 'メールアドレスを入力してください。'; validation.dataset.status = email.validity.valid && email.value ? 'success' : 'error'; };\n</script>`,
  progress: `<div class="progress-demo"><progress value="35" max="100">35%</progress><span>35%</span><button class="text-button" type="button">進める</button></div>\n<script>\nconst progress = document.querySelector('progress'); const progressText = document.querySelector('.progress-demo span'); document.querySelector('.progress-demo button').onclick = () => { progress.value = progress.value >= 100 ? 0 : progress.value + 15; progressText.textContent = progress.value + '%'; };\n</script>`,
  skeleton: `<div class="skeleton-demo"><div class="skeleton" aria-busy="true"></div><button class="text-button" type="button">読み込みを再現</button><p>コンテンツを表示しました</p></div>\n<script>\nconst skeleton = document.querySelector('.skeleton'); const loadedText = document.querySelector('.skeleton-demo p'); document.querySelector('.skeleton-demo button').onclick = () => { skeleton.hidden = false; loadedText.hidden = true; setTimeout(() => { skeleton.hidden = true; loadedText.hidden = false; }, 900); };\n</script>`,
  stepper: `<div class="stepper"><ol><li aria-current="step">入力</li><li>確認</li><li>完了</li></ol><button class="text-button" type="button">次へ</button></div>\n<script>\nconst steps = [...document.querySelectorAll('.stepper li')]; let step = 0; document.querySelector('.stepper button').onclick = () => { step = (step + 1) % steps.length; steps.forEach((item, index) => item.toggleAttribute('aria-current', index === step)); };\n</script>`,
  "file-upload": `<label class="file-demo">ファイルを選択 <input type="file" accept="image/*,.pdf" /><span>未選択</span></label>\n<script>\nconst file = document.querySelector('.file-demo input'); file.onchange = () => document.querySelector('.file-demo span').textContent = file.files[0]?.name || '未選択';\n</script>`,
  "date-picker": `<label>日付 <input class="date-demo" type="date" /></label><p class="date-result">日付を選んでください</p>\n<script>\nconst date = document.querySelector('.date-demo'); date.onchange = () => document.querySelector('.date-result').textContent = date.value || '日付を選んでください';\n</script>`,
  password: `<label>パスワード <input class="password-input" type="password" value="sample123" /></label><button class="text-button password-toggle" type="button">表示</button>\n<script>\nconst password = document.querySelector('.password-input'); const passwordToggle = document.querySelector('.password-toggle'); passwordToggle.onclick = () => { const show = password.type === 'password'; password.type = show ? 'text' : 'password'; passwordToggle.textContent = show ? '隠す' : '表示'; };\n</script>`,
  floating: `<button class="floating-button" type="button" aria-label="お問い合わせ">+</button><p class="floating-message" hidden>お問い合わせを開きます</p>\n<script>\nconst floating = document.querySelector('.floating-button'); const floatingMessage = document.querySelector('.floating-message'); floating.onclick = () => floatingMessage.hidden = !floatingMessage.hidden;\n</script>`,
  popover: `<button class="demo-trigger popover-trigger" type="button" aria-expanded="false" aria-controls="popover-content">詳細　i</button><p class="popover" id="popover-content" hidden>ここに補足情報を表示します。</p>\n<script>\nconst popoverTrigger = document.querySelector('.popover-trigger'); const popover = document.querySelector('.popover'); popoverTrigger.onclick = () => { const open = popoverTrigger.getAttribute('aria-expanded') === 'true'; popoverTrigger.setAttribute('aria-expanded', String(!open)); popover.hidden = open; };\n</script>`,
  slider: `<label>音量 <input class="range-input" type="range" min="0" max="100" value="35" /> <output>35%</output></label>\n<script>\nconst slider = document.querySelector('.range-input'); const sliderOutput = document.querySelector('output'); slider.oninput = () => sliderOutput.textContent = slider.value + '%';\n</script>`,
  rating: `<fieldset class="rating"><legend>評価</legend><div><button type="button" aria-label="1点">★</button><button type="button" aria-label="2点">★</button><button type="button" aria-label="3点">★</button><button type="button" aria-label="4点">★</button><button type="button" aria-label="5点">★</button></div><output>未評価</output></fieldset>\n<script>\nconst stars = [...document.querySelectorAll('.rating button')]; const ratingOutput = document.querySelector('.rating output'); stars.forEach((star, index) => star.onclick = () => { stars.forEach((item, itemIndex) => item.classList.toggle('selected', itemIndex <= index)); ratingOutput.textContent = (index + 1) + ' / 5'; });\n</script>`,
  "range-slider": `<label>価格帯 <input class="range-input" type="range" min="0" max="100" value="35" /> <output>35〜100</output></label>\n<script>\nconst range = document.querySelector('.range-input'); const rangeOutput = document.querySelector('output'); range.oninput = () => rangeOutput.textContent = range.value + '〜100';\n</script>`,
  breadcrumb: `<nav class="breadcrumb" aria-label="パンくず"><a href="#">ホーム</a><span>›</span><a href="#">パーツ一覧</a><span>›</span><b aria-current="page">Accordion</b></nav>`,
  chip: `<div class="chips"><span>デザイン <button type="button" aria-label="デザインを削除">×</button></span><span>初級 <button type="button" aria-label="初級を削除">×</button></span></div>\n<script>\ndocument.querySelector('.chips').onclick = (event) => { if (event.target.matches('button')) event.target.parentElement.remove(); };\n</script>`,
  alert: `<div class="alert" role="alert"><b>!</b><span>保存する前に入力内容をご確認ください。</span><button type="button" aria-label="閉じる">×</button></div>\n<script>\ndocument.querySelector('.alert button').onclick = (event) => event.currentTarget.parentElement.remove();\n</script>`,
  avatar: `<div class="avatar-demo"><span class="avatar" aria-label="ユーザー">U</span><div><b>ユーザー</b><small>メンバー</small></div></div>`,
  badge: `<button class="badge-demo" type="button">通知 <b>3</b></button>`,
  timeline: `<ol class="timeline"><li><b>01</b><span>デザインを決める</span></li><li><b>02</b><span>コードを書く</span></li><li><b>03</b><span>公開する</span></li></ol>`,
  table: `<table><thead><tr><th>プラン</th><th>月額</th></tr></thead><tbody><tr><td>Basic</td><td>0円</td></tr><tr><td>Pro</td><td>980円</td></tr></tbody></table>`,
  "empty-state": `<div class="empty-state"><b>○</b><strong class="empty-state-title">まだ保存したパーツはありません</strong><p class="empty-state-result" role="status" hidden>まずは気になるパーツから見てみましょう。</p><button class="button empty-state-action" type="button">パーツを探す</button><ul class="empty-state-suggestions" hidden><li>Button</li><li>Card</li><li>Form</li></ul></div>
<script>
const emptyAction = document.querySelector('.empty-state-action'); const emptyTitle = document.querySelector('.empty-state-title'); const emptyResult = document.querySelector('.empty-state-result'); const emptySuggestions = document.querySelector('.empty-state-suggestions');
emptyAction.onclick = () => { emptyTitle.textContent = '最初に見るならこの3つ'; emptyResult.hidden = false; emptySuggestions.hidden = false; emptyAction.textContent = '候補を表示しました ✓'; emptyAction.disabled = true; };
</script>`,
  "cookie-banner": `<div class="cookie-banner"><span>Cookieを利用して使いやすさを改善します。</span><button class="outline-button" type="button">拒否する</button><button class="button" type="button">許可する</button></div>\n<script>\ndocument.querySelector('.cookie-banner').onclick = (event) => { if (event.target.matches('button')) event.currentTarget.remove(); };\n</script>`,
  "quantity-stepper": `<div class="quantity"><button type="button" aria-label="減らす">−</button><output>1</output><button type="button" aria-label="増やす">＋</button></div>\n<script>\nlet quantity = 1; const quantityOutput = document.querySelector('.quantity output'); document.querySelector('.quantity').onclick = (event) => { if (!event.target.matches('button')) return; quantity = Math.max(1, quantity + (event.target.textContent === '＋' ? 1 : -1)); quantityOutput.textContent = quantity; };\n</script>`,
};
const generatedSampleStyle = `<style>
.generated-demo{display:grid;gap:9px;max-width:100%;width:100%}.generated-demo h3,.generated-demo p{margin:0}.generated-demo p{color:#667085;font-size:12px}.generated-demo .row{align-items:center;display:flex;flex-wrap:wrap;gap:7px}.generated-demo .panel{background:#f6f8fb;border:1px solid #d5dce7;border-radius:5px;padding:9px}.generated-demo .choice{background:#fff;border:1px solid #b8c3d4;border-radius:4px;color:#223555;padding:6px 9px}.generated-demo .choice[aria-pressed=true]{background:#223555;border-color:#223555;color:#fff}.generated-demo .stack{display:grid;gap:6px}.generated-demo .bar{background:#e9eef5;border-radius:99px;height:8px;overflow:hidden}.generated-demo .bar b{background:#f07a25;display:block;height:100%;width:42%}.generated-demo .mini-card{background:#fff;border:1px solid #d5dce7;border-radius:4px;padding:8px}.generated-demo .menu-panel{background:#fff;border:1px solid #d5dce7;border-radius:5px;box-shadow:0 8px 18px rgba(34,53,85,.12);padding:9px}.generated-demo .menu-panel button{background:transparent;border:0;color:#223555;padding:5px;text-align:left;width:100%}.generated-demo .fixed-demo{background:#223555;border-radius:5px;color:#fff;display:flex;justify-content:space-between;padding:8px}.generated-demo input[type=range]{accent-color:#f07a25;width:100%}.generated-demo .split{display:grid;grid-template-columns:1fr 1fr;gap:4px}.generated-demo .split>*{background:#e9eef5;padding:12px}.generated-demo .tree button{background:transparent;border:0;color:#223555;padding:3px}.generated-demo .comparison{background:linear-gradient(90deg,#223555 50%,#f07a25 50%);border-radius:5px;color:#fff;display:grid;height:72px;place-items:center}.generated-demo .spinner{animation:generated-spin 1s linear infinite;border:4px solid #e9eef5;border-radius:50%;border-top-color:#f07a25;height:30px;width:30px}@keyframes generated-spin{to{transform:rotate(1turn)}}
</style>`;
const createExtraPartSample = (part: Part) => {
  const title = part.name;
  const description = part.description;
  const formParts = [
    "text-input",
    "textarea",
    "phone-input",
    "address-form",
    "date-range-picker",
    "time-picker",
    "color-picker",
    "otp-input",
  ];
  const overlayParts = [
    "confirmation-dialog",
    "bottom-sheet",
    "fullscreen-menu",
    "context-menu",
  ];
  const selectableParts = ["segmented-control", "table-of-contents"];
  const fixedParts = [
    "sticky-header",
    "sticky-sidebar",
    "back-to-top",
    "scroll-progress",
    "chat-widget",
    "sticky-cta-bar",
  ];
  if (part.slug === "fullscreen-menu")
    return `${generatedSampleStyle}<div class="generated-demo"><button class="button full-menu-trigger" type="button" aria-expanded="false" aria-controls="full-menu">全画面メニューを開く</button><nav class="full-menu" id="full-menu" hidden aria-label="全画面メニュー" aria-modal="true"><button class="full-menu-close" type="button" aria-label="メニューを閉じる">×</button><b>MENU</b><a href="#">パーツを探す</a><a href="#">使い方を見る</a><a href="#">お問い合わせ</a></nav></div><style>.full-menu{align-content:center;background:#223555;color:#fff;display:grid;gap:18px;inset:0;padding:28px;position:fixed;text-align:center;z-index:10}.full-menu a{color:#fff;font-size:20px;font-weight:700;text-decoration:none}.full-menu-close{background:transparent;border:0;color:#fff;font-size:32px;justify-self:end}</style><script>const trigger=document.querySelector('.full-menu-trigger'),menu=document.querySelector('.full-menu'),close=document.querySelector('.full-menu-close');const setOpen=open=>{menu.hidden=!open;trigger.setAttribute('aria-expanded',String(open));if(!open)trigger.focus()};trigger.onclick=()=>setOpen(true);close.onclick=()=>setOpen(false);</script>`;
  if (part.slug === "bottom-sheet")
    return `${generatedSampleStyle}<div class="generated-demo"><button class="button sheet-trigger" type="button" aria-expanded="false" aria-controls="bottom-sheet-backdrop">操作を選ぶ</button><div class="sheet-backdrop" id="bottom-sheet-backdrop" hidden><section class="bottom-sheet" role="dialog" aria-modal="true" aria-label="操作を選ぶ"><span class="sheet-handle"></span><b>操作を選ぶ</b><button type="button">共有する</button><button type="button">保存する</button><button class="sheet-close" type="button">キャンセル</button></section></div></div><style>.sheet-backdrop{background:rgba(34,53,85,.35);inset:0;position:fixed;z-index:10}.bottom-sheet{background:#fff;border-radius:16px 16px 0 0;bottom:0;display:grid;gap:7px;left:0;padding:14px;position:absolute;right:0}.bottom-sheet button{background:#fff;border:1px solid #d5dce7;border-radius:5px;padding:9px;text-align:left}.bottom-sheet .sheet-close{color:#c23934}.sheet-handle{background:#b8c3d4;border-radius:99px;height:4px;justify-self:center;width:38px}</style><script>const trigger=document.querySelector('.sheet-trigger'),backdrop=document.querySelector('.sheet-backdrop'),close=document.querySelector('.sheet-close');const setOpen=open=>{backdrop.hidden=!open;trigger.setAttribute('aria-expanded',String(open));if(!open)trigger.focus()};trigger.onclick=()=>setOpen(true);close.onclick=()=>setOpen(false);</script>`;
  if (part.slug === "command-palette")
    return `${generatedSampleStyle}<div class="generated-demo"><button class="outline-button command-trigger" type="button" aria-expanded="false" aria-controls="command-panel">⌘ コマンドを開く</button><section class="command-panel" id="command-panel" role="dialog" aria-modal="true" hidden><input class="command-input" aria-label="コマンドを検索" placeholder="機能を検索" /><button type="button">⌕ パーツを探す</button><button type="button">☆ お気に入りを見る</button><button class="command-close" type="button">閉じる</button></section></div><style>.command-panel{background:#fff;border:1px solid #b8c3d4;border-radius:7px;box-shadow:0 12px 28px rgba(34,53,85,.2);display:grid;gap:6px;padding:10px}.command-panel button{background:#fff;border:0;padding:6px;text-align:left}.command-panel .command-close{color:#c23934}</style><script>const trigger=document.querySelector('.command-trigger'),panel=document.querySelector('.command-panel'),close=document.querySelector('.command-close');const setOpen=open=>{panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open));if(open)document.querySelector('.command-input').focus();else trigger.focus()};trigger.onclick=()=>setOpen(true);close.onclick=()=>setOpen(false);</script>`;
  if (part.slug === "bottom-navigation")
    return `${generatedSampleStyle}<nav class="bottom-nav" aria-label="下部ナビゲーション"><button type="button" aria-current="page">⌂<span>ホーム</span></button><button type="button">⌕<span>探す</span></button><button type="button">☆<span>保存</span></button></nav><style>.bottom-nav{background:#fff;border-top:1px solid #d5dce7;display:flex;justify-content:space-around;padding:8px}.bottom-nav button{background:transparent;border:0;color:#667085;display:grid;font-size:17px;gap:2px}.bottom-nav button[aria-current=page]{color:#f07a25}.bottom-nav span{font-size:10px}</style><script>const items=[...document.querySelectorAll('.bottom-nav button')];items.forEach(item=>item.onclick=()=>items.forEach(button=>button.toggleAttribute('aria-current',button===item)));</script>`;
  if (part.slug === "sidebar-navigation")
    return `${generatedSampleStyle}<div class="side-demo"><nav class="side-nav" aria-label="サイドバー"><button type="button" aria-current="page">概要</button><button type="button">デザイン</button><button type="button">設定</button></nav><main class="side-content" role="status">概要を表示中</main></div><style>.side-demo{display:grid;grid-template-columns:92px 1fr;min-height:100px}.side-nav{background:#223555;display:grid;padding:5px}.side-nav button{background:transparent;border:0;color:#dce4ef;padding:7px;text-align:left}.side-nav button[aria-current=page]{background:#fff;color:#223555}.side-content{background:#f6f8fb;padding:12px}</style><script>const items=[...document.querySelectorAll('.side-nav button')],content=document.querySelector('.side-content');items.forEach(item=>item.onclick=()=>{items.forEach(button=>button.toggleAttribute('aria-current',button===item));content.textContent=item.textContent+'を表示中'});</script>`;
  if (part.slug === "skip-link")
    return `${generatedSampleStyle}<a class="skip-link-demo" href="#sample-main">本文へ移動</a><main id="sample-main" tabindex="-1" class="panel">キーボードで最初に現れる本文へのリンクです。</main><style>.skip-link-demo{background:#223555;color:#fff;left:8px;padding:7px;position:absolute;top:-45px}.skip-link-demo:focus{top:8px}</style>`;
  if (part.slug === "textarea")
    return `${generatedSampleStyle}<div class="generated-demo"><label>お問い合わせ内容<textarea class="generated-input" rows="3" placeholder="内容を入力してください"></textarea></label><p class="generated-status" role="status">0文字</p></div><script>const field=document.querySelector('.generated-input'),status=document.querySelector('.generated-status');field.oninput=()=>status.textContent=field.value.length+'文字入力中';</script>`;
  if (part.slug === "combobox")
    return `${generatedSampleStyle}<div class="generated-demo"><label>パーツを検索<input class="combo-input" placeholder="例: ボタン" aria-expanded="false" /></label><div class="combo-list" hidden><button type="button">Button</button><button type="button">Bottom Sheet</button><button type="button">Breadcrumb</button></div><p class="generated-status" role="status">候補を入力してください</p></div><style>.combo-list{background:#fff;border:1px solid #d5dce7;display:grid}.combo-list button{background:#fff;border:0;padding:6px;text-align:left}</style><script>const input=document.querySelector('.combo-input'),list=document.querySelector('.combo-list'),status=document.querySelector('.generated-status');input.oninput=()=>{const open=input.value.length>0;list.hidden=!open;input.setAttribute('aria-expanded',String(open));status.textContent=open?'候補から選べます':'候補を入力してください'};list.onclick=e=>{if(e.target.matches('button')){input.value=e.target.textContent;list.hidden=true;input.setAttribute('aria-expanded','false');status.textContent=input.value+'を選択しました'}}</script>`;
  if (part.slug === "multi-select")
    return `${generatedSampleStyle}<fieldset class="generated-demo"><legend>興味のある分野</legend><label><input type="checkbox" value="デザイン" /> デザイン</label><label><input type="checkbox" value="実装" /> 実装</label><label><input type="checkbox" value="運用" /> 運用</label><p class="generated-status" role="status">未選択です</p></fieldset><script>const boxes=[...document.querySelectorAll('input')],status=document.querySelector('.generated-status');boxes.forEach(box=>box.onchange=()=>{const values=boxes.filter(item=>item.checked).map(item=>item.value);status.textContent=values.length?values.join(' / ')+'を選択中':'未選択です'})</script>`;
  if (part.slug === "tag-input")
    return `${generatedSampleStyle}<div class="generated-demo"><div class="tag-area"><input class="tag-input" placeholder="Enterで追加" /><div class="tag-list"></div></div><p class="generated-status" role="status">タグを追加できます</p></div><style>.tag-area{border:1px solid #b8c3d4;padding:6px}.tag-input{border:0;width:100%}.tag-list{display:flex;flex-wrap:wrap;gap:4px}.tag-list span{background:#e9eef5;border-radius:99px;padding:3px 7px}.tag-list button{background:transparent;border:0;padding-left:4px}</style><script>const input=document.querySelector('.tag-input'),list=document.querySelector('.tag-list'),status=document.querySelector('.generated-status');input.onkeydown=e=>{if(e.key==='Enter'&&input.value.trim()){e.preventDefault();const tag=document.createElement('span');tag.innerHTML=input.value.trim()+' <button type="button" aria-label="削除">×</button>';list.append(tag);input.value='';status.textContent='タグを追加しました'}};list.onclick=e=>{if(e.target.matches('button')){e.target.parentElement.remove();status.textContent='タグを削除しました'}}</script>`;
  if (part.slug === "otp-input")
    return `${generatedSampleStyle}<div class="generated-demo"><p>認証コードを入力</p><div class="otp-fields"><input inputmode="numeric" maxlength="1" aria-label="1桁目" /><input inputmode="numeric" maxlength="1" aria-label="2桁目" /><input inputmode="numeric" maxlength="1" aria-label="3桁目" /><input inputmode="numeric" maxlength="1" aria-label="4桁目" /></div><p class="generated-status" role="status">4桁を入力してください</p></div><style>.otp-fields{display:flex;gap:6px}.otp-fields input{font-size:20px;text-align:center;width:38px}</style><script>const fields=[...document.querySelectorAll('.otp-fields input')],status=document.querySelector('.generated-status');fields.forEach((field,index)=>field.oninput=()=>{if(field.value&&fields[index+1])fields[index+1].focus();const code=fields.map(item=>item.value).join('');status.textContent=code.length===4?'コードを入力しました':'あと'+(4-code.length)+'桁です'})</script>`;
  if (part.slug === "address-form")
    return `${generatedSampleStyle}<form class="generated-demo"><label>郵便番号<input class="zip" placeholder="123-4567" /></label><label>住所<input class="address" placeholder="市区町村・番地" /></label><p class="generated-status" role="status">配送先を入力してください</p></form><script>const zip=document.querySelector('.zip'),address=document.querySelector('.address'),status=document.querySelector('.generated-status');[zip,address].forEach(field=>field.oninput=()=>status.textContent=zip.value&&address.value?'配送先を確認できます':'配送先を入力してください')</script>`;
  if (part.slug === "date-range-picker")
    return `${generatedSampleStyle}<div class="generated-demo"><label>開始日<input class="range-start" type="date" value="2026-08-28" /></label><label>終了日<input class="range-end" type="date" value="2026-08-30" /></label><p class="generated-status" role="status">2泊3日</p></div><script>const start=document.querySelector('.range-start'),end=document.querySelector('.range-end'),status=document.querySelector('.generated-status');[start,end].forEach(field=>field.oninput=()=>{const days=Math.max(0,Math.round((new Date(end.value)-new Date(start.value))/86400000));status.textContent=days+'泊'+(days+1)+'日'})</script>`;
  if (part.slug === "confirmation-dialog")
    return `${generatedSampleStyle}<div class="generated-demo"><button class="button confirm-trigger" type="button">削除する</button><dialog class="confirm-dialog"><h3>本当に削除しますか？</h3><p>この操作は元に戻せません。</p><div><button class="outline-button confirm-cancel" type="button">キャンセル</button><button class="button confirm-apply" type="button">削除する</button></div></dialog><p class="generated-status" role="status"></p></div><script>const trigger=document.querySelector('.confirm-trigger'),dialog=document.querySelector('.confirm-dialog'),cancel=document.querySelector('.confirm-cancel'),apply=document.querySelector('.confirm-apply'),status=document.querySelector('.generated-status');trigger.onclick=()=>dialog.showModal();cancel.onclick=()=>dialog.close();apply.onclick=()=>{dialog.close();status.textContent='項目を削除しました';trigger.disabled=true}</script>`;
  if (part.slug === "context-menu")
    return `${generatedSampleStyle}<div class="generated-demo"><button class="context-trigger" type="button" aria-expanded="false" aria-label="その他の操作">⋮</button><div class="context-list" hidden><button type="button">編集する</button><button type="button">複製する</button><button type="button">削除する</button></div><p class="generated-status" role="status"></p></div><style>.context-trigger{background:#fff;border:1px solid #b8c3d4;border-radius:4px;font-size:20px}.context-list{background:#fff;border:1px solid #d5dce7;box-shadow:0 6px 15px rgba(34,53,85,.12);display:grid;padding:4px}.context-list button{background:#fff;border:0;padding:6px;text-align:left}</style><script>const trigger=document.querySelector('.context-trigger'),list=document.querySelector('.context-list'),status=document.querySelector('.generated-status');trigger.onclick=()=>{list.hidden=!list.hidden;trigger.setAttribute('aria-expanded',String(!list.hidden))};list.onclick=e=>{if(e.target.matches('button')){status.textContent=e.target.textContent+'を選択しました';list.hidden=true;trigger.setAttribute('aria-expanded','false')}}</script>`;
  if (part.slug === "table-of-contents")
    return `${generatedSampleStyle}<nav class="toc-sample" aria-label="目次"><a href="#intro" aria-current="location">はじめに</a><a href="#usage">使い方</a><a href="#notes">注意点</a></nav><p class="generated-status" role="status">はじめにを表示中</p><style>.toc-sample{border-left:2px solid #d5dce7;display:grid}.toc-sample a{padding:5px 8px;text-decoration:none}.toc-sample a[aria-current=location]{border-left:2px solid #f07a25;color:#f07a25;font-weight:700;margin-left:-2px}</style><script>const links=[...document.querySelectorAll('.toc-sample a')],status=document.querySelector('.generated-status');links.forEach(link=>link.onclick=e=>{e.preventDefault();links.forEach(item=>item.toggleAttribute('aria-current',item===link));status.textContent=link.textContent+'を表示中'})</script>`;
  if (formParts.includes(part.slug))
    return `${generatedSampleStyle}<div class="generated-demo"><label>${title}<input class="generated-input" ${part.slug === "time-picker" ? 'type="time" value="10:30"' : part.slug === "color-picker" ? 'type="color" value="#f07a25"' : part.slug === "date-range-picker" ? 'type="date" value="2026-08-28"' : 'placeholder="入力してください"'} /></label><p class="generated-status" role="status">未入力です</p></div><script>const field=document.querySelector('.generated-input'),status=document.querySelector('.generated-status');field.oninput=()=>status.textContent=field.value?'入力内容: '+field.value:'未入力です';</script>`;
  if (overlayParts.includes(part.slug))
    return `${generatedSampleStyle}<div class="generated-demo"><button class="button generated-trigger" type="button" aria-expanded="false">${title}を開く</button><div class="menu-panel generated-panel" hidden><b>${title}</b><p>${description}</p><button class="outline-button generated-close" type="button">閉じる</button></div></div><script>const trigger=document.querySelector('.generated-trigger'),panel=document.querySelector('.generated-panel'),close=document.querySelector('.generated-close');const setOpen=open=>{trigger.setAttribute('aria-expanded',String(open));panel.hidden=!open};trigger.onclick=()=>setOpen(panel.hidden);close.onclick=()=>setOpen(false);</script>`;
  if (selectableParts.includes(part.slug))
    return `${generatedSampleStyle}<div class="generated-demo"><div class="row generated-choices"><button class="choice" type="button" aria-pressed="true">おすすめ</button><button class="choice" type="button" aria-pressed="false">新着</button><button class="choice" type="button" aria-pressed="false">人気</button></div><p class="generated-status" role="status">おすすめを選択中</p></div><script>const choices=[...document.querySelectorAll('.generated-choices button')],status=document.querySelector('.generated-status');choices.forEach(choice=>choice.onclick=()=>{choices.forEach(item=>item.setAttribute('aria-pressed',String(item===choice)));status.textContent=choice.textContent+'を選択中'});</script>`;
  if (part.slug === "sticky-header")
    return `${generatedSampleStyle}<div class="sticky-demo"><header>WEB PARTS <button type="button">メニュー</button></header><p>ここをスクロールしても上部のヘッダーが残ります。</p><p>本文コンテンツ</p><p>本文コンテンツ</p></div><style>.sticky-demo{height:120px;overflow:auto}.sticky-demo header{align-items:center;background:#223555;color:#fff;display:flex;justify-content:space-between;padding:8px;position:sticky;top:0}.sticky-demo header button{background:#fff;border:0;border-radius:3px;padding:4px}</style>`;
  if (part.slug === "sticky-sidebar")
    return `${generatedSampleStyle}<div class="sticky-side-demo"><aside><a href="#">概要</a><a href="#">使い方</a><a href="#">注意点</a></aside><article><p>長い本文を読み進める間も、左の目次を確認できます。</p><p>コンテンツ</p><p>コンテンツ</p></article></div><style>.sticky-side-demo{display:grid;grid-template-columns:72px 1fr;height:120px;overflow:auto}.sticky-side-demo aside{align-self:start;background:#e9eef5;display:grid;gap:5px;padding:7px;position:sticky;top:0}.sticky-side-demo aside a{font-size:11px}.sticky-side-demo article{padding:0 8px}</style>`;
  if (part.slug === "back-to-top")
    return `${generatedSampleStyle}<div class="top-demo"><p class="top-message" role="status">下までスクロールした想定です</p><button class="top-button" type="button">↑<span>上に戻る</span></button></div><style>.top-demo{background:#f6f8fb;min-height:100px;padding:10px;position:relative}.top-button{background:#f07a25;border:0;border-radius:50%;bottom:10px;color:#fff;height:50px;position:absolute;right:10px;width:50px}.top-button span{font-size:8px;left:-8px;position:absolute;top:31px;width:66px}</style><script>document.querySelector('.top-button').onclick=()=>{document.querySelector('.top-message').textContent='ページの先頭へ戻りました'}</script>`;
  if (part.slug === "scroll-progress")
    return `${generatedSampleStyle}<div class="generated-demo"><div class="scroll-bar"><b></b></div><input class="scroll-range" type="range" min="0" max="100" value="35" aria-label="読み進み" /><p class="generated-status" role="status">35% 読み進みました</p></div><style>.scroll-bar{background:#e9eef5;height:7px}.scroll-bar b{background:#f07a25;display:block;height:100%;width:35%}</style><script>const range=document.querySelector('.scroll-range'),bar=document.querySelector('.scroll-bar b'),status=document.querySelector('.generated-status');range.oninput=()=>{bar.style.width=range.value+'%';status.textContent=range.value+'% 読み進みました'}</script>`;
  if (part.slug === "chat-widget")
    return `${generatedSampleStyle}<div class="chat-demo"><button class="chat-launcher" type="button" aria-expanded="false">●<span>相談する</span></button><section class="chat-window" hidden><b>お問い合わせ</b><p>お気軽にご相談ください。</p><button class="chat-close" type="button">閉じる</button></section></div><style>.chat-demo{height:118px;position:relative}.chat-launcher{background:#223555;border:0;border-radius:99px;bottom:0;color:#fff;padding:10px;position:absolute;right:0}.chat-launcher span{margin-left:5px}.chat-window{background:#fff;border:1px solid #d5dce7;border-radius:7px;bottom:0;box-shadow:0 6px 15px rgba(34,53,85,.15);padding:10px;position:absolute;right:0;width:180px}.chat-window p{margin:4px 0}</style><script>const launcher=document.querySelector('.chat-launcher'),windowEl=document.querySelector('.chat-window'),close=document.querySelector('.chat-close');launcher.onclick=()=>{windowEl.hidden=false;launcher.setAttribute('aria-expanded','true')};close.onclick=()=>{windowEl.hidden=true;launcher.setAttribute('aria-expanded','false')}</script>`;
  if (part.slug === "sticky-cta-bar")
    return `${generatedSampleStyle}<div class="cta-demo"><p>サービスの紹介文です。</p><div class="cta-bar"><span>期間限定の案内</span><button class="button cta-action" type="button">申し込む</button></div><p class="generated-status" role="status"></p></div><style>.cta-demo{min-height:112px;position:relative}.cta-bar{align-items:center;background:#223555;bottom:0;color:#fff;display:flex;justify-content:space-between;left:0;padding:8px;position:absolute;right:0}.cta-bar .button{padding:6px 9px}</style><script>const action=document.querySelector('.cta-action'),status=document.querySelector('.generated-status');action.onclick=()=>{status.textContent='申込み画面へ進みます';action.disabled=true}</script>`;
  if (fixedParts.includes(part.slug))
    return `${generatedSampleStyle}<div class="generated-demo"><div class="fixed-demo"><b>${title}</b><button class="outline-button generated-action" type="button">操作する</button></div><p class="generated-status" role="status">追従する操作の見本です</p></div><script>const action=document.querySelector('.generated-action'),status=document.querySelector('.generated-status');action.onclick=()=>{status.textContent='操作を受け付けました';action.disabled=true};</script>`;
  if (part.slug === "image-comparison")
    return `${generatedSampleStyle}<div class="generated-demo"><div class="comparison"><b class="comparison-label">比較: 50%</b></div><input class="comparison-range" type="range" min="0" max="100" value="50" aria-label="比較位置" /></div><script>const range=document.querySelector('.comparison-range'),box=document.querySelector('.comparison'),label=document.querySelector('.comparison-label');range.oninput=()=>{box.style.background='linear-gradient(90deg,#223555 '+range.value+'%,#f07a25 '+range.value+'%)';label.textContent='比較: '+range.value+'%'}</script>`;
  if (part.slug === "video-player")
    return `${generatedSampleStyle}<div class="generated-demo"><div class="panel"><b class="video-status">動画は停止中です</b><div class="bar"><b class="video-progress"></b></div></div><button class="button video-toggle" type="button" aria-pressed="false">再生</button></div><script>const toggle=document.querySelector('.video-toggle'),status=document.querySelector('.video-status'),progress=document.querySelector('.video-progress');toggle.onclick=()=>{const playing=toggle.getAttribute('aria-pressed')==='true';toggle.setAttribute('aria-pressed',String(!playing));toggle.textContent=playing?'再生':'停止';status.textContent=playing?'動画は停止中です':'動画を再生中です';progress.style.width=playing?'18%':'76%'}</script>`;
  if (part.slug === "code-block")
    return `${generatedSampleStyle}<div class="generated-demo"><pre class="panel"><code>&lt;button&gt;保存&lt;/button&gt;</code></pre><button class="outline-button generated-copy" type="button">コードをコピー</button><p class="generated-status" role="status"></p></div><script>const copy=document.querySelector('.generated-copy'),status=document.querySelector('.generated-status');copy.onclick=()=>{status.textContent='コピーしました';copy.disabled=true}</script>`;
  if (part.slug === "read-more")
    return `${generatedSampleStyle}<div class="generated-demo"><p class="read-summary">短い説明だけを表示しています。</p><p class="read-full" hidden>ここに続きの説明を表示します。必要なときだけ全文を読めるようにします。</p><button class="text-button read-toggle" type="button" aria-expanded="false">続きを読む</button></div><script>const toggle=document.querySelector('.read-toggle'),full=document.querySelector('.read-full');toggle.onclick=()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));full.hidden=open;toggle.textContent=open?'続きを読む':'閉じる'}</script>`;
  if (part.slug === "spinner")
    return `${generatedSampleStyle}<div class="generated-demo"><div class="row"><span class="spinner" aria-hidden="true"></span><p role="status">読み込み中です…</p></div></div>`;
  if (part.slug === "inline-message")
    return `${generatedSampleStyle}<div class="generated-demo"><label>メールアドレス<input class="inline-input" placeholder="hello@example.com" /></label><p class="inline-result" role="status">メールアドレスを入力してください。</p></div><script>const input=document.querySelector('.inline-input'),result=document.querySelector('.inline-result');input.oninput=()=>{const valid=/@/.test(input.value);result.textContent=input.value?(valid?'入力形式は問題ありません。':'「@」を含めて入力してください。'):'メールアドレスを入力してください。';result.style.color=valid?'#178250':'#c23934'}</script>`;
  if (part.slug === "snackbar")
    return `${generatedSampleStyle}<div class="generated-demo"><button class="button snackbar-trigger" type="button">項目を削除</button><div class="snackbar" hidden role="status">項目を削除しました <button type="button">元に戻す</button></div></div><style>.snackbar{align-items:center;background:#223555;border-radius:5px;color:#fff;display:flex;gap:10px;padding:9px}.snackbar button{background:#fff;border:0;border-radius:3px;color:#223555;padding:4px 7px}</style><script>const trigger=document.querySelector('.snackbar-trigger'),bar=document.querySelector('.snackbar'),undo=bar.querySelector('button');trigger.onclick=()=>{bar.hidden=false;trigger.disabled=true};undo.onclick=()=>{bar.textContent='削除を取り消しました';trigger.disabled=false}</script>`;
  if (part.slug === "loading-button")
    return `${generatedSampleStyle}<div class="generated-demo"><button class="button loading-action" type="button">送信する</button><p class="generated-status" role="status"></p></div><script>const action=document.querySelector('.loading-action'),status=document.querySelector('.generated-status');action.onclick=()=>{action.disabled=true;action.textContent='送信中…';status.textContent='送信を受け付けました'}</script>`;
  if (part.slug === "success-state" || part.slug === "error-state")
    return `${generatedSampleStyle}<div class="generated-demo panel"><h3>${part.slug === "success-state" ? "✓ 完了しました" : "! 送信できませんでした"}</h3><p>${description}</p><button class="outline-button generated-action" type="button">${part.slug === "success-state" ? "一覧へ戻る" : "もう一度試す"}</button></div><script>document.querySelector('.generated-action').onclick=e=>{e.currentTarget.textContent='選択しました';e.currentTarget.disabled=true}</script>`;
  if (part.slug === "notification-center")
    return `${generatedSampleStyle}<div class="generated-demo"><button class="notification-trigger" type="button" aria-expanded="false">🔔 通知 <b>2</b></button><div class="notification-list" hidden><button type="button">更新が完了しました</button><button type="button">新しいコメントがあります</button><button class="mark-read" type="button">すべて既読にする</button></div></div><style>.notification-trigger{background:#223555;border:0;border-radius:4px;color:#fff;padding:8px}.notification-trigger b{background:#f07a25;border-radius:99px;padding:1px 5px}.notification-list{background:#fff;border:1px solid #d5dce7;display:grid;padding:5px}.notification-list button{background:#fff;border:0;padding:7px;text-align:left}.notification-list .mark-read{color:#f07a25}</style><script>const trigger=document.querySelector('.notification-trigger'),list=document.querySelector('.notification-list'),read=document.querySelector('.mark-read');trigger.onclick=()=>{list.hidden=!list.hidden;trigger.setAttribute('aria-expanded',String(!list.hidden))};read.onclick=()=>{trigger.querySelector('b').textContent='0';list.hidden=true;trigger.setAttribute('aria-expanded','false')}</script>`;
  if (part.slug === "sortable-table")
    return `${generatedSampleStyle}<div class="generated-demo"><table><thead><tr><th><button class="sort-name" type="button" aria-sort="none">名前 ↕</button></th><th>価格</th></tr></thead><tbody><tr><td>Beta</td><td>980円</td></tr><tr><td>Alpha</td><td>0円</td></tr></tbody></table><p class="generated-status" role="status">名前順に並べ替えできます</p></div><script>const sort=document.querySelector('.sort-name'),body=document.querySelector('tbody'),status=document.querySelector('.generated-status');sort.onclick=()=>{const rows=[...body.rows].sort((a,b)=>a.cells[0].textContent.localeCompare(b.cells[0].textContent));rows.forEach(row=>body.append(row));sort.setAttribute('aria-sort','ascending');sort.textContent='名前 ↑';status.textContent='名前の昇順に並べ替えました'}</script>`;
  if (part.slug === "filterable-table")
    return `${generatedSampleStyle}<div class="generated-demo"><label>状態<select class="table-filter"><option value="all">すべて</option><option value="public">公開中</option></select></label><table><thead><tr><th>項目</th><th>状態</th></tr></thead><tbody><tr data-state="public"><td>Alpha</td><td>公開中</td></tr><tr data-state="draft"><td>Beta</td><td>下書き</td></tr></tbody></table><p class="generated-status" role="status">2件表示中</p></div><script>const filter=document.querySelector('.table-filter'),rows=[...document.querySelectorAll('tbody tr')],status=document.querySelector('.generated-status');filter.onchange=()=>{rows.forEach(row=>row.hidden=filter.value!=='all'&&row.dataset.state!==filter.value);status.textContent=rows.filter(row=>!row.hidden).length+'件表示中'}</script>`;
  if (part.slug === "selectable-table")
    return `${generatedSampleStyle}<div class="generated-demo"><table><thead><tr><th><input class="all-select" type="checkbox" aria-label="すべて選択" /></th><th>項目</th></tr></thead><tbody><tr><td><input type="checkbox" aria-label="Alphaを選択" /></td><td>Alpha</td></tr><tr><td><input type="checkbox" aria-label="Betaを選択" /></td><td>Beta</td></tr></tbody></table><p class="generated-status" role="status">0件選択中</p></div><script>const boxes=[...document.querySelectorAll('tbody input')],all=document.querySelector('.all-select'),status=document.querySelector('.generated-status');const update=()=>status.textContent=boxes.filter(box=>box.checked).length+'件選択中';all.onchange=()=>{boxes.forEach(box=>box.checked=all.checked);update()};boxes.forEach(box=>box.onchange=update)</script>`;
  if (
    part.slug === "sortable-table" ||
    part.slug === "filterable-table" ||
    part.slug === "selectable-table"
  )
    return `${generatedSampleStyle}<div class="generated-demo"><button class="outline-button table-action" type="button">${part.slug === "sortable-table" ? "名前順に並べ替え" : part.slug === "filterable-table" ? "公開中だけ表示" : "すべて選択"}</button><table><thead><tr><th>項目</th><th>状態</th></tr></thead><tbody><tr><td>Alpha</td><td>公開中</td></tr><tr><td>Beta</td><td>下書き</td></tr></tbody></table><p class="generated-status" role="status"></p></div><script>const action=document.querySelector('.table-action'),status=document.querySelector('.generated-status');action.onclick=()=>{status.textContent=action.textContent+'しました';action.disabled=true}</script>`;
  if (part.slug === "calendar-view")
    return `${generatedSampleStyle}<div class="generated-demo"><div class="panel"><b>8月</b><div class="row"><span>28</span><span>29</span><span>30</span><span>31</span></div><p>28日に予定があります</p></div></div>`;
  if (part.slug === "kanban-board")
    return `${generatedSampleStyle}<div class="generated-demo"><div class="split"><div><b>作業中</b><div class="mini-card">記事を作る</div></div><div><b>完了</b><div class="mini-card result-card">なし</div></div></div><button class="outline-button kanban-move" type="button">完了へ移動</button></div><script>const move=document.querySelector('.kanban-move'),card=document.querySelector('.mini-card'),target=document.querySelector('.result-card');move.onclick=()=>{target.replaceWith(card);move.disabled=true;move.textContent='移動しました'}</script>`;
  if (part.slug === "sortable-list")
    return `${generatedSampleStyle}<div class="generated-demo"><ol class="stack sortable-items"><li class="mini-card">1. 優先度: 高</li><li class="mini-card">2. 優先度: 中</li></ol><button class="outline-button sortable-action" type="button">順番を入れ替える</button></div><script>const list=document.querySelector('.sortable-items'),button=document.querySelector('.sortable-action');button.onclick=()=>{list.append(list.firstElementChild);button.textContent='入れ替えました';button.disabled=true}</script>`;
  if (part.slug === "resizable-split-pane")
    return `${generatedSampleStyle}<div class="generated-demo"><input class="split-range" type="range" min="25" max="75" value="50" aria-label="左の幅" /><div class="split resize-target"><div>左</div><div>右</div></div><p class="generated-status" role="status">左右 50 : 50</p></div><script>const range=document.querySelector('.split-range'),target=document.querySelector('.resize-target'),status=document.querySelector('.generated-status');range.oninput=()=>{target.style.gridTemplateColumns=range.value+'fr '+(100-range.value)+'fr';status.textContent='左右 '+range.value+' : '+(100-range.value)}</script>`;
  if (part.slug === "virtualized-list")
    return `${generatedSampleStyle}<div class="generated-demo"><div class="stack virtual-list"><div class="mini-card">項目 1</div><div class="mini-card">項目 2</div><div class="mini-card">項目 3</div></div><button class="outline-button virtual-next" type="button">次の3件</button></div><script>let start=1;const list=document.querySelector('.virtual-list'),button=document.querySelector('.virtual-next');button.onclick=()=>{start+=3;list.innerHTML=[start,start+1,start+2].map(n=>'<div class="mini-card">項目 '+n+'</div>').join('')}</script>`;
  if (part.slug === "tree-view")
    return `${generatedSampleStyle}<div class="generated-demo tree"><button class="tree-toggle" type="button" aria-expanded="false">▸ プロジェクト</button><div class="tree-children" hidden>　└ ページ.html<br/>　└ style.css</div></div><script>const toggle=document.querySelector('.tree-toggle'),children=document.querySelector('.tree-children');toggle.onclick=()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));children.hidden=open;toggle.textContent=open?'▸ プロジェクト':'▾ プロジェクト'}</script>`;
  if (part.slug === "hero")
    return `${generatedSampleStyle}<section class="hero-sample"><p>NEW RELEASE</p><h2>使いやすい画面を<br/>すばやく作る</h2><button class="button" type="button">はじめる</button></section><style>.hero-sample{background:#223555;color:#fff;display:grid;gap:7px;padding:16px}.hero-sample p,.hero-sample h2{margin:0}.hero-sample p{color:#f9bf91;font-size:11px}.hero-sample h2{font-size:20px}</style>`;
  if (part.slug === "section-heading")
    return `${generatedSampleStyle}<header class="section-heading-sample"><p>FEATURES</p><h2>できること</h2><span>サービスの特徴を伝える見出しです。</span></header><style>.section-heading-sample{border-left:4px solid #f07a25;padding-left:10px}.section-heading-sample>*{margin:0}.section-heading-sample p{color:#f07a25;font-size:11px;font-weight:700}.section-heading-sample h2{font-size:20px}</style>`;
  if (part.slug === "feature-list")
    return `${generatedSampleStyle}<ul class="feature-sample"><li><b>✓</b><span><strong>すぐに使える</strong><small>必要な機能をすぐ試せます。</small></span></li><li><b>✓</b><span><strong>迷わず探せる</strong><small>名前が分からなくても大丈夫です。</small></span></li></ul><style>.feature-sample{display:grid;gap:8px;list-style:none;margin:0;padding:0}.feature-sample li{display:flex;gap:8px}.feature-sample b{background:#f07a25;border-radius:50%;color:#fff;height:22px;text-align:center;width:22px}.feature-sample strong,.feature-sample small{display:block}.feature-sample small{color:#667085}</style>`;
  if (part.slug === "pricing-table")
    return `${generatedSampleStyle}<div class="pricing-sample"><section><b>Basic</b><strong>0円</strong><span>まず試したい方向け</span></section><section class="featured"><b>Pro</b><strong>980円</strong><span>しっかり使いたい方向け</span></section></div><style>.pricing-sample{display:grid;gap:7px;grid-template-columns:1fr 1fr}.pricing-sample section{border:1px solid #d5dce7;padding:9px}.pricing-sample .featured{border:2px solid #f07a25}.pricing-sample strong,.pricing-sample span{display:block}.pricing-sample strong{font-size:20px}.pricing-sample span{color:#667085;font-size:10px}</style>`;
  if (part.slug === "testimonial")
    return `${generatedSampleStyle}<figure class="testimonial-sample"><blockquote>「探したいパーツがすぐ見つかりました。」</blockquote><figcaption>— 利用者の声</figcaption></figure><style>.testimonial-sample{border-left:4px solid #f07a25;margin:0;padding:8px 12px}.testimonial-sample blockquote{font-weight:700;margin:0}.testimonial-sample figcaption{color:#667085;font-size:11px;margin-top:6px}</style>`;
  if (part.slug === "article-list")
    return `${generatedSampleStyle}<div class="article-sample"><article><time>2026.08.28</time><b>新しいパーツを追加しました</b></article><article><time>2026.08.20</time><b>検索機能を改善しました</b></article></div><style>.article-sample article{border-bottom:1px solid #d5dce7;display:grid;gap:2px;padding:7px 0}.article-sample time{color:#667085;font-size:10px}</style>`;
  if (part.slug === "footer")
    return `${generatedSampleStyle}<footer class="footer-sample"><b>WEB PARTS</b><nav><a href="#">パーツ一覧</a><a href="#">使い方</a></nav><small>© 2026 Web Parts</small></footer><style>.footer-sample{background:#223555;color:#fff;display:grid;gap:7px;padding:12px}.footer-sample a{color:#fff;font-size:11px;margin-right:9px}.footer-sample small{color:#c9d3e3;font-size:10px}</style>`;
  if (part.slug === "logo-cloud")
    return `${generatedSampleStyle}<div class="logo-cloud-sample"><span>ALPHA</span><span>BRAVO</span><span>CHARLIE</span><span>DELTA</span></div><style>.logo-cloud-sample{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.logo-cloud-sample span{color:#667085;font-size:12px;font-weight:800;letter-spacing:.08em}</style>`;
  if (part.slug === "calendar-view")
    return `${generatedSampleStyle}<div class="calendar-sample"><b>2026年 8月</b><div><span>28</span><span class="event">29<small>予定</small></span><span>30</span><span>31</span></div></div><style>.calendar-sample{display:grid;gap:7px}.calendar-sample>div{display:grid;gap:4px;grid-template-columns:repeat(4,1fr)}.calendar-sample span{background:#f6f8fb;min-height:42px;padding:5px}.calendar-sample .event{background:#fff3e9;color:#c35b1c}.calendar-sample small{display:block;font-size:9px}</style>`;
  if (part.slug === "activity-feed")
    return `${generatedSampleStyle}<ol class="feed-sample"><li><b>09:30</b> パーツを追加しました</li><li><b>昨日</b> コードを更新しました</li></ol><style>.feed-sample{display:grid;gap:8px;margin:0;padding-left:18px}.feed-sample b{color:#667085;font-size:10px;margin-right:5px}</style>`;
  if (part.slug === "metric-card")
    return `${generatedSampleStyle}<article class="metric-sample"><span>今週のアクセス</span><strong>12,480</strong><b>↑ 12.4%</b></article><style>.metric-sample{border:1px solid #d5dce7;padding:10px}.metric-sample span,.metric-sample strong,.metric-sample b{display:block}.metric-sample strong{font-size:26px}.metric-sample b{color:#178250;font-size:11px}</style>`;
  return `${generatedSampleStyle}<div class="generated-demo panel"><h3>${title}</h3><p>${description}</p></div>`;
};
const getCodeSample = (part: Part) =>
  codeSamples[part.slug] ?? createExtraPartSample(part);
const normalize = (value: string) =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase("ja-JP")
    .replace(/[\s　_-]/g, "");
const japaneseNames: Record<string, string> = {
  button: "ボタン",
  header: "ヘッダー",
  navigation: "ナビゲーション",
  accordion: "アコーディオン",
  modal: "モーダル",
  card: "カード",
  tabs: "タブ",
  carousel: "カルーセル",
  dropdown: "ドロップダウン",
  tooltip: "ツールチップ",
  toast: "トースト",
  drawer: "ドロワー",
  toggle: "トグルスイッチ",
  checkbox: "チェックボックス",
  radio: "ラジオボタン",
  select: "セレクトボックス",
  search: "検索ボックス",
  pagination: "ページネーション",
  hamburger: "ハンバーガーメニュー",
  "mega-menu": "メガメニュー",
  lightbox: "ライトボックス",
  validation: "入力チェック",
  progress: "プログレスバー",
  skeleton: "スケルトンUI",
  stepper: "ステッパー",
  "file-upload": "ファイルアップロード",
  "date-picker": "日付ピッカー",
  password: "パスワード入力",
  floating: "フローティングボタン",
  popover: "ポップオーバー",
  slider: "スライダー",
  rating: "レーティング",
  "range-slider": "範囲スライダー",
  breadcrumb: "パンくずリスト",
  chip: "チップ",
  alert: "アラート",
  avatar: "アバター",
  badge: "バッジ",
  timeline: "タイムライン",
  table: "テーブル",
  "empty-state": "空の状態",
  "cookie-banner": "Cookieバナー",
  "quantity-stepper": "数量ステッパー",
  hero: "ヒーローセクション",
  "section-heading": "セクション見出し",
  "feature-list": "特徴リスト",
  "pricing-table": "料金表",
  testimonial: "お客様の声",
  "article-list": "記事一覧",
  footer: "フッター",
  "logo-cloud": "ロゴ一覧",
  "bottom-navigation": "下部ナビゲーション",
  "sidebar-navigation": "サイドバーナビ",
  "context-menu": "コンテキストメニュー",
  "segmented-control": "セグメントコントロール",
  "command-palette": "コマンドパレット",
  "table-of-contents": "目次",
  "skip-link": "スキップリンク",
  "text-input": "テキスト入力",
  textarea: "テキストエリア",
  combobox: "コンボボックス",
  "multi-select": "複数選択",
  "tag-input": "タグ入力",
  "otp-input": "認証コード入力",
  "phone-input": "電話番号入力",
  "address-form": "住所フォーム",
  "date-range-picker": "期間選択",
  "time-picker": "時刻選択",
  "color-picker": "カラーピッカー",
  "confirmation-dialog": "確認ダイアログ",
  "bottom-sheet": "ボトムシート",
  "fullscreen-menu": "全画面メニュー",
  "image-comparison": "画像比較",
  "video-player": "ビデオプレーヤー",
  "code-block": "コードブロック",
  "read-more": "続きを読む",
  spinner: "スピナー",
  "inline-message": "インラインメッセージ",
  snackbar: "スナックバー",
  "loading-button": "ローディングボタン",
  "success-state": "成功状態",
  "error-state": "エラー状態",
  "notification-center": "通知センター",
  "sortable-table": "並べ替えテーブル",
  "filterable-table": "絞り込みテーブル",
  "selectable-table": "選択テーブル",
  "calendar-view": "カレンダー表示",
  "kanban-board": "カンバンボード",
  "activity-feed": "アクティビティフィード",
  "metric-card": "数値カード",
  "sticky-header": "追従ヘッダー",
  "sticky-sidebar": "追従サイドバー",
  "back-to-top": "ページ上部へ戻る",
  "scroll-progress": "スクロール進捗",
  "chat-widget": "チャットウィジェット",
  "sticky-cta-bar": "追従CTAバー",
  "sortable-list": "並べ替えリスト",
  "resizable-split-pane": "リサイズ可能な分割表示",
  "virtualized-list": "仮想リスト",
  "tree-view": "ツリービュー",
};
const staticPartSlugs = new Set([
  "hero",
  "section-heading",
  "feature-list",
  "pricing-table",
  "testimonial",
  "article-list",
  "footer",
  "logo-cloud",
  "skip-link",
  "spinner",
  "calendar-view",
  "activity-feed",
  "metric-card",
  "breadcrumb",
  "avatar",
  "timeline",
  "table",
]);
const accessibilityNotes = (part: Part) => {
  if (
    [
      "accordion",
      "drawer",
      "dropdown",
      "hamburger",
      "mega-menu",
      "header",
      "popover",
    ].includes(part.slug)
  )
    return [
      "操作には button 要素を使う",
      "開閉状態を aria-expanded で伝える",
      "対象の内容を aria-controls で結び付ける",
      "キーボードで操作できるようにする",
    ];
  if (["tree-view", "read-more"].includes(part.slug))
    return [
      "操作には button 要素を使う",
      "開閉状態を aria-expanded と hidden で同期する",
      "キーボードで操作できるようにする",
    ];
  if (["modal", "lightbox"].includes(part.slug))
    return [
      "dialog 要素と名前を使う",
      "開いたら操作対象へフォーカスを移す",
      "Escape と閉じるボタンを用意する",
      "閉じたら元の操作位置へ戻す",
    ];
  if (
    [
      "tabs",
      "segmented-control",
      "carousel",
      "pagination",
      "bottom-navigation",
    ].includes(part.slug)
  )
    return [
      "現在の選択を aria-selected または aria-current で示す",
      "選択状態を色だけに頼らない",
      "キーボードでも移動・選択できるようにする",
    ];
  if (categoryOf(part) === "フォーム・入力")
    return [
      "label と入力欄を関連付ける",
      "必須・エラー内容をテキストでも伝える",
      "フォーカス位置を見失わないようにする",
    ];
  return [
    "意味に合う HTML 要素を優先する",
    "十分な文字色コントラストを保つ",
    "フォーカスが見える状態にする",
  ];
};
const keyboardNotes = (part: Part) => {
  if (staticPartSlugs.has(part.slug)) return [];
  if (
    [
      "modal",
      "confirmation-dialog",
      "lightbox",
      "fullscreen-menu",
      "bottom-sheet",
      "command-palette",
    ].includes(part.slug)
  )
    return [
      { key: "Tab", action: "開いた領域内を移動" },
      { key: "Escape", action: "閉じる" },
    ];
  if (part.slug === "tabs")
    return [
      { key: "Tab", action: "選択中のタブにフォーカス" },
      { key: "← / → / Home / End", action: "タブを切り替え" },
      { key: "Enter / Space", action: "項目を切り替え" },
    ];
  if (["segmented-control", "carousel"].includes(part.slug))
    return [
      { key: "Tab", action: "操作にフォーカス" },
      { key: "Enter / Space", action: "項目を切り替え" },
    ];
  return [
    { key: "Tab", action: "操作にフォーカス" },
    { key: "Enter / Space", action: "実行・開閉・選択" },
  ];
};
const relatedSlugs: Record<string, string[]> = {
  accordion: ["tabs", "dropdown", "drawer"],
  modal: ["confirmation-dialog", "drawer", "popover"],
  carousel: ["slider", "image-comparison", "lightbox"],
  combobox: ["search", "select", "tag-input"],
  "sticky-header": ["sticky-sidebar", "back-to-top", "sticky-cta-bar"],
  table: ["sortable-table", "filterable-table", "selectable-table"],
};
const partCatalog = parts.map((part) => ({
  ...part,
  nameJa: japaneseNames[part.slug] ?? part.name,
  aliases: searchAliases[part.slug] ?? [],
  keywords: [
    ...(searchAliases[part.slug] ?? []),
    part.name,
    japaneseNames[part.slug] ?? part.name,
    part.category,
    part.description,
    part.reason,
  ],
  javascriptRequired: !staticPartSlugs.has(part.slug),
  accessibility: accessibilityNotes(part),
  keyboard: keyboardNotes(part),
  related:
    relatedSlugs[part.slug] ??
    parts
      .filter(
        (candidate) =>
          candidate.slug !== part.slug &&
          categoryOf(candidate) === categoryOf(part),
      )
      .slice(0, 3)
      .map((candidate) => candidate.slug),
}));
type CatalogPart = (typeof partCatalog)[number];
const splitCode = (source: string) => {
  const css = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
    .map((match) => match[1].trim())
    .join("\n\n");
  const javascript = [...source.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1].trim())
    .join("\n\n");
  const html = source
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, "")
    .trim();
  return { html, css, javascript };
};
const joinCode = (code: { html: string; css: string; javascript: string }) => {
  const javascriptSource = JSON.stringify(code.javascript).replace(
    /</g,
    "\\u003c",
  );
  const safeScript = code.javascript
    ? `\n\n<script>try { Function(${javascriptSource})() } catch (error) { window.dispatchEvent(new ErrorEvent('error', { message: error instanceof Error ? error.message : String(error) })); }</script>`
    : "";
  return `${code.html}${code.css ? `\n\n<style>\n${code.css}\n</style>` : ""}${safeScript}`;
};
const highlightCode = (code: string) =>
  code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/("[^"]*"|'[^']*')/g, '<span class="syntax-string">$1</span>')
    .replace(
      /(\b(?:const|let|return|if|else|function|true|false|class|type)\b)/g,
      '<span class="syntax-keyword">$1</span>',
    )
    .replace(/(&lt;\/?[\w-]+)/g, '<span class="syntax-tag">$1</span>');
const createPreviewDocument = (source: string) =>
  `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>\n:root{color:#223555;font:14px/1.6 system-ui,sans-serif}*{box-sizing:border-box}body{align-items:center;color:#333;display:grid;margin:0;min-height:100%;padding:14px}body>*{max-width:100%}button,input,select{font:inherit}button{cursor:pointer}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #f07a25;outline-offset:2px}input,select{border:1px solid #b8c3d4;border-radius:4px;padding:8px}label{color:#223555;font-weight:700}a{color:#223555}[hidden]{display:none!important}dialog:not([open]){display:none!important}.button,.demo-trigger{background:#f07a25;border:0;border-radius:4px;color:#fff;font-weight:700;padding:9px 14px}.button:disabled{opacity:.6}.outline-button{background:#fff;border:1px solid #223555;border-radius:4px;color:#223555;font-weight:700;padding:8px 13px}.text-button{background:transparent;border:0;color:#f07a25;font-weight:700;padding:4px 0}.card{background:#fff;border:1px solid #d5dce7;display:grid;gap:10px;grid-template-columns:62px 1fr;padding:9px;width:100%}.card-image{background:#e9eef5;color:#223555;display:grid;font-weight:700;min-height:64px;place-items:center}.card small,.card strong,.card button{display:block}.card small{color:#667085}.card strong{color:#223555;font-size:14px;margin-top:2px}.carousel{width:100%}.carousel-stage{background:#e9eef5;color:#223555;display:grid;min-height:82px;place-items:center}.carousel-stage span{font-size:12px;font-weight:700}.carousel-stage strong{font-size:15px}.carousel-controls{align-items:center;display:flex;gap:15px;justify-content:center;margin-top:9px}.carousel-controls button{background:transparent;border:0;color:#223555;font-size:18px;padding:0}.carousel-controls span{color:#667085;font-size:12px}.menu-demo{position:relative}.demo-menu,.mega-menu,.inline-menu,.drawer{background:#fff;border:1px solid #d5dce7;box-shadow:0 8px 18px rgba(34,53,85,.12);display:grid;gap:4px;margin:6px 0 0;padding:8px}.demo-menu{list-style:none}.demo-menu button,.drawer button{background:transparent;border:0;padding:5px;text-align:left}.mega-menu a,.inline-menu a{padding:3px 5px;text-decoration:none}.tooltip-wrap{background:#223555;border-radius:50%;color:#fff;cursor:help;display:grid;font-weight:700;height:28px;place-items:center;position:relative;width:28px}.tooltip-wrap [role=tooltip]{background:#223555;border-radius:4px;color:#fff;font-size:12px;left:36px;opacity:0;padding:5px 8px;pointer-events:none;position:absolute;transition:opacity .15s;white-space:nowrap}.tooltip-wrap:focus [role=tooltip],.tooltip-wrap:hover [role=tooltip]{opacity:1}.toast{background:#223555;border-radius:4px;color:#fff;margin:9px 0 0;padding:8px 10px}.switch{align-items:center;display:flex;gap:8px}.switch input{appearance:none;background:#b8c3d4;border:0;border-radius:999px;height:22px;margin:0;position:relative;width:42px}.switch input::after{background:#fff;border-radius:50%;content:"";height:16px;left:3px;position:absolute;top:3px;transition:.15s;width:16px}.switch input:checked{background:#f07a25}.switch input:checked::after{left:23px}.choice-group{border:0;margin:0;padding:0}.choice-group label{margin-right:10px}.choice-group p,.select-result,.search-result,.date-result{color:#667085;margin:6px 0 0}.search-demo{align-items:center;border:1px solid #b8c3d4;border-radius:4px;display:flex;gap:5px;padding:3px 8px}.search-demo input{border:0;min-width:0;outline:0;padding:4px}.pagination{display:flex;gap:6px}.pagination button{background:#fff;border:1px solid #d5dce7;border-radius:3px;color:#223555;padding:5px 10px}.pagination button[aria-current=true]{background:#223555;border-color:#223555;color:#fff}dialog{border:0;border-radius:6px;box-shadow:0 18px 50px rgba(0,0,0,.22);color:#223555;padding:18px}dialog::backdrop{background:rgba(34,53,85,.35)}.lightbox{background:#223555;color:#fff;display:grid;gap:8px;min-width:180px;min-height:100px;place-items:center}.validation-result[data-status=success]{color:#178250}.validation-result[data-status=error]{color:#c23934}progress{accent-color:#f07a25;width:100%}.progress-demo{display:grid;gap:7px;width:100%}.skeleton{animation:pulse 1s infinite alternate;background:#e9eef5;border-radius:4px;height:54px;width:100%}@keyframes pulse{to{opacity:.45}}.stepper ol,.timeline{display:flex;gap:7px;list-style:none;margin:0;padding:0}.stepper li{background:#e9eef5;border-radius:50%;color:#667085;display:grid;height:28px;place-items:center;width:28px}.stepper li[aria-current]{background:#f07a25;color:#fff}.file-demo{display:grid;gap:5px}.file-demo span{color:#667085;font-weight:400}.floating-button{background:#f07a25;border:0;border-radius:50%;color:#fff;font-size:24px;height:48px;width:48px}.floating-message,.popover{background:#fff;border:1px solid #d5dce7;border-radius:4px;box-shadow:0 6px 15px rgba(34,53,85,.12);margin:7px 0 0;padding:8px}.rating{border:0;margin:0;padding:0}.rating div{display:flex}.rating button{background:transparent;border:0;color:#b8c3d4;font-size:26px;padding:0 2px}.rating button.selected{color:#f07a25}.rating output{color:#667085;display:block;margin-top:3px}.breadcrumb{align-items:center;display:flex;flex-wrap:wrap;gap:6px}.breadcrumb a{text-decoration:none}.chips{display:flex;flex-wrap:wrap;gap:6px}.chips span{background:#e9eef5;border-radius:999px;color:#223555;padding:4px 8px}.chips button{background:transparent;border:0;color:#667085;padding:0 0 0 4px}.alert{align-items:center;background:#fff3e9;border-left:4px solid #f07a25;color:#7a4219;display:flex;gap:8px;padding:9px}.alert button{background:transparent;border:0;color:#7a4219;margin-left:auto}.avatar-demo{align-items:center;display:flex;gap:10px}.avatar{align-items:center;background:#223555;border-radius:50%;color:#fff;display:flex;font-weight:700;height:42px;justify-content:center;width:42px}.avatar-demo small{color:#667085;display:block}.badge-demo{background:#223555;border:0;border-radius:4px;color:#fff;padding:8px 12px}.badge-demo b{background:#f07a25;border-radius:999px;margin-left:4px;padding:1px 6px}.timeline{display:grid;gap:8px}.timeline li{align-items:center;display:flex;gap:8px}.timeline b{background:#e9eef5;border-radius:50%;display:grid;height:26px;place-items:center;width:26px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #d5dce7;padding:6px;text-align:left}th{background:#e9eef5}.empty-state{display:grid;gap:7px;justify-items:center;text-align:center}.empty-state>b{color:#f07a25;font-size:30px}.empty-state-result{color:#667085;font-size:12px;margin:0}.empty-state-suggestions{display:flex;gap:6px;list-style:none;margin:0;padding:0}.empty-state-suggestions li{background:#e9eef5;border-radius:999px;color:#223555;font-size:11px;padding:3px 7px}.cookie-banner{align-items:center;background:#223555;color:#fff;display:flex;flex-wrap:wrap;gap:7px;padding:10px}.quantity{align-items:center;border:1px solid #d5dce7;display:flex;width:max-content}.quantity button{background:#fff;border:0;color:#223555;font-size:18px;height:32px;width:32px}.quantity output{min-width:30px;text-align:center}\n</style></head><body>${source}</body></html>`;

const createSafePreviewDocument = (source: string) => {
  const errorBoundary = `<style>
html,body{height:100%;overflow:auto}
#preview-error{background:#fff3e9;border:1px solid #f07a25;border-radius:6px;color:#7a4219;display:grid;gap:4px;margin:0 0 12px;padding:10px;width:100%}
#preview-error strong{color:#9d4a10}#preview-error code{overflow-wrap:anywhere}
</style>
<div id="preview-error" role="alert" aria-live="assertive" hidden><strong>JavaScriptエラー</strong><span>コードを確認してください。編集内容はこのプレビュー内だけに隔離されています。</span><code id="preview-error-detail"></code></div>
<script>
(() => { const showError = (message) => { const box = document.querySelector('#preview-error'); const detail = document.querySelector('#preview-error-detail'); if (!box || !detail) return; detail.textContent = String(message || '実行できないコードがあります。').slice(0, 180); box.hidden = false; }; window.addEventListener('error', (event) => showError(event.message), true); window.addEventListener('unhandledrejection', (event) => showError(event.reason?.message || event.reason)); document.addEventListener('keydown', (event) => { if (event.key !== 'Escape') return; const trigger = document.querySelector('[aria-expanded="true"][aria-controls]'); const controlled = trigger && document.getElementById(trigger.getAttribute('aria-controls')); if (!trigger || !controlled) return; controlled.hidden = true; trigger.setAttribute('aria-expanded', 'false'); trigger.focus(); }); })();
</script>`;
  return createPreviewDocument(`${errorBoundary}${source}`);
};

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-heading">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {text && <span>{text}</span>}
    </div>
  );
}
function PartPreview({ part }: { part: CatalogPart }) {
  const [resetVersion, setResetVersion] = useState(0);
  return (
    <div className="card-preview-content">
      <iframe
        key={resetVersion}
        className="card-playground-frame"
        title={`${part.name} のカードプレビュー`}
        sandbox="allow-scripts"
        loading="lazy"
        srcDoc={createSafePreviewDocument(getCodeSample(part))}
      />
      {part.javascriptRequired && (
        <div className="card-preview-controls">
          <button
            type="button"
            aria-label={`${part.name} のプレビューを初期状態に戻す`}
            title="初期状態に戻す"
            onClick={() => setResetVersion((current) => current + 1)}
          >
            ↻
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("すべて");
  const [levelFilter, setLevelFilter] = useState("すべて");
  const [javascriptFilter, setJavascriptFilter] = useState<
    "すべて" | "使用" | "不要"
  >("すべて");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState("accordion");
  const [activeCodeTab, setActiveCodeTab] = useState<
    "html" | "css" | "javascript"
  >("html");
  const [codeSections, setCodeSections] = useState(() =>
    splitCode(
      getCodeSample(
        partCatalog.find((part) => part.slug === "accordion") ?? partCatalog[0],
      ),
    ),
  );
  const [previewVersion, setPreviewVersion] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const favoritesRestored = useRef(false);
  const codeTabs = ["html", "css", "javascript"] as const;
  const selectedPart =
    partCatalog.find((part) => part.slug === selectedSlug) ?? partCatalog[0];
  const defaultCodeSections = splitCode(getCodeSample(selectedPart));
  const previewDocument = createSafePreviewDocument(joinCode(codeSections));
  useEffect(() => {
    const updateMetadata = () => {
      const isDetailRoute = /^#parts\/([a-z0-9-]+)$/i.test(
        window.location.hash,
      );
      document.title = isDetailRoute
        ? `${selectedPart.name}（${selectedPart.nameJa}）とは？｜Webパーツ図鑑`
        : "Webパーツ図鑑｜見て、触って、名前を知る";
    };
    updateMetadata();
    window.addEventListener("hashchange", updateMetadata);
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      "content",
      `${selectedPart.name}（${selectedPart.nameJa}）の意味、使い方、デザイン例、HTML・CSS・JavaScriptコードを初心者向けに紹介します。`,
    );
    return () => window.removeEventListener("hashchange", updateMetadata);
  }, [selectedPart]);
  const favoriteSearch = ["お気に入り", "お気に入りだけ", "保存済み"].includes(
    normalize(query),
  );
  const filtered = useMemo(() => {
    const terms = query
      .split(/[\s　]+/)
      .map(normalize)
      .filter(Boolean);
    const normalizedQuery = normalize(query);
    const results = partCatalog.filter((part) => {
      return (
        (category === "すべて" || categoryOf(part) === category) &&
        (levelFilter === "すべて" || part.level === levelFilter) &&
        (javascriptFilter === "すべて" ||
          (javascriptFilter === "使用") === part.javascriptRequired) &&
        (!favoritesOnly || favorites.includes(part.name)) &&
        (!favoriteSearch || favorites.includes(part.name)) &&
        (favoriteSearch || matchesPartSearch(part, terms, normalizedQuery))
      );
    });
    return favoriteSearch
      ? results
      : results.sort(
          (a, b) =>
            scorePartSearch(b, terms, normalizedQuery) -
            scorePartSearch(a, terms, normalizedQuery),
        );
  }, [
    query,
    category,
    levelFilter,
    javascriptFilter,
    favoritesOnly,
    favorites,
    favoriteSearch,
  ]);
  const suggestedParts = useMemo(() => {
    const normalizedQuery = normalize(query);
    const matchedIntent = fuzzySearchIntents.find((intent) =>
      intent.phrases.some((phrase) =>
        normalizedQuery.includes(normalize(phrase)),
      ),
    );
    return (
      matchedIntent
        ? partCatalog.filter((part) => matchedIntent.slugs.includes(part.slug))
        : partCatalog.filter((part) =>
            part.aliases.some(
              (alias) =>
                normalize(alias).slice(0, 3) === normalizedQuery.slice(0, 3),
            ),
          )
    ).slice(0, 3);
  }, [query]);
  useEffect(() => {
    const restoreFavorites = () => {
      try {
        const saved = JSON.parse(
          window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]",
        );
        const validNames = new Set(partCatalog.map((part) => part.name));
        if (Array.isArray(saved))
          setFavorites(
            saved.filter(
              (name): name is string =>
                typeof name === "string" && validNames.has(name),
            ),
          );
      } catch {
        setFavorites([]);
      }
      favoritesRestored.current = true;
    };
    const frame = window.requestAnimationFrame(restoreFavorites);
    const syncFavorites = (event: StorageEvent) => {
      if (event.key === FAVORITES_STORAGE_KEY) restoreFavorites();
    };
    window.addEventListener("storage", syncFavorites);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);
  useEffect(() => {
    if (!favoritesRestored.current) return;
    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favorites),
      );
    } catch {
      /* 保存できない環境では現在の画面内でのみ保持します。 */
    }
  }, [favorites]);
  useEffect(() => {
    const syncDetailFromUrl = () => {
      const matched = window.location.hash.match(/^#parts\/([a-z0-9-]+)$/i);
      const next =
        matched && partCatalog.find((part) => part.slug === matched[1]);
      if (!next) return;
      setSelectedSlug(next.slug);
      setCodeSections(splitCode(getCodeSample(next)));
      setPreviewVersion((current) => current + 1);
      window.requestAnimationFrame(() =>
        document.querySelector("#preview")?.scrollIntoView({ block: "start" }),
      );
    };
    syncDetailFromUrl();
    window.addEventListener("popstate", syncDetailFromUrl);
    window.addEventListener("hashchange", syncDetailFromUrl);
    return () => {
      window.removeEventListener("popstate", syncDetailFromUrl);
      window.removeEventListener("hashchange", syncDetailFromUrl);
    };
  }, []);
  const toggleFavorite = (name: string) =>
    setFavorites((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  const showDetails = (slug: string) => {
    const nextPart =
      partCatalog.find((part) => part.slug === slug) ?? partCatalog[0];
    setSelectedSlug(nextPart.slug);
    setCodeSections(splitCode(getCodeSample(nextPart)));
    setActiveCodeTab("html");
    setPreviewVersion((current) => current + 1);
    window.history.pushState(
      { part: nextPart.slug },
      "",
      `#parts/${nextPart.slug}`,
    );
    window.requestAnimationFrame(() =>
      document
        .querySelector("#preview")
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };
  const clearFilters = () => {
    setQuery("");
    setCategory("すべて");
    setLevelFilter("すべて");
    setJavascriptFilter("すべて");
    setFavoritesOnly(false);
  };
  const copyText = async (text: string, message: string) => {
    try {
      await navigator.clipboard?.writeText(text);
      setToast(message);
      window.setTimeout(() => setToast(""), 2200);
    } catch {
      setToast("コピーできませんでした");
      window.setTimeout(() => setToast(""), 2200);
    }
  };
  const learnPartSlugs = [
    "button",
    "header",
    "navigation",
    "hero",
    "card",
    "text-input",
    "checkbox",
    "modal",
    "accordion",
    "tabs",
    "breadcrumb",
    "footer",
  ];
  const activeFilters = [
    {
      label: "検索",
      value: query ? `「${query}」` : "すべて",
      clear: () => setQuery(""),
    },
    { label: "カテゴリ", value: category, clear: () => setCategory("すべて") },
    {
      label: "難易度",
      value: levelFilter,
      clear: () => setLevelFilter("すべて"),
    },
    {
      label: "JavaScript",
      value: javascriptFilter,
      clear: () => setJavascriptFilter("すべて"),
    },
    {
      label: "お気に入り",
      value: favoritesOnly ? "のみ" : "すべて",
      clear: () => setFavoritesOnly(false),
    },
  ].filter((filter) => filter.value !== "すべて");
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" onClick={() => setMobileOpen(false)}>
            WEB PARTS <em>図鑑</em>
          </a>
          <button
            className="menu-button"
            aria-expanded={mobileOpen}
            aria-controls="site-nav"
            aria-label="メニューを開く"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav id="site-nav" className={mobileOpen ? "open" : ""}>
            <a href="#parts" onClick={() => setMobileOpen(false)}>
              パーツを探す
            </a>
            <a href="#learn" onClick={() => setMobileOpen(false)}>
              はじめての方へ
            </a>
            <a href="#about" onClick={() => setMobileOpen(false)}>
              この図鑑について
            </a>
          </nav>
        </div>
      </header>
      <main id="top">
        <section className="hero">
          <div className="container hero-inner">
            <p className="eyebrow">UI COMPONENTS FOR BEGINNERS</p>
            <h1>
              名前が分からなくても探せる
              <br />
              Webパーツ図鑑
            </h1>
            <p className="hero-lead">
              見て、触って、名前と使い方を知る。
              <br />
              Web制作でよく出会うUIを、ひとつずつ集めました。
            </p>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape" && query) {
                    event.preventDefault();
                    setQuery("");
                  }
                }}
                placeholder="例：質問を押すと答えが出る"
                aria-label="Webパーツを検索"
              />
              {query && (
                <button
                  className="search-clear"
                  type="button"
                  aria-label="検索キーワードをクリア"
                  onClick={() => setQuery("")}
                >
                  ×
                </button>
              )}
              <a href="#parts">探す</a>
            </label>
            <div className="name-finder" aria-label="これ何て名前？">
              <b>これ何て名前？</b>
              {[
                ["押すと開くやつ", "accordion"],
                ["画像が横に動く", "carousel"],
                ["画面の上に出てくる", "modal"],
                ["クリックすると選択肢が出る", "dropdown"],
                ["右下にずっとあるボタン", "floating"],
                ["入力候補が下に出る", "combobox"],
              ].map(([label, slug]) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => showDetails(slug)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section id="learn" className="section">
          <div className="container">
            <SectionTitle
              eyebrow="START HERE"
              title="まず覚えたいWebパーツ"
              text="まずはよく使う12種類から。名前と使いどころを一緒に覚えられます。"
            />
            <ol className="learn-list">
              {learnPartSlugs.map((slug, index) => {
                const part = partCatalog.find((item) => item.slug === slug);
                return (
                  part && (
                    <li key={part.slug}>
                      <button onClick={() => showDetails(part.slug)}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{part.name}</strong>
                        <small>
                          {part.nameJa} / {part.description}
                        </small>
                        <b>→</b>
                      </button>
                    </li>
                  )
                );
              })}
            </ol>
          </div>
        </section>
        <section id="parts" className="section soft-section">
          <div className="container">
            <SectionTitle
              eyebrow="LOOK & TRY"
              title="よく見るWebパーツ"
              text="カテゴリ・難易度・JavaScriptの有無を組み合わせて、100種類から絞り込めます。"
            />
            <div className="filter-panel">
              <div className="filter-group">
                <b>カテゴリ</b>
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={category === item ? "active" : ""}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="filter-group">
                <b>難易度</b>
                {["すべて", "初級", "中級", "上級"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={levelFilter === item ? "active" : ""}
                    aria-pressed={levelFilter === item}
                    onClick={() => setLevelFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="filter-group">
                <b>JavaScript</b>
                {(["すべて", "使用", "不要"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={javascriptFilter === item ? "active" : ""}
                    aria-pressed={javascriptFilter === item}
                    onClick={() => setJavascriptFilter(item)}
                  >
                    {item}
                  </button>
                ))}
                <button
                  className={favoritesOnly ? "active" : ""}
                  type="button"
                  aria-pressed={favoritesOnly}
                  onClick={() => setFavoritesOnly((current) => !current)}
                >
                  ★ お気に入りのみ
                </button>
              </div>
            </div>
            {activeFilters.length > 0 && (
              <div className="active-filters" aria-label="適用中のフィルター">
                {activeFilters.map((filter) => (
                  <button
                    key={filter.label}
                    type="button"
                    aria-label={`${filter.label}：${filter.value} を解除`}
                    onClick={filter.clear}
                  >
                    {filter.label}：{filter.value} ×
                  </button>
                ))}
                <button
                  type="button"
                  className="clear-filters"
                  onClick={clearFilters}
                >
                  すべてクリア
                </button>
              </div>
            )}
            <p className="favorite-storage-note">
              ☆で登録したお気に入りは、このブラウザに保存されます。
            </p>
            <p className="result-count">
              <b>{partCatalog.length}</b>件中 <b>{filtered.length}</b>件
            </p>
            <div className="parts-grid" data-parts-total={partCatalog.length}>
              {filtered.map((part) => (
                <article
                  className="part-card"
                  data-part-slug={part.slug}
                  key={part.slug}
                >
                  <div className="card-top">
                    <span className="part-icon">{part.icon}</span>
                    <button
                      className="favorite"
                      aria-label={
                        favorites.includes(part.name)
                          ? `${part.name}をお気に入りから外す`
                          : `${part.name}をお気に入りに追加`
                      }
                      aria-pressed={favorites.includes(part.name)}
                      onClick={() => toggleFavorite(part.name)}
                    >
                      {favorites.includes(part.name) ? "★" : "☆"}
                    </button>
                  </div>
                  <div className="card-copy">
                    <p>{categoryOf(part)}</p>
                    <h3>{part.name}</h3>
                    <strong className="part-ja-name">{part.nameJa}</strong>
                    <span>{part.description}</span>
                  </div>
                  <div className="card-preview">
                    <PartPreview part={part} />
                  </div>
                  <div className="card-footer">
                    <span className={`level level-${part.level}`}>
                      {part.level}
                    </span>
                    <button
                      className="code-link"
                      onClick={() => showDetails(part.slug)}
                    >
                      詳細を見る <b>→</b>
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="empty-result">
                <p>
                  {favoritesOnly || favoriteSearch
                    ? "お気に入りに登録したパーツはまだありません。☆を押して登録できます。"
                    : `「${query}」に一致するパーツは見つかりませんでした。`}
                </p>
                {!favoritesOnly && suggestedParts.length > 0 && (
                  <>
                    <b>近いパーツかもしれません</b>
                    <div className="suggestion-links">
                      {suggestedParts.map((part) => (
                        <button
                          key={part.slug}
                          onClick={() => showDetails(part.slug)}
                        >
                          {part.name} / {part.nameJa}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
        <section id="preview" className="section detail-section">
          <div className="container">
            <p className="detail-breadcrumb">
              {categoryOf(selectedPart)}　/　{selectedPart.nameJa}
            </p>
            <div className="detail-heading">
              <div>
                <p className="eyebrow">INTERACTIVE PREVIEW</p>
                <h2>
                  {selectedPart.name}
                  <span>{selectedPart.nameJa}</span>
                </h2>
                <p>{selectedPart.description}</p>
              </div>
              <div className="detail-actions">
                <span className={`level level-${selectedPart.level}`}>
                  {selectedPart.level}
                </span>
                <button
                  className="share-link"
                  type="button"
                  onClick={() =>
                    copyText(
                      `${window.location.origin}#parts/${selectedPart.slug}`,
                      "リンクをコピーしました",
                    )
                  }
                >
                  リンクをコピー
                </button>
              </div>
            </div>
            <div className="interactive-panel">
              <div className="panel-label">編集結果のライブプレビュー</div>
              <iframe
                key={`${selectedSlug}-${previewVersion}`}
                className="playground-frame"
                title={`${selectedPart.name} のライブプレビュー`}
                sandbox="allow-scripts"
                srcDoc={previewDocument}
              />
            </div>
            <div className="code-preview">
              <div className="code-toolbar">
                <span>{selectedPart.name} のサンプルコード</span>
                <div>
                  <button
                    type="button"
                    aria-label="プレビューを初期状態に戻す（編集したコードは残ります）"
                    onClick={() => setPreviewVersion((current) => current + 1)}
                  >
                    Previewを初期状態に戻す
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        joinCode(codeSections),
                        "すべてのコードをコピーしました",
                      )
                    }
                  >
                    すべてコピー
                  </button>
                </div>
              </div>
              <div
                className="code-tabs"
                role="tablist"
                aria-label="コードの種類"
              >
                {codeTabs.map((tab, index) => (
                  <button
                    key={tab}
                    id={`code-tab-${tab}`}
                    role="tab"
                    aria-selected={activeCodeTab === tab}
                    aria-controls="code-panel"
                    tabIndex={activeCodeTab === tab ? 0 : -1}
                    onClick={() => setActiveCodeTab(tab)}
                    onKeyDown={(event) => {
                      if (
                        !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                          event.key,
                        )
                      )
                        return;
                      event.preventDefault();
                      const nextIndex =
                        event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? codeTabs.length - 1
                            : (index +
                                (event.key === "ArrowRight"
                                  ? 1
                                  : codeTabs.length - 1)) %
                              codeTabs.length;
                      const nextTab = codeTabs[nextIndex];
                      setActiveCodeTab(nextTab);
                      window.requestAnimationFrame(() =>
                        document
                          .querySelector<HTMLButtonElement>(
                            `#code-tab-${nextTab}`,
                          )
                          ?.focus(),
                      );
                    }}
                  >
                    {tab === "html"
                      ? "HTML"
                      : tab === "css"
                        ? "CSS"
                        : "JavaScript"}
                  </button>
                ))}
              </div>
              <div className="code-tab-actions">
                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      codeSections[activeCodeTab],
                      `${activeCodeTab === "html" ? "HTML" : activeCodeTab === "css" ? "CSS" : "JavaScript"}をコピーしました`,
                    )
                  }
                >
                  コピー
                </button>
                <button
                  type="button"
                  aria-label="編集中のコードを初期コードへ戻す"
                  className={
                    codeSections[activeCodeTab] !==
                    defaultCodeSections[activeCodeTab]
                      ? "dirty"
                      : ""
                  }
                  onClick={() =>
                    setCodeSections((current) => ({
                      ...current,
                      [activeCodeTab]: defaultCodeSections[activeCodeTab],
                    }))
                  }
                >
                  このコードを戻す
                </button>
              </div>
              <div
                id="code-panel"
                role="tabpanel"
                aria-labelledby={`code-tab-${activeCodeTab}`}
              >
                <label className="code-editor-label" htmlFor="code-editor">
                  {activeCodeTab === "html"
                    ? "HTML"
                    : activeCodeTab === "css"
                      ? "CSS"
                      : "JavaScript"}
                  を編集すると、上のプレビューへ即時反映されます。
                </label>
                <textarea
                  id="code-editor"
                  className="code-editor"
                  value={codeSections[activeCodeTab]}
                  onChange={(event) =>
                    setCodeSections((current) => ({
                      ...current,
                      [activeCodeTab]: event.target.value,
                    }))
                  }
                  spellCheck="false"
                  wrap="off"
                />
                <pre
                  className="syntax-preview"
                  aria-label="シンタックスハイライト表示"
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(codeSections[activeCodeTab]),
                  }}
                />
              </div>
            </div>
            <div className="detail-learning-grid">
              <div>
                <h3>どんなパーツ？</h3>
                <p>{selectedPart.description}</p>
                <h3>実装で気を付けること</h3>
                <p>{selectedPart.reason}</p>
              </div>
              <div>
                <h3>アクセシビリティ</h3>
                <ul>
                  {selectedPart.accessibility.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
                {selectedPart.keyboard.length > 0 && (
                  <>
                    <h3>キーボード操作</h3>
                    <dl className="keyboard-notes">
                      {selectedPart.keyboard.map((note) => (
                        <div key={note.key}>
                          <dt>{note.key}</dt>
                          <dd>{note.action}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}
              </div>
              <div>
                <h3>検索できる言葉</h3>
                <p>{selectedPart.aliases.slice(0, 8).join(" / ")}</p>
                <h3>関連パーツ</h3>
                <div className="related-parts">
                  {selectedPart.related.map((slug) => {
                    const part = partCatalog.find((item) => item.slug === slug);
                    return (
                      part && (
                        <button key={slug} onClick={() => showDetails(slug)}>
                          {part.name}
                          <small>{part.nameJa}</small>
                        </button>
                      )
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="about-band">
          <div className="container">
            <p className="eyebrow">ABOUT THIS PROJECT</p>
            <h2>
              「これ、何て名前？」を
              <br />
              10秒で解決するための図鑑です。
            </h2>
            <p>
              見た目から探して、触ってみて、名前・用途・コードまで自然にたどり着けることを目指しています。
            </p>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div className="container">
            <a href="#top" onClick={() => setMobileOpen(false)}>
              Webパーツ図鑑
            </a>
            <nav>
              <a href="#parts">パーツを探す</a>
              <a href="#learn">はじめての方へ</a>
              {SHOW_PORTFOLIO_LINK && (
                <a
                  href="https://aoiroa.chatgpt.site/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Portfolio →
                </a>
              )}
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Aoiro-ymgc. All Rights Reserved.
        </div>
      </footer>
      {toast && (
        <div className="toast-notice" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
