'use client';

import { useMemo, useState } from 'react';

type Part = { name: string; slug: string; category: string; description: string; level: string; reason: string; icon: string };
type LearnPart = { name: string; slug: string; description: string };

const parts: Part[] = [
  { name: 'Button', slug: 'button', category: '操作', description: '行動を明確に伝える、もっとも基本的なパーツ。', level: '初級', reason: '状態ごとの見た目を用意します。', icon: '↗' },
  { name: 'Accordion', slug: 'accordion', category: '表示切替', description: '情報を折りたたみ、必要なときだけ見せます。', level: '中級', reason: '開閉状態とキーボード操作を考えます。', icon: '⌄' },
  { name: 'Modal', slug: 'modal', category: '表示切替', description: '画面に重ねて、確認や入力を促します。', level: '中級', reason: 'フォーカス移動に配慮します。', icon: '□' },
  { name: 'Card', slug: 'card', category: 'コンテンツ', description: '関連する情報をひとまとまりにして見せます。', level: '初級', reason: '情報の優先順位を整えます。', icon: '▤' },
  { name: 'Tabs', slug: 'tabs', category: '表示切替', description: '同じ階層の内容を切り替えて比較できます。', level: '中級', reason: '選択状態と内容を同期します。', icon: '▱' },
  { name: 'Carousel', slug: 'carousel', category: 'ナビゲーション', description: '複数のコンテンツを横方向に見せるスライドです。', level: '中級', reason: '現在位置を分かりやすくします。', icon: '→' },
  { name: 'Dropdown', slug: 'dropdown', category: '表示切替', description: '選択肢をコンパクトにまとめて表示します。', level: '中級', reason: '開閉と選択状態を管理します。', icon: '⌄' },
  { name: 'Tooltip', slug: 'tooltip', category: '補足', description: '短い補足を、必要なときだけ表示します。', level: '初級', reason: 'ホバーとフォーカスを両立します。', icon: '?' },
  { name: 'Toast', slug: 'toast', category: 'フィードバック', description: '操作結果を一時的に知らせるメッセージです。', level: '中級', reason: '表示時間と消し方を考えます。', icon: '!' },
  { name: 'Drawer', slug: 'drawer', category: '表示切替', description: '画面の横から補助パネルを表示します。', level: '中級', reason: '開閉時の画面操作に配慮します。', icon: '☰' },
  { name: 'Toggle', slug: 'toggle', category: '操作', description: 'ON / OFFをひとつのスイッチで切り替えます。', level: '初級', reason: '状態を色だけに頼らず伝えます。', icon: '◐' },
  { name: 'Checkbox', slug: 'checkbox', category: 'フォーム', description: '複数の項目から選ぶときに使います。', level: '初級', reason: '選択状態を明確にします。', icon: '☑' },
  { name: 'Radio Button', slug: 'radio', category: 'フォーム', description: '候補の中からひとつだけ選びます。', level: '初級', reason: '初期選択の扱いを決めます。', icon: '◉' },
  { name: 'Select', slug: 'select', category: 'フォーム', description: '決まった候補からひとつを選択できます。', level: '初級', reason: '選択肢は短く整理します。', icon: '⌄' },
  { name: 'Search', slug: 'search', category: '操作', description: '入力した言葉に合う情報を絞り込みます。', level: '中級', reason: '結果なしの状態も用意します。', icon: '⌕' },
  { name: 'Pagination', slug: 'pagination', category: 'ナビゲーション', description: '長い一覧をページごとに分けて移動します。', level: '初級', reason: '現在のページを分かりやすくします。', icon: '1' },
  { name: 'Hamburger Menu', slug: 'hamburger', category: 'ナビゲーション', description: '小さな画面でメニューを開閉します。', level: '中級', reason: '開いていることを明示します。', icon: '☰' },
  { name: 'Mega Menu', slug: 'mega-menu', category: 'ナビゲーション', description: '多くの項目をグループで見せる大きなメニュー。', level: '上級', reason: '情報設計とキーボード操作が要点です。', icon: '▦' },
  { name: 'Lightbox', slug: 'lightbox', category: '表示切替', description: '画像を画面上で大きく表示します。', level: '中級', reason: '閉じる手段を複数用意します。', icon: '□' },
  { name: 'Form Validation', slug: 'validation', category: 'フォーム', description: '入力内容に応じてエラーや成功を伝えます。', level: '中級', reason: '何を直すか具体的に示します。', icon: '✓' },
  { name: 'Progress Bar', slug: 'progress', category: 'フィードバック', description: '処理や入力の進み具合を視覚化します。', level: '初級', reason: '現在値を数値でも伝えます。', icon: '▰' },
  { name: 'Skeleton', slug: 'skeleton', category: 'フィードバック', description: '読み込み中のレイアウトを予告表示します。', level: '初級', reason: '待ち時間の不安を減らします。', icon: '▤' },
  { name: 'Stepper', slug: 'stepper', category: 'ナビゲーション', description: '複数ステップの現在地を示します。', level: '中級', reason: '戻る操作と進行状態を扱います。', icon: '①' },
  { name: 'File Upload', slug: 'file-upload', category: 'フォーム', description: 'ファイルを選択・アップロードします。', level: '中級', reason: '形式や容量のエラーを示します。', icon: '↑' },
  { name: 'Date Picker', slug: 'date-picker', category: 'フォーム', description: '日付をカレンダーから選択します。', level: '中級', reason: '日付形式と範囲に注意します。', icon: '□' },
  { name: 'Password Input', slug: 'password', category: 'フォーム', description: '文字を隠してパスワードを入力します。', level: '初級', reason: '表示・非表示を切り替えられます。', icon: '●' },
  { name: 'Floating Button', slug: 'floating', category: '操作', description: '画面上で目立つ固定アクションボタンです。', level: '初級', reason: '内容を隠さない配置が大切です。', icon: '+' },
  { name: 'Popover', slug: 'popover', category: '表示切替', description: 'ボタンの近くに補助情報を表示します。', level: '中級', reason: '表示位置と閉じ方を決めます。', icon: 'i' },
  { name: 'Slider', slug: 'slider', category: 'フォーム', description: 'スライドで値や表示内容を切り替えます。', level: '初級', reason: '現在値を併記します。', icon: '↔' },
  { name: 'Rating', slug: 'rating', category: 'フォーム', description: '星などで満足度や評価を入力します。', level: '初級', reason: '選択済みの数を伝えます。', icon: '★' },
  { name: 'Range Slider', slug: 'range-slider', category: 'フォーム', description: '数値の範囲をドラッグして指定します。', level: '中級', reason: '最小・最大値を見せます。', icon: '↔' },
];
const categories = ['すべて', '操作', '表示切替', 'コンテンツ', 'ナビゲーション', 'フォーム', 'フィードバック', '補足'];
const learnParts: LearnPart[] = [
  { name: 'Button', slug: 'button', description: '行動を促す' },
  { name: 'Header', slug: 'hamburger', description: 'サイトの入口' },
  { name: 'Navigation', slug: 'mega-menu', description: 'ページを案内する' },
  { name: 'Card', slug: 'card', description: '情報をまとめる' },
  { name: 'Form', slug: 'validation', description: '入力して送る' },
  { name: 'Accordion', slug: 'accordion', description: '情報を開閉する' },
];
const searchAliases: Record<string, string[]> = {
  button: ['ボタン', '押す', 'クリック', '送信', '申込', 'CTA', 'リンク', 'アクション'],
  accordion: ['アコーディオン', '開閉', '開く', '閉じる', '折りたたみ', 'FAQ', '質問'],
  modal: ['モーダル', 'ポップアップ', '確認画面', 'ダイアログ', '重ねる'],
  card: ['カード', '記事', '商品', 'プロフィール', '一覧'], tabs: ['タブ', '切り替え', '切替'],
  carousel: ['カルーセル', 'スライダー', 'スライド', '横スクロール'], dropdown: ['ドロップダウン', 'プルダウン', 'メニュー', '選択肢'],
  tooltip: ['ツールチップ', '補足', '説明', 'ホバー'], toast: ['トースト', '通知', '完了', '保存しました'],
  drawer: ['ドロワー', 'サイドバー', '横から', 'フィルター'], toggle: ['トグル', 'スイッチ', 'ON', 'OFF'],
  checkbox: ['チェックボックス', 'チェック', '複数選択', '同意'], radio: ['ラジオボタン', 'ラジオ', '一つ選択', '単一選択'],
  select: ['セレクト', '選択', '選ぶ', '選択肢'], search: ['検索', 'さがす', '探す', 'キーワード'],
  pagination: ['ページネーション', 'ページ送り', 'ページ番号', '次のページ'], hamburger: ['ハンバーガー', 'ハンバーガーメニュー', 'スマホメニュー', 'ヘッダー'],
  'mega-menu': ['メガメニュー', '大きいメニュー', 'ナビゲーション'], lightbox: ['ライトボックス', '画像拡大', '拡大表示'],
  validation: ['バリデーション', '入力チェック', 'エラー', 'フォーム'], progress: ['プログレスバー', '進捗', '進行状況'],
  skeleton: ['スケルトン', 'ローディング', '読み込み中'], stepper: ['ステッパー', 'ステップ', '手順'],
  'file-upload': ['ファイルアップロード', 'アップロード', 'ファイル選択'], 'date-picker': ['デートピッカー', '日付', 'カレンダー'],
  password: ['パスワード', '表示切替', '目のアイコン'], floating: ['フローティングボタン', '固定ボタン', '丸いボタン'],
  popover: ['ポップオーバー', '吹き出し', '補足表示'], slider: ['スライダー', 'つまみ', '値を選ぶ'],
  rating: ['レーティング', '評価', '星', 'スター'], 'range-slider': ['レンジスライダー', '範囲', '最小', '最大'],
};
const codeSamples: Record<string, string> = {
  button: `<button class="button" type="button">お問い合わせ</button>\n\n<style>\n.button { background: #f07a25; border: 0; border-radius: 4px; color: #fff; font-weight: 700; padding: 10px 18px; }\n.button:hover { background: #d66314; }\n</style>`,
  accordion: `<div class="accordion">\n  <button class="accordion-trigger" aria-expanded="false">料金について <span>+</span></button>\n  <p class="accordion-panel" hidden>基本プランは月額0円から利用できます。</p>\n</div>\n\n<style>\n.accordion { border: 1px solid #d5dce7; max-width: 500px; }\n.accordion-trigger { align-items: center; background: #fff; border: 0; color: #223555; display: flex; font-weight: 700; justify-content: space-between; padding: 13px 15px; text-align: left; width: 100%; }\n.accordion-trigger span { color: #f07a25; font-size: 20px; }\n.accordion-panel { border-top: 1px solid #d5dce7; color: #667085; margin: 0; padding: 12px 15px; }\n</style>\n\n<script>\nconst trigger = document.querySelector('.accordion-trigger');\nconst panel = document.querySelector('.accordion-panel');\ntrigger.onclick = () => {\n  const open = trigger.getAttribute('aria-expanded') === 'true';\n  trigger.setAttribute('aria-expanded', String(!open));\n  trigger.querySelector('span').textContent = open ? '+' : '−';\n  panel.hidden = open;\n};\n</script>`,
  modal: `<button id="open-modal" type="button">確認画面を開く</button>\n<dialog id="modal"><p>保存しますか？</p><button>閉じる</button></dialog>\n\n<script>\nconst modal = document.querySelector('#modal');\ndocument.querySelector('#open-modal').onclick = () => modal.showModal();\nmodal.querySelector('button').onclick = () => modal.close();\n</script>`,
  card: `<article class="card">\n  <div class="card-image">UI</div>\n  <div><small>Web design</small><strong>読みやすいカード</strong>\n  <button type="button">☆ お気に入り</button></div>\n</article>\n\n<style>\n.card { background: #fff; border: 1px solid #d5dce7; display: grid; gap: 10px; grid-template-columns: 62px 1fr; padding: 9px; }\n.card-image { background: #e9eef5; color: #223555; display: grid; font-weight: 700; min-height: 64px; place-items: center; }\n.card small, .card strong, .card button { display: block; }\n.card small { color: #667085; }\n.card strong { color: #223555; font-size: 14px; margin-top: 2px; }\n.card button { background: transparent; border: 0; color: #f07a25; margin-top: 5px; padding: 0; }\n</style>`,
  tabs: `<div class="tabs">\n  <div role="tablist" aria-label="コンテンツ">\n    <button role="tab" aria-selected="true">概要</button>\n    <button role="tab" aria-selected="false">使い方</button>\n    <button role="tab" aria-selected="false">注意点</button>\n  </div>\n  <p role="tabpanel">同じ種類の内容を、ひとつの場所で切り替えます。</p>\n</div>\n\n<style>\n.tabs [role="tablist"] { border-bottom: 1px solid #d5dce7; display: flex; }\n.tabs [role="tab"] { background: transparent; border: 0; border-bottom: 2px solid transparent; color: #667085; flex: 1; padding: 8px 0; }\n.tabs [role="tab"][aria-selected="true"] { border-color: #f07a25; color: #223555; font-weight: 700; }\n.tabs p { color: #667085; margin: 10px 0 0; }\n</style>\n\n<script>\nconst tabs = [...document.querySelectorAll('[role="tab"]')];\nconst panel = document.querySelector('[role="tabpanel"]');\nconst messages = ['同じ種類の内容を、ひとつの場所で切り替えます。', 'タブ名は短く、内容が想像できる言葉にします。', 'タブを増やしすぎないように注意します。'];\ntabs.forEach((tab, index) => tab.onclick = () => { tabs.forEach((item) => item.setAttribute('aria-selected', 'false')); tab.setAttribute('aria-selected', 'true'); panel.textContent = messages[index]; });\n</script>`,
  carousel: `<div class="carousel">\n  <div class="carousel-stage"><span>01</span><strong>記事カード</strong></div>\n  <div class="carousel-controls"><button aria-label="前のスライド">←</button><span>1 / 3</span><button aria-label="次のスライド">→</button></div>\n</div>\n\n<style>\n.carousel-stage { background: #e9eef5; color: #223555; display: grid; min-height: 82px; place-items: center; }\n.carousel-stage span { font-size: 12px; font-weight: 700; }\n.carousel-stage strong { font-size: 15px; }\n.carousel-controls { align-items: center; display: flex; gap: 15px; justify-content: center; margin-top: 9px; }\n.carousel-controls button { background: transparent; border: 0; color: #223555; font-size: 18px; padding: 0; }\n.carousel-controls span { color: #667085; font-size: 12px; }\n</style>`,
  dropdown: `<button aria-expanded="false">選択してください</button>\n<ul hidden><li>デザイン</li><li>コーディング</li></ul>`, tooltip: `<button aria-describedby="tip">？</button>\n<span id="tip" role="tooltip">補足説明です</span>`,
  toast: `<button type="button">保存する</button>\n<div role="status" aria-live="polite">保存しました</div>`, drawer: `<button aria-expanded="false" aria-controls="drawer">フィルターを開く</button>\n<aside id="drawer">絞り込み</aside>`,
  toggle: `<label><input type="checkbox" role="switch" /> 通知を受け取る</label>`, checkbox: `<label><input type="checkbox" /> メールを受け取る</label>`,
  radio: `<label><input type="radio" name="kind" /> 個人</label>\n<label><input type="radio" name="kind" /> 法人</label>`,
  select: `<label>色を選ぶ<select><option>ネイビー</option><option>オレンジ</option></select></label>`, search: `<label>検索<input type="search" placeholder="キーワードを入力" /></label>`,
  pagination: `<nav aria-label="ページ送り"><a aria-current="page" href="#">1</a><a href="#">2</a><a href="#">3</a></nav>`, hamburger: `<button aria-expanded="false" aria-controls="menu">☰ <span class="sr-only">メニューを開く</span></button>\n<nav id="menu" hidden>…</nav>`,
  'mega-menu': `<button aria-expanded="false" aria-controls="mega-menu">製品メニュー</button>\n<nav id="mega-menu" hidden><a href="#">Webサイト</a><a href="#">バナー</a></nav>`, lightbox: `<button type="button">画像を拡大</button>\n<dialog><img src="image.jpg" alt="拡大した画像" /></dialog>`,
  validation: `<label>メールアドレス<input type="email" required /></label>\n<p class="error-message">メールアドレスを確認してください。</p>`, progress: `<progress value="35" max="100">35%</progress>`,
  skeleton: `<div class="skeleton" aria-busy="true" aria-label="読み込み中"></div>`, stepper: `<ol><li aria-current="step">入力</li><li>確認</li><li>完了</li></ol>`,
  'file-upload': `<label>ファイルを選択<input type="file" accept="image/*,.pdf" /></label>`, 'date-picker': `<label>日付<input type="date" /></label>`,
  password: `<label>パスワード<input type="password" autocomplete="current-password" /></label>`, floating: `<button class="floating-button" aria-label="お問い合わせ">+</button>`,
  popover: `<button popovertarget="detail">詳細</button>\n<div id="detail" popover>ここに補足情報を表示します。</div>`, slider: `<label>音量<input type="range" min="0" max="100" value="35" /></label>`,
  rating: `<fieldset><legend>評価</legend><label>★<input type="radio" name="rating" value="1" /></label></fieldset>`, 'range-slider': `<label>価格帯<input type="range" min="0" max="100" value="35" /></label>`,
};
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase('ja-JP').replace(/[\s　_-]/g, '');
const createPreviewDocument = (source: string) => `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>\n*{box-sizing:border-box}body{align-items:center;color:#333;display:grid;font:14px/1.6 system-ui,sans-serif;margin:0;min-height:100%;padding:14px}button,input,select{font:inherit}button{cursor:pointer}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #f07a25;outline-offset:2px}input,select{border:1px solid #b8c3d4;border-radius:4px;padding:8px}label{color:#223555;font-weight:700}a{color:#223555}[hidden]{display:none}.skeleton{background:#e9eef5;border-radius:4px;height:72px;width:100%}.floating-button{background:#f07a25;border:0;border-radius:50%;color:#fff;font-size:24px;height:48px;width:48px}.error-message{color:#c23934}progress{accent-color:#f07a25;width:100%}nav{display:flex;gap:10px}\n</style></head><body>${source}</body></html>`;

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="section-heading"><p>{eyebrow}</p><h2>{title}</h2>{text && <span>{text}</span>}</div>;
}
function PartPreview({ part }: { part: Part }) {
  return <iframe className="card-playground-frame" title={`${part.name} のカードプレビュー`} sandbox="allow-scripts" srcDoc={createPreviewDocument(codeSamples[part.slug] ?? '')} />;
}

