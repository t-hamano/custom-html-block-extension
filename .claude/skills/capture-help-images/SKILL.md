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
- `size: [ width, height ]`: 今の画像と違うサイズで撮る（ルール1でほかの画像にそろえるときなど）。
- `value`: エディタのコード。省略すると、設定画面のプレビューの初期コード（`PREVIEW_CODE`）。
- `theme`: `'vs-dark'`（初期値）、`'light'`、または `src/lib/themes` のテーマのファイル名（`'clouds'`、`'chrome-devtools'` など）。
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
- `wheelIcon: true`: `cursor: true` と一緒に使い、マウスカーソルの代わりにマウスのアイコンを描く。ホイールを回している間、アイコンのホイールが光り、回した向きの矢印が出る。
- `trimStart`: GIF の先頭の指定した ms を捨てる。
- `recreate: true`: エディタを作り直す。スクロールバーの矢印など、作るときにしか読まれない設定に使う。
- `allowOutside: true`: エディタの外（ページの背景）も切り抜く。

`ctx` の主な項目: `page`、`EX`・`EY`（エディタの位置）、`clip`、`pos( line, column )`（文字の左上のページ座標）、`map( x, y )`、`track()`（今の GIF の解析結果）、`editorEval( fn, arg )`（`fn( monaco, editor, arg )` をページで実行）、`css( text )`。

### ヘルパー

- **操作**（`steps` の `action` や `setup` で `( page )` を渡して使う）: `focus( line, column )`、`select( l1, c1, l2, c2 )`、`addCursor( line, column )`、`type( text )`、`press( key )`、`wheel( notches, horizontal )`、`clickAt( where )`、`setSettingValue( value, patch )`
- **位置**（`clickAt` に渡す）: `foldingControl( line )`、`afterLineEnd( line, gap )`
- **ステップ**: `plan( items, { frame, holdFrame } )`（操作の時刻を直接決める。並べて表示する GIF に使う。ルール2）、`timeline( ctx, actions )`（今の GIF のコマの表示時間に、コマ番号ごとの操作を付ける）、`mouseSteps( ctx, { map, down, actions } )`（今の GIF のマウスの動きを再生する）、`cropMap( ctx, dx, dy )`（切り抜きからの相対座標を変換する）
- **準備・切り抜き**: `scrollToLine`、`resize`、`rectOf`、`layoutInfo`、`editorWidth`、`alignRightWidget`（右端に付くウィジェットの位置を合わせる）、`fitRight`・`rightClip`（エディタの右端で切り抜く）、`backdrop`（ページの背景）、`placeSettingControl`（設定のコントロールをエディタの上に置く）、`inScrollablePage`（ページのスクロールを再現する）
- **注釈**: `arrows( ctx, { fixedX, fixedY } )`（今の画像の赤い矢印を測って描き直す）
- **その他**: `PREVIEW_CODE`、`IMG`、`WORK`

## 撮影の決まり

### 基本

- **エディタの設定:** プラグインの初期値（`classes/class-settings.php`）を使い、その画像が説明している設定だけを上書きする。ただし、下の「見やすくするためのルール」に当てはまる場合は、ほかの設定も変える。
- **テーマ:** 今の画像に合わせる。背景が暗ければ Visual Studio Dark、明るければ Light。見せたい色が見えにくい場合はルール9に従う。
- **画像サイズ:** 今の画像と同じにする（ルール1でそろえた画像は、そのサイズ）。
- **画質:** JPG は画質92・色の間引きなし（4:4:4）、GIF は64色・ディザなしで、黒と白を必ずパレットに含める（白い背景の上で反転するマウスの I ビームが、GIF ごとに別の色にならないように）。
- **GIF の長さ:** 今の GIF の長さを目安にする。並べて表示する GIF はルール2に従う。
- **撮影範囲:** 今の画像で特定の行・文字が写っている位置に、同じ行・文字が来るように切り抜く。
- **マウス:** カーソルとクリック時の黄色い円をページ上に描く。スクリーンショットには OS のカーソルが写らないため。ホイールは `wheel()` を使い（1回50px）、ルール10に従ってマウスのアイコンを描く。

### 見やすくするためのルール

