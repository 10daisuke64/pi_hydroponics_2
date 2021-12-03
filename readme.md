# 水耕栽培キット 追加機能

## 制作の背景
- 先週の課題のブラッシュアップをしようと考えた.
- 前期が終了ということで,ここまで学習した配列やLocalStorage,Firebaseをフル活用したものを作ろうと考えた.

## 追加機能の内容
- OpenWeatherNewsのAPIを利用し,「今日の天気」と「向こう5日間の3時間毎の天気」の2種類を取得し表示させた.
- Muuri.jsを使用し,各ウィジェットの並び順を変更できるようにした.
- また,この並び順をLocalStorageに保存して,再読み込み時に復元できるようにした.

## 苦戦した点
- OpenWeatherNewsの2種類のAPIを使用するため,XMLHttpRequestを2回行う必要があったが,何も考えずにやると片方のAPIしか取得できないバグが発生した.調べて解決.
- 特に5日間の天気については,JSONの構造が複雑でデータ量も多かったので,時系列のテーブルとして出力するのが大変だった.取得したJSONから,目的のデータだけを抽出し,使いやすい形（連想配列）に変換するのに苦労した.ちなみにこのテーブルはYahoo!天気のテーブルを参考にした.
- 本当は各ウィジェットの表示/非表示もできるようにしたかったが,いろんなプラグインに依存しているので（例えばグラフの再描画など）,実装方法を検討する時間がなかった.