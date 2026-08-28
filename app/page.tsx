'use client';

import { useEffect, useMemo, useState } from 'react';

type Part = { name: string; slug: string; category: string; description: string; level: string; reason: string; icon: string };

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

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="section-heading"><p>{eyebrow}</p><h2>{title}</h2>{text && <span>{text}</span>}</div>;
}
function ButtonPreview() {
  const [loading, setLoading] = useState(false);
  return <button className="sample-button" disabled={loading} onClick={() => { setLoading(true); window.setTimeout(() => setLoading(false), 850); }}>{loading ? '送信中…' : 'お問い合わせ'}</button>;
}
function AccordionPreview({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return <div className={`mini-accordion ${compact ? 'compact' : ''}`}><button aria-expanded={open} onClick={() => setOpen(!open)}>料金について <span>{open ? '−' : '+'}</span></button>{open && <p>基本プランは月額0円から利用できます。</p>}</div>;
}
function TabsPreview({ compact = false }: { compact?: boolean }) {
  const [tab, setTab] = useState(0); const labels = ['概要', '使い方', '注意点'];
  return <div className={`mini-tabs ${compact ? 'compact' : ''}`}><div role="tablist">{labels.map((label, index) => <button role="tab" aria-selected={tab === index} key={label} onClick={() => setTab(index)}>{label}</button>)}</div><p>{['同じ種類の内容を、ひとつの場所で切り替えます。', 'タブ名は短く、内容が想像できる言葉にします。', 'タブを増やしすぎないように注意します。'][tab]}</p></div>;
}
function CarouselPreview() {
  const [index, setIndex] = useState(0); const slides = ['記事カード', '商品カード', 'プロフィール'];
  return <div className="mini-carousel"><div className="carousel-stage"><span>{String(index + 1).padStart(2, '0')}</span><strong>{slides[index]}</strong></div><div><button aria-label="前のスライド" onClick={() => setIndex((index + 2) % 3)}>←</button><span>{index + 1} / 3</span><button aria-label="次のスライド" onClick={() => setIndex((index + 1) % 3)}>→</button></div></div>;
}
function CardPreview() {
  const [saved, setSaved] = useState(false);
  return <article className="mini-card"><div className="mini-card-image"><span>UI</span></div><div><small>Web design</small><strong>読みやすいカード</strong><button aria-pressed={saved} onClick={() => setSaved(!saved)}>{saved ? '★ 保存済み' : '☆ お気に入り'}</button></div></article>;
}
function ExtraPreview({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false); const [value, setValue] = useState(35); const [choice, setChoice] = useState(''); const [step, setStep] = useState(1); const [rating, setRating] = useState(0); const [loaded, setLoaded] = useState(true); const [text, setText] = useState('');
  if (slug === 'dropdown' || slug === 'mega-menu') return <div className="extra-demo"><button className="demo-trigger" onClick={() => setOpen(!open)}>{slug === 'mega-menu' ? '製品メニュー' : '選択してください'}　⌄</button>{open && <div className="demo-popover">{slug === 'mega-menu' ? <><b>制作</b><span>Webサイト</span><span>バナー</span></> : <><span>デザイン</span><span>コーディング</span><span>学習</span></>}</div>}</div>;
  if (slug === 'tooltip') return <span className="tooltip-wrap" tabIndex={0}>？<i>補足説明です</i></span>;
  if (slug === 'toast') return <div className="extra-demo"><button className="sample-button" onClick={() => { setOpen(true); window.setTimeout(() => setOpen(false), 1800); }}>保存する</button>{open && <span className="toast">✓ 保存しました</span>}</div>;
  if (slug === 'drawer' || slug === 'hamburger') return <div className="extra-demo drawer-demo"><button className="demo-trigger" onClick={() => setOpen(!open)}>{slug === 'drawer' ? 'フィルターを開く' : '☰ メニュー'}</button><aside className={open ? 'shown' : ''}><b>{slug === 'drawer' ? '絞り込み' : 'メニュー'}</b><span>デザイン</span><span>コード</span></aside></div>;
  if (slug === 'toggle') return <label className="toggle"><input type="checkbox" onChange={(event) => setOpen(event.target.checked)} /><i></i><span>{open ? 'ON' : 'OFF'}</span></label>;
  if (slug === 'checkbox') return <label className="check-demo"><input type="checkbox" onChange={(event) => setOpen(event.target.checked)} /> メールを受け取る <b>{open ? '選択中' : ''}</b></label>;
  if (slug === 'radio') return <div className="radio-demo">{['個人', '法人'].map((item) => <label key={item}><input type="radio" name="kind" checked={choice === item} onChange={() => setChoice(item)} /> {item}</label>)}</div>;
  if (slug === 'select') return <select className="native-select" onChange={(event) => setChoice(event.target.value)} value={choice}><option value="">色を選ぶ</option><option>ネイビー</option><option>オレンジ</option></select>;
  if (slug === 'search') return <div className="search-demo"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="button と入力" /><span>{text ? `「${text}」の検索結果` : 'キーワードを入力'}</span></div>;
  if (slug === 'pagination') return <div className="pagination">{[1, 2, 3].map((item) => <button className={step === item ? 'active' : ''} key={item} onClick={() => setStep(item)}>{item}</button>)}</div>;
  if (slug === 'lightbox') return <div className="lightbox-demo"><button onClick={() => setOpen(true)}>画像を拡大</button>{open && <div className="lightbox-inset" onClick={() => setOpen(false)}><b>IMAGE</b><span>クリックで閉じる</span></div>}</div>;
  if (slug === 'validation') return <div className="validation-demo"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="メールアドレス" />{text && <span className={text.includes('@') ? 'success' : 'error'}>{text.includes('@') ? '✓ 入力OKです' : 'メールアドレスを確認してください'}</span>}</div>;
  if (slug === 'progress' || slug === 'slider' || slug === 'range-slider') return <div className="range-demo"><input type="range" min="0" max="100" value={value} onChange={(event) => setValue(Number(event.target.value))} /><span>{value}{slug === 'range-slider' ? '〜100' : '%'}</span></div>;
  if (slug === 'skeleton') return <div className="skeleton-demo"><button className="demo-trigger" onClick={() => { setLoaded(false); window.setTimeout(() => setLoaded(true), 1000); }}>読み込みを再現</button>{loaded ? <b>コンテンツを表示しました</b> : <i></i>}</div>;
  if (slug === 'stepper') return <div className="stepper"><div>{[1, 2, 3].map((item) => <b className={item <= step ? 'current' : ''} key={item}>{item}</b>)}</div><button className="demo-trigger" onClick={() => setStep(step === 3 ? 1 : step + 1)}>次へ</button></div>;
  if (slug === 'file-upload') return <label className="file-demo">ファイルを選択<input type="file" onChange={(event) => setChoice(event.target.files?.[0]?.name ?? '')} /><span>{choice || '未選択'}</span></label>;
  if (slug === 'date-picker') return <input className="date-demo" type="date" onChange={(event) => setChoice(event.target.value)} />;
  if (slug === 'password') return <div className="password-demo"><input type={open ? 'text' : 'password'} defaultValue="sample123" /><button onClick={() => setOpen(!open)}>{open ? '隠す' : '表示'}</button></div>;
  if (slug === 'floating') return <button className="floating-demo" onClick={() => setOpen(!open)}>{open ? '✓' : '+'}</button>;
  if (slug === 'popover') return <div className="extra-demo"><button className="demo-trigger" onClick={() => setOpen(!open)}>詳細 <b>i</b></button>{open && <div className="demo-popover">ここに補足情報を表示します。</div>}</div>;
  if (slug === 'rating') return <div className="rating-demo">{[1, 2, 3, 4, 5].map((item) => <button className={item <= rating ? 'selected' : ''} key={item} onClick={() => setRating(item)}>★</button>)}<span>{rating || '未評価'}</span></div>;
  return null;
}
function PartPreview({ part, onModal }: { part: Part; onModal: () => void }) {
  if (part.slug === 'button') return <ButtonPreview />; if (part.slug === 'accordion') return <AccordionPreview compact />; if (part.slug === 'modal') return <button className="outline-button" onClick={onModal}>確認画面を開く</button>; if (part.slug === 'card') return <CardPreview />; if (part.slug === 'tabs') return <TabsPreview compact />; if (part.slug === 'carousel') return <CarouselPreview />; return <ExtraPreview slug={part.slug} />;
}

export default function Home() {
  const [query, setQuery] = useState(''); const [category, setCategory] = useState('すべて'); const [modalOpen, setModalOpen] = useState(false); const [mobileOpen, setMobileOpen] = useState(false); const [favorites, setFavorites] = useState<string[]>([]);
  const filtered = useMemo(() => parts.filter((part) => (category === 'すべて' || part.category === category) && `${part.name} ${part.description} ${part.category}`.toLowerCase().includes(query.toLowerCase())), [query, category]);
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setModalOpen(false); }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, []);
  const toggleFavorite = (name: string) => setFavorites((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  return <>
    <header className="site-header"><div className="container header-inner"><a className="brand" href="#top">WEB PARTS <em>図鑑</em></a><button className="menu-button" aria-expanded={mobileOpen} aria-controls="site-nav" onClick={() => setMobileOpen(!mobileOpen)}><span></span><span></span><span></span></button><nav id="site-nav" className={mobileOpen ? 'open' : ''}><a href="#parts" onClick={() => setMobileOpen(false)}>パーツを探す</a><a href="#learn" onClick={() => setMobileOpen(false)}>はじめての方へ</a><a href="#about" onClick={() => setMobileOpen(false)}>この図鑑について</a></nav></div></header>
    <main id="top">
      <section className="hero"><div className="container hero-inner"><p className="eyebrow">UI COMPONENTS FOR BEGINNERS</p><h1>名前が分からなくても探せる<br />Webパーツ図鑑</h1><p className="hero-lead">見て、触って、名前と使い方を知る。<br />Web制作でよく出会うUIを、ひとつずつ集めました。</p><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="たとえば「開く」「切り替える」で探す" aria-label="Webパーツを検索" /><a href="#parts">探す</a></label><p className="search-note">これ何て名前？　<span>ボタン</span><span>開閉</span><span>タブ</span><span>カード</span></p></div></section>
      <section id="parts" className="section soft-section"><div className="container"><SectionTitle eyebrow="LOOK & TRY" title="よく見るWebパーツ" text="カードの中でも、気になる動きを試せます。" /><div className="filter-row">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><p className="result-count"><b>{filtered.length}</b> 件のパーツ</p><div className="parts-grid">{filtered.map((part) => <article className="part-card" key={part.name}><div className="card-top"><span className="part-icon">{part.icon}</span><button className="favorite" aria-label={`${part.name}をお気に入りに追加`} aria-pressed={favorites.includes(part.name)} onClick={() => toggleFavorite(part.name)}>{favorites.includes(part.name) ? '★' : '☆'}</button></div><div className="card-copy"><p>{part.category}</p><h3>{part.name}</h3><span>{part.description}</span></div><div className="card-preview"><PartPreview part={part} onModal={() => setModalOpen(true)} /></div><div className="card-footer"><span className={`level level-${part.level}`}>{part.level}</span><a href="#preview">コードを見る <b>→</b></a></div></article>)}</div></div></section>
      <section id="learn" className="section"><div className="container"><SectionTitle eyebrow="START HERE" title="まず覚えたいWebパーツ" text="サイトづくりの基本から、順番に見ていけます。" /><ol className="learn-list">{['Button', 'Header', 'Navigation', 'Card', 'Form', 'Accordion'].map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong><small>{['行動を促す', 'サイトの入口', 'ページを案内する', '情報をまとめる', '入力して送る', '情報を開閉する'][index]}</small><b>→</b></li>)}</ol></div></section>
      <section id="preview" className="section detail-section"><div className="container"><p className="detail-breadcrumb">表示切替　/　Accordion</p><div className="detail-heading"><div><p className="eyebrow">INTERACTIVE PREVIEW</p><h2>Accordion <span>アコーディオン</span></h2><p>質問を押すと内容が開閉するパーツです。FAQや設定画面でよく使われます。</p></div><span className="level level-中級">中級：開閉状態を管理します</span></div><div className="interactive-panel"><div className="panel-label">触ってみる</div><div className="full-accordion"><AccordionPreview /></div></div><div className="detail-grid"><div><h3>どんなパーツ？</h3><p>限られたスペースで、必要な人だけに詳しい情報を見せたいときに便利です。</p></div><div><h3>デザインするときのポイント</h3><p>開いている状態・閉じている状態が一目で分かる記号と余白を用意します。</p></div><div><h3>よくあるバリエーション</h3><p>FAQ / 商品詳細 / 設定画面</p></div></div><div className="code-preview"><div><span>HTML + CSS + JavaScript</span><button onClick={() => navigator.clipboard?.writeText('<button aria-expanded="false">質問</button>')}>コピー</button></div><pre><code>{`<button aria-expanded="false">\n  料金について\n</button>`}</code></pre></div></div></section>
      <section id="about" className="about-band"><div className="container"><p className="eyebrow">ABOUT THIS PROJECT</p><h2>「これ、何て名前？」を<br />10秒で解決するための図鑑です。</h2><p>見た目から探して、触ってみて、名前・用途・コードまで自然にたどり着けることを目指しています。</p></div></section>
    </main>
    <footer className="site-footer"><div className="footer-top"><div className="container"><a href="#top">Webパーツ図鑑</a><nav><a href="#parts">パーツを探す</a><a href="#learn">はじめての方へ</a><a href="https://aoi-ymgc.github.io/portfolio/" target="_blank" rel="noreferrer">Portfolio ↗</a></nav></div></div><div className="footer-bottom">© 2026 Aoi Yamaguchi. All Rights Reserved.</div></footer>
    {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><section className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" aria-label="閉じる" onClick={() => setModalOpen(false)}>×</button><p>MODAL</p><h2 id="modal-title">保存しますか？</h2><span>この操作はいつでも取り消せます。</span><div><button className="outline-button" onClick={() => setModalOpen(false)}>キャンセル</button><button className="sample-button" onClick={() => setModalOpen(false)}>保存する</button></div></section></div>}
  </>;
}