export default function Home() {
  const [query, setQuery] = useState(''); const [category, setCategory] = useState('すべて'); const [selectedSlug, setSelectedSlug] = useState('accordion'); const [editableCode, setEditableCode] = useState(codeSamples.accordion); const [mobileOpen, setMobileOpen] = useState(false); const [favorites, setFavorites] = useState<string[]>([]);
  const selectedPart = parts.find((part) => part.slug === selectedSlug) ?? parts[0];
  const defaultCode = codeSamples[selectedPart.slug] ?? `<${selectedPart.slug}>${selectedPart.name}</${selectedPart.slug}>`;
  const previewDocument = createPreviewDocument(editableCode);
  const filtered = useMemo(() => {
    const terms = query.split(/[\s　]+/).map(normalize).filter(Boolean);
    return parts.filter((part) => {
      const searchable = normalize([part.name, part.slug, part.category, part.description, part.reason, ...(searchAliases[part.slug] ?? [])].join(' '));
      return (category === 'すべて' || part.category === category) && terms.every((term) => searchable.includes(term));
    });
  }, [query, category]);
  const toggleFavorite = (name: string) => setFavorites((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  const showDetails = (slug: string) => { setSelectedSlug(slug); setEditableCode(codeSamples[slug] ?? `<${slug}>${slug}</${slug}>`); window.requestAnimationFrame(() => document.querySelector('#preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })); };
  return <>
    <header className="site-header"><div className="container header-inner"><a className="brand" href="#top">WEB PARTS <em>図鑑</em></a><button className="menu-button" aria-expanded={mobileOpen} aria-controls="site-nav" onClick={() => setMobileOpen(!mobileOpen)}><span></span><span></span><span></span></button><nav id="site-nav" className={mobileOpen ? 'open' : ''}><a href="#parts" onClick={() => setMobileOpen(false)}>パーツを探す</a><a href="#learn" onClick={() => setMobileOpen(false)}>はじめての方へ</a><a href="#about" onClick={() => setMobileOpen(false)}>この図鑑について</a></nav></div></header>
    <main id="top">
      <section className="hero"><div className="container hero-inner"><p className="eyebrow">UI COMPONENTS FOR BEGINNERS</p><h1>名前が分からなくても探せる<br />Webパーツ図鑑</h1><p className="hero-lead">見て、触って、名前と使い方を知る。<br />Web制作でよく出会うUIを、ひとつずつ集めました。</p><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setCategory('すべて'); }} placeholder="たとえば「開く」「切り替える」で探す" aria-label="Webパーツを検索" /><a href="#parts" onClick={() => setCategory('すべて')}>探す</a></label><p className="search-note">これ何て名前？　<span>ボタン</span><span>開閉</span><span>タブ</span><span>カード</span></p></div></section>
      <section id="parts" className="section soft-section"><div className="container"><SectionTitle eyebrow="LOOK & TRY" title="よく見るWebパーツ" text="カードと「コードを見る」は、同じサンプルを表示しています。" /><div className="filter-row">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><p className="result-count"><b>{filtered.length}</b> 件のパーツ</p><div className="parts-grid">{filtered.map((part) => <article className="part-card" key={part.name}><div className="card-top"><span className="part-icon">{part.icon}</span><button className="favorite" aria-label={`${part.name}をお気に入りに追加`} aria-pressed={favorites.includes(part.name)} onClick={() => toggleFavorite(part.name)}>{favorites.includes(part.name) ? '★' : '☆'}</button></div><div className="card-copy"><p>{part.category}</p><h3>{part.name}</h3><span>{part.description}</span></div><div className="card-preview"><PartPreview part={part} /></div><div className="card-footer"><span className={`level level-${part.level}`}>{part.level}</span><button className="code-link" onClick={() => showDetails(part.slug)}>コードを見る <b>→</b></button></div></article>)}</div>{filtered.length === 0 && <p className="empty-result">「{query}」に一致するパーツは見つかりませんでした。別の言葉でも試してみてください。</p>}</div></section>
      <section id="learn" className="section"><div className="container"><SectionTitle eyebrow="START HERE" title="まず覚えたいWebパーツ" text="サイトづくりの基本から、順番に見ていけます。" /><ol className="learn-list">{learnParts.map((item, index) => <li key={item.name}><button onClick={() => showDetails(item.slug)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.name}</strong><small>{item.description}</small><b>→</b></button></li>)}</ol></div></section>
      <section id="preview" className="section detail-section"><div className="container"><p className="detail-breadcrumb">{selectedPart.category}　/　{selectedPart.name}</p><div className="detail-heading"><div><p className="eyebrow">INTERACTIVE PREVIEW</p><h2>{selectedPart.name}</h2><p>{selectedPart.description}</p></div><span className={`level level-${selectedPart.level}`}>{selectedPart.level}：{selectedPart.reason}</span></div><div className="interactive-panel"><div className="panel-label">編集結果のライブプレビュー</div><iframe className="playground-frame" title={`${selectedPart.name} のライブプレビュー`} sandbox="allow-scripts" srcDoc={previewDocument} /></div><div className="detail-grid"><div><h3>どんなパーツ？</h3><p>{selectedPart.description}</p></div><div><h3>実装で気を付けること</h3><p>{selectedPart.reason}</p></div><div><h3>検索できる言葉</h3><p>{(searchAliases[selectedPart.slug] ?? []).slice(0, 4).join(' / ')}</p></div></div><div className="code-preview"><div><span>{selectedPart.name} のサンプルコード</span><div><button onClick={() => setEditableCode(defaultCode)}>リセット</button><button onClick={() => navigator.clipboard?.writeText(editableCode)}>コピー</button></div></div><label className="code-editor-label" htmlFor="code-editor">HTML / CSS / JavaScript を編集すると、上のプレビューへ即時反映されます。</label><textarea id="code-editor" className="code-editor" value={editableCode} onChange={(event) => setEditableCode(event.target.value)} spellCheck="false" /></div></div></section>
      <section id="about" className="about-band"><div className="container"><p className="eyebrow">ABOUT THIS PROJECT</p><h2>「これ、何て名前？」を<br />10秒で解決するための図鑑です。</h2><p>見た目から探して、触ってみて、名前・用途・コードまで自然にたどり着けることを目指しています。</p></div></section>
    </main>
    <footer className="site-footer"><div className="footer-top"><div className="container"><a href="#top">Webパーツ図鑑</a><nav><a href="#parts">パーツを探す</a><a href="#learn">はじめての方へ</a></nav></div></div><div className="footer-bottom">© 2026 Aoi. All Rights Reserved.</div></footer>
  </>;
}
