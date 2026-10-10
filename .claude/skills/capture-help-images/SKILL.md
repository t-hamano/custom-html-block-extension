---
name: capture-help-images
description: 設定画面「Editor config」のヘルプ画像（assets/images/admin/editor-config）を撮り直す・追加するときに使う。Playwright で Windows の Chrome を操作し、元画像と同じサイズ・範囲・操作で撮影する。
---

# ヘルプ画像の撮影

`bin/capture-help-images/` の API を使って、画像ごとに撮影スクリプトを書き、設定画面のプレビューエディタを撮影する。画像ごとの撮影内容はリポジトリに残さない。差し替えは数枚単位で行い、ユーザーが目視で確認して細かい調整を指示する。

## 準備

1. `curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/wp-login.php` で wp-env が動いているか確認し、動いていなければ `npm run wp-env start` で起動する。
2. `php` と `python3`、Windows の Google Chrome（`/mnt/c/Program Files/Google/Chrome/Application/chrome.exe`）があることを確認する。

撮影は Windows の Chrome で行う。WSL の Chromium は文字幅を整数に丸めるため、元画像と文字の位置がずれる。Chrome への接続は、WSL から直接つながらないため PowerShell で中継している。

初回の実行時に、`artifacts/capture-help-images/` に Python の仮想環境（Pillow、NumPy）とカーソル画像（`C:\Windows\Cursors` から取り出す）が自動で用意される。以下では `PY=artifacts/capture-help-images/venv/bin/python` とする。

## 手順

### 1. 今の画像を調べる

- サイズ、テーマ、写っているコード、切り抜きの位置を Read で見て確認する。
- 文字の行の位置と左右の端は `grid.py` で測る。

  ```sh
  $PY bin/capture-help-images/py/grid.py <画像> [GIF のコマ番号] [この x より左を無視]
  ```

- GIF は、コマの表示時間・マウスの位置・クリックを `track.py` で読み取り、`sheet.py` でコマの一覧を作って見る。スクリプトで指定するコマ番号は、この一覧のコマ番号と同じ。

  ```sh
  $PY bin/capture-help-images/py/track.py <GIF> artifacts/capture-help-images/cursors > track.json
  $PY bin/capture-help-images/py/sheet.py <GIF> sheet.png 1 track.json
  ```

### 2. 撮影スクリプトを書く

`artifacts/capture-help-images/scripts/<名前>.mjs`（git の管理外）に書く。

```js
import {
	openSession,
	focus,
	press,
	timeline,
	arrows,
} from '../../../bin/capture-help-images/index.mjs';

const session = await openSession();
try {
	// 静止画: 2行目の先頭にカーソルを置き、画像の赤い矢印を同じ位置に描き直す。
	await session.capture( {
		rel: 'editor-options/glyph-margin_1.jpg',
		options: { glyphMargin: true },
		value: '<p class="description">Lorem ipsum dolor sit amet</p>\n',
		caret: false,
		anchor: { line: 1, column: 1, ax: 83, ay: 0 },
		setup: ( ctx ) => focus( 2, 1 )( ctx.page ),
		annotations: ( ctx ) => arrows( ctx, { fixedX: true, fixedY: true } ),
	} );
	// GIF: 今の GIF と同じコマの表示時間で、3コマ目と5コマ目に Enter を押す。
	await session.capture( {
		rel: 'editor-options/find/loop.gif',
		value: '<p>Search Text1</p>\n<p>Search Text2</p>\n',
		setup: async ( ctx ) => {
			await focus( 1, 1 )( ctx.page );
			await press( 'Control+F' )( ctx.page );
		},
		steps: ( ctx ) => timeline( ctx, { 3: press( 'Enter' ), 5: press( 'Enter' ) } ),
	} );
} finally {
	await session.close();
}
```

### 3. 撮影して確認する

```sh
node artifacts/capture-help-images/scripts/<名前>.mjs
```

- 撮った画像は、今の画像の隣に `{名前}_new.{拡張子}` で保存される。
- 出力に `WARN ... the crop goes outside the editor` が出たら、切り抜きがエディタの外にはみ出している。ページの背景を写す場合（`allowOutside: true`）以外は、スクリプトを直す。
- 今の画像と並べた比較画像を作り、Read で見て確認する。

  ```sh
  # 静止画: 出力ファイル、倍率、画像の相対パス（複数可）
  $PY bin/capture-help-images/py/pairs.py compare.png 1 editor-options/glyph-margin_1.jpg
  # GIF: 出力ファイル、画像の相対パス、倍率、何コマおきに並べるか（各コマの左が今、右が新）
  $PY bin/capture-help-images/py/gifpairs.py compare.png editor-options/find/loop.gif 0.5 1
  ```

  確認すること:

  - 同じ行・文字が同じ位置に写っているか。
  - GIF の操作（入力、クリック、スクロール）の内容とタイミングが今の画像と同じか。
  - 今の画像にないもの（ホバー、意図しない選択範囲など）が写っていないか。

