# What's Cooking with Atlas Search

## レストラン検索アプリケーションのデモ MongoDB Atlas Search

こんにちは！ 👋 このアプリケーションでは、レストラン名をはじめ、料理名、地理座標、料理の種類、平均評価、エリアなど、さまざまな検索パラメータやデータタイプに基づいて、英語、タイ語、インドネシア語、日本語でレストランを高速に検索することができます。

- レストラン名
- 料理名
- 地理座標
- 料理の種類
- 平均スター評価
- エリア

![レストラン検索デモ](restaurantDemo.gif)

**注意1：このデータセットはモックデータです。実際の飲食店選びにはご利用にならないでください。**

**注意2：このデモは、[What's Cooking repos](https://github.com/mongodb-developer/WhatsCooking/)の多言語版です。**

What's Cooking では、オートコンプリートからカスタム関数スコアリングまで、Atlas Search のさまざまな機能を実装しています。MongoDB の集計パイプラインで $search オペレーターを使用することで、テキスト、数値、地理空間データを横断した詳細な検索を構築することができます。What's Cooking を構築することで、MongoDB が Atlas のデータに対してどのように複雑で詳細な全文検索を構築できるかを学習することができます。

**追加のサーバーやソフトウェアは必要ありません。データの同期を維持する必要もありません。すべてが MongoDB Atlas で行われます。**

- ファジーマッチング
- ハイライト表示
- オートコンプリート
- 範囲クエリ
- ジオクエリ
- ファセット
- 関連性スコアリング
- カスタム関数スコアリング
- 同義語

[デモの解説ビデオ](https://www.youtube.com/watch?v=s2kXYZRE7pA&t=512s)をチェックして、すべての機能のデモをご覧ください。または、以下のリンクから、MongoDB Atlas で完全にホストされている完成したアプリケーションを試してみてください。

## [whatscooking.mongosa.net](https://whatscooking.mongosa.net/)

このアプリケーションは MongoDB Atlas で完全にホストされており、以下のツールを使用して作成されています。

- React
- Tailwind CSS
- MongoDB Realm (バックエンドの HTTPS エンドポイントと関数)
- MongoDB の Atlas sample_restaurants データセットを修正したサンプルデータセット

![アーキテクチャ](WhatsCookingArchitecture.png)

**現在、このアプリはモバイルには対応していませんが、PR をお送りください。** 😊

## 前提条件

- MongoDB Atlas アカウント。[こちら](https://www.mongodb.com/cloud/atlas)から無料で入手できます。
- Node.js バージョン 16 と npm。
- レストランサンプルデータセット。
- 同義語データセット。
- (推奨) [MongoDB Compass - GUI](https://www.mongodb.com/try/download/compass)

以下の URI を使用して、MongoDB Shell、任意の MongoDB ドライバー、または MongoDB Compass を使用してデータセットを読み込んでダウンロードすることができます。

```
mongodb+srv://mongodb:atlassearch@whatscooking.8u6sklg.mongodb.net/whatscooking
```

このリポジトリの [data](https://github.com/mongodb-developer/whatscooking-multilingual/tree/main/data) ディレクトリと [indexes](https://github.com/mongodb-developer/whatscooking-multilingual/tree/main/indexes) ディレクトリにも含まれています。

---

## このアプリケーションを構築するには...

## データの準備

### 1. Atlas クラスタにデータをロードする

- データベース: `whatscooking`
- コレクション: `restaurants_[ロケール] (例: restaurants_en)`、`menu_synonyms_[ロケール] (例: menu_synonyms_en)`

### 2. サーチインデックスを作成する

(インデックス定義は `indexes` ディレクトリに含まれています)。

- デフォルト
- オートコンプリート
- facetIndex

## HTTPS エンドポイントを独自の環境にデプロイする

### 1. アプリケーションを作成する

Atlas UI で、「新しいアプリを作成」をクリックします。

アプリケーションに任意の名前を付けます。

正しいクラスターにリンクされていることを確認したら、「アプリケーション サービスを作成」ボタンをクリックします。

### 2. HTTPS エンドポイントを作成する

左側のナビゲーションバーで「HTTPS エンドポイント」に移動し、「エンドポイントを追加」をクリックします。

以下の 3 つの HTTP エンドポイントを作成します。

| ルート | 関数ソースコード | HTTP メソッド | 結果を返す | 戻り値の型 |
| --- | --- | --- | --- | --- |
| /restaurants/getRestaurantsAutocomplete | appservice/functions/getRestaurantsAutocomplete.js | GET | 有効 | JSON |
| /getRestaurants | appservice/functions/getRestaurants.js | POST | 有効 | JSON |
| /restaurants/getFacets | appservice/functions/getFacets.js | POST | 有効 | JSON |
| /synonyms/getFoodSynonyms | appservice/functions/getFoodSynonyms.js | POST | 有効 | JSON |

他のオプションはすべてデフォルト値のままにし、「ドラフトを保存」をクリックします。

### 3. 関数の設定

左側のナビゲーションバーで「関数」に移動します。

作成した各関数で、「設定」タブに移動し、「認証」で「システム」を選択し、「ドラフトを保存」をクリックします。

### 4. アプリをデプロイする

上部にある「ドラフトを確認してデプロイ」をクリックします。

## HTTPS エンドポイントのテスト

以下のコマンドで各 HTTPS エンドポイントをテストすることができます。

### /restaurants/getRestaurantsAutocomplete

コマンド:

```
$curl https://ap-southeast-1.aws.data.mongodb-api.com/app/application-1-rgjfz/endpoint/restaurants/getRestaurantsAutocomplete?restname="burger"&locale=en
```

レスポンス:

```
[{"_id":"6095a34a7c34416a90d3212d","name":"Burger King","restaurant_id":"40370238"},{"_id":"6095a34a7c34416a90d
```

### /getRestaurants

コマンド:

```
curl \
-H "Content-Type: application/json" \
-d '{"searchTerm": "burger ", "food": "", "operator": "text", "dist": 1, "stars": 1, "cuisine": [], "locale": "en"}' \
https://ap-southeast-1.aws.data.mongodb-api.com/app/application-1-rgjfz/endpoint/getRestaurants
```

レスポンス:

```
{"aggString":"[{\"$search\":{\"text\":{\"query\":\"burger \",\"path\":\"name\",\"fuzzy\":{\"maxEdits\":2}}}},{\"$limit\":21},{\"$project\":{\"name\":1,\"cuisine\":1,\"borough\":1,\"location\":1,\"menu\":1,\"restaurant_id\":1,\"address.street\":1,\"stars\":1,\"review_count\":1,\"PriceRange\":1,\"sponsored\":1,\"score\":{\"$meta\":\"searchScore\"},\"highlights\":{\"$meta\":\"searchHighlights\"}}}]","restaurants":[{"_id":"6095a4864ba3a04a69a79eba","address":{"street":"Pearl Street"},"borough":"Manhattan","cuisine":"Hamburgers","name":"Burger Burger","restaurant_id":"41316784","location":{"type":"Point","coordinates":[-74.0105051,40.7040805]},"stars":3.5,"review_count":159,"menu":["Bacon burger","Santa Fe burger","Ahi Tuna burger","Cheeseburger","Loaded Fries","Mushroom swiss burger","Hickory burger","Classic burger","Fajita burger","Oldtimer with cheese","French Fries","Vegetarian burger"],"PriceRange":2,"score":3.3074374198913574},{"_id":"6095a34a7c34416a90d3212d","address":{"street":"Northern Boulevard"},"borough":"Queens","cuisine":"Hamburgers","name":"Burger King","restaurant_id":"40370238","location":{"type":"Point","coordinates":[-73.89707140000002,40.7543896]},"stars":3,"review_count":38,"menu":["Cheeseburger","Ahi Tuna burger","Chili Cheeseburger","Buffalo Fries","Vegetarian burger","Loaded Fries","French Fries","Classic burger","Triple layer burger","Oldtimer with cheese","Hickory burger","Oldtimer"],"PriceRange":2,"score":2.49027419090271}, ...}
```

### /restaurants/getFacets

コマンド:

```
curl \
-H "Content-Type: application/json" \
-d '{"searchTerm": "burger", "food": "", "operator": "text", "dist": 1, "stars": 1, "cuisine": [], "locale": "en"}' \
https://ap-southeast-1.aws.data.mongodb-api.com/app/application-1-rgjfz/endpoint/restaurants/getFacets
```

レスポンス:

```
{"results":[{"count":{"lowerBound":183},"facet":{"cuisineFacet":{"buckets":[{"_id":"Hamburgers","count":105},{"_id":"American","count":69},{"_id":"Other","count":3},{"_id":"Jewish/Kosher","count":2},{"_id":"Pizza/Italian","count":2},{"_id":"Latin (Cuban, Dominican, Puerto Rican, South \u0026 Central American)","count":1},{"_id":"Mexican","count":1}]},"boroughFacet":{"buckets":[{"_id":"Manhattan","count":69},{"_id":"Brooklyn","count":47},{"_
```

### /synonyms/getFoodSynonyms

コマンド:

```
$curl https://ap-southeast-1.aws.data.mongodb-api.com/app/application-1-rgjfz/endpoint/synonyms/getFoodSynonyms?locale=en
```

レスポンス:

```
{"foodSynonyms":[{"_id":"6268a01b5899f60be615cb66","input":["noodles"],"mappingType":"explicit","synonyms":["lo mein","chow mein","pasta","udon","ramen","spaghetti","alphabetti","macaroni","pasta"],"date_inserted":"2022-04-27T01:44:59.057Z","editable":false}],"ok":true}
```

## このアプリケーションを実行するには...

1. リポジトリをクローンします。
2. `whatsCooking-multilingual` ディレクトリに移動します。
3. `npm install` を実行します。
4. `src/hooks/useHomeFetch.js` 内の HTTPS エンドポイント URL を独自の URL に変更します。
5. `src/compenents/SearchBar.js` 内の HTTPS エンドポイント URL を独自の URL に変更します。
6. `src/pages/IndexPage.js` 内の MongoDB 接続文字列を独自の接続文字列に変更します。
7. `npm start` を実行します。

## フロントエンドを AWS S3 にデプロイするには...

1. Node.js v16 を使用してアーティファクトを正常にビルドできるようにします。Node.js のバージョンを管理するために [nvm](https://github.com/nvm-sh/nvm) を使用している場合は、`nvm use` を入力して正しい Node.js バージョンに切り替えます。
2. 環境変数に AWS の一時的な資格情報を入力し、正しい AWS アカウントを指していることを確認します。
3. `./deploy_to_s3.sh` を実行します。
4. S3 バケットは CloudFront でホストされるため、キャッシュが更新されるまでに時間がかかる場合があります。[手動でキャッシュを無効にする](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)場合は、スクリプトを実行するときに指示に従ってください。

---

## React コンポーネント...

![メイン](Main.png)

## サーバーレス バックエンドとして Realm を使用する...

What's Cooking では、レストラン データを HTTP 経由でクエリするために、Realm の HTTPS サービスを 5 つの API として使用しています。

- `GetRestaurantsEndPoint` は `useHomeFetch.js` フックから呼び出されます。
- `GetFacetsEndpoint` は `useHomeFetch.js` フックから呼び出されます。
- `Suggestions_AC_Endpoint` は `SearchBar.js` コンポーネントから呼び出されます。
- `getSynonyms` は `SynonymsPage.js` で呼び出されます。

![レストラン関数](RestaurantsFunction.png)

---

![ファセット関数](FacetFunction.png)

---

![オートコンプリート関数](ACFunction.png)

---

![同義語関数](SynonymsFunction.png)

---

このリポジトリについてご質問やフィードバックがありましたら、お気軽にこのリポジトリに Issue や PR を作成してください。

また、[MongoDB Community](https://developer.mongodb.com/community/forums/) に参加して、製品やエンジニアリング チームと交流したり、数千人の MongoDB や Realm ユーザーと交流したりしてください。

楽しみながらコーディングしてください！
