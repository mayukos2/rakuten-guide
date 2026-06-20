# 移行メモ：楽天ガイド / 楽天マラソンLP

最終更新: 2026-06-19

このMacはレンタル品のため、7月末〜8月頃に新しいMacBook Airへ移行する前提で、このタスク関連の作業場所・再現手順・注意点をまとめる。

## 1. 本番として使うフォルダ

新Macへ引き継ぐ最重要フォルダはこれ。

```text
/Users/yy/Documents/project/rakuten-guide-live
```

GitHub repository:

```text
https://github.com/mayukos2/rakuten-guide.git
```

公開URL:

```text
https://mayukos2.github.io/rakuten-guide/
https://mayukos2.github.io/rakuten-guide/marathon-202606/
https://mayukos2.github.io/rakuten-guide/marathon-202606-stg/
```

運用ルール:

- `marathon-202606/` は本番ページ。フォロワーへ案内するURL。
- `marathon-202606-stg/` は改善用のステージングページ。商品カード追加やエントリー導線の改良は先にここで行う。
- stgで確認して問題なければ、本番 `marathon-202606/` に反映する。

## 2. このタスクで主に作業したファイル

```text
rakuten-guide-live/
  README.md
  MIGRATION.md
  index.html
  images/.gitkeep
  marathon-202606/
    index.html
    images/
      00-fv.jpg
      01-hero.svg
      02-benefits.svg
      03-marathon-flow.svg
      04-check-before-buy.svg
      05-daymap.svg
      06-products.svg
      07-divider.png
      08-diagnosis-watch.jpg
      09-diagnosis-review.jpg
      10-diagnosis-start.jpg
      11-diagnosis-marathon.jpg
      12-diagnosis-hardcore.jpg
  marathon-202606-stg/
    index.html
    images/
      本番と同じ画像一式
```

現在の主作業ページ:

```text
rakuten-guide-live/marathon-202606/index.html
```

## 3. 関連するが本番ではないフォルダ・ファイル

作業途中の試作・古い素材・比較用として残っている可能性があるもの。
新Mac移行時は「必要なら参照、基本は本番ではない」と扱う。

```text
/Users/yy/Documents/project/rakuten-guide-20260610
/Users/yy/Documents/project/rakuten-guide-marathon-202606
/Users/yy/Documents/project/canva_rakuten_marathon_post_script.csv
/Users/yy/Documents/project/tools/rakuten_affiliate_compare.py
/Users/yy/Documents/project/tools/rakuten_theme_research.py
/Users/yy/Documents/project/skills/rakuten-affiliate-product-candidates/SKILL.md
```

Downloads に残っていた関連ファイル:

```text
/Users/yy/Downloads/rakuten-guide/index.html
/Users/yy/Downloads/rakuten-guide/images/README.txt
/Users/yy/Downloads/rakuten-guide/codexに渡す指示.md
/Users/yy/Downloads/rakuten-guide 2/index.html
/Users/yy/Downloads/rakuten-guide 2/images/README.txt
/Users/yy/Downloads/rakuten-guide 2/codexに渡す指示.md
/Users/yy/Downloads/rakuten-guide.zip
/Users/yy/Downloads/rakuten-guide-upload-ready.zip
/Users/yy/Downloads/index.html
/Users/yy/Downloads/canva_rakuten_marathon_post_script.csv
```

現時点では勝手に移動・削除していない。新Mac移行前に、必要なものだけ `rakuten-guide-live/archive/` などへまとめるとよい。

## 4. Notion側の置き場

商品候補の本格DB:

```text
楽天アフィ商品候補DB（テスト）
https://app.notion.com/p/b0b2f7ad3f4f499b9c5bc3cfbbd370c2?pvs=1
```

スマホから商品URLだけ投げ込むページ:

```text
6月末マラソン｜商品URL投げ込み
https://app.notion.com/p/3840d6405a18816f82adc6bcb3d8f805
```

運用方針:

- スマホで見つけた楽天商品URLは、まず「商品URL投げ込み」ページへ貼る。
- 採用判断・カテゴリ分け・LP用の商品カード化は後から行う。
- 最終的にLPへ載せる時だけ、商品URLをアフィリエイトリンクへ差し替える。

## 5. 新Macで再現する手順

1. GitHubにログインする。
2. Gitを使える状態にする。
3. 作業フォルダを作る。

```bash
mkdir -p ~/Documents/project
cd ~/Documents/project
```

4. GitHubからcloneする。

```bash
git clone https://github.com/mayukos2/rakuten-guide.git rakuten-guide-live
cd rakuten-guide-live
```

5. ローカルでHTMLを確認する。

```bash
open marathon-202606/index.html
```

6. 修正後、GitHub Pagesへ反映する。

```bash
git status
git add marathon-202606/index.html
git commit -m "Update marathon page"
git push origin main
```

GitHub Pagesはpush後、反映まで少し時間がかかることがある。

## 6. 必要なアプリ・ライブラリ・コマンド

このLP自体は静的HTMLなので、ビルド環境は不要。

必要:

- Git
- GitHubアカウント
- ブラウザ
- Codex
- Notion（商品URL置き場として使用）

作業で使った主なコマンド:

```text
git
rg
curl
python3
```

外部ライブラリ:

- npm / node の依存なし
- Pythonパッケージの追加インストールなし
- Google Fonts をHTMLから読み込み

## 7. 秘密情報・.env

現時点で、このrepo内に `.env` はない。

```text
.env.example も不要
```

理由:

- APIキー、パスワード、トークンを使っていない。
- 楽天の短縮アフィリエイトリンクは公開ページに置く前提のリンクで、秘密情報ではない。

今後APIキーなどを使う場合のルール:

- コードに直接書かない。
- `.env` に入れる。
- `.env` はGitに入れない。
- 代わりに `.env.example` を作り、必要な項目名だけを書く。

例:

```text
RAKUTEN_APP_ID=
NOTION_TOKEN=
```

## 8. 絶対パスへの依存

公開HTML内の画像参照は、基本的に相対パス。

例:

```html
images/00-fv.jpg
images/07-divider.png
```

そのため、新Macでユーザー名や保存場所が変わっても、GitHub Pages上の表示には影響しない。

注意:

- この `MIGRATION.md` には現在のMac上の絶対パスを書いているが、これは移行メモ用。
- 公開ページの動作は `/Users/yy/...` に依存していない。

## 9. 未完了タスク

- 39ショップリンクはまだ未反映。
- 6月末マラソンの商品選定が未完了。
- 本番ページの商品カードは一旦非表示。stgページには改良用として商品カード枠を残している。
- stgページの商品カードはまだ仮の商品画像・価格・OFF率・クーポン表記。
- 商品URL投げ込みページから、LP掲載商品を選ぶ必要がある。
- 採用商品は最終的にアフィリエイトリンクへ差し替える。
- Downloadsに残っている古いHTML/zip/CSVを、移行前に整理する。

## 10. 注意点

- 公式未発表の楽天キャンペーン日程は、公開ページに断定で書かない。
- 価格・クーポン・在庫・ポイント条件は変わるため、投稿直前に確認する。
- PR表記はページ上部と商品リンク付近に残す。
- 商品画像を使う場合は、楽天商品ページやアフィリエイト利用ルールに沿って扱う。
- 新Mac移行後、GitHub Pagesへの反映は `main` ブランチへpushする。
