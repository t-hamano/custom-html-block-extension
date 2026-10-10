---
name: capture-help-images
description: 設定画面「Editor config」のヘルプ画像（assets/images/admin/editor-config）を撮り直す・追加するときに使う。Playwright で Windows の Chrome を操作し、元画像と同じサイズ・範囲・操作で撮影する。
---

# ヘルプ画像の撮影

`bin/capture-help-images/` のスクリプトで、設定画面のプレビューエディタを撮影する。

## 準備

1. `curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/wp-login.php` で wp-env が動いているか確認し、動いていなければ `npm run wp-env start` で起動する。
2. `php` と `python3`、Windows の Google Chrome（`/mnt/c/Program Files/Google/Chrome/Application/chrome.exe`）があることを確認する。

撮影は Windows の Chrome で行う。WSL の Chromium は文字幅を整数に丸めるため、元画像と文字の位置がずれる。Chrome への接続は、WSL から直接つながらないため PowerShell で中継している。

初回の実行時に、`artifacts/capture-help-images/` に Python の仮想環境（Pillow、NumPy）とカーソル画像（`C:\Windows\Cursors` から取り出す）が自動で用意される。

## 撮影

```sh
node bin/capture-help-images/run.mjs <画像のパスの一部> ...
```

- 例: `node bin/capture-help-images/run.mjs hover minimap/`
- 引数なしで全画像を撮る。1時間以上かかるので、バックグラウンドで実行する。
- 撮った画像は、元画像の隣に `{名前}_new.{拡張子}` で保存される。
- 出力に `WARN ... the crop goes outside the editor` が出た画像は、切り抜きがエディタの外にはみ出している。ページの背景を写す仕様（`allowOutside: true`）以外は、仕様を直す。

環境変数:

- `WP_BASE_URL`、`WP_USERNAME`、`WP_PASSWORD`: WordPress の URL とログイン情報（初期値は `http://localhost:8888`、`admin`、`password`）
- `CAPTURE_BROWSER=chromium`: Playwright の Chromium で撮る。仕様の動作確認用で、文字の描画が変わるので納品用には使わない。
- `CAPTURE_WORK_DIR`: 作業フォルダ（初期値は `artifacts/capture-help-images`）
- `WINDOWS_CURSORS_DIR`: カーソル画像の取り出し元（初期値は `/mnt/c/Windows/Cursors`）

## 確認と差し替え

元画像と並べた比較画像を作り、Read で見て確認する。

```sh
PY=artifacts/capture-help-images/venv/bin/python
# 静止画: 出力ファイル、倍率、画像の相対パス（複数可）
$PY bin/capture-help-images/py/pairs.py compare.png 1 editor-options/links_1.jpg
# GIF: 出力ファイル、画像の相対パス、倍率、何コマおきに並べるか（各コマの左が元、右が新）
$PY bin/capture-help-images/py/gifpairs.py compare.png editor-options/hover.gif 0.5 2
```

確認すること:

- 同じ行・文字が同じ位置に写っているか。
- GIF の操作（入力、クリック、スクロール）の内容とタイミングが元と同じか。
- 元画像にないもの（ホバー、意図しない選択範囲など）が写っていないか。

ユーザーが問題ないと判断したら、`_new` の画像を元のファイル名に置き換える。

## 撮影の決まり

- **エディタの設定:** プラグインの初期値（`classes/class-settings.php`）を使い、その画像が説明している設定だけを上書きする。
- **テーマ:** 元画像に合わせる。背景が暗ければ Visual Studio Dark、明るければ Light。
- **画質:** 元画像と同じピクセルサイズ。JPG は画質92・色の間引きなし（4:4:4）、GIF は64色・ディザなし。
- **コマの表示時間:** 元 GIF と同じにする。
- **撮影範囲:** 元画像で特定の行・文字が写っている位置に、同じ行・文字が来るように切り抜く。
- **マウス:** カーソルとクリック時の黄色い円をページ上に描く。スクリーンショットには OS のカーソルが写らないため。
- **ホイール:** `page.mouse.wheel()` を使う。1回50pxで、元 GIF の1ノッチと同じ。

### 例外

- **`cursor-surrounding-lines*` の4枚は、スティッキースクロールをオフにする。** プラグインの Monaco ではスティッキースクロールが初期値でオンになっている。オンのとき、Monaco は「Number of lines to keep before and after the cursor」の値に関係なく、カーソルの上下に5行以上の余白を取る。そのため0〜5のどの値でも動きが同じになり、設定の違いが画像に表れない。HTML ではスティッキースクロールの見出し行は表示されないので、オフにしてもほかの見た目は変わらない。プラグイン側でスティッキースクロールが無効になったら、この例外は不要になる。
- **スクロールやドラッグをする GIF（`specs/gif7.mjs` の全仕様）は、ホバーをオフにする。** これらの GIF ではマウスをコードの上に置いたまま操作するため、少し待つとタグや属性の説明のホバーが表示される。元 GIF には写っておらず、説明したい動き（スクロールやスクロールバーの表示など）を隠してしまう。

### 撮影対象外

次の3枚はスクリプトでは撮れないため、仕様もない。撮り直しや更新が必要なときは、ユーザーに手動での撮影を依頼する。

- `contextmenu_2.jpg`: 「Enable context menu」をオフにしたときの画像。エディタの上にブラウザ自体の右クリックメニューが表示されている。このメニューは OS が描くので、Playwright のスクリーンショットには写らない。
- `copy-with-syntax-highlighting_1.jpg`・`_2.jpg`: 「Copy with syntax highlighting」をオン（`_1`）・オフ（`_2`）にして、エディタからコピーしたコードを Word に貼り付けた画像。オンでは色付き、オフでは色なしで貼り付けられる。ブラウザの外の画面なので撮れない。

## 構成

- `run.mjs`: 実行用。`specs/` の全仕様を読み込み、引数で絞り込む。仕様の項目は冒頭のコメントにある。
- `specs/`: 画像ごとの撮影仕様（コード、設定、範囲、操作）。`static*.mjs` は静止画、`gif*.mjs` は GIF。
- `lib/cap.mjs`: エディタの配置、カーソルの描画、操作の再生と録画。
- `lib/wincdp.mjs`: Windows の Chrome をヘッドレスで起動し、WSL から接続する。
- `lib/defaults.php`: プラグインの初期設定を JSON で出力する。
- `data/tracks/`: 2021年の元 GIF から読み取った、コマの表示時間とマウスの位置。
- `data/arrows.json`: 元画像にある赤い矢印の位置と形。
- `py/`: 画像の書き出し、比較画像の作成、元画像の解析。

## 仕様を変える・追加するとき

- 既存の仕様の `value`（コード）、`options`、`anchor`（範囲）、`steps`（操作）などを変える。
- 新しい GIF を元画像から再現するときは、`py/track.py` でコマの表示時間とマウスの位置を読み取り、`data/tracks/` に置く。

  ```sh
  $PY bin/capture-help-images/py/track.py <GIF> artifacts/capture-help-images/cursors > bin/capture-help-images/data/tracks/<相対パスの / を _ にした名前>.json
  ```

- スクロールバーの矢印など、エディタを作るときにしか読まれない設定がある。その場合は仕様に `recreate: true` を付ける。

## 注意

- 撮影用の Chrome（プロファイル `C:\Temp\chbe-capture-profile`）は撮影の終了時に終了する。途中で止めて残った場合も、次の実行の開始時に終了する。ほかの Chrome は終了しない。
- 設定はページ上で上書きするだけで、保存はしない。設定画面の「Save settings」は押さない。