1. **同じ設定の画像は、写す条件をそろえる。** ヘルプでは同じ設定の画像が並べて表示されるので、画像サイズ・コード・エディタの大きさ・切り抜く位置をそろえ、違いは説明する設定の値だけにする。片方にだけページの余白が写る場合は、もう片方にも同じ余白を入れる。
2. **同じ操作の GIF は、フレーム単位でそろえる。** 並べた GIF はそれぞれ独立してループするので、全体の長さや操作の時刻が違うと、ループのたびにずれていく。グループ内の全画像で同じ操作を同じ時刻に行い、全体の長さもそろえる。今の GIF のコマを読み取る `timeline()` は使わず、`plan()` などで操作の時刻を直接決める。マウスの移動は、各コマの始めに決まった位置へ動かし、撮るたびに位置がぶれないようにする。説明に関係ない動き（キャレットの点滅、折りたたみ矢印やスクロールバーのフェード）が一部の画像にだけ出ると、コマの区切りが変わるので止める（ルール4）。点滅のように周期のある動きは、長さを周期の倍数にして、ループのつなぎ目もずれないようにする。点滅の始まりもそろえる（フォーカスし直し、点滅が始まるまでを `trimStart` で捨てる）。設定によって操作の回数が違う場合（例: タブストップの有無で、同じ幅を選ぶのに必要なキーの回数が違う）は、操作の時刻ではなく結果の見た目をそろえる。片方で1回押す時刻から、もう片方は短い間隔で必要な回数だけ押す。
3. **初期値のままでは違いが見えない設定は、関係する設定やコードを一時的に変える。** 例: スティッキースクロールのオフ、折りたたみ矢印の常時表示、コードの長さの調整（値ごとに違いが出る長さにする）、空白の表示。静止画では違いが出ない場合は GIF にする（例: 表示領域の幅を変えて、折り返しの違いを見せる）。
4. **説明に関係ない表示は消す。** 例: マウスを止めて操作する GIF のホバー、入力中の候補、スクロールバーの動きを隠すミニマップ、意味のないマウスカーソル、見せたい部分に重なる行のハイライト。
5. **小さくて読めない要素は、元画像と同じくらいの大きさにする。** 例: フォントサイズ、ミニマップの倍率、スクロールバーの幅。ミニマップの文字の描き方のように、その要素自体を見せる画像では、さらに大きくしてよい。
6. **マウスは縦か横に直線で動かし、対象の上で止める。** 元画像の軌跡は再現しない。行き過ぎないようにする。
7. **赤い矢印は、指す対象の位置から決める。** 元画像と同じ座標ではなく、スクロールバーの矢印や行番号など、指す対象の中心を指す。違いが小さくて見つけにくい場合（例: 行番号のハイライトの有無だけが違う）は、元画像になくても矢印を足し、同じ設定の画像すべての同じ位置に入れる。
8. **ループの最後まで意味のある表示にする。** 例: スクロールしすぎて何もない領域を写さない。
9. **見せたい色が背景に埋もれる場合は、テーマを変える。** 今の画像のテーマで行のハイライトや空白記号などが見えにくい場合は、プラグインのテーマ（`src/lib/themes`）から見やすいものを選ぶ。例: 行のハイライトを薄い枠線ではなく塗りで表示するテーマ（Clouds、Chrome DevTools）、選択範囲の上でも空白記号が見えるテーマ（Chrome DevTools）。
10. **ホイールの操作は、マウスのアイコンで見せる。** マウスカーソルの代わりに、ホイールを回している間だけ光り、回した向きの矢印が出るマウスのアイコンを描く（`wheelIcon: true`）。
11. **短いアニメーションは、短いコマで写す。** スムーズスクロールやキャレットの移動のような100ms以下の動きは、止まっている間も40〜50msごとのコマにする（`plan()` の `holdFrame`）。

### 撮影対象外

次の3枚はスクリプトでは撮れない。撮り直しや更新が必要なときは、ユーザーに手動での撮影を依頼する。

- `contextmenu_2.jpg`: 「Enable context menu」をオフにしたときの画像。エディタの上にブラウザ自体の右クリックメニューが表示されている。このメニューは OS が描くので、Playwright のスクリーンショットには写らない。
- `copy-with-syntax-highlighting_1.jpg`・`_2.jpg`: 「Copy with syntax highlighting」をオン（`_1`）・オフ（`_2`）にして、エディタからコピーしたコードを Word に貼り付けた画像。オンでは色付き、オフでは色なしで貼り付けられる。ブラウザの外の画面なので撮れない。

## 注意

- 撮影用の Chrome（プロファイル `C:\Temp\chbe-capture-profile`）は撮影の終了時に終了する。途中で止めて残った場合も、次の実行の開始時に終了する。ほかの Chrome は終了しない。
- 設定はページ上で上書きするだけで、保存はしない。設定画面の「Save settings」は押さない。
- 環境変数: `WP_BASE_URL`・`WP_USERNAME`・`WP_PASSWORD`（初期値 `http://localhost:8888`・`admin`・`password`）、`CAPTURE_BROWSER=chromium`（Playwright の Chromium で撮る。動作確認用で、文字の描画が変わるので差し替えには使わない）、`CAPTURE_WORK_DIR`、`WINDOWS_CURSORS_DIR`。
