# getDataFromSmashgg
Smash.ggから配信台の試合情報を取得するGAS  
vMixで読み込んでスコアボードに表示したりする目的で作成  

# 用意するシート
- sources ...出力用
- variables ...変数入力用

# 使い方
## 1. variablesシートに入力
1. A2にトーナメントURLを入力
2. B2に配信先名を入力
3. C2にトークンを入力

## 2. GASのトリガーを設定
1. トリガーを1分おきとかに設定

## 3. smashggで設定
1. 配信先を設定
2. 配信台に送る試合のstationに配信先をアサイン

## 4. sourcesが更新される
A2:G2が更新されていれば成功。  
取得する情報は、「配信台に設定された試合群のうち、指定した配信先を配信先とする試合の中で最も早くアサインされた試合」の
- fullRoundText: ラウンド表記。勝者側決勝とか
- prefix: プレフィックス。スポンサー名とか
- gamerTag: 名前。
- twitter: ツイッターID  
※それぞれ2名分

# 参考
https://developer.smash.gg/