- 比較画像をユーザーに見せ、目視での確認と調整の指示を受ける。指示に沿ってスクリプトを直し、撮り直す。

### 4. 差し替える

ユーザーが問題ないと判断したら、`_new` の画像を元のファイル名に置き換える。

## API

`index.mjs` から読み込む。

### `openSession()`

`{ page, capture( spec ), close() }` を返す。`capture()` は1枚撮影して、保存したファイルのパスを返す。

spec の主な項目（全項目は `lib/capture.mjs` の冒頭）:

- `rel`: 撮影する画像の、`assets/images/admin/editor-config` からの相対パス。サイズはこの画像に合わせる。
- `value`: エディタのコード。省略すると、設定画面のプレビューの初期コード（`PREVIEW_CODE`）。
- `theme`: `'vs-dark'`（初期値）か `'light'`。
- `options`: プラグインの初期値に上書きするエディタの設定。
- `stage`、`stageX`、`stageY`: エディタのサイズ（初期値 600×400）とページ上の位置（初期値 40, 40）。
- `anchor: { line, column, ax, ay }`: その行・文字の左上が、画像の (ax, ay) に来るように切り抜く。
- `clip( ctx, W, H )`: `anchor` の代わりに、切り抜く範囲を返す。
- `orig: { x0, y0, cw, lh }`: 今の画像の文字の位置（1行1文字目の座標、1文字の幅、行の高さ）。`ctx.map()` で、今の画像の座標を今のエディタの同じ文字の位置に変換する。省略すると、`ctx.map()` は切り抜きの左上からの座標をそのまま使う。
- `setup( ctx )`: 切り抜く前の準備。静止画では、写す状態にする。
- `steps( ctx )`: GIF のコマごとの操作。`[{ dur, x, y, down, mods, wheel, action }]`。マウスは各コマの終わりに次の `x, y` へ動く。
- `annotations( ctx )`: 静止画に描く注釈（赤い矢印）。
- `caret: false`: テキストのキャレットを隠す。
- `showScrollbars: true`: スクロールバーを常に表示する。
- `cursor: true`: マウスカーソルとクリック時の黄色い円を描く（GIF）。
- `recreate: true`: エディタを作り直す。スクロールバーの矢印など、作るときにしか読まれない設定に使う。
- `allowOutside: true`: エディタの外（ページの背景）も切り抜く。

`ctx` の主な項目: `page`、`EX`・`EY`（エディタの位置）、`clip`、`pos( line, column )`（文字の左上のページ座標）、`map( x, y )`、`track()`（今の GIF の解析結果）、`editorEval( fn, arg )`（`fn( monaco, editor, arg )` をページで実行）、`css( text )`。

### ヘルパー

- **操作**（`steps` の `action` や `setup` で `( page )` を渡して使う）: `focus( line, column )`、`select( l1, c1, l2, c2 )`、`addCursor( line, column )`、`type( text )`、`press( key )`、`wheel( notches, horizontal )`、`clickAt( where )`、`setSettingValue( value, patch )`
- **位置**（`clickAt` に渡す）: `foldingControl( line )`、`afterLineEnd( line, gap )`
- **ステップ**: `timeline( ctx, actions )`（今の GIF のコマの表示時間に、コマ番号ごとの操作を付ける）、`mouseSteps( ctx, { map, down, actions } )`（今の GIF のマウスの動きを再生する）、`cropMap( ctx, dx, dy )`（切り抜きからの相対座標を変換する）
- **準備・切り抜き**: `scrollToLine`、`resize`、`rectOf`、`layoutInfo`、`editorWidth`、`alignRightWidget`（右端に付くウィジェットの位置を合わせる）、`fitRight`・`rightClip`（エディタの右端で切り抜く）、`backdrop`（ページの背景）、`placeSettingControl`（設定のコントロールをエディタの上に置く）、`inScrollablePage`（ページのスクロールを再現する）
- **注釈**: `arrows( ctx, { fixedX, fixedY } )`（今の画像の赤い矢印を測って描き直す）
- **その他**: `PREVIEW_CODE`、`IMG`、`WORK`

## 撮影の決まり

### 基本

- **エディタの設定:** プラグインの初期値（`classes/class-settings.php`）を使い、その画像が説明している設定だけを上書きする。ただし、下の「見やすくするためのルール」に当てはまる場合は、ほかの設定も変える。
- **テーマ:** 今の画像に合わせる。背景が暗ければ Visual Studio Dark、明るければ Light。
- **画像サイズ:** 今の画像と同じにする（ルール1でそろえた画像は、そのサイズ）。
- **画質:** JPG は画質92・色の間引きなし（4:4:4）、GIF は64色・ディザなし。
- **GIF の長さ:** 今の GIF の長さを目安にする。並べて表示する GIF はルール2に従う。
- **撮影範囲:** 今の画像で特定の行・文字が写っている位置に、同じ行・文字が来るように切り抜く。
- **マウス:** カーソルとクリック時の黄色い円をページ上に描く。スクリーンショットには OS のカーソルが写らないため。ホイールは `wheel()` を使う（1回50px）。

### 見やすくするためのルール

1. **同じ設定の画像は、写す条件をそろえる。** ヘルプでは同じ設定の画像が並べて表示されるので、画像サイズ・コード・エディタの大きさ・切り抜く位置をそろえ、違いは説明する設定の値だけにする。片方にだけページの余白が写る場合は、もう片方にも同じ余白を入れる。
2. **同じ操作の GIF は、フレーム単位でそろえる。** 並べた GIF はそれぞれ独立してループするので、全体の長さや操作の時刻が違うと、ループのたびにずれていく。グループ内の全画像で同じ操作を同じ時刻に行い、全体の長さもそろえる。今の GIF のコマを読み取る `timeline()` は使わず、`plan()` などで操作の時刻を直接決める。点滅のように周期のある動きは、長さを周期の倍数にして、ループのつなぎ目もずれないようにする。
3. **初期値のままでは違いが見えない設定は、関係する設定やコードを一時的に変える。** 例: スティッキースクロールのオフ、折りたたみ矢印の常時表示、コードの長さの調整、空白の表示。
4. **説明に関係ない表示は消す。** 例: マウスを止めて操作する GIF のホバー、入力中の候補、スクロールバーの動きを隠すミニマップ、意味のないマウスカーソル。
5. **小さくて読めない要素は、元画像と同じくらいの大きさにする。** 例: フォントサイズ、ミニマップの倍率、スクロールバーの幅。
6. **マウスは縦か横に直線で動かし、対象の上で止める。** 元画像の軌跡は再現しない。行き過ぎないようにする。
7. **赤い矢印は、指す対象の位置から決める。** 元画像と同じ座標ではなく、スクロールバーの矢印や行番号など、指す対象の中心を指す。
8. **ループの最後まで意味のある表示にする。** 例: スクロールしすぎて何もない領域を写さない。

### 画像ごとの設定

上のルールに沿って、次の画像は初期値と異なる設定で撮っている。撮り直すときも同じ設定にする。

- **ミニマップの倍率（ルール5）:**
  - `minimap.scale: 2`: `minimap/max-column.gif`、`minimap/show-slider_1.jpg`・`_2.gif`
  - `minimap.scale: 3`: `minimap/render-characters_1.jpg`・`_2.jpg`、`minimap/side_1.jpg`・`_2.jpg`（ミニマップ自体を見せる画像なので、さらに大きくする）
- **スクロールバーの幅（ルール5、元画像は20px）:**
  - 縦横とも `20`: `scrollbar/arrow-size_1.jpg`・`_2.jpg`、`scrollbar/horizontal-has-arrows_1.jpg`・`_2.jpg`、`scrollbar/vertical-has-arrows_1.jpg`・`_2.jpg`、`scrollbar/horizontal_2.jpg`・`_3.jpg`、`scrollbar/vertical_2.jpg`・`_3.jpg`
  - `verticalScrollbarSize: 20`: `scrollbar/vertical_1.gif`、`scrollbar/scroll-by-page.gif`、`overview-ruler-border_1.jpg`・`_2.jpg`
  - `horizontalScrollbarSize: 20`: `scrollbar/horizontal_1.gif`、`scroll-beyond-last-column_1.gif`・`_2.gif`
- **フォントサイズ（ルール5）:**
  - `fontSize: 19`、`lineHeight: 32`、`suggestFontSize: 19`、`suggestLineHeight: 32`: `suggest/show-icons_1.jpg`・`_2.jpg`
  - `fontSize: 19`、`lineHeight: 36`: `auto-indent_1.gif`〜`_3.gif`、`match-brackets_1.gif`〜`_3.gif`
  - `fontSize: 15.6`、`lineHeight: 30`: `occurrences-highlight_1.jpg`・`_2.jpg`
  - `fontSize: 23.8`、`lineHeight: 42`: `render-control-characters_1.jpg`・`_2.jpg`
  - `fontSize: 26.7`、`lineHeight: 28`: `rounded-selection_1.jpg`・`_2.jpg`
  - `fontSize: 10.2`、`lineHeight: 19`: `word-wrap_1.jpg`〜`_4.jpg`、`wrapping-indent_1.jpg`〜`_4.jpg`。元画像と同じ位置で折り返すよう、表示領域の幅（`layoutInfo.contentWidth`）を `word-wrap` は337px（1行目が「`<h1>Long long title.Long long title.Long long title.`」の52文字で折り返す、`wordWrapColumn: 36`）、`wrapping-indent` は365px（3行目が行頭の4スペースを含めて56文字で折り返す、`<p>` の中身は「`Long Long text.`」×11）にする。
  - `suggestFontSize: 17`、`suggestLineHeight: 24`: `suggest-font-size_2.jpg`。ヘルプの説明は「値を30にした例」だが、30では候補の文字が大きすぎるため、元画像の見た目に合わせている。
- **違いを見せるための設定・コード（ルール3）:**
  - `stickyScroll: { enabled: false }`: `cursor-surrounding-lines_1.gif`・`_2.gif`、`cursor-surrounding-lines-style_1.gif`・`_2.gif`。スティッキースクロールがオンだと、Monaco は「Number of lines to keep before and after the cursor」の値に関係なくカーソルの上下に5行以上の余白を取り、0〜5で違いが出ない。HTML では見出し行が出ないので、オフにしてもほかの見た目は変わらない。プラグイン側で無効になったら不要。
  - `showFoldingControls: 'always'`: `line-decorations-width.gif`。折りたたみの矢印はこの幅の領域に表示されるので、常に表示してどこの幅が変わるかを見せる。
  - `renderWhitespace: 'all'`、`tabSize: 4`（コードも4スペースでインデント）: `sticky-tab-stops_1.gif`・`_2.gif`。この設定はスペースのインデントでだけ意味があるため、空白を見せる。
  - コードの長さ: `minimap/size_1.jpg`〜`_3.jpg`。`_1`（proportional）と `_3`（fit）は約200行、`_2`（fill）は約30行（`h3` から始まる15行の塊を13回と2回）。長いコードでは fill と fit が同じに、短いコードでは fit と proportional が同じになるため、proportional ははみ出してスクロールする様子、fill は拡大して高さいっぱいに表示する様子、fit は縮めて全体を表示する様子を見せる。
  - コードの長さ: `scrollbar/scroll-by-page.gif`。`h3`・`p`（長い Lorem ipsum）・`li` 4つの塊1つを `wordWrap: 'on'` で折り返し、約5ページ分にする。スクロールバーの下側を約0.6秒おきに5回クリックする。長すぎると1回のクリックでスライダーがほとんど動かない。
- **関係ない表示を消す設定（ルール4）:**
  - `hover: { enabled: 'off' }`: `scroll-beyond-last-line_1.gif`・`_2.gif`、`smooth-scrolling_1.gif`・`_2.gif`、`mouse-wheel-zoom.gif`、`scroll-beyond-last-column_1.gif`・`_2.gif`、`scrollbar/horizontal_1.gif`、`scrollbar/vertical_1.gif`、`scrollbar/scroll-by-page.gif`、`scrollbar/always-consume-mouse-wheel_1.gif`・`_2.gif`、`minimap/enabled.gif`、`drag-and-drop.gif`、`cursor-surrounding-lines_1.gif`・`_2.gif`、`cursor-surrounding-lines-style_1.gif`・`_2.gif`、`render-line-highlight-only-when-focus_1.gif`・`_2.gif`
  - `quickSuggestions: false`、`suggestOnTriggerCharacters: false`: `multi-cursor-modifier.gif`
  - `minimap: { enabled: false }`: `scrollbar/scroll-by-page.gif`
  - マウスカーソルを描かず、マウスのアイコンだけを描く: `scrollbar/always-consume-mouse-wheel_1.gif`・`_2.gif`
- **配置（ルール1）:**
  - `minimap/show-slider_1.jpg`: `_2.gif` と同じく、プレビューの初期コードを6回繰り返し、エディタの右端から300pxと右のページ（`#f0f0f1`）20pxを320×280で切り抜く。
  - `scrollbar/horizontal_2.jpg`・`_3.jpg`: `_1.gif` と同じく、高さ199pxのエディタの下に白いページ（`#fff`）41pxを入れ、コード領域の左端から256×240で切り抜く。
  - `scrollbar/vertical_2.jpg`・`_3.jpg`: `_1.gif` と同じく、高さ199pxのエディタの上に白いページ（`#fff`）41pxを入れ、エディタの右端から256×240で切り抜く。
- **赤い矢印（ルール7）:** `render-line-highlight_1.jpg`・`_2.jpg` は、ハイライトされた2行目の行番号を下から上向きの矢印で指す。all と line の違いは行番号の部分のハイライトだけで、矢印がないとどこが違うのか分かりにくいため。
- **テーマ:** `render-line-highlight_1.jpg`〜`_3.jpg`、`render-whitespace_1.jpg`〜`_5.jpg` は Clouds（`theme: 'clouds'`）にする。元画像は Clouds で撮られており、Light では行のハイライトと空白記号が薄くて見えにくいため。`render-line-highlight_4.jpg`（ハイライトなし）は Light のまま。

### タイミングをそろえた GIF のグループ（ルール2）

- `auto-closing-brackets_1.gif`〜`_3.gif`、`auto-closing-quotes_1.gif`〜`_3.gif`（5.2秒）
- `auto-indent_1.gif`〜`_3.gif`（3.9秒）
- `auto-surround_1.gif`〜`_4.gif`（5.8秒）
- `cursor-blinking_1.gif`〜`_4.gif`（3秒）: 最初にエディタにフォーカスし直し、点滅が始まるまでの500msを捨てて（spec の `trimStart: 500`）、4枚の点滅の始まりをそろえる。点滅の周期は1秒。`_5.jpg` は静止画なので対象外。
- `cursor-smooth-caret-animation_1.gif`・`_2.gif`（6秒）: キャレットの80msの移動アニメーションを写すため、止まっている間も40msごとのコマにする。
- `cursor-surrounding-lines_1.gif`・`_2.gif`（約4.7秒）
- `cursor-surrounding-lines-style_1.gif`・`_2.gif`（6.8秒）: マウスの位置（下端・上端を交互に2回ずつ）もそろえる。
- `folding-strategy_1.gif`・`_2.gif`（6.2秒）
- `format-on-paste_1.gif`・`_2.gif`（4.7秒）
- `highlight-active-indent-guide_1.gif`・`_2.gif`（5.2秒）
- `line-numbers_3.gif`・`_4.gif`（5.6秒）
- `match-brackets_1.gif`〜`_3.gif`（4.8秒）: キャレットをタグの内側 → `<` の直後 → `<` の直前 → `<` の直後 → 内側の順に動かし、always・never・near の違いを見せる。
- `multi-cursor-paste_1.gif`・`_2.gif`（7秒）
- `quick-suggestions-delay_1.gif`・`_2.gif`（6秒）: 入力の時刻をそろえ、候補が表示されるまでの時間の違いを見せる。

### 撮影対象外

次の3枚はスクリプトでは撮れない。撮り直しや更新が必要なときは、ユーザーに手動での撮影を依頼する。

- `contextmenu_2.jpg`: 「Enable context menu」をオフにしたときの画像。エディタの上にブラウザ自体の右クリックメニューが表示されている。このメニューは OS が描くので、Playwright のスクリーンショットには写らない。
- `copy-with-syntax-highlighting_1.jpg`・`_2.jpg`: 「Copy with syntax highlighting」をオン（`_1`）・オフ（`_2`）にして、エディタからコピーしたコードを Word に貼り付けた画像。オンでは色付き、オフでは色なしで貼り付けられる。ブラウザの外の画面なので撮れない。

## 注意

- 撮影用の Chrome（プロファイル `C:\Temp\chbe-capture-profile`）は撮影の終了時に終了する。途中で止めて残った場合も、次の実行の開始時に終了する。ほかの Chrome は終了しない。
- 設定はページ上で上書きするだけで、保存はしない。設定画面の「Save settings」は押さない。
- 環境変数: `WP_BASE_URL`・`WP_USERNAME`・`WP_PASSWORD`（初期値 `http://localhost:8888`・`admin`・`password`）、`CAPTURE_BROWSER=chromium`（Playwright の Chromium で撮る。動作確認用で、文字の描画が変わるので差し替えには使わない）、`CAPTURE_WORK_DIR`、`WINDOWS_CURSORS_DIR`。
